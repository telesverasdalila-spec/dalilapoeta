import json, re

def clean(f):
    data = json.load(open(f))
    html = data.get('html', '') or data.get('data', {}).get('html', '')
    html = re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', html, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<[^>]+>', '\n', html)
    text = text.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&quot;', '"').replace('&#39;', "'")
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n\s*\n+', '\n', text)
    return text

t = clean('wiki.json')
open('wiki_texto.txt', 'w').write(t)
print("WIKI LEN:", len(t))
i = t.find('Em 1992')
print("IDX 1992:", i)
start = t.find('Grupo Livrespaço')
print(t[start:start+8000])
