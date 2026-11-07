with open('assets/js/main.js', 'rb') as f:
    b = f.read()

target = b"// 14 drifting organic smoke puffs in #0a1d40 MedTech Blue palette"
end_marker = b"ctx.arc(cx, cy, rad, 0, Math.PI * 2);\r\n        ctx.fill();\r\n      }"

idx1 = b.find(target)
idx2 = b.find(end_marker, idx1)

if idx1 == -1 or idx2 == -1:
    print(f"Error finding markers: {idx1}, {idx2}")
    exit(1)

replacement = """// 22 drifting organic fluid smoke puffs across about background (matching Hero Page fluid smoke)
    const puffs = Array.from({ length: 22 }, (_, i) => ({
      baseX: (i / 22) * 1.3 - 0.15,
      baseY: 0.12 + (i % 5) * 0.20,
      r: 220 + (i % 6) * 65,
      speed: 0.12 + (i % 5) * 0.05,
      phase: i * 1.42,
      alpha: 0.38 + (i % 4) * 0.14,
      hueShift: (i % 3)
    }));

    function renderSmoke() {
      t += 0.008; // Calm, serene organic fluid smoke drift
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < puffs.length; i++) {
        const p = puffs[i];
        // Harmonic motion generating curling, organic smoke drift in exact MedTech Blue
        const cx = (p.baseX + Math.sin(t * p.speed + p.phase) * 0.15 + Math.sin(t * 0.3 + p.phase * 0.7) * 0.04) * w;
        const cy = (p.baseY + Math.cos(t * p.speed * 0.85 + p.phase) * 0.10 + Math.cos(t * 0.25 + p.phase) * 0.03) * h;
        const rad = p.r * (1 + Math.sin(t * 0.55 + p.phase) * 0.18);

        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        // Rich MedTech Blue Harmonic Spectrum with luminous sky accents
        if (p.hueShift === 0) {
          g.addColorStop(0, `rgba(58, 160, 219, ${(p.alpha * 0.36).toFixed(3)})`);
          g.addColorStop(0.38, `rgba(29, 77, 140, ${(p.alpha * 0.26).toFixed(3)})`);
          g.addColorStop(0.72, `rgba(16, 43, 92, ${(p.alpha * 0.12).toFixed(3)})`);
          g.addColorStop(1, 'transparent');
        } else if (p.hueShift === 1) {
          g.addColorStop(0, `rgba(32, 92, 170, ${(p.alpha * 0.42).toFixed(3)})`);
          g.addColorStop(0.40, `rgba(20, 53, 112, ${(p.alpha * 0.30).toFixed(3)})`);
          g.addColorStop(0.75, `rgba(10, 29, 64, ${(p.alpha * 0.15).toFixed(3)})`);
          g.addColorStop(1, 'transparent');
        } else {
          g.addColorStop(0, `rgba(114, 197, 248, ${(p.alpha * 0.28).toFixed(3)})`);
          g.addColorStop(0.35, `rgba(30, 80, 150, ${(p.alpha * 0.20).toFixed(3)})`);
          g.addColorStop(0.70, `rgba(16, 43, 92, ${(p.alpha * 0.10).toFixed(3)})`);
          g.addColorStop(1, 'transparent');
        }

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fill();
      }""".replace('\n', '\r\n').encode('utf-8')

new_b = b[:idx1] + replacement + b[idx2 + len(end_marker):]

with open('assets/js/main.js', 'wb') as f:
    f.write(new_b)

print("SUCCESS: Patched about smoke in assets/js/main.js")
