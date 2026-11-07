import re

START = '<!-- ========================================================================= -->\n        <!-- SLIDE 3: WHAT WE DO'
END = '<!-- ========================================================================= -->\n        <!-- SLIDE 4: OUR ESTABLISHED FOUNDATION'

ICONS = {
 'orbit': '<svg class="size-4 animate-spin" style="animation-duration:9s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9" stroke-dasharray="4 4" stroke-opacity="0.5"/><circle cx="12" cy="12" r="3" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></svg>',
 'bolt': '<svg class="size-4 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
 'wave': '<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12c3-4 6-4 8 0s5 4 8 0 4-4 4-4"/></svg>',
 'shield': '<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
 'cap': '<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
 'headset': '<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
}

CARDS = [
 dict(n='01', cat='Supply Chain', title='Strategic Importation &amp; Distribution', icon='orbit', span='lg:col-span-6', wide=True,
      img='p1_cleanroom_inspect.jpg', cap='Cleanroom Inspection',
      desc='Product sourcing, importation coordination, cleanroom inventory availability, and validated temperature-controlled cold-chain support across all major Philippine ports of entry.',
      tags=['Product Sourcing','Import Coordination','Inventory Reserves','GDP Cold-Chain'], stat='Cold-Chain Dispatch SLA', val='&lt; 24-48 Hours', vc='text-sky'),
 dict(n='02', cat='Commercial', title='Product Marketing &amp; Brand Development', icon='bolt', span='lg:col-span-3', wide=False,
      img='p2_headquarters_brand.jpg', cap='Brand Strategy',
      desc='Evidence-based brand positioning, clinical symposia, and advisory summits connecting global innovators with Philippine ophthalmic leaders.',
      tags=['Brand Strategy','Symposia','PAO Exhibits'], stat='Academic Symposia', val='25+ / Year', vc='text-sky'),
 dict(n='03', cat='Field Network', title='Nationwide Clinical &amp; Sales Coverage', icon='wave', span='lg:col-span-3', wide=False,
      img='p3_specialist_discussion.jpg', cap='Specialist Detailing',
      desc='Direct surgical suite detailing, hospital relations, and consignment management across NCR, Luzon, Visayas, and Mindanao.',
      tags=['Direct Detailing','OR Consignment','Hospital Relations'], stat='Archipelago Reach', val='17 Regions', vc='text-sky'),
 dict(n='04', cat='Governance', title='Regulatory Compliance &amp; QA', icon='shield', span='lg:col-span-3', wide=False,
      img='p6_quality_metrology.jpg', cap='Quality Metrology',
      desc='Full Philippine FDA product registration, GDP/CDRR certifications, cold-chain temperature monitoring, and pharmacovigilance.',
      tags=['FDA Registered','GDP Certified','Thermal Mapping'], stat='Regulatory Audits', val='100% Pass Rate', vc='text-emerald-400'),
 dict(n='05', cat='Professional Dev', title='Clinical &amp; Surgical Education', icon='cap', span='lg:col-span-3', wide=False,
      img='p5_theatre_wetlab.jpg', cap='Wet Lab Theatre',
      desc='Hands-on dry &amp; wet labs, phacoemulsification masterclasses, and CME-accredited workshops for residents and fellows.',
      tags=['Wet Lab Courses','CME Accredited','Video Surgery'], stat='Surgeons Trained', val='500+ Fellows', vc='text-sky'),
 dict(n='06', cat='Continuity', title='Comprehensive Post-Market Support', icon='headset', span='lg:col-span-6', wide=True,
      img='p6_lot_traceability.jpg', cap='Lot Traceability',
      desc='Equipment calibration, IOL biometry assistance, surgical feedback loops, and a 24/7 technical hotline for ophthalmic teams and ASCs nationwide.',
      tags=['Tech Hotline','Rapid Turnaround','Surgical In-Service','Quality Feedback'], stat='Service SLA Response', val='24/7 Priority Standby', vc='text-sky'),
]

SPOT = '<div class="bento-spotlight pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="background:radial-gradient(320px circle at var(--bx,50%) var(--by,50%),rgba(58,160,219,0.20),transparent 70%)"></div>'

def tags_html(tags):
    return ''.join(f'<span class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cream/85">{t}</span>' for t in tags)

def head(c):
    return f'''<div class="flex items-center justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="px-2 py-0.5 rounded-md bg-sky/15 border border-sky/30 text-[10px] font-mono font-bold text-sky uppercase shrink-0">PILLAR {c['n']}</span>
                    <span class="text-[10px] font-medium text-[#72c5f8]/80 uppercase tracking-widest truncate">{c['cat']}</span>
                  </div>
                  <div class="size-8 rounded-full border border-sky/30 bg-[#0a1835] flex items-center justify-center text-sky shrink-0">{ICONS[c['icon']]}</div>
                </div>'''

def foot(c):
    return f'''<div class="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span class="text-cream/60 font-mono">{c['stat']}</span>
                <span class="font-mono font-bold {c['vc']} text-sm">{c['val']}</span>
              </div>'''

def img_box(c, cls):
    return f'''<div class="relative overflow-hidden rounded-xl border border-sky/30 bg-black/50 {cls}">
                <img src="assets/img/pillars/{c['img']}" alt="{c['title'].replace('&amp;','and')}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/90 via-transparent to-transparent"></div>
                <span class="absolute bottom-2 left-2.5 text-[9px] font-mono text-sky font-bold uppercase bg-black/60 px-2 py-0.5 rounded border border-white/10">{c['cap']}</span>
              </div>'''

def card(c):
    base = f'bento-pillar-card group relative overflow-hidden rounded-3xl border border-sky/25 hover:border-sky/55 bg-[#071530]/90 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_18px_40px_rgba(0,0,0,0.65)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between {c["span"]}'
    if c['wide']:
        body = f'''<div class="flex-1 flex flex-col sm:flex-row gap-4 items-stretch">
                <div class="sm:w-[52%] flex flex-col justify-center">
                  <h3 class="text-lg xl:text-xl font-extrabold text-white group-hover:text-sky transition-colors mb-1.5 leading-tight">{c['title']}</h3>
                  <p class="text-xs text-cream/80 leading-relaxed mb-3">{c['desc']}</p>
                  <div class="flex flex-wrap gap-1.5">{tags_html(c['tags'])}</div>
                </div>
                {img_box(c, 'sm:w-[48%] min-h-[150px] sm:min-h-0')}
              </div>'''
    else:
        body = f'''{img_box(c, 'h-24 xl:h-28 mb-3 shrink-0')}
              <div class="flex-1">
                <h3 class="text-base xl:text-[17px] font-extrabold text-white group-hover:text-sky transition-colors mb-1.5 leading-tight">{c['title']}</h3>
                <p class="text-[11.5px] text-cream/75 leading-relaxed mb-2.5">{c['desc']}</p>
                <div class="flex flex-wrap gap-1.5">{tags_html(c['tags'])}</div>
              </div>'''
    return f'''<div class="{base}">
              {SPOT}
              <div class="relative z-20 flex flex-col flex-1">
                {head(c)}
                {body}
                {foot(c)}
              </div>
            </div>'''

cards_html = '\n            '.join(card(c) for c in CARDS)

METRICS = [('17 Regions','Coverage','text-white'),('99.8%','Cold-Chain','text-emerald-400'),('120+','Partner Centers','text-white'),('Rayner UK','Exclusive Partner','text-sky')]
metrics_html = ''.join(f'<div class="text-center px-3 py-1.5 rounded-xl bg-white/5 border border-white/10"><span class="block text-sm sm:text-base font-extrabold {c}">{v}</span><span class="block text-[9px] font-mono text-sky/80 uppercase tracking-widest">{l}</span></div>' for v,l,c in METRICS)

slide = f'''<!-- ========================================================================= -->
        <!-- SLIDE 3: WHAT WE DO (Interactive Bento Grid Architecture)                -->
        <!-- ========================================================================= -->
        <div id="about-slide-what-we-do" class="about-slide absolute inset-0 w-full h-full flex flex-col bg-transparent text-cream px-3 sm:px-5 lg:px-6 pt-16 sm:pt-[72px] pb-16 overflow-y-auto transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0" data-index="2">

          <div class="pointer-events-none absolute -left-20 top-1/4 h-[32rem] w-[32rem] rounded-full bg-sky/15 blur-[160px]"></div>
          <div class="pointer-events-none absolute right-0 top-1/3 h-[36rem] w-[36rem] rounded-full bg-[#11326c]/45 blur-[180px]"></div>
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#3aa0db_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>

          <div class="relative z-20 w-full max-w-[1760px] mx-auto flex flex-col gap-3 sm:gap-4 my-auto">

            <!-- Header row: title left, metrics right (saves vertical space) -->
            <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
              <div>
                <div class="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#071530]/85 border border-sky/30 text-[10px] font-mono font-bold text-sky uppercase tracking-wider mb-1.5">
                  <span class="size-1.5 rounded-full bg-sky animate-ping"></span><span>Core Capabilities</span>
                </div>
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-none">
                  What <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky via-[#72c5f8] to-white">We Do</span>
                </h2>
                <p class="text-xs sm:text-sm text-cream/75 leading-relaxed max-w-2xl mt-1.5">
                  Commercial operations, clinical distribution, and surgical healthcare partnerships across the Philippine archipelago.
                </p>
              </div>
              <div class="grid grid-cols-4 gap-2 shrink-0">{metrics_html}</div>
            </div>

            <!-- Bento Grid: 12 columns, edge to edge -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4">
            {cards_html}
            </div>

          </div>

        </div>
'''

for path in ['index.html', 'components/about-locked-backup.html']:
    with open(path, 'r', encoding='utf-8', newline='') as f:
        h = f.read()
    nl = '\r\n' if '\r\n' in h else '\n'
    h = h.replace('\r\n', '\n')
    s, e = h.find(START), h.find(END)
    assert s != -1 and e != -1, path
    h = h[:s] + slide + '\n' + h[e:]
    if nl == '\r\n':
        h = h.replace('\n', '\r\n')
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(h)
    print('updated', path)

