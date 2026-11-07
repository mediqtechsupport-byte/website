with open('components/about-locked-backup.html', 'r', encoding='utf-8') as f:
    h = f.read()

import re
m = re.search(r'id=\"about-slide-what-we-do\"[\s\S]*?(?=<!-- =========================================================================\s*<!-- SLIDE 4)', h)
if m:
    print("Found slide what-we-do in backup, length:", len(m.group(0)))
else:
    print("Not found with regex")

