#!/usr/bin/env python3
"""Verificação verbatim: o TEXTO dos ensaios marcados não pode ter mudado
(removendo tags, o conteúdo deve ser idêntico ao do git HEAD)."""
import json
import re
import subprocess
from pathlib import Path

BASE = "src/app/texto/[id]"
ensaios = [
    "a-amalia-e-o-fado-estranhas-formas-de-vida",
    "a-criacao-literaria-como-materia-de-memoria-e-esquecimento",
    "a-cultura-na-pauta-da-agenda-regional",
    "a-literatura-no-abc-da-contemplacao-a-resistencia",
    "as-palavras-ai-estao-uma-por-uma",
    "cafe-verso-e-historia",
    "emigracao-memoria-e-as-tarefas-da-poesia",
    "joao-ramalho-um-luso-na-historia-e-na-literatura-do-brasil",
    "o-poeta-e-a-cidade",
    "os-congressos-de-historia-do-grande-abc-e-as-tarefas-da-poesia",
    "pessoa-entranhado",
    "pessoa-e-saramago-a-palavra-re-veladora",
    "poesia-feita-por-mulheres",
    "poesia-madeirense",
]

def sem_tags(html: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html)).strip()

ok = True
for slug in ensaios:
    caminho = f"{BASE}/{slug}/dados.json"
    head = subprocess.run(["git", "show", f"HEAD:{caminho}"], capture_output=True, text=True)
    if head.returncode != 0:
        print(f"AVISO: {slug} sem versão no git HEAD (arquivo novo?) — pulo")
        continue
    antigo = json.loads(head.stdout)["texto"]
    novo = json.loads(Path(caminho).read_text(encoding="utf-8"))["texto"]
    igual = sem_tags(antigo) == sem_tags(novo)
    n_verso = novo.count('class="verso"')
    print(f"{'OK ' if igual else 'FALHOU'} {slug:<58} versos={n_verso}")
    ok = ok and igual

print()
print("VERBATIM OK — nenhuma palavra alterada" if ok else "!!! DIFERENÇAS ENCONTRADAS !!!")
