with open('scratch/new_slide1_bigger.html', 'r', encoding='utf-8') as f:
    s1 = f.read()

with open('scratch/restore_scroll_stacking.py', 'r', encoding='utf-8') as f:
    s2_code = f.read()
    s2_start = s2_code.find("new_slide_2 = '''") + len("new_slide_2 = '''")
    s2_end = s2_code.find("'''", s2_start)
    s2 = s2_code[s2_start:s2_end]

with open('scratch/new_deck_slides.html', 'r', encoding='utf-8') as f:
    deck = f.read()
    s4_start = deck.find('<!-- SLIDE 4: OUR ESTABLISHED FOUNDATION')
    divider_s4 = deck.rfind('<!-- ===', 0, s4_start)
    if divider_s4 != -1:
        s4_start = divider_s4
    s3_4 = deck[s4_start:]

print(f"Slide 1 lines: {len(s1.splitlines())}")
print(f"Slide 2 lines: {len(s2.splitlines())}")
print(f"Slides 3 & 4 lines: {len(s3_4.splitlines())}")

