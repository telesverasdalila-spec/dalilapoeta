#!/usr/bin/env python3
# Baixa e extrai os textos do site legado de Dalila Teles Veras
# Saída: scripts/legado/extraidos/{slug}.json (título + parágrafos HTML limpos)
import os, re, json, html, subprocess, unicodedata

BASE = "http://www.dalila.telesveras.nom.br"
RAW = os.path.join(os.path.dirname(__file__), "raw")
EXTRA = os.path.join(os.path.dirname(__file__), "extraidos")
os.makedirs(RAW, exist_ok=True)
os.makedirs(EXTRA, exist_ok=True)

# ---------- lista de páginas ----------
paginas = []  # (chave_local, url, fonte)
for n in range(1, 29):
    paginas.append((f"palestras{n}", f"{BASE}/palestrasdalilatelesveras{n}.htm", "ensaio"))
CRONICAS = [
    "Crônica de Outono", "A Cidade do meu desejo", "O Direito ao Silêncio",
    "Bibliocasa", "Anotações de Leituras i", "Anotações de Leituras ii",
    "Anotações de Leituras iii", "Anotações de Leituras iv", "A Língua, a Pátria Possível",
]
for n in range(1, 10):
    # URL do legado usa "crônicas" com acento (codificado em UTF-8)
    paginas.append((f"cronicas{n}", f"{BASE}/cr%C3%B4nicasdalilatelesveras{n}.htm", "cronica"))
paginas.append(("traducoes", f"{BASE}/Tradu%C3%A7%C3%B5es.htm", "traducao"))

def baixar(chave, url):
    dest = os.path.join(RAW, chave + ".htm")
    if os.path.exists(dest) and os.path.getsize(dest) > 500:
        return dest
    r = subprocess.run(["curl", "-s", "--max-time", "40", url, "-o", dest], capture_output=True)
    if r.returncode != 0 or not os.path.exists(dest) or os.path.getsize(dest) < 500:
        return None
    return dest

def blocos_limpos(raw):
    """Extrai blocos <p> não-link, limpa tags, devolve (texto_plano, html_limpo)."""
    saida = []
    for m in re.finditer(r"<p\b[^>]*>(.*?)</p>", raw, re.S | re.I):
        b = m.group(1)
        if re.search(r"<a\s", b, re.I):  # blocos com link = menu/cabeçalho
            continue
        # preserva apenas i/em/b/strong/u/br; descarta font/span e atributos
        b = re.sub(r"<\s*/?\s*(font|span|h\d|table|tr|td|div)\b[^>]*>", " ", b, flags=re.I)
        b = re.sub(r"<(i|em|b|strong|u|br)\b[^>]*>", lambda m: "<" + m.group(1).lower() + ">", b, flags=re.I)
        b = re.sub(r"</\s*(i|em|b|strong|u)\s*>", lambda m: "</" + m.group(1).lower() + ">", b, flags=re.I)
        b = re.sub(r"</?\s*br\s*/?\s*>", "<br>", b, flags=re.I)
        texto = html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", b))).strip()
        html_limpo = html.unescape(re.sub(r"\s+", " ", b)).strip()
        html_limpo = re.sub(r"\s+(<)", r"\1", html_limpo).replace("> <", "><")
        if texto:
            saida.append((texto, html_limpo))
    return saida

def slugify(t):
    s = unicodedata.normalize("NFD", t.lower())
    s = re.sub(r"[\u0300-\u036f]", "", s)
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s

resumo = []
for chave, url, fonte in paginas:
    dest = baixar(chave, url)
    if not dest:
        resumo.append((chave, "ERRO DOWNLOAD", fonte))
        continue
    raw = open(dest, "rb").read().decode("cp1252", errors="replace")
    blocos = blocos_limpos(raw)
    # remove cabeçalho padrão "D Alila Teles Veras"
    blocos = [b for b in blocos if re.sub(r"[^a-z]", "", b[0].lower()) != "dalilatelesveras"]
    resumo.append((chave, f"{len(blocos)} blocos | 1º: {blocos[0][0][:60] if blocos else '-'}", fonte))

print("=== RESUMO DOWNLOAD/EXTRAÇÃO ===")
for r in resumo:
    print(f"{r[0]:14s} [{r[2]:8s}] {r[1]}")

# salva extração bruta para revisão
for chave, url, fonte in paginas:
    dest = os.path.join(RAW, chave + ".htm")
    if not os.path.exists(dest):
        continue
    raw = open(dest, "rb").read().decode("cp1252", errors="replace")
    blocos = blocos_limpos(raw)
    blocos = [b for b in blocos if re.sub(r"[^a-z]", "", b[0].lower()) != "dalilatelesveras"]
    with open(os.path.join(EXTRA, chave + ".json"), "w", encoding="utf-8") as f:
        json.dump({"fonte": fonte, "url": url, "blocos": [{"t": t, "h": h} for t, h in blocos]},
                  f, ensure_ascii=False, indent=1)
print("\nExtração salva em scripts/legado/extraidos/")
