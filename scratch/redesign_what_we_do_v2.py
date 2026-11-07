START = '<!-- ========================================================================= -->\n        <!-- SLIDE 3: WHAT WE DO'
END = '<!-- ========================================================================= -->\n        <!-- SLIDE 4: OUR ESTABLISHED FOUNDATION'

CELLS = [
 ('p1','Strategic Importation &amp; Distribution','Product sourcing, importation coordination, cleanroom inventory availability and validated cold-chain support across all major Philippine ports of entry.','p1_cleanroom_inspect.jpg','Cold-chain dispatch','&lt; 24-48 Hrs','col-span-1 md:col-span-3 lg:col-span-2 border-b md:border-r'),
 ('p2','Product Marketing &amp; Brand Development','Evidence-based brand positioning, clinical symposia and advisory summits connecting global innovators with Philippine ophthalmic leaders.','p2_headquarters_brand.jpg','Academic symposia','25+ / Year','col-span-1 md:col-span-3 lg:col-span-2 border-b lg:border-r'),
 ('p3','Nationwide Clinical &amp; Sales Coverage','Direct surgical suite detailing, hospital relations and consignment management across NCR, Luzon, Visayas and Mindanao.','p3_specialist_discussion.jpg','Archipelago reach','17 Regions','col-span-1 md:col-span-6 md:border-b lg:border-r-0 lg:col-span-2 border-b'),
 None,
 ('p4','Regulatory Compliance &amp; QA','Full FDA product registration, GDP/CDRR certification, cold-chain temperature monitoring and pharmacovigilance.','p6_quality_metrology.jpg','Regulatory audits','100% Pass','col-span-1 md:col-span-3 lg:col-span-2 md:border-r border-b md:border-b-0'),
 ('p5','Clinical &amp; Surgical Education','Hands-on dry and wet labs, phacoemulsification masterclasses and CME-accredited workshops for residents and fellows.','p5_theatre_wetlab.jpg','Surgeons trained','500+ Fellows','col-span-1 md:col-span-3 lg:col-span-2 lg:border-r border-b md:border-b-0'),
 ('p6','Comprehensive Post-Market Support','Equipment calibration, biometry assistance, surgical feedback loops and a 24/7 technical hotline for ophthalmic teams nationwide.','p6_lot_traceability.jpg','Service SLA','24/7 Priority','col-span-1 md:col-span-6 lg:border-r-0 lg:col-span-2'),
]
BASE = 'bento-pillar-card group relative overflow-hidden p-4 sm:p-6 lg:p-7 border-sky/20 bg-[#071530]/70 backdrop-blur-xl transition-colors duration-300 hover:bg-[#0a1d40]/80 '
SPOT = '<div class="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="background:radial-gradient(300px circle at var(--bx,50%) var(--by,50%),rgba(58,160,219,0.16),transparent 70%)"></div>'

def cell(c):
    cid, title, desc, img, sl, sv, cls = c
    return f'''<div id="wwd-{cid}" class="{BASE}{cls}">
              {SPOT}
              <div class="relative z-20 flex h-full flex-col">
                <h3 class="text-left text-xl lg:text-2xl font-extrabold tracking-tight text-white group-hover:text-sky transition-colors leading-snug">{title}</h3>
                <p class="text-left text-sm lg:text-[15px] text-cream/80 mt-2 mb-4 leading-relaxed">{desc}</p>
                <div class="relative mt-auto flex-1 min-h-[120px] w-full overflow-hidden rounded-xl border border-sky/30 bg-black/40">
                  <img src="assets/img/pillars/{img}" alt="{title.replace('&amp;','and')}" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
                  <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/80 via-transparent to-transparent"></div>
                  <div class="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono">
                    <span class="bg-black/60 px-2.5 py-1 rounded border border-white/10 text-cream/80 uppercase">{sl}</span>
                    <span class="bg-black/60 px-2.5 py-1 rounded border border-sky/30 text-sky font-bold">{sv}</span>
                  </div>
                </div>
              </div>
            </div>'''

stats = [('17 Regions','Archipelago coverage','text-white'),('99.8%','Cold-chain reliability','text-emerald-400'),('120+','Partner eye centers','text-white'),('Rayner UK','Exclusive partner','text-sky')]
stats_cell = '<div class="relative overflow-hidden p-4 sm:p-5 lg:py-6 border-sky/20 bg-[#071530]/70 backdrop-blur-xl col-span-1 md:col-span-6 lg:col-span-6 border-b"><div class="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">' + ''.join(f'<div><div class="text-2xl sm:text-3xl lg:text-4xl font-extrabold {c}">{v}</div><div class="font-mono text-[11px] uppercase tracking-widest text-sky/80">{l}</div></div>' for v,l,c in stats) + '</div></div>'

cells_html = '\n            '.join(stats_cell if c is None else cell(c) for c in CELLS)

slide = f'''<!-- ========================================================================= -->
        <!-- SLIDE 3: WHAT WE DO (Divided-cell Bento Grid, MediQ palette)             -->
        <!-- ========================================================================= -->
        <div id="about-slide-what-we-do" class="about-slide absolute inset-0 w-full h-full flex flex-col bg-transparent text-cream px-3 sm:px-4 lg:px-5 pt-14 sm:pt-[60px] pb-14 overflow-y-auto transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0" data-index="2">

          <div class="pointer-events-none absolute -left-20 top-1/4 h-[32rem] w-[32rem] rounded-full bg-sky/15 blur-[160px]"></div>
          <div class="pointer-events-none absolute right-0 top-1/3 h-[36rem] w-[36rem] rounded-full bg-[#11326c]/45 blur-[180px]"></div>
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#3aa0db_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>

          <div class="relative z-20 w-full max-w-[1900px] mx-auto flex flex-col gap-2 sm:gap-3 flex-1 min-h-[680px]">
            <div class="text-center">
              <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-none">
                What <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky via-[#72c5f8] to-white">We Do</span>
              </h2>
              <p class="text-xs sm:text-sm text-cream/75 leading-relaxed max-w-2xl mx-auto mt-1.5">
                Commercial operations, clinical distribution, and surgical healthcare partnerships across the Philippine archipelago.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 lg:grid-rows-[1fr_auto_1fr] flex-1 gap-0 rounded-3xl border border-sky/25 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            {cells_html}
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

