#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Task 70 recriada — ficha /obra/minudencias a partir do legado Minudencias.htm (verbatim)
import re, json, html, sys
from pathlib import Path

RAIZ = Path("/home/z/my-project")
RAW = (RAIZ / "scripts/legado_minudencias/Minudencias.htm").read_bytes()
HTML = RAW.decode("cp1252")

paras = re.findall(r'<p\s+ALIGN="right"[^>]*>(.*?)</p>', HTML, flags=re.S | re.I)
if len(paras) != 2:
    print(f"ABORT: esperados 2 parágrafos, achados {len(paras)}")
    sys.exit(1)

def limpar(frag: str) -> str:
    t = re.sub(r"<[^>]+>", "", frag)
    t = html.unescape(t)
    t = re.sub(r"\s+", " ", t).strip()
    return t

p1, p2 = limpar(paras[0]), limpar(paras[1])

assert p1.startswith('"O imaginário do Grande ABC durante 1999'), "P1: prefixo"
assert "20 agentes culturais do Grande ABC" in p1, "P1: âncora"
assert p1.endswith("e 5, em parte."), "P1: final (aspas de abertura sem fecho, como no legado)"
assert p2.startswith("A idéia inicial surgiu"), "P2: prefixo (idéia verbatim)"
assert "Antonio Possidonio Sampaio, em 1992" in p2, "P2: âncora"
assert "ABC Cotidiano - Cotidiário" in p2, "P2: título do livro"
assert p2.endswith("por outros autores."), "P2: final"
for p in (p1, p2):
    assert not re.search(r"[\u0080-\u009F]", p), "C1"
    assert "<" not in p and ">" not in p, "tag"

ficha = {
    "titulo": "Minudências",
    "subtitulo": "",
    "genero": "Prosa",
    "ano": 2000,
    "capa": "/imagens/obras-publicadas/poesia/2000-capa-minudencias.jpg",
    "status_catalogo": "esgotado",
    "sobre": p1 + "\n\n" + p2,
    "dados": [
        {"label": "Ano", "valor": "2000"},
        {"label": "Tipo", "valor": "Diário"},
        {"label": "Editora", "valor": "Alpharrabio Edições, SP"},
        {"label": "Formato", "valor": "16 x 23 cm"},
        {"label": "Páginas", "valor": "136 pp."},
    ],
}

dest = RAIZ / "src/app/obra/[id]/minudencias/dados.json"
dest.parent.mkdir(parents=True, exist_ok=True)
dest.write_text(json.dumps(ficha, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
assert (RAIZ / "public/imagens/obras-publicadas/poesia/2000-capa-minudencias.jpg").exists()
print("Ficha minudencias recriada verbatim")
