with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Find navbar dropdown for products
nav_prod = re.search(r'Products[\s\S]*?</div>\s*</div>', text)
if nav_prod:
    print("Nav products dropdown snippet:")
    print(nav_prod.group(0)[:600])

# Find current section #products
prod_match = re.search(r'<section id="products"[\s\S]*?</section>', text)
if prod_match:
    print("\nProducts section length:", len(prod_match.group(0)))
    print("Products lines:", len(prod_match.group(0).splitlines()))

