with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('assets/js/main.js?v=349.00', 'assets/js/main.js?v=350.00')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Bumped main.js to v=350.00!")

