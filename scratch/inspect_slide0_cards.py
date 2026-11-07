with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(3330, 3470):
    if '<img' in lines[i] or 'card' in lines[i].lower() or '01' in lines[i] or '02' in lines[i] or '03' in lines[i]:
        print(f"{i+1}: {lines[i]}", end='')

