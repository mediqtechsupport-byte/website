with open('scratch/new_products_deck.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
slides = re.findall(r'<div[^>]*class="[^"]*product-slide[^"]*"[^>]*data-product-index="(\d+)"', text)
print("Product slide indices:", slides)
print("Total lines:", len(text.splitlines()))
print("Total length:", len(text))

