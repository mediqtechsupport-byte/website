import cv2
import numpy as np

img = cv2.imread('C:/Users/Pat/.gemini/antigravity/brain/44761d27-8779-4853-a6c0-110aa2113235/.user_uploaded/media_1793929300373_c8bc02d0.jpg')
h, w, c = img.shape
print('Image dimensions:', w, 'x', h)

# Find coordinates of the box
# The box has white background (high values in all 3 channels)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
# threshold for near-white
_, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

for cnt in contours:
    x, y, bw, bh = cv2.boundingRect(cnt)
    if bw > 400 and bh > 200:
        print(f"Found box bounding rect: x={x}, y={y}, w={bw}, h={bh}")

