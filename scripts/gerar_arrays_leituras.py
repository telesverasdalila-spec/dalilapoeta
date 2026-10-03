#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Task 62/63 reconstruídas — gera os arrays TS (leiturasAgrupadasPorLivro + dadosEstudosCriticos)
import json, unicodedata

feitas = json.load(open("/home/z/my-project/scripts/lc_geradas.json", encoding="utf-8"))

ORDEM_LIVROS = [
    ("Estranhas Formas de Vida", 2013),
    ("Retratos Falhados", 2008),
    ("Vestígios", 2003),
    ("À Janela dos dias", 2002),
    ("As Artes do Ofício", 2000),
    ("A Vida Crônica", 1999),
]

def esc(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')

# grupos na ordem do legado, décadas
grupos = []
for livro, ano in ORDEM_LIVROS:
    itens = [f for f in feitas if f["livro"] == livro]
    assert itens, f"sem leituras para {livro}"
    grupos.append({"livro": livro, "ano": ano, "decada": (ano // 10) * 10, "leituras": itens})

assert sum(len(g["leituras"]) for g in grupos) == 34, "total de leituras != 34"
decadas_vistas = set()
linhas = []
linhas.append("// Leituras Críticas agrupadas por livro (ordem do legado; Task 62/63)")
linhas.append("const leiturasAgrupadasPorLivro: { ano: number; livro: string; decada: number; leituras: { autor: string; slug: string }[] }[] = [")
for g in grupos:
    dec_nova = g["decada"] not in decadas_vistas
    decadas_vistas.add(g["decada"])
    linhas.append(f'  {{ ano: {g["ano"]}, livro: "{esc(g["livro"])}", decada: {g["decada"]}, leituras: [')
    for l in g["leituras"]:
        linhas.append(f'    {{ autor: "{esc(l["autor"])}", slug: "{esc(l["slug"])}" }},')
    linhas.append("  ] },")
linhas.append("];")
ts_grupos = "\n".join(linhas)

est = [f for f in feitas if f["tipo"] == "estudo-critico"][0]
ts_estudos = (
    "// Estudos Críticos (Task 62)\n"
    "const dadosEstudosCriticos: Livro[] = [\n"
    f'  {{ ano: {est["ano"]}, titulo: "{esc(est["titulo"])}", descricao: "Clara Moura Lourenço, Universidade de Coimbra", tipo: "Estudo Crítico", slug: "{esc(est["slug"])}" }}\n'
    "];"
)

anos_livros = ",".join(str(a) for _, a in ORDEM_LIVROS)
ts_regua = f"const anosLivrosLeituras = [{anos_livros}];"

with open("/home/z/my-project/scripts/lc_arrays.ts.txt", "w", encoding="utf-8") as f:
    f.write(ts_grupos + "\n\n" + ts_regua + "\n\n" + ts_estudos + "\n")
print(ts_grupos[:900])
print("...")
print(ts_regua)
print(ts_estudos)
