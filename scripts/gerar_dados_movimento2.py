#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Task 68 reconstruída — repovoar as 9 subtabs do Ativismo Cultural a partir dos JSONs curados da usuária (Drive)
# Schema de saída = moldura ArquivoCategoria idêntica ao Institucionais.json sobrevivente.
import os, re, json, shutil

RAIZ = "/home/z/my-project"
DRIVE = os.path.join(RAIZ, "scripts/drive_movimento")
DEST = os.path.join(RAIZ, "src/app/data/movimento")
BACKUP = os.path.join(RAIZ, "scripts/backup_movimento_stubs")

MESES = {"janeiro": 1, "fevereiro": 2, "março": 3, "abril": 4, "maio": 5, "junho": 6,
         "julho": 7, "agosto": 8, "setembro": 9, "outubro": 10, "novembro": 11, "dezembro": 12}

def parse_data(s):
    """4 padrões: 'D de M de A' | 'D a D de M de A' | 'D de M a D de M de A' | 'M de A'"""
    s = s.strip()
    m = re.match(r"^(\d{1,2}) de (\w+) a (\d{1,2}) de (\w+) de (\d{4})$", s, flags=re.I)
    if m:
        d1, m1, d2, m2, a = m.groups()
        return f"{a}-{MESES[m1.lower()]:02d}-{int(d1):02d}", f"{a}-{MESES[m2.lower()]:02d}-{int(d2):02d}"
    m = re.match(r"^(\d{1,2}) a (\d{1,2}) de (\w+) de (\d{4})$", s, flags=re.I)
    if m:
        d1, d2, m1, a = m.groups()
        return f"{a}-{MESES[m1.lower()]:02d}-{int(d1):02d}", f"{a}-{MESES[m1.lower()]:02d}-{int(d2):02d}"
    m = re.match(r"^(\d{1,2}) de (\w+) de (\d{4})$", s, flags=re.I)
    if m:
        d1, m1, a = m.groups()
        return f"{a}-{MESES[m1.lower()]:02d}-{int(d1):02d}", None
    m = re.match(r"^(\w+) de (\d{4})$", s, flags=re.I)
    if m:
        m1, a = m.groups()
        return f"{a}-{MESES[m1.lower()]:02d}-00", None
    raise ValueError(f"formato de data não reconhecido: {s!r}")

TAG_SUBCAT = {
    "Palestra": ["palestra"], "Conferência": ["conferencia"],
    "Oficina": ["oficina"], "Workshop": ["workshop"],
    "Sarau": ["sarau"], "Recital": ["recital"],
    "Congresso": ["congresso"], "Seminário": ["seminario"], "Simpósio": ["simposio"],
    "Mesa de Debate": ["mesa_de_debates"], "Roda de Conversa": ["roda_de_conversa"],
    "Leitura Pública": ["leitura_poetica"], "Encontro": ["encontro"],
    "Entrevista": ["entrevista"], "Programa de TV": ["programa"], "Live": ["live"],
    "Podcast": ["podcast"], "Curadoria": ["curadoria"], "Consultoria": ["consultoria"],
    "Curadoria e Consultoria": ["curadoria", "consultoria"],
}

ARQUIVOS = [
    # (drive, saida, prefixo, categoria, descricao, filtro_tipo)
    ("palestras-conferencias.json", "Palestras.json", "pale", "palestras", "Palestras e conferências da autora", None),
    ("oficina-workshops.json", "OficinasWorkshops.json", "ofic", "oficinas_workshops", "Oficinas literárias e workshops", None),
    ("saraus-recitais.json", "SarausRecitais.json", "saru", "saraus_recitais", "Participações em saraus e recitais", None),
    ("congressos-seminarios.json", "CongressosSeminariosSimposios.json", "cong", "congressos_seminarios", "Congressos, seminários e simpósios", None),
    ("mesas-debate-rodas-conversa.json", "ConferenciasMesas.json", "conf", "conferencias_mesas", "Mesas de debate e rodas de conversa", None),
    ("encontros-leituras.json", "LeiturasPoeticas.json", "leit", "leituras_poeticas", "Leituras públicas de poesia", {"Leitura Pública"}),
    ("encontros-leituras.json", "EncontrosAtividadesCulturais.json", "enct", "encontros_atividades_culturais", "Encontros e atividades culturais", {"Encontro"}),
    ("entrevistas-programas.json", "ProgramasEntrevistas.json", "prog", "programas_entrevistas", "Programas de TV, entrevistas, lives e podcasts", None),
    ("curadoria-consultoria.json", "CuradoriaConsultoria.json", "cura", "curadoria_consultoria", "Curadorias e consultorias culturais", None),
]
# lives-podcasts vai JUNTO em ProgramasEntrevistas (Task 68)
COMPOSTOS = {"ProgramasEntrevistas.json": ["entrevistas-programas.json", "lives-podcasts.json"]}

def converter(reg, prefixo, n):
    data, data_fim = parse_data(reg["dataCompleta"])
    cidade = reg.get("cidade", "")
    estado = reg.get("estado", "")
    pais = "Brasil"
    if estado == "Internacional":
        pais = "Portugal"   # Funchal, Madeira (Task 68)
        estado = ""
    tags = list(TAG_SUBCAT.get(reg.get("tipo", ""), []))
    if reg.get("modalidade") == "virtual":
        tags.append("virtual")
    r = {
        "id": f"{prefixo}-{n:03d}",
        "numero_ordem": n,
        "titulo_evento": reg["titulo"],
        "slug_texto": "",
        "data": data,
        "local": reg.get("local", ""),
        "cidade": cidade,
        "estado": estado,
        "pais": pais,
        "categoria_principal": None,  # preenchido por arquivo
        "tags": tags,
        "texto_original": reg.get("descricao", ""),
    }
    if data_fim:
        r["data_fim"] = data_fim
    return r

# backup dos stubs antigos
os.makedirs(BACKUP, exist_ok=True)
for _, saida, _, _, _, _ in ARQUIVOS:
    orig = os.path.join(DEST, saida)
    if os.path.exists(orig):
        shutil.copy2(orig, os.path.join(BACKUP, saida))

# Institucionais e ativismo intocados
for _, saida, prefixo, cat, desc, _ in ARQUIVOS:
    fonte_direta = [a for a, s, _, _, _, _ in ARQUIVOS if s == saida][0]
    fontes = COMPOSTOS.get(saida, [fonte_direta])
    regs = []
    for fonte in fontes:
        regs.extend(json.load(open(os.path.join(DRIVE, fonte), encoding="utf-8")))
    ft = [ft for a, s, _, _, _, ft in ARQUIVOS if s == saida][0]
    if ft:
        regs = [r for r in regs if r.get("tipo") in ft]
    regs.sort(key=lambda r: (r.get("ano", 0), r.get("dataCompleta", "")))
    registros = [converter(r, prefixo, n + 1) for n, r in enumerate(regs)]
    for r in registros:
        r["categoria_principal"] = cat
    tags_comuns = sorted({t for r in registros for t in r["tags"]})
    doc = {
        "categoria": cat,
        "total_registros": len(registros),
        "descricao": desc,
        "tags_comuns": tags_comuns,
        "registros": registros,
    }
    with open(os.path.join(DEST, saida), "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"{saida}: {len(registros)} registros (tags: {tags_comuns})")

# contagem final
total = 0
for _, saida, _, _, _, _ in ARQUIVOS:
    d = json.load(open(os.path.join(DEST, saida)))
    total += d["total_registros"]
print("TOTAL:", total, "(esperado 38 + 0 Institucionais = 38 novos)")
