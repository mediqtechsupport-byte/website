with open('scratch/restore_scroll_stacking.py', 'r', encoding='utf-8') as f:
    s2_code = f.read()
    s2_start = s2_code.find("new_slide_2 = '''") + len("new_slide_2 = '''")
    s2_end = s2_code.find("'''", s2_start)
    s2 = s2_code[s2_start:s2_end]

for line in s2.splitlines()[:20]:
    if 'slide' in line.lower() or 'data-index' in line.lower():
        print(line)

