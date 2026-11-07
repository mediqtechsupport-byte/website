with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'slide-2' in line or 'SLIDE 2' in line or 'Medical Supplies' in line and 'section' in line.lower():
        print(f"{i+1}: {line.strip()[:100]}")

