#!/usr/bin/env python3
"""Mapa completo de parágrafos dos ensaios com poesia (para curadoria de intervalos)."""
import json
import re
from pathlib import Path

BASE = Path("/home/z/my-project/src/app/texto/[id]")
RE_P = re.compile(r"<p[^>]*>[\s\S]*?</p>")

def texto_plano(html: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html)).strip()

alvos = {
    "emigracao-memoria-e-as-tarefas-da-poesia": [(0, 223)],
    "os-congressos-de-historia-do-grande-abc-e-as-tarefas-da-poesia": [(30, 74)],
    "cafe-verso-e-historia": [(40, 114)],
    "a-amalia-e-o-fado-estranhas-formas-de-vida": [(0, 80)],
    "as-palavras-ai-estao-uma-por-uma": [(0, 27)],
    "a-criacao-literaria-como-materia-de-memoria-e-esquecimento": [(0, 14)],
}

for slug, faixas in alvos.items():
    dados = json.loads((BASE / slug / "dados.json").read_text(encoding="utf-8"))
    ps = RE_P.findall(dados["texto"])
    print("#" * 100)
    print(f"## {slug}  ({len(ps)} parágrafos)")
    for ini, fim in faixas:
        for i in range(max(0, ini), min(fim, len(ps))):
            p = ps[i]
            t = texto_plano(p)
            if not t:
                print(f"  p#{i:>3} [   ] (vazio)")
                continue
            tem_br = "R" if re.search(r"<br", p) else " "
            bold = "B" if re.search(r"<b[ >]", p) else " "
            ital = "I" if re.search(r"<(i|em)[ >]", p) else " "
            print(f"  p#{i:>3} [{tem_br}{bold}{ital}] {t[:112]}")
