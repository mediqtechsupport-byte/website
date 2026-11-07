with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
match = re.search(r'id="nav-products"[\s\S]*?</nav>', text)
if match:
    print(match.group(0)[:1200])

