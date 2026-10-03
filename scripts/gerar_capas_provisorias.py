#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Capas provisorias elegantes para imagens ausentes do acervo original.
Estilo: vinho #7a3b5a + dourado #D4AF37 + creme #fdfcf8 (paleta do site).
Substituir pelos escaneamentos reais quando a usuaria enviar.
"""
from PIL import Image, ImageDraw, ImageFont

F = "/usr/share/fonts/truetype/liberation/"
TINOS_IT = F + "LiberationSerif-Italic.ttf"
TINOS_BI = F + "LiberationSerif-BoldItalic.ttf"
TINOS_R = F + "LiberationSerif-Regular.ttf"

CREME = (253, 252, 248)
OURO = (212, 175, 55)
VINHO_TOP = (93, 44, 68)
VINHO_BOT = (122, 59, 90)

OUT = "/home/z/my-project/public/imagens"


def fundo_vinho(w, h):
    im = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(im)
    for y in range(h):
        t = y / max(1, h - 1)
        c = tuple(int(a + (b - a) * t) for a, b in zip(VINHO_TOP, VINHO_BOT))
        d.line([(0, y), (w, y)], fill=c)
    return im


def wrap(d, texto, fonte, largura_max):
    linhas, atual = [], ""
    for p in texto.split():
        teste = (atual + " " + p).strip()
        if d.textlength(teste, font=fonte) <= largura_max:
            atual = teste
        else:
            if atual:
                linhas.append(atual)
            atual = p
    if atual:
        linhas.append(atual)
    return linhas


def capa(nome, subtitulo, caminho, w=800, h=1200):
    im = fundo_vinho(w, h)
    d = ImageDraw.Draw(im)
    # moldura dupla dourada
    d.rectangle([28, 28, w - 28, h - 28], outline=OURO, width=4)
    d.rectangle([44, 44, w - 44, h - 44], outline=OURO, width=1)
    # autor no topo
    f_autor = ImageFont.truetype(TINOS_R, 30)
    aut = "DALILA TELES VERAS"
    tw = d.textlength(aut, font=f_autor)
    # espacamento entre letras simulado
    esp = 6
    x = (w - (tw + esp * (len(aut) - 1))) / 2
    for ch in aut:
        d.text((x, 110), ch, font=f_autor, fill=OURO)
        x += d.textlength(ch, font=f_autor) + esp
    # titulo central
    f_tit = ImageFont.truetype(TINOS_BI, 92)
    linhas = wrap(d, nome, f_tit, w - 180)
    y = h / 2 - (len(linhas) * 110) / 2 - 40
    for ln in linhas:
        lw = d.textlength(ln, font=f_tit)
        d.text(((w - lw) / 2, y), ln, font=f_tit, fill=CREME)
        y += 110
    if subtitulo:
        f_sub = ImageFont.truetype(TINOS_IT, 40)
        sub_l = wrap(d, subtitulo, f_sub, w - 200)
        y += 30
        for ln in sub_l:
            lw = d.textlength(ln, font=f_sub)
            d.text(((w - lw) / 2, y), ln, font=f_sub, fill=(232, 205, 130))
            y += 52
    # ornamento inferior
    y_orn = h - 140
    d.line([(w / 2 - 90, y_orn), (w / 2 + 90, y_orn)], fill=OURO, width=2)
    d.ellipse([w / 2 - 5, y_orn - 5, w / 2 + 5, y_orn + 5], fill=OURO)
    im.save(caminho, quality=92)
    print("capa:", caminho)


def arte_inveja():
    w, h = 788, 556
    im = Image.new("L", (w, h), 246)
    d = ImageDraw.Draw(im)
    d.rectangle([14, 14, w - 14, h - 14], outline=120, width=2)
    d.rectangle([22, 22, w - 22, h - 22], outline=170, width=1)
    f_tit = ImageFont.truetype(TINOS_IT, 96)
    f_sub = ImageFont.truetype(TINOS_R, 30)
    tit, sub = "Inveja", "arte de Andr\u00e9 Miranda \u2014 aguardando original"
    tw = d.textlength(tit, font=f_tit)
    d.text(((w - tw) / 2, h / 2 - 110), tit, font=f_tit, fill=60)
    sw = d.textlength(sub, font=f_sub)
    d.text(((w - sw) / 2, h / 2 + 30), sub, font=f_sub, fill=110)
    im.save(OUT + "/obras-publicadas/poesia/pecados-artes/inveja-andre-miranda.jpg", quality=92)
    print("arte:", "inveja-andre-miranda.jpg")


capa("70 Anos", "poemas & leitores", OUT + "/obras-publicadas/poesia/70-anos-poemas-leitores.jpg")
capa("Passageira", "antologia pessoal 1982 \u2013 2024", OUT + "/obras-publicadas/poesia/passageira.png")
capa("Pontos", "", OUT + "/obras-publicadas/poesia/pontos.jpg")
capa("A L\u00edngua, a P\u00e1tria Poss\u00edvel", "cr\u00f4nicas", OUT + "/cronicas-capinha.jpg", w=400, h=600)
arte_inveja()
print("concluido")
