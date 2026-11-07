with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update subtitles to use colon format matching media_1794013821643_6a2e4aa3.jpg
subtitle_replacements = [
    (
        '<p class="sv-subtitle">Co-developed with Prof. Graham Barrett &bull; Extended Visual Depth</p>',
        '<p class="sv-subtitle">Co-developed with Prof. Graham Barrett: Extended Visual Depth</p>'
    ),
    (
        '<p class="sv-subtitle">Extended Visual Depth &bull; Precision Corneal Astigmatism Correction</p>',
        '<p class="sv-subtitle">Extended Visual Depth: Precision Corneal Astigmatism Correction</p>'
    ),
    (
        '<p class="sv-subtitle">Patented 16-Ring Diffractive Profile &bull; Maximum Light Transmission</p>',
        '<p class="sv-subtitle">Patented 16-Ring Diffractive Profile: Maximum Light Transmission</p>'
    ),
    (
        '<p class="sv-subtitle">Full Spectacle Independence &bull; Simultaneous Astigmatism Correction</p>',
        '<p class="sv-subtitle">Full Spectacle Independence: Simultaneous Astigmatism Correction</p>'
    ),
    (
        '<p class="sv-subtitle">Aberration-Neutral Precision &bull; Universal Corneal Compatibility</p>',
        '<p class="sv-subtitle">Aberration-Neutral Precision: Universal Corneal Compatibility</p>'
    ),
    (
        '<p class="sv-subtitle">Pseudophakic Supplementary Platform &bull; Reversible Ciliary Sulcus Placement</p>',
        '<p class="sv-subtitle">Pseudophakic Supplementary Platform: Reversible Ciliary Sulcus Placement</p>'
    ),
]

for old_sub, new_sub in subtitle_replacements:
    assert old_sub in html, f"Could not find subtitle: {old_sub}"
    html = html.replace(old_sub, new_sub, 1)

# 2. Update "Glisten-Free Rayacryl® Copolymer" -> "Glistening-Free Rayacryl® Copolymer"
html = html.replace(
    '<span class="sv-row__title">Glisten-Free Rayacryl&reg; Copolymer</span>',
    '<span class="sv-row__title">Glistening-Free Rayacryl&reg; Copolymer</span>'
)

# 3. Update "3 YEARS FREE PATIENT OUTCOMES DATA" -> "5 YEARS FREE PATIENT OUTCOMES DATA" on front boxes to match screenshot
html = html.replace(
    '3 YEARS FREE PATIENT OUTCOMES DATA',
    '5 YEARS FREE PATIENT OUTCOMES DATA'
)

# 4. Refine .sv-box-btn and .sv-row styling to match media_1794013821643_6a2e4aa3.jpg
old_btn_css = """    .sv-box-btn {
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
    }"""

new_btn_css = """    .sv-box-btn {
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
    }

    .sv-box-btn:hover {
      border-color: var(--box-accent, #c21868);
      background: rgba(255, 255, 255, 0.18);
      transform: translateY(-1px);
    }

    .sv-box-btn[aria-pressed="true"] {
      background: var(--box-accent, #c21868);
      border-color: var(--box-accent, #c21868);
      color: #ffffff;
      font-weight: 700;
      box-shadow: 0 0 0 2px rgba(10, 25, 47, 0.9), 0 0 0 3.5px #38bdf8, 0 8px 20px -4px var(--box-glow, rgba(194, 24, 104, 0.5));
    }"""

assert old_btn_css in html, "Could not find old_btn_css"
html = html.replace(old_btn_css, new_btn_css, 1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Successfully updated text, subtitles, accordion copy, and buttons in index.html!")

