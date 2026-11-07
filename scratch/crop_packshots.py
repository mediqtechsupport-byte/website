from PIL import Image

margin = 16

for name in ['emv_stage.png', 'trifocal_stage.png', 'aspheric_stage.png']:
    path = 'assets/img/packshots/' + name
    im = Image.open(path)
    bbox = im.getbbox()
    if bbox:
        crop_box = (
            max(0, bbox[0] - margin),
            max(0, bbox[1] - margin),
            min(im.size[0], bbox[2] + margin),
            min(im.size[1], bbox[3] + margin)
        )
        cropped = im.crop(crop_box)
        cropped.save(path, 'PNG', optimize=True)
        print(f"Cropped {name}: new size {cropped.size}")

