#!/usr/bin/env python3
"""Task 80 — Verificação em navegador do novo fluxo do Diuturnos:
- 12 meses na MESMA página (sem botões-aba de mês)
- Títulos dos meses em dourado #8b6914
- 11 linhas finas separadoras entre os 12 meses
- Imagens alternando esquerda (mês ímpar) / direita (mês par)
- Imagens carregam (naturalWidth > 0)
- Zero referência ao site legado
- Regressão: Pecados e A Janela dos Dias mantêm navegação por botões
"""
import re
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"
ok, fail = [], []

def check(nome, cond, extra=""):
    (ok if cond else fail).append(f"{nome}{(' — ' + extra) if extra else ''}")

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 900})

    # ---------- DIUTURNOS ----------
    r = pg.goto(f"{BASE}/obra/diuturnos", wait_until="networkidle")
    check("HTTP 200 /obra/diuturnos", r.status == 200, str(r.status))
    pg.wait_for_timeout(500)

    # Aba Trechos
    pg.get_by_role("button", name=re.compile("^Trechos$", re.I)).first.click()
    pg.wait_for_timeout(700)
    html = pg.content()

    # 1) Sem botões-aba de mês (janeiro..dezembro como botões)
    botoes_mes = pg.locator("button", has_text=re.compile("^janeiro$", re.I)).count()
    check("Sem botões-aba de mês", botoes_mes == 0, f"{botoes_mes} botões 'janeiro'")

    # 2) 12 títulos de mês visíveis, em ordem
    meses = ["janeiro","fevereiro","março","abril","maio","junho",
             "julho","agosto","setembro","outubro","novembro","dezembro"]
    h2s = pg.locator("h2").all_inner_texts()
    h2_low = [h.strip().lower() for h in h2s]
    pos = [h2_low.index(m) if m in h2_low else -1 for m in meses]
    check("12 meses presentes como h2", all(x >= 0 for x in pos), f"posições {pos}")
    check("Meses em ordem cronológica", pos == sorted(pos) and all(x >= 0 for x in pos))

    # 3) Dourado nos títulos (computed color rgb(139,105,20))
    dourados = 0
    for m in meses:
        el = pg.locator("h2", has_text=re.compile(m, re.I)).first
        cor = el.evaluate("e => getComputedStyle(e).color")
        if cor == "rgb(139, 105, 20)":
            dourados += 1
    check("12 títulos dourados rgb(139,105,20)", dourados == 12, f"{dourados}/12")

    # 4) 11 linhas separadoras finas (height 1px) na aba trechos
    linhas = pg.locator("div[style*='linear-gradient'][style*='height: 1px']").count()
    check("11 linhas finas separadoras", linhas == 11, f"{linhas} linhas")

    # 5) Alternância: mês 0 imagem à esquerda, mês 1 à direita, mês 2 à esquerda
    def pos_imagem(indice_mes):
        h2 = pg.locator("h2", has_text=re.compile(meses[indice_mes], re.I)).first
        row = h2.locator("xpath=following-sibling::div[1]")
        img = row.locator("img").first
        box_img = img.bounding_box()
        box_row = row.bounding_box()
        meio = box_row["x"] + box_row["width"] / 2
        return "esq" if box_img["x"] + box_img["width"] / 2 < meio else "dir"
    p0, p1, p2, p11 = pos_imagem(0), pos_imagem(1), pos_imagem(2), pos_imagem(11)
    check("Mês 1 (janeiro) imagem à ESQUERDA", p0 == "esq", p0)
    check("Mês 2 (fevereiro) imagem à DIREITA", p1 == "dir", p1)
    check("Mês 3 (março) imagem à ESQUERDA", p2 == "esq", p2)
    check("Mês 12 (dezembro) imagem à DIREITA", p11 == "dir", p11)

    # 6) Todas as 12 imagens carregam
    imgs = pg.locator("img[src*='diuturnos-']").all()
    carregadas = sum(1 for im in imgs if im.evaluate("e => e.naturalWidth") > 0)
    check("12 imagens dos meses carregadas", carregadas == 12, f"{carregadas}/12")

    # 7) Sem referência ao site legado
    check("Sem 'site legado'", "site legado" not in html.lower())

    # Screenshot topo + meio (alternância visível)
    pg.screenshot(path="download/shot80-diuturnos-topo.png")
    h2marco = pg.locator("h2", has_text=re.compile("março", re.I)).first
    h2marco.scroll_into_view_if_needed()
    pg.evaluate("window.scrollBy(0, -90)")
    pg.wait_for_timeout(300)
    pg.screenshot(path="download/shot80-diuturnos-meio.png")

    # ---------- REGRESSÃO: PECADOS (botões de navegação mantidos) ----------
    r = pg.goto(f"{BASE}/obra/pecados", wait_until="networkidle")
    check("HTTP 200 /obra/pecados", r.status == 200)
    pg.get_by_role("button", name=re.compile("^Trechos$", re.I)).first.click()
    pg.wait_for_timeout(600)
    # Pecados tem botões de trecho (os pecados) — ainda presentes
    btn_trecho = pg.locator("div[style*='borderBottom: \"1px solid #ebebeb\"'] button, div[style*='borderBottom: 1px solid #ebebeb'] button")
    n_btn = btn_trecho.count()
    check("Pecados mantém botões de trecho", n_btn >= 7, f"{n_btn} botões")
    cor_titulo = pg.locator("h2").first.evaluate("e => getComputedStyle(e).color")
    check("Pecados título escuro (não dourado)", cor_titulo != "rgb(139, 105, 20)", cor_titulo)

    # ---------- REGRESSÃO: A JANELA DOS DIAS ----------
    r = pg.goto(f"{BASE}/obra/a-janela-dos-dias", wait_until="networkidle")
    check("HTTP 200 /obra/a-janela-dos-dias", r.status == 200)
    pg.get_by_role("button", name=re.compile("^Trechos$", re.I)).first.click()
    pg.wait_for_timeout(600)
    origem = pg.locator("text=Retirado do livro").count()
    check("Janela dos Dias mantém bloco origem", origem >= 1, f"{origem} blocos")

    # ---------- REGRESSÃO: home ----------
    r = pg.goto(BASE, wait_until="networkidle")
    check("HTTP 200 home", r.status == 200)

    b.close()

print(f"\n===== RESULTADO: {len(ok)} OK / {len(fail)} FALHAS =====")
for o in ok:
    print(" ✓", o)
for f in fail:
    print(" ✗", f)
exit(1 if fail else 0)
