import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add the 3D Box & Controls CSS + updated title/accordion styling right after .sv-stage-floor in index.html
css_addition = """    /* ================= 6-FACED 3D IOL CARTON BOX & CONTROLS ================= */
    .sv-scene {
      flex-direction: column;
      justify-content: center;
      gap: 18px;
    }

    .sv-stage {
      position: relative !important;
      inset: auto !important;
      width: 100%;
      height: 360px;
      perspective: 1200px;
      perspective-origin: 50% 46%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
    }
    .sv-stage:active {
      cursor: grabbing;
    }

    .sv-box-halo {
      position: absolute;
      width: 380px;
      height: 280px;
      border-radius: 50%;
      background: radial-gradient(circle, var(--box-glow, rgba(196, 0, 107, 0.26)) 0%, rgba(56, 189, 248, 0.08) 52%, transparent 72%);
      filter: blur(28px);
      pointer-events: none;
      z-index: 1;
      transition: background 0.4s ease;
    }

    .sv-box-float {
      position: relative;
      width: 360px;
      height: 212px;
      transform-style: preserve-3d;
      animation: sv-packshot-float 6.5s ease-in-out infinite;
      z-index: 5;
    }

    .sv-box3d {
      --bw: 360px;
      --bh: 212px;
      --bd: 66px;
      position: relative;
      width: var(--bw);
      height: var(--bh);
      transform-style: preserve-3d;
      transform: rotateX(6deg) rotateY(-24deg);
      transition: transform 0.75s cubic-bezier(0.2, 0.8, 0.2, 1);
      will-change: transform;
    }

    .sv-box3d.is-interacting {
      transition: transform 0.12s ease-out;
    }

    .sv-box3d.is-spinning {
      animation: sv-box-spin360 7s linear infinite;
    }

    @keyframes sv-box-spin360 {
      0%   { transform: rotateX(5deg) rotateY(-24deg); }
      50%  { transform: rotateX(-4deg) rotateY(-204deg); }
      100% { transform: rotateX(5deg) rotateY(-384deg); }
    }

    .sv-box3d__face {
      position: absolute;
      box-sizing: border-box;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      user-select: none;
    }

    /* FRONT FACE */
    .sv-box3d__face--front {
      width: var(--bw);
      height: var(--bh);
      transform: translateZ(calc(var(--bd) / 2));
      background: linear-gradient(135deg, #ffffff 0%, #f9fafb 68%, #f1f5f9 100%);
      border: 1px solid rgba(15, 23, 42, 0.1);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 14px 16px 12px 18px;
      color: #0f172a;
      font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    }

    /* BACK FACE */
    .sv-box3d__face--back {
      width: var(--bw);
      height: var(--bh);
      transform: rotateY(180deg) translateZ(calc(var(--bd) / 2));
      background: linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%);
      border: 1px solid rgba(15, 23, 42, 0.12);
      box-shadow: inset 0 0 24px rgba(15, 23, 42, 0.05);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 16px 20px;
      color: #475569;
      font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    }

    /* RIGHT SPINE (SIDE) */
    .sv-box3d__face--right {
      width: var(--bd);
      height: var(--bh);
      left: calc((var(--bw) - var(--bd)) / 2);
      transform: rotateY(90deg) translateZ(calc(var(--bw) / 2));
      background: linear-gradient(180deg, var(--box-accent, #c4006b) 0%, var(--box-accent-dark, #990052) 100%);
      border: 1px solid rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .sv-box3d__spine-code {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: 0.04em;
      color: rgba(255, 255, 255, 0.95);
      line-height: 1;
      white-space: nowrap;
    }

    /* LEFT SPINE */
    .sv-box3d__face--left {
      width: var(--bd);
      height: var(--bh);
      left: calc((var(--bw) - var(--bd)) / 2);
      transform: rotateY(-90deg) translateZ(calc(var(--bw) / 2));
      background: linear-gradient(180deg, var(--box-accent, #c4006b) 0%, var(--box-accent-dark, #990052) 100%);
      border: 1px solid rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .sv-box3d__spine-name {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: rgba(255, 255, 255, 0.94);
      line-height: 1;
      white-space: nowrap;
    }

    /* TOP & BOTTOM FACES */
    .sv-box3d__face--top {
      width: var(--bw);
      height: var(--bd);
      top: calc((var(--bh) - var(--bd)) / 2);
      transform: rotateX(90deg) translateZ(calc(var(--bh) / 2));
      background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
      border: 1px solid rgba(15, 23, 42, 0.08);
    }

    .sv-box3d__face--bottom {
      width: var(--bw);
      height: var(--bd);
      top: calc((var(--bh) - var(--bd)) / 2);
      transform: rotateX(-90deg) translateZ(calc(var(--bh) / 2));
      background: linear-gradient(180deg, #cbd5e1 0%, #94a3b8 100%);
      border: 1px solid rgba(15, 23, 42, 0.12);
    }

    /* Front Artwork Details */
    .sv-box-header {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      width: 100%;
      padding-right: 12px;
    }

    .sv-box-logo-col {
      display: flex;
      flex-direction: column;
      gap: 3px;
      flex-shrink: 0;
    }

    .sv-box-rayone {
      display: flex;
      align-items: stretch;
      height: 30px;
    }

    .sv-box-ray {
      font-size: 23px;
      font-weight: 300;
      color: var(--box-accent, #c4006b);
      letter-spacing: -0.02em;
      line-height: 30px;
      padding-right: 3px;
    }

    .sv-box-one {
      background: var(--box-accent, #c4006b);
      color: #ffffff;
      font-size: 21px;
      font-weight: 700;
      padding: 0 6px;
      line-height: 30px;
      letter-spacing: -0.01em;
    }

    .sv-box-subbar {
      background: var(--box-accent, #c4006b);
      color: #ffffff;
      font-size: 8.5px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      text-align: right;
      padding: 1.5px 5px;
      line-height: 1.1;
    }

    .sv-box-banner {
      flex: 1;
      height: 44px;
      background: var(--box-accent, #c4006b);
      color: #ffffff;
      display: flex;
      align-items: center;
      padding: 0 12px;
      font-size: 22px;
      font-weight: 300;
      letter-spacing: -0.01em;
      white-space: nowrap;
    }

    .sv-box-body {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 14px;
    }

    .sv-box-injector {
      width: 155px;
      height: 58px;
      flex-shrink: 0;
      margin-left: -2px;
    }

    .sv-box-cloop-wrap {
      position: relative;
      width: 112px;
      height: 112px;
      margin-right: 10px;
      flex-shrink: 0;
    }

    .sv-box-footer {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding-right: 14px;
      position: relative;
    }

    .sv-box-rayner-mark {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .sv-box-rayner-brand {
      font-size: 13px;
      font-weight: 800;
      color: #1e293b;
      letter-spacing: -0.02em;
      display: flex;
      align-items: center;
      gap: 3px;
    }

    .sv-box-rayner-sub {
      font-size: 6.5px;
      line-height: 1.25;
      color: #64748b;
      font-weight: 600;
    }

    .sv-box-notch {
      position: absolute;
      bottom: -12px;
      left: 50%;
      transform: translateX(-50%);
      width: 28px;
      height: 14px;
      border-radius: 14px 14px 0 0;
      background: var(--box-accent, #c4006b);
    }

    .sv-box-raypro-strip {
      position: absolute;
      right: 4px;
      top: 14px;
      bottom: 10px;
      width: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      gap: 4px;
    }

    .sv-box-raypro-text {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      font-size: 5.2px;
      font-weight: 800;
      letter-spacing: 0.05em;
      line-height: 1.15;
      color: #16a34a;
      text-transform: uppercase;
      white-space: nowrap;
    }

    /* Elliptical Ground Shadow */
    .sv-box-shadow {
      position: absolute;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      width: 280px;
      height: 34px;
      border-radius: 50%;
      background: radial-gradient(ellipse at center, rgba(15, 23, 42, 0.42) 0%, rgba(15, 23, 42, 0.16) 48%, transparent 74%);
      filter: blur(8px);
      pointer-events: none;
      z-index: 2;
    }

    /* 4 View Pill Buttons (Front | Side | Back | Spin) */
    .sv-box-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      z-index: 25;
      margin-top: -6px;
    }

    .sv-box-btn {
      appearance: none;
      -webkit-appearance: none;
      border: 1px solid rgba(148, 163, 184, 0.35);
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(10px);
      color: rgba(255, 255, 255, 0.88);
      font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 700;
      padding: 7px 18px;
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
      line-height: 1.2;
    }

    .sv-box-btn:hover {
      border-color: rgba(255, 255, 255, 0.6);
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-1px);
    }

    .sv-box-btn[aria-pressed="true"] {
      background: var(--box-accent, #c4006b);
      border-color: var(--box-accent, #c4006b);
      color: #ffffff;
      box-shadow: 0 0 0 2px rgba(10, 25, 47, 0.85), 0 0 0 4px rgba(56, 189, 248, 0.75), 0 8px 20px -4px var(--box-glow, rgba(196, 0, 107, 0.5));
    }

    .sv-title-reg {
      font-size: 0.42em;
      vertical-align: super;
      font-weight: 700;
      margin-left: 1px;
      color: inherit;
    }

    .sv-title-accent {
      color: var(--iol-accent, #e11d74);
    }
"""

target_floor = """    .sv-stage-floor {
      position: absolute;
      bottom: 2%;
      width: 85%;
      height: 25%;
      border-radius: 50%;
      background: radial-gradient(ellipse at 50% 50%, rgba(58, 160, 219, 0.22) 0%, rgba(8, 20, 48, 0.35) 55%, transparent 75%);
      filter: blur(14px);
      pointer-events: none;
    }"""

assert target_floor in html, "Could not find .sv-stage-floor in index.html"
html = html.replace(target_floor, target_floor + "\n\n" + css_addition, 1)

# 2. Update .sv-row CSS so both closed & open rows match the crisp rounded card + divider design from user screenshot
old_sv_row_css = """    .sv-row {
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }

    .sv-row:hover {
      border-color: rgba(255, 255, 255, 0.25);
      background: rgba(255, 255, 255, 0.06);
    }

    .sv-row[data-open="true"] {
      border-radius: 20px;
      border-color: rgba(58, 160, 219, 0.65);
      background: linear-gradient(180deg, rgba(58, 160, 219, 0.12), rgba(10, 29, 64, 0.85));
      box-shadow: 0 10px 30px -10px rgba(58, 160, 219, 0.35);
    }"""

new_sv_row_css = """    .sv-row {
      border: 1.5px solid rgba(255, 255, 255, 0.14);
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.04);
      backdrop-filter: blur(12px);
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }

    .sv-row:hover {
      border-color: rgba(255, 255, 255, 0.28);
      background: rgba(255, 255, 255, 0.07);
    }

    .sv-row[data-open="true"] {
      border-radius: 14px;
      border-color: #38bdf8;
      background: linear-gradient(180deg, rgba(56, 189, 248, 0.12), rgba(10, 29, 64, 0.82));
      box-shadow: 0 10px 30px -10px rgba(56, 189, 248, 0.32);
    }

    .sv-row[data-open="true"] .sv-row__btn {
      border-bottom: 1.5px solid rgba(56, 189, 248, 0.55);
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }"""

assert old_sv_row_css in html, "Could not find old_sv_row_css"
html = html.replace(old_sv_row_css, new_sv_row_css, 1)

old_led_css = """    .sv-row[data-open="true"] .sv-row__led {
      border-color: #3aa0db;
      background: #3aa0db;
      box-shadow: 0 0 12px #3aa0db;
    }"""

new_led_css = """    .sv-row[data-open="true"] .sv-row__led {
      border-color: #38bdf8;
      background: #38bdf8;
      box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.24), 0 0 10px rgba(56, 189, 248, 0.6);
    }"""

assert old_led_css in html, "Could not find old_led_css"
html = html.replace(old_led_css, new_led_css, 1)

old_desc_css = """    .sv-row__desc {
      margin: 0;
      padding: 0 24px 20px 47px;
      font-size: 14px;
      line-height: 1.6;
      color: rgba(246, 242, 234, 0.85);
    }"""

new_desc_css = """    .sv-row__desc {
      margin: 0;
      padding: 14px 24px 18px 47px;
      font-size: 14px;
      line-height: 1.6;
      color: rgba(246, 242, 234, 0.88);
    }"""

assert old_desc_css in html, "Could not find old_desc_css"
html = html.replace(old_desc_css, new_desc_css, 1)

# 3. Helper function to generate the 3D Box Scene HTML for each of the 6 IOL stages
BOX_SPECS = [
    {
        "idx": 0,
        "prefix": "Ray",
        "boxWord": "One",
        "subbar": "EMV",
        "banner": "Preloaded IOL",
        "code": "RAO200E",
        "spineName": "RayOne EMV",
        "accent": "#c4006b",
        "accentDark": "#960051",
        "glow": "rgba(196, 0, 107, 0.30)",
        "titleHtml": 'RayOne<sup class="sv-title-reg">&reg;</sup> <span class="sv-title-accent" style="--iol-accent:#e11d74;">EMV</span>',
        "oldTitle": '<h2 class="sv-title">RayOne&reg; EMV</h2>'
    },
    {
        "idx": 1,
        "prefix": "Ray",
        "boxWord": "One",
        "subbar": "EMV TORIC",
        "banner": "Preloaded IOL",
        "code": "RAO210T",
        "spineName": "RayOne EMV Toric",
        "accent": "#b00062",
        "accentDark": "#830048",
        "glow": "rgba(176, 0, 98, 0.30)",
        "titleHtml": 'RayOne<sup class="sv-title-reg">&reg;</sup> <span class="sv-title-accent" style="--iol-accent:#e11d74;">EMV Toric</span>',
        "oldTitle": '<h2 class="sv-title">RayOne&reg; EMV Toric</h2>'
    },
    {
        "idx": 2,
        "prefix": "Ray",
        "boxWord": "One",
        "subbar": "TRIFOCAL",
        "banner": "Preloaded IOL",
        "code": "RAO603T",
        "spineName": "RayOne Trifocal",
        "accent": "#00965e",
        "accentDark": "#007046",
        "glow": "rgba(0, 150, 94, 0.30)",
        "titleHtml": 'RayOne<sup class="sv-title-reg">&reg;</sup> <span class="sv-title-accent" style="--iol-accent:#10b981;">Trifocal</span>',
        "oldTitle": '<h2 class="sv-title">RayOne&reg; Trifocal</h2>'
    },
    {
        "idx": 3,
        "prefix": "Ray",
        "boxWord": "One",
        "subbar": "TRIFOCAL TORIC",
        "banner": "Preloaded IOL",
        "code": "RAO613Z",
        "spineName": "RayOne Trifocal Toric",
        "accent": "#008c95",
        "accentDark": "#00666d",
        "glow": "rgba(0, 140, 149, 0.30)",
        "titleHtml": 'RayOne<sup class="sv-title-reg">&reg;</sup> <span class="sv-title-accent" style="--iol-accent:#14b8a6;">Trifocal Toric</span>',
        "oldTitle": '<h2 class="sv-title">RayOne&reg; Trifocal Toric</h2>'
    },
    {
        "idx": 4,
        "prefix": "Ray",
        "boxWord": "One",
        "subbar": "ASPHERIC",
        "banner": "Preloaded IOL",
        "code": "RAO600C",
        "spineName": "RayOne Aspheric",
        "accent": "#0077c8",
        "accentDark": "#005896",
        "glow": "rgba(0, 119, 200, 0.30)",
        "titleHtml": 'RayOne<sup class="sv-title-reg">&reg;</sup> <span class="sv-title-accent" style="--iol-accent:#38bdf8;">Aspheric</span>',
        "oldTitle": '<h2 class="sv-title">RayOne&reg; Aspheric</h2>'
    },
    {
        "idx": 5,
        "prefix": "Sulco",
        "boxWord": "flex",
        "subbar": "ASPHERIC",
        "banner": "Supplementary IOL",
        "code": "653L",
        "spineName": "Sulcoflex Aspheric",
        "accent": "#6b3fa0",
        "accentDark": "#4f2d78",
        "glow": "rgba(107, 63, 160, 0.30)",
        "titleHtml": 'Sulcoflex<sup class="sv-title-reg">&reg;</sup> <span class="sv-title-accent" style="--iol-accent:#a855f7;">Aspheric</span>',
        "oldTitle": '<h2 class="sv-title">Sulcoflex&reg; Aspheric</h2>'
    }
]

def build_scene_inner(spec):
    accent = spec["accent"]
    accent_dark = spec["accentDark"]
    glow = spec["glow"]
    prefix = spec["prefix"]
    box_word = spec["boxWord"]
    subbar = spec["subbar"]
    banner = spec["banner"]
    code = spec["code"]
    spine_name = spec["spineName"]
    banner_fs = "19px" if len(banner) > 14 else "22px"

    return f"""                  <div class="sv-scene" data-view="front" style="--box-accent: {accent}; --box-accent-dark: {accent_dark}; --box-glow: {glow};" onpointermove="handleIolTilt(event, this)" onpointerleave="resetIolTilt(this)">
                    <div class="sv-stage" onpointerdown="startIolBoxDrag(event, this)">
                      <div class="sv-box-halo"></div>
                      <div class="sv-box-float">
                        <div class="sv-box3d">
                          <!-- FRONT FACE -->
                          <div class="sv-box3d__face sv-box3d__face--front">
                            <div class="sv-box-header">
                              <div class="sv-box-logo-col">
                                <div class="sv-box-rayone">
                                  <span class="sv-box-ray">{prefix}</span>
                                  <span class="sv-box-one">{box_word}</span>
                                </div>
                                <div class="sv-box-subbar">{subbar}</div>
                              </div>
                              <div class="sv-box-banner" style="font-size: {banner_fs};">{banner}</div>
                            </div>

                            <div class="sv-box-body">
                              <!-- Technical Injector Drawing -->
                              <svg class="sv-box-injector" viewBox="0 0 180 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="29" width="38" height="10" rx="1.5" stroke="#94a3b8" stroke-width="1.2"/>
                                <line x1="2" y1="24" x2="2" y2="44" stroke="#94a3b8" stroke-width="1.4"/>
                                <rect x="40" y="25" width="66" height="18" rx="2" stroke="#94a3b8" stroke-width="1.3"/>
                                <line x1="48" y1="25" x2="48" y2="43" stroke="#cbd5e1" stroke-width="1"/>
                                <line x1="15" y1="34" x2="98" y2="34" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3 2"/>
                                <!-- Lock & Roll Cartridge Bay -->
                                <path d="M106 27 H138 L156 31.5 V36.5 L138 41 H106 Z" stroke="#94a3b8" stroke-width="1.3"/>
                                <rect x="114" y="12" width="22" height="15" rx="2" stroke="#94a3b8" stroke-width="1.2"/>
                                <path d="M119 18 H131 M125 14 V23" stroke="#cbd5e1" stroke-width="1"/>
                                <line x1="156" y1="34" x2="174" y2="34" stroke="#94a3b8" stroke-width="1.2"/>
                              </svg>

                              <!-- Right Brand C-Loop & IOL Optic -->
                              <div class="sv-box-cloop-wrap">
                                <svg viewBox="0 0 120 120" class="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <!-- Outer Brand C-Ring -->
                                  <path d="M98 34 A 46 46 0 1 0 102 80" stroke="{accent}" stroke-width="13" stroke-linecap="butt"/>
                                  <!-- Inner Technical IOL Haptics & Optic -->
                                  <circle cx="60" cy="60" r="19" stroke="#cbd5e1" stroke-width="1.2"/>
                                  <circle cx="60" cy="60" r="14" stroke="#e2e8f0" stroke-width="0.9" stroke-dasharray="2 2"/>
                                  <path d="M48 45 C 42 26, 68 20, 73 34 C 76 41, 68 43, 66 42" stroke="#cbd5e1" stroke-width="1.2" fill="none"/>
                                  <path d="M72 75 C 78 94, 52 100, 47 86 C 44 79, 52 77, 54 78" stroke="#cbd5e1" stroke-width="1.2" fill="none"/>
                                </svg>
                              </div>
                            </div>

                            <div class="sv-box-footer">
                              <div class="sv-box-rayner-mark">
                                <div class="sv-box-rayner-brand">
                                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 13H2L8 2Z" stroke="#0284c7" stroke-width="2"/></svg>
                                  <span>Rayner</span>
                                </div>
                                <div class="sv-box-rayner-sub">
                                  Preloaded Hydrophilic Acrylic<br>IOL Injection System
                                </div>
                              </div>
                              <div class="sv-box-notch"></div>
                            </div>

                            <!-- Right Vertical RayPRO Strip -->
                            <div class="sv-box-raypro-strip">
                              <div class="sv-box-raypro-text">5 YEARS FREE PATIENT OUTCOMES DATA<br>LEARN MORE AT RAYNER.COM/RAYPRO</div>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="#15803d" stroke-width="2.2"/>
                                <circle cx="12" cy="12" r="4" fill="#0f172a"/>
                              </svg>
                            </div>
                          </div>

                          <!-- BACK FACE -->
                          <div class="sv-box3d__face sv-box3d__face--back">
                            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid rgba(15,23,42,0.08); padding-bottom: 8px;">
                              <span style="font-size:11px; font-weight:800; color:#334155; letter-spacing:0.04em;">RAYNER INTRAOCULAR LENSES LTD</span>
                              <span style="font-size:11px; font-weight:800; color:{accent};">{code}</span>
                            </div>
                            <div style="display:flex; gap:14px; align-items:center; margin:auto 0;">
                              <div style="flex:1; font-size:8px; line-height:1.5; color:#64748b;">
                                10 Dominion Way, Worthing, West Sussex, BN14 8AQ, United Kingdom<br>
                                Sterile EO &bull; Single Use Only &bull; Store between 2&deg;C and 35&deg;C<br>
                                Distributed in the Philippines by <strong>MediQ Pharma &amp; Medical Supplies</strong>
                              </div>
                              <div style="width:68px; height:32px; background:repeating-linear-gradient(90deg, #334155 0 2px, transparent 2px 4px, #334155 4px 5px, transparent 5px 8px); opacity:0.65; border-radius:2px;"></div>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center; font-size:8px; font-weight:700; color:#94a3b8;">
                              <span>CE 2797 &bull; MD</span>
                              <span>{spine_name.upper()}</span>
                            </div>
                          </div>

                          <!-- RIGHT SPINE (SIDE) -->
                          <div class="sv-box3d__face sv-box3d__face--right">
                            <span class="sv-box3d__spine-code">{code}</span>
                          </div>

                          <!-- LEFT SPINE -->
                          <div class="sv-box3d__face sv-box3d__face--left">
                            <span class="sv-box3d__spine-name">{spine_name}</span>
                          </div>

                          <!-- TOP & BOTTOM FACES -->
                          <div class="sv-box3d__face sv-box3d__face--top"></div>
                          <div class="sv-box3d__face sv-box3d__face--bottom"></div>
                        </div>
                      </div>
                      <div class="sv-box-shadow"></div>
                    </div>

                    <!-- 4 Interactive View Pill Buttons -->
                    <div class="sv-box-controls" role="group" aria-label="{spine_name} 3D Box View Controls">
                      <button type="button" class="sv-box-btn" data-view="front" aria-pressed="true" onclick="setIolBoxView(this, 'front')">Front</button>
                      <button type="button" class="sv-box-btn" data-view="side" aria-pressed="false" onclick="setIolBoxView(this, 'side')">Side</button>
                      <button type="button" class="sv-box-btn" data-view="back" aria-pressed="false" onclick="setIolBoxView(this, 'back')">Back</button>
                      <button type="button" class="sv-box-btn" data-view="spin" aria-pressed="false" onclick="setIolBoxView(this, 'spin')">Spin</button>
                    </div>
                  </div>"""

for spec in BOX_SPECS:
    idx = spec["idx"]
    pattern = re.compile(
        rf'(<div id="iol-scene-{idx}"[^>]*>\s*)<div class="sv-scene"[^>]*>\s*<div class="sv-halo"></div>\s*<div class="sv-stage">\s*<div class="sv-tilt">\s*<div class="sv-rig">\s*<div class="sv-stage-floor"></div>\s*<img[^>]*>\s*</div>\s*</div>\s*</div>\s*</div>(\s*</div>)',
        re.MULTILINE
    )
    match = pattern.search(html)
    assert match, f"Could not find #iol-scene-{idx} block in index.html"
    replacement = match.group(1) + build_scene_inner(spec) + match.group(2)
    html = html[:match.start()] + replacement + html[match.end():]

    # Also update the stage title to have the brand-colored suffix
    assert spec["oldTitle"] in html, f"Could not find {spec['oldTitle']}"
    html = html.replace(spec["oldTitle"], f'<h2 class="sv-title">{spec["titleHtml"]}</h2>', 1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Successfully updated all 6 IOL scenes and titles in index.html!")
