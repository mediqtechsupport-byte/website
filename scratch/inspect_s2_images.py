import re

with open('scratch/restore_scroll_stacking.py', 'r', encoding='utf-8') as f:
    s2_code = f.read()
    s2_start = s2_code.find("new_slide_2 = '''") + len("new_slide_2 = '''")
    s2_end = s2_code.find("'''", s2_start)
    s2 = s2_code[s2_start:s2_end]

imgs = re.findall(r'<img[^>]*src="([^"]+)"', s2)
h3s = re.findall(r'<h3[^>]*>([^<]+)</h3>', s2)
print("Slide 2 H3s:", h3s)
print("Slide 2 Images:", imgs)

