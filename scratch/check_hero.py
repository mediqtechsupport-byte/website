with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()
with open('components/hero-locked-backup.html', 'r', encoding='utf-8') as f:
    backup = f.read()

s1 = html.find('<section id="hero"')
e1 = html.find('</section>', s1) + len('</section>')
h1 = html[s1:e1].strip()

s2 = backup.find('<section id="hero"')
if s2 != -1:
    e2 = backup.find('</section>', s2) + len('</section>')
    h2 = backup[s2:e2].strip()
else:
    h2 = backup.strip()

print(f"h1 len: {len(h1)}, h2 len: {len(h2)}")
print(f"Match: {h1 == h2}")
if h1 != h2:
    for i in range(min(len(h1), len(h2))):
        if h1[i] != h2[i]:
            print(f"Diff at {i}")
            print("h1:", repr(h1[i:i+60]))
            print("h2:", repr(h2[i:i+60]))
            break

