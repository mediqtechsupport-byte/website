from pathlib import Path

p = Path("scratch/apply_wwd_light_exact.py")
s = p.read_text(encoding="utf-8")

reps = [
    # tighter outer padding + wider container
    ('px-5 sm:px-8 lg:px-14 pt-3 pb-5', 'px-4 sm:px-6 lg:px-10 pt-2.5 pb-4'),
    ('max-w-[1440px]', 'max-w-[1680px]'),
    ('<div class="flex items-center justify-between gap-3 mb-2 shrink-0">', '<div class="flex items-center justify-between gap-3 mb-1.5 shrink-0">'),
    # header: headline on one line, compact subtext
    ('<div class="shrink-0 mb-5 lg:mb-7">', '<div class="shrink-0 mb-4 lg:mb-5">'),
    ('class="text-[30px] sm:text-[40px] lg:text-[52px] font-extrabold tracking-tight leading-[1.04] text-[#0b1f3f] max-w-[1000px]"',
     'class="text-[28px] sm:text-[34px] lg:text-[38px] 2xl:text-[44px] font-extrabold tracking-tight leading-[1.08] text-[#0b1f3f]"'),
    ('<p id="wwd-subtext" class="mt-3 text-[13px] sm:text-[14px] text-[#4a5a72] leading-relaxed max-w-[500px]">',
     '<p id="wwd-subtext" class="mt-1.5 text-[13px] sm:text-[14px] text-[#4a5a72] leading-relaxed max-w-[760px]">'),
    # grid gap
    ('gap-5 lg:gap-7 flex-1 min-h-0', 'gap-4 lg:gap-6 flex-1 min-h-0'),
    # selector list fills full column height, items evenly distributed
    ('class="flex lg:flex-col gap-1.5 lg:gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 min-h-0"',
     'class="flex lg:flex-col gap-1.5 lg:gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 min-h-0 lg:h-full"'),
    ('relative shrink-0 w-[260px] lg:w-full text-left rounded-xl pl-5 pr-4 py-3 cursor-pointer',
     'relative shrink-0 w-[260px] lg:w-full lg:flex-1 lg:min-h-0 flex flex-col justify-center text-left rounded-xl pl-6 pr-4 py-3 lg:py-2 cursor-pointer'),
    ('<span class="wwd-tab-bar absolute left-0 top-3 bottom-3 w-[3px] rounded-full" aria-hidden="true"></span>',
     '<span class="wwd-tab-bar absolute left-0 top-[18%] bottom-[18%] w-[3px] rounded-full" aria-hidden="true"></span>'),
    ('<span class="block text-[12px] text-[#5a6b84] leading-tight">', '<span class="block text-[12px] xl:text-[13px] text-[#5a6b84] leading-tight">'),
    ('class="wwd-tab-title block text-[15px] sm:text-[16px] font-bold leading-snug mt-1"',
     'class="wwd-tab-title block text-[15px] sm:text-[16px] xl:text-[18px] font-bold leading-snug mt-1"'),
    # stage card
    ('min-h-[420px] lg:min-h-0 rounded-2xl p-6 sm:p-8 flex flex-col overflow-hidden',
     'min-h-[420px] lg:min-h-0 h-full rounded-2xl p-5 sm:p-7 xl:p-8 flex flex-col overflow-hidden'),
    ('class="text-[56px] sm:text-[72px] lg:text-[80px] font-extrabold',
     'class="text-[52px] sm:text-[68px] xl:text-[84px] font-extrabold'),
    ('<p id="wwd-stage-desc" class="mt-4 text-[14px] sm:text-[15px] text-[#1c2c44] leading-relaxed max-w-[440px]">',
     '<p id="wwd-stage-desc" class="mt-3 text-[14px] sm:text-[15px] xl:text-[16px] text-[#1c2c44] leading-relaxed max-w-[560px]">'),
    ('<div id="wwd-stage-visual-wrap" class="relative flex-1 min-h-[170px] my-4">',
     '<div id="wwd-stage-visual-wrap" class="relative flex-1 min-h-[180px] my-3">'),
]
for a, b in reps:
    if a not in s:
        raise SystemExit("missing: " + a[:70])
    s = s.replace(a, b)
p.write_text(s, encoding="utf-8")

# Scale canvas visuals up to fill the stage
j = Path("assets/js/main.js")
js = j.read_bytes().decode("utf-8")
jreps = [
    ("const bw = Math.min(cw * 0.86, 420);\r\n    const bh = Math.min(ch * 0.42, 80);",
     "const bw = cw * 0.94;\r\n    const bh = Math.min(ch * 0.6, 220);"),
    ("label('2–8 °C safe range', bx + 8, by - 10);", "label('2–8 °C safe range', bx + 4, by - 12);"),
    ("ctx.lineWidth = 2.5;\r\n    ctx.lineJoin = 'round';\r\n    ctx.lineCap = 'round';\r\n    ctx.stroke();\r\n    endDot(lx, ly);",
     "ctx.lineWidth = 3;\r\n    ctx.lineJoin = 'round';\r\n    ctx.lineCap = 'round';\r\n    ctx.stroke();\r\n    endDot(lx, ly);"),
    ("const gw = Math.min(cw * 0.86, 440);\r\n    const gh = Math.min(ch * 0.55, 110);",
     "const gw = cw * 0.9;\r\n    const gh = Math.min(ch * 0.68, 240);"),
    ("const mh = ch * 0.92;\r\n    const mw = mh * 0.9;", "const mh = ch * 0.96;\r\n    const mw = Math.min(cw * 0.6, mh * 0.95);"),
    ("const r = Math.min(cw, ch) * 0.32;\r\n    const e = 1 - Math.pow(1 - intro, 3);", "const r = Math.min(cw, ch) * 0.4;\r\n    const e = 1 - Math.pow(1 - intro, 3);"),
    ("const gw = Math.min(cw * 0.7, 320);\r\n    const gh = Math.min(ch * 0.5, 120);",
     "const gw = Math.min(cw * 0.86, 640);\r\n    const gh = Math.min(ch * 0.66, 240);"),
    ("ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();\r\n      }\r\n    }",
     "ctx.beginPath(); ctx.arc(x, y, Math.max(5, Math.min(9, gh / 26)), 0, Math.PI * 2); ctx.fill();\r\n      }\r\n    }"),
    ("const r = Math.min(cw, ch) * 0.34;\r\n    ctx.fillStyle = BAND;", "const r = Math.min(cw, ch) * 0.4;\r\n    ctx.fillStyle = BAND;"),
]
for a, b in jreps:
    if a not in js:
        raise SystemExit("missing js: " + a[:70])
    js = js.replace(a, b)
j.write_bytes(js.encode("utf-8"))
print("patched")

