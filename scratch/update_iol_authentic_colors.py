import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Enhance .sv-box-one to have the authentic RayOne slanted left edge
old_one_css = """    .sv-box-one {
      background: var(--box-accent, #c4006b);
      color: #ffffff;
      font-size: 21px;
      font-weight: 700;
      padding: 0 6px;
      line-height: 30px;
      letter-spacing: -0.01em;
    }"""

new_one_css = """    .sv-box-one {
      background: var(--box-accent, #c21868);
      color: #ffffff;
      font-size: 21px;
      font-weight: 600;
      padding: 0 7px 0 11px;
      line-height: 30px;
      letter-spacing: -0.01em;
      clip-path: polygon(14% 0, 100% 0, 100% 100%, 0% 100%);
    }"""

if old_one_css in html:
    html = html.replace(old_one_css, new_one_css, 1)

# Authentic specifications matching the 6 Rayner boxes 100%
BOX_SPECS = [
    {
        "idx": 0,
        "isSulcoflex": False,
        "isTrifocal": False,
        "isToric": False,
        "subbar": "EMV",
        "banner": "Preloaded IOL",
        "code": "RAO200E",
        "spineName": "RayOne EMV",
        "accent": "#c21868",
        "accentDark": "#94104e",
        "titleAccent": "#e11d74",
        "glow": "rgba(194, 24, 104, 0.30)",
        "titleHtml": 'RayOne<sup class="sv-title-reg">&reg;</sup> <span class="sv-title-accent" style="--iol-accent:#e11d74;">EMV</span>'
    },
    {
        "idx": 1,
        "isSulcoflex": False,
        "isTrifocal": False,
        "isToric": True,
        "subbar": "EMV TORIC",
        "banner": "Preloaded IOL",
        "code": "RAO210T",
        "spineName": "RayOne EMV Toric",
        "accent": "#eb5a28",
        "accentDark": "#bf4217",
        "titleAccent": "#eb5a28",
        "glow": "rgba(235, 90, 40, 0.30)",
        "titleHtml": 'RayOne<sup class="sv-title-reg">&reg;</sup> <span class="sv-title-accent" style="--iol-accent:#eb5a28;">EMV Toric</span>'
    },
    {
        "idx": 2,
        "isSulcoflex": False,
        "isTrifocal": True,
        "isToric": False,
        "subbar": "TRIFOCAL",
        "banner": "Preloaded IOL",
        "code": "RAO603F",
        "spineName": "RayOne Trifocal",
        "accent": "#3ca6bf",
        "accentDark": "#297f94",
        "titleAccent": "#3ca6bf",
        "glow": "rgba(60, 166, 191, 0.30)",
        "titleHtml": 'RayOne<sup class="sv-title-reg">&reg;</sup> <span class="sv-title-accent" style="--iol-accent:#3ca6bf;">Trifocal</span>'
    },
    {
        "idx": 3,
        "isSulcoflex": False,
        "isTrifocal": True,
        "isToric": True,
        "subbar": "TRIFOCAL TORIC",
        "banner": "Preloaded IOL",
        "code": "RAO613Z",
        "spineName": "RayOne Trifocal Toric",
        "accent": "#163767",
        "accentDark": "#0e2446",
        "titleAccent": "#2563eb",
        "glow": "rgba(22, 55, 103, 0.34)",
        "titleHtml": 'RayOne<sup class="sv-title-reg">&reg;</sup> <span class="sv-title-accent" style="--iol-accent:#3b82f6;">Trifocal Toric</span>'
    },
    {
        "idx": 4,
        "isSulcoflex": False,
        "isTrifocal": False,
        "isToric": False,
        "subbar": "ASPHERIC",
        "banner": "Preloaded IOL",
        "code": "RAO600C",
        "spineName": "RayOne Aspheric",
        "accent": "#5a1e50",
        "accentDark": "#3d1236",
        "titleAccent": "#9333ea",
        "glow": "rgba(90, 30, 80, 0.32)",
        "titleHtml": 'RayOne<sup class="sv-title-reg">&reg;</sup> <span class="sv-title-accent" style="--iol-accent:#a855f7;">Aspheric</span>'
    },
    {
        "idx": 5,
        "isSulcoflex": True,
        "isTrifocal": False,
        "isToric": False,
        "subbar": "ASPHERIC",
        "banner": "Pseudophakic Supplementary IOL",
        "code": "653L",
        "spineName": "Sulcoflex Aspheric",
        "accent": "#581d4e",
        "accentDark": "#3b1134",
        "titleAccent": "#9333ea",
        "glow": "rgba(88, 29, 78, 0.32)",
        "titleHtml": 'Sulcoflex<sup class="sv-title-reg">&reg;</sup> <span class="sv-title-accent" style="--iol-accent:#a855f7;">Aspheric</span>'
    }
]

def build_front_face(spec):
    accent = spec["accent"]
    subbar = spec["subbar"]
    banner = spec["banner"]

    if spec["isSulcoflex"]:
        return f"""                          <!-- FRONT FACE (SULCOFLEX AUTHENTIC ARTWORK) -->
                          <div class="sv-box3d__face sv-box3d__face--front" style="padding: 0; flex-direction: row;">
                            <!-- Left White Column -->
                            <div style="width: 42%; height: 100%; padding: 20px 10px 14px 18px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
                              <div>
                                <div style="font-size: 21px; line-height: 1; letter-spacing: -0.02em; color: #1e293b; font-weight: 600;">
                                  SULCO<span style="color: {accent}; font-weight: 800; font-size: 24px;">flex</span>
                                </div>
                                <div style="font-size: 10px; letter-spacing: 0.12em; color: #334155; font-weight: 600; text-align: right; margin-top: 3px; padding-right: 6px;">ASPHERIC</div>
                              </div>
                              <div style="display: flex; flex-direction: column; align-items: center; gap: 5px; text-align: center;">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                  <circle cx="12" cy="12" r="10" stroke="#14532d" stroke-width="2.2"/>
                                  <circle cx="12" cy="12" r="4" fill="#14532d"/>
                                </svg>
                                <div style="font-size: 5.5px; font-weight: 800; color: #4d7c0f; line-height: 1.25; letter-spacing: 0.04em;">
                                  RAYNER.COM/RAYPRO<br>3 YEARS FREE PATIENT OUTCOMES DATA
                                </div>
                              </div>
                            </div>
                            <!-- Right Curved Plum Panel -->
                            <div style="width: 58%; height: 100%; background: linear-gradient(145deg, {accent} 0%, {spec['accentDark']} 100%); border-top-left-radius: 95px; padding: 22px 18px 14px 26px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; color: #ffffff; position: relative; overflow: hidden;">
                              <div style="font-size: 15px; font-weight: 300; line-height: 1.22; letter-spacing: -0.01em;">
                                Pseudophakic<br>Supplementary IOL
                              </div>
                              <svg viewBox="0 0 120 90" style="width: 112px; height: 82px; align-self: center; margin: -4px 0;" fill="none">
                                <circle cx="60" cy="45" r="22" stroke="rgba(255,255,255,0.85)" stroke-width="1.2"/>
                                <path d="M44 30 C 28 16, 18 28, 22 40 C 25 48, 34 38, 38 42" stroke="rgba(255,255,255,0.85)" stroke-width="1.2" fill="none"/>
                                <path d="M76 60 C 92 74, 102 62, 98 50 C 95 42, 86 52, 82 48" stroke="rgba(255,255,255,0.85)" stroke-width="1.2" fill="none"/>
                              </svg>
                              <div style="display: flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 700; color: #ffffff;">
                                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 13H2L8 2Z" fill="rgba(255,255,255,0.85)"/></svg>
                                <span>Rayner</span>
                              </div>
                            </div>
                          </div>"""

    rings_svg = ""
    if spec["isTrifocal"]:
        rings_svg = """
                                  <circle cx="60" cy="60" r="15" stroke="#cbd5e1" stroke-width="0.7"/>
                                  <circle cx="60" cy="60" r="12" stroke="#cbd5e1" stroke-width="0.7"/>
                                  <circle cx="60" cy="60" r="9" stroke="#cbd5e1" stroke-width="0.7"/>
                                  <circle cx="60" cy="60" r="6" stroke="#cbd5e1" stroke-width="0.7"/>"""
    else:
        rings_svg = '<circle cx="60" cy="60" r="14" stroke="#e2e8f0" stroke-width="0.9" stroke-dasharray="2 2"/>'

    toric_marks = ""
    if spec["isToric"]:
        toric_marks = """
                                  <line x1="53" y1="43" x2="55" y2="47" stroke="#94a3b8" stroke-width="1.2"/>
                                  <line x1="67" y1="77" x2="65" y2="73" stroke="#94a3b8" stroke-width="1.2"/>"""

    return f"""                          <!-- FRONT FACE -->
                          <div class="sv-box3d__face sv-box3d__face--front">
                            <div class="sv-box-header">
                              <div class="sv-box-logo-col">
                                <div class="sv-box-rayone">
                                  <span class="sv-box-ray">Ray</span>
                                  <span class="sv-box-one">One</span>
                                </div>
                                <div class="sv-box-subbar">{subbar}</div>
                              </div>
                              <div class="sv-box-banner" style="font-size: 22px;">{banner}</div>
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
                                  <circle cx="60" cy="60" r="19" stroke="#94a3b8" stroke-width="1.2"/>{rings_svg}{toric_marks}
                                  <path d="M48 45 C 42 26, 68 20, 73 34 C 76 41, 68 43, 66 42" stroke="#94a3b8" stroke-width="1.2" fill="none"/>
                                  <path d="M72 75 C 78 94, 52 100, 47 86 C 44 79, 52 77, 54 78" stroke="#94a3b8" stroke-width="1.2" fill="none"/>
                                </svg>
                              </div>
                            </div>

                            <div class="sv-box-footer">
                              <div class="sv-box-rayner-mark">
                                <div class="sv-box-rayner-brand">
                                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 13H2L8 2Z" fill="#334155"/></svg>
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
                              <div class="sv-box-raypro-text">3 YEARS FREE PATIENT OUTCOMES DATA<br>LEARN MORE AT RAYNER.COM/RAYPRO</div>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="#15803d" stroke-width="2.2"/>
                                <circle cx="12" cy="12" r="4" fill="#0f172a"/>
                              </svg>
                            </div>
                          </div>"""

def build_scene_inner(spec):
    accent = spec["accent"]
    accent_dark = spec["accentDark"]
    glow = spec["glow"]
    code = spec["code"]
    spine_name = spec["spineName"]
    front_html = build_front_face(spec)

    return f"""                  <div class="sv-scene" data-view="front" style="--box-accent: {accent}; --box-accent-dark: {accent_dark}; --box-glow: {glow};" onpointermove="handleIolTilt(event, this)" onpointerleave="resetIolTilt(this)">
                    <div class="sv-stage" onpointerdown="startIolBoxDrag(event, this)">
                      <div class="sv-box-halo"></div>
                      <div class="sv-box-float">
                        <div class="sv-box3d">
{front_html}

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
    # Replace the #iol-scene-{idx} inner .sv-scene
    scene_start = html.find(f'<div id="iol-scene-{idx}"')
    assert scene_start != -1, f"Could not find #iol-scene-{idx}"
    # Find the next <!-- ================= or <div id="iol-content- or <!-- ================= MOBILE VIEW
    if idx in (0, 2, 4):
        next_marker = html.find(f'<div id="iol-content-{idx}"', scene_start)
    elif idx in (1, 3):
        next_marker = html.find(f'<!-- ================= STAGE {idx+1}:', scene_start)
    else:
        next_marker = html.find('<!-- ================= MOBILE VIEW', scene_start)
    assert next_marker != -1, f"Could not find next marker after #iol-scene-{idx}"

    block = html[scene_start:next_marker]
    first_nl = block.find('\n')
    header_line = block[:first_nl+1]
    new_block = header_line + build_scene_inner(spec) + "\n                </div>\n\n                "
    html = html[:scene_start] + new_block + html[next_marker:]

    # Also update the stage title inside #iol-content-{idx}
    content_start = html.find(f'<div id="iol-content-{idx}"')
    assert content_start != -1
    title_match = re.search(r'<h2 class="sv-title">[\s\S]*?</h2>', html[content_start:content_start+600])
    assert title_match, f"Could not find sv-title in #iol-content-{idx}"
    abs_s = content_start + title_match.start()
    abs_e = content_start + title_match.end()
    html = html[:abs_s] + f'<h2 class="sv-title">{spec["titleHtml"]}</h2>' + html[abs_e:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated all 6 boxes and titles to match exact authentic box colors!")

