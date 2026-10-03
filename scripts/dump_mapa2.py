#!/usr/bin/env python3
"""Mapa de parágrafos — 2ª leva de ensaios com poemas linha-por-p."""
import json
import re
from pathlib import Path

BASE = Path("/home/z/my-project/src/app/texto/[id]")
RE_P = re.compile(r"<p[^>]*>[\s\S]*?</p>")

def texto_plano(html: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html)).strip()

alvos = {
    "a-cultura-na-pauta-da-agenda-regional": (0, 999),
    "a-literatura-no-abc-da-contemplacao-a-resistencia": (0, 999),
    "a-vez-da-utopia-na-agenda-cultural": (0, 999),
    "joao-ramalho-um-luso-na-historia-e-na-literatura-do-brasil": (0, 999),
    "o-poeta-e-a-cidade": (0, 999),
    "pessoa-entranhado": (0, 999),
    "poesia-feita-por-mulheres": (0, 999),
    "poesia-madeirense": (0, 999),
}

for slug, (ini, fim) in alvos.items():
    dados = json.loads((BASE / slug / "dados.json").read_text(encoding="utf-8"))
    ps = RE_P.findall(dados["texto"])
    print("#" * 100)
    print(f"## {slug}  ({len(ps)} parágrafos)")
    for i in range(max(0, ini), min(fim, len(ps))):
        p = ps[i]
        t = texto_plano(p)
        if not t:
            continue
        br = "R" if re.search(r"<br", p) else " "
        b = "B" if re.search(r"<b[ >]", p) else " "
        it = "I" if re.search(r"<(i|em)[ >]", p) else " "
        print(f"  p#{i:>3} [{br}{b}{it}] {t[:110]}")
