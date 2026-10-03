#!/usr/bin/env python3
"""Examina a vizinhança dos candidatos para pegar poemas linha-por-parágrafo."""
import json
import re
from pathlib import Path

BASE = Path("/home/z/my-project/src/app/texto/[id]")
RE_P = re.compile(r"<p[^>]*>[\s\S]*?</p>")

def texto_plano(html: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html)).strip()

janelas = [
    ("emigracao-memoria-e-as-tarefas-da-poesia", [(193, 208)]),
    ("os-congressos-de-historia-do-grande-abc-e-as-tarefas-da-poesia", [(13, 30), (74, 120)]),
    ("pessoa-e-saramago-a-palavra-re-veladora", [(20, 45)]),
    ("cafe-verso-e-historia", [(60, 75), (95, 105)]),
]

for slug, faixas in janelas:
    dados = json.loads((BASE / slug / "dados.json").read_text(encoding="utf-8"))
    ps = RE_P.findall(dados["texto"])
    print("#" * 100)
    print(f"## {slug}  ({len(ps)} parágrafos)")
    for ini, fim in faixas:
        for i in range(max(0, ini), min(fim, len(ps))):
            p = ps[i]
            t = texto_plano(p)
            tem_br = "BR" if re.search(r"<br", p) else "  "
            bold = "B" if re.search(r"<b[ >]", p) else " "
            ital = "I" if re.search(r"<(i|em)[ >]", p) else " "
            print(f"  p#{i:>3} [{tem_br}{bold}{ital}] {t[:130]}")
