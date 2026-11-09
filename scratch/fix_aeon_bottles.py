import os
import numpy as np
from PIL import Image

PACK_DIR = "assets/img/packshots"

bottle_configs = [
    ("protect", "AEON Protect blue bottle.png", 3260),
    ("protect_plus", "AEON Protect plus clear bottle.png", 3250),
    ("repair", "AEON Repair clear bottle.png", 3250),
    ("nacl", "AEON Sodium_chloride clear bottle.png", 3260),
]

for key, fname, y_bot_bottle in bottle_configs:
    im = Image.open(os.path.join(PACK_DIR, fname)).convert("RGBA")
    arr = np.array(im)
    # Zero out any floor reflection below y_bot_bottle
    arr[y_bot_bottle:, :, 3] = 0
    im_clean = Image.fromarray(arr)
    mask = arr[:y_bot_bottle, :, 3] > 25
    ys, xs = np.where(mask)
    pad = 8
    x0 = max(0, int(xs.min()) - pad)
    x1 = min(im.width, int(xs.max()) + pad)
    y0 = max(0, int(ys.min()) - pad)
    y1 = min(im.height, int(ys.max()) + pad)
    cropped = im_clean.crop((x0, y0, x1, y1))
    scale = 760.0 / cropped.height
    new_w = int(round(cropped.width * scale))
    resized = cropped.resize((new_w, 760), Image.Resampling.LANCZOS)
    out_path = os.path.join(PACK_DIR, f"bottle_aeon_{key}.png")
    resized.save(out_path, "PNG", optimize=True)
    print(f"Updated bottle {key}: {out_path} ({resized.size})")

