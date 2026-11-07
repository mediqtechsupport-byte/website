import os

assets = os.listdir('assets/img')
print("Total images in assets/img:", len(assets))
prod_imgs = [f for f in assets if any(k in f.lower() for k in ['prod', 'lens', 'ray', 'iol', 'device', 'equip', 'med', 'suppl', 'cat', 'oph', 'hero'])]
print("Product related images:")
for f in prod_imgs:
    print(" -", f)

