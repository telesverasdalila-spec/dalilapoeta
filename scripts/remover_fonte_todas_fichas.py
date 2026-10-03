# -*- coding: utf-8 -*-
"""
Task 74 — Remover o bloco "Fonte" (referência visível ao site antigo) de TODAS
as fichas, a pedido da usuária ("tira de todas"):
  - src/app/texto/[id]/*/dados.json  -> remove chave "fonte_original"
    (ConteudoTexto/Cronica/Traducao/Ensaio renderizam o bloco de forma
     condicional: sem a chave, o bloco desaparece por inteiro)
  - src/app/obra/cronica/[id]/dados.json -> remove "fonte" (link clicável
    para o legado, renderizado no page.tsx) e "fonte_original" (metadado)
Depois: varre todos os dados.json de src/ por resquício do domínio legado
ou do rótulo "Site legado".
"""
import json
from pathlib import Path

RAIZ = Path("/home/z/my-project")
ALVOS_TEXTO = sorted((RAIZ / "src/app/texto/[id]").glob("*/dados.json"))
ALVO_CRONICA = RAIZ / "src/app/obra/cronica/[id]/dados.json"

removidas_fonte_original = 0
removidas_fonte = 0
sem_campo = []

for caminho in ALVOS_TEXTO:
    d = json.loads(caminho.read_text(encoding="utf-8"))
    if "fonte_original" in d:
        d.pop("fonte_original")
        caminho.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n",
                           encoding="utf-8")
        removidas_fonte_original += 1
    else:
        sem_campo.append(caminho.parent.name)

# Crônica em obra/: "fonte" renderiza link clicável + "fonte_original" metadado
d = json.loads(ALVO_CRONICA.read_text(encoding="utf-8"))
if "fonte" in d:
    d.pop("fonte")
    removidas_fonte += 1
if "fonte_original" in d:
    d.pop("fonte_original")
    removidas_fonte_original += 1
ALVO_CRONICA.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n",
                        encoding="utf-8")

print(f"fonte_original removido de {removidas_fonte_original} fichas (80 /texto + 1 crônica)")
print(f"fonte (link clicável) removido de {removidas_fonte} ficha (A Cidade do Meu Desejo)")
if sem_campo:
    print("sem o campo (já estavam limpas):", sem_campo)

# Varredura por resquícios em QUALQUER dados.json de src/
dominio = "dalila.telesveras.nom.br"
residuos: list[str] = []
for caminho in (RAIZ / "src").rglob("dados.json"):
    conteudo = caminho.read_text(encoding="utf-8")
    if dominio in conteudo or "Site legado" in conteudo:
        residuos.append(str(caminho.relative_to(RAIZ)))

print(f"\nfichas com resquício do legado nos dados: {len(residuos)}")
for r in residuos:
    print("  RESQUÍCIO:", r)

# --- Resquícios na rota antiga /cronicas (Task 74, mesma varredura) ---
# 'fonte' mantém a informação real da publicação; só o sufixo "- Site legado"
# sai. 'nota_rodape' mantém a citação da coluna e perde a frase sobre o
# "site anterior".
CORRECOES_CRONICAS = [
    ("Coluna Viaverbo (1999-2004) - Site legado", "Coluna Viaverbo (1999-2004)"),
    ("Crônica publicada originalmente na coluna Viaverbo. "
     "Texto preservado do site anterior de Dalila Teles Veras.",
     "Crônica publicada originalmente na coluna Viaverbo."),
]
ajustadas = 0
for caminho in [
    RAIZ / "src/app/cronicas/[id]/dados.json",
    RAIZ / "src/app/cronicas/a-lingua-a-patria-possivel/dados.json",
]:
    if not caminho.exists():
        continue
    bruto = caminho.read_text(encoding="utf-8")
    novo = bruto
    mudou = False
    for velho, correto in CORRECOES_CRONICAS:
        if velho in novo:
            novo = novo.replace(velho, correto)
            mudou = True
    if mudou:
        caminho.write_text(novo, encoding="utf-8")
        ajustadas += 1

print(f"fichas da rota antiga /cronicas ajustadas (curadoria): {ajustadas}")

residuos2 = [
    str(c.relative_to(RAIZ))
    for c in (RAIZ / "src").rglob("dados.json")
    if dominio in c.read_text(encoding="utf-8") or "Site legado" in c.read_text(encoding="utf-8")
]
print(f"resquício final de legado em dados.json: {len(residuos2)}")
for r in residuos2:
    print("  RESQUÍCIO FINAL:", r)
