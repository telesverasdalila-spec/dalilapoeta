#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Verificação visual e de conteúdo das fichas (pós-recuperação).
Roda contra o dev server em localhost:3000 — use dentro de uma chamada
com o servidor vivo (ver mega-chamada no worklog).
Gera screenshots em download/verificacao-recuperacao/ + relatório de conteúdo.
"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"
DEST = Path("/home/z/my-project/download/verificacao-recuperacao")
DEST.mkdir(parents=True, exist_ok=True)

resultados: list[tuple[str, bool]] = []


def checar(nome: str, pagina, *termos: str) -> None:
    html = pagina.content()
    for t in termos:
        ok = t in html
        resultados.append((f"{nome}: {t}", ok))
        print(f"  [{'OK' if ok else 'FALTA'}] {nome}: {t}")


def shot(pagina, nome: str) -> None:
    caminho = DEST / f"{nome}.png"
    pagina.screenshot(path=str(caminho), full_page=True)
    print(f"  [shot] {caminho.name}")


def ir(pagina, url: str, espera: float = 2.0):
    pagina.goto(BASE + url, wait_until="networkidle", timeout=60000)
    pagina.wait_for_timeout(int(espera * 1000))


with sync_playwright() as p:
    browser = p.chromium.launch()
    pg = browser.new_page(viewport={"width": 1360, "height": 900})

    # ---- Home eixo obra (listagem) ----
    ir(pg, "/?eixo=obra", 2.5)
    checar("home-obra", pg, "À Janela dos dias", "Conheça a obra")
    shot(pg, "home-obra")

    # ---- À Janela dos Dias ----
    ir(pg, "/obra/a-janela-dos-dias", 2.5)
    checar("janela", pg, "À Janela dos Dias", "Tarso de Melo", "Poesia quase toda", "ESGOTADO")
    shot(pg, "janela-01-topo")
    pg.get_by_role("button", name="Trechos", exact=True).click()
    pg.wait_for_timeout(800)
    pg.get_by_role("button", name="Vida murada", exact=True).click()
    pg.wait_for_timeout(800)
    checar("janela-trechos", pg, "Retirado do livro", "Lições de Tempo (1983)", "Sombrios")
    shot(pg, "janela-02-origem")
    pg.get_by_role("button", name="Dados da Edição", exact=True).click()
    pg.wait_for_timeout(800)
    checar("janela-dados", pg, "978-8588014176", "Alpharrabio Edições, SP", "Esgotada")
    shot(pg, "janela-03-dados")

    # ---- Vestígios ----
    ir(pg, "/obra/vestigios", 2.5)
    checar("vestigios", pg, "memória de minha mãe", "Machado de Assis", "ESGOTADO")
    shot(pg, "vestigios-01-escada")
    pg.get_by_role("button", name="Poemas", exact=True).click()
    pg.wait_for_timeout(800)
    checar("vestigios-poemas", pg, "Terapia intensiva", "A rotina da perda")
    shot(pg, "vestigios-02-poemas")

    # ---- Pecados ----
    ir(pg, "/obra/pecados", 2.5)
    checar("pecados", pg, "gnósticos", "ESGOTADO")
    shot(pg, "pecados-01-sobre")
    pg.get_by_role("button", name="Trechos", exact=True).click()
    pg.wait_for_timeout(800)
    pg.get_by_role("button", name="Inveja", exact=True).first.click()
    pg.wait_for_timeout(800)
    checar("pecados-trechos", pg, "desenho de", "André Miranda", "Da insaciável cobiça")
    shot(pg, "pecados-02-arte")

    # ---- Ficha mínima (Lições de Tempo: só Dados da Edição) ----
    ir(pg, "/obra/licoes-de-tempo", 2.5)
    checar("licoes", pg, "Lições de Tempo", "Dados da Edição")
    shot(pg, "licoes-01-dados")

    # ---- Opções (disponivel → botão loja) ----
    ir(pg, "/obra/opcoes-para-morrer-no-espaco", 2.5)
    pg.get_by_role("button", name="Adquira", exact=True).click()
    pg.wait_for_timeout(800)
    checar("opcoes", pg, "IR PARA A LOJA ALPHARRABIO", "loja virtual")
    shot(pg, "opcoes-01-adquira")

    # ---- Slug inexistente → Página em construção ----
    ir(pg, "/obra/obra-inexistente", 2)
    checar("inexistente", pg, "Página em construção")
    shot(pg, "inexistente-01")

    # ---- CronoBiografia ----
    ir(pg, "/?eixo=vida", 2.5)
    checar("home-vida", pg, "CRONOBIOGRAFIA")
    shot(pg, "home-vida")

    browser.close()

falhas = [r for r in resultados if not r[1]]
print(f"\n===== RESULTADO: {len(resultados) - len(falhas)}/{len(resultados)} checagens OK =====")
if falhas:
    print("FALHAS:")
    for nome, _ in falhas:
        print("  -", nome)
    sys.exit(1)
print("TODAS AS CHECAGENS PASSARAM")
