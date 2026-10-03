# -*- coding: utf-8 -*-
"""
Task 72 — Verificação browser da ficha "José Armando Pereira da Silva sobre
Dalila Teles Veras" (estudo crítico, legado 2002):
  1) ficha /texto/jose-armando-pereira-da-silva-sobre-dalila-teles-veras
     completa (h1, subtítulo, rótulo, 11 parágrafos, itálicos, fonte)
  2) aba Resenhas > subtab Estudos Críticos com 2 cartões, novo cartão
     com "Leia o texto →" apontando para a ficha
  3) clique no link navega para a ficha
Screenshots: scripts/shot72-*.png
"""
import asyncio
import re
import sys

from playwright.async_api import async_playwright

BASE = "http://localhost:3000"
SLUG = "jose-armando-pereira-da-silva-sobre-dalila-teles-veras"

RESULTADOS: list[tuple[str, bool]] = []


def check(nome: str, ok: bool) -> None:
    RESULTADOS.append((nome, ok))
    print(("OK   " if ok else "FALHOU ") + nome)


async def main() -> int:
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1440, "height": 1000})

        # ---------- 1) FICHA ----------
        resp = await page.goto(f"{BASE}/texto/{SLUG}", wait_until="domcontentloaded")
        await page.wait_for_timeout(1500)
        check("ficha HTTP 200", resp is not None and resp.status == 200)

        corpo = await page.inner_text("body")

        check("h1 'Dalila Teles Veras'",
              await page.locator("h1", has_text="Dalila Teles Veras").count() > 0)
        check("subtítulo 'Texto de José Armando Pereira da Silva'",
              "Texto de José Armando Pereira da Silva" in corpo)
        check("rótulo 'ESTUDO CRÍTICO • 2002'",
              re.search(r"estudo cr[ií]tico\s*•\s*2002", corpo, re.I) is not None)
        check("1º parágrafo verbatim",
              "O que nos chegou da Ilha da Madeira naquele dia de 1957" in corpo)
        check("trecho Barrault verbatim",
              "Somos todos cidadãos do mundo e um homem de sua aldeia" in corpo)
        check("ortografia pré-acordo 'freqüência'", "freqüência" in corpo)
        check("assinatura itálica final",
              "José Armando Pereira da Silva / 2002" in corpo)
        check("bloco Fonte AUSENTE (Task 73, pedido da usuária)",
              "dalila.telesveras.nom.br" not in corpo and "site legado" not in corpo.lower())
        check("não é 'Página em construção'", "Página em construção" not in corpo)

        n_paragrafos = await page.locator("main.corpo-texto > p").count()
        check(f"corpo com 11 parágrafos (veio {n_paragrafos})", n_paragrafos == 11)

        n_italicos = await page.locator("main.corpo-texto i").count()
        check(f"itálicos semânticos >= 6 (veio {n_italicos})", n_italicos >= 6)

        await page.screenshot(path="/home/z/my-project/scripts/shot72-estudo-jose-armando-ficha.png", full_page=False)

        # ---------- 2) ABA ESTUDOS CRÍTICOS ----------
        await page.goto(f"{BASE}/?eixo=obra", wait_until="domcontentloaded")
        await page.wait_for_timeout(1500)

        await page.get_by_role("button", name="Resenhas").click()
        await page.wait_for_timeout(800)
        await page.get_by_role("button", name="Estudos Críticos").click()
        await page.wait_for_timeout(1000)

        corpo_aba = await page.inner_text("body")
        check("cartão antigo: Resistência e assimilação",
              "Resistência e assimilação em Dalila Teles Veras" in corpo_aba)
        check("cartão novo: 'Dalila Teles Veras'",
              "Dalila Teles Veras" in corpo_aba)
        check("cartão novo: 'Texto de José Armando Pereira da Silva'",
              "Texto de José Armando Pereira da Silva" in corpo_aba)
        check("selo 'Estudo Crítico' no cartão (case-insensitive)",
              "estudo crítico" in corpo_aba.lower())

        links = page.get_by_role("link", name="Leia o texto →")
        n_links = await links.count()
        check(f"2 cartões com 'Leia o texto →' (veio {n_links})", n_links == 2)

        await page.screenshot(path="/home/z/my-project/scripts/shot72-aba-estudos.png", full_page=False)

        # ---------- 3) CLIQUE NO LINK DO NOVO CARTÃO ----------
        novo = page.get_by_role("link", name="Leia o texto →").nth(1)  # 2002 vem depois de 2009
        await novo.click()
        await page.wait_for_timeout(2500)
        url_final = page.url
        print(f"     URL pós-clique: {url_final}")
        check("clique navega para a ficha (URL)", SLUG in url_final)
        corpo_final = (await page.inner_text("body")).lower()
        check("clique navega para a ficha (conteúdo)",
              "o que nos chegou da ilha da madeira" in corpo_final)

        await browser.close()

    falhas = [n for n, ok in RESULTADOS if not ok]
    print(f"\n{len(RESULTADOS) - len(falhas)}/{len(RESULTADOS)} checks passaram")
    return 0 if not falhas else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
