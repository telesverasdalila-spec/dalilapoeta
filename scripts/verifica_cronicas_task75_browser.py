# -*- coding: utf-8 -*-
"""
Task 75 — Verificação browser da aba Crônicas contra a especificação:
  "refletir o conteúdo do legado cronicasdalilatelesveras.htm, utilizando
   os layouts e estilos que usamos nos ensaios".
  1) Aba Escritos > subtab Crônicas: 9 itens NA ORDEM DO ÍNDICE DO LEGADO
     (Crônica de Outono → ... → A Língua, a Pátria Possível), cada um com
     "Leia o texto →" para a ficha certa (inclui correção Bibliocasa)
  2) As 9 fichas /texto/{slug}: HTTP 200, layout do pacote dos ensaios
     (faixa "Dalila Teles Veras • Crônicas", imagem da categoria carregada,
     título Georgia itálico, linha COLUNA VIAVERBO, corpo .corpo-texto),
     sem referência ao site legado (regra Task 74)
  3) Estilo de entrada de diário (título dourado das datas) nas Anotações
  4) Correção verbatim "Socráticas" renderizada
  5) Regressão: subtab Ensaios intacta (mesmo pacote visual)
Screenshots: scripts/shot75-*.png
"""
import asyncio
import re
import sys

from playwright.async_api import async_playwright

BASE = "http://localhost:3000"

# ordem do índice do legado (cronicasdalilatelesveras.htm)
ORDEM_LEGADO = [
    ("Crônica de Outono", "cronica-de-outono"),
    ("A Cidade do Meu Desejo", "a-cidade-do-meu-desejo"),
    ("O Direito ao Silêncio", "o-direito-ao-silencio"),
    ("Bibliocasa", "bibliocasa"),
    ("Anotações de Leituras I", "anotacoes-de-leituras-i"),
    ("Anotações de Leituras II", "anotacoes-de-leituras-ii"),
    ("Anotações de Leituras III", "anotacoes-de-leituras-iii"),
    ("Anotações de Leituras IV", "anotacoes-de-leituras-iv"),
    ("A Língua, a Pátria Possível", "a-lingua-a-patria-possivel"),
]

RESULTADOS: list[tuple[str, bool]] = []


def check(nome: str, ok: bool) -> None:
    RESULTADOS.append((nome, ok))
    print(("OK   " if ok else "FALHOU ") + nome)


async def main() -> int:
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1440, "height": 1000})

        # ---------- 1) ABA CRÔNICAS (listagem) ----------
        resp = await page.goto(f"{BASE}/?eixo=obra", wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)
        check("home HTTP 200", resp is not None and resp.status == 200)

        await page.get_by_role("button", name=re.compile("Escritos")).click()
        await page.wait_for_timeout(800)
        await page.get_by_role("button", name=re.compile("^Cr[oô]nicas$")).click()
        await page.wait_for_timeout(1500)

        # títulos na ordem do legado
        corpo_aba = await page.inner_text("body")
        pos = []
        for titulo, slug in ORDEM_LEGADO:
            i = corpo_aba.find(titulo)
            pos.append(i)
            check(f"listagem mostra '{titulo}'", i >= 0)
        ordem_ok = all(pos[i] >= 0 and pos[i] < pos[i + 1] for i in range(len(pos) - 1))
        check("ordem da listagem = ordem do índice do legado", ordem_ok)
        check("typo 'Biblocasa' eliminado", "Biblocasa" not in corpo_aba.replace("Bibliocasa", ""))
        check("9 links 'Leia o texto →' na subtab",
              corpo_aba.count("Leia o texto →") >= 9)
        check("cabeçalho de ano '1999-2004' presente", "1999-2004" in corpo_aba)

        await page.screenshot(path="scripts/shot75-aba-cronicas.png")

        # hrefs na ordem certa
        hrefs = await page.locator('a[href^="/texto/"]').all_inner_texts()
        hrefs_atr = await page.eval_on_selector_all(
            'a[href^="/texto/"]', "els => els.map(e => e.getAttribute('href'))")
        esperados = [f"/texto/{s}" for _, s in ORDEM_LEGADO]
        links_leia = [h for h, t in zip(hrefs_atr, hrefs) if "Leia o texto" in t]
        check("links Leia apontam para os 9 slugs na ordem", links_leia == esperados)

        # ---------- 2) AS 9 FICHAS ----------
        for titulo, slug in ORDEM_LEGADO:
            r = await page.goto(f"{BASE}/texto/{slug}", wait_until="domcontentloaded")
            await page.wait_for_timeout(1500)
            corpo = await page.inner_text("body")

            check(f"[{slug}] HTTP 200", r is not None and r.status == 200)
            check(f"[{slug}] não é 'Página em construção'", "Página em construção" not in corpo)
            # layout do pacote dos ensaios (case-insensitive: CSS uppercase)
            check(f"[{slug}] faixa 'Dalila Teles Veras • Crônicas'",
                  re.search(r"dalila teles veras\s*•\s*cr[oô]nicas", corpo, re.I) is not None)
            check(f"[{slug}] linha de contexto 'Coluna Viaverbo'",
                  "coluna viaverbo" in corpo.lower())
            check(f"[{slug}] voltar 'Escritos & Leituras'",
                  "Voltar para Escritos & Leituras" in corpo)
            # imagem da categoria carrega (naturalWidth > 0)
            nat = await page.evaluate(
                """() => { const im = document.querySelector('img[src*="placeholder-cronicas"]');
                           return im ? im.naturalWidth : -1; }""")
            check(f"[{slug}] imagem da categoria carrega (naturalWidth={nat})", nat and nat > 0)
            # corpo estilo ensaios
            n_main = await page.locator("main.corpo-texto").count()
            check(f"[{slug}] corpo com classe .corpo-texto (pacote dos ensaios)", n_main == 1)
            check(f"[{slug}] sem referência ao site legado",
                  "dalila.telesveras.nom.br" not in corpo and "site legado" not in corpo.lower())

        # ---------- 3) diário: datas douradas nas Anotações ----------
        await page.goto(f"{BASE}/texto/anotacoes-de-leituras-i", wait_until="domcontentloaded")
        await page.wait_for_timeout(1500)
        n_entradas = await page.locator("p.titulo-entrada").count()
        check(f"[anotacoes-i] entradas de diário com título dourado (veio {n_entradas})",
              n_entradas >= 10)
        cor = await page.evaluate(
            "() => { const e = document.querySelector('p.titulo-entrada');"
            " return e ? getComputedStyle(e).color : 'none'; }")
        check(f"[anotacoes-i] título de entrada em dourado #8b6914 (veio {cor})",
              "139" in cor)  # 0x8b = 139
        corpo_ai = await page.inner_text("body")
        check("[anotacoes-i] texto da 1ª entrada verbatim",
              "passeiam meus olhos pelos alfarrábios" in corpo_ai)
        await page.locator("p.titulo-entrada").first.scroll_into_view_if_needed()
        await page.screenshot(path="scripts/shot75-anotacoes-diario.png")

        # ---------- 4) Socráticas corrigido ----------
        await page.goto(f"{BASE}/texto/anotacoes-de-leituras-iv", wait_until="domcontentloaded")
        await page.wait_for_timeout(1500)
        corpo_iv = await page.inner_text("body")
        check("[anotacoes-iv] 'Socráticas, de José Paulo Paes' verbatim (corrigido)",
              "Socráticas, de José Paulo Paes" in corpo_iv)
        check("[anotacoes-iv] sem 'S ocráticas' com espaço", "S ocráticas" not in corpo_iv)

        # ---------- 5) regressão: ficha de ensaio com o mesmo pacote ----------
        r = await page.goto(f"{BASE}/texto/sentir-se-portugues-na-diaspora",
                            wait_until="domcontentloaded")
        await page.wait_for_timeout(1500)
        corpo_e = await page.inner_text("body")
        check("[ensaio-regressão] HTTP 200", r is not None and r.status == 200)
        check("[ensaio-regressão] faixa 'Dalila Teles Veras • Ensaios'",
              re.search(r"dalila teles veras\s*•\s*ensaios", corpo_e, re.I) is not None)
        check("[ensaio-regressão] imagem placeholder-ensaios intacta",
              "ensaios" in corpo_e.lower())

        await browser.close()

    falhas = [n for n, ok in RESULTADOS if not ok]
    print("=" * 78)
    print(f"TOTAL: {len(RESULTADOS) - len(falhas)}/{len(RESULTADOS)} checks")
    if falhas:
        for n in falhas:
            print("  FALHOU: " + n)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
