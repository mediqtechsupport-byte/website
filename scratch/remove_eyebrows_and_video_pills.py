import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove "ABOUT MEDIQ • CORPORATE IDENTITY" from Slide 1
slide1_eyebrow = re.compile(
    r'<p class="text-\[11px\] sm:text-xs font-mono font-bold tracking-\[0\.25em\] text-sky uppercase mb-2">\s*'
    r'ABOUT MEDIQ &bull; CORPORATE IDENTITY\s*'
    r'</p>\s*',
    re.DOTALL
)

if not slide1_eyebrow.search(content):
    print("Warning: Slide 1 eyebrow not found directly, checking variations...")
else:
    content = slide1_eyebrow.sub('', content)
    print("Slide 1 eyebrow removed successfully.")

# 2. Remove "ABOUT MEDIQ • CORE CAPABILITIES" pill from Slide 2
slide2_eyebrow = re.compile(
    r'<p class="inline-flex items-center gap-2 px-3\.5 py-1 rounded-full bg-sky/10 border border-sky/30 text-sky text-\[11px\] font-bold tracking-widest uppercase mb-3 shadow-\[0_0_20px_rgba\(58,160,219,0\.2\)\]">\s*'
    r'<span>ABOUT MEDIQ &bull; CORE CAPABILITIES</span>\s*'
    r'<span class="inline-block h-1\.5 w-1\.5 rounded-full bg-sky animate-ping"></span>\s*'
    r'</p>\s*',
    re.DOTALL
)

if not slide2_eyebrow.search(content):
    print("Warning: Slide 2 eyebrow not found directly, checking variations...")
else:
    content = slide2_eyebrow.sub('', content)
    print("Slide 2 eyebrow removed successfully.")

# 3. Remove all bottom overlay gradient and pills on the video columns in Slide 2
# Pattern matches from after the video element closing tag until before the closing div of the video column
video_overlay_pattern = re.compile(
    r'(<video [^>]+></video>)\s*'
    r'<div class="absolute inset-0 bg-gradient-to-t [^"]*?"></div>\s*'
    r'<div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-\[11px\] text-white">.*?'
    r'</div>\s*(?=</div>\s*</div>\s*</div>)',
    re.DOTALL
)

matches = video_overlay_pattern.findall(content)
print(f"Found {len(matches)} video overlays to remove.")

content = video_overlay_pattern.sub(r'\1', content)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated index.html successfully.")

