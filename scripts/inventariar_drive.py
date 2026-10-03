#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Inventário: imagens do Drive vs paths referenciados nas fichas do site."""
import json
import glob
from pathlib import Path

RAIZ = Path("/home/z/my-project")
DRIVE = RAIZ / "drive-obra-full"
PUBLIC = RAIZ / "public"

print("=== nosso public atual (contagem por pasta) ===")
pastas: dict[str, int] = {}
for f in PUBLIC.rglob("*"):
    if f.is_file():
        pastas[str(f.parent.relative_to(PUBLIC))] = pastas.get(str(f.parent.relative_to(PUBLIC)), 0) + 1
for k in sorted(pastas):
    print(f"  {k}: {pastas[k]}")

print("\n=== arquivos na raiz imagens (Drive) ===")
img_drive = DRIVE / "public" / "imagens"
for f in sorted(img_drive.iterdir()):
    if f.is_file():
        print("  ", f.name)

print("\n=== imagens do Drive (todas, relativas a public/) ===")
rel_drive = sorted(str(f.relative_to(DRIVE / "public")) for f in (DRIVE / "public").rglob("*") if f.is_file())
for r in rel_drive:
    existe = "OK já existe" if (PUBLIC / r).exists() else "NOVA"
    print(f"  [{existe:12s}] {r}")

print("\n=== capas nas nossas fichas ===")
for f in sorted((RAIZ / "src" / "data" / "obras").glob("*.json")):
    d = json.loads(f.read_text(encoding="utf-8"))
    capa = d.get("capa", "—")
    status = "ARQUIVO OK" if capa != "—" and (PUBLIC / capa.lstrip("/")).exists() else "FALTA ARQUIVO"
    print(f"  {d.get('slug','?'):42s} {capa:55s} {status}")

print("\n=== artes de Pecados ===")
d = json.loads((RAIZ / "src" / "data" / "obras" / "pecados.json").read_text(encoding="utf-8"))
for t in d.get("trechos", []):
    img = t.get("imagem_arte")
    if img:
        status = "ARQUIVO OK" if (PUBLIC / img.lstrip("/")).exists() else "FALTA ARQUIVO"
        print(f"  {img:55s} {status}")
