import numpy as np
from PIL import Image

def find_perspective_coeffs(src_pts, dst_pts):
    # Maps dst_pts (x,y in output image) -> src_pts (X,Y in input image)
    matrix = []
    for (x, y), (X, Y) in zip(dst_pts, src_pts):
        matrix.append([x, y, 1, 0, 0, 0, -X*x, -X*y])
        matrix.append([0, 0, 0, x, y, 1, -Y*x, -Y*y])
    A = np.array(matrix, dtype=np.float64)
    B = np.array(src_pts, dtype=np.float64).reshape(8)
    res = np.linalg.solve(A, B)
    return res.tolist()

MODELS = [
    ("emv", "assets/img/packshots/authentic_emv.png", (8, 40), (1443, 108), (1402, 885), (72, 684)),
    ("emv_toric", "assets/img/packshots/authentic_emv_toric.png", (8, 40), (1443, 108), (1402, 885), (72, 684)),
    ("trifocal", "assets/img/packshots/authentic_trifocal.png", (8, 40), (1443, 108), (1402, 885), (72, 684)),
    ("trifocal_toric", "assets/img/packshots/authentic_trifocal_toric.png", (8, 40), (1443, 108), (1402, 885), (72, 684)),
    ("aspheric", "assets/img/packshots/authentic_aspheric.png", (8, 40), (1443, 108), (1402, 885), (72, 684)),
    ("sulcoflex", "assets/img/packshots/authentic_sulcoflex.png", (10, 42), (1443, 110), (1402, 885), (73, 684)),
]

OUT_W, OUT_H = 1200, 706
DST_FRONT = [(0, 0), (OUT_W, 0), (OUT_W, OUT_H), (0, OUT_H)]

TOP_W, TOP_H = 1200, 220
DST_TOP = [(0, 0), (TOP_W, 0), (TOP_W, TOP_H), (0, TOP_H)]

for slug, path, tl, tr, br, bl in MODELS:
    im = Image.open(path).convert("RGB")
    coeffs = find_perspective_coeffs([tl, tr, br, bl], DST_FRONT)
    front_tex = im.transform((OUT_W, OUT_H), Image.Transform.PERSPECTIVE, coeffs, Image.Resampling.BICUBIC)
    out_front_path = f"assets/img/packshots/box_front_{slug}.png"
    front_tex.save(out_front_path, optimize=True)

    # Also unwrap top flap: TTL=(182, 7), TTR=(1508, 55), TR=tr, TL=tl
    ttl = (182, 7)
    ttr = (1508, 55)
    top_coeffs = find_perspective_coeffs([ttl, ttr, tr, tl], DST_TOP)
    top_tex = im.transform((TOP_W, TOP_H), Image.Transform.PERSPECTIVE, top_coeffs, Image.Resampling.BICUBIC)
    out_top_path = f"assets/img/packshots/box_top_{slug}.png"
    top_tex.save(out_top_path, optimize=True)
    print("Saved:", out_front_path, out_top_path)

