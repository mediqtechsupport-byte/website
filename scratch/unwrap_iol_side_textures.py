import numpy as np
from PIL import Image

def find_perspective_coeffs(src_pts, dst_pts):
    matrix = []
    for (x, y), (X, Y) in zip(dst_pts, src_pts):
        matrix.append([x, y, 1, 0, 0, 0, -X*x, -X*y])
        matrix.append([0, 0, 0, x, y, 1, -Y*x, -Y*y])
    A = np.array(matrix, dtype=np.float64)
    B = np.array(src_pts, dtype=np.float64).reshape(8)
    res = np.linalg.solve(A, B)
    return res.tolist()

MODELS = [
    ("emv", "assets/img/packshots/authentic_emv.png"),
    ("emv_toric", "assets/img/packshots/authentic_emv_toric.png"),
    ("trifocal", "assets/img/packshots/authentic_trifocal.png"),
    ("trifocal_toric", "assets/img/packshots/authentic_trifocal_toric.png"),
    ("aspheric", "assets/img/packshots/authentic_aspheric.png"),
    ("sulcoflex", "assets/img/packshots/authentic_sulcoflex.png"),
]

SIDE_W, SIDE_H = 220, 706
DST_SIDE = [(0, 0), (SIDE_W, 0), (SIDE_W, SIDE_H), (0, SIDE_H)]
SRC_SIDE = [(1444, 109), (1505, 57), (1461, 792), (1403, 884)]

for slug, path in MODELS:
    im = Image.open(path).convert("RGB")
    coeffs = find_perspective_coeffs(SRC_SIDE, DST_SIDE)
    side_tex = im.transform((SIDE_W, SIDE_H), Image.Transform.PERSPECTIVE, coeffs, Image.Resampling.BICUBIC)
    out_side_path = f"assets/img/packshots/box_side_{slug}.png"
    side_tex.save(out_side_path, optimize=True)
    print("Saved:", out_side_path)

