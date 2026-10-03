#!/usr/bin/env python3
"""Heurística: sequências de >=3 parágrafos curtos (possíveis poemas linha-por-p)
em TODOS os ensaios ainda não mapeados + contexto cafe p#25-41."""
import json
import re
from pathlib import Path

BASE = Path("/home/z/my-project/src/app/texto/[id]")
RE_P = re.compile(r"<p[^>]*>[\s\S]*?</p>")

def texto_plano(html: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html)).strip()

mapeados = {
    "emigracao-memoria-e-as-tarefas-da-poesia",
    "os-congressos-de-historia-do-grande-abc-e-as-tarefas-da-poesia",
    "cafe-verso-e-historia", "a-amalia-e-o-fado-estranhas-formas-de-vida",
    "as-palavras-ai-estao-uma-por-uma",
    "a-criacao-literaria-como-materia-de-memoria-e-esquecimento",
    "pessoa-e-saramago-a-palavra-re-veladora",
}

# --- contexto cafe p#25-41
dados = json.loads((BASE / "cafe-verso-e-historia" / "dados.json").read_text(encoding="utf-8"))
ps = RE_P.findall(dados["texto"])
print("### cafe-verso-e-historia p#25-41")
for i in range(25, 42):
    print(f"  p#{i:>3} {texto_plano(ps[i])[:120]}")

print()
print("### Heurística linha-por-págrafo nos demais ensaios")
for d in sorted(BASE.glob("*/dados.json")):
    dados = json.loads(d.read_text(encoding="utf-8"))
    if dados.get("tipo") != "ensaio" or d.parent.name in mapeados:
        continue
    ps = RE_P.findall(dados["texto"])
    texts = [texto_plano(p) for p in ps]
    flags = []
    run = []
    for i, t in enumerate(texts):
        curto = 0 < len(t) <= 65 and not t.endswith((".", ":", ";", "?", "!")) or (0 < len(t) <= 40)
        # mais simples: parágrafo curto sem pontuação final longa
        eh_linha = 0 < len(t) <= 65
        if eh_linha:
            run.append(i)
        else:
            if len(run) >= 4:
                flags.append((run[0], run[-1]))
            run = []
    if len(run) >= 4:
        flags.append((run[0], run[-1]))
    # filtra blocos cujo texto total pareça poema (sem verbos longos...) — só reporta
    for ini, fim in flags:
        amostra = " | ".join(texts[ini:fim + 1])[:180]
        print(f"  {d.parent.name[:52]:<54} p#{ini}-{fim}: {amostra}")
