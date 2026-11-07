import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add overscroll-behavior containment in CSS
css_needle = '.sv-scene {'
css_idx = html.find(css_needle)

containment_css = """#products,
    #products .product-slide,
    #iol-scroll-container {
      overscroll-behavior: contain !important;
      overscroll-behavior-y: contain !important;
    }

    """

if '#products,' not in html:
    html = html[:css_idx] + containment_css + html[css_idx:]

# Bump script version
html = re.sub(r'src="assets/js/main\.js\?v=[\d\.]+"', 'src="assets/js/main.js?v=354.00"', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Applied overscroll-behavior containment and bumped version to v=354.00!")

