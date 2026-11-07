with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx1 = text.find('<section id="hero"')
idx2 = text.find('<!-- ============== ABOUT / HERITAGE')
print('Hero start line:', text[:idx1].count('\n') + 1)
print('Hero end line:', text[:idx2].count('\n') + 1)
print("Hero text length:", idx2 - idx1)

