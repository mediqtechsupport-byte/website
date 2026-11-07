import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Make the 3D box & buttons a little bigger, and scale up the back-face content
old_scene_vars = """    .sv-scene {
      --bw: clamp(410px, 30vw, 500px);
      --bh: clamp(241px, 17.65vw, 294px);
      --bd: clamp(76px, 5.3vw, 88px);
      position: relative;
      width: min(640px, 46vw);
      height: min(600px, 74vh);"""

new_scene_vars = """    .sv-scene {
      --bw: clamp(445px, 32.5vw, 545px);
      --bh: clamp(262px, 19.1vw, 320px);
      --bd: clamp(82px, 5.7vw, 96px);
      position: relative;
      width: min(680px, 47vw);
      height: min(620px, 76vh);"""

assert old_scene_vars in html, "Could not find old_scene_vars"
html = html.replace(old_scene_vars, new_scene_vars, 1)

old_stage_h = """    .sv-stage {
      position: relative !important;
      inset: auto !important;
      width: 100%;
      height: clamp(360px, 45vh, 440px);"""

new_stage_h = """    .sv-stage {
      position: relative !important;
      inset: auto !important;
      width: 100%;
      height: clamp(385px, 48vh, 470px);"""

assert old_stage_h in html, "Could not find old_stage_h"
html = html.replace(old_stage_h, new_stage_h, 1)

old_btn_size = """      font-size: 14.5px;
      font-weight: 600;
      padding: 9px 24px;"""

new_btn_size = """      font-size: 15.5px;
      font-weight: 600;
      padding: 10px 27px;"""

assert old_btn_size in html, "Could not find old_btn_size"
html = html.replace(old_btn_size, new_btn_size, 1)

# Scale up back face padding and typography across all 6 boxes
old_back_padding = """    /* BACK FACE */
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
    }"""

new_back_padding = """    /* BACK FACE */
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
      padding: 22px 26px;
      color: #475569;
      font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    }"""

assert old_back_padding in html, "Could not find old_back_padding"
html = html.replace(old_back_padding, new_back_padding, 1)

html = html.replace(
    "font-size:11px; font-weight:800; color:#334155;",
    "font-size:13.5px; font-weight:800; color:#334155;"
)
html = html.replace(
    "font-size:11px; font-weight:800; color:#",
    "font-size:13.5px; font-weight:800; color:#"
)
html = html.replace(
    "flex:1; font-size:8px; line-height:1.5; color:#64748b;",
    "flex:1; font-size:10.5px; line-height:1.6; color:#475569;"
)
html = html.replace(
    "width:68px; height:32px; background:repeating-linear-gradient",
    "width:92px; height:44px; background:repeating-linear-gradient"
)
html = html.replace(
    "font-size:8px; font-weight:700; color:#94a3b8;",
    "font-size:10.5px; font-weight:700; color:#64748b;"
)

# 2. Make the Aspheric & Sulcoflex purple darker/richer to match the deep plum box, and make the accordion cards a little darker
html = html.replace(
    '--iol-accent:#a855f7;',
    '--iol-accent:#7c286c;'
)
html = html.replace(
    '--iol-accent: #a855f7; --iol-accent-border: rgba(168, 85, 247, 0.55); --iol-accent-ring: rgba(168, 85, 247, 0.25); --iol-accent-bg: rgba(147, 51, 234, 0.16);',
    '--iol-accent: #7c286c; --iol-accent-border: rgba(124, 40, 108, 0.72); --iol-accent-ring: rgba(124, 40, 108, 0.34); --iol-accent-bg: rgba(88, 29, 78, 0.38);'
)
html = html.replace(
    '--iol-accent: #a855f7; --iol-accent-border: rgba(168, 85, 247, 0.55); --iol-accent-ring: rgba(168, 85, 247, 0.25); --iol-accent-bg: rgba(126, 34, 206, 0.16);',
    '--iol-accent: #7c286c; --iol-accent-border: rgba(124, 40, 108, 0.72); --iol-accent-ring: rgba(124, 40, 108, 0.34); --iol-accent-bg: rgba(88, 29, 78, 0.38);'
)

old_row_dark = """    .sv-row {
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
    }"""

new_row_dark = """    .sv-row {
      border: 1.5px solid rgba(255, 255, 255, 0.14);
      border-radius: 16px;
      background: rgba(6, 16, 38, 0.58);
      backdrop-filter: blur(14px);
      transition: all 0.32s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }

    .sv-row:hover {
      border-color: var(--iol-accent-border, rgba(255, 255, 255, 0.32));
      background: rgba(8, 22, 50, 0.72);
    }

    .sv-row[data-open="true"] {
      border-radius: 16px;
      border: 1.5px solid var(--iol-accent, #e11d74);
      background: linear-gradient(180deg, var(--iol-accent-bg, rgba(225, 29, 116, 0.22)), rgba(5, 14, 34, 0.92));
      box-shadow: 0 14px 34px -10px var(--iol-accent-ring, rgba(225, 29, 116, 0.36));
    }"""

assert old_row_dark in html, "Could not find old_row_dark"
html = html.replace(old_row_dark, new_row_dark, 1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Successfully resized 3D box/back-face/buttons a little bigger and darkened Aspheric/Sulcoflex plum & accordion cards!")

