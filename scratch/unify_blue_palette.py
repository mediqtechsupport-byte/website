import re

REPL = [
    ('from-[#3aa0db] via-[#4cc3ea] to-[#5ee6f2]', 'from-sky via-[#72c5f8] to-white'),
    ('#5ee6f2', '#72c5f8'),
    ('94,230,242', '114,197,248'),
    ('94, 230, 242', '114, 197, 248'),
    ('#4cc3ea', '#5bb4ea'),
    ('#8fe9f5', '#a8d8fb'),
    ('cyan-300', 'sky'),
]

for path in ['index.html', 'components/about-locked-backup.html']:
    with open(path, 'r', encoding='utf-8', newline='') as f:
        h = f.read()
    s4 = h.index('SLIDE 4: OUR ESTABLISHED FOUNDATION')
    end = h.index('</section>', s4)
    seg = h[s4:end]
    before = seg.count('#5ee6f2') + seg.count('94,230,242')
    for a, b in REPL:
        seg = seg.replace(a, b)
    left = seg.count('#5ee6f2') + seg.count('94,230,242') + seg.count('#4cc3ea')
    h = h[:s4] + seg + h[end:]
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(h)
    print(path, 'cyan refs replaced:', before, 'left:', left)

