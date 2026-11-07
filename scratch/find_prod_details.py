with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
prod_match = re.search(r'<section id="products"[\s\S]*?</section>', text)
if prod_match:
    prod_text = prod_match.group(0)
    # Find all h2, h3, h4
    headings = re.findall(r'<h[234][^>]*>([\s\S]*?)</h[234]>', prod_text)
    print("Headings in #products:")
    for h in headings:
        clean = re.sub(r'<[^>]+>', '', h).strip()
        print(" -", clean)

