with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

about_start = -1
about_end = -1
for i, line in enumerate(lines):
    if '<section id="about"' in line:
        about_start = i
    if about_start != -1 and '</section>' in line:
        about_end = i
        break

print(f"About section spans lines {about_start+1} to {about_end+1}")

# Find all slides inside about
for i in range(about_start, about_end+1):
    if 'about-slide' in lines[i] or '<!-- SLIDE' in lines[i]:
        print(f"Line {i+1}: {lines[i].strip()}")

