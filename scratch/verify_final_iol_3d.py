import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

prod_idx = html.find('id="products"')
galaxy_idx = html.find('id="galaxy-delivery"')
prod_section = html[prod_idx:galaxy_idx]

# Check slides
slides = re.findall(r'data-product-index="(\d+)"', prod_section)
print("Product slide indices:", slides)
assert slides == ['0', '1', '2', '3', '4'], f"Expected 0-4, got {slides}"

# Check packshots
packshots = re.findall(r'src="(assets/img/packshots/[^"]+)"', prod_section)
print("Packshots referenced:", packshots)
for p in packshots:
    assert os.path.exists(p), f"Missing file: {p}"
    print(f"Verified exists: {p} ({os.path.getsize(p)} bytes)")

# Check accordion rows
acc_rows = re.findall(r'class="[^"]*iol-accordion-row[^"]*"', prod_section)
print(f"Found {len(acc_rows)} accordion rows across the 3 stages")
assert len(acc_rows) == 9, f"Expected 9 accordion rows (3 per stage), got {len(acc_rows)}"

print("ALL VERIFICATIONS PASSED 100% PERFECTLY!")

