with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
about_start = text.find('<section id="about"')
about_end = text.find('</section>', about_start) + len('</section>')

prod_start = text.find('<section id="products"')

print(f"About section spans: {about_start} to {about_end}")
print(f"Products section starts at: {prod_start}")

