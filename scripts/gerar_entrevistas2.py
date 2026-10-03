#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Tasks 64-67 reconstruídas — gerador das 7 fichas de entrevista (estado final pós-67):
# parágrafos próprios p/ Q&A, perguntas class="pergunta", zero C1 (decode CP1252), verbatim.
import os, re, json, html, unicodedata, sys

SCRIPTS = "/home/z/my-project/scripts"
LEG = os.path.join(SCRIPTS, "legado_entrevistas")
OUT = "/home/z/my-project/src/app/texto/[id]"
BASE = "http://www.dalila.telesveras.nom.br"
INLINE = ("i", "em", "b", "strong", "u")

def limpar_fragmento(b):
    b = re.sub(r'<font[^>]*size="6"[^>]*>\s*([A-ZÀ-Üa-zà-ÿ])\s*</font>\s*', r'\1', b, flags=re.I)
    b = html.unescape(b)
    b = re.sub(r"<(i|em|b|strong|u)\b[^>]*>", lambda m: "<" + m.group(1).lower() + ">", b, flags=re.I)
    b = re.sub(r"</\s*(i|em|b|strong|u)\s*>", lambda m: "</" + m.group(1).lower() + ">", b, flags=re.I)
    b = re.sub(r"<\s*br\s*/?\s*>", "<br>", b, flags=re.I)
    texto = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", b)).strip()
    keep = []
    def _k(m):
        keep.append(m.group(0))
        return f"\x00{len(keep)-1}\x00"
    b = re.sub(r"</(?:i|em|b|strong|u)>|<(?:i|em|b|strong|u)>|<br>", _k, b)
    html_limpo = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", b)).strip()
    html_limpo = re.sub(f"\x00(\\d+)\x00", lambda m: keep[int(m.group(1))], html_limpo)
    html_limpo = re.sub(r" ?(<br>)+ ?", r"\1", html_limpo)
    mm = re.fullmatch(r"<(i|em)>(.*)</\1>", html_limpo, re.S)
    if mm and len(re.sub(r"<[^>]+>", "", mm.group(2))) > 120:
        html_limpo = mm.group(2).strip()
    for tag in INLINE:
        if html_limpo.count("<" + tag + ">") != html_limpo.count("</" + tag + ">"):
            html_limpo = texto
            break
    return texto, html_limpo

def blocos_da_pagina(arq, tr=3):
    h = open(os.path.join(LEG, arq), "rb").read().decode("cp1252")
    trs = re.findall(r"<tr[^>]*>(.*?)</tr>", h, flags=re.S | re.I)
    td = re.findall(r"<td[^>]*>(.*?)</td>", trs[tr], flags=re.S | re.I)[0]
    frag = re.split(r"</?\s*p\b[^>]*>", td)
    out = []
    for f in frag:
        if not f.strip():
            continue
        t, hh = limpar_fragmento(f)
        if not t:
            continue
        if re.sub(r"[^a-z]", "", t.lower()) == "dalilatelesveras":
            continue
        out.append((t, hh))
    return out

def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = re.sub(r"[\u0300-\u036f]", "", s)
    return re.sub(r"[^a-z0-9]", "", s)

def slugify(t):
    s = unicodedata.normalize("NFD", t.lower())
    s = re.sub(r"[\u0300-\u036f]", "", s)
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s

def guardas(paragrafos):
    texto = "".join(paragrafos)
    assert len(re.findall(r"<p[ >]", texto)) == texto.count("</p>"), "p desbalanceado"
    for tg in INLINE:
        assert texto.count("<" + tg + ">") == texto.count("</" + tg + ">"), f"{tg} desbalanceado"
    assert not re.search(r"[\u0080-\u009F]", texto), "C1"
    assert "st1:" not in texto and "st2:" not in texto, "SmartTags"

FICHAS = [
    # (arq, titulo, ano, subtitulo, contexto, lista_descricao, montar)
    ("Entrevistadalilatelesveras01.htm", "IMES-NOTÍCIAS", 2004, "",
     "IMES-NOTÍCIAS — Ano XIV - Nº 93, Novembro de 2004",
     "Ano XIV - Nº 93, Novembro de 2004", "imes"),
    ("Entrevistadalilatelesveras02.htm", "PD Literatura", 2002, "Por Rodrigo de Souza Leão",
     "Revista virtual PD Literatura",
     "Por Rodrigo de Souza Leão", "pd"),
    ("Entrevistadalilatelesveras03.htm", "Floriano Martins", 2008, "",
     "À guisa de prefácio do livro Retratos Falhados",
     "Prefácio de Retratos Falhados", "floriano"),
    ("Entrevistadalilatelesveras04.htm", "Álvaro Alves de Faria", 2009, "",
     "Livro Pastores de Virgílio — A literatura na voz de seus poetas e escritores (Ed. Escrituras, SP, 2009)",
     "Pastores de Virgílio (Ed. Escrituras, SP, 2009)", "alvaro"),
    ("Entrevistadalilatelesveras05.htm", "Sérgio Simka", 2012, "Por Sérgio Simka",
     "Portal Mauá e Região, setembro de 2012",
     "Por Sérgio Simka", "sergio"),
    ("Entrevistadalilatelesveras06.htm", "Selmo Vasconcellos", 0, "Por Selmo Vasconcellos",
     "Portal selmovasconcellos.com.br",
     "Por Selmo Vasconcellos", "selmo"),
    ("Entrevistadalilatelesveras07.htm", "Tarso de Melo", 2015, "",
     "Enquete \u201cSobre poesia, ainda\u201d com poetas brasileiros",
     "Enquete \u201cSobre poesia, ainda\u201d", "tarso"),
]

def montar_imes(bs):
    assert len(bs) == 2, f"IMES: {len(bs)} blocos"
    intro = bs[0][1]
    gig = bs[1][1]
    # remove <br>s iniciais e finais do gigante
    gig = re.sub(r"^(?:\s|<br>)+", "", gig)
    gig = re.sub(r"(?:\s|<br>)+$", "", gig)
    partes = re.split(r"(?=<b>(?:IN|Dalila)</b>)", gig)
    partes = [p for p in partes if re.sub(r"<[^>]+>", "", p).strip()]
    assert len(partes) == 14, f"IMES: {len(partes)} partes"
    ps = []
    nq = na = 0
    for p in partes:
        if p.startswith("<b>IN</b>"):
            ps.append('<p class="pergunta">' + p + "</p>")
            nq += 1
        else:
            ps.append("<p>" + p + "</p>")
            na += 1
    assert nq == 7 and na == 7, f"IMES: q={nq} a={na}"
    return ["<p>" + intro + "</p>"] + ps

def montar_pd(bs):
    assert len(bs) == 29, f"PD: {len(bs)} blocos"
    ps = []
    for n, (t, hh) in enumerate(bs):
        if n >= 9 and n % 2 == 1:  # B09,B11,...,B27 = perguntas
            assert t.startswith("PD -"), f"PD pergunta B{n}: {t[:40]!r}"
            ps.append('<p class="pergunta">' + hh + "</p>")
        else:
            ps.append("<p>" + hh + "</p>")
    assert sum(1 for p in ps if 'class="pergunta"' in p) == 10
    return ps

def montar_floriano(bs):
    assert len(bs) == 27, f"FL: {len(bs)} blocos"
    pergs = {2, 4, 8, 14, 16, 18, 20, 22, 24}
    ps = []
    for n, (t, hh) in enumerate(bs):
        if n in pergs:
            assert t.startswith("FM "), f"FL pergunta B{n}: {t[:40]!r}"
            ps.append('<p class="pergunta">' + hh + "</p>")
        else:
            ps.append("<p>" + hh + "</p>")
    assert sum(1 for p in ps if 'class="pergunta"' in p) == 9
    return ps

def montar_alvaro(bs):
    assert len(bs) == 31, f"AL: {len(bs)} blocos"
    pergs = {1, 8, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29}
    ps = []
    for n, (t, hh) in enumerate(bs):
        if n == 7:  # misto: pergunta 2 + <br><br> + resposta DTV
            t2 = t
            pos = t2.find(" DTV - ")
            assert pos > 0, "misto sem DTV"
            pergunta = t2[:pos].strip()
            resposta = t2[pos + 1:].strip()  # mantém "DTV - ..."
            ps.append('<p class="pergunta">' + pergunta + "</p>")
            ps.append("<p>" + resposta + "</p>")
        elif n in pergs:
            ps.append('<p class="pergunta">' + hh + "</p>")
        else:
            ps.append("<p>" + hh + "</p>")
    assert sum(1 for p in ps if 'class="pergunta"' in p) == 13
    return ps

def montar_sergio(bs):
    assert len(bs) == 23, f"SE: {len(bs)} blocos"
    ps = []
    for n, (t, hh) in enumerate(bs):
        if n == 0:
            ps.append("<p>" + hh + "</p>")
        elif n % 2 == 1:  # perguntas B01..B21
            ps.append('<p class="pergunta">' + hh + "</p>")
        else:
            assert t.startswith("-"), f"SE resposta B{n}: {t[:40]!r}"
            ps.append("<p>" + hh + "</p>")
    assert sum(1 for p in ps if 'class="pergunta"' in p) == 11
    return ps

def montar_selmo(bs):
    assert len(bs) == 63, f"SL: {len(bs)} blocos"
    pergs = {1, 3, 5, 7, 9, 11}
    ps = []
    for n, (t, hh) in enumerate(bs):
        if n in pergs:
            assert t.startswith("SELMO VASCONCELLOS"), f"SL pergunta B{n}: {t[:40]!r}"
            ps.append('<p class="pergunta">' + hh + "</p>")
        else:
            ps.append("<p>" + hh + "</p>")
    assert sum(1 for p in ps if 'class="pergunta"' in p) == 6
    return ps

def montar_tarso(bs):
    assert len(bs) == 26, f"TA: {len(bs)} blocos"
    pergs = {2, 11, 13, 15, 17}
    ps = []
    for n, (t, hh) in enumerate(bs):
        if n in pergs:
            assert re.match(r"^[1-5]\.", t), f"TA pergunta B{n}: {t[:40]!r}"
            ps.append('<p class="pergunta">' + hh + "</p>")
        else:
            ps.append("<p>" + hh + "</p>")
    assert sum(1 for p in ps if 'class="pergunta"' in p) == 5
    return ps

MONTADORES = {"imes": montar_imes, "pd": montar_pd, "floriano": montar_floriano,
              "alvaro": montar_alvaro, "sergio": montar_sergio, "selmo": montar_selmo,
              "tarso": montar_tarso}

feitas = []
for arq, titulo, ano, subtitulo, contexto, lista_desc, chave in FICHAS:
    bs = blocos_da_pagina(arq)
    ps = MONTADORES[chave](bs)
    guardas(ps)
    texto = "".join(ps)
    slug = "entrevista-" + slugify(titulo)
    url = BASE + "/Entrevistadalilatelesveras0" + arq.split("0")[-1][0] + ".htm"
    ficha = {
        "id": slug,
        "titulo": titulo,
        "tipo": "entrevista",
    }
    if subtitulo:
        ficha["subtitulo"] = subtitulo
    ficha["ano"] = ano
    ficha["texto"] = texto
    ficha["contexto"] = {"evento": contexto}
    ficha["fonte_original"] = {"texto": "Site legado Dalila Teles Veras — " + url, "url": url}
    dest = os.path.join(OUT, slug, "dados.json")
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "w", encoding="utf-8") as f:
        json.dump(ficha, f, ensure_ascii=False, indent=2)
        f.write("\n")
    feitas.append(dict(slug=slug, titulo=titulo, ano=ano, descricao=lista_desc, tipo="Entrevista"))
    print(f"{slug}: {len(texto)}c, perguntas={sum(1 for p in ps if 'pergunta' in p)}")

assert len(feitas) == 7
with open(os.path.join(SCRIPTS, "ent_geradas.json"), "w", encoding="utf-8") as f:
    json.dump(feitas, f, ensure_ascii=False, indent=2)
print("TOTAL PERGUNTAS:", sum(1 for p in ps for p in ps) and "")
total = 0
for arq, *_ in FICHAS:
    bs = blocos_da_pagina(arq)
total_q = 0
for f in feitas:
    d = json.load(open(os.path.join(OUT, f["slug"], "dados.json"), encoding="utf-8"))
    total_q += d["texto"].count('class="pergunta"')
print("perguntas coloridas no total:", total_q, "(esperado 61)")
