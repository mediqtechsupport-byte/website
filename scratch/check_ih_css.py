with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'\.ih-h1[^{]*\{[^}]*\}', text)
print("ih-h1 in index.html:", matches)

matches2 = re.findall(r'\.ih-[a-z0-9_-]+[^{]*\{[^}]*\}', text)
print("ih- classes in index.html:", matches2[:10])

