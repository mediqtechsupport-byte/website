with open('components/about-locked-backup.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("Total lines in about-locked-backup.html:", len(lines))
for i, line in enumerate(lines):
    if 'SLIDE' in line:
        print(f"Line {i+1}: {line.strip()}")

