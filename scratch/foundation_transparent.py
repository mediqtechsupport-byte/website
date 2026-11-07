import re
for path in ['index.html', 'components/about-locked-backup.html']:
    with open(path, 'r', encoding='utf-8', newline='') as f:
        h = f.read()
    m = re.search(r'<div class="about-slide[^"]*" data-index="3">', h)
    assert m, path
    tag = m.group(0)
    assert 'bg-[#0a1d40]' in tag, tag
    h = h[:m.start()] + tag.replace('bg-[#0a1d40]', 'bg-transparent', 1) + h[m.end():]
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(h)
    print('updated', path)

