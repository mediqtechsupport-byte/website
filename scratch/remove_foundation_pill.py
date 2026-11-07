import re

def strip(text):
    # remove the eyebrow <p> that contains HERITAGE &amp; PARTNERSHIP
    return re.sub(r'[ \t]*<p class="[^"]*">\s*<span>ABOUT MEDIQ &bull; HERITAGE &amp; PARTNERSHIP</span>\s*</p>\s*\n', '', text, count=1)

for path in ['index.html', 'components/about-locked-backup.html', 'scratch/redesign_foundation.py']:
    with open(path, 'r', encoding='utf-8', newline='') as f:
        t = f.read()
    crlf = '\r\n' in t
    t = t.replace('\r\n', '\n')
    n = strip(t)
    print(path, 'removed' if n != t else 'NOT FOUND')
    if crlf:
        n = n.replace('\n', '\r\n')
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(n)

