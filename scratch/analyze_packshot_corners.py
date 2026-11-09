import os
import numpy as np
from PIL import Image, ImageDraw

PACK_DIR = "assets/img/packshots"
SCRATCH_DIR = "scratch"
os.makedirs(SCRATCH_DIR, exist_ok=True)

# 1. Analyze Ophteis images (1600 x 1114)
ophteis_files = [
    ("adaptive", "Ophteis Adaptive Pro.png"),
    ("cohesive", "Ophteis Cohesive.png"),
    ("dispersive", "Ophteis Dispersive.png"),
]

for key, fname in ophteis_files:
    im = Image.open(os.path.join(PACK_DIR, fname)).convert("RGBA")
    arr = np.array(im)
    # Check alpha or non-white
    # In Ophteis PNGs, let's check corner pixels and alpha
    print(f"=== Ophteis {key} ({im.size}) ===")
    print("Top-left pixel RGBA:", arr[0, 0])
    # Find non-background mask
    # Either alpha > 20 or difference from top-left pixel
    bg = arr[0, 0, :3].astype(int)
    diff = np.abs(arr[:, :, :3].astype(int) - bg).max(axis=2)
    mask = (arr[:, :, 3] > 20) & (diff > 12) if arr[0, 0, 3] > 200 else (arr[:, :, 3] > 20)
    ys, xs = np.where(mask)
    print(f"BBox: x=[{xs.min()}, {xs.max()}], y=[{ys.min()}, {ys.max()}]")
    
    # Let's find extreme vertices of the hexagon silhouette:
    # Top-most point (top-left of top flap):
    top_y = ys.min()
    top_xs = xs[ys <= top_y + 2]
    pt_top = (int(np.median(top_xs)), int(top_y))
    
    # Left-most column (left vertical edge of front face):
    left_x = xs.min()
    left_ys = ys[xs <= left_x + 3]
    pt_left_top = (int(left_x), int(left_ys.min()))
    pt_left_bot = (int(left_x), int(left_ys.max()))
    
    # Bottom-most point (bottom-right of front face / bottom-left of right spine):
    bot_y = ys.max()
    bot_xs = xs[ys >= bot_y - 2]
    pt_bot = (int(np.median(bot_xs)), int(bot_y))
    
    # Right-most column (right vertical edge of right spine):
    right_x = xs.max()
    right_ys = ys[xs >= right_x - 3]
    pt_right_top = (int(right_x), int(right_ys.min()))
    pt_right_bot = (int(right_x), int(right_ys.max()))
    
    print("  pt_top:", pt_top)
    print("  pt_left_top:", pt_left_top, "pt_left_bot:", pt_left_bot)
    print("  pt_bot:", pt_bot)
    print("  pt_right_top:", pt_right_top, "pt_right_bot:", pt_right_bot)

# 2. Analyze AEON standalone carton images (2480 x 3508)
aeon_carton_files = [
    ("protect", "AEON Protect.png"),
    ("protect_plus", "AEON Protect (1).png"),
    ("repair", "AEON Repair.png"),
    ("nacl", "AEON NaCl.png"),
]

for key, fname in aeon_carton_files:
    im = Image.open(os.path.join(PACK_DIR, fname)).convert("RGBA")
    arr = np.array(im)
    print(f"=== AEON Carton {key} ({im.size}) ===")
    print("Top-left pixel RGBA:", arr[0, 0])
    # Notice AEON cartons have a reflection at the bottom!
    # Let's check alpha profile vertically to see where the main box ends and reflection begins, or where the corners are.
    mask = arr[:, :, 3] > 200
    ys, xs = np.where(mask)
    print(f"Alpha>200 BBox: x=[{xs.min()}, {xs.max()}], y=[{ys.min()}, {ys.max()}]")
    top_y = ys.min()
    top_xs = xs[ys <= top_y + 3]
    left_x = xs.min()
    left_ys = ys[xs <= left_x + 3]
    right_x = xs.max()
    right_ys = ys[xs >= right_x - 3]
    print("  top peak:", (int(np.median(top_xs)), int(top_y)))
    print("  left edge y range:", (int(left_ys.min()), int(left_ys.max())), "at x=", int(left_x))
    print("  right edge y range:", (int(right_ys.min()), int(right_ys.max())), "at x=", int(right_x))

