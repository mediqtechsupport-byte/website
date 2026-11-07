with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start = -1
end = -1
for i, line in enumerate(lines):
    if '<section id="about"' in line:
        start = i
    if '</section>' in line and start != -1 and end == -1 and i > start:
        end = i
print(f'section #about spans lines {start} to {end}')

