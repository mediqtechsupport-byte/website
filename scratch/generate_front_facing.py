import cv2
import numpy as np
from PIL import Image

# Load original
orig = cv2.imread('C:/Users/Pat/.gemini/antigravity/brain/44761d27-8779-4853-a6c0-110aa2113235/.user_uploaded/media_1793929300373_c8bc02d0.jpg')
h, w, _ = orig.shape

# Precise box boundaries from earlier check:
# Top-left of box: x=98, y=133
# Bottom-right of box: x=925, y=535
box_x1, box_y1 = 98, 133
box_x2, box_y2 = 925, 535

# Color variants to generate: (name, hue_target, sat_mult, val_mult)
# In OpenCV HSV, H is 0-179:
# Original Magenta is ~162.
variants = [
    ('front_aspheric.png', None, 1.0, 1.0),        # Original Magenta
    ('front_emv.png', 12, 1.15, 1.05),             # Warm RayOne Orange
    ('front_emv_toric.png', 6, 1.25, 1.0),         # Warm Toric Orange-Red
    ('front_trifocal.png', 108, 1.1, 0.95),        # RayOne Royal Blue
    ('front_trifocal_toric.png', 102, 1.2, 1.0),   # Trifocal Toric Cyan/Blue
    ('front_sulcoflex.png', 140, 1.15, 0.9),       # Sulcoflex Deep Purple
]

# Create alpha channel:
# Inside box: alpha = 255
# Outside box above bottom: alpha = 0
# Below box bottom: reflection!
alpha = np.zeros((h, w), dtype=np.float32)

# Box mask with 2px anti-aliasing
for y in range(h):
    for x in range(w):
        if box_y1 <= y <= box_y2 and box_x1 <= x <= box_x2:
            alpha[y, x] = 255.0
        elif y > box_y2 and (box_x1 - 20) <= x <= (box_x2 + 20):
            # Reflection zone: measure luminosity diff from dark floor
            # Floor bg around x=50, y=y
            floor_bg = float(orig[y, 20, 0] + orig[y, 20, 1] + orig[y, 20, 2]) / 3.0
            pixel_lum = float(orig[y, x, 0] + orig[y, x, 1] + orig[y, x, 2]) / 3.0
            diff = max(0.0, pixel_lum - floor_bg)
            # Distance from box bottom
            dist = float(y - box_y2)
            fade = max(0.0, 1.0 - (dist / 140.0)) ** 1.3
            alpha[y, x] = min(220.0, diff * 2.8 * fade)

# Smooth edges slightly
alpha = cv2.GaussianBlur(alpha, (3, 3), 0)

# Crop margin
crop_x1 = max(0, box_x1 - 30)
crop_x2 = min(w, box_x2 + 30)
crop_y1 = max(0, box_y1 - 25)
crop_y2 = min(h, box_y2 + 140)

# Process each variant
for filename, hue_target, sat_mult, val_mult in variants:
    # Work on a copy of orig
    img_var = orig.copy()
    
    if hue_target is not None:
        hsv = cv2.cvtColor(img_var, cv2.COLOR_BGR2HSV)
        # Mask for magenta/pink brand color
        lower_mag = np.array([142, 50, 50])
        upper_mag = np.array([178, 255, 255])
        mag_mask = cv2.inRange(hsv, lower_mag, upper_mag) > 0
        
        # Replace hue with target hue
        hsv[mag_mask, 0] = hue_target
        hsv[mag_mask, 1] = np.clip(hsv[mag_mask, 1].astype(np.float32) * sat_mult, 0, 255).astype(np.uint8)
        hsv[mag_mask, 2] = np.clip(hsv[mag_mask, 2].astype(np.float32) * val_mult, 0, 255).astype(np.uint8)
        
        img_var = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
    
    # Assemble RGBA
    b, g, r = cv2.split(img_var)
    rgba = cv2.merge([b, g, r, alpha.astype(np.uint8)])
    
    # Crop to tightly framed packshot
    cropped = rgba[crop_y1:crop_y2, crop_x1:crop_x2]
    
    out_path = f'assets/img/packshots/{filename}'
    cv2.imwrite(out_path, cropped)
    print(f"Generated {filename}: {cropped.shape[1]}x{cropped.shape[0]}")

print("All front-facing packshots generated successfully!")

