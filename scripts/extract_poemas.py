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

t = clean('poemas.json')
i = t.find('Dalila Teles Veras |Portugal, 1946|')
if i < 0:
    i = t.find('4 poemas de Dalila')
print(t[i:i+5500])
