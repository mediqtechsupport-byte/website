with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'<a[^>]*href="[^"]*products[^"]*"[^>]*>[\s\S]*?</a>', text)
print(f"Found {len(matches)} product links in index.html:")
for m in matches:
    print("---")
    print(m[:150])

