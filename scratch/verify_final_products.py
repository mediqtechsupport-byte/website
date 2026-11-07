import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

prod_idx = html.find('id="products"')
galaxy_idx = html.find('id="galaxy-delivery"')

prod_section = html[prod_idx:galaxy_idx]
slides = re.findall(r'<div[^>]*class="[^"]*product-slide[^"]*"[^>]*data-product-index="(\d+)"', prod_section)
print("Found slides in #products:", slides)

nav_links = re.findall(r'data-product-slide="(\d+)"', html)
print("Found data-product-slide links in navbar/page:", nav_links)

print("Check complete!")

