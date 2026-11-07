import re

with open('scratch/built_orig_about.html', 'r', encoding='utf-8') as f:
    html = f.read()

slides = re.findall(r'<div class="about-slide[^"]*"[^>]*data-index="(\d+)"', html)
print("Data indices found:", slides)

# Check all open vs close divs
open_divs = len(re.findall(r'<div\b', html))
close_divs = len(re.findall(r'</div\b', html))
print(f"Open divs: {open_divs}, Close divs: {close_divs}")

open_sec = len(re.findall(r'<section\b', html))
close_sec = len(re.findall(r'</section\b', html))
print(f"Open section: {open_sec}, Close section: {close_sec}")

