#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Task 62 reconstruída — gerador das 35 fichas de Leituras Críticas (34) + Estudo Crítico (1)
# Parser = limpar_fragmento do gerar_textos_legado.py COM a correção da Task 62
# (não colapsar whitespace antes de tags inline i/em/b/strong/u).
import os, re, json, html, unicodedata, sys

SCRIPTS = "/home/z/my-project/scripts"
LEG = os.path.join(SCRIPTS, "legado_leituras")
OUT = "/home/z/my-project/src/app/texto/[id]"
BASE = "http://www.dalila.telesveras.nom.br"

# ---------------- parser (corrigido) ----------------
INLINE = ("i", "em", "b", "strong", "u")

def limpar_fragmento(b):
    b = re.sub(r'<font[^>]*size="6"[^>]*>\s*([A-ZÀ-Üa-zà-ÿ])\s*</font>\s*', r'\1', b, flags=re.I)
    b = html.unescape(b)  # ANTES do colapso: &nbsp; vira \xa0 e colapsa junto (lição do \xa0)
    b = re.sub(r"<(i|em|b|strong|u)\b[^>]*>", lambda m: "<" + m.group(1).lower() + ">", b, flags=re.I)
    b = re.sub(r"</\s*(i|em|b|strong|u)\s*>", lambda m: "</" + m.group(1).lower() + ">", b, flags=re.I)
    b = re.sub(r"<\s*br\s*/?\s*>", "<br>", b, flags=re.I)
    # texto puro: TODAS as tags (inclusive SmartTags st1:/st2: do Word) viram espaço
    texto = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", b)).strip()
    # protege as preservadas e remove qualquer outra tag do html_limpo
    keep = []
    def _k(m):
        keep.append(m.group(0))
        return f"\x00{len(keep)-1}\x00"
    b = re.sub(r"</(?:i|em|b|strong|u)>|<(?:i|em|b|strong|u)>|<br>", _k, b)
    html_limpo = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", b)).strip()
    html_limpo = re.sub(f"\x00(\\d+)\x00", lambda m: keep[int(m.group(1))], html_limpo)
    # CORREÇÃO Task 62: espaço antes/depois de tag só some para <br>; espaço adjacente a inline é TEXTO e fica
    html_limpo = re.sub(r" ?(<br>)+ ?", r"\1", html_limpo)
    mm = re.fullmatch(r"<(i|em)>(.*)</\1>", html_limpo, re.S)
    if mm and len(re.sub(r"<[^>]+>", "", mm.group(2))) > 120:
        html_limpo = mm.group(2).strip()
    for tag in INLINE:
        if html_limpo.count("<" + tag + ">") != html_limpo.count("</" + tag + ">"):
            html_limpo = texto
            break
    return texto, html_limpo

def blocos_do_td(td):
    frag = re.split(r"</?\s*p\b[^>]*>", td)
    out = []
    for f in frag:
        if not f.strip():
            continue
        t, h = limpar_fragmento(f)
        if not t:
            continue
        if re.sub(r"[^a-z]", "", t.lower()) == "dalilatelesveras":
            continue
        if re.sub(r"[^a-z0-9]", "", t.lower()) in ("indice", "mapadosite", "indicedosite"):
            continue
        out.append((t, h))
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

def td0(arq, idx):
    h = open(os.path.join(LEG, arq + ".utf8"), encoding="utf-8").read()
    trs = re.findall(r"<tr[^>]*>(.*?)</tr>", h, flags=re.S | re.I)
    tds = re.findall(r"<td[^>]*>(.*?)</td>", trs[idx], flags=re.S | re.I)
    return tds[0]

# ---------------- curadoria (bloco a bloco, como na Task 62 original) ----------------
# (arquivo, tr_idx, tipo, titulo, remover_prefixos_norm[], autor, ano, livro, nota, split_primeiro_prefixo)
L = []
def add(arq, idx, titulo, autor, ano, livro, remover=(), nota="", tipo="leitura-critica", split_primeiro=None):
    L.append(dict(arq=arq, idx=idx, titulo=titulo, autor=autor, ano=ano, livro=livro,
                  remover=list(remover), nota=nota, tipo=tipo, split=split_primeiro))

# ESTRANHAS FORMAS DE VIDA (2013) — 1
add("LeiturasCríticasEstranhasFormasDeVida.htm", 4,
    "A estranheza poética dos fatos no cotidiano em Dalila", "Luiz Roberto Alves", 0,
    "Estranhas Formas de Vida")
# RETRATOS FALHADOS (2008) — 2
add("LeiturasCríticasRetratosFalhados.htm", 6, "Retratos Falhados", "Irene Lucília Andrade", 2009,
    "Retratos Falhados",
    remover=["RETRATOS FALHADOS – Dalila Teles Veras (*)", "Por Irene Lucília Andrade"],
    nota="Apresentação do livro Retratos Falhados na Festa do Livro do Funchal, Pavilhão dos Autores, 28.05.09")
add("LeiturasCríticasRetratosFalhados.htm", 9, "Pintura do Cotidiano", "Álvaro Alves de Faria", 2008,
    "Retratos Falhados",
    remover=["Pintura do Cotidiano"])
# À JANELA DOS DIAS (2002) — 13 (ordem do legado TR02→TR17)
add("Leituras Críticas Janela dos Dias.htm", 2, "Poesia na Janela", "Joaquim Branco", 2002,
    "À Janela dos dias", split_primeiro="Poesia na Janela")
add("Leituras Críticas Janela dos Dias.htm", 3, "Dalila, à janela dos dias", "Francisco Miguel de Moura", 2003,
    "À Janela dos dias", remover=["Dalila, à janela dos dias"])
add("Leituras Críticas Janela dos Dias.htm", 4, "um quase inverno", "Geraldo Neres", 0,
    "À Janela dos dias", remover=["um quase inverno"])
add("Leituras Críticas Janela dos Dias.htm", 5, None, "Ricardo Corona", 0, "À Janela dos dias")
add("Leituras Críticas Janela dos Dias.htm", 7, None, "Batista de Lima", 0, "À Janela dos dias")
add("Leituras Críticas Janela dos Dias.htm", 8, None, "Francisco Filardi", 2002, "À Janela dos dias")
add("Leituras Críticas Janela dos Dias.htm", 10, None, "Dinovaldo Giglioli", 0, "À Janela dos dias")
add("Leituras Críticas Janela dos Dias.htm", 11, None, "Jornal O Capital, julho 2002, Aracaju, Sergipe", 2002, "À Janela dos dias")
add("Leituras Críticas Janela dos Dias.htm", 12, None, "Fábio Lucas", 0, "À Janela dos dias")
add("Leituras Críticas Janela dos Dias.htm", 13, None, "Anderson Braga Horta", 0, "À Janela dos dias")
add("Leituras Críticas Janela dos Dias.htm", 15, None, "Roldan-Roldan", 0, "À Janela dos dias")
add("Leituras Críticas Janela dos Dias.htm", 16, None, "Hugo Pontes", 2002, "À Janela dos dias")
add("Leituras Críticas Janela dos Dias.htm", 17, None, "Elmar Carvalho", 0, "À Janela dos dias")
# VESTÍGIOS (2003) — 12
add("LeiturasCríticasVestígios.htm", 3, None, "Deise Assumpção", 2003, "Vestígios")
add("LeiturasCríticasVestígios.htm", 4, None, "Rosana Chrispim", 0, "Vestígios")
add("LeiturasCríticasVestígios.htm", 5, None, "José de Souza Martins", 0, "Vestígios")
add("LeiturasCríticasVestígios.htm", 6, None, "Ronaldo Cagiano", 0, "Vestígios")
add("LeiturasCríticasVestígios.htm", 8, None, "Marcos (Sidnei Euzébio)", 0, "Vestígios")
add("LeiturasCríticasVestígios.htm", 9, None, "Maria de Lourdes Hortas", 0, "Vestígios")
add("LeiturasCríticasVestígios.htm", 11, None, "Sérgio de Castro Pinto", 0, "Vestígios")
add("LeiturasCríticasVestígios.htm", 12, None, "Fernando Fiorese", 0, "Vestígios")
add("LeiturasCríticasVestígios.htm", 13, "Que sabemos nós da barca à espera da passagem do mistério",
    "Hugo Pontes", 2003, "Vestígios")
add("LeiturasCríticasVestígios.htm", 14, None, "Zhô Bertholini", 0, "Vestígios")
add("LeiturasCríticasVestígios.htm", 16, None, "Maria José Giglio", 0, "Vestígios")
add("LeiturasCríticasVestígios.htm", 17, "Para quem perdeu um ente querido", "Nicodemos Sena", 2004,
    "Vestígios", remover=["PARA QUEM PERDEU UM ENTE QUERIDO", "Nicodemos Sena"])
# AS ARTES DO OFÍCIO (2000) — 3
add("Leituras Críticas As Artes do Ofício.htm", 2, "As Artes do Ofício – Um olhar sobre o ABC",
    "Luís Alberto de Abreu", 0, "As Artes do Ofício",
    remover=["As Artes do Ofício – Um olhar sobre o ABC", "Luís Alberto de Abreu"])
add("Leituras Críticas As Artes do Ofício.htm", 3, "Um Olhar sobre o ABC e seu Imaginário",
    "Rosana Chrispim", 0, "As Artes do Ofício",
    remover=["Um Olhar sobre o ABC e seu Imaginário", "Rosana Chrispim"])
add("Leituras Críticas As Artes do Ofício.htm", 5, "Lentes Atentas", "Fabiano Calixto", 2000,
    "As Artes do Ofício", remover=["Lentes Atentas", "Fabiano Calixto"])
# A VIDA CRÔNICA (1999) — 3
add("Leituras Críticas A Vida Crônica.htm", 9, "Pessoas, coisas, dias", "Tarso de Melo", 0,
    "A Vida Crônica", remover=["PESSOAS, COISAS, DIAS", "Tarso de Melo"])
add("Leituras Críticas A Vida Crônica.htm", 13, "Em torno de um livro de crônicas", "Caio Porfírio Carneiro", 2000,
    "A Vida Crônica", remover=["EM TORNO DE UM LIVRO DE CRÔNICAS", "Caio Porfírio Carneiro"])
add("Leituras Críticas A Vida Crônica.htm", 17, "Poeta crônica", "Fabiano Calixto", 2001,
    "A Vida Crônica", remover=["POETA CRÔNICA", "Fabiano Calixto"])
# ESTUDO CRÍTICO — 1
add("EstudosCriticos1.htm", 2, "Resistência e assimilação em Dalila Teles Veras", "Clara Moura Lourenço", 2009,
    "Estudos críticos",
    remover=["RESISTÊNCIA E ASSIMILAÇÃO EM DALILA TELES VERAS", "Clara Moura Lourenço – Universidade de Coimbra"],
    tipo="estudo-critico")

URLS = {
    "LeiturasCríticasEstranhasFormasDeVida.htm": BASE + "/LeiturasCr%C3%ADticasEstranhasFormasDeVida.htm",
    "LeiturasCríticasRetratosFalhados.htm": BASE + "/LeiturasCr%C3%ADticasRetratosFalhados.htm",
    "Leituras Críticas Janela dos Dias.htm": BASE + "/Leituras%20Cr%C3%ADticas%20Janela%20dos%20Dias.htm",
    "LeiturasCríticasVestígios.htm": BASE + "/LeiturasCr%C3%ADticasVest%C3%ADgios.htm",
    "Leituras Críticas As Artes do Ofício.htm": BASE + "/Leituras%20Cr%C3%ADticas%20As%20Artes%20do%20Of%C3%ADcio.htm",
    "Leituras Críticas A Vida Crônica.htm": BASE + "/Leituras%20Cr%C3%ADticas%20A%20Vida%20Cr%C3%B4nica.htm",
    "EstudosCriticos1.htm": BASE + "/EstudosCriticos1.htm",
}

def titulo_de_carta(texto):
    """Título de leitura sem cabeçalho próprio: 1ª sentença (>=20c), cortada em vírgula/aspas se longa."""
    escolhido = None
    for m in re.finditer(r"[.!?]", texto):
        if m.end() >= 20:
            escolhido = texto[:m.end()]
            break
    if escolhido is None:
        escolhido = texto[:100]
    sent = escolhido.rstrip(" \u00a0")
    sent = sent.rstrip(".,;:\"”’").rstrip()
    if len(sent) > 40:
        limite = min(len(sent), 110)
        corte = max(sent.rfind(",", 0, limite), sent.rfind("”", 0, limite), sent.rfind('"', 0, limite))
        if corte >= 20:
            sent = sent[:corte].rstrip(" ,;:\"”’").rstrip()
    if len(sent) > 95:
        esp = sent.rfind(" ", 0, 95)
        if esp >= 20:
            sent = sent[:esp]
    return sent.strip()

def limpa_titulo(t):
    """Cosmética do METADADO título (o texto integral permanece verbatim)."""
    t = re.sub(r"\s+", " ", t).strip()
    t = re.sub(r"\s+([.,;:!?])", r"\1", t)
    t = re.sub(r"([“\"])(\s+)", r"\1", t)
    t = re.sub(r"\s+([”\"])", r"\1", t)
    t = re.sub(r"\s+\)", ")", t)
    t = re.sub(r"\(\s+", "(", t)
    t = t.rstrip(" ,;:.").strip()
    if t.count("“") > t.count("”"):
        t += "”"
    if t.count('"') % 2 == 1:
        t += '"'
    return t

# ---------------- geração ----------------
feitas = []
for item in L:
    td = td0(item["arq"], item["idx"])
    blocos = blocos_do_td(td)
    texto_plano_antes = " ".join(t for t, h in blocos)
    # remove blocos iniciais &nbsp;-only e cabeçalho
    while blocos and not re.sub(r"[\s\u00a0]", "", blocos[0][0]):
        blocos.pop(0)
    for pref in item["remover"]:
        np = norm(pref)
        if blocos and norm(blocos[0][0]) == np:
            blocos.pop(0)
    # split "Poesia na Janela – ..." no 1º bloco
    if item["split"]:
        t, h = blocos[0]
        if t.startswith(item["split"] + " –"):
            corta = len(item["split"]) + 2
            hs = re.search(r"\s", h[corta - 1:])
            nb_h = h[corta:].lstrip()
            blocos[0] = (t[corta:].lstrip(), nb_h)
        elif t == item["split"]:
            blocos.pop(0)
    if not blocos:
        print(f"ABORT: blocos vazios em {item['arq']} TR{item['idx']}")
        sys.exit(1)
    texto = "".join("<p>" + h + "</p>" for t, h in blocos)
    texto_plano = " ".join(t for t, h in blocos)
    # poema "10 de junho" da página do estudo (TR3) — incluído na ficha, como na Task 62
    if item["arq"] == "EstudosCriticos1.htm":
        poema = blocos_do_td(td0("EstudosCriticos1.htm", 3))
        poema = [(t, h) for t, h in poema if re.sub(r"[\s\u00a0]", "", t)]
        if poema:
            texto += "".join("<p>" + h + "</p>" for t, h in poema)
            texto_plano += " " + " ".join(t for t, h in poema)
    # título de carta se None
    titulo = limpa_titulo(item["titulo"] or titulo_de_carta(texto_plano))
    # guardas
    assert titulo and len(titulo) >= 10, f"titulo curto: {titulo!r}"
    assert norm(titulo) in norm(texto_plano_antes) or item["split"], f"titulo fora do texto: {titulo!r}"
    assert "<" not in titulo, "tag no titulo"
    assert texto.count("<p>") == texto.count("</p>"), "p desbalanceado"
    for tg in INLINE:
        assert texto.count("<" + tg + ">") == texto.count("</" + tg + ">"), f"{tg} desbalanceado"
    assert not re.search(r"[\u0080-\u009F]", texto), "C1 no texto"
    slug = slugify(titulo)
    ficha = {
        "id": slug,
        "titulo": titulo,
        "tipo": item["tipo"],
        "subtitulo": "Por " + item["autor"],
        "ano": item["ano"],
        "texto": texto,
        "contexto": {"evento": "Sobre " + item["livro"]} if item["livro"] != "Estudos críticos"
                    else {"evento": "IV Congresso A Voz e a Vez da Mulher Portuguesa na Diáspora: Brasil e outros lugares"},
        "fonte_original": {"texto": "Site legado Dalila Teles Veras — " + URLS[item["arq"]],
                           "url": URLS[item["arq"]]},
    }
    if item["nota"]:
        ficha["fonte_original"]["nota"] = item["nota"]
    dest = os.path.join(OUT, slug, "dados.json")
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "w", encoding="utf-8") as f:
        json.dump(ficha, f, ensure_ascii=False, indent=2)
        f.write("\n")
    feitas.append(dict(slug=slug, titulo=titulo, autor=item["autor"], ano=item["ano"],
                       livro=item["livro"], tipo=item["tipo"]))

print(f"FICHAS GERADAS: {len(feitas)} (esperado 35)")
slugs = [f["slug"] for f in feitas]
assert len(set(slugs)) == len(slugs), "slugs duplicados"
for f in feitas:
    print(f"  {f['slug']}  [{f['livro']}]  {f['titulo'][:60]}")
with open(os.path.join(SCRIPTS, "lc_geradas.json"), "w", encoding="utf-8") as f:
    json.dump(feitas, f, ensure_ascii=False, indent=2)
