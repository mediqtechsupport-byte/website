with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
start = -1
end = -1
for i, line in enumerate(lines):
    if 'id="about-slide-what-we-do"' in line:
        start = i
    if 'SLIDE 4: OUR ESTABLISHED FOUNDATION' in line:
        end = i
        break
print(f'Slide 2 spans lines {start} to {end}')

