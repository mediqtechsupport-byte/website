from pathlib import Path

j = Path("assets/js/main.js")
js = j.read_bytes().decode("utf-8")

old_dial_start = js.index("  // 6. Continuity: 24-hour dial with sweeping hand")
old_dial_end = js.index("  const DRAW = {", old_dial_start)
new_dial = """  // 6. Continuity: 24-hour dial with sweeping hand
  function drawDial(t, intro) {
    const cx = cw / 2, cy = ch / 2;
    const r = Math.min(cw, ch) * 0.44;
    for (let h = 0; h < 24; h++) {
      const a = (h / 24) * Math.PI * 2 - Math.PI / 2;
      const major = h % 6 === 0;
      const r1 = r * (major ? 0.8 : 0.88);
      ctx.strokeStyle = major ? 'rgba(196, 210, 230, 0.75)' : 'rgba(196, 210, 230, 0.55)';
      ctx.lineWidth = major ? 3.5 : 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.lineTo(cx + Math.cos(a) * r * 0.96, cy + Math.sin(a) * r * 0.96);
      ctx.stroke();
    }
    const ang = reduced() ? -Math.PI * 0.62 : -Math.PI / 2 + ((t * 0.55) % (Math.PI * 2)) * Math.min(1, intro * 2);
    const wedge = Math.PI * 0.32;
    const g = ctx.createLinearGradient(
      cx + Math.cos(ang - wedge) * r * 0.75, cy + Math.sin(ang - wedge) * r * 0.75,
      cx + Math.cos(ang) * r * 0.75, cy + Math.sin(ang) * r * 0.75);
    g.addColorStop(0, 'rgba(58, 160, 219, 0.05)');
    g.addColorStop(1, 'rgba(79, 195, 247, 0.42)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r * 0.74, ang - wedge, ang);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = BLUE;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(ang) * r * 0.76, cy + Math.sin(ang) * r * 0.76);
    ctx.stroke();
    ctx.save();
    ctx.shadowColor = 'rgba(244, 166, 75, 0.7)';
    ctx.shadowBlur = 14;
    ctx.fillStyle = DOT;
    ctx.beginPath();
    ctx.arc(cx, cy, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

"""
js = js[:old_dial_start] + new_dial.replace("\n", "\r\n") + js[old_dial_end:]

reps = [
    ("const BLUE = '#3aa0db';", "const BLUE = '#4fc3f7';"),
    ("const BAND = 'rgba(58, 160, 219, 0.12)';", "const BAND = 'rgba(79, 195, 247, 0.08)';"),
    ("const LABEL = 'rgba(246, 242, 234, 0.72)';", "const LABEL = 'rgba(184, 198, 220, 0.9)';"),
    ("const DOT = '#ffffff';", "const DOT = '#f4a64b';"),
    ("ctx.shadowColor = '#72c5f8';\r\n    ctx.shadowBlur = 12;\r\n    ctx.fillStyle = DOT;",
     "ctx.shadowColor = 'rgba(244, 166, 75, 0.7)';\r\n    ctx.shadowBlur = 12;\r\n    ctx.fillStyle = DOT;"),
    ("pauseBtn.textContent = userPause ? 'Play' : 'Pause';",
     "const pl = pauseBtn.querySelector('.wwd-pause-label');\r\n      if (pl) pl.textContent = userPause ? 'Play' : 'Pause';"),
]
for a, b in reps:
    if a not in js:
        raise SystemExit("missing: " + a[:60])
    js = js.replace(a, b)
j.write_bytes(js.encode("utf-8"))
print("main.js updated")

