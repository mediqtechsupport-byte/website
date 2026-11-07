from PIL import Image
import numpy as np

for name in ['Ophteis Adaptive Pro.png', 'ophteis_adaptive.png']:
    im = Image.open(f'assets/img/packshots/{name}').convert('RGBA')
    arr = np.array(im)
    alpha = arr[:, :, 3]
    # find where there is non-transparent pixel
    solid = np.where(alpha > 30)
    print(name)
    print("  Size:", im.size)
    print(f"  bbox (alpha>30): x=[{np.min(solid[1])}, {np.max(solid[1])}], y=[{np.min(solid[0])}, {np.max(solid[0])}]")

