#!/usr/bin/env python3
"""Levantamento completo: parágrafos de poema nos 29 ensaios.

Padrões de poema no HTML legado:
  A) parágrafo com <br> (versos quebrados) que não seja totalmente bold
  B) parágrafo inteiramente envolvido em <i>...</i> (verso citado em itálico)

Exclusões: parágrafos 100% <b> (títulos/ênfases do legado).
Gera relatório para revisão manual antes de marcar class="verso".
"""
import json
import re
from pathlib import Path

BASE = Path("/home/z/my-project/src/app/texto/[id]")

RE_P = re.compile(r"<p[^>]*>[\s\S]*?</p>")

def texto_plano(html: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html)).strip()

def inteiramente_bold(html: str) -> bool:
    """Todo o texto visível está dentro de <b>/<strong>?"""
    sem_p = re.sub(r"^<p[^>]*>|</p>$", "", html.strip())
    sem_p = sem_p.replace("<o:p>", "").replace("</o:p>", "")
    # remove blocos bold e verifica se sobra texto
    restante = re.sub(r"<b[^>]*>[\s\S]*?</b>", "", sem_p)
    restante = re.sub(r"<strong[^>]*>[\s\S]*?</strong>", "", restante)
    return len(texto_plano(restante)) == 0

def inteiramente_italico(html: str) -> bool:
    """Parágrafo envolvido por UM bloco <i>/<em> que cobre todo o texto."""
    sem_p = re.sub(r"^<p[^>]*>|</p>$", "", html.strip())
    sem_p = sem_p.replace("<o:p>", "").replace("</o:p>", "").strip()
    m = re.match(r"^(<i>|<em>)([\s\S]*)(</i>|</em>)$", sem_p.strip())
    if not m:
        return False
    # nada além do bloco i (o grupo 2 deve conter todo o conteúdo com texto)
    depois = sem_p.strip()[m.end(1) + len(m.group(2)) + len(m.group(3)):]
    return texto_plano(depois) == ""

relatorio = []
for d in sorted(BASE.glob("*/dados.json")):
    dados = json.loads(d.read_text(encoding="utf-8"))
    if dados.get("tipo") != "ensaio":
        continue
    texto = dados["texto"]
    ps = RE_P.findall(texto)
    cand_br, cand_it, bold_br = [], [], []
    for p in ps:
        tem_br = bool(re.search(r"<br", p))
        tb = inteiramente_bold(p)
        ti = inteiramente_italico(p)
        if tem_br and tb:
            bold_br.append(p)
        elif tem_br and not tb:
            cand_br.append(p)
        if ti:
            cand_it.append(p)
    if cand_br or cand_it or bold_br:
        relatorio.append({
            "slug": d.parent.name,
            "titulo": dados.get("titulo", "?"),
            "br": cand_br,
            "it": cand_it,
            "bold_br": bold_br,
        })

for r in relatorio:
    print("=" * 100)
    print(f"{r['slug']}  |  {r['titulo'][:60]}")
    print(f"  A) p com <br> (não-bold): {len(r['br'])}")
    for s in r["br"][:3]:
        print(f"     > {texto_plano(s)[:150]}")
    print(f"  B) p inteiramente <i>:    {len(r['it'])}")
    for s in r["it"][:3]:
        print(f"     > {texto_plano(s)[:150]}")
    if r["bold_br"]:
        print(f"  [excluídos] p 100% bold com <br>: {len(r['bold_br'])}")
        for s in r["bold_br"][:2]:
            print(f"     > {texto_plano(s)[:150]}")

print()
print(f"TOTAL: {len(relatorio)} ensaios com candidatos a poema")
print(f"TOTAL parágrafos: A={sum(len(r['br']) for r in relatorio)}  B={sum(len(r['it']) for r in relatorio)}  excl-bold={sum(len(r['bold_br']) for r in relatorio)}")
