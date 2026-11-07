with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
style_match = re.search(r'<style>([\s\S]*?)</style>', text)
if style_match:
    print("Style tag found! Length:", len(style_match.group(1)))
    print("Ends with:", style_match.group(1)[-300:])

