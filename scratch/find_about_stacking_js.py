with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'about-stacking' in line or 'about-slide-what-we-do' in line or 'stacking-card' in line:
        print(f"Line {i+1}: {line.strip()[:100]}")

