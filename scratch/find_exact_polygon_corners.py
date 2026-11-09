import os
import numpy as np
from PIL import Image, ImageDraw

PACK_DIR = "assets/img/packshots"

# --- 1. OPHTEIS EXACT CORNERS ---
im_oph = Image.open(os.path.join(PACK_DIR, "Ophteis Adaptive Pro.png")).convert("RGBA")
arr_oph = np.array(im_oph)
mask_oph = arr_oph[:, :, 3] > 240

# For each x from 242 to 1357, find y_min and y_max of mask_oph
xs_oph = np.arange(242, 1358)
y_top_oph = []
y_bot_oph = []
for x in xs_oph:
    ys = np.where(mask_oph[:, x])[0]
    y_top_oph.append(ys.min())
    y_bot_oph.append(ys.max())
y_top_oph = np.array(y_top_oph)
y_bot_oph = np.array(y_bot_oph)

# Top-most vertex (back-left corner of top flap): minimum of y_top_oph
idx_top_min = np.argmin(y_top_oph)
pt_oph_top_back_left = (int(xs_oph[idx_top_min]), int(y_top_oph[idx_top_min]))

# Bottom-most vertex (bottom-right of front face / bottom-left of right spine): maximum of y_bot_oph
idx_bot_max = np.argmax(y_bot_oph)
pt_oph_bot_front_right = (int(xs_oph[idx_bot_max]), int(y_bot_oph[idx_bot_max]))

# Left-most edge at x=242..245:
ys_left = np.where(mask_oph[:, 244])[0]
pt_oph_top_front_left = (242, int(ys_left.min()))
pt_oph_bot_front_left = (242, int(ys_left.max()))

# Right-most edge at x=1355:
ys_right = np.where(mask_oph[:, 1355])[0]
pt_oph_top_back_right = (1357, int(ys_right.min()))
pt_oph_bot_back_right = (1357, int(ys_right.max()))

# Now what is the inner corner (TR_front / front-right-top corner where Front, Top, and Right faces meet)?
# By parallelogram geometry or by vertical seam at x = pt_oph_bot_front_right[0] (around x=1246):
# Let's check where the vertical seam between Front Face and Right Spine is around x=1240..1260!
print("Ophteis outer corners:")
print("  Top-Back-Left (TL of Top Flap):", pt_oph_top_back_left)
print("  Top-Front-Left (TL of Front Face):", pt_oph_top_front_left)
print("  Bot-Front-Left (BL of Front Face):", pt_oph_bot_front_left)
print("  Bot-Front-Right (BR of Front Face):", pt_oph_bot_front_right)
print("  Top-Back-Right (TR of Top Flap):", pt_oph_top_back_right)
print("  Bot-Back-Right (BR of Right Spine):", pt_oph_bot_back_right)

# Let's check the crease between Top Flap and Front Face at x = 800 and x = 1246:
# Earlier at x=800, y=170 was [229,227,224] (top flap), y=190 was [248,246,243] (highlight crease), y=210 was [241,238,235] (front face).
for x_probe in [245, 500, 800, 1100, pt_oph_bot_front_right[0]]:
    col_rgb = arr_oph[130:260, x_probe, :3].astype(float).mean(axis=1)
    # Find max brightness (white highlight along the top-front edge crease)
    y_crease = 130 + int(np.argmax(col_rgb))
    print(f"  Ophteis top-front crease at x={x_probe}: y={y_crease} (max brightness={col_rgb.max():.1f})")

# --- 2. AEON EXACT CORNERS ---
im_aeon = Image.open(os.path.join(PACK_DIR, "AEON Protect.png")).convert("RGBA")
arr_aeon = np.array(im_aeon)
mask_aeon = arr_aeon[:, :, 3] > 240

xs_aeon = np.arange(516, 1964)
y_top_aeon = []
y_bot_aeon = []
for x in xs_aeon:
    ys = np.where(mask_aeon[:, x])[0]
    y_top_aeon.append(ys.min())
    y_bot_aeon.append(ys.max())
y_top_aeon = np.array(y_top_aeon)
y_bot_aeon = np.array(y_bot_aeon)

idx_aeon_top = np.argmin(y_top_aeon)
idx_aeon_bot = np.argmax(y_bot_aeon)
pt_aeon_top_seam = (int(xs_aeon[idx_aeon_top]), int(y_top_aeon[idx_aeon_top]))
pt_aeon_bot_seam = (int(xs_aeon[idx_aeon_bot]), int(y_bot_aeon[idx_aeon_bot]))

ys_aeon_left = np.where(mask_aeon[:, 518])[0]
pt_aeon_top_left = (516, int(ys_aeon_left.min()))
pt_aeon_bot_left = (516, int(ys_aeon_left.max()))

ys_aeon_right = np.where(mask_aeon[:, 1961])[0]
pt_aeon_top_right = (1963, int(ys_aeon_right.min()))
pt_aeon_bot_right = (1963, int(ys_aeon_right.max()))

print("\nAEON outer corners:")
print("  Top-Left (TL of Left Spine):", pt_aeon_top_left)
print("  Bot-Left (BL of Left Spine):", pt_aeon_bot_left)
print("  Top-Seam (TR of Left Spine / TL of Front Face):", pt_aeon_top_seam)
print("  Bot-Seam (BR of Left Spine / BL of Front Face):", pt_aeon_bot_seam)
print("  Top-Right (TR of Front Face):", pt_aeon_top_right)
print("  Bot-Right (BR of Front Face):", pt_aeon_bot_right)

