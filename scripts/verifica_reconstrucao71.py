#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Task 71 — verificação integrada da reconstrução (leituras, entrevistas, movimento, conceito, fichas)
from playwright.sync_api import sync_playwright
import sys

BASE = "http://localhost:3000"
erros = []
ok = 0

def check(cond, msg):
    global ok
    if cond:
        ok += 1
        print(f"  ok {ok:02d} - {msg}")
    else:
        erros.append(msg)
        print(f"  FAIL   - {msg}")

with sync_playwright() as pw:
    br = pw.chromium.launch()
    pg = br.new_page(viewport={"width": 1360, "height": 900})

    # ---------- 1. Leituras Críticas agrupadas por livro ----------
    pg.goto(BASE + "/?eixo=obra", wait_until="domcontentloaded")
    pg.wait_for_timeout(3500)
    pg.locator("button", has_text="Obras").first.click(); pg.wait_for_timeout(800)
    pg.locator("button", has_text="Resenhas").first.click(); pg.wait_for_timeout(900)
    pg.locator("button", has_text="Leituras Críticas").first.click(); pg.wait_for_timeout(900)
    corpo = pg.inner_text("body").upper()
    check("2013 - ESTRANHAS FORMAS DE VIDA" in corpo, "leituras: cabeçalho 2013 - Estranhas")
    check("2008 - RETRATOS FALHADOS" in corpo, "leituras: 2008 - Retratos")
    check("2003 - VESTÍGIOS" in corpo, "leituras: 2003 - Vestígios")
    check("2002 - À JANELA DOS DIAS" in corpo, "leituras: 2002 - À Janela")
    check("2000 - AS ARTES DO OFÍCIO" in corpo, "leituras: 2000 - Artes")
    check("1999 - A VIDA CRÔNICA" in corpo, "leituras: 1999 - Vida Crônica")
    hrefs = pg.locator("a", has_text="Leia").evaluate_all("els => els.map(e => e.getAttribute('href'))")
    leituras = [h for h in hrefs if h and "/texto/" in h]
    check(len(leituras) == 34, f"leituras: 34 links Leia (veio {len(leituras)})")
    check("- POR LUIZ ROBERTO ALVES" in corpo, "leituras: linha - por autor -")
    pg.screenshot(path="/home/z/my-project/scripts/shot71-leituras-agrupadas.png")

    # ---------- 2. Estudos Críticos ----------
    pg.locator("button", has_text="Estudos Críticos").first.click(); pg.wait_for_timeout(700)
    corpo = pg.inner_text("body")
    check("Resistência e assimilação em Dalila Teles Veras" in corpo, "estudos: título do estudo")
    check("Clara Moura Lourenço" in corpo, "estudos: autora")
    check("Leia o texto" in corpo, "estudos: link Leia o texto")

    # ---------- 3. Ficha de leitura ----------
    r = pg.goto(BASE + "/texto/poesia-na-janela", wait_until="domcontentloaded")
    pg.wait_for_timeout(1200)
    corpo = pg.inner_text("body")
    check(r.status == 200 and "Poesia na Janela" in corpo, "ficha leitura: /texto/poesia-na-janela")
    check("LEITURA CRÍTICA" in corpo.upper(), "ficha leitura: rótulo LEITURA CRÍTICA")
    check("Joaquim Branco" in corpo, "ficha leitura: autora Joaquim Branco")
    check("Sobre À Janela dos dias" in corpo, "ficha leitura: contexto Sobre <livro>")

    # ---------- 4. Entrevistas ----------
    pg.goto(BASE + "/?eixo=obra", wait_until="domcontentloaded")
    pg.wait_for_timeout(3000)
    pg.locator("button", has_text="Obras").first.click(); pg.wait_for_timeout(600)
    pg.locator("button", has_text="Escritos").first.click(); pg.wait_for_timeout(800)
    pg.locator("button", has_text="Entrevistas").first.click(); pg.wait_for_timeout(900)
    corpo = pg.inner_text("body")
    check("IMES-NOTÍCIAS" in corpo, "entrevistas: IMES na lista")
    check("Álvaro Alves de Faria" in corpo, "entrevistas: Álvaro na lista")
    check("Selmo Vasconcellos" in corpo, "entrevistas: Selmo na lista")
    hrefs = pg.locator("a", has_text="Leia o texto").evaluate_all("els => els.map(e => e.getAttribute('href'))")
    ents = [h for h in hrefs if h and "entrevista-" in h]
    check(len(ents) == 7, f"entrevistas: 7 links (veio {len(ents)})")

    pg.goto(BASE + "/texto/entrevista-alvaro-alves-de-faria", wait_until="domcontentloaded")
    pg.wait_for_timeout(1400)
    cor = pg.locator("p.pergunta").first.evaluate("el => getComputedStyle(el).color")
    check(cor == "rgb(122, 59, 90)", f"entrevista Álvaro: 1ª pergunta cor {cor}")
    n_perg = pg.locator("p.pergunta").count()
    check(n_perg == 13, f"entrevista Álvaro: 13 perguntas (veio {n_perg})")
    corpo = pg.inner_text("body")
    check("Álvaro Alves de Faria – Dalila, você está inteira" in corpo, "entrevista Álvaro: 1ª pergunta com travessão correto")
    check("Página em construção" not in corpo, "entrevista Álvaro: com ficha")
    pg.screenshot(path="/home/z/my-project/scripts/shot71-entrevista-alvaro.png")

    pg.goto(BASE + "/texto/entrevista-imes-noticias", wait_until="domcontentloaded")
    pg.wait_for_timeout(1200)
    n_perg = pg.locator("p.pergunta").count()
    check(n_perg == 7, f"entrevista IMES: 7 perguntas (veio {n_perg})")

    # ---------- 5. Movimento: 9 subtabs ----------
    pg.goto(BASE + "/?eixo=movimento", wait_until="domcontentloaded")
    pg.wait_for_timeout(2500)
    pg.locator("button", has_text="Ativismo").first.click(); pg.wait_for_timeout(800)
    check("Nenhum registro" not in pg.inner_text("body"), "movimento: sem 'Nenhum registro'")
    SUBTABS = [
        ("Palestras &", "Funchal", "Portugal"),
        ("Saraus &", "Virtual", None),
        ("Congressos &", None, None),
        ("Conferências &", None, None),
        ("Encontros & Reuniões", None, None),
        ("Atividades Culturais", "Encontro com a escritora", None),
        ("Programas &", None, None),
        ("Curadoria &", "curadoria", None),
        ("Leituras P", "Poetas pela Democracia", None),
    ]
    for label, marca, _ in SUBTABS:
        btn = pg.locator("button", has_text=label).first
        if btn.count() == 0:
            check(False, f"movimento: subtab '{label}' não achada")
            continue
        btn.click(); pg.wait_for_timeout(700)
        ct = pg.inner_text("body")
        check("Nenhum registro" not in ct, f"movimento '{label}': com registros")
        if marca:
            check(marca in ct, f"movimento '{label}': marca '{marca}' visível")
    pg.locator("button", has_text="Palestras &").first.click(); pg.wait_for_timeout(900)
    corpo_m = pg.inner_text("body")
    check("Funchal" in corpo_m and "Portugal" in corpo_m, "movimento: Funchal mostra Portugal")
    pg.locator("button", has_text="Saraus &").first.click(); pg.wait_for_timeout(800)
    check("virtual" in pg.inner_text("body").lower(), "movimento: pill virtual presente")
    pg.screenshot(path="/home/z/my-project/scripts/shot71-movimento.png")

    # ---------- 6. Ficha conceito (Passageira) ----------
    pg.goto(BASE + "/obra/passageira-antologia-pessoal-1982-2024", wait_until="domcontentloaded")
    pg.wait_for_timeout(1300)
    corpo = pg.inner_text("body")
    check("Antologia Pessoal 1982-2024" in corpo, "passageira: subtítulo")
    up = corpo.upper()
    check("LILIAN SAIS" in up, "passageira: orelha Lilian Sais")
    check("ORELHA" in up, "passageira: bloco Orelha")
    bt_d = pg.locator("button", has_text="Dados da Edição")
    if bt_d.count():
        bt_d.first.click(); pg.wait_for_timeout(600)
    up2 = pg.inner_text("body").upper()
    check("978-655155-012-6" in up2, "passageira: cartão ISBN")
    check("Impressões de Minas" in corpo, "passageira: editora")
    pg.locator("button", has_text="Trechos").first.click(); pg.wait_for_timeout(500)
    check("recusa" in pg.inner_text("body"), "passageira: trecho 'recusa'")
    pg.screenshot(path="/home/z/my-project/scripts/shot71-passageira.png")

    pg.goto(BASE + "/obra/opcoes-para-morrer-no-espaco", wait_until="domcontentloaded")
    pg.wait_for_timeout(1200)
    corpo = pg.inner_text("body")
    up = corpo.upper()
    check("AMANDA VITAL" in up, "opções: orelha Amanda Vital")
    bt_d = pg.locator("button", has_text="Dados da Edição")
    if bt_d.count():
        bt_d.first.click(); pg.wait_for_timeout(600)
    check("SEMIFINALISTA DO PRÊMIO OCEANOS 2025" in pg.inner_text("body").upper(), "opções: cartão Prêmio")

    pg.goto(BASE + "/obra/insulas", wait_until="domcontentloaded")
    pg.wait_for_timeout(1200)
    corpo = pg.inner_text("body")
    check("Dalila Teles Veras" in corpo, "ínsulas: subtítulo")
    bt_d = pg.locator("button", has_text="Dados da Edição")
    if bt_d.count():
        bt_d.first.click(); pg.wait_for_timeout(600)
    check("Ed. Fósforo" in pg.inner_text("body"), "ínsulas: cartão Fósforo")

    # ---------- 7. Alpharrabio + Minudências ----------
    pg.goto(BASE + "/obra/alpharrabio-12-anos", wait_until="domcontentloaded")
    pg.wait_for_timeout(1200)
    corpo = pg.inner_text("body")
    check("uma história em curso" in corpo, "alpharrabio: subtítulo")
    check("registro de uma casa de livros" in corpo, "alpharrabio: citação da autora")
    bt_d = pg.locator("button", has_text="Dados da Edição")
    if bt_d.count():
        bt_d.first.click(); pg.wait_for_timeout(600)
    check("Luzia Maninha" in pg.inner_text("body"), "alpharrabio: coautoria")
    check("Página em construção" not in corpo, "alpharrabio: com ficha")
    img = pg.locator("img[alt='Capa do livro Alpharrabio 12 anos']")
    check(img.count() == 1 and img.evaluate("el => el.naturalWidth") > 0, "alpharrabio: capa decodificada")

    pg.goto(BASE + "/obra/minudencias", wait_until="domcontentloaded")
    pg.wait_for_timeout(1200)
    corpo = pg.inner_text("body")
    check('"O imaginário do Grande ABC durante 1999' in corpo, "minudências: Sobre P1 verbatim")
    check("A idéia inicial surgiu" in corpo, "minudências: P2 com idéia verbatim")
    bt_d = pg.locator("button", has_text="Dados da Edição")
    if bt_d.count():
        bt_d.first.click(); pg.wait_for_timeout(600)
    corpo_d = pg.inner_text("body")
    check("16 x 23 cm" in corpo_d and "136 pp." in corpo_d, "minudências: formato e páginas")
    check("Página em construção" not in corpo, "minudências: com ficha")
    pg.screenshot(path="/home/z/my-project/scripts/shot71-minudencias.png")

    # ---------- 8. Listagem Prosa: 6 links + 2 fichas ----------
    pg.goto(BASE + "/?eixo=obra", wait_until="domcontentloaded")
    pg.wait_for_timeout(3000)
    pg.locator("button", has_text="Obras").first.click(); pg.wait_for_timeout(600)
    hrefs_poesia = pg.locator("a", has_text="Conheça a obra").evaluate_all("els => els.map(e => e.getAttribute('href'))")
    for slug in ["a-palavraparte---pequenas-prosas-em-poemas", "poeticas-das-circunstancias",
                 "forasteiros---registros-nordestinos", "elemento-furia",
                 "madeira---do-vinho-a-saudade"]:
        check(f"/obra/{slug}" in hrefs_poesia, f"poesia: link → {slug}")
    pg.locator("button", has_text="Prosa").first.click(); pg.wait_for_timeout(800)
    hrefs = pg.locator("a", has_text="Conheça a obra").evaluate_all("els => els.map(e => e.getAttribute('href'))")
    for slug in ["as-artes-do-oficio---um-olhar-sobre-o-abc", "alpharrabio-12-anos", "minudencias"]:
        check(f"/obra/{slug}" in hrefs, f"prosa: link → {slug}")

    br.close()

print()
if erros:
    print(f"FALHOU: {len(erros)} problema(s):")
    for e in erros:
        print(" -", e)
    sys.exit(1)
print(f"TUDO OK — {ok} checks")
