with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '.notched-img-box' in line:
        for j in range(max(0, i-2), min(len(lines), i+25)):
            print(f"{j+1}: {lines[j]}", end='')
        print("-" * 50)

