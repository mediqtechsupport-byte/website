import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("--- SECTION CHECKS ---")
hero_idx = html.find('id="hero"')
about_idx = html.find('id="about"')
products_idx = html.find('id="products"')
galaxy_idx = html.find('id="galaxy-delivery"')

print(f"Hero found: {hero_idx != -1} at {hero_idx}")
print(f"About found: {about_idx != -1} at {about_idx}")
print(f"Products found: {products_idx != -1} at {products_idx}")
print(f"Galaxy Delivery found: {galaxy_idx != -1} at {galaxy_idx}")

assert hero_idx < about_idx < products_idx, "Section order mismatch!"

print("\n--- ABOUT DECK SLIDES CHECK ---")
about_section = html[about_idx:products_idx]
slides = re.findall(r'<div[^>]*class="[^"]*about-slide[^"]*"[^>]*data-index="(\d+)"', about_section)
print("Found slides in #about:", slides)
assert slides == ['0', '1', '2', '3', '4'], f"Expected slides 0-4, got {slides}"

print("\n--- SLIDE 0 PURPOSE CHECK ---")
assert 'id="about-interactive-stage"' in about_section, "Missing #about-interactive-stage!"
assert 'Connecting Global' in about_section, "Missing 'Connecting Global' headline!"
assert 'Healthcare Innovation' in about_section, "Missing 'Healthcare Innovation' headline!"
assert 'with the Philippines' in about_section, "Missing 'with the Philippines' headline!"
assert 'Explore Profile &amp; Mission' in about_section or 'Explore Profile & Mission' in about_section, "Missing Explore button!"

print("\n--- SLIDE 2 STACKING CARDS CHECK ---")
assert 'about-stacking-scroll-viewport' in about_section, "Missing about-stacking-scroll-viewport!"
card_inners = re.findall(r'class="[^"]*stacking-card-inner', about_section)
print(f"Found {len(card_inners)} stacking card inners")
assert len(card_inners) == 6, f"Expected 6 stacking cards, got {len(card_inners)}"

print("\n--- SCRIPT REFERENCES CHECK ---")
scripts = re.findall(r'<script[^>]*src="([^"]+)"', html)
print("Scripts loaded:")
for s in scripts:
    print(" -", s)

assert any('about-route-globe' in s for s in scripts), "Missing about-route-globe.js script!"
assert any('main.js' in s for s in scripts), "Missing main.js script!"

print("\nALL VERIFICATIONS PASSED 100% PERFECTLY!")

