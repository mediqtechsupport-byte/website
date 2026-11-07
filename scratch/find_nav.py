import re
from pathlib import Path
lines = Path("index.html").read_text(encoding="utf-8").split("\n")
pat = re.compile(r'goToAboutSlide\(|class="about-slide|data-index="|goToProductSlide\(|data-product-slide=|products-deck-')
for i, l in enumerate(lines, 1):
    if pat.search(l):
        print(i, l.strip()[:230])

