#!/usr/bin/env python3
# Gera src/app/texto/[id]/{slug}/dados.json a partir do site legado.
# Parser tolerante (FrontPage): remove <a> antes de fatiar <p> não fechados.
# Texto VERBATIM da autora; títulos canônicos mapeados manualmente.
import os, re, json, html, unicodedata

SCRIPTS = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(SCRIPTS, "legado", "raw")
BASE_OUT = os.path.join("/home/z/my-project/src/app/texto/[id]")
BASE_URL = "http://www.dalila.telesveras.nom.br"

# ---------------- mapeamento canônico (revisado manualmente) ----------------
ENSAIOS = {  # página -> (titulo, ano, tipo, contexto/Evento, subtitulo)
 1:  ("Café, verso e história", 2007, "Palestra", "Projeto Estação Café, SESC São Caetano", ""),
 2:  ("A Literatura no ABC (Da contemplação à resistência)", 1991, "Artigo", "Revista Raízes no. 4, jan/1991", ""),
 3:  ("Os impróprios nomes próprios como matéria para poesia", 1998, "Ensaio", "RL – Revista Literatura, no. 11, 1998", ""),
 4:  ("Revistas Literárias", 1998, "Ensaio", "Revista A Cigarra no. 33, 1998", ""),
 5:  ("As palavras aí estão, uma por uma...", 2001, "Depoimento", "Casa da Palavra, 07.11.2001", ""),
 6:  ("Ser Editor e Poeta no Grande ABC", 2002, "Palestra", "I Semana do Editor, FAENAC, 2002", ""),
 7:  ("A Cultura na Pauta da Agenda Regional", 2001, "Ensaio", "Coletânea Nosso Século XXI, 2001", ""),
 8:  ("Beats e Marginais – as últimas escolas", 1997, "Ensaio", "Revista A Cigarra no. 30, 1997", ""),
 9:  ("A imprensa alternativa no Brasil como resistência cultural", 1991, "Comunicação", "Colóquio Imprensa de Língua Portuguesa no Mundo, UNESCO, Paris, jun/1991", ""),
 10: ("A evocação de Oswald", 1995, "Palestra", "Evento Retalhos Imortais do SerAfim, out/1995", ""),
 11: ("Seduzir para a poesia: a experiência do grupo Livrespaço – 1983-1993", 2000, "Comunicação", "Encontro de Escritores em Fortaleza, 02.06.2000", ""),
 12: ("Poesia Madeirense", 2000, "Comunicação", "III Encontro Luso-Afro-Brasileiro, 2000", ""),
 13: ("Cidadã Andreense", 2004, "Discurso", "Câmara Municipal de Santo André, 17.03.2004", ""),
 14: ("Sentir-se Português na Diáspora", 0, "Ensaio", "", ""),
 15: ("Para além do Bojador", 1996, "Comunicação", "II Encontro de Artistas Portugueses no Brasil, 1996", ""),
 16: ("Eu nunca estive em Macau", 2000, "Comunicação", "Colóquio de Macau, 18.08.2000", ""),
 17: ("Pessoa Entranhado", 2000, "Depoimento", "Encontro dos 60 anos da morte de Pessoa, 25.11.2000", ""),
 18: ("João Ramalho: um luso na história e na literatura do Brasil", 2003, "Ensaio", "", ""),
 19: ("Poesia feita por mulheres", 1997, "Palestra", "RECAP (Refinaria Capuava), Santo André, 5.04.1997", ""),
 20: ("Joaquim de Montezuma de Carvalho: Embaixador Cultural", 2008, "Comunicação", "Colóquio 400 Anos de Padre António Vieira, 24.04.2008", ""),
 21: ("O Poeta e a Cidade", 0, "Palestra", "", "Anotações para uma conversa"),
 22: ("A vez da utopia na agenda cultural", 2008, "Ensaio", "Obra coletiva Nosso Século XXI, Vol. 2, 2008", ""),
 23: ("Pessoa e Saramago – A palavra (re)veladora", 2010, "Palestra", "Evento Saramago & Pessoa, SESC SP, 17.09.2010", ""),
 24: ("A Amália e o Fado – Estranhas formas de vida", 2011, "Ensaio", "", ""),
 25: ("A Criação literária como matéria de memória e esquecimento", 1999, "Palestra", "Seminário Literatura & Memória, out/1999", ""),
 26: ("Os Congressos de História do Grande ABC e as tarefas da poesia", 2015, "Palestra", "Abertura do XIII Congresso de História do Grande ABC, 2015", ""),
 27: ("Saramago e a poética do humano", 2010, "Ensaio", "", "anotações de leitura"),
 28: ("Emigração, memória e as tarefas da poesia", 2016, "Comunicação", "Funchal, Madeira (Portugal), 10.11.2016", ""),
}
CRONICAS = {  # página -> titulo
 1: "Crônica de Outono", 2: "A Cidade do Meu Desejo", 3: "O Direito ao Silêncio",
 4: "Bibliocasa", 5: "Anotações de Leituras I", 6: "Anotações de Leituras II",
 7: "Anotações de Leituras III", 8: "Anotações de Leituras IV", 9: "A Língua, a Pátria Possível",
}

# ---------------- parser ----------------
def limpar_fragmento(b):
    """Limpa um fragmento HTML preservando i/em/b/strong/u/br."""
    # capitular: <font size="6">X</font> — junta a letra ao resto, sem espaço
    b = re.sub(r'<font[^>]*size="6"[^>]*>\s*([A-ZÀ-Üa-zà-ÿ])\s*</font>\s*', r'\1', b, flags=re.I)
    b = re.sub(r"<\s*/?\s*(font|span)\b[^>]*>", "", b, flags=re.I)          # inline: sem espaço
    b = re.sub(r"<\s*/?\s*(table|tr|td|div|center|body|html|head)\b[^>]*>", " ", b, flags=re.I)  # bloco: com espaço
    b = re.sub(r"<(i|em|b|strong|u|br)\b[^>]*>", lambda m: "<" + m.group(1).lower() + ">", b, flags=re.I)
    b = re.sub(r"</\s*(i|em|b|strong|u)\s*>", lambda m: "</" + m.group(1).lower() + ">", b, flags=re.I)
    b = re.sub(r"<\s*br\s*/?\s*>", "<br>", b, flags=re.I)
    texto = html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", b))).strip()
    html_limpo = html.unescape(re.sub(r"\s+", " ", b)).strip()
    html_limpo = re.sub(r"\s+(<)", r"\1", html_limpo).replace("> <", "><")
    # parágrafo inteiro em itálico (>120 chars) = artefato de estilo do site
    # legado -> remove o envelope; itálico inline e trechos curtos ficam
    mm = re.fullmatch(r"<(i|em)>(.*)</\1>", html_limpo, re.S)
    if mm and len(re.sub(r"<[^>]+>", "", mm.group(2))) > 120:
        html_limpo = mm.group(2).strip()
    # tags órfãs: se contagem abre/fecha não bate, vira texto puro
    for tag in ("i", "em", "b", "strong", "u"):
        if html_limpo.count("<" + tag + ">") != html_limpo.count("</" + tag + ">"):
            html_limpo = texto
            break
    return texto, html_limpo

def extrair_blocos(chave):
    raw = open(os.path.join(RAW, chave + ".htm"), "rb").read().decode("cp1252", errors="replace")
    raw = re.sub(r"<(script|style|head)\b[^>]*>.*?</\1>", " ", raw, flags=re.S | re.I)
    raw = re.sub(r"<a\b[^>]*>.*?</a>", " ", raw, flags=re.S | re.I)  # menu/cabeçalho fora
    frag = re.split(r"</?\s*p\b[^>]*>", raw)
    blocos = []
    for f in frag:
        if not f.strip():
            continue
        t, h = limpar_fragmento(f)
        if not t:
            continue
        if re.sub(r"[^a-z]", "", t.lower()) == "dalilatelesveras":  # cabeçalho padrão
            continue
        blocos.append((t, h))
    return blocos

def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = re.sub(r"[\u0300-\u036f]", "", s)
    return re.sub(r"[^a-z0-9]", "", s)

def caps_norm(s):
    s = unicodedata.normalize("NFD", s.upper())
    s = re.sub(r"[\u0300-\u036f]", "", s)
    return re.sub(r"[^A-Z]", "", s)

def slugify(t):
    s = unicodedata.normalize("NFD", t.lower())
    s = re.sub(r"[\u0300-\u036f]", "", s)
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s

def remover_titulo_duplicado(blocos, titulo, subtitulo=""):
    """Remove blocos iniciais que fazem parte do título/subtítulo (capitulares divididos)."""
    nt = norm(titulo + " " + (subtitulo or ""))
    i = 0
    while i < len(blocos):
        nb = norm(blocos[i][0])
        if len(nb) >= 4 and nb in nt:
            i += 1
        else:
            break
    return blocos[i:]

FONTE_RE = re.compile(r"^\(?\s*(texto|palestra proferida|comunicação|publicado)", re.I)

def montar_json(titulo, tipo, ano, contexto, subtitulo, url_legado, blocos):
    # fragmentos que são só separador "/ / /" -> fora
    blocos = [(t, h) for t, h in blocos if not re.fullmatch(r"[\s/\xa0]*", t)]
    # nota de fonte no fim do corpo -> fonte_original
    fonte = {"texto": f"Site legado Dalila Teles Veras — {url_legado}", "url": url_legado}
    if blocos and FONTE_RE.match(blocos[-1][0]) and len(blocos[-1][0]) < 300:
        fonte["texto"] = blocos[-1][0] + " (site legado: " + url_legado + ")"
        blocos = blocos[:-1]
    corpo = "".join(f"<p>{h}</p>" for _, h in blocos)
    corpo = re.sub(r"(\s*/\s*){2,}\s*</p>\s*$", "</p>", corpo)  # separador final
    fonte["texto"] = re.sub(r"(\s*/\s*){2,}\s*$", "", fonte["texto"])
    dados = {"id": slugify(titulo), "titulo": titulo, "tipo": tipo, "ano": ano,
             "texto": corpo, "fonte_original": fonte}
    if subtitulo: dados["subtitulo"] = subtitulo
    if contexto: dados["contexto"] = {"evento": contexto}
    return dados

# ---------------- traduções (caso especial: texto único) ----------------
POEMAS_TRAD = {"EL CRIMEN FUE EN GRANADA", "O CRIME FOI EM GRANADA",
               "ESE GRAN SIMULACRO", "ESSE GRANDE SIMULACRO",
               "AH LAS PRIMICIAS", "AH AS PRIMICIAS",
               # títulos de seção dos poemas (merecem a mesma ênfase)
               "EL CRIMEN", "O CRIME", "EL POETA Y LA MUERTE", "O POETA E A MORTE"}
POEMAS_NORM = {caps_norm(p) for p in POEMAS_TRAD} | {"TRADUCOES"}
ROMANOS = {"I", "II", "III", "IV", "V"}

def montar_traducoes():
    blocos = extrair_blocos("traducoes")
    partes = []
    modo_verso = False
    for t, h in blocos:
        tn = t.strip()
        cn = caps_norm(tn)
        if re.sub(r"[^A-Z]", "", cn) == "DALILATELESVERAS" or cn == "TRADUCOES":
            continue
        if cn in POEMAS_NORM:
            modo_verso = True
            partes.append(f'<p class="titulo-poema"><strong>{t}</strong></p>')
            continue
        if tn in ("Antonio Machado", "Mario Benedetti"):
            modo_verso = False
            partes.append(f"<h2>{t}</h2>")
            continue
        if tn.startswith("A CONTRADIÇÃO DA MODERNIDADE"):
            partes.append(f"<h3>{t}</h3>")
            continue
        if re.match(r"^A\s+Federico", tn) or tn in ("A Federico Garcia Lorca",):
            partes.append(f'<p class="dedicatoria"><em>{t}</em></p>')
            continue
        if tn.startswith("("):  # notas de publicação
            modo_verso = False
            partes.append(f'<p class="nota-fonte"><em>{t}</em></p>')
            continue
        if modo_verso and (len(tn) < 130 or tn in ROMANOS):
            if tn in ROMANOS:
                partes.append(f'<p class="verso"><strong>{t}</strong></p>')
            else:
                partes.append(f'<p class="verso">{h}</p>')
            continue
        modo_verso = False
        partes.append(f"<p>{h}</p>")
    return "".join(partes)

# ---------------- geração ----------------
relatorio, usados = [], set()
def salvar(dados, pasta_fonte):
    slug = dados["id"]
    base = slug; n = 2
    while slug in usados:
        slug = f"{base}-{n}"; n += 1
    dados["id"] = slug
    usados.add(slug)
    destino = os.path.join(BASE_OUT, slug)
    os.makedirs(destino, exist_ok=True)
    with open(os.path.join(destino, "dados.json"), "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=1)
    relatorio.append((slug, dados["titulo"], dados["ano"], len(dados["texto"])))

# ensaios
for n in range(1, 29):
    titulo, ano, tipo, contexto, subtitulo = ENSAIOS[n]
    blocos = extrair_blocos(f"palestras{n}")
    blocos = remover_titulo_duplicado(blocos, titulo, subtitulo)
    d = montar_json(titulo, "ensaio", ano, contexto, subtitulo,
                    f"{BASE_URL}/palestrasdalilatelesveras{n}.htm", blocos)
    salvar(d, f"palestras{n}")

# crônicas
for n in range(1, 10):
    titulo = CRONICAS[n]
    blocos = extrair_blocos(f"cronicas{n}")
    blocos = remover_titulo_duplicado(blocos, titulo)
    d = montar_json(titulo, "cronica", "1999-2004", "Coluna Viaverbo — Caderno Cultura & Lazer, Diário do Grande ABC", "",
                    f"{BASE_URL}/cr%C3%B4nicasdalilatelesveras{n}.htm", blocos)
    salvar(d, f"cronicas{n}")

# traduções (texto único)
corpo = re.sub(r"(\s*/\s*){2,}\s*</p>\s*$", "</p>", montar_traducoes())  # separador final
d = {"id": "traducoes", "titulo": "Traduções", "tipo": "traducao", "ano": 2000,
     "subtitulo": "Antonio Machado e Mario Benedetti em versões bilíngues",
     "texto": corpo,
     "fonte_original": {"texto": "Revista A Cigarra nº 31 (ago/1997) e nº 35 (jun/2000), Santo André, SP",
                        "url": f"{BASE_URL}/Tradu%C3%A7%C3%B5es.htm"}}
salvar(d, "traducoes")

print(f"{'SLUG':45s} {'ANO':>9s} {'TAM':>7s}  TÍTULO")
for slug, titulo, ano, tam in relatorio:
    print(f"{slug:45s} {str(ano):>9s} {tam:>7d}  {titulo[:60]}")
print(f"\nTOTAL: {len(relatorio)} textos em {BASE_OUT}")
