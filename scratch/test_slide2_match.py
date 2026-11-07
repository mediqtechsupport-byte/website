import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Locate Slide 2 (data-index="2")
slide2_pattern = re.compile(
    r'(<!--\s*===+\s*-->\s*<!--\s*SLIDE 3: WHAT WE DO.*?-->\s*<!--\s*===+\s*-->\s*)'
    r'(<div class="about-slide [^"]*?" data-index="2">)'
    r'(.*?)'
    r'(</div>\s*<!--\s*===+\s*-->\s*<!--\s*SLIDE 4: OUR ESTABLISHED FOUNDATION)',
    re.DOTALL
)

match = slide2_pattern.search(content)
if not match:
    print("Could not find Slide 2 match!")
    exit(1)

print("Found Slide 2 match successfully.")

