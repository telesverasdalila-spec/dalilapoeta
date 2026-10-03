#!/usr/bin/env python3
"""Marca os parágrafos de POESIA nos ensaios com class="verso" (Task 20).

Curadoria manual parágrafo a parágrafo (mapas em /tmp/mapa_completo.txt e
/tmp/mapa2.txt). Regras:
  - versos, poemas e poesias (corpo dos poemas) -> class="verso"
  - títulos de poemas (mesmo em <b>) fazem parte do bloco -> marcam também
  - epígrafes em verso e atribuições/notas "(in ...)" do bloco -> marcam
  - NÃO marcam: prosa, listas de bibliografia, bios, títulos de seção prosa

Verbatim: só se injeta o atributo class; nenhuma palavra é alterada.
"""
import json
import re
from pathlib import Path

BASE = Path("/home/z/my-project/src/app/texto/[id]")
RE_P = re.compile(r"<p[^>]*>[\s\S]*?</p>")

def texto_plano(html: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html)).strip()

# slug -> lista de [inicio, fim] inclusive, com prefixo esperado do 1º parágrafo
CURADORIA = {
    "a-amalia-e-o-fado-estranhas-formas-de-vida": [
        (33, 35, "“Navegando em mar de trevas"),
        (37, 39, "“Há-de haver quem te defenda"),
        (41, 44, "“O medo mora comigo"),
        (46, 57, "“Não sei, não sabe ninguém"),
    ],
    "a-criacao-literaria-como-materia-de-memoria-e-esquecimento": [
        (5, 5, "no dia ou noite em que o esquecimento"),
    ],
    "a-cultura-na-pauta-da-agenda-regional": [
        (31, 31, "\"Futuro é o que já é\""),
        (41, 43, 'Ser utópico é a maneira mais consistente'),
    ],
    "a-literatura-no-abc-da-contemplacao-a-resistencia": [
        (17, 48, "Logo após o romper da madrugada"),
        (55, 70, "\"AQUARELA\""),
    ],
    "as-palavras-ai-estao-uma-por-uma": [
        (0, 6, "porém minha alma sabe mais"),
        (18, 25, "Devaneio"),
    ],
    "cafe-verso-e-historia": [
        (12, 41, "Os emboabas entraram"),
        (43, 46, "Os caminhões rodando"),
        (48, 56, "\"Café expresso"),
        (59, 62, "\"O café é tão grave"),
        (65, 66, "Infância"),
        (68, 84, "Café com pão"),
        (86, 87, "Momento Num Café"),
        (89, 97, "Chegavam visitantes à fazenda"),
        (99, 99, "Quando entre nós só havia uma carta"),
        (101, 111, "Bucólica Nostálgica"),
    ],
    "emigracao-memoria-e-as-tarefas-da-poesia": [
        (2, 6, "nomear é jamais apagar"),
        (8, 11, "Bordadeira"),
        (13, 18, "rizoma"),
        (20, 21, "Saga"),
        (30, 33, "preparativos"),
        (34, 37, "bagagem"),
        (41, 46, "terra sem homens"),
        (48, 53, "educação pelo silêncio"),
        (55, 56, "Fragmento"),
        (58, 98, "aniki-bóbó"),
        (101, 128, "chegada"),
        (147, 181, "posta restante"),
        (195, 221, "Alguns anos vivi em Itabira"),
    ],
    "joao-ramalho-um-luso-na-historia-e-na-literatura-do-brasil": [
        (23, 50, "Como foi que João Ramalho"),
        (52, 59, "Conquistas Ramalhinas"),
    ],
    "o-poeta-e-a-cidade": [
        (1, 4, "\"Paris muda!"),
        (6, 9, "Cidade a fervilhar"),
        (11, 14, "A rua em torno era um frenético"),
        (22, 36, "Domícilio"),
        (38, 51, "não deixa de ser"),
        (57, 59, "Becos"),
        (61, 62, "menina"),
        (64, 85, "Das mortes"),
    ],
    "os-congressos-de-historia-do-grande-abc-e-as-tarefas-da-poesia": [
        (16, 37, "ÔNIBUS DA MEMÓRIA"),
        (78, 98, "BANDEIRANTES DO TERCEIRO MILÊNIO"),
        (100, 108, "de villa de santo andré"),
    ],
    "pessoa-entranhado": [
        (9, 23, "MÚLTIPLOS"),
        (24, 31, "CANTO EXORCISTA"),
        (32, 43, "FINGIR-SE"),
    ],
    "pessoa-e-saramago-a-palavra-re-veladora": [
        (24, 30, "- Que sei eu do que serei"),
        (33, 39, "Múltiplos"),
    ],
    "poesia-feita-por-mulheres": [
        (12, 28, "MOTIVO"),
        (30, 44, "Que este amor não me cegue"),
        (46, 54, "EROS II"),
        (56, 72, "CASAMENTO"),
        (74, 83, "GUERRA SANTA"),
        (85, 144, "TODAS AS VIDAS"),
        (146, 162, "CANÇÃO"),
        (165, 178, "TELEPOEMA"),
        (180, 192, "8 DE MARÇO"),
        (194, 199, "Deram-lhe um dia"),
    ],
    "poesia-madeirense": [
        (12, 29, "ANTIMEMÓRIA COM FUNCHAL"),
        (40, 57, "PÔR-DO-SOL"),
        (60, 84, "Sete partidas"),
        (87, 100, "De um só golpe"),
        (101, 113, "Mais secreto é o dia"),
        (116, 131, "a ambigüidade não é a que insinua"),
        (134, 140, "A Fala das coisas"),
        (141, 150, "Corpo Mineral"),
        (153, 177, "UM JEITO DE DIZER SOLIDÃO"),
    ],
}

total_marcados = 0
erros = []

for slug, faixas in CURADORIA.items():
    caminho = BASE / slug / "dados.json"
    dados = json.loads(caminho.read_text(encoding="utf-8"))
    texto = dados["texto"]
    ps = list(RE_P.finditer(texto))
    alvos = []
    for ini, fim, prefixo in faixas:
        if fim >= len(ps):
            erros.append(f"{slug}: faixa {ini}-{fim} fora do alcance ({len(ps)} p)")
            continue
        primeiro = texto_plano(ps[ini].group(0))
        norm = lambda s: s.lower().lstrip("\"“”'")
        if not norm(primeiro).startswith(norm(prefixo)[:25]):
            erros.append(f"{slug}: p#{ini} esperava '{prefixo}' mas é '{primeiro[:60]}'")
            continue
        alvos.extend(range(ini, fim + 1))
    if erros and any(e.startswith(slug) for e in erros):
        continue
    # injeta class="verso" (de trás pra frente p/ preservar índices)
    novo = texto
    for i in sorted(set(alvos), reverse=True):
        m = ps[i]
        tag = m.group(0)
        if "class=" in tag[:tag.index(">") + 1]:
            continue  # já tem class (não deve ocorrer)
        abertura_fim = tag.index(">")
        novo_tag = tag[:abertura_fim] + ' class="verso"' + tag[abertura_fim:]
        novo = novo[:m.start()] + novo_tag + novo[m.end():]
    dados["texto"] = novo
    caminho.write_text(json.dumps(dados, ensure_ascii=False, indent=1), encoding="utf-8")
    total_marcados += len(set(alvos))
    print(f"{slug:<58} {len(set(alvos)):>3} parágrafos marcados")

print()
if erros:
    print("ERROS (nada marcado nos ensaios com erro):")
    for e in erros:
        print(" -", e)
else:
    print("Nenhum erro de verificação.")
print(f"TOTAL: {total_marcados} parágrafos de poesia marcados com class='verso'")
