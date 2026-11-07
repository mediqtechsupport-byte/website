with open('index.html', 'r', encoding='utf-8') as f:
    idx_h = f.read().replace('\r\n', '\n')

with open('components/hero-locked-backup.html', 'r', encoding='utf-8') as f:
    hero_bak = f.read().replace('\r\n', '\n')

h_start = idx_h.find('<section id="hero"')
h_end = idx_h.find('</section>', h_start) + len('</section>')

hero_curr = idx_h[h_start:h_end].trim() if hasattr(str, 'trim') else idx_h[h_start:h_end].strip()

b_start = hero_bak.find('<section id="hero"')
b_end = hero_bak.find('</section>', b_start) + len('</section>')
hero_base = hero_bak[b_start:b_end].strip()

print("Hero match:", hero_curr == hero_base)
assert hero_curr == hero_base, "Hero diff detected!"
print("Hero 100% MATCH character for character!")

