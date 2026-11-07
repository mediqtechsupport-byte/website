with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(4180, min(len(lines), 4230)):
    print(f"{i+1}: {lines[i]}", end='')

