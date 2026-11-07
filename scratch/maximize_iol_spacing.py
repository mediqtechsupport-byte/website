import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update .sv-scene, .sv-stage, .sv-box-float, .sv-box3d, .sv-content, .sv-title, .sv-subtitle, .sv-pitch, .sv-list, .sv-row CSS
old_sv_scene = """    .sv-scene {
      position: relative;
      width: min(580px, 45vw);
      height: min(540px, 66vh);
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: pan-y;
      user-select: none;
    }"""

new_sv_scene = """    .sv-scene {
      --bw: clamp(410px, 30vw, 500px);
      --bh: clamp(241px, 17.65vw, 294px);
      --bd: clamp(76px, 5.3vw, 88px);
      position: relative;
      width: min(640px, 46vw);
      height: min(600px, 74vh);
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: pan-y;
      user-select: none;
    }"""

assert old_sv_scene in html, "Could not find old_sv_scene"
html = html.replace(old_sv_scene, new_sv_scene, 1)

old_3d_css = """    .sv-stage {
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
    }"""

new_3d_css = """    .sv-stage {
      position: relative !important;
      inset: auto !important;
      width: 100%;
      height: clamp(360px, 45vh, 440px);
      perspective: 1350px;
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
      width: clamp(420px, 32vw, 520px);
      height: clamp(300px, 24vw, 380px);
      border-radius: 50%;
      background: radial-gradient(circle, var(--box-glow, rgba(196, 0, 107, 0.30)) 0%, rgba(56, 189, 248, 0.09) 54%, transparent 74%);
      filter: blur(32px);
      pointer-events: none;
      z-index: 1;
      transition: background 0.4s ease;
    }

    .sv-box-float {
      position: relative;
      width: var(--bw);
      height: var(--bh);
      transform-style: preserve-3d;
      animation: sv-packshot-float 6.5s ease-in-out infinite;
      z-index: 5;
    }

    .sv-box3d {
      position: relative;
      width: var(--bw);
      height: var(--bh);
      transform-style: preserve-3d;
      transform: rotateX(6deg) rotateY(-24deg);
      transition: transform 0.75s cubic-bezier(0.2, 0.8, 0.2, 1);
      will-change: transform;
    }"""

assert old_3d_css in html, "Could not find old_3d_css"
html = html.replace(old_3d_css, new_3d_css, 1)

# Scale spine codes, shadow, and buttons
html = html.replace(
    "font-size: 32px;\n      font-weight: 800;",
    "font-size: clamp(36px, 2.6vw, 44px);\n      font-weight: 800;",
    1
)
html = html.replace(
    "font-size: 20px;\n      font-weight: 700;",
    "font-size: clamp(22px, 1.6vw, 26px);\n      font-weight: 700;",
    1
)

old_shadow_controls = """    /* Elliptical Ground Shadow */
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
      border: 1px solid rgba(148, 163, 184, 0.42);
      background: rgba(255, 255, 255, 0.10);
      backdrop-filter: blur(12px);
      color: #ffffff;
      font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 600;
      padding: 7px 20px;
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
      line-height: 1.2;
    }"""

new_shadow_controls = """    /* Elliptical Ground Shadow */
    .sv-box-shadow {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      width: clamp(320px, 24vw, 400px);
      height: 40px;
      border-radius: 50%;
      background: radial-gradient(ellipse at center, rgba(5, 12, 28, 0.55) 0%, rgba(5, 12, 28, 0.22) 48%, transparent 74%);
      filter: blur(9px);
      pointer-events: none;
      z-index: 2;
    }

    /* 4 View Pill Buttons (Front | Side | Back | Spin) */
    .sv-box-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      z-index: 25;
      margin-top: 2px;
    }

    .sv-box-btn {
      appearance: none;
      -webkit-appearance: none;
      border: 1px solid rgba(148, 163, 184, 0.42);
      background: rgba(255, 255, 255, 0.10);
      backdrop-filter: blur(12px);
      color: #ffffff;
      font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
      font-size: 14.5px;
      font-weight: 600;
      padding: 9px 24px;
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
      line-height: 1.2;
    }"""

assert old_shadow_controls in html, "Could not find old_shadow_controls"
html = html.replace(old_shadow_controls, new_shadow_controls, 1)

# 2. Scale up .sv-content, .sv-title, .sv-subtitle, .sv-pitch, .sv-list, .sv-row to maximize space
old_content_css = """    /* ================= CONTENT SIDE (Matches Reference Typography Exactly) ================= */
    .sv-content {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 600px;
      padding: 0 24px;
      box-sizing: border-box;
      z-index: 20;
    }

    .sv-title {
      margin: 0;
      font-size: clamp(38px, 4.4vw, 54px);
      line-height: 1.08;
      letter-spacing: -0.03em;
      font-weight: 800;
      color: #ffffff;
      text-wrap: balance;
    }

    .sv-subtitle {
      margin: 14px 0 0;
      font-size: clamp(16px, 1.4vw, 18px);
      line-height: 1.4;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: rgba(255, 255, 255, 0.85);
    }

    .sv-pitch {
      margin: 16px 0 0;
      max-width: 54ch;
      font-size: clamp(14px, 1.1vw, 15.5px);
      line-height: 1.65;
      color: #94a3b8;
    }

    /* Accordion List (Matching Reference Pill Buttons with Hollow Circle) */
    .sv-list {
      list-style: none;
      margin: 32px 0 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }

    .sv-row {
      border: 1.5px solid rgba(255, 255, 255, 0.15);
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.045);
      backdrop-filter: blur(12px);
      transition: all 0.32s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }

    .sv-row:hover {
      border-color: var(--iol-accent-border, rgba(255, 255, 255, 0.32));
      background: rgba(255, 255, 255, 0.075);
    }

    .sv-row[data-open="true"] {
      border-radius: 14px;
      border: 1.5px solid var(--iol-accent, #e11d74);
      background: linear-gradient(180deg, var(--iol-accent-bg, rgba(225, 29, 116, 0.14)), rgba(10, 29, 64, 0.84));
      box-shadow: 0 12px 32px -10px var(--iol-accent-ring, rgba(225, 29, 116, 0.32));
    }

    .sv-row[data-open="true"] .sv-row__btn {
      border-bottom: 1.5px solid var(--iol-accent, #e11d74);
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      background: rgba(255, 255, 255, 0.03);
    }

    .sv-row__btn {
      all: unset;
      box-sizing: border-box;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      cursor: pointer;
      padding: 15px 22px;
      border-radius: inherit;
    }

    .sv-row__left {
      display: flex;
      align-items: center;
      gap: 14px;
      flex: 1;
    }

    .sv-row__led {
      flex: none;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 1.5px solid rgba(255, 255, 255, 0.5);
      background: transparent;
      transition: all 0.3s ease;
    }

    .sv-row[data-open="true"] .sv-row__led {
      border-color: var(--iol-accent, #e11d74);
      background: var(--iol-accent, #e11d74);
      box-shadow: 0 0 0 5px var(--iol-accent-ring, rgba(225, 29, 116, 0.25)), 0 0 10px var(--iol-accent, #e11d74);
    }

    .sv-row__title {
      font-size: 15.5px;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: #ffffff;
    }"""

new_content_css = """    /* ================= CONTENT SIDE (Maximized Space & Reference Typography) ================= */
    .sv-content {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 680px;
      padding: 0 16px;
      box-sizing: border-box;
      z-index: 20;
    }

    .sv-title {
      margin: 0;
      font-size: clamp(48px, 4.8vw, 72px);
      line-height: 1.04;
      letter-spacing: -0.03em;
      font-weight: 800;
      color: #ffffff;
      text-wrap: balance;
    }

    .sv-subtitle {
      margin: 16px 0 0;
      font-size: clamp(17.5px, 1.5vw, 22px);
      line-height: 1.38;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: rgba(255, 255, 255, 0.94);
    }

    .sv-pitch {
      margin: 16px 0 0;
      max-width: 60ch;
      font-size: clamp(15px, 1.2vw, 17.5px);
      line-height: 1.68;
      color: #b0c0d8;
    }

    /* Accordion List (Maximized Rounded Cards) */
    .sv-list {
      list-style: none;
      margin: 28px 0 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 14px;
      width: 100%;
    }

    .sv-row {
      border: 1.5px solid rgba(255, 255, 255, 0.16);
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      transition: all 0.32s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }

    .sv-row:hover {
      border-color: var(--iol-accent-border, rgba(255, 255, 255, 0.34));
      background: rgba(255, 255, 255, 0.08);
    }

    .sv-row[data-open="true"] {
      border-radius: 16px;
      border: 1.5px solid var(--iol-accent, #e11d74);
      background: linear-gradient(180deg, var(--iol-accent-bg, rgba(225, 29, 116, 0.14)), rgba(10, 29, 64, 0.86));
      box-shadow: 0 14px 34px -10px var(--iol-accent-ring, rgba(225, 29, 116, 0.34));
    }

    .sv-row__btn {
      all: unset;
      box-sizing: border-box;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      cursor: pointer;
      padding: 18px 24px;
      border-radius: inherit;
    }

    .sv-row__left {
      display: flex;
      align-items: center;
      gap: 15px;
      flex: 1;
    }

    .sv-row__led {
      flex: none;
      width: 11px;
      height: 11px;
      border-radius: 50%;
      border: 1.5px solid rgba(255, 255, 255, 0.55);
      background: transparent;
      transition: all 0.3s ease;
    }

    .sv-row[data-open="true"] .sv-row__led {
      border-color: var(--iol-accent, #e11d74);
      background: var(--iol-accent, #e11d74);
      box-shadow: 0 0 0 5px var(--iol-accent-ring, rgba(225, 29, 116, 0.28)), 0 0 10px var(--iol-accent, #e11d74);
    }

    .sv-row__title {
      font-size: clamp(16px, 1.22vw, 18.5px);
      font-weight: 700;
      letter-spacing: -0.01em;
      color: #ffffff;
    }"""

assert old_content_css in html, "Could not find old_content_css"
html = html.replace(old_content_css, new_content_css, 1)

old_desc_css2 = """    .sv-row__desc {
      margin: 0;
      padding: 14px 24px 18px 47px;
      font-size: 14px;
      line-height: 1.6;
      color: rgba(246, 242, 234, 0.88);
    }"""

new_desc_css2 = """    .sv-row__desc {
      margin: 0;
      padding: 0 24px 22px 50px;
      font-size: clamp(14.5px, 1.1vw, 16.5px);
      line-height: 1.65;
      color: rgba(246, 242, 234, 0.90);
    }"""

assert old_desc_css2 in html, "Could not find old_desc_css2"
html = html.replace(old_desc_css2, new_desc_css2, 1)

# 3. Pull the left and right columns inward toward the center so there is no huge gap between the 3D box and the text!
for idx in range(6):
    for prefix in ("iol-scene", "iol-content"):
        tag_start = html.find(f'<div id="{prefix}-{idx}"')
        assert tag_start != -1
        tag_end = html.find('>', tag_start)
        tag = html[tag_start:tag_end+1]
        if "left-0" in tag:
            new_tag = tag.replace("items-center justify-center", "items-center justify-end lg:pr-6 xl:pr-10")
        else:
            new_tag = tag.replace("items-center justify-center", "items-center justify-start lg:pl-6 xl:pl-10")
        html = html[:tag_start] + new_tag + html[tag_end+1:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Successfully maximized 3D box size, text scale, and column spacing across all 6 IOL stages!")

