import cv2
import numpy as np

orig = cv2.imread('C:/Users/Pat/.gemini/antigravity/brain/44761d27-8779-4853-a6c0-110aa2113235/.user_uploaded/media_1793929300373_c8bc02d0.jpg')
h, w, _ = orig.shape

box_x1, box_y1 = 98, 133
box_x2, box_y2 = 925, 535

# Color variants to generate: (name, hue_target, sat_mult, val_mult)
variants = [
    ('front_aspheric.png', None, 1.0, 1.0),        # Original Magenta (RayOne Aspheric)
    ('front_emv.png', 12, 1.15, 1.05),             # Warm RayOne Orange (RayOne EMV)
    ('front_emv_toric.png', 6, 1.25, 1.0),         # Warm Toric Orange-Red (RayOne EMV Toric)
    ('front_trifocal.png', 108, 1.1, 0.95),        # RayOne Royal Blue (RayOne Trifocal)
    ('front_trifocal_toric.png', 102, 1.2, 1.0),   # Trifocal Toric Cyan/Blue (RayOne Trifocal Toric)
    ('front_sulcoflex.png', 140, 1.15, 0.9),       # Sulcoflex Deep Purple (Sulcoflex Aspheric)
]

alpha = np.zeros((h, w), dtype=np.float32)

# Box mask: 255 inside box
alpha[box_y1:box_y2, box_x1:box_x2] = 255.0

# Reflection zone below box_y2
for y in range(box_y2, min(h, box_y2 + 140)):
    # Calculate background luminosity at left edge
    bg_lum = (float(orig[y, 20, 0]) + float(orig[y, 20, 1]) + float(orig[y, 20, 2])) / 3.0
    for x in range(box_x1 - 10, box_x2 + 10):
        pix_lum = (float(orig[y, x, 0]) + float(orig[y, x, 1]) + float(orig[y, x, 2])) / 3.0
        diff = max(0.0, pix_lum - bg_lum)
        dist = float(y - box_y2)
        fade = max(0.0, 1.0 - (dist / 140.0)) ** 1.2
        alpha[y, x] = min(220.0, diff * 2.8 * fade)

# Smooth edges with 3x3 gaussian blur
alpha = cv2.GaussianBlur(alpha, (3, 3), 0)

crop_x1 = max(0, box_x1 - 25)
crop_x2 = min(w, box_x2 + 25)
crop_y1 = max(0, box_y1 - 20)
crop_y2 = min(h, box_y2 + 140)

for filename, hue_target, sat_mult, val_mult in variants:
    img_var = orig.copy()
    
    if hue_target is not None:
        hsv = cv2.cvtColor(img_var, cv2.COLOR_BGR2HSV)
        lower_mag = np.array([142, 50, 50])
        upper_mag = np.array([178, 255, 255])
        mag_mask = cv2.inRange(hsv, lower_mag, upper_mag) > 0
        
        hsv[mag_mask, 0] = hue_target
        hsv[mag_mask, 1] = np.clip(hsv[mag_mask, 1].astype(np.float32) * sat_mult, 0, 255).astype(np.uint8)
        hsv[mag_mask, 2] = np.clip(hsv[mag_mask, 2].astype(np.float32) * val_mult, 0, 255).astype(np.uint8)
        
        img_var = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
    
    b, g, r = cv2.split(img_var)
    rgba = cv2.merge([b, g, r, alpha.astype(np.uint8)])
    
    cropped = rgba[crop_y1:crop_y2, crop_x1:crop_x2]
    
    out_path = f'assets/img/packshots/{filename}'
    cv2.imwrite(out_path, cropped)
    print(f"Generated {filename}: {cropped.shape[1]}x{cropped.shape[0]}")

print("Clean front-facing packshots created successfully without warnings!")

