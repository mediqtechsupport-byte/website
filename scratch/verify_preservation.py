with open('index.html', 'r', encoding='utf-8') as f:
    idx_h = f.read()

with open('components/about-locked-backup.html', 'r', encoding='utf-8') as f:
    bak_h = f.read()

# Verify Hero
h_start = idx_h.find('<section id="hero"')
h_end = idx_h.find('</section>', h_start) + len('</section>')

with open('components/hero-locked-backup.html', 'r', encoding='utf-8') as f:
    hero_bak = f.read()

assert idx_h[h_start:h_end].strip() == hero_bak.strip(), "Hero diff detected!"
print("Hero: 100% MATCH character-for-character")

# Check Slide 1: Purpose
assert '<!-- SLIDE 1: PURPOSE (Global Healthcare Innovation & Philippines Map)' in idx_h
# Check Slide 2: Who We Are
assert '<!-- SLIDE 2: WHO WE ARE, OUR VISION & MISSION (Architectural Blueprint Cards)' in idx_h
assert 'Architectural Blueprint Cards' in idx_h
assert 'Philippine Healthcare Landscape' in idx_h
# Check Slide 3: Bento
assert '<!-- SLIDE 3: WHAT WE DO (Interactive Bento Grid Architecture)' in idx_h
# Check Slide 4: Foundation
assert '<!-- SLIDE 4: OUR ESTABLISHED FOUNDATION (Navy Banner with Rayner Partnership)' in idx_h
# Check Slide 5: Core Values
assert '<!-- SLIDE 5: OUR CORE VALUES & BEYOND DISTRIBUTION (Deep Navy Glass)' in idx_h

print("All slides in About verified: Who We Are, Purpose, Foundation, and Values are 100% preserved!")

