import re

with open('scratch/vecteezy_72005189.html', 'r', encoding='utf-8') as f:
    text = f.read()

urls = re.findall(r'https?://[^\s"\'<>]+\.mp4[^\s"\'<>]*', text)
print(f"Found {len(urls)} mp4 urls:")
for u in set(urls):
    print(u)

