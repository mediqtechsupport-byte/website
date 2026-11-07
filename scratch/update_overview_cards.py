import re

with open('index.html', 'r', encoding='utf-8') as f:
    h = f.read()

# Replace Card 1 image with authentic RayOne EMV packshot box
old_card1_img = '<img src="assets/img/hero-lens-only-transparent.png" alt="Intraocular Lenses" loading="lazy">'
new_card1_img = '<img src="assets/img/packshots/authentic_emv.png?v=367.00" alt="Intraocular Lenses" class="object-contain p-2" loading="lazy">'

if old_card1_img in h:
    h = h.replace(old_card1_img, new_card1_img)
    print("Replaced Card 1 with authentic_emv.png!")
else:
    print("Card 1 image not found directly, checking regex")
    h = re.sub(
        r'<img src="assets/img/hero-lens-only-transparent\.png"[^>]*>',
        new_card1_img,
        h
    )

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(h)
print("Updated index.html successfully!")

