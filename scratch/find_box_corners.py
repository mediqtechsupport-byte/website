import cv2
import numpy as np

img = cv2.imread('assets/img/packshots/RayOne EMV Carton (5).png', cv2.IMREAD_UNCHANGED)
h, w, c = img.shape
print('EMV shape:', w, 'x', h, 'channels:', c)

# Let's inspect the alpha channel to find the box contour
alpha = img[:, :, 3]
contours, _ = cv2.findContours(alpha, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
largest = max(contours, key=cv2.contourArea)
rect = cv2.boundingRect(largest)
print('Bounding rect of box:', rect)

# Let's approximate the polygon of the box
epsilon = 0.01 * cv2.arcLength(largest, True)
approx = cv2.approxPolyDP(largest, epsilon, True)
print('Number of vertices in approx:', len(approx))
for pt in approx:
    print(pt[0])

