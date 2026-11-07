with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'function\s+([A-Za-z0-9_]+Stacking[A-Za-z0-9_]*)', text)
print("Stacking functions in main.js:", matches)

