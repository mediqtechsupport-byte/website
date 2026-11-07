import re

def strip(t):
    return re.sub(r'[ \t]*<div class="px-\[1\.4em\][^"]*">\s*Rayner UK &bull; Official Partner\s*</div>\s*\n', '', t, count=1)

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

