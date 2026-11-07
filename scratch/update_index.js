const fs = require('fs');

const indexFile = 'index.html';
let html = fs.readFileSync(indexFile, 'utf8');

// Hero section check: ensure it is intact
if (!html.includes('<!-- [LOCKED REGION]: HERO SECTION') || !html.includes('id="hero"')) {
  console.error('Lock violation: Hero section was not found or has been altered!');
  process.exit(1);
}

// 1. Prepare CSS for FAQ Drawer
const faqCss = `
  /* ========================================================================= */
  /* [ABOUT SECTION] TACTILE PRESCRIPTION BOND-PAPER DRAWER STYLES             */
  /* ========================================================================= */
  .mediq-faq-wrapper {
    perspective: 1200px;
  }

  .fq {
    color-scheme: dark;
    --tui-desk: #0a1d40;
    --tui-face: #0d224b;
    --tui-face-hi: #16366f;
    --tui-face-lo: #091733;
    --tui-well: #071328;
    --tui-skirt: #040c1a;
    --tui-ink: #f1f5f9;
    --tui-ink-2: #94a3b8;
    --tui-rule: rgba(58, 160, 219, 0.15);
    --tui-hl: rgba(255, 255, 255, 0.12);
    --tui-sh: 0 0 0;
    --tui-sh-a: 0.6;
    --tui-grain: 0.35;
    --tui-ease: cubic-bezier(0.2, 0.7, 0.2, 1);
    --tui-raised:
      inset 0 1px 0 rgba(255, 255, 255, 0.14),
      0 0 0 1px rgba(58, 160, 219, 0.25),
      0 12px 32px -8px rgba(0, 0, 0, 0.65);
    --tui-inset:
      inset 0 4px 6px -2px rgba(0, 0, 0, 0.7),
      inset 0 12px 20px -10px rgba(0, 0, 0, 0.8),
      inset 0 0 0 1px rgba(0, 0, 0, 0.5),
      0 1px 0 rgba(255, 255, 255, 0.08);

    /* Prescription Bond Paper & Medical Ink */
    --fq-paper: #f8f6f0;
    --fq-type: #141f31;
    --fq-type-2: #4a5b73;
    --fq-rule: rgba(10, 29, 64, 0.08);
    --fq-rule-2: rgba(10, 29, 64, 0.25);
    --fq-drop: rgba(0, 0, 0, 0.45);
    --fq-sans: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
    --fq-type-face: ui-monospace, 'Geist Mono', 'SF Mono', 'Courier New', monospace;

    position: relative;
    width: 100%;
    font-family: var(--fq-sans);
    -webkit-font-smoothing: antialiased;
  }

  .fq-cabinet {
    position: relative;
  }

  .fq-drawer {
    position: relative;
    isolation: isolate;
    padding: 12px 12px 0;
    border-radius: 16px;
    background: linear-gradient(175deg, #102650 0%, #0c1d3c 60%, #091730 100%);
    box-shadow: var(--tui-raised);
    border: 1px solid rgba(58, 160, 219, 0.3);
  }

  .fq-tray {
    display: grid;
    padding: 34px 10px 14px;
    border-radius: 10px 10px 4px 4px;
    background: linear-gradient(to bottom, #040c1a 0%, #071328 35%, #0a1d40 100%);
    box-shadow: var(--tui-inset);
    min-height: 290px;
  }

  /* ------------------------------------------------------------------ a card */
  .fq-card {
    --shade: calc(var(--depth, 0) * 0.09);
    position: relative;
    margin-inline: calc(var(--depth, 0) * 4px);
    border-radius: 4px 4px 1px 1px;
    background:
      linear-gradient(rgba(20, 28, 45, var(--shade)), rgba(20, 28, 45, var(--shade))),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.55' numOctaves='3' seed='9' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .45 0 0 0 0 .42 0 0 0 0 .35 0 0 0 .08 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)'/%3E%3C/svg%3E"),
      var(--fq-paper);
    color: var(--fq-type);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.95),
      inset 0 2px 0 rgba(0, 0, 0, 0.04),
      0 -1px 0 rgba(0, 0, 0, 0.1),
      0 -6px 8px -4px var(--fq-drop);
    transition: transform 220ms var(--tui-ease), box-shadow 220ms var(--tui-ease), margin 220ms var(--tui-ease);
  }

  .fq-card:first-child {
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 -1px 0 rgba(0, 0, 0, 0.08);
  }

  .fq-card:not([open]):hover {
    transform: translateY(-4px);
  }

  .fq-card[open] {
    z-index: 5;
    margin-top: 8px;
    transform: translateY(-10px);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.98),
      0 -4px 8px -4px var(--fq-drop),
      0 18px 26px -12px rgba(0, 0, 0, 0.5),
      0 2px 3px rgba(0, 0, 0, 0.12);
  }

  /* Card edge / summary */
  .fq-edge {
    display: grid;
    grid-template-columns: 4.8ch minmax(0, 1fr) auto;
    align-items: baseline;
    column-gap: 10px;
    padding: 13px 16px 18px;
    list-style: none;
    cursor: pointer;
    font: 600 13.5px/20px var(--fq-type-face);
    border-radius: inherit;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }
  .fq-edge::-webkit-details-marker { display: none; }
  .fq-edge::marker { content: ''; }
  .fq-edge:focus-visible { outline: 2px solid var(--fq-type); outline-offset: -4px; }

  .fq-no {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: #0284c7;
  }

  .fq-q {
    color: var(--fq-type);
    letter-spacing: -0.01em;
    text-wrap: pretty;
  }

  .fq-mark {
    width: 12px;
    height: 12px;
    align-self: center;
    position: relative;
  }
  .fq-mark::before, .fq-mark::after {
    content: '';
    position: absolute;
    left: 1px;
    right: 1px;
    top: 5.25px;
    height: 1.5px;
    background: var(--fq-type-2);
  }
  .fq-mark::after {
    transform: rotate(90deg);
    transition: transform 220ms var(--tui-ease);
  }
  .fq-card[open] .fq-mark::after {
    transform: rotate(0deg);
  }

  /* Tab that stands along top edge */
  .fq-tab {
    position: absolute;
    bottom: 100%;
    left: calc(var(--tab-at, 0) * 100%);
    height: 19px;
    padding: 2.5px 10px 0;
    border-radius: 5px 5px 0 0;
    background:
      linear-gradient(rgba(20, 28, 45, var(--shade)), rgba(20, 28, 45, var(--shade))),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.55' numOctaves='3' seed='9' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .45 0 0 0 0 .42 0 0 0 0 .35 0 0 0 .08 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)'/%3E%3C/svg%3E"),
      var(--fq-paper);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 -4px 6px -3px var(--fq-drop);
    font: 700 9.5px/15px var(--fq-type-face);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #0369a1;
    white-space: nowrap;
    pointer-events: none;
  }

  /* Face content */
  .fq-face {
    margin: -6px 16px 0;
    padding: 12px 0 18px calc(4.8ch + 10px);
    border-top: 3px double var(--fq-rule-2);
    font: 400 12.5px/23px var(--fq-type-face);
    background: repeating-linear-gradient(to bottom, transparent 0 22px, var(--fq-rule) 22px 23px) 0 16px / 100% calc(100% - 36px) no-repeat;
  }

  .fq-rx-header {
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #0369a1;
    margin-bottom: 8px;
    text-transform: uppercase;
    opacity: 0.85;
  }

  .fq-a {
    color: var(--fq-type);
    max-width: 58ch;
    text-wrap: pretty;
  }

  .fq-commitments-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    margin-top: 4px;
  }
  .fq-commit-item {
    font-size: 12px;
    line-height: 18px;
  }
  .fq-commit-item strong {
    color: #0a1d40;
    font-weight: 700;
  }

  .fq-filed {
    margin-top: 18px;
    font-size: 10px;
    letter-spacing: 0.06em;
    color: var(--fq-type-2);
    text-align: right;
    font-style: italic;
  }

  /* Drawer front plate */
  .fq-front {
    position: relative;
    display: grid;
    justify-items: center;
    gap: 8px;
    margin: 0 -12px;
    padding: 14px 0 16px;
    border-radius: 0 0 16px 16px;
    background: linear-gradient(to bottom, #112852 0%, #0d2042 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.14),
      inset 0 2px 0 rgba(0, 0, 0, 0.4),
      0 -1px 0 rgba(0, 0, 0, 0.6);
    border-top: 1px solid rgba(58, 160, 219, 0.2);
  }

  .fq-holder {
    display: block;
    padding: 2.5px;
    border-radius: 3px;
    background: linear-gradient(#081730, #16366f);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.8), 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 1px 1px rgba(0, 0, 0, 0.4);
  }

  .fq-holder-card {
    display: block;
    min-width: 140px;
    padding: 2.5px 12px 2px;
    border-radius: 1px;
    background: var(--fq-paper);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25);
    font: 700 10px/15px var(--fq-type-face);
    letter-spacing: 0.08em;
    text-align: center;
    text-transform: uppercase;
    color: #0a1d40;
  }

  .fq-pull {
    display: block;
    width: 96px;
    height: 20px;
    border-radius: 3px 3px 48px 48px / 3px 3px 20px 20px;
    background: linear-gradient(to bottom, #050e1d, #0d224b 45%, #183c7d);
    box-shadow: inset 0 3px 4px rgba(0,0,0,0.8), inset 0 -1px 1px rgba(255,255,255,0.25), 0 1px 0 rgba(255,255,255,0.1);
  }

  /* Ask us / Action bar */
  .fq-ask {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px 18px;
    margin-top: 16px;
    padding-inline: 4px;
  }

  .fq-note {
    font-size: 13px;
    color: #94a3b8;
    max-width: 38ch;
    line-height: 1.4;
    margin: 0;
  }

  .fq-key {
    display: inline-flex;
    align-items: center;
    height: 38px;
    padding: 0 18px;
    border-radius: 8px;
    font: 600 13px/1 var(--fq-sans);
    color: #ffffff;
    text-decoration: none;
    background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      0 2px 4px rgba(0, 0, 0, 0.3),
      0 6px 12px -3px rgba(2, 132, 199, 0.4);
    transition: all 180ms ease;
  }
  .fq-key:hover {
    transform: translateY(-1px);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      0 4px 8px rgba(0, 0, 0, 0.3),
      0 8px 18px -2px rgba(2, 132, 199, 0.55);
  }
  .fq-key:active {
    transform: translateY(1px);
  }

  @media (max-width: 640px) {
    .fq-tray { padding: 30px 6px 12px; }
    .fq-edge { grid-template-columns: minmax(0, 1fr) auto; padding: 12px 12px 16px; font-size: 13px; }
    .fq-no { display: none; }
    .fq-tab { font-size: 9px; padding-inline: 6px; }
    .fq-face { margin-inline: 10px; padding-left: 0; font-size: 12px; }
    .fq-ask { flex-direction: column; align-items: stretch; text-align: center; }
    .fq-key { justify-content: center; }
  }
`;

// Insert the CSS before </head> if not already present
if (!html.includes('id="faq-drawer-styles"')) {
  html = html.replace('</head>', `  <style id="faq-drawer-styles">${faqCss}</style>\n</head>`);
  console.log('Appended faq-drawer-styles to head');
} else {
  html = html.replace(/<style id="faq-drawer-styles">[\s\S]*?<\/style>/, `<style id="faq-drawer-styles">${faqCss}</style>`);
  console.log('Updated faq-drawer-styles in head');
}

// 2. Read new section HTML from scratch/build_about_html.js
const { aboutSectionHtml } = require('./build_about_html.js');

const aboutStartTag = '<section id="about"';
const aboutEndTag = '</section>';
const startIdx = html.indexOf(aboutStartTag);
const endIdx = html.indexOf(aboutEndTag, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error('ERROR: Could not locate <section id="about">');
  process.exit(1);
}

const beforeAbout = html.substring(0, startIdx);
const afterAbout = html.substring(endIdx + aboutEndTag.length);

html = beforeAbout + aboutSectionHtml.trim() + afterAbout;
console.log('Replaced #about section HTML');

fs.writeFileSync(indexFile, html, 'utf8');
console.log('Successfully updated index.html!');

