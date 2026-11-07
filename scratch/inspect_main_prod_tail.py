with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('/* PRODUCTS IN-PAGE 5-SLIDE DECK CONTROLLER')
print(text[idx:])

