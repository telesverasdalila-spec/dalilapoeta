#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Envolve os JSONs de movimento (stubs vazios do Drive) na moldura ArquivoCategoria
esperada por SecaoMovimento.tsx da usuária:
  { categoria, total_registros, descricao, tags_comuns, registros: [] }
Idempotente: só altera arquivos que ainda são LISTAS. Institucionais.json
(convertido, com 8 registros reais) e ativismo.json (lista real, uso futuro)
ficam intocados.
"""
import json
from pathlib import Path

DIR = Path("/home/z/my-project/src/app/data/movimento")

DESCRICOES = {
    "Palestras.json": "Palestras, debates e conferências",
    "LeiturasPoeticas.json": "Leituras poéticas públicas",
    "SarausRecitais.json": "Saraus e recitais",
    "CongressosSeminariosSimposios.json": "Congressos, seminários e simpósios",
    "ConferenciasMesas.json": "Conferências e mesas-redondas",
    "OficinasWorkshops.json": "Oficinas literárias e workshops",
    "EncontrosAtividadesCulturais.json": "Encontros e atividades culturais",
    "CuradoriaConsultoria.json": "Curadoria e consultoria",
    "ProgramasEntrevistas.json": "Programas e entrevistas",
}
IGNORAR = {"Institucionais.json", "ativismo.json"}

for nome, descricao in DESCRICOES.items():
    arq = DIR / nome
    dados = json.loads(arq.read_text(encoding="utf-8"))
    if isinstance(dados, list):
        moldura = {
            "categoria": arq.stem,
            "total_registros": 0,
            "descricao": descricao,
            "tags_comuns": [],
            "registros": [],
        }
        arq.write_text(
            json.dumps(moldura, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(f"[moldura] {nome}")
    else:
        print(f"[mantido] {nome} (já é {type(dados).__name__})")

for nome in sorted(p.name for p in DIR.glob("*.json")):
    if nome not in DESCRICOES:
        print(f"[ignorado] {nome}")
