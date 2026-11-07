import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r'\s*<!-- Quick Back to Purpose & Map Button -->\s*<div class="mb-5 sm:mb-6">[\s\S]*?</span>\s*</button>\s*</div>'

new_text, count = re.subn(pattern, '', text)
print(f"Replacements made: {count}")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_text)

