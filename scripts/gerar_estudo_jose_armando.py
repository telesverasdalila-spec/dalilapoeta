# -*- coding: utf-8 -*-
"""
Task 72 — Ficha "Estudo Crítico" a partir do legado:
  http://www.dalila.telesveras.nom.br/Texto%20de%20Jos%C3%A9%20Pereira%20da%20Silva.htm
  (<title> do legado: "José Armando Pereira da Silva sobre Dalila Teles Veras", 2002)

Receitas herdadas da Task 62 (reconstrução):
  - decode CP1252 DIRETO do arquivo original (zero C1 no resultado)
  - html.unescape ANTES do colapso de espaços (&nbsp; vira espaço comum)
  - soft wraps -> espaço único; parágrafos = blocos <p>
  - cabeçalhos removidos por igualdade normalizada (título do texto)
  - itálicos semânticos (títulos de livros) re-aplicados por substituição
    exata e contada; assinatura final em <i> (padrão das fichas irmãs)
Saída: src/app/texto/[id]/jose-armando-pereira-da-silva-sobre-dalila-teles-veras/dados.json
"""
import html as htmlmod
import json
import re
import sys
import unicodedata
from pathlib import Path

RAIZ = Path("/home/z/my-project")
HTML_BRUTO = RAIZ / "scripts" / "legado_estudo_jose_armando" / "Texto de José Pereira da Silva.htm"
SAIDA = RAIZ / "src" / "app" / "texto" / "[id]" / "jose-armando-pereira-da-silva-sobre-dalila-teles-veras" / "dados.json"

TITULO = "Dalila Teles Veras"                       # título real do texto (cinza, 1º p do corpo)
SUBTITULO = "Texto de José Armando Pereira da Silva"
ANO = 2002                                          # assinatura: "José Armando Pereira da Silva / 2002"
URL_LEGADO = ("http://www.dalila.telesveras.nom.br/"
              "Texto%20de%20Jos%C3%A9%20Pereira%20da%20Silva.htm")
SLUG = "jose-armando-pereira-da-silva-sobre-dalila-teles-veras"

# Itálicos semânticos do legado (títulos de livros), todos únicos no corpo:
ITALICOS = [
    "Lições do Tempo",
    "Inventário Precoce",
    "A Palavraparte",
    "A Vida Crônica",
    "As Artes do Ofício",
]

ASSINATURA = "José Armando Pereira da Silva / 2002"

# Guardas de ancoragem (prefixo, sufixo) por parágrafo, na ordem do legado:
ANCORAS = [
    ("O que nos chegou da Ilha da Madeira naquele dia de 1957",
     "paciência e tradição apuram os melhores teores."),
    ("É para dizer que aquela menina chamada Dalila",
     "fazendo da língua sua vinha e da poesia o seu produto."),
    ("Quando em 1972 aportou em Santo André",
     'Somos todos cidadãos do mundo e um homem de sua aldeia".'),
    ("E dessa enorme aldeia, formada por Santo André",
     "de registrá-los em revistas."),
    ("Sua poesia se aprimorou, se expandiu",
     "independência para a crítica ou elogio."),
    ("Dalila não é daquelas pessoas à espera das benesses públicas.",
     "a criação de grupos ou pessoas."),
    ("A Alpharrabio Livraria Espaço-Cultura e a Alpharrabio",
     "os diversos tipos de manifestações."),
    ("A Alpharrabio Edições vai crescendo, dedicada primordialmente",
     "um balanço do final do milênio."),
    ("Temos finalmente a revista Abecês",
     "o básico gosto pela leitura."),
    ("É claro que Dalila teve companheiros nessa jornada.",
     "um vinho de tal qualidade. Da Madeira."),
]


def normalizar(s: str) -> str:
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", s).strip().lower()


def limpar_fragmento(bruto: str) -> str:
    """Receita Task 62: unescape ANTES do colapso; mantém apenas texto."""
    sem_tags = re.sub(r"<[^>]+>", "", bruto)
    txt = htmlmod.unescape(sem_tags)
    txt = txt.replace("\xa0", " ")
    txt = re.sub(r"\s+", " ", txt).strip()
    return txt


def main() -> int:
    bruto = HTML_BRUTO.read_bytes()
    # Decode CP1252 direto (lição Task 62: nunca latin1->mojibake, zero C1)
    pagina = bruto.decode("cp1252")

    blocos_p = re.findall(r"<p[^>]*>(.*?)</p>", pagina, re.S | re.I)
    frags = [limpar_fragmento(b) for b in blocos_p]

    # Descarta: vazios (ex.: <p>&nbsp;</p>), chrome do cabeçalho/rodapé
    # ("texto de"/"índice"/"Poesia"/"Projetos Culturais"/"Crônicas") e o
    # cabeçalho cinza do corpo igual ao título (igualdade normalizada).
    chrome = {"poesia", "projetos culturais", "crônicas", "indice",
              "dalila teles veras"}
    corpo: list[str] = []
    for f in frags:
        if not f:
            continue
        n = normalizar(f)
        if n in chrome:
            continue
        # cabeçalho do legado: "DAlila Teles Veras texto de José Armando Pereira da Silva"
        if n.startswith("dalila teles veras texto de"):
            continue
        # rodapé do legado: "índice / Poesia / Projetos Culturais / Crônicas"
        if "indice" in n and "projetos culturais" in n:
            continue
        corpo.append(f)

    # Cabeçalho cinza "DALILA TELES VERAS" (título do texto) sai do corpo;
    # se vier aqui dentro, é o 1º fragmento.
    if corpo and normalizar(corpo[0]) == normalizar(TITULO):
        corpo = corpo[1:]

    erros = []
    if len(corpo) != 11:
        erros.append(f"esperados 11 parágrafos (10 + assinatura), veio {len(corpo)}")

    for i, (pre, suf) in enumerate(ANCORAS):
        if i < len(corpo):
            if not corpo[i].startswith(pre):
                erros.append(f"p{i+1}: prefixo esperado ausente: {pre[:50]}…")
            if not corpo[i].endswith(suf):
                erros.append(f"p{i+1}: sufixo esperado ausente: …{suf[-50:]}")

    # Assinatura como último parágrafo
    if corpo and corpo[-1] != ASSINATURA:
        erros.append(f"assinatura inesperada: {corpo[-1]!r}")

    # Zero C1 (U+0080–U+009F) em todo o corpo
    c1 = [(i, ch) for i, p in enumerate(corpo) for ch in p if 0x80 <= ord(ch) <= 0x9F]
    if c1:
        erros.append(f"C1 residual: {c1[:5]}")

    # Sem resquício de tag
    for i, p in enumerate(corpo):
        if re.search(r"<[^>]+>", p):
            erros.append(f"p{i+1}: tag residual")

    # Itálicos: cada título deve ocorrer exatamente 1 vez no corpo antes da aplicação
    texto_concat = "\n".join(corpo)
    for t in ITALICOS:
        qtd = texto_concat.count(t)
        if qtd != 1:
            erros.append(f"itálico {t!r}: {qtd} ocorrências (esperado 1)")
    if erros:
        for e in erros:
            print("ERRO:", e)
        return 1

    # Aplica itálicos semânticos
    corpo_html = []
    for p in corpo:
        for t in ITALICOS:
            p = p.replace(t, f"<i>{t}</i>")
        corpo_html.append(f"<p>{p}</p>")

    # Assinatura em itálico (legado: <p ALIGN="RIGHT"><i>…</i></p>)
    corpo_html[-1] = f"<p><i>{ASSINATURA}</i></p>"

    dados = {
        "id": SLUG,
        "titulo": TITULO,
        "tipo": "estudo-critico",
        "subtitulo": SUBTITULO,
        "ano": ANO,
        "texto": "".join(corpo_html),
        # fonte_original REMOVIDO a pedido da usuária (Task 73): o bloco
        # "Fonte" com a URL do site antigo não deve aparecer na página
        # (o site legado será desativado). Proveniência registrada no worklog.
    }

    SAIDA.parent.mkdir(parents=True, exist_ok=True)
    SAIDA.write_text(json.dumps(dados, ensure_ascii=False, indent=2) + "\n",
                     encoding="utf-8")

    n_chars = sum(len(re.sub(r"<[^>]+>", "", p)) for p in corpo)
    print(f"OK: {SAIDA}")
    print(f"parágrafos: {len(corpo)} (10 + assinatura) | {n_chars} caracteres de texto")
    print(f"itálicos aplicados: {len(ITALICOS)}")
    print("1º p:", corpo[0][:80])
    print("último p:", corpo[-1])
    return 0


if __name__ == "__main__":
    sys.exit(main())
