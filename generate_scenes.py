from PIL import Image, ImageDraw, ImageFont
import math

# Create Night Driving scene
w, h = 1280, 720
img = Image.new('RGB', (w, h), color='#070f1e')
draw = ImageDraw.Draw(img)

# Sky gradient & distant horizon
for y in range(int(h * 0.55)):
    t = y / (h * 0.55)
    r = int(7 * (1 - t) + 12 * t)
    g = int(15 * (1 - t) + 26 * t)
    b = int(30 * (1 - t) + 52 * t)
    draw.line([(0, y), (w, y)], fill=(r, g, b))

# Distant skyline silhouette
horizon_y = int(h * 0.55)
# Road
draw.polygon([(0, h), (int(w*0.38), horizon_y), (int(w*0.62), horizon_y), (w, h)], fill='#101622')
# Road markings (center dashed lines)
for i in range(8):
    y1 = int(horizon_y + (h - horizon_y) * (i / 8.0)**1.8)
    y2 = int(horizon_y + (h - horizon_y) * ((i + 0.5) / 8.0)**1.8)
    width = 2 + int(i * 1.5)
    draw.line([(w // 2, y1), (w // 2, y2)], fill='#f5f0e1', width=width)

# Overhead highway sign
sign_x1, sign_y1, sign_x2, sign_y2 = int(w * 0.58), int(h * 0.18), int(w * 0.88), int(h * 0.40)
draw.rectangle([sign_x1, sign_y1, sign_x2, sign_y2], fill='#0d4734', outline='#ffffff', width=2)
draw.text((sign_x1 + 25, sign_y1 + 18), "EXIT 21 · WORTHING UK", fill='#ffffff')
draw.text((sign_x1 + 25, sign_y1 + 55), "RayOne® Optical Science Lab", fill='#6ee7b7')
draw.text((sign_x1 + 25, sign_y1 + 90), "Sub-2.2 mm Micro-Incision  1000m", fill='#ffffff')

# Oncoming car headlights
car_y = int(horizon_y + (h - horizon_y) * 0.45)
car_x = int(w * 0.44)
# Left and right headlights
draw.ellipse([car_x - 30, car_y - 8, car_x - 14, car_y + 8], fill='#ffffff')
draw.ellipse([car_x + 14, car_y - 8, car_x + 30, car_y + 8], fill='#ffffff')

img.save('assets/img/scene_night_driving.jpg', quality=92)
print("Saved scene_night_driving.jpg")

