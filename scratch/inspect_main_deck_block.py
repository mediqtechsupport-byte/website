with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    text = f.read()

start_marker = '/* ========================================================================= */\n/* ABOUT MEDIQ PAGE-BY-PAGE DECK CONTROLLER'
idx = text.find(start_marker)
if idx != -1:
    print(text[idx:idx+2500])
else:
    print("Deck controller marker not found!")

