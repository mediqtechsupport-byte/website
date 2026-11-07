p = 'scratch/redesign_what_we_do_v3.py'
s = open(p, encoding='utf-8').read()
anchor = '<div class="flex flex-col items-center text-center gap-1.5">'
assert anchor in s
tag = ('<p class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky/10 border border-sky/30 text-sky text-[11px] font-bold tracking-widest uppercase">'
       '<span>ABOUT MEDIQ &bull; CAPABILITIES</span><span class="inline-block h-1 w-1 rounded-full bg-sky"></span></p>')
s = s.replace(anchor, anchor + '\n              ' + tag, 1)
open(p, 'w', encoding='utf-8').write(s)
print('ok')

