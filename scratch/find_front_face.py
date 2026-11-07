import cv2
import numpy as np

img = cv2.imread('assets/img/packshots/RayOne EMV Carton (5).png', cv2.IMREAD_UNCHANGED)
# Scale down for faster visualization and check
scale = 0.25
small = cv2.resize(img, (0, 0), fx=scale, fy=scale)
rgb = small[:, :, :3]
alpha = small[:, :, 3]

# The front face is bounded by:
# 1. Left vertical edge between side flap and front face
# 2. Top horizontal edge between top flap and front face
# 3. Bottom horizontal edge
# 4. Right vertical edge
# Let's inspect edges on the rgb image
edges = cv2.Canny(rgb, 50, 150)
print('Small shape:', small.shape)

