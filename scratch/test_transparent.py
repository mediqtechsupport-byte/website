import cv2
import numpy as np

img = cv2.imread('C:/Users/Pat/.gemini/antigravity/brain/44761d27-8779-4853-a6c0-110aa2113235/.user_uploaded/media_1793929300373_c8bc02d0.jpg')
h, w, c = img.shape

# The background color is approximately (34, 27, 24) in BGR
# The box is white (240, 240, 240)
# The reflection is below the box baseline (y ~ 535)

# Let's inspect rows around y=535
box_bottom = 535
print("Box bottom row y =", box_bottom)

# For y <= box_bottom: background is dark, box is white
# For y > box_bottom: ground reflection
# Let's test creating an RGBA image
rgba = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)

# In the top area (y <= box_bottom), alpha is 255 inside the box, 0 outside
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Threshold to separate box from dark background
# Background is < 40, box is > 180
# Soft anti-aliased edge
alpha = np.zeros((h, w), dtype=np.uint8)

# Inside box: y between 132 and 535, x between 97 and 925
# Let's find the exact mask of the box
for y in range(h):
    for x in range(w):
        val = int(gray[y, x])
        if y <= box_bottom:
            # Box region
            if val > 60:
                # Inside box
                alpha[y, x] = min(255, int((val - 40) * 4))
            else:
                alpha[y, x] = 0
        else:
            # Reflection region
            # Difference from background
            diff = max(0, val - 30)
            # Fade out reflection towards bottom
            fade = 1.0 - (y - box_bottom) / (h - box_bottom)
            alpha[y, x] = min(220, int(diff * 2.2 * fade))

rgba[:, :, 3] = alpha
cv2.imwrite('scratch/test_transparent_front.png', rgba)
print("Saved transparent test!")

