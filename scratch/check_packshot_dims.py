import cv2
import os

for fname in ['RayOne EMV Toric (13).png', 'RayOne Trifocal (10).png', 'RayOne Aspheric (8).png']:
    fpath = os.path.join('assets/img/packshots', fname)
    img = cv2.imread(fpath, cv2.IMREAD_UNCHANGED)
    if img is not None:
        h, w, c = img.shape
        print(f"{fname}: {w}x{h}, channels: {c}")
    else:
        print(f"Could not load {fname}")

