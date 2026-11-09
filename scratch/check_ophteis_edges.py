import os
import numpy as np
from PIL import Image

PACK_DIR = "assets/img/packshots"
im_oph = Image.open(os.path.join(PACK_DIR, "Ophteis Adaptive Pro.png")).convert("RGBA")
arr_oph = np.array(im_oph)

for y in [235, 350, 500, 650]:
    row = arr_oph[y, 1255:1285, :3].astype(float).mean(axis=1)
    # Find index where brightness drops below 232
    seam_dx = np.where(row < 232)[0]
    seam_x = 1255 + seam_dx[0] if len(seam_dx) else -1
    print(f"y={y}: seam_x={seam_x}, row={[round(v,1) for v in row[:20]]}")
