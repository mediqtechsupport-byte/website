import re
from pathlib import Path

# ---------- 1. Recolor the HTML generator to the main navy / sky palette ----------
p = Path("scratch/apply_wwd_light_exact.py")
s = p.read_text(encoding="utf-8")

new_style = '''<style id="wwd-stage-scoped-styles">
            /* Transparent slide: the #about smoke canvas + silk waves show through */
            #about-slide-what-we-do {{ background: transparent; }}
            #about-slide-what-we-do .wwd-selector-tab {{
              background: transparent;
              border: 1px solid transparent;
              transition: background-color .2s ease, border-color .2s ease, box-shadow .2s ease;
            }}
            #about-slide-what-we-do .wwd-selector-tab .wwd-tab-bar {{ background: rgba(255, 255, 255, 0.14); }}
            #about-slide-what-we-do .wwd-selector-tab .wwd-tab-title {{ color: rgba(246, 242, 234, 0.68); }}
            #about-slide-what-we-do .wwd-selector-tab:hover:not(.is-active) .wwd-tab-title {{ color: #ffffff; }}
            #about-slide-what-we-do .wwd-selector-tab.is-active {{
              background: rgba(10, 29, 64, 0.62);
              backdrop-filter: blur(16px);
              -webkit-backdrop-filter: blur(16px);
              border-color: rgba(114, 197, 248, 0.32);
              box-shadow: 0 12px 30px rgba(2, 8, 24, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06);
            }}
            #about-slide-what-we-do .wwd-selector-tab.is-active .wwd-tab-bar {{ background: #3aa0db; box-shadow: 0 0 10px rgba(58, 160, 219, 0.8); }}
            #about-slide-what-we-do .wwd-selector-tab.is-active .wwd-tab-title {{ color: #ffffff; }}
            #about-slide-what-we-do .wwd-stage-card {{
              background:
                radial-gradient(circle at 92% 6%, rgba(58, 160, 219, 0.22) 0%, transparent 32%),
                rgba(10, 27, 60, 0.58);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              border: 1px solid rgba(114, 197, 248, 0.24);
              box-shadow: 0 24px 60px rgba(2, 8, 24, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.07);
            }}
            #about-slide-what-we-do .wwd-pill {{
              border: 1px solid rgba(255, 255, 255, 0.16);
              background: rgba(255, 255, 255, 0.05);
              color: rgba(246, 242, 234, 0.9);
              backdrop-filter: blur(10px);
              -webkit-backdrop-filter: blur(10px);
              transition: border-color .2s ease, color .2s ease, background-color .2s ease;
            }}
            #about-slide-what-we-do .wwd-pill:hover {{ border-color: #3aa0db; color: #ffffff; background: rgba(58, 160, 219, 0.16); }}
            @keyframes wwdSwap {{ from {{ opacity: .35; transform: translateY(3px); }} to {{ opacity: 1; transform: none; }} }}
            #about-slide-what-we-do .wwd-stage-swap {{ animation: wwdSwap 240ms cubic-bezier(.22,1,.36,1) both; }}
            @media (prefers-reduced-motion: reduce) {{
              #about-slide-what-we-do .wwd-stage-swap {{ animation: none !important; }}
            }}
          </style>'''

s = re.sub(r'<style id="wwd-stage-scoped-styles">.*?</style>', lambda m: new_style, s, count=1, flags=re.DOTALL)

reps = [
    ('bg-[#0b1f3f]/40 backdrop-blur-sm', 'bg-[#030b1c]/80 backdrop-blur-md'),
    ('border-[#d6e0ee] bg-white shadow-[0_30px_80px_rgba(11,31,63,0.25)]', 'border-sky/35 bg-[#071530] shadow-[0_30px_80px_rgba(0,0,0,0.8)]'),
    ('bg-white/90 border border-[#d6e0ee] hover:border-[#1a6fd1] text-[#0b1f3f]', 'bg-black/60 border border-white/15 hover:border-sky text-white'),
    ('text-[#1a6fd1]">core capabilities', 'text-sky">core capabilities'),
    ('text-[#0b1f3f]', 'text-white'),
    ('text-[#4a5a72]', 'text-cream/70'),
    ('text-[#5a6b84]', 'text-[#72c5f8]/85'),
    ('text-[#1a6fd1]', 'text-sky'),
    ('text-[#1c2c44]', 'text-cream/85'),
    ('text-[#34445c]', 'text-cream/80'),
    ('border-[#e3e9f2]', 'border-white/10'),
    ('focus-visible:ring-[#1a6fd1]/50', 'focus-visible:ring-[#72c5f8]/70'),
]
for a, b in reps:
    s = s.replace(a, b)
p.write_text(s, encoding="utf-8")

# ---------- 2. Recolor canvas visuals in main.js ----------
j = Path("assets/js/main.js")
js = j.read_bytes().decode("utf-8")
jreps = [
    ("const BLUE = '#1a6fd1';", "const BLUE = '#3aa0db';"),
    ("const BAND = '#edf2f9';", "const BAND = 'rgba(58, 160, 219, 0.12)';"),
    ("const LABEL = '#4a5a72';", "const LABEL = 'rgba(246, 242, 234, 0.72)';"),
    ("const DOT = '#d39a52';", "const DOT = '#ffffff';"),
    ("const TRACK = '#dbe4f0';", "const TRACK = 'rgba(255, 255, 255, 0.12)';"),
    ("ctx.strokeStyle = major ? BLUE : '#b9c8dc';", "ctx.strokeStyle = major ? BLUE : 'rgba(114, 197, 248, 0.4)';"),
    ("ctx.strokeStyle = 'rgba(26,111,209,0.35)';", "ctx.strokeStyle = 'rgba(114, 197, 248, 0.45)';"),
    ("ctx.strokeStyle = `rgba(26,111,209,${(1 - ring) * 0.35})`;", "ctx.strokeStyle = `rgba(114,197,248,${(1 - ring) * 0.45})`;"),
    ("dot.className = 'mt-1.5 size-1.5 rounded-full bg-[#1a6fd1] shrink-0';", "dot.className = 'mt-1.5 size-1.5 rounded-full bg-sky shrink-0';"),
    # soft glow on the end beacon
    ("function endDot(x, y) {\r\n    ctx.fillStyle = DOT;\r\n    ctx.beginPath();\r\n    ctx.arc(x, y, 5, 0, Math.PI * 2);\r\n    ctx.fill();\r\n  }",
     "function endDot(x, y) {\r\n    ctx.save();\r\n    ctx.shadowColor = '#72c5f8';\r\n    ctx.shadowBlur = 12;\r\n    ctx.fillStyle = DOT;\r\n    ctx.beginPath();\r\n    ctx.arc(x, y, 5, 0, Math.PI * 2);\r\n    ctx.fill();\r\n    ctx.restore();\r\n  }"),
]
for a, b in jreps:
    if a not in js:
        raise SystemExit("missing js: " + a[:60])
    js = js.replace(a, b)
j.write_bytes(js.encode("utf-8"))
print("recolored")

