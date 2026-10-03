#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Task 71 — varredura final de TODAS as rotas do site (HTTP 200 + sem "Página em construção" indevida)
import json, subprocess, sys
from pathlib import Path

BASE = "http://localhost:3000"
RAIZ = Path("/home/z/my-project")

falhas = []
total = 0

def rota(path, marca=None):
    global total
    total += 1
    try:
        out = subprocess.run(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}",
                              "--max-time", "20", BASE + path],
                             capture_output=True, text=True, timeout=30).stdout.strip()
    except Exception as e:
        falhas.append(f"{path}: exceção {e}")
        return
    if out != "200":
        falhas.append(f"{path}: HTTP {out}")

rota("/", "Dalila")
rota("/?eixo=obra")
rota("/?eixo=movimento")

obra_dir = RAIZ / "src/app/obra/[id]"
slugs_obra = sorted(p.name for p in obra_dir.iterdir() if p.is_dir())
for s in slugs_obra:
    total += 1
    out = subprocess.run(["curl", "-s", "--max-time", "25", "-w", "\n%{http_code}",
                          BASE + f"/obra/{s}"], capture_output=True, text=True, timeout=35).stdout
    code = out.rsplit("\n", 1)[-1].strip()
    corpo = out.rsplit("\n", 1)[0]
    if code != "200":
        falhas.append(f"/obra/{s}: HTTP {code}")
    elif "Página em construção" in corpo:
        falhas.append(f"/obra/{s}: com ficha caiu em 'Página em construção'")

texto_dir = RAIZ / "src/app/texto/[id]"
slugs_texto = sorted(p.name for p in texto_dir.iterdir() if p.is_dir() and p.name != "css-corpo.ts")
for s in slugs_texto:
    rota(f"/texto/{s}")

print(f"Rotas varridas: {total}")
print(f"Fichas /obra: {len(slugs_obra)} | páginas /texto: {len(slugs_texto)}")
if falhas:
    print(f"FALHOU: {len(falhas)} problema(s):")
    for f in falhas:
        print(" -", f)
    sys.exit(1)
print(f"TUDO OK — {total} rotas HTTP 200")
