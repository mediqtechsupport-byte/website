with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'rightness()' in line:
        lines[i] = '      inner.style.filter = "brightness(" + targetBrightness.toFixed(2) + ")";\n'
        print(f"Replaced line {i+1}")

with open('assets/js/main.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)

