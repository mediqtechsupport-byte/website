import os
import numpy as np
from PIL import Image, ImageDraw

PACK_DIR = "assets/img/packshots"
SCRATCH_DIR = "scratch"

# 1. Inspect Ophteis Adaptive Pro.png (1600 x 1114)
im_oph = Image.open(os.path.join(PACK_DIR, "Ophteis Adaptive Pro.png")).convert("RGBA")
arr_oph = np.array(im_oph)

# Notice the reflection at the bottom of Ophteis Adaptive Pro.png has lower alpha or fades out, OR let's check the horizontal crease between the box bottom edge and its reflection!
# Let's check the alpha and brightness along x=241..1358
mask_oph = arr_oph[:, :, 3] > 250
ys, xs = np.where(mask_oph)
print("Ophteis alpha>250 bbox:", xs.min(), xs.max(), ys.min(), ys.max())

# Wait! Why is alpha>250 going down to y=1004? Because the reflection in the PNG is rendered over a white or semi-opaque layer or has alpha! Let's check RGB values below the box.
# At x=300, let's print y and RGB+A every 20px from y=100 to y=900
print("Ophteis column x=260 (purple band):")
for y in range(120, 750, 15):
    print(f"  y={y}: RGBA={arr_oph[y, 260]}")

print("Ophteis column x=800 (front white face):")
for y in range(150, 850, 20):
    print(f"  y={y}: RGBA={arr_oph[y, 800]}")

print("Ophteis column x=1300 (right spine):")
for y in range(180, 850, 20):
    print(f"  y={y}: RGBA={arr_oph[y, 1300]}")

# Let's also check AEON Protect.png (2480 x 3508)
im_aeon = Image.open(os.path.join(PACK_DIR, "AEON Protect.png")).convert("RGBA")
arr_aeon = np.array(im_aeon)
print("AEON Protect column x=650 (left spine):")
for y in range(250, 3250, 100):
    print(f"  y={y}: RGBA={arr_aeon[y, 650]}")

print("AEON Protect column x=1400 (front face):")
for y in range(250, 3250, 100):
    print(f"  y={y}: RGBA={arr_aeon[y, 1400]}")
