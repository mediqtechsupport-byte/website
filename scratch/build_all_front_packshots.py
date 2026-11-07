import cv2
import os
import numpy as np

def build_front_packshots():
    packshots = [
        ('front_emv.png', 'RayOne EMV Carton (5).png', 'rayone'),
        ('front_emv_toric.png', 'RayOne EMV Toric (13).png', 'rayone'),
        ('front_trifocal.png', 'RayOne Trifocal (10).png', 'rayone'),
        ('front_trifocal_toric.png', 'RayOne Trifocal Toric (3).png', 'rayone'),
        ('front_aspheric.png', 'RayOne Aspheric (8).png', 'rayone'),
        ('front_sulcoflex.png', 'Sulcoflex Aspheric (3).png', 'sulcoflex')
    ]

    # Source quads for precision orthogonal unwarping:
    # RayOne shared front face quad in original 4394x3059 images
    rayone_src = np.float32([
        [632, 432],   # TL (clean white top edge)
        [3405, 464],  # TR (clean white right edge)
        [3325, 1815], # BR (clean bottom-right)
        [700, 1715]   # BL (clean bottom-left)
    ])

    # Sulcoflex front face quad in original 2953x2088 image
    sulcoflex_src = np.float32([
        [485, 520],   # TL
        [2170, 582],  # TR
        [2180, 1420], # BR
        [545, 1385]   # BL
    ])

    canvas_w = 1000
    canvas_h = 620

    for out_name, in_name, ptype in packshots:
        in_path = os.path.join('assets/img/packshots', in_name)
        img = cv2.imread(in_path, cv2.IMREAD_UNCHANGED)
        if img is None:
            print(f"ERROR: Cannot load {in_path}")
            continue

        if ptype == 'rayone':
            src_pts = rayone_src
            box_w = 880
            box_h = 390
            by = 65
        else:
            src_pts = sulcoflex_src
            box_w = 880
            box_h = 420
            by = 50

        bx = (canvas_w - box_w) // 2

        dst_pts = np.float32([
            [0, 0],
            [box_w, 0],
            [box_w, box_h],
            [0, box_h]
        ])

        M = cv2.getPerspectiveTransform(src_pts, dst_pts)
        front_face = cv2.warpPerspective(img, M, (box_w, box_h), flags=cv2.INTER_LANCZOS4)

        # Build transparent RGBA canvas
        canvas = np.zeros((canvas_h, canvas_w, 4), dtype=np.uint8)

        # 1. Subtle realistic top cardboard bevel (6px)
        top_h = 6
        top_sliver = np.zeros((top_h, box_w, 4), dtype=np.uint8)
        for ty in range(top_h):
            val = int(230 + (top_h - ty) * 3)
            top_sliver[ty, :, :3] = val
            top_sliver[ty, :, 3] = 255
        canvas[by - top_h:by, bx:bx + box_w] = top_sliver

        # 2. Place rectified front face
        canvas[by:by + box_h, bx:bx + box_w] = front_face

        # 3. High-gloss mirror floor reflection
        refl_h = 135
        flipped = cv2.flip(front_face, 0)[:refl_h, :]
        refl_blurred = cv2.GaussianBlur(flipped, (5, 5), 1.2)

        # Smooth quadratic alpha decay
        t = np.linspace(0.0, 1.0, refl_h)[:, None]
        alpha_curve = 0.38 * ((1.0 - t) ** 1.3)
        refl_alpha = (refl_blurred[:, :, 3].astype(float) * alpha_curve).astype(np.uint8)

        refl_rgba = np.zeros((refl_h, box_w, 4), dtype=np.uint8)
        refl_rgba[:, :, :3] = refl_blurred[:, :, :3]
        refl_rgba[:, :, 3] = refl_alpha

        canvas[by + box_h:by + box_h + refl_h, bx:bx + box_w] = refl_rgba

        # 4. Soft ground contact shadow seam
        shadow_h = 6
        for sy in range(shadow_h):
            alpha_s = int(90 * (1.0 - sy / shadow_h))
            cv2.line(canvas, (bx, by + box_h + sy), (bx + box_w, by + box_h + sy), (0, 0, 0, alpha_s), 1)

        out_path = os.path.join('assets/img/packshots', out_name)
        cv2.imwrite(out_path, canvas)
        print(f"Generated {out_name}: {canvas_w}x{canvas_h}, size={os.path.getsize(out_path)/1024:.1f} KB")

if __name__ == '__main__':
    build_front_packshots()

