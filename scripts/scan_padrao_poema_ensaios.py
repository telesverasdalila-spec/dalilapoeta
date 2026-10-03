#!/usr/bin/env python3
"""Examina como os poemas aparecem dentro dos ensaios (padrões de marcação)."""
import json
import re
from pathlib import Path

BASE = Path("/home/z/my-project/src/app/texto/[id]")

alvos = [
    "emigracao-memoria-e-as-tarefas-da-poesia",
    "o-poeta-e-a-cidade",
    "poesia-madeirense",
    "as-palavras-ai-estao-uma-por-uma",
]

for slug in alvos:
    dados = json.loads((BASE / slug / "dados.json").read_text(encoding="utf-8"))
    texto = dados["texto"]
    print("=" * 90)
    print(f"ENSAIO: {slug} | {dados.get('titulo')}")
    print(f"  <br> count: {len(re.findall(r'<br', texto))}")
    # parágrafos com <em>
    ps = re.findall(r"<p[^>]*>[\s\S]*?</p>", texto)
    n_em = 0
    for p in ps:
        if "<em" in p or "<i>" in p:
            n_em += 1
            if n_em <= 3:
                amostra = p[:400].replace("\n", " ")
                print(f"  P-com-em: {amostra}")
    print(f"  total de <p> com em/i: {n_em} de {len(ps)}")
    # parágrafos com <br> (poemas costumam ter quebras de linha)
    n_br = 0
    for p in ps:
        if re.search(r"<br", p) and "<em" not in p and "<i>" not in p:
            n_br += 1
            if n_br <= 3:
                amostra = re.sub(r"\s+", " ", p)[:400]
                print(f"  P-com-br: {amostra}")
    print(f"  total de <p> com br (sem em): {n_br}")
