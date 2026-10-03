# -*- coding: utf-8 -*-
"""Task 72 — Varredura de regressão: todas as rotas SSG devem responder 200
e nenhuma ficha com dados.json pode cair em 'Página em construção'."""
import concurrent.futures
import json
import re
import urllib.request
from pathlib import Path

RAIZ = Path("/home/z/my-project")
BASE = "http://localhost:3000"

rotas = ["/", "/?eixo=obra", "/?eixo=movimento"]
for pasta in sorted((RAIZ / "src/app/obra/[id]").iterdir()):
    if pasta.is_dir() and pasta.name != "[id]":
        rotas.append(f"/obra/{pasta.name}")
for pasta in sorted((RAIZ / "src/app/texto/[id]").iterdir()):
    if pasta.is_dir() and pasta.name != "[id]":
        rotas.append(f"/texto/{pasta.name}")

ROTULOS_ESPERADOS = {  # fichas que têm conteúdo e NÃO podem mostrar o stub
    f"/texto/{p.name}" for p in (RAIZ / "src/app/texto/[id]").iterdir()
    if p.is_dir() and p.name != "[id]"
    and (p / "dados.json").exists()
}


def varrer(rota: str) -> tuple[str, int, bool]:
    req = urllib.request.Request(BASE + rota, headers={"User-Agent": "varredura72"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            corpo = r.read().decode("utf-8", "ignore")
            ok = r.status == 200
            if rota in ROTULOS_ESPERADOS and "Página em construção" in corpo:
                ok = False
            # Task 74: nenhuma página pode exibir referência ao site antigo (SSR)
            if "dalila.telesveras.nom.br" in corpo or "Site legado" in corpo:
                ok = False
            return rota, r.status, ok
    except urllib.error.HTTPError as e:
        return rota, e.code, False
    except Exception as e:
        return rota, -1, False


with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
    resultados = list(ex.map(varrer, rotas))

falhas = [(r, s) for r, s, ok in resultados if not ok]
print(f"rotas varridas: {len(resultados)} | obras: {sum(1 for r in rotas if r.startswith('/obra/'))} | textos: {sum(1 for r in rotas if r.startswith('/texto/'))}")
print(f"falhas: {len(falhas)}")
for r, s in falhas:
    print("  FALHOU", r, s)
print("nova ficha presente na varredura:",
      "/texto/jose-armando-pereira-da-silva-sobre-dalila-teles-veras" in rotas)
