with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'id="nav-products"' in l:
        print(f"nav-products found at line {i}")
        for j in range(i, i+35):
            print(f"{j}: {lines[j]}", end='')
        break

