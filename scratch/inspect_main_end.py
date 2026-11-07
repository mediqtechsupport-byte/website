with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    text = f.read()

for l in text.splitlines()[-45:]:
    print(l)

