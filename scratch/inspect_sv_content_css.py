with open(r'scratch/zandrellez_portfolio/src/components/styles/services.css', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'(\.sv-(?:content|title|subtitle|pitch|list)[^{]*\{[^}]*\})', text)
for m in matches:
    print(m)

