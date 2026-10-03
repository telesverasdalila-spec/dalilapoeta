#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Task 62 reconstruída — dump curado dos 34 blocos de leitura + estudo (início/fim para título/autor/data)
from pathlib import Path
import re, html as H

RAIZ = Path("/home/z/my-project/scripts")

# (arquivo, lista de TRs de conteúdo 0-indexed conforme inspeção)
PAGINAS = [
    ("LeiturasCríticasEstranhasFormasDeVida.htm", "estranhas", [3, 4]),          # 3=título, 4=texto
    ("LeiturasCríticasRetratosFalhados.htm", "retratos", [6, 9]),                # textos
    ("Leituras Críticas Janela dos Dias.htm", "janela", [2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 15, 16, 17]),
    ("LeiturasCríticasVestígios.htm", "vestigios", [3, 4, 5, 6, 8, 9, 11, 12, 13, 14, 16, 17]),
    ("Leituras Críticas As Artes do Ofício.htm", "artes", [2, 3, 5]),
    ("Leituras Críticas A Vida Crônica.htm", "vidacronica", [9, 13, 17]),
]

def bloco(h, idx):
    trs = re.findall(r"<tr[^>]*>(.*?)</tr>", h, flags=re.S | re.I)
    tds = re.findall(r"<td[^>]*>(.*?)</td>", trs[idx], flags=re.S | re.I)
    return tds[0]

for arq, pref, idxs in PAGINAS:
    h = (RAIZ / "legado_leituras" / arq).with_suffix(".htm.utf8").read_text(encoding="utf-8")
    for n, idx in enumerate(idxs, 1):
        raw = bloco(h, idx)
        t = H.unescape(re.sub(r"<[^>]+>", " ", raw))
        t = re.sub(r"[ \t]+", " ", t).strip()
        (RAIZ / "lc_raw" / f"{pref}_{n:02d}.txt").write_text(t, encoding="utf-8")
        print(f"### {pref}_{n:02d} ({len(raw)}B)")
        print("INI>", t[:260].replace("\n", " "))
        print("FIM>", t[-180:].replace("\n", " "))
        print()
