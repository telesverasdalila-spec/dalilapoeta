#!/usr/bin/env python3
# Task 75 — verificação verbatim das 9 crônicas do legado
# (cronicasdalilatelesveras.htm → cronicas1..9.htm) contra as fichas
# em src/app/texto/[id]/{slug}/dados.json.
#
# Critério (receita das Tasks 62/72): cada parágrafo de CORPO do legado
# deve estar contido no texto da ficha (normalizado NFD + minúsculas +
# espaços colapsados) e cada parágrafo da ficha deve existir no legado.
# Chrome do legado (cabeçalho "DAlila Teles Veras", link "Crônicas",
# título com capitular, rodapé índice/Poesia/Cronologia/Fotografias e
# parágrafos &nbsp;) é desconsiderado.

import html
import json
import re
import sys
import unicodedata
import difflib
from pathlib import Path

BASE = Path("/home/z/my-project")
RAW = BASE / "scripts" / "legado" / "raw"
FICHAS = BASE / "src" / "app" / "texto" / "[id]"

# ordem do índice do legado: número do arquivo → slug da ficha
MAPA = [
    (1, "cronica-de-outono", "Crônica de Outono"),
    (2, "a-cidade-do-meu-desejo", "A Cidade do Meu Desejo"),
    (3, "o-direito-ao-silencio", "O Direito ao Silêncio"),
    (4, "bibliocasa", "Bibliocasa"),
    (5, "anotacoes-de-leituras-i", "Anotações de Leituras I"),
    (6, "anotacoes-de-leituras-ii", "Anotações de Leituras II"),
    (7, "anotacoes-de-leituras-iii", "Anotações de Leituras III"),
    (8, "anotacoes-de-leituras-iv", "Anotações de Leituras IV"),
    (9, "a-lingua-a-patria-possivel", "A Língua, a Pátria Possível"),
]


def normalizar(s: str) -> str:
    """NFD + minúsculas + espaços colapsados (sem acentos/pontuação especial)."""
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.replace("\xa0", " ").replace("\r", " ").replace("\n", " ")
    s = re.sub(r"\s+", " ", s).strip().lower()
    return s


def paragrafos_html(html_str: str):
    # pares <p>...</p> fechados
    segs = []
    consumidos = []
    for m in re.finditer(r"<p[^>]*>[\s\S]*?</p>", html_str):
        segs.append(m.group(0))
        consumidos.append((m.start(), m.end()))
    # <p> ABERTOS no legado (sem </p> — ex.: cronicas4/5 terminam em </td>):
    # do fim da tag até o próximo <p> ou </td>/<table
    for m in re.finditer(r"<p[^>]*>", html_str):
        if any(a <= m.start() < b for a, b in consumidos):
            continue
        resto = html_str[m.end():]
        corte = re.search(r"<p[^>]*>|</td>|<table", resto, re.I)
        fim = m.end() + (corte.start() if corte else len(resto))
        trecho = html_str[m.end():fim]
        if re.sub(r"<[^>]+>", "", trecho).strip():
            segs.append(trecho)
    return segs


def texto_paragrafo(p: str) -> str:
    plain = re.sub(r"<[^>]+>", "", p)
    plain = html.unescape(plain)  # receita Task 62: unescape antes do colapso
    plain = plain.replace("\xa0", " ")
    return re.sub(r"\s+", " ", plain).strip()


def eh_chrome(norm: str, titulo_norm: str) -> bool:
    if not norm or norm in {"&nbsp;", "nbsp"}:
        return True
    if "dalila teles veras" in norm:            # cabeçalho
        return True
    if norm == "cronicas":                      # link de volta "Crônicas"
        return True
    if "indice" in norm and "cronologia" in norm:   # rodapé
        return True
    if "cronicas /" in norm or "/ cronologia" in norm:
        return True
    # parágrafo-título (link "Crônicas" + título na mesma célula, ou capitular)
    if titulo_norm and titulo_norm in norm and ("cronicas" in norm or norm.replace(" ", "") == titulo_norm.replace(" ", "")):
        return True
    return False


falhas = 0
print("=" * 78)
for num, slug, titulo in MAPA:
    leg_raw = (RAW / f"cronicas{num}.htm").read_bytes().decode("cp1252")
    ficha_path = FICHAS / slug / "dados.json"
    d = json.loads(ficha_path.read_text(encoding="utf-8"))
    txt_ficha = d.get("texto", "")

    titulo_norm = normalizar(titulo)

    # legado: parágrafos de corpo (ex-chrome)
    corpo_legado = []
    for p in paragrafos_html(leg_raw):
        t = texto_paragrafo(p)
        n = normalizar(t)
        if eh_chrome(n, titulo_norm):
            continue
        corpo_legado.append(n)
    legado_junto = " § ".join(corpo_legado)

    # ficha: parágrafos
    corpo_ficha = [normalizar(texto_paragrafo(p)) for p in paragrafos_html(txt_ficha)]
    ficha_junto = " § ".join(x for x in corpo_ficha if x)

    problemas = []

    # 1. todo parágrafo de corpo do legado está na ficha?
    for n in corpo_legado:
        if n not in ficha_junto:
            problemas.append(f"FALTA na ficha: {n[:80]!r}")

    # 2. todo parágrafo da ficha existe no legado?
    for n in corpo_ficha:
        if not n:
            continue
        if n not in legado_junto:
            problemas.append(f"SEM correspondência no legado: {n[:80]!r}")

    # 3. metadados coerentes
    if d.get("tipo") != "cronica":
        problemas.append(f"tipo={d.get('tipo')!r} (esperado 'cronica')")
    if normalizar(d.get("titulo", "")) != titulo_norm:
        problemas.append(f"titulo={d.get('titulo')!r} (esperado {titulo!r})")
    if "fonte_original" in d:
        problemas.append("fonte_original presente (Task 74 mandou remover)")
    if "dalila.telesveras.nom.br" in json.dumps(d, ensure_ascii=False):
        problemas.append("URL do site legado presente no dados.json")

    status = "OK " if not problemas else "ERRO"
    n_leg = len([c for c in corpo_legado if c])
    n_fic = len([c for c in corpo_ficha if c])
    print(f"[{status}] cronicas{num}.htm -> /texto/{slug}  (legado {n_leg} p, ficha {n_fic} p)")
    for pr in problemas:
        print(f"       - {pr}")
        falhas += 1
        # diff detalhado do parágrafo problemático (só pares texto)
        if pr.startswith(("FALTA na ficha:", "SEM correspond")):
            alvo = pr.split(": ", 1)[1].strip("'")
            ref = corpo_ficha if pr.startswith("SEM") else corpo_legado
            melhor = min(ref, key=lambda c: difflib.SequenceMatcher(None, alvo, c).ratio(), default=None)
            if melhor:
                razao = difflib.SequenceMatcher(None, alvo, melhor).ratio()
                if razao > 0.7:
                    sm = difflib.SequenceMatcher(None, alvo, melhor)
                    tags = [t for t in sm.get_opcodes() if t[0] != "equal"]
                    for op, i1, i2, j1, j2 in tags[:8]:
                        print(f"       . {op}: legado={alvo[i1:i2]!r} ficha={melhor[j1:j2]!r}")

print("=" * 78)
if falhas:
    print(f"TOTAL: {falhas} problema(s)")
    sys.exit(1)
print("TOTAL: 9/9 crônicas verbatim (conteúdo do legado integralmente na ficha)")
