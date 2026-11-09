import os
import numpy as np
from PIL import Image

PACK_DIR = "assets/img/packshots"

def find_perspective_coeffs(dst_pts, src_pts):
    """
    Compute 8 perspective transform coefficients for PIL Image.transform(..., Image.Transform.PERSPECTIVE, coeffs)
    mapping dst_pts (output rectangle corners) -> src_pts (input quad corners).
    Order of points: [TL, TR, BR, BL]
    """
    matrix = []
    for (x_dst, y_dst), (x_src, y_src) in zip(dst_pts, src_pts):
        matrix.append([x_dst, y_dst, 1, 0, 0, 0, -x_src * x_dst, -x_src * y_dst])
        matrix.append([0, 0, 0, x_dst, y_dst, 1, -y_src * x_dst, -y_src * y_dst])
    A = np.array(matrix, dtype=np.float64)
    B = np.array(src_pts, dtype=np.float64).reshape(8)
    res = np.linalg.solve(A, B)
    return res.tolist()

def warp_quad(img, src_quad, out_w, out_h):
    dst_quad = [(0, 0), (out_w, 0), (out_w, out_h), (0, out_h)]
    coeffs = find_perspective_coeffs(dst_quad, src_quad)
    return img.transform((out_w, out_h), Image.Transform.PERSPECTIVE, coeffs, Image.Resampling.BICUBIC)

# ---------------------------------------------------------
# 1. UNWRAP OPHTEIS 3D BOX FACES (Adaptive Pro, Cohesive, Dispersive)
# ---------------------------------------------------------
ophteis_configs = [
    ("adaptive", "Ophteis Adaptive Pro.png"),
    ("cohesive", "Ophteis Cohesive.png"),
    ("dispersive", "Ophteis Dispersive.png"),
]

# Slightly inset by 1.5px inside the outer silhouette so zero transparent/background edge pixels bleed in
oph_front_quad = [
    (244, 143),   # TL_front
    (1270, 232),  # TR_front
    (1260, 698),  # BR_front
    (252, 563),   # BL_front
]
oph_top_quad = [
    (342, 122),   # TL_top
    (1354, 207),  # TR_top
    (1270, 231),  # BR_top (TR_front)
    (244, 142),   # BL_top (TL_front)
]
oph_right_quad = [
    (1272, 232),  # TL_right (TR_front)
    (1355, 208),  # TR_right (TR_top)
    (1346, 659),  # BR_right
    (1262, 698),  # BL_right (BR_front)
]

for key, fname in ophteis_configs:
    im = Image.open(os.path.join(PACK_DIR, fname)).convert("RGB")
    front_tex = warp_quad(im, oph_front_quad, 1080, 516) # 360:172 ratio (3x supersampled)
    top_tex = warp_quad(im, oph_top_quad, 1080, 192)     # 360:64 ratio (3x supersampled)
    right_tex = warp_quad(im, oph_right_quad, 192, 516)  # 64:172 ratio (3x supersampled)
    
    front_path = os.path.join(PACK_DIR, f"box_front_ophteis_{key}.png")
    top_path = os.path.join(PACK_DIR, f"box_top_ophteis_{key}.png")
    right_path = os.path.join(PACK_DIR, f"box_right_ophteis_{key}.png")
    
    front_tex.save(front_path, "PNG", optimize=True)
    top_tex.save(top_path, "PNG", optimize=True)
    right_tex.save(right_path, "PNG", optimize=True)
    print(f"Saved Ophteis {key} textures: {front_path}, {top_path}, {right_path}")

# ---------------------------------------------------------
# 2. UNWRAP AEON VERTICAL 3D CARTON FACES (Protect, Protect Plus, Repair, NaCl)
# ---------------------------------------------------------
aeon_configs = [
    ("protect", "AEON Protect.png"),
    ("protect_plus", "AEON Protect (1).png"),
    ("repair", "AEON Repair.png"),
    ("nacl", "AEON NaCl.png"),
]

# Inset by 2px from outer silhouette to guarantee 100% opaque crisp edges
aeon_front_quad = [
    (761, 252),   # TL_front (top seam)
    (1959, 283),  # TR_front
    (1959, 3219), # BR_front
    (761, 3256),  # BL_front (bottom seam)
]
aeon_side_quad = [
    (520, 357),   # TL_left
    (759, 252),   # TR_left (top seam)
    (759, 3256),  # BR_left (bottom seam)
    (520, 3152),  # BL_left
]

for key, fname in aeon_configs:
    im = Image.open(os.path.join(PACK_DIR, fname)).convert("RGB")
    # Target ratio for AEON vertical carton: Front is 540 x 960, Left spine is 252 x 960
    front_tex = warp_quad(im, aeon_front_quad, 540, 960)
    side_tex = warp_quad(im, aeon_side_quad, 252, 960)
    
    front_path = os.path.join(PACK_DIR, f"box_front_aeon_{key}.png")
    side_path = os.path.join(PACK_DIR, f"box_side_aeon_{key}.png")
    front_tex.save(front_path, "PNG", optimize=True)
    side_tex.save(side_path, "PNG", optimize=True)
    print(f"Saved AEON {key} carton textures: {front_path}, {side_path}")

# ---------------------------------------------------------
# 3. EXTRACT CLEAN AEON DROPPER BOTTLES
# ---------------------------------------------------------
bottle_configs = [
    ("protect", "AEON Protect blue bottle.png"),
    ("protect_plus", "AEON Protect plus clear bottle.png"),
    ("repair", "AEON Repair clear bottle.png"),
    ("nacl", "AEON Sodium_chloride clear bottle.png"),
]

for key, fname in bottle_configs:
    im = Image.open(os.path.join(PACK_DIR, fname)).convert("RGBA")
    arr = np.array(im)
    # Check alpha bbox
    mask = arr[:, :, 3] > 20
    ys, xs = np.where(mask)
    print(f"Bottle {key} ({im.size}) alpha>20 bbox: x=[{xs.min()}, {xs.max()}], y=[{ys.min()}, {ys.max()}]")
    # Also check alpha>240 bbox (in case there is a reflection at the bottom)
    mask_hi = arr[:, :, 3] > 240
    ys_hi, xs_hi = np.where(mask_hi)
    print(f"Bottle {key} alpha>240 bbox: x=[{xs_hi.min()}, {xs_hi.max()}], y=[{ys_hi.min()}, {ys_hi.max()}]")
    # Crop tightly around alpha>240 (or full bottle if no reflection) with 8px padding
    pad = 8
    x0 = max(0, int(xs_hi.min()) - pad)
    x1 = min(im.width, int(xs_hi.max()) + pad)
    y0 = max(0, int(ys_hi.min()) - pad)
    y1 = min(im.height, int(ys_hi.max()) + pad)
    cropped = im.crop((x0, y0, x1, y1))
    # Resize to a crisp display height (e.g. 760px tall, preserving aspect ratio)
    scale = 760.0 / cropped.height
    new_w = int(round(cropped.width * scale))
    resized = cropped.resize((new_w, 760), Image.Resampling.LANCZOS)
    out_path = os.path.join(PACK_DIR, f"bottle_aeon_{key}.png")
    resized.save(out_path, "PNG", optimize=True)
    print(f"Saved clean AEON bottle {key}: {out_path} ({resized.size})")

