import re

# 1. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace packshot image paths in Slide 1 to front_*.png
html = html.replace('assets/img/packshots/iol_emv.png', 'assets/img/packshots/front_emv.png')
html = html.replace('assets/img/packshots/iol_emv_toric.png', 'assets/img/packshots/front_emv_toric.png')
html = html.replace('assets/img/packshots/iol_trifocal.png', 'assets/img/packshots/front_trifocal.png')
html = html.replace('assets/img/packshots/iol_trifocal_toric.png', 'assets/img/packshots/front_trifocal_toric.png')
html = html.replace('assets/img/packshots/iol_aspheric.png', 'assets/img/packshots/front_aspheric.png')
html = html.replace('assets/img/packshots/iol_sulcoflex.png', 'assets/img/packshots/front_sulcoflex.png')

# Update plinth inside sv-rig to clean studio floor
old_plinth = """<div class="sv-plinth">
                            <i class="sv-disc sv-disc--top"></i>
                            <i class="sv-disc sv-disc--ring1"></i>
                            <i class="sv-disc sv-disc--ring2"></i>
                          </div>"""

new_floor = """<div class="sv-stage-floor"></div>"""

html = html.replace(old_plinth, new_floor)

# Update sv-packshot-float animation and sv-scene styling in <style>
old_keyframes = """@keyframes sv-packshot-float {
      0%, 100% {
        transform: translateY(0px) rotateY(-8deg) rotateX(3deg);
      }
      50% {
        transform: translateY(-20px) rotateY(9deg) rotateX(-2deg);
      }
    }"""

new_keyframes = """@keyframes sv-packshot-float {
      0%, 100% {
        transform: translateY(0px) rotateX(0deg) rotateY(-1.2deg);
      }
      50% {
        transform: translateY(-12px) rotateX(0.8deg) rotateY(1.2deg);
      }
    }

    .sv-stage-floor {
      position: absolute;
      bottom: 2%;
      width: 85%;
      height: 25%;
      border-radius: 50%;
      background: radial-gradient(ellipse at 50% 50%, rgba(58, 160, 219, 0.22) 0%, rgba(8, 20, 48, 0.35) 55%, transparent 75%);
      filter: blur(14px);
      pointer-events: none;
    }"""

if old_keyframes in html:
    html = html.replace(old_keyframes, new_keyframes)

# Bump version to v=355.00
html = re.sub(r'src="assets/js/main\.js\?v=[\d\.]+"', 'src="assets/js/main.js?v=355.00"', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated index.html with front-facing packshots and clean studio floor!")

# 2. Update assets/js/main.js
with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

js = js.replace('assets/img/packshots/iol_emv.png', 'assets/img/packshots/front_emv.png')
js = js.replace('assets/img/packshots/iol_emv_toric.png', 'assets/img/packshots/front_emv_toric.png')
js = js.replace('assets/img/packshots/iol_trifocal.png', 'assets/img/packshots/front_trifocal.png')
js = js.replace('assets/img/packshots/iol_trifocal_toric.png', 'assets/img/packshots/front_trifocal_toric.png')
js = js.replace('assets/img/packshots/iol_aspheric.png', 'assets/img/packshots/front_aspheric.png')
js = js.replace('assets/img/packshots/iol_sulcoflex.png', 'assets/img/packshots/front_sulcoflex.png')

# Update tilt restraint
js = js.replace("rotateX(' + (-y * 18).toFixed(1) + 'deg) rotateY(' + (x * 24).toFixed(1) + 'deg)",
                "rotateX(' + (-y * 9).toFixed(1) + 'deg) rotateY(' + (x * 12).toFixed(1) + 'deg)")

with open('assets/js/main.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Updated assets/js/main.js with front-facing images and restrained tilt!")

