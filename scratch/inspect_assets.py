import os

if os.path.exists('assets/img/pillars'):
    print("assets/img/pillars:")
    for f in os.listdir('assets/img/pillars'):
        print(" -", f)

for root, dirs, files in os.walk('assets'):
    for f in files:
        if any(f.endswith(ext) for ext in ['.jpg', '.png', '.webp', '.svg']):
            if 'pillars' not in root and 'img' in root:
                pass

