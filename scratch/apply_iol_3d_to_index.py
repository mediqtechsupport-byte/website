with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

# 1. Add CSS to <style> block
iol_css = '''
    /* ========================================================== */
    /* 3D SCROLL-DRIVEN INTRAOCULAR LENSES SHOWCASE (ZANDRELLEZ)  */
    /* ========================================================== */
    .iol-stage-container {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: transform, opacity;
    }

    .iol-stage-container.is-active {
      pointer-events: auto;
    }

    /* 3D Scene Wrapper */
    .iol-3d-scene {
      position: relative;
      width: clamp(280px, 36vw, 480px);
      height: clamp(280px, 36vw, 480px);
      display: flex;
      align-items: center;
      justify-content: center;
      perspective: 1200px;
      perspective-origin: 50% 45%;
    }

    .iol-halo {
      position: absolute;
      left: 6%;
      right: 6%;
      bottom: 2%;
      height: 48%;
      border-radius: 50%;
      background: radial-gradient(closest-side, rgba(58, 160, 219, 0.4), rgba(17, 50, 108, 0.25), transparent);
      filter: blur(42px);
      animation: iol-breathe 6s ease-in-out infinite;
      pointer-events: none;
    }

    @keyframes iol-breathe {
      0%, 100% { opacity: 0.55; transform: scale(0.95); }
      50% { opacity: 1; transform: scale(1.1); }
    }

    .iol-disc-platform {
      position: absolute;
      bottom: 4%;
      width: 86%;
      height: 38%;
      border-radius: 50%;
      background:
        radial-gradient(circle, transparent 0 54%, rgba(58, 160, 219, 0.35) 54.5%, transparent 56%),
        radial-gradient(circle, transparent 0 78%, rgba(114, 197, 248, 0.5) 78.5%, transparent 80%),
        radial-gradient(circle at 50% 36%, #133870, #091a38 72%);
      box-shadow:
        inset 0 0 25px rgba(0, 0, 0, 0.65),
        0 0 35px rgba(58, 160, 219, 0.3);
      transform: rotateX(64deg);
      pointer-events: none;
    }

    .iol-tilt-rig {
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

    .iol-float-card {
      position: relative;
      max-width: 95%;
      max-height: 85%;
      object-fit: contain;
      filter: drop-shadow(0 26px 40px rgba(3, 10, 26, 0.85)) drop-shadow(0 0 30px rgba(58, 160, 219, 0.35));
      animation: iol-floating 9s ease-in-out infinite;
      transform-style: preserve-3d;
      user-select: none;
      pointer-events: auto;
    }

    @keyframes iol-floating {
      0%, 100% {
        transform: translateY(0px) rotateY(-8deg) rotateX(4deg);
      }
      50% {
        transform: translateY(-18px) rotateY(10deg) rotateX(-2deg);
      }
    }

    /* Accordion styles */
    .iol-accordion-row {
      border: 1px solid rgba(58, 160, 219, 0.25);
      border-radius: 14px;
      background: rgba(10, 29, 64, 0.65);
      backdrop-filter: blur(14px);
      transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .iol-accordion-row:hover {
      border-color: rgba(58, 160, 219, 0.55);
      background: rgba(12, 36, 82, 0.8);
    }

    .iol-accordion-row[data-open="true"] {
      border-color: rgba(58, 160, 219, 0.75);
      background: linear-gradient(180deg, rgba(58, 160, 219, 0.18), rgba(7, 21, 48, 0.9));
      box-shadow: 0 10px 24px -10px rgba(58, 160, 219, 0.35);
    }

    .iol-acc-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      border: none;
      background: transparent;
      text-align: left;
    }

    .iol-acc-led {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: rgba(58, 160, 219, 0.4);
      transition: background 0.3s, box-shadow 0.3s;
    }

    .iol-accordion-row[data-open="true"] .iol-acc-led {
      background: #3aa0db;
      box-shadow: 0 0 10px #3aa0db;
    }

    .iol-acc-title {
      flex: 1;
      font-size: 0.875rem;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.01em;
    }

    .iol-acc-plus {
      position: relative;
      width: 12px;
      height: 12px;
      color: #72c5f8;
      transition: color 0.3s;
    }

    .iol-acc-plus i {
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      height: 1.5px;
      margin-top: -0.75px;
      border-radius: 2px;
      background: currentColor;
      transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .iol-acc-plus i:last-child {
      transform: rotate(90deg);
    }

    .iol-accordion-row[data-open="true"] .iol-acc-plus i:last-child {
      transform: rotate(0deg);
    }

    .iol-acc-panel {
      display: grid;
      grid-template-rows: 0fr;
      visibility: hidden;
      transition: grid-template-rows 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), visibility 0s linear 0.35s;
    }

    .iol-accordion-row[data-open="true"] .iol-acc-panel {
      grid-template-rows: 1fr;
      visibility: visible;
      transition-delay: 0s;
    }

    .iol-acc-clip {
      overflow: hidden;
      min-height: 0;
    }

    .iol-acc-desc {
      padding: 0 16px 12px 35px;
      font-size: 0.8rem;
      line-height: 1.55;
      color: rgba(246, 242, 234, 0.82);
    }

    /* Bottom Progress Rail */
    .iol-progress-rail {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 30;
      display: flex;
      gap: 12px;
      width: min(90vw, 560px);
    }

    .iol-rail-tab {
      all: unset;
      box-sizing: border-box;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
      color: rgba(246, 242, 234, 0.55);
      transition: color 0.3s;
    }

    .iol-rail-tab:hover,
    .iol-rail-tab.is-active {
      color: #ffffff;
    }

    .iol-rail-track {
      position: relative;
      height: 3px;
      border-radius: 3px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.12);
    }

    .iol-rail-fill {
      position: absolute;
      inset: 0;
      background: #3aa0db;
      transform-origin: left;
      transform: scaleX(0);
      transition: transform 0.15s ease-out;
    }

    .iol-rail-label {
      font-size: 10.5px;
      font-mono: true;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
'''

style_close_idx = index_html.find('</style>')
if iol_css.strip() not in index_html:
    index_html = index_html[:style_close_idx] + iol_css + index_html[style_close_idx:]
    print("Inserted IOL 3D CSS into <style> block!")

# 2. Replace section #products with updated deck
with open('scratch/updated_products_deck_with_3d.html', 'r', encoding='utf-8') as f:
    new_deck_html = f.read().strip()

prod_start = index_html.find('<section id="products"')
prod_end = index_html.find('</section>', prod_start) + len('</section>')

index_html = index_html[:prod_start] + new_deck_html + index_html[prod_end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index_html)

print("Applied updated products deck with 3D Slide 1 to index.html successfully!")

