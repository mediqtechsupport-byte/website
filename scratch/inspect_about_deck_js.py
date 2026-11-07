with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(6200, 6380):
    print(f"{i+1}: {lines[i]}", end='')

