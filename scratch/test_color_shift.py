import cv2
import numpy as np
from PIL import Image

# Load the user-provided front-facing studio image
img = cv2.imread('C:/Users/Pat/.gemini/antigravity/brain/44761d27-8779-4853-a6c0-110aa2113235/.user_uploaded/media_1793929300373_c8bc02d0.jpg')
h, w, c = img.shape
print(f"Loaded image: {w}x{h}")

# Convert to HSV to easily detect the magenta/pink brand elements
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

# Magenta hue range in OpenCV (H is 0-179, magenta is around 150-175)
lower_magenta = np.array([145, 60, 60])
upper_magenta = np.array([178, 255, 255])
mask = cv2.inRange(hsv, lower_magenta, upper_magenta)
print(f"Magenta pixels count: {np.count_nonzero(mask)}")

# Let's save the mask to inspect
cv2.imwrite('scratch/magenta_mask.png', mask)
print("Saved magenta mask!")

