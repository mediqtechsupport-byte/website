from PIL import Image
import numpy as np

for name in ['authentic_emv.png', 'authentic_emv_toric.png', 'RayOne EMV Carton (5).png']:
    p = f'assets/img/packshots/{name}'
    try:
        im = Image.open(p).convert('RGBA')
        arr = np.array(im)
        alpha = arr[:, :, 3]
        solid = np.where(alpha > 50)
        print(f"=== {name} ===")
        print(f"  Size: {im.size}")
        print(f"  Solid: Y=[{np.min(solid[0])}, {np.max(solid[0])}], X=[{np.min(solid[1])}, {np.max(solid[1])}]")
        # Check bottom 20 rows of solid
        max_y = np.max(solid[0])
        bottom_rows = alpha[max_y-5:max_y+1, :]
        print(f"  Bottom rows alpha at max_y ({max_y}): mean={np.mean(bottom_rows):.1f}")
    except Exception as e:
        print(f"Error {name}: {e}")

