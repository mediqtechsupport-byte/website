with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(2808, 2845):
    print(f"{i+1}: {lines[i]}", end='')
print("...")
for i in range(3145, 3160):
    print(f"{i+1}: {lines[i]}", end='')

