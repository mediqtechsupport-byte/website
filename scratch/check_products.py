with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '<section id="products"' in line or '<section id="portfolio"' in line or 'id="products"' in line:
        print(f'{i}: {line.strip()[:100]}')

