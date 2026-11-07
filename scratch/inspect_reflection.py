from PIL import Image
import numpy as np

im = Image.open('assets/img/packshots/ophteis_adaptive.png').convert('RGBA')
arr = np.array(im)
alpha = arr[:, :, 3]

# Where is the box itself? Reflection is usually in the bottom half and has lower opacity or different gradient
# Let's see the brightness / solid opacity
print("Y-profile of opacity:")
for y in range(0, im.height, 100):
    row_alpha = np.mean(alpha[y:y+50, :])
    print(f"y={y}: avg alpha={row_alpha:.1f}")

# Let's save a visual inspection image
im.resize((300, int(300 * im.height / im.width))).save('scratch/preview_ophteis_adaptive.png')
print("Saved scratch/preview_ophteis_adaptive.png")

