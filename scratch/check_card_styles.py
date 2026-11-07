import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'<div class="stacking-card-item[^"]*"[^>]*>', text)
for i, m in enumerate(matches):
    print(f"Card {i+1}: {m}")

