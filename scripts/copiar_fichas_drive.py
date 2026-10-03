#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Copia as fichas do Drive para src/data/obras/ e valida estrutura/campos."""
import json
import shutil
from pathlib import Path

RAIZ = Path("/home/z/my-project")
DRIVE = RAIZ / "drive-obra-full" / "app" / "obra" / "[id]"
DESTINO = RAIZ / "src" / "data" / "obras"

ATIVAS = [
    "opcoes-para-morrer-no-espaco",
    "passageira-antologia-pessoal-1982-2024",
    "insulas",
    "pecados",
    "vestigios",
    "a-janela-dos-dias",
]

CAMPOS_FICHA = ["slug", "titulo", "subtitulo", "genero", "ano", "capa",
                "status_catalogo", "sobre", "orelha", "autor_orelha", "autorOrelha",
                "dados", "trechos", "partes", "adquira"]
CAMPOS_TRECHO = ["titulo", "subtitulo", "origem", "citacao", "texto",
                 "artista", "obra_arte", "imagem_arte"]

DESTINO.mkdir(parents=True, exist_ok=True)

for slug in ATIVAS:
    origem = DRIVE / slug / "dados.json"
    if not origem.exists():
        print(f"[FALTA] {slug}: sem dados.json no Drive")
        continue
    dados = json.loads(origem.read_text(encoding="utf-8"))
    destino = DESTINO / f"{slug}.json"
    shutil.copyfile(origem, destino)

    campos = [c for c in CAMPOS_FICHA if c in dados]
    n_trechos = len(dados.get("trechos", []))
    n_partes = sum(len(p.get("poemas", [])) for p in dados.get("partes", []))
    extras = [k for k in dados if k not in CAMPOS_FICHA]
    print(f"[OK] {slug}")
    print(f"     campos: {', '.join(campos)}")
    if extras:
        print(f"     EXTRAS (fora do schema): {extras}")
    if n_trechos:
        print(f"     trechos: {n_trechos}")
    if n_partes:
        print(f"     poemas em partes: {n_partes}")
    # campos inusitados em trechos
    for i, t in enumerate(dados.get("trechos", [])):
        inus = [k for k in t if k not in CAMPOS_TRECHO]
        if inus:
            print(f"     trecho[{i}] '{t.get('titulo','?')}' campos inusitados: {inus}")
    for pi, p in enumerate(dados.get("partes", [])):
        inus = [k for k in p if k not in ("titulo", "citacao", "poemas")]
        if inus:
            print(f"     parte[{pi}] '{p.get('titulo','?')}' campos inusitados: {inus}")
        for i, t in enumerate(p.get("poemas", [])):
            inus = [k for k in t if k not in CAMPOS_TRECHO]
            if inus:
                print(f"     parte[{pi}] poema[{i}] inusitados: {inus}")

print("\n=== capas referenciadas vs arquivos no Drive public ===")
pub = RAIZ / "drive-obra-full" / "public"
for slug in ATIVAS:
    f = DESTINO / f"{slug}.json"
    if not f.exists():
        continue
    d = json.loads(f.read_text(encoding="utf-8"))
    capa = d.get("capa")
    if capa:
        existe = (pub / capa.lstrip("/")).exists()
        print(f"  {slug}: {capa} -> {'OK' if existe else 'FALTA NO DRIVE'}")
    for t in d.get("trechos", []):
        img = t.get("imagem_arte")
        if img:
            existe = (pub / img.lstrip("/")).exists()
            print(f"    arte '{t.get('titulo','?')}': {img} -> {'OK' if existe else 'FALTA NO DRIVE'}")
