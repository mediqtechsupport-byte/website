import cv2
import os

configs = [
    ('RayOne EMV Toric (13).png', 'assets/img/packshots/emv_stage.png'),
    ('RayOne Trifocal (10).png', 'assets/img/packshots/trifocal_stage.png'),
    ('RayOne Aspheric (8).png', 'assets/img/packshots/aspheric_stage.png'),
]

for src, dest in configs:
    src_path = os.path.join('assets/img/packshots', src)
    img = cv2.imread(src_path, cv2.IMREAD_UNCHANGED)
    if img is not None:
        h, w = img.shape[:2]
        target_w = 1400
        target_h = int(h * target_w / w)
        resized = cv2.resize(img, (target_w, target_h), interpolation=cv2.INTER_AREA)
        cv2.imwrite(dest, resized, [cv2.IMWRITE_PNG_COMPRESSION, 7])
        print(f"Generated {dest}: {target_w}x{target_h}, size: {os.path.getsize(dest)} bytes")
    else:
        print(f"Error loading {src}")

