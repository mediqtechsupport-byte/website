with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'class="product-slide' in line or "class='product-slide" in line:
        print(f"Line {i+1}: {line.strip()[:140]}")

