from PIL import Image
import numpy as np

im = Image.open('assets/img/packshots/ophteis_adaptive.png').convert('RGBA')
arr = np.array(im)

# Let's see alpha distribution
alpha = arr[:, :, 3]
rgb = arr[:, :, :3]

# where is alpha > 50 (solid content)
solid = np.where(alpha > 100)
min_y, max_y = np.min(solid[0]), np.max(solid[0])
min_x, max_x = np.min(solid[1]), np.max(solid[1])

print(f"Solid alpha > 100 bbox: x=[{min_x}, {max_x}], y=[{min_y}, {max_y}]")
print(f"Total dimensions: {im.size}")

