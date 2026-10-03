#!/usr/bin/env python3
# Divide o pacote zip do site em partes <= 90 MiB para contornar limites
# de tamanho do painel de arquivos e do proxy de preview (descoberto na
# Task 79: respostas ~309 MB sao rejeitadas; partes de 90 MB passam).
# Uso: python3 scripts/gera_partes_pacote.py download/<pacote>.zip
# Gera as partes no TOP-LEVEL de download/ (para o painel enxergar) com
# nomes "<base>.parteKdeN.zip" que ordenam ANTES do zip cheio ("parte" <
# "zip"), para nao sequestrar a rota /api/baixar-pacote (que escolhe o
# ultimo zip lexicografico), e o LEIA-ME-pacote.txt com instrucoes.

import hashlib
import os
import sys

TAMANHO_PARTE = 90 * 1024 * 1024  # 90 MiB, folga sob limites de ~100 MB

if len(sys.argv) < 2:
    sys.exit("uso: gera_partes_pacote.py <caminho-do-zip>")
FONTE = sys.argv[1]
if not os.path.isfile(FONTE):
    sys.exit(f"arquivo nao encontrado: {FONTE}")
DOWNLOAD = os.path.dirname(os.path.abspath(FONTE)) or "."

nome_zip = os.path.basename(FONTE)
base = nome_zip[:-4]  # sem ".zip"

with open(FONTE, "rb") as f:
    dados_tamanho = os.path.getsize(FONTE)
    n_partes = (dados_tamanho + TAMANHO_PARTE - 1) // TAMANHO_PARTE

    md5 = hashlib.md5()
    partes = []
    for i in range(n_partes):
        nome_parte = f"{base}.parte{i + 1}de{n_partes}.zip"
        caminho = os.path.join(DOWNLOAD, nome_parte)
        restante = dados_tamanho - i * TAMANHO_PARTE
        bloco = min(TAMANHO_PARTE, restante)
        with open(caminho, "wb") as p:
            p.write(f.read(bloco))
        partes.append((nome_parte, bloco))
        print(f"  {nome_parte}  {bloco:,} B")

# MD5 recalculado lendo o arquivo inteiro (garantia contra surpresa)
with open(FONTE, "rb") as f:
    for chunk in iter(lambda: f.read(1024 * 1024), b""):
        md5.update(chunk)
md5_hex = md5.hexdigest()

print(f"Total: {dados_tamanho:,} B em {n_partes} partes")
print(f"MD5 do zip original: {md5_hex}")

# LEIA-ME com instrucoes de reuniao (Windows / macOS / Linux)
linhas_cmd_win = "+".join(p[0] for p in partes)
cmds = f"""COMO JUNTAR AS PARTES E RECONSTRUIR O PACOTE

Voce baixou {n_partes} partes do pacote {nome_zip}.
Coloque as {n_partes} partes NA MESMA PASTA e execute UM dos comandos abaixo
(dentro dessa pasta):

WINDOWS (Prompt de Comando / CMD):
  copy /b {linhas_cmd_win} {nome_zip}

macOS ou Linux (Terminal):
  cat {base}.parte*.zip > {nome_zip}

CONFERENCIA DE INTEGRIDADE (opcional, recomendado):
O arquivo reconstruido deve ter exatamente {dados_tamanho:,} bytes e este MD5:
  {md5_hex}

  Windows:  certutil -hashfile {nome_zip} MD5
  macOS:    md5 {nome_zip}
  Linux:    md5sum {nome_zip}

Depois de conferir, extraia o zip normalmente. As partes podem ser apagadas.

Partes e tamanhos:
"""
for nome, tam in partes:
    cmds += f"  {nome}  {tam:,} bytes\n"

caminho_leia = os.path.join(DOWNLOAD, "LEIA-ME-pacote.txt")
with open(caminho_leia, "w", encoding="utf-8") as f:
    f.write(cmds)
print(f"LEIA-ME: {caminho_leia}")
