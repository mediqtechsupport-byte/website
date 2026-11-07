import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'<div[^>]*class="[^"]*about-slide[^"]*"[^>]*>', text)
for i, m in enumerate(matches):
    print(f"Slide {i}: {m}\n")

