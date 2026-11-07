with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(2596, 2650):
    if i < len(lines):
        print(f'{i}: {lines[i].strip()[:90]}')

