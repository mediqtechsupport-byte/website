with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
prod_match = re.search(r'<section id="products"[\s\S]*?</section>', text)
if prod_match:
    lines = prod_match.group(0).splitlines()
    print("Products total lines:", len(lines))
    print("Products snippet 0-40:")
    for l in lines[:40]:
        print(l)

