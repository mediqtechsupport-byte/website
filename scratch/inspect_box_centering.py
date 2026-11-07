from PIL import Image
import numpy as np

for name in ['Ophteis Adaptive Pro.png', 'Ophteis Cohesive.png', 'Ophteis Dispersive.png']:
    im = Image.open(f'assets/img/packshots/{name}').convert('RGBA')
    arr = np.array(im)
    alpha = arr[:, :, 3]
    
    # Let's find where the solid box is (alpha > 150)
    solid = np.where(alpha > 150)
    min_y, max_y = np.min(solid[0]), np.max(solid[0])
    min_x, max_x = np.min(solid[1]), np.max(solid[1])
    
    # And where any reflection is (alpha > 15)
    any_px = np.where(alpha > 15)
    all_min_y, all_max_y = np.min(any_px[0]), np.max(any_px[0])
    all_min_x, all_max_x = np.min(any_px[1]), np.max(any_px[1])
    
    print(f"=== {name} ===")
    print(f"  Image size: {im.size}")
    print(f"  Solid box (alpha>150): X=[{min_x}, {max_x}], Y=[{min_y}, {max_y}], Width={max_x-min_x}, Height={max_y-min_y}")
    print(f"  Full with reflection (alpha>15): X=[{all_min_x}, {all_max_x}], Y=[{all_min_y}, {all_max_y}]")
    
    # What is the center of the solid box?
    center_x = (min_x + max_x) / 2.0
    print(f"  Solid Box center X: {center_x:.1f} (Image center is {im.width / 2.0})")

