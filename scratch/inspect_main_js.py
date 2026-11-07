with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'currentProductIndex' in line or 'product-slide' in line or 'products-section' in line or 'goToProductSlide' in line:
        for j in range(max(0, i-5), min(len(lines), i+30)):
            print(f"{j+1}: {lines[j]}", end='')
        print("-" * 50)
        break

