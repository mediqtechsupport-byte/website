import os, re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

slide_match = re.search(r'id="about-slide-what-we-do".*?(?=id="about-slide|\Z)', html, re.DOTALL)
if slide_match:
    imgs = re.findall(r'src="([^"]+)"', slide_match.group(0))
    for img in imgs:
        clean = img.split('?')[0]
        exists = os.path.exists(clean)
        print(f'{clean}: exists={exists}')

