with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    text = f.read()

start_marker = 'function initModalStackingCards'
idx = text.find(start_marker)
if idx != -1:
    print(text[idx-200:idx+1500])

