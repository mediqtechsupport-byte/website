from PIL import Image
import numpy as np

im = Image.open('assets/img/packshots/authentic_emv.png').convert('RGBA')
arr = np.array(im)

# Save a slice of the bottom of the box
# Let's see the bottom 100 pixels where alpha > 0
alpha = arr[:, :, 3]
y_indices = np.where(alpha > 30)[0]
max_y = np.max(y_indices)
print("max_y with alpha > 30:", max_y)

# Let's inspect the last 15 rows of alpha and rgb
print("Alpha of last 5 rows:")
for y in range(max_y-5, max_y+1):
    row_a = alpha[y, :]
    non_zero = np.where(row_a > 10)[0]
    print(f"y={y}: count_non_zero={len(non_zero)}, max_a={np.max(row_a)}")

# Let's crop from y=max_y-150 to max_y and save preview
crop = im.crop((0, max_y-200, im.width, max_y+10))
crop.save('scratch/emv_bottom_preview.png')
print("Saved emv_bottom_preview.png")

