from PIL import Image
import numpy as np

im = Image.open('assets/img/packshots/RayOne EMV Toric (13).png').convert('RGBA')
arr = np.array(im)
alpha = arr[:, :, 3]
solid = np.where(alpha > 30)
print("Size:", im.size)
print(f"BBox: X=[{np.min(solid[1])}, {np.max(solid[1])}], Y=[{np.min(solid[0])}, {np.max(solid[0])}]")

