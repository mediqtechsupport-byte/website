from PIL import Image
import numpy as np

im = Image.open('assets/img/packshots/ophteis_adaptive.png').convert('RGBA')
arr = np.array(im)
alpha = arr[:, :, 3]

# In the box area (y: 50 to 450)
box_area = alpha[50:450, :]
print("X-profile of box (y 50-450):")
for x in range(0, im.width, 100):
    col_alpha = np.mean(box_area[:, x:x+50])
    print(f"x={x}: avg alpha={col_alpha:.1f}")

