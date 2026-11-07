p = 'scratch/redesign_what_we_do_v3.py'
s = open(p, encoding='utf-8').read()
for n in (1, 3):
    a = 'if(window.goToAboutSlide){window.goToAboutSlide(%d);}' % n
    b = 'if(window.goToAboutSlide){{window.goToAboutSlide(%d);}}' % n
    assert a in s
    s = s.replace(a, b)
open(p, 'w', encoding='utf-8').write(s)
print('fixed')

