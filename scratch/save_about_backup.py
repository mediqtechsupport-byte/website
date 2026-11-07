with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
about_start = text.find('<section id="about"')
about_end = text.find('</section>', about_start) + len('</section>')

about_code = text[about_start:about_end]

with open('components/about-locked-backup.html', 'w', encoding='utf-8') as f:
    f.write(about_code)

print(f"Saved components/about-locked-backup.html ({len(about_code)} bytes, {len(about_code.splitlines())} lines)")

