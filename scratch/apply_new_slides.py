import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('scratch/new_deck_slides.html', 'r', encoding='utf-8') as f:
    new_slides = f.read().strip()

start_marker = "<!-- ========================================================================= -->\n        <!-- SLIDE 2: WHO WE ARE"
start_pos = html.find(start_marker)
if start_pos == -1:
    # try alternate match
    start_pos = html.find("<!-- SLIDE 2: WHO WE ARE")
    # walk back to previous <!-- ===
    start_pos = html.rfind("<!-- ==", 0, start_pos)

end_marker = "      </div>\n\n    </section>"
end_pos = html.find(end_marker, start_pos)

print(f"Found start_pos: {start_pos}, end_pos: {end_pos}")

new_html = html[:start_pos] + new_slides + "\n\n" + html[end_pos:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("Successfully replaced deck slides in index.html")

