with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('assets/js/main.js?v=347.00', 'assets/js/main.js?v=348.00')
text = text.replace('assets/js/about-route-globe.js?v=7.00', 'assets/js/about-route-globe.js?v=8.00')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Bumped script versions!")

