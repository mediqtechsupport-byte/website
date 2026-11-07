with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

# 1. Update CSS in <style> block
css_start = index_html.find('/* 3D SCROLL-DRIVEN INTRAOCULAR LENSES SHOWCASE (ZANDRELLEZ)')
divider_css = index_html.rfind('/* ===', 0, css_start)
if divider_css != -1:
    css_start = divider_css

css_end = index_html.find('</style>', css_start)

clean_css = '''/* ========================================================== */
    /* 3D SCROLL-DRIVEN INTRAOCULAR LENSES SHOWCASE (ZANDRELLEZ)  */
    /* ========================================================== */
    .sv-scene {
      position: relative;
      width: clamp(340px, 42vw, 560px);
      height: clamp(340px, 42vw, 560px);
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: pan-y;
      user-select: none;
    }

    .sv-halo {
      position: absolute;
      left: 6%;
      right: 6%;
      bottom: 6%;
      height: 48%;
      border-radius: 50%;
      background: radial-gradient(closest-side, rgba(58, 160, 219, 0.45), rgba(17, 50, 108, 0.2), transparent);
      filter: blur(48px);
      animation: sv-breathe 5s ease-in-out infinite;
      pointer-events: none;
    }

    @keyframes sv-breathe {
      0%, 100% { opacity: 0.55; transform: scale(0.96); }
      50% { opacity: 0.95; transform: scale(1.08); }
    }

    .sv-stage {
      position: absolute;
      inset: 0;
      perspective: 1200px;
      perspective-origin: 50% 45%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sv-tilt {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transform-style: preserve-3d;
      transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1);
      will-change: transform;
    }

    .sv-rig {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transform-style: preserve-3d;
    }

    /* Multi-layered 3D Plinth / Disc Platform */
    .sv-plinth {
      position: absolute;
      bottom: 8%;
      width: 90%;
      height: 40%;
      border-radius: 50%;
      transform-style: preserve-3d;
      transform: rotateX(66deg);
      pointer-events: none;
    }

    .sv-disc {
      position: absolute;
      inset: 0;
      border-radius: 50%;
    }

    .sv-disc--top {
      background:
        radial-gradient(circle, transparent 0 54%, rgba(58, 160, 219, 0.4) 54.5%, transparent 56%),
        radial-gradient(circle, transparent 0 78%, rgba(114, 197, 248, 0.6) 78.5%, transparent 80%),
        radial-gradient(circle at 50% 36%, #1a4282, #071530 75%);
      box-shadow:
        inset 0 0 30px rgba(0, 0, 0, 0.8),
        0 0 40px rgba(58, 160, 219, 0.35);
    }

    .sv-disc--ring1 {
      inset: -6px;
      border: 1.5px solid rgba(58, 160, 219, 0.3);
      filter: blur(0.5px);
    }

    .sv-disc--ring2 {
      inset: -16px;
      border: 1px solid rgba(58, 160, 219, 0.15);
      filter: blur(1px);
    }

    /* High-Definition Packshot Floating in 3D Space */
    .sv-packshot-img {
      position: relative;
      width: 88%;
      max-height: 82%;
      object-fit: contain;
      filter: drop-shadow(0 28px 45px rgba(2, 6, 18, 0.95)) drop-shadow(0 0 35px rgba(58, 160, 219, 0.35));
      animation: sv-packshot-float 9s ease-in-out infinite;
      transform-style: preserve-3d;
      user-select: none;
      z-index: 10;
    }

    @keyframes sv-packshot-float {
      0%, 100% {
        transform: translateY(0px) rotateY(-8deg) rotateX(3deg);
      }
      50% {
        transform: translateY(-20px) rotateY(9deg) rotateX(-2deg);
      }
    }

    /* ================= CONTENT SIDE (Matches Reference Typography) ================= */
    .sv-content {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 580px;
      padding: 8px 32px;
      box-sizing: border-box;
    }

    .sv-title {
      margin: 0;
      font-size: clamp(34px, 3.8vw, 52px);
      line-height: 1.08;
      letter-spacing: -0.035em;
      font-weight: 700;
      color: #ffffff;
      text-wrap: balance;
    }

    .sv-subtitle {
      margin: 12px 0 0;
      font-size: 15.5px;
      line-height: 1.4;
      font-weight: 500;
      letter-spacing: -0.005em;
      color: #72c5f8;
      opacity: 0.9;
    }

    .sv-pitch {
      margin: 14px 0 0;
      max-width: 52ch;
      font-size: 14.5px;
      line-height: 1.6;
      color: rgba(246, 242, 234, 0.78);
    }

    /* Accordion List */
    .sv-list {
      list-style: none;
      margin: 28px 0 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
    }

    .sv-row {
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 18px;
      overflow: hidden;
      background: rgba(10, 29, 64, 0.5);
      backdrop-filter: blur(12px);
      transition: border-color 0.35s, background 0.35s, box-shadow 0.45s;
    }

    .sv-row:hover {
      border-color: rgba(58, 160, 219, 0.45);
      background: rgba(13, 38, 84, 0.65);
    }

    .sv-row[data-open="true"] {
      border-color: rgba(58, 160, 219, 0.7);
      background: linear-gradient(180deg, rgba(58, 160, 219, 0.14), rgba(7, 21, 48, 0.85));
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.25),
        0 20px 40px -20px rgba(58, 160, 219, 0.5),
        0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .sv-row__btn {
      all: unset;
      box-sizing: border-box;
      width: 100%;
      display: flex;
      align-items: center;
      gap: 14px;
      cursor: pointer;
      padding: 16px 20px;
      border-radius: inherit;
    }

    .sv-row__led {
      flex: none;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      box-shadow: inset 0 0 0 1.5px rgba(255, 255, 255, 0.35);
      opacity: 0.7;
      transition: background 0.35s, box-shadow 0.35s, opacity 0.35s;
    }

    .sv-row[data-open="true"] .sv-row__led {
      background: #3aa0db;
      opacity: 1;
      box-shadow:
        0 0 0 4px rgba(58, 160, 219, 0.25),
        0 0 14px rgba(58, 160, 219, 0.8);
    }

    .sv-row__title {
      flex: 1;
      font-size: 15px;
      line-height: 1.3;
      font-weight: 600;
      letter-spacing: -0.012em;
      color: #ffffff;
      transition: color 0.3s;
    }

    .sv-row__plus {
      flex: none;
      position: relative;
      width: 13px;
      height: 13px;
      color: #72c5f8;
      transition: color 0.3s;
    }

    .sv-row__plus i {
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      height: 1.5px;
      margin-top: -0.75px;
      border-radius: 2px;
      background: currentColor;
      transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .sv-row__plus i:last-child {
      transform: rotate(90deg);
    }

    .sv-row[data-open="true"] .sv-row__plus i:last-child {
      transform: rotate(0deg);
    }

    .sv-row__panel {
      display: grid;
      grid-template-rows: 0fr;
      visibility: hidden;
      transition:
        grid-template-rows 0.45s cubic-bezier(0.2, 0.8, 0.2, 1),
        visibility 0s linear 0.45s;
    }

    .sv-row[data-open="true"] .sv-row__panel {
      grid-template-rows: 1fr;
      visibility: visible;
      transition-delay: 0s;
    }

    .sv-row__clip {
      overflow: hidden;
      min-height: 0;
    }

    .sv-row__desc {
      margin: 0;
      padding: 0 24px 18px 42px;
      font-size: 13.5px;
      line-height: 1.6;
      color: rgba(246, 242, 234, 0.82);
    }

    /* ================= PROGRESS RAIL (Matches Reference Rail) ================= */
    .sv-rail {
      position: absolute;
      z-index: 30;
      bottom: 22px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 16px;
      width: min(90vw, 580px);
    }

    .sv-rail__item {
      all: unset;
      box-sizing: border-box;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px 0;
      cursor: pointer;
      color: rgba(246, 242, 234, 0.5);
      transition: color 0.3s;
    }

    .sv-rail__item:hover,
    .sv-rail__item[aria-current="true"] {
      color: #ffffff;
    }

    .sv-rail__label {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.02em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sv-rail__track {
      position: relative;
      height: 3px;
      border-radius: 3px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.12);
    }

    .sv-rail__fill {
      position: absolute;
      inset: 0;
      background: #3aa0db;
      box-shadow: 0 0 12px rgba(58, 160, 219, 0.7);
      transform-origin: left;
      transform: scaleX(0);
      transition: transform 0.15s ease-out;
    }

    .sv-rail__item[aria-current="true"] .sv-rail__fill {
      box-shadow: 0 0 16px #3aa0db;
    }
'''

index_html = index_html[:css_start] + clean_css + index_html[css_end:]

# 2. Replace Slide 1 in section #products
s1_start = index_html.find('<!-- SLIDE 1: INTRAOCULAR LENSES')
divider_s1 = index_html.rfind('<!-- ===', 0, s1_start)
if divider_s1 != -1:
    s1_start = divider_s1

s2_start = index_html.find('<!-- SLIDE 2: MEDICAL SUPPLIES')
divider_s2 = index_html.rfind('<!-- ===', 0, s2_start)
if divider_s2 != -1:
    s2_start = divider_s2

with open('scratch/new_clean_slide1.html', 'r', encoding='utf-8') as f:
    clean_slide1 = f.read().strip()

index_html = index_html[:s1_start] + clean_slide1 + "\n\n        " + index_html[s2_start:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index_html)

print("Updated index.html with clean zandrellez Slide 1 and styles!")

