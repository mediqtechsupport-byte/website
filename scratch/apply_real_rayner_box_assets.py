import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

BOX_SPECS = [
    {
        "idx": 0,
        "slug": "emv",
        "code": "RAO200E",
        "spineName": "RayOne EMV",
        "accent": "#c21868",
        "accentDark": "#94104e",
        "glow": "rgba(194, 24, 104, 0.30)",
    },
    {
        "idx": 1,
        "slug": "emv_toric",
        "code": "RAO210T",
        "spineName": "RayOne EMV Toric",
        "accent": "#eb5a28",
        "accentDark": "#bf4217",
        "glow": "rgba(235, 90, 40, 0.30)",
    },
    {
        "idx": 2,
        "slug": "trifocal",
        "code": "RAO603F",
        "spineName": "RayOne Trifocal",
        "accent": "#3ca6bf",
        "accentDark": "#297f94",
        "glow": "rgba(60, 166, 191, 0.30)",
    },
    {
        "idx": 3,
        "slug": "trifocal_toric",
        "code": "RAO613Z",
        "spineName": "RayOne Trifocal Toric",
        "accent": "#163767",
        "accentDark": "#0e2446",
        "glow": "rgba(22, 55, 103, 0.34)",
    },
    {
        "idx": 4,
        "slug": "aspheric",
        "code": "RAO600C",
        "spineName": "RayOne Aspheric",
        "accent": "#5a1e50",
        "accentDark": "#3d1236",
        "glow": "rgba(90, 30, 80, 0.32)",
    },
    {
        "idx": 5,
        "slug": "sulcoflex",
        "code": "653L",
        "spineName": "Sulcoflex Aspheric",
        "accent": "#581d4e",
        "accentDark": "#3b1134",
        "glow": "rgba(88, 29, 78, 0.32)",
    }
]

def build_scene_inner(spec):
    slug = spec["slug"]
    accent = spec["accent"]
    accent_dark = spec["accentDark"]
    glow = spec["glow"]
    code = spec["code"]
    spine_name = spec["spineName"]

    return f"""                  <div class="sv-scene" data-view="front" style="--box-accent: {accent}; --box-accent-dark: {accent_dark}; --box-glow: {glow};" onpointermove="handleIolTilt(event, this)" onpointerleave="resetIolTilt(this)">
                    <div class="sv-stage" onpointerdown="startIolBoxDrag(event, this)">
                      <div class="sv-box-halo"></div>
                      <div class="sv-box-float">
                        <div class="sv-box3d">
                          <!-- FRONT FACE (Authentic Rayner Asset Texture) -->
                          <div class="sv-box3d__face sv-box3d__face--front" style="padding: 0; background: #ffffff;">
                            <img src="assets/img/packshots/box_front_{slug}.png?v=375.0" alt="{spine_name} Packaging Box Front" style="width: 100%; height: 100%; object-fit: fill; display: block; pointer-events: none;" draggable="false">
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

                          <!-- TOP & BOTTOM FACES (Authentic Rayner Top Flap Texture) -->
                          <div class="sv-box3d__face sv-box3d__face--top" style="overflow: hidden;">
                            <img src="assets/img/packshots/box_top_{slug}.png?v=375.0" alt="" style="width: 100%; height: 100%; object-fit: fill; display: block; pointer-events: none;" draggable="false">
                          </div>
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
    scene_start = html.find(f'<div id="iol-scene-{idx}"')
    assert scene_start != -1, f"Could not find #iol-scene-{idx}"
    if idx in (0, 2, 4):
        next_marker = html.find(f'<div id="iol-content-{idx}"', scene_start)
    elif idx in (1, 3):
        next_marker = html.find(f'<!-- ================= STAGE {idx+1}:', scene_start)
    else:
        next_marker = html.find('<!-- ================= MOBILE VIEW', scene_start)
    assert next_marker != -1

    block = html[scene_start:next_marker]
    first_nl = block.find('\n')
    header_line = block[:first_nl+1]
    new_block = header_line + build_scene_inner(spec) + "\n                </div>\n\n                "
    html = html[:scene_start] + new_block + html[next_marker:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Successfully applied authentic Rayner box textures to all 6 3D boxes!")

