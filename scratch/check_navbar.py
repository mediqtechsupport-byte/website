with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(1415, 1550):
    if i < len(lines):
        line = lines[i]
        if 'href=' in line or 'product' in line.lower() or 'nav' in line.lower():
            print(f'{i}: {line.strip()[:100]}')

