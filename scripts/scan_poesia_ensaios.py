#!/usr/bin/env python3
"""Escaneia os ensaios procurando marcação de poesia (versos, poemas).
Objetivo: saber quais ensaios têm poesia e como ela está marcada no HTML,
para aplicar o dourado SOMENTE nos ensaios (pedido da usuária).
"""
import json
import re
from pathlib import Path

BASE = Path("/home/z/my-project/src/app/texto/[id]")

padroes = {
    "class verso": re.compile(r'class="verso"'),
    "titulo-poema": re.compile(r'class="titulo-poema"'),
    "dedicatoria": re.compile(r'class="dedicatoria"'),
    "blockquote": re.compile(r"<blockquote"),
    "h2/h3": re.compile(r"<h[23]"),
    "em italico": re.compile(r"<em>|<i>"),
}

print(f"{'slug':<58} {'tipo':<9} {'verso':>5} {'tpoema':>6} {'dedic':>5} {'bq':>3} {'h23':>3} {'em':>4}")
print("-" * 100)

ensaios_com_poesia = []

for d in sorted(BASE.glob("*/dados.json")):
    try:
        dados = json.loads(d.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"ERRO {d}: {e}")
        continue
    tipo = dados.get("tipo", "?")
    texto = dados.get("texto", "")
    contagens = {k: len(p.findall(texto)) for k, p in padroes.items()}
    if tipo == "ensaio" and (contagens["class verso"] or contagens["titulo-poema"]
                             or contagens["dedicatoria"] or contagens["blockquote"]):
        ensaios_com_poesia.append((d.parent.name, dados.get("titulo", "?"), contagens))
    linha = (f"{d.parent.name[:57]:<58} {tipo:<9} "
             f"{contagens['class verso']:>5} {contagens['titulo-poema']:>6} "
             f"{contagens['dedicatoria']:>5} {contagens['blockquote']:>3} "
             f"{contagens['h2/h3']:>3} {contagens['em italico']:>4}")
    # marca ensaios com poesia
    if tipo == "ensaio" and (contagens["class verso"] or contagens["titulo-poema"] or contagens["dedicatoria"]):
        linha += "  << POESIA"
    print(linha)

print()
print("=== ENSAIOS COM MARCAÇÃO DE POESIA (verso/titulo-poema/dedicatoria) ===")
for slug, titulo, c in ensaios_com_poesia:
    print(f"- {slug} | {titulo[:50]} | versos={c['class verso']} titulo-poema={c['titulo-poema']} dedic={c['dedicatoria']}")

# Também: cadê class="verso" fora dos ensaios? (traduções/crônicas)
print()
print("=== NÃO-ENSAIOS COM class=verso (voltarão ao escuro com o reescopo) ===")
for d in sorted(BASE.glob("*/dados.json")):
    dados = json.loads(d.read_text(encoding="utf-8"))
    if dados.get("tipo") != "ensaio" and 'class="verso"' in dados.get("texto", ""):
        n = dados.get("texto", "").count('class="verso"')
        print(f"- {d.parent.name} (tipo={dados.get('tipo')}) -> {n} versos")
