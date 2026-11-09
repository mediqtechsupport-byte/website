import numpy as np
from PIL import Image

im = Image.open("assets/img/packshots/authentic_emv.png").convert("RGBA")
arr = np.array(im)
mask = arr[:, :, 3] > 240
print("authentic_emv size:", im.size)
for x in range(1400, im.width, 10):
    ys = np.where(mask[:, x])[0]
    if len(ys):
        print(f"  x={x}: y=[{ys.min()}, {ys.max()}]")

