with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    text = f.read()

print('Length of main.js:', len(text))
for line in text.splitlines()[-50:]:
    print(line)

