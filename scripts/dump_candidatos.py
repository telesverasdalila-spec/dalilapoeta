#!/usr/bin/env python3
"""Despeja TODOS os candidatos a poema (texto completo) para curadoria manual."""
import json
import re
from pathlib import Path
import sys
sys.path.insert(0, "/home/z/my-project/scripts")
from scan_candidatos_poema import RE_P, texto_plano, inteiramente_bold, inteiramente_italico  # type: ignore

BASE = Path("/home/z/my-project/src/app/texto/[id]")

alvos = [
    "a-amalia-e-o-fado-estranhas-formas-de-vida",
    "a-criacao-literaria-como-materia-de-memoria-e-esquecimento",
    "a-cultura-na-pauta-da-agenda-regional",
    "as-palavras-ai-estao-uma-por-uma",
    "cafe-verso-e-historia",
    "emigracao-memoria-e-as-tarefas-da-poesia",
    "os-congressos-de-historia-do-grande-abc-e-as-tarefas-da-poesia",
    "pessoa-e-saramago-a-palavra-re-veladora",
    "poesia-feita-por-mulheres",
    "revistas-literarias",
]

for slug in alvos:
    dados = json.loads((BASE / slug / "dados.json").read_text(encoding="utf-8"))
    texto = dados["texto"]
    ps = RE_P.findall(texto)
    print("#" * 100)
    print(f"## {slug}")
    for i, p in enumerate(ps):
        tem_br = bool(re.search(r"<br", p))
        tb = inteiramente_bold(p)
        ti = inteiramente_italico(p)
        if (tem_br and not tb) or ti:
            rot = "IT" if ti else "BR"
            t = texto_plano(p)
            # quebra em linhas de ~105 chars
            linhas = [t[j:j+105] for j in range(0, len(t), 105)] or [""]
            print(f"  [{rot}] p#{i}: {linhas[0]}")
            for extra in linhas[1:]:
                print(f"        {extra}")
