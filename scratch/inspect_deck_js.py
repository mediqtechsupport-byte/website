with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    text = f.read()

start_marker = 'function initAboutDeckController'
start = text.find(start_marker)
if start != -1:
    print(text[start:start+3500])
else:
    print("initAboutDeckController not found")

