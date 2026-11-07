with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('scratch/new_slide1_bigger.html', 'r', encoding='utf-8') as f:
    new_slide1 = f.read().strip()

start_marker = "<!-- ========================================================================= -->\n        <!-- SLIDE 2: WHO WE ARE"
start_pos = html.find(start_marker)
if start_pos == -1:
    start_pos = html.find("<!-- SLIDE 2: WHO WE ARE")
    start_pos = html.rfind("<!-- ==", 0, start_pos)

end_marker = "<!-- ========================================================================= -->\n        <!-- SLIDE 3: WHAT WE DO"
end_pos = html.find(end_marker)

print(f"start_pos: {start_pos}, end_pos: {end_pos}")

new_html = html[:start_pos] + new_slide1 + "\n\n        " + html[end_pos:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("Slide 1 updated with bigger boxes and balanced vertical positioning!")

