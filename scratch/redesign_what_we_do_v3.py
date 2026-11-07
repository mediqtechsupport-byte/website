import html

START = '<!-- ========================================================================= -->\n        <!-- SLIDE 3: WHAT WE DO'
END = '<!-- ========================================================================= -->\n        <!-- SLIDE 4: OUR ESTABLISHED FOUNDATION'

P = [
 dict(n='01', cat='Supply Chain', title='Strategic Importation & Distribution', img='p1_cleanroom_inspect.jpg',
      short='Sourcing, importation and validated cold-chain delivery to every major port of entry.',
      desc='We source Rayner and partner products directly from the manufacturer, coordinate customs clearance, and keep cleanroom-grade inventory ready so surgeons never wait on a lens.',
      pts=['Product sourcing & importation coordination','Cleanroom inventory reserves','GDP-compliant cold-chain logistics','Port-of-entry to operating-room tracking'], sl='Cold-chain dispatch', sv='< 24-48 Hours'),
 dict(n='02', cat='Commercial', title='Product Marketing & Brand Development', img='p2_headquarters_brand.jpg',
      short='Evidence-based positioning, symposia and advisory summits with ophthalmic leaders.',
      desc='We build clinical-first brand programs that connect international innovators with Philippine ophthalmologists through congresses, symposia and peer-to-peer education.',
      pts=['Brand strategy & clinical positioning','Surgeon symposia and advisory boards','PAO and congress exhibitions','Launch campaigns for new technologies'], sl='Academic symposia', sv='25+ / Year'),
 dict(n='03', cat='Field Network', title='Nationwide Clinical & Sales Coverage', img='p3_specialist_discussion.jpg',
      short='Direct surgical-suite detailing and hospital relations across the archipelago.',
      desc='Our clinical specialists work alongside surgical teams in Luzon, Visayas and Mindanao, handling detailing, consignment and hospital relationships.',
      pts=['Direct surgical-suite detailing','Operating-room consignment management','Hospital and ASC relations','Coverage across NCR, Luzon, Visayas, Mindanao'], sl='Archipelago reach', sv='17 Regions'),
 dict(n='04', cat='Governance', title='Regulatory Compliance & QA', img='p6_quality_metrology.jpg',
      short='FDA registration, GDP/CDRR certification and pharmacovigilance.',
      desc='Every product we distribute is registered, traceable and stored under audited conditions, with continuous temperature monitoring and post-market surveillance.',
      pts=['Philippine FDA product registration','GDP / CDRR certification','Thermal mapping & temperature monitoring','Pharmacovigilance & recall readiness'], sl='Regulatory audits', sv='100% Pass'),
 dict(n='05', cat='Professional Dev', title='Clinical & Surgical Education', img='p5_theatre_wetlab.jpg',
      short='Wet labs, masterclasses and CME-accredited workshops for surgeons.',
      desc='Hands-on dry and wet labs, phacoemulsification masterclasses and accredited workshops that raise surgical outcomes for residents and fellows alike.',
      pts=['Dry & wet lab courses','Phacoemulsification masterclasses','CME-accredited modules','Live and recorded video surgery'], sl='Surgeons trained', sv='500+ Fellows'),
 dict(n='06', cat='Continuity', title='Comprehensive Post-Market Support', img='p6_lot_traceability.jpg',
      short='Calibration, biometry assistance and a 24/7 technical hotline nationwide.',
      desc='After the sale we stay close: equipment calibration, biometry assistance, surgical feedback loops and a technical hotline for ophthalmic teams.',
      pts=['Equipment calibration & in-service','IOL biometry assistance','Surgical feedback loops','24/7 technical hotline'], sl='Service SLA', sv='24/7 Priority'),
]

def esc(s): return html.escape(s, quote=True)

def card(p):
    return f'''<button type="button" class="wwd-card group relative flex flex-col min-h-[300px] lg:min-h-0 overflow-hidden rounded-2xl border border-sky/25 hover:border-sky/60 bg-[#071530]/85 backdrop-blur-xl text-left p-[clamp(0.45rem,1.2vh,0.8rem)] shadow-[0_0_22px_rgba(58,160,219,0.12),0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(58,160,219,0.18)] hover:shadow-[0_0_34px_rgba(58,160,219,0.3),0_14px_36px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              data-title="{esc(p['title'])}" data-cat="{esc(p['cat'])}" data-n="{p['n']}" data-img="assets/img/pillars/{p['img']}" data-desc="{esc(p['desc'])}" data-pts="{esc('|'.join(p['pts']))}" data-sl="{esc(p['sl'])}" data-sv="{esc(p['sv'])}">
              <span class="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sky/60 to-transparent"></span>
              <span class="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-sky/80 to-transparent shadow-[0_0_10px_rgba(58,160,219,0.7)]"></span>
              <div class="relative flex-1 min-h-0 w-full overflow-hidden rounded-xl">
                <img src="assets/img/pillars/{p['img']}" alt="{esc(p['title'])}" class="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/70 via-transparent to-transparent"></div>
                <span class="absolute top-2 left-2 text-[11px] font-mono font-semibold text-white/90 bg-[#071530]/75 backdrop-blur px-2 py-0.5 rounded-md border border-sky/30">{p['n']}</span>
                <span class="absolute bottom-2 left-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#071530]/80 border border-sky/40 backdrop-blur text-[clamp(0.55rem,1.4vh,0.75rem)] font-semibold"><span class="text-white/85 uppercase">{p['sl']}</span><span class="text-white/50">&bull;</span><span class="text-[#72c5f8]">{p['sv']}</span></span>
              </div>
              <div class="px-1.5 pt-[clamp(0.35rem,1vh,0.75rem)] pb-0.5 flex items-center justify-between gap-2 shrink-0">
                <div class="min-w-0">
                  <div class="text-[clamp(0.52rem,1.3vh,0.72rem)] font-semibold uppercase tracking-[0.12em] text-[#72c5f8] truncate">{p['cat']}</div>
                  <h3 class="font-bold text-white leading-tight text-[clamp(0.78rem,2vh,1.15rem)]">{p['title'].replace('&','&amp;')}</h3>
                </div>
                <span class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky/10 group-hover:bg-sky/20 border border-sky/30 group-hover:border-sky/60 text-[11px] font-semibold text-white transition-all backdrop-blur-md"><span>Find out more</span><svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg></span>
              </div>
            </button>'''

cards = '\n            '.join(card(p) for p in P)

slide = f'''<!-- ========================================================================= -->
        <!-- SLIDE 3: WHAT WE DO (Card Grid with Find-out-more detail card)           -->
        <!-- ========================================================================= -->
        <div id="about-slide-what-we-do" class="about-slide absolute inset-0 w-full h-full flex flex-col bg-transparent text-cream px-6 sm:px-10 lg:px-20 pt-[72px] pb-12 overflow-y-auto transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0" data-index="2">

          <!-- Pill navigation (same position as Foundation / Core Values) -->
          <div class="absolute top-[76px] left-0 right-0 z-30 px-6 sm:px-10 lg:px-16 flex items-center justify-between gap-3 pointer-events-none">
            <button type="button" onclick="if(window.goToAboutSlide){{window.goToAboutSlide(1);}}" class="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md"><svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg><span>Who We Are</span></button>
            <button type="button" onclick="if(window.goToAboutSlide){{window.goToAboutSlide(3);}}" class="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md"><span>Our Foundation</span><svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg></button>
          </div>

          <div class="relative z-20 w-full max-w-[1500px] mx-auto flex flex-col gap-[clamp(0.4rem,1.2vh,0.9rem)] flex-1 min-h-[300px]">
            <div class="flex flex-col items-center text-center shrink-0">
              <h2 class="font-semibold text-white tracking-tight leading-none text-[clamp(1.5rem,5vh,3rem)]">
                What <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky via-[#72c5f8] to-white font-bold drop-shadow-[0_0_20px_rgba(114,197,248,0.45)]">We Do</span>
              </h2>
              <p class="mt-1 [@media(max-height:560px)]:hidden text-white/75 text-[clamp(0.65rem,1.6vh,0.95rem)]">Clinical distribution and surgical partnerships across the Philippines.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-[clamp(0.5rem,1.4vh,1rem)] flex-1 min-h-0">
            {cards}
            </div>
          </div>

          <!-- Find-out-more detail card -->
          <div id="wwd-modal" class="absolute left-0 right-0 z-50 items-center justify-center p-4 sm:p-8 bg-[#030b1c]/80 backdrop-blur-md opacity-0 transition-opacity duration-300" style="display:none" role="dialog" aria-modal="true" aria-labelledby="wwd-modal-title">
            <div class="relative w-full max-w-5xl max-h-full overflow-y-auto rounded-3xl border border-sky/35 bg-[#071530] shadow-[0_30px_80px_rgba(0,0,0,0.8)] grid grid-cols-1 md:grid-cols-2">
              <button type="button" id="wwd-modal-close" aria-label="Close" class="absolute top-3 right-3 z-10 size-9 rounded-full bg-black/60 border border-white/15 hover:border-sky text-white flex items-center justify-center cursor-pointer">
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
              <div class="relative min-h-[220px] md:min-h-[420px]">
                <img id="wwd-modal-img" src="" alt="" class="absolute inset-0 h-full w-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-[#071530] via-transparent to-transparent md:bg-gradient-to-r"></div>
              </div>
              <div class="p-6 sm:p-8 flex flex-col gap-3">
                <span id="wwd-modal-tag" class="self-start px-2.5 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-[11px] font-mono font-bold text-sky uppercase"></span>
                <h3 id="wwd-modal-title" class="text-2xl sm:text-3xl font-extrabold text-white leading-tight"></h3>
                <p id="wwd-modal-desc" class="text-sm sm:text-base text-cream/80 leading-relaxed"></p>
                <ul id="wwd-modal-pts" class="grid gap-2 text-sm text-cream/90"></ul>
                <div class="mt-auto pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <div><div id="wwd-modal-sl" class="text-[11px] font-mono uppercase text-cream/60"></div><div id="wwd-modal-sv" class="text-xl font-extrabold text-sky font-mono"></div></div>
                  <a href="#contact" id="wwd-modal-cta" class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream/90 hover:text-white transition-all cursor-pointer backdrop-blur-md"><span>Contact us</span><svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg></a>
                </div>
              </div>
            </div>
          </div>

        </div>
'''

for path in ['index.html', 'components/about-locked-backup.html']:
    with open(path, 'r', encoding='utf-8', newline='') as f:
        h = f.read()
    crlf = '\r\n' in h
    h = h.replace('\r\n', '\n')
    s, e = h.find(START), h.find(END)
    assert s != -1 and e != -1, path
    h = h[:s] + slide + '\n' + h[e:]
    if crlf:
        h = h.replace('\n', '\r\n')
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(h)
    print('updated', path)

# JS
js_path = 'assets/js/main.js'
with open(js_path, 'r', encoding='utf-8', newline='') as f:
    js = f.read()
if 'WHAT WE DO FIND-OUT-MORE' not in js:
    add = '''

/* ========================================================================= */
/* WHAT WE DO FIND-OUT-MORE DETAIL CARD                                       */
/* ========================================================================= */
(function initWhatWeDoModal() {
  const $ = (id) => document.getElementById(id);
  function close() {
    const m = $('wwd-modal');
    if (!m || m.style.display === 'none') return;
    m.style.opacity = '0';
    setTimeout(() => { m.style.display = 'none'; }, 300);
  }
  function open(card) {
    const m = $('wwd-modal');
    const slide = $('about-slide-what-we-do');
    if (!m || !slide) return;
    const d = card.dataset;
    $('wwd-modal-img').src = d.img;
    $('wwd-modal-img').alt = d.title;
    $('wwd-modal-tag').textContent = 'Pillar ' + d.n + ' \\u2022 ' + d.cat;
    $('wwd-modal-title').textContent = d.title;
    $('wwd-modal-desc').textContent = d.desc;
    $('wwd-modal-sl').textContent = d.sl;
    $('wwd-modal-sv').textContent = d.sv;
    const ul = $('wwd-modal-pts');
    ul.innerHTML = '';
    (d.pts || '').split('|').forEach((t) => {
      const li = document.createElement('li');
      li.className = 'flex items-start gap-2';
      const dot = document.createElement('span');
      dot.className = 'mt-1.5 size-1.5 rounded-full bg-sky shrink-0';
      const tx = document.createElement('span');
      tx.textContent = t;
      li.appendChild(dot);
      li.appendChild(tx);
      ul.appendChild(li);
    });
    m.style.top = slide.scrollTop + 'px';
    m.style.height = slide.clientHeight + 'px';
    m.style.display = 'flex';
    requestAnimationFrame(() => { m.style.opacity = '1'; });
  }
  document.addEventListener('click', (e) => {
    const card = e.target.closest && e.target.closest('.wwd-card');
    if (card) { open(card); return; }
    const m = $('wwd-modal');
    if (!m || m.style.display === 'none') return;
    if (e.target === m || (e.target.closest && e.target.closest('#wwd-modal-close'))) close();
    else if (e.target.closest && e.target.closest('#wwd-modal-cta')) close();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();
'''
    nl = '\r\n' if '\r\n' in js else '\n'
    js = js.rstrip() + (add.replace('\n', nl)) + nl
    with open(js_path, 'w', encoding='utf-8', newline='') as f:
        f.write(js)
    print('updated main.js')

