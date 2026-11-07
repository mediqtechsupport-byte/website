import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

about_start = text.find('id="about"')
about_end = text.find('</section>', about_start)
about_chunk = text[about_start:about_end]

all_videos = re.findall(r'<video[^>]+src=["\']([^"\']+)["\']', text)
about_media = re.findall(r'(?:src|poster)=["\']([^"\']+)["\']', about_chunk)

print("ALL VIDEOS IN INDEX.HTML:")
for v in set(all_videos):
    print("  video:", v)

print("\nALL MEDIA IN ABOUT SECTION:")
for m in set(about_media):
    print("  about media:", m)

