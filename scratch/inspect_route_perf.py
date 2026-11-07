with open('assets/js/about-route-globe.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
print("Length of about-route-globe.js:", len(text))
for line in text.splitlines()[:60]:
    print(line)

