with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'id="products-slide-2"' in line:
        for j in range(max(0, i-5), min(len(lines), i+35)):
            print(f"{j+1}: {lines[j]}", end='')
        break

