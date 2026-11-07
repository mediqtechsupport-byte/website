with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(290, 360):
    print(f"{i}: {lines[i]}", end='')

