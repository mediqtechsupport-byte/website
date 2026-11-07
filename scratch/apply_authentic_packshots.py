import re

# 1. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

replacements = [
    ('alt="RayOne EMV Packshot Box" class="sv-packshot-img"', 'authentic_emv.png?v=366.00'),
    ('alt="RayOne EMV Toric Packshot Box" class="sv-packshot-img"', 'authentic_emv_toric.png?v=366.00'),
    ('alt="RayOne Trifocal Packshot Box" class="sv-packshot-img"', 'authentic_trifocal.png?v=366.00'),
    ('alt="RayOne Trifocal Toric Packshot Box" class="sv-packshot-img"', 'authentic_trifocal_toric.png?v=366.00'),
    ('alt="RayOne Aspheric Packshot Box" class="sv-packshot-img"', 'authentic_aspheric.png?v=366.00'),
    ('alt="Sulcoflex Aspheric Packshot Box" class="sv-packshot-img"', 'authentic_sulcoflex.png?v=366.00')
]

for alt_tag, img_file in replacements:
    pattern = re.compile(r'<img src="assets/img/packshots/[^"]*" ' + re.escape(alt_tag))
    new_tag = f'<img src="assets/img/packshots/{img_file}" {alt_tag}'
    html, count = pattern.subn(new_tag, html)
    print(f"Replaced {img_file}: count={count}")

html = re.sub(
    r'<img id="iol-mobile-packshot" src="assets/img/packshots/[^"]*"',
    '<img id="iol-mobile-packshot" src="assets/img/packshots/authentic_emv.png?v=366.00"',
    html
)

html = re.sub(r'src="assets/js/main\.js\?v=[\d\.]+"', 'src="assets/js/main.js?v=366.00"', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated index.html successfully!")

# 2. Update assets/js/main.js
with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

js_clean = js.replace('\r\n', '\n')

old_mobile_data = """  const MOBILE_DATA = [
    {
      img: 'assets/img/packshots/front_emv.png?v=365.00',
      title: 'RayOne® EMV',
      sub: 'Co-developed with Prof. Graham Barrett',
      desc: 'Non-diffractive extended depth of field IOL providing seamless intermediate and functional near vision without dysphotopsia.'
    },
    {
      img: 'assets/img/packshots/front_emv_toric.png?v=365.00',
      title: 'RayOne® EMV Toric',
      sub: 'Extended Depth of Focus • Precision Astigmatism Correction',
      desc: 'Combines patented positive spherical aberration EDOF optics with rotatably stable closed-loop toric haptics.'
    },
    {
      img: 'assets/img/packshots/front_trifocal.png?v=365.00',
      title: 'RayOne® Trifocal',
      sub: 'Halved diffractive rings for maximum light transmission',
      desc: 'Patented 16-ring design delivers crystal clarity at distance, intermediate, and near with 89% light transmitted to retina.'
    },
    {
      img: 'assets/img/packshots/front_trifocal_toric.png?v=365.00',
      title: 'RayOne® Trifocal Toric',
      sub: 'True spectacle independence across all distances with astigmatism correction',
      desc: 'Seamless trifocal diffractive optics engineered directly onto Rayner rotatably stable anti-vaulting closed-loop toric haptics.'
    },
    {
      img: 'assets/img/packshots/front_aspheric.png?v=365.00',
      title: 'RayOne® Aspheric',
      sub: 'Aberration-neutral monofocal precision',
      desc: 'Zero spherical aberration design provides pristine contrast sensitivity regardless of corneal shape or previous refractive surgery.'
    },
    {
      img: 'assets/img/packshots/front_sulcoflex.png?v=365.00',
      title: 'Sulcoflex® Aspheric',
      sub: 'Pseudophakic supplementary sulcus platform',
      desc: 'Reversible optical refinement for residual refractive errors with undulating rounded haptics protecting delicate sulcus tissues.'
    }
  ];"""

new_mobile_data = """  const MOBILE_DATA = [
    {
      img: 'assets/img/packshots/authentic_emv.png?v=366.00',
      title: 'RayOne® EMV',
      sub: 'Co-developed with Prof. Graham Barrett',
      desc: 'Non-diffractive extended depth of field IOL providing seamless intermediate and functional near vision without dysphotopsia.'
    },
    {
      img: 'assets/img/packshots/authentic_emv_toric.png?v=366.00',
      title: 'RayOne® EMV Toric',
      sub: 'Extended Depth of Focus • Precision Astigmatism Correction',
      desc: 'Combines patented positive spherical aberration EDOF optics with rotatably stable closed-loop toric haptics.'
    },
    {
      img: 'assets/img/packshots/authentic_trifocal.png?v=366.00',
      title: 'RayOne® Trifocal',
      sub: 'Halved diffractive rings for maximum light transmission',
      desc: 'Patented 16-ring design delivers crystal clarity at distance, intermediate, and near with 89% light transmitted to retina.'
    },
    {
      img: 'assets/img/packshots/authentic_trifocal_toric.png?v=366.00',
      title: 'RayOne® Trifocal Toric',
      sub: 'True spectacle independence across all distances with astigmatism correction',
      desc: 'Seamless trifocal diffractive optics engineered directly onto Rayner rotatably stable anti-vaulting closed-loop toric haptics.'
    },
    {
      img: 'assets/img/packshots/authentic_aspheric.png?v=366.00',
      title: 'RayOne® Aspheric',
      sub: 'Aberration-neutral monofocal precision',
      desc: 'Zero spherical aberration design provides pristine contrast sensitivity regardless of corneal shape or previous refractive surgery.'
    },
    {
      img: 'assets/img/packshots/authentic_sulcoflex.png?v=366.00',
      title: 'Sulcoflex® Aspheric',
      sub: 'Pseudophakic supplementary sulcus platform',
      desc: 'Reversible optical refinement for residual refractive errors with undulating rounded haptics protecting delicate sulcus tissues.'
    }
  ];"""

if old_mobile_data in js_clean:
    js_clean = js_clean.replace(old_mobile_data, new_mobile_data)
    print("Replaced MOBILE_DATA in main.js directly!")
else:
    # Regex fallback
    js_clean = re.sub(
        r"img:\s*'assets/img/packshots/front_emv\.png\?v=365\.00'",
        "img: 'assets/img/packshots/authentic_emv.png?v=366.00'",
        js_clean
    )
    js_clean = re.sub(
        r"img:\s*'assets/img/packshots/front_emv_toric\.png\?v=365\.00'",
        "img: 'assets/img/packshots/authentic_emv_toric.png?v=366.00'",
        js_clean
    )
    js_clean = re.sub(
        r"img:\s*'assets/img/packshots/front_trifocal\.png\?v=365\.00'",
        "img: 'assets/img/packshots/authentic_trifocal.png?v=366.00'",
        js_clean
    )
    js_clean = re.sub(
        r"img:\s*'assets/img/packshots/front_trifocal_toric\.png\?v=365\.00'",
        "img: 'assets/img/packshots/authentic_trifocal_toric.png?v=366.00'",
        js_clean
    )
    js_clean = re.sub(
        r"img:\s*'assets/img/packshots/front_aspheric\.png\?v=365\.00'",
        "img: 'assets/img/packshots/authentic_aspheric.png?v=366.00'",
        js_clean
    )
    js_clean = re.sub(
        r"img:\s*'assets/img/packshots/front_sulcoflex\.png\?v=365\.00'",
        "img: 'assets/img/packshots/authentic_sulcoflex.png?v=366.00'",
        js_clean
    )
    print("Replaced MOBILE_DATA via regex!")

with open('assets/js/main.js', 'w', encoding='utf-8') as f:
    f.write(js_clean)
print("Updated assets/js/main.js successfully!")

