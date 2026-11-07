with open('scratch/updated_products_deck_with_3d.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
slides = re.findall(r'<div[^>]*class="[^"]*product-slide[^"]*"[^>]*data-product-index="(\d+)"', text)
print("Product slides:", slides)
print("Total length:", len(text))
print("Divs balance:", len(re.findall(r'<div\b', text)), len(re.findall(r'</div\b', text)))

