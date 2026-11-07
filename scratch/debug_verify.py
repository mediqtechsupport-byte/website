with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()
with open('components/hero-locked-backup.html', 'r', encoding='utf-8') as f:
    backup = f.read()

s1 = html.find('<section id="hero"')
e1 = html.find('</section>', s1) + len('</section>')

s2 = backup.find('<section id="hero"')
e2 = backup.find('</section>', s2) + len('</section>')

print("s1:", s1, "e1:", e1)
print("s2:", s2, "e2:", e2)
print("html slice:", len(html[s1:e1]))
print("backup slice:", len(backup[s2:e2]))
print("equal:", html[s1:e1] == backup[s2:e2])

