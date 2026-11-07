with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines in main.js: {len(lines)}")
for i in range(6128, len(lines)):
    if 'initAboutStackingCards' in lines[i]:
        print(f"Found initAboutStackingCards at line {i}")

