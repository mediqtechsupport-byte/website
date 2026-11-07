import re
import json

with open("assets/js/about-route-globe.js", "r", encoding="utf-8") as f:
    text = f.read()

m = re.search(r"var PH_ISLANDS = (\[.*?\]);", text)
if not m:
    raise RuntimeError("PH_ISLANDS not found")

islands = json.loads(m.group(1))
print("Loaded", len(islands), "island polygons")

def point_in_poly(x, y, poly):
    inside = False
    n = len(poly)
    j = n - 1
    for i in range(n):
        xi, yi = poly[i][0], poly[i][1]
        xj, yj = poly[j][0], poly[j][1]
        if ((yi > y) != (yj > y)) and (x < (xj - xi) * (y - yi) / (yj - yi + 1e-12) + xi):
            inside = not inside
        j = i
    return inside

# Sample a clean regular grid across lon 117.0..126.6, lat 5.1..18.65
# Using step = 0.16 deg in lon and lat so islands like Cebu, Bohol, Masbate, Leyte, Samar, Mindoro, Palawan, Panay, Negros, Luzon, Mindanao are all crisp
LON_MIN, LON_MAX = 116.9, 126.65
LAT_MIN, LAT_MAX = 5.1, 18.65
STEP = 0.165

dots = []
lat = LAT_MAX
row = 0
while lat >= LAT_MIN:
    lon = LON_MIN
    while lon <= LON_MAX:
        for poly in islands:
            if point_in_poly(lon, lat, poly):
                # Normalize to [0..1, 0..1] where x=0..1 (west to east) and y=0..1 (north to south)
                nx = round((lon - LON_MIN) / (LON_MAX - LON_MIN), 4)
                ny = round((LAT_MAX - lat) / (LAT_MAX - LAT_MIN), 4)
                dots.append([nx, ny])
                break
        lon += STEP
    lat -= STEP
    row += 1

print("Generated", len(dots), "grid dots")

# Print ASCII preview to verify all islands (Luzon, Mindoro, Palawan, Masbate, Panay, Negros, Cebu, Bohol, Samar, Leyte, Mindanao)
W, H = 58, 48
grid = [[" " for _ in range(W)] for _ in range(H)]
for nx, ny in dots:
    gx = min(W - 1, max(0, int(nx * (W - 1))))
    gy = min(H - 1, max(0, int(ny * (H - 1))))
    grid[gy][gx] = "·"

for r in grid:
    print("".join(r))

