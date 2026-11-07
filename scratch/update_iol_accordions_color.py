import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_row_block = """    .sv-row {
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
      padding: 15px 24px;
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
      width: 9px;
      height: 9px;
      border-radius: 50%;
      border: 1.5px solid rgba(255, 255, 255, 0.45);
      background: transparent;
      transition: all 0.3s ease;
    }

    .sv-row[data-open="true"] .sv-row__led {
      border-color: #38bdf8;
      background: #38bdf8;
      box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.24), 0 0 10px rgba(56, 189, 248, 0.6);
    }"""

new_row_block = """    .sv-row {
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
    }"""

assert old_row_block in html, "Could not find old_row_block"
html = html.replace(old_row_block, new_row_block, 1)

old_plus_open = """    .sv-row[data-open="true"] .sv-row__plus {
      transform: rotate(45deg);
      color: #3aa0db;
    }"""

new_plus_open = """    .sv-row[data-open="true"] .sv-row__plus {
      transform: rotate(45deg);
      color: var(--iol-accent, #e11d74);
    }"""

assert old_plus_open in html, "Could not find old_plus_open"
html = html.replace(old_plus_open, new_plus_open, 1)

STAGE_THEMES = [
    (0, "--iol-accent: #e11d74; --iol-accent-border: rgba(225, 29, 116, 0.55); --iol-accent-ring: rgba(225, 29, 116, 0.25); --iol-accent-bg: rgba(194, 24, 104, 0.15);"),
    (1, "--iol-accent: #eb5a28; --iol-accent-border: rgba(235, 90, 40, 0.55); --iol-accent-ring: rgba(235, 90, 40, 0.25); --iol-accent-bg: rgba(235, 90, 40, 0.15);"),
    (2, "--iol-accent: #3ca6bf; --iol-accent-border: rgba(60, 166, 191, 0.55); --iol-accent-ring: rgba(60, 166, 191, 0.25); --iol-accent-bg: rgba(60, 166, 191, 0.15);"),
    (3, "--iol-accent: #3b82f6; --iol-accent-border: rgba(59, 130, 246, 0.55); --iol-accent-ring: rgba(59, 130, 246, 0.25); --iol-accent-bg: rgba(37, 99, 235, 0.18);"),
    (4, "--iol-accent: #a855f7; --iol-accent-border: rgba(168, 85, 247, 0.55); --iol-accent-ring: rgba(168, 85, 247, 0.25); --iol-accent-bg: rgba(147, 51, 234, 0.16);"),
    (5, "--iol-accent: #a855f7; --iol-accent-border: rgba(168, 85, 247, 0.55); --iol-accent-ring: rgba(168, 85, 247, 0.25); --iol-accent-bg: rgba(126, 34, 206, 0.16);"),
]

for idx, style_vars in STAGE_THEMES:
    target = f'<div id="iol-content-{idx}"'
    pos = html.find(target)
    assert pos != -1, f"Could not find {target}"
    sv_content_pos = html.find('<div class="sv-content"', pos)
    assert sv_content_pos != -1 and sv_content_pos - pos < 300
    end_tag = html.find('>', sv_content_pos)
    html = html[:sv_content_pos] + f'<div class="sv-content" style="{style_vars}">' + html[end_tag+1:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated all 6 stages' accordion cards to follow each specific box's color pattern!")

