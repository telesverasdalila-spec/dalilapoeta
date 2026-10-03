#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Task 62 reconstruída — dump dos blocos (título + texto) das páginas de leituras críticas
from pathlib import Path
import re, html as H

RAIZ = Path("/home/z/my-project/scripts")
PAGINAS = [
    ("LeiturasCríticasEstranhasFormasDeVida.htm", "estranhas"),
    ("LeiturasCríticasRetratosFalhados.htm", "retratos"),
    ("Leituras Críticas Janela dos Dias.htm", "janela"),
    ("LeiturasCríticasVestígios.htm", "vestigios"),
    ("Leituras Críticas As Artes do Ofício.htm", "artes"),
    ("Leituras Críticas A Vida Crônica.htm", "vidacronica"),
]

def tds_de(tr):
    return re.findall(r"<td[^>]*>(.*?)</td>", tr, flags=re.S | re.I)

for arq, prefixo in PAGINAS:
    h = (RAIZ / "legado_leituras" / arq).with_suffix(".htm.utf8").read_text(encoding="utf-8")
    trs = re.findall(r"<tr[^>]*>(.*?)</tr>", h, flags=re.S | re.I)
    blocos = []
    i = 0
    while i < len(trs):
        tds = tds_de(trs[i])
        if len(tds) == 2:
            titulo = tds[0]
            if i + 1 < len(trs):
                tds2 = tds_de(trs[i + 1])
                if len(tds2) == 2:
                    blocos.append((titulo, tds2[0]))
                    i += 2
                    continue
            blocos.append((titulo, ""))
        i += 1
    for n, (tit, txt) in enumerate(blocos, 1):
        tt = re.sub(r"<[^>]+>", "", tit)
        tt = H.unescape(re.sub(r"\s+", " ", tt)).strip()
        (RAIZ / "lc_raw" / f"{prefixo}_{n:02d}_titulo.txt").write_text(tit, encoding="utf-8")
        (RAIZ / "lc_raw" / f"{prefixo}_{n:02d}_texto.html").write_text(txt, encoding="utf-8")
        print(f"{prefixo}_{n:02d}: {tt[:95]} | texto {len(txt)}B")
