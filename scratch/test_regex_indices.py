import re

with open('scratch/built_orig_about.html', 'r', encoding='utf-8') as f:
    html = f.read()

slides = re.findall(r'<div[^>]*class="[^"]*about-slide[^"]*"[^>]*data-index="(\d+)"', html)
print("Data indices found:", slides)

