import re
import json

with open("assets/js/about-route-globe.js", "r", encoding="utf-8") as f:
    globe_text = f.read()

m = re.search(r"var PH_ISLANDS = (\[.*?\]);", globe_text)
islands = json.loads(m.group(1))

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

LON_MIN, LON_MAX = 116.9, 126.65
LAT_MIN, LAT_MAX = 5.1, 18.65
STEP = 0.18

dots = []
lat = LAT_MAX
while lat >= LAT_MIN:
    lon = LON_MIN
    while lon <= LON_MAX:
        for poly in islands:
            if point_in_poly(lon, lat, poly):
                nx = round((lon - LON_MIN) / (LON_MAX - LON_MIN), 3)
                ny = round((LAT_MAX - lat) / (LAT_MAX - LAT_MIN), 3)
                dots.append([nx, ny])
                break
        lon += STEP
    lat -= STEP

print("Sampled", len(dots), "Philippine archipelago dots")

# 17 Regions from NCR in the north to BARMM in the south
raw_regions = [
    ("NCR",   "National Capital Region",          120.98, 14.60),
    ("CAR",   "Cordillera Administrative Region", 120.95, 17.15),
    ("I",     "Ilocos Region",                    120.48, 16.62),
    ("II",    "Cagayan Valley",                   121.75, 17.15),
    ("III",   "Central Luzon",                    120.82, 15.42),
    ("IV-A",  "CALABARZON",                       121.35, 14.12),
    ("IV-B",  "MIMAROPA",                         121.18, 13.05),
    ("V",     "Bicol Region",                     123.52, 13.45),
    ("VI",    "Western Visayas",                  122.52, 11.12),
    ("VII",   "Central Visayas",                  123.88, 10.28),
    ("VIII",  "Eastern Visayas",                  124.95, 11.35),
    ("IX",    "Zamboanga Peninsula",              122.95,  7.82),
    ("X",     "Northern Mindanao",                124.65,  8.32),
    ("XI",    "Davao Region",                     125.65,  7.35),
    ("XII",   "SOCCSKSARGEN",                     124.85,  6.45),
    ("XIII",  "Caraga",                           125.72,  8.85),
    ("BARMM", "Bangsamoro Autonomous Region",     124.25,  7.18),
]

regions_js = []
for code, name, lon, lat in raw_regions:
    nx = round((lon - LON_MIN) / (LON_MAX - LON_MIN), 4)
    ny = round((LAT_MAX - lat) / (LAT_MAX - LAT_MIN), 4)
    regions_js.append([code, name, nx, ny])

dots_json = json.dumps(dots, separators=(",", ":"))
regions_json = json.dumps(regions_js, separators=(",", ":"))

new_archipelago_block = f"""  // 3. Field network: Dotted Philippine archipelago + 17 regions step-by-step (every 1.8s)
  const PH_DOTS = {dots_json};
  const PH_REGIONS = {regions_json};
  const REGION_STEP_SEC = 1.8;

  function drawArchipelago(t, intro) {{
    const elapsedSec = Math.max(0, (performance.now() - switchT) / 1000);
    const regIdx = reduced() ? 0 : Math.floor(elapsedSec / REGION_STEP_SEC) % PH_REGIONS.length;
    const stepP = reduced() ? 1 : (elapsedSec % REGION_STEP_SEC) / REGION_STEP_SEC;
    const activeReg = PH_REGIONS[regIdx];

    // ── Left-side Region Readout & 17-Segment Progress Bar ──────────────────
    const leftX = 4;
    const baseCy = Math.max(92, Math.min(ch * 0.54, ch - 78));

    ctx.save();
    ctx.textAlign = 'left';
    ctx.font = '500 13px Manrope, ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(184, 198, 220, 0.82)';
    ctx.fillText('Region ' + (regIdx + 1) + ' of ' + PH_REGIONS.length, leftX, baseCy - 48);

    const codeFontPx = Math.round(Math.max(40, Math.min(60, cw * 0.072)));
    ctx.font = '800 ' + codeFontPx + 'px Manrope, ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = DOT;
    ctx.fillText(activeReg[0], leftX, baseCy + 10);

    const nameFontPx = Math.round(Math.max(15, Math.min(20, cw * 0.024)));
    ctx.font = '700 ' + nameFontPx + 'px Manrope, ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(activeReg[1], leftX, baseCy + 40);

    // 17-segment horizontal bar
    const barTotalW = Math.min(cw * 0.44, 336);
    const segGap = 5;
    const segW = Math.max(6, (barTotalW - segGap * (PH_REGIONS.length - 1)) / PH_REGIONS.length);
    const barY = baseCy + 60;
    for (let i = 0; i < PH_REGIONS.length; i++) {{
      const sx = leftX + i * (segW + segGap);
      ctx.fillStyle = i <= regIdx ? BLUE : 'rgba(79, 195, 247, 0.22)';
      roundRect(sx, barY, segW, 3.5, 1.75);
      ctx.fill();
    }}
    ctx.restore();

    // ── Right-side Dotted Philippine Archipelago Map ────────────────────────
    const mapPadTop = 6;
    const mapPadBot = 8;
    const mapH = Math.max(180, ch - mapPadTop - mapPadBot);
    const mapW = mapH * 0.72;
    const mapX = Math.max(cw * 0.50, cw * 0.74 - mapW * 0.5);
    const mapY = mapPadTop;

    const manilaNx = PH_REGIONS[0][2];
    const manilaNy = PH_REGIONS[0][3];
    const manilaX = mapX + manilaNx * mapW;
    const manilaY = mapY + manilaNy * mapH;

    // 1) Draw archipelago dot grid fading outward from Manila, then shimmering
    for (let i = 0; i < PH_DOTS.length; i++) {{
      const d = PH_DOTS[i];
      const dx = d[0] - manilaNx;
      const dy = d[1] - manilaNy;
      const dist = Math.hypot(dx, dy);
      const wave = reduced() ? 1 : Math.max(0, Math.min(1, (intro * 1.45 - dist * 0.75) * 2.4));
      if (wave <= 0.01) continue;
      const shimmer = reduced() ? 0.42 : 0.30 + 0.16 * Math.sin(t * 2.1 - dist * 6.5 + (i % 19) * 0.35);
      ctx.fillStyle = 'rgba(79, 195, 247, ' + (wave * shimmer).toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(mapX + d[0] * mapW, mapY + d[1] * mapH, 1.35, 0, Math.PI * 2);
      ctx.fill();
    }}

    // 2) Curved line from Manila (NCR) to active region marker
    if (regIdx > 0 && intro > 0.25) {{
      const tx = mapX + activeReg[2] * mapW;
      const ty = mapY + activeReg[3] * mapH;
      const mx = (manilaX + tx) * 0.5;
      const my = (manilaY + ty) * 0.5;
      const vx = tx - manilaX;
      const vy = ty - manilaY;
      const len = Math.hypot(vx, vy) || 1;
      const bend = Math.min(48, len * 0.26);
      const cpx = mx - (vy / len) * bend;
      const cpy = my + (vx / len) * bend * 0.45;

      const drawP = reduced() ? 1 : Math.min(1, stepP / 0.38);
      const easeP = 1 - Math.pow(1 - drawP, 3);
      const steps = 28;
      const maxStep = Math.max(1, Math.round(steps * easeP));

      const grad = ctx.createLinearGradient(manilaX, manilaY, tx, ty);
      grad.addColorStop(0, 'rgba(79, 195, 247, 0.55)');
      grad.addColorStop(1, 'rgba(244, 166, 75, 0.95)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let s = 0; s <= maxStep; s++) {{
        const u = (s / steps) * easeP;
        const inv = 1 - u;
        const px = inv * inv * manilaX + 2 * inv * u * cpx + u * u * tx;
        const py = inv * inv * manilaY + 2 * inv * u * cpy + u * u * ty;
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }}
      ctx.stroke();
    }}

    // 3) 17 Region Markers with ripples + active amber highlight & code label
    for (let i = 0; i < PH_REGIONS.length; i++) {{
      const r = PH_REGIONS[i];
      const rx = mapX + r[2] * mapW;
      const ry = mapY + r[3] * mapH;
      const dist = Math.hypot(r[2] - manilaNx, r[3] - manilaNy);
      const appear = reduced() ? 1 : Math.max(0, Math.min(1, (intro * 1.4 - dist * 0.7) * 2.5));
      if (appear <= 0.01) continue;

      const isCurrent = i === regIdx;
      if (isCurrent) {{
        const growP = reduced() ? 1 : Math.min(1, stepP / 0.28);
        const growEase = 1 - Math.pow(1 - growP, 3);
        const rippleR = 8 + ((t * 14) % 10);
        const rippleA = Math.max(0, (1 - (rippleR - 8) / 10) * 0.45);

        ctx.strokeStyle = 'rgba(244, 166, 75, ' + rippleA.toFixed(3) + ')';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(rx, ry, rippleR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.save();
        ctx.shadowColor = 'rgba(244, 166, 75, 0.85)';
        ctx.shadowBlur = 14;
        ctx.fillStyle = DOT;
        ctx.beginPath();
        ctx.arc(rx, ry, 4.2 + 2.6 * growEase, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Region code beside active marker
        ctx.save();
        ctx.font = '700 12px Manrope, ui-sans-serif, system-ui, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.shadowColor = 'rgba(4, 13, 30, 0.9)';
        ctx.shadowBlur = 6;
        ctx.fillText(r[0], rx + 10, ry + 4);
        ctx.restore();
      }} else {{
        const pulse = (t * 0.9 + i * 0.37) % 1;
        ctx.strokeStyle = 'rgba(79, 195, 247, ' + ((1 - pulse) * 0.28 * appear).toFixed(3) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(rx, ry, 3.5 + pulse * 5.5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.save();
        ctx.shadowColor = 'rgba(79, 195, 247, 0.65)';
        ctx.shadowBlur = 6;
        ctx.fillStyle = 'rgba(79, 195, 247, ' + (0.85 * appear).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(rx, ry, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }}
    }}
  }}"""

with open("assets/js/main.js", "r", encoding="utf-8") as f:
    main_js = f.read()

pattern = re.compile(
    r"  // 3\. Field network: simplified archipelago with 17 nodes[\s\S]*?  // 4\. Governance: ring to 100% \+ check",
    re.MULTILINE
)
if not pattern.search(main_js):
    raise RuntimeError("Could not find old drawArchipelago block in assets/js/main.js")

main_js = pattern.sub(new_archipelago_block + "\n\n  // 4. Governance: ring to 100% + check", main_js, count=1)

# Also make sure when archipelago-routes is active, AUTO_ADVANCE_MS allows all 17 regions (17 * 1.8s = 30.6s) before auto-advancing to the next pillar
old_tick = "if (elapsed >= AUTO_ADVANCE_MS) { select(active + 1, false); return; }"
new_tick = "const pillarDuration = (tabs[active] && tabs[active].dataset.visual === 'archipelago-routes') ? (PH_REGIONS.length * REGION_STEP_SEC * 1000) : AUTO_ADVANCE_MS;\n      if (elapsed >= pillarDuration) { select(active + 1, false); return; }"

if old_tick in main_js:
    main_js = main_js.replace(old_tick, new_tick, 1)

with open("assets/js/main.js", "w", encoding="utf-8", newline="\n") as f:
    f.write(main_js)

print("Successfully updated drawArchipelago in assets/js/main.js")
