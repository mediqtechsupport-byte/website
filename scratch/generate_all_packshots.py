from PIL import Image
import os

crops = [
    # 6 IOLs
    ('RayOne EMV Carton (5).png', 'iol_emv.png', 1200),
    ('RayOne EMV Toric (13).png', 'iol_emv_toric.png', 1200),
    ('RayOne Trifocal (10).png', 'iol_trifocal.png', 1200),
    ('RayOne Trifocal Toric (3).png', 'iol_trifocal_toric.png', 1200),
    ('RayOne Aspheric (8).png', 'iol_aspheric.png', 1200),
    ('Sulcoflex Aspheric (3).png', 'iol_sulcoflex.png', 1200),
    # 3 Ophteis OVDs
    ('Ophteis Adaptive Pro.png', 'ophteis_adaptive.png', 1000),
    ('Ophteis Cohesive.png', 'ophteis_cohesive.png', 1000),
    ('Ophteis Dispersive.png', 'ophteis_dispersive.png', 1000),
    # 4 AEON eye drops
    ('AEON Protect + bottle.png', 'aeon_protect.png', 800),
    ('AEON Protect plus + bottle.png', 'aeon_protect_plus.png', 800),
    ('AEON Repair + bottle.png', 'aeon_repair.png', 800),
    ('AEON NaCl + Bottle.png', 'aeon_nacl.png', 800),
]

margin = 16

for src_name, dst_name, max_dim in crops:
    src_path = os.path.join('assets/img/packshots', src_name)
    dst_path = os.path.join('assets/img/packshots', dst_name)
    
    im = Image.open(src_path)
    bbox = im.getbbox()
    if bbox:
        crop_box = (
            max(0, bbox[0] - margin),
            max(0, bbox[1] - margin),
            min(im.size[0], bbox[2] + margin),
            min(im.size[1], bbox[3] + margin)
        )
        cropped = im.crop(crop_box)
        w, h = cropped.size
        scale = min(1.0, max_dim / max(w, h))
        if scale < 1.0:
            new_size = (int(w * scale), int(h * scale))
            cropped = cropped.resize(new_size, Image.Resampling.LANCZOS)
        
        cropped.save(dst_path, 'PNG', optimize=True)
        print(f"Generated {dst_name}: {cropped.size}, file size: {os.path.getsize(dst_path) / 1024:.1f} KB")

