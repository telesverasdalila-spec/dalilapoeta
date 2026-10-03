# Limpeza de artefatos do site legado no texto de Traduções:
# 1) h2 "Mario Benedetti" duplicado no meio do poema "ESE GRAN SIMULACRO"
# 2) versos do poema em espanhol sem class="verso" (parágrafos simples)
# Nenhuma palavra do texto é alterada — só marcadores HTML.
import json

p = '/home/z/my-project/src/app/texto/[id]/traducoes/dados.json'
d = json.load(open(p))
t = d['texto']

# 1) remove o h2 duplicado logo após o título do poema em espanhol
assert t.count('<h2>Mario Benedetti</h2>') == 2, t.count('<h2>Mario Benedetti</h2>')
marcador = '<p class="titulo-poema"><strong>ESE GRAN SIMULACRO</strong></p><h2>Mario Benedetti</h2>'
assert t.count(marcador) == 1, 'marcador do h2 duplicado não encontrado'
t = t.replace(marcador, '<p class="titulo-poema"><strong>ESE GRAN SIMULACRO</strong></p>')

# 2) versos do poema em espanhol (parágrafos simples) → class="verso"
ini = t.index('<strong>ESE GRAN SIMULACRO</strong>')
fim = t.index('<p class="titulo-poema"><strong>ESSE GRANDE SIMULACRO</strong>')
fatia = t[ini:fim]
n = fatia.count('<p>')
fatia = fatia.replace('<p>', '<p class="verso">')
t = t[:ini] + fatia + t[fim:]

d['texto'] = t
with open(p, 'w') as f:
    json.dump(d, f, ensure_ascii=False, indent=1)

print(f'OK — h2 duplicado removido; {n} parágrafos convertidos para class="verso"')
print('h2 restantes:', t.count('<h2'), '| verso:', t.count('class="verso"'), '| titulo-poema:', t.count('titulo-poema'))
