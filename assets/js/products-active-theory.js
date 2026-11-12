/**
 * ACTIVE THEORY (/work) — "WHAT ARE YOU LOOKING FOR?" 3D HELICAL SPINE,
 * LANDSCAPE SMOKY-GLASS PLATES, KINETIC RGB GLITCH TYPOGRAPHY & TERMINAL
 * ============================================================================
 * Exact 1:1 recreation of the Active Theory /work video (00:00 - 00:15):
 *   1. Central 3D Biomechanical / Iridescent Vertebral Spine Column + 320
 *      orbiting 3D faceted triangular crystal shards at Z = 0px inside the
 *      preserve-3d world (foreground cards pass IN FRONT of the spine;
 *      background cards pass BEHIND the spine).
 *   2. Wide Landscape Smoky-Glass Metallic Cards (500x300, 14px radius)
 *      orbiting Left and Right around the central spine.
 *   3. Kinetic Character-Stutter + Vertical RGB Scanline Slice Glitch on card
 *      titles during scroll/orbit ("RAAYOONNE  EEMMVV ||"), snapping into
 *      crisp focus when centered.
 *   4. Bottom-Left "WHAT ARE YOU LOOKING FOR?" ChatDOM Terminal with
 *      "0123456789" random-digit scramble reveal + "[ ASK ME ANYTHING... ]".
 *   5. Click-to-Inspect Centered 16:10 Landscape Detail Stage (00:11 - 00:15
 *      "DAY 1 CLUB" style) with giant matte-black 3D embossed background
 *      typography, interactive packshot, glowing pill CTA, and "<- CLOSE".
 */
(function initProductsActiveTheoryShowcase() {
  'use strict';

  const CATALOG = {
    // ========================================================================
    // SUBPAGE 1: ESTABLISHED OPHTHALMOLOGY PORTFOLIO (Rayner UK Intraocular Lenses)
    // ========================================================================
    1: {
      subpageTitle: 'ESTABLISHED OPHTHALMOLOGY · RAYNER IOLs',
      prompt: 'WHAT ARE YOU LOOKING FOR?',
      filters: [
        { label: 'ALL LENSES', slug: 'all' },
        { label: 'ENHANCED MONOVISION (EMV)', slug: 'emv' },
        { label: 'TRIFOCAL OPTICS', slug: 'trifocal' },
        { label: 'TORIC ASTIGMATISM', slug: 'toric' },
        { label: 'MONOFOCAL ASPHERIC', slug: 'monofocal' },
        { label: 'PSEUDOPHAKIC SUPPLEMENTARY', slug: 'sulcoflex' }
      ],
      items: [
        {
          id: 'rayone-emv',
          code: 'RAO200E',
          brand: 'RAYNER UK',
          kicker: '2026 / RAYNER UK / ENHANCED MONOVISION / IOL',
          title: 'RAYONE EMV',
          emboss: 'RAYONE EMV OPTIC',
          subtitle: 'Have you experienced up to 1.5 D extended range of vision with a natural binocular transition?',
          desc: 'PATENTED POSITIVE SPHERICAL ABERRATION OPTIC DESIGNED WITH PROF. GRAHAM BARrett TO EXTEND DEPTH OF FOCUS WITH MINIMAL DYSPHOTOPSIA.',
          badge: 'Up to 1.5 D Range · Preloaded',
          packshot: 'assets/img/packshots/authentic_emv.png',
          accent: '#00e5ff',
          tags: ['all', 'emv'],
          keywords: ['emv', 'monovision', 'enhanced', 'range', 'depth', 'barrett', '200e'],
          detailSlide: 1,
          iolStage: 0
        },
        {
          id: 'rayone-trifocal',
          code: 'RAO603F',
          brand: 'RAYNER UK',
          kicker: '2026 / RAYNER UK / FULL-RANGE TRIFOCAL / IOL',
          title: 'RAYONE\nTRIFOCAL',
          emboss: 'TRIFOCAL 89%',
          subtitle: 'Engineered for 89% light transmission and seamless spectacle independence across all distances.',
          desc: 'PATENTED 16-STEP DIFFRACTIVE TRIFOCAL OPTIC DELIVERING 89% LIGHT UTILIZATION TO THE RETINA FOR DISTANCE, INTERMEDIATE, AND NEAR VISION.',
          badge: '89% Light Utilization · 16-Step',
          packshot: 'assets/img/packshots/authentic_trifocal.png',
          accent: '#a855f7',
          tags: ['all', 'trifocal'],
          keywords: ['trifocal', 'multifocal', 'near', 'intermediate', 'spectacle', '603f'],
          detailSlide: 1,
          iolStage: 1
        },
        {
          id: 'rayone-trifocal-toric',
          code: 'RAO613T',
          brand: 'RAYNER UK',
          kicker: '2026 / RAYNER UK / ASTIGMATIC TRIFOCAL / IOL',
          title: 'TRIFOCAL\nTORIC',
          emboss: 'TORIC STABILITY',
          subtitle: 'Combining 16-step trifocal optics with anti-vaulting haptic rotational stability (< 1.8°).',
          desc: 'PRECISION ASTIGMATISM CORRECTION COMBINED WITH FULL-RANGE TRIFOCAL OPTICS AND PATENTED ANTI-VAULTING HAPTIC (AVH) TECHNOLOGY.',
          badge: '< 1.8° Mean Rotation · AVH',
          packshot: 'assets/img/packshots/authentic_trifocal_toric.png',
          accent: '#38bdf8',
          tags: ['all', 'trifocal', 'toric'],
          keywords: ['toric', 'astigmatism', 'trifocal', 'rotation', '613t'],
          detailSlide: 1,
          iolStage: 2
        },
        {
          id: 'rayone-aspheric',
          code: 'RAO600C',
          brand: 'RAYNER UK',
          kicker: '2026 / RAYNER UK / ABERRATION-NEUTRAL / IOL',
          title: 'RAYONE\nASPHERIC',
          emboss: 'ZERO GLARE',
          subtitle: 'Zero-glistening hydrophilic acrylic optic delivered through a 1.65 mm micro-incision.',
          desc: 'ABERRATION-NEUTRAL ASPHERIC MONOFOCAL OPTIC DELIVERING SUPERIOR CONTRAST SENSITIVITY AND ZERO GLISTENINGS.',
          badge: '1.65 mm Nozzle · Zero Glistenings',
          packshot: 'assets/img/packshots/authentic_aspheric.png',
          accent: '#2dd4bf',
          tags: ['all', 'monofocal'],
          keywords: ['aspheric', 'monofocal', '600c', 'contrast', 'clear'],
          detailSlide: 1,
          iolStage: 3
        },
        {
          id: 'rayone-hydrophobic',
          code: 'RAO800C',
          brand: 'RAYNER UK',
          kicker: '2026 / RAYNER UK / CROSS-LINKED HYDROPHOBIC / IOL',
          title: 'RAYONE\nHYDROPHOBIC',
          emboss: '360 SQUARE EDGE',
          subtitle: 'Proprietary cross-linked hydrophobic acrylic with Amon-Apple 360° enhanced square edge.',
          desc: 'NEXT-GENERATION HYDROPHOBIC ACRYLIC OPTIC WITH CONTROLLED UNFOLDING AND ULTRA-LOW PCO INCIDENCE.',
          badge: '360° Square Edge · Anti-PCO',
          packshot: 'assets/img/packshots/authentic_emv_toric.png',
          accent: '#f59e0b',
          tags: ['all', 'monofocal'],
          keywords: ['hydrophobic', '800c', 'pco', 'square edge'],
          detailSlide: 1,
          iolStage: 4
        },
        {
          id: 'sulcoflex-trifocal',
          code: '703F',
          brand: 'RAYNER UK',
          kicker: '2026 / RAYNER UK / CILIARY SULCUS DUET / IOL',
          title: 'SULCOFLEX\nTRIFOCAL',
          emboss: 'SULCOFLEX DUET',
          subtitle: 'Reversible pseudophakic supplementary lens converting any monofocal into full-range trifocal vision.',
          desc: 'LARGE 6.5 MM UNDULATING ROUND-EDGE SULCUS OPTIC WITH 10° POSTERIOR ANGULATED HAPTICS FOR REVERSIBLE TRIFOCAL UPGRADES.',
          badge: 'Reversible Duet · 6.5 mm Optic',
          packshot: 'assets/img/packshots/authentic_sulcoflex.png',
          accent: '#f43f5e',
          tags: ['all', 'sulcoflex', 'trifocal'],
          keywords: ['sulcoflex', 'supplementary', 'duet', 'sulcus', '703f'],
          detailSlide: 1,
          iolStage: 5
        }
      ]
    },

    // ========================================================================
    // SUBPAGE 2: OPHTHALMIC SOLUTIONS & VERIFIED OVDs (Ophteis OVDs & AEON Eye Solutions)
    // ========================================================================
    2: {
      subpageTitle: 'OPHTHALMIC SOLUTIONS & VERIFIED OVDs · OPHTEIS® & AEON™',
      prompt: 'WHAT ARE YOU LOOKING FOR?',
      filters: [
        { label: 'ALL OPHTHALMIC SOLUTIONS', slug: 'all' },
        { label: 'VERIFIED OVDs (OPHTEIS®)', slug: 'ovd' },
        { label: 'OPHTHALMIC EYE SOLUTIONS (AEON™)', slug: 'aeon' },
        { label: 'DISPERSIVE PROTECTION', slug: 'dispersive' },
        { label: 'OCULAR SURFACE CARE', slug: 'dryeye' }
      ],
      items: [
        {
          id: 'ophteis-bio-30',
          code: 'OPH-30',
          brand: 'OPHTEIS® OVD',
          kicker: '2026 / RAYNER UK / 3.0% SODIUM HYALURONATE / OVD',
          title: 'OPHTEIS\nBIO 3.0',
          emboss: 'OPHTEIS BIO 3.0',
          subtitle: 'High-viscosity cohesive space maintenance and superior capsulorhexis control.',
          desc: 'ULTRA-PURE BIO-FERMENTED 3.0% SODIUM HYALURONATE OVD ENGINEERED FOR ANTERIOR CHAMBER STABILITY AND RAPID POST-IOL ASPIRATION.',
          badge: '3.0% NaHA · 85,000 mPa·s',
          packshot: 'assets/img/packshots/ophteis_cohesive_clean.png',
          accent: '#f43f5e',
          tags: ['all', 'ovd'],
          keywords: ['ophteis', 'bio 3.0', 'ovd', 'viscoelastic', 'cohesive'],
          detailSlide: 2,
          medStage: 0,
          ophteisIdx: 0
        },
        {
          id: 'ophteis-bio-18',
          code: 'OPH-18',
          brand: 'OPHTEIS® OVD',
          kicker: '2026 / RAYNER UK / 1.8% SODIUM HYALURONATE / OVD',
          title: 'OPHTEIS\nBIO 1.8',
          emboss: 'OPHTEIS BIO 1.8',
          subtitle: 'Versatile cohesive OVD balancing chamber maintenance and smooth preloaded IOL injection.',
          desc: 'BALANCED RHEOLOGICAL PROFILE FOR ROUTINE AND COMPLEX PHACOEMULSIFICATION WITH ZERO ANIMAL-DERIVED PROTEINS.',
          badge: '1.8% NaHA · 60,000 mPa·s',
          packshot: 'assets/img/packshots/ophteis_adaptive_clean.png',
          accent: '#00e5ff',
          tags: ['all', 'ovd'],
          keywords: ['ophteis', '1.8', 'ovd', 'routine'],
          detailSlide: 2,
          medStage: 0,
          ophteisIdx: 1
        },
        {
          id: 'ophteis-max',
          code: 'OPH-MAX',
          brand: 'OPHTEIS® OVD',
          kicker: '2026 / RAYNER UK / 2.0% HPMC DISPERSIVE / OVD',
          title: 'OPHTEIS\nMAX HPMC',
          emboss: 'ENDOTHELIAL SHIELD',
          subtitle: 'Persistent dispersive endothelial coating shield during ultrasonic phacoemulsification.',
          desc: 'DISPERSIVE 2.0% HPMC FORMULATION THAT ADHERES TO CORNEAL ENDOTHELIAL CELLS TO MINIMIZE ULTRASONIC TURBULENCE TRAUMA.',
          badge: '2.0% HPMC · Endothelial Shield',
          packshot: 'assets/img/packshots/ophteis_dispersive_clean.png',
          accent: '#10b981',
          tags: ['all', 'ovd', 'dispersive'],
          keywords: ['max', 'hpmc', 'dispersive', 'endothelial'],
          detailSlide: 2,
          medStage: 0,
          ophteisIdx: 3
        },
        {
          id: 'aeon-protect-plus',
          code: 'AEON-PP',
          brand: 'AEON™ EYE CARE',
          kicker: '2026 / RAYNER UK / 0.30% CROSS-LINKED HA + PEG / DROPS',
          title: 'AEON\nPROTECT PLUS',
          emboss: 'AEON PROTECT+',
          subtitle: 'Extended corneal residence time for pre- and post-cataract ocular surface optimization.',
          desc: 'PRESERVATIVE-FREE 0.30% CROSS-LINKED SODIUM HYALURONATE + PEG 400 ENGINEERED FOR POST-SURGICAL TEAR FILM RECOVERY.',
          badge: '0.30% Cross-Linked HA · PF',
          packshot: 'assets/img/packshots/aeon_protect_plus.png',
          accent: '#a855f7',
          tags: ['all', 'aeon', 'dryeye'],
          keywords: ['aeon', 'protect plus', 'cross-linked', 'post-op', 'drops'],
          detailSlide: 2,
          medStage: 1,
          aeonIdx: 0
        },
        {
          id: 'aeon-protect',
          code: 'AEON-PR',
          brand: 'AEON™ EYE CARE',
          kicker: '2026 / RAYNER UK / 0.15% HA + VITAMINS A & E / DROPS',
          title: 'AEON\nPROTECT',
          emboss: 'VITAMIN A + E',
          subtitle: 'Pre-surgical tear film stabilization to improve biometry & topography accuracy.',
          desc: 'ISOTONIC OPHTHALMIC SOLUTION ENRICHED WITH VITAMIN A AND VITAMIN E TO RESTORE MUCIN AND LIPID LAYER INTEGRITY.',
          badge: '0.15% HA + Vit A/E · Biometry',
          packshot: 'assets/img/packshots/aeon_protect.png',
          accent: '#38bdf8',
          tags: ['all', 'aeon'],
          keywords: ['aeon', 'protect', 'vitamin', 'biometry'],
          detailSlide: 2,
          medStage: 1,
          aeonIdx: 1
        },
        {
          id: 'aeon-repair',
          code: 'AEON-RP',
          brand: 'AEON™ EYE CARE',
          kicker: '2026 / RAYNER UK / EPITHELIAL REGENERATION / DROPS',
          title: 'AEON\nREPAIR',
          emboss: 'CORNEAL REPAIR',
          subtitle: 'Intensive post-refractive & corneal epithelial recovery matrix with Vitamin B12.',
          desc: 'HIGH-POTENCY REGENERATIVE MATRIX ACCELERATING CORNEAL RE-EPITHELIALIZATION AND NEURO-SENSORY RECOVERY.',
          badge: '0.20% HA + B12 · Regenerative',
          packshot: 'assets/img/packshots/aeon_repair.png',
          accent: '#fb7185',
          tags: ['all', 'aeon', 'dryeye'],
          keywords: ['aeon', 'repair', 'b12', 'epithelial'],
          detailSlide: 2,
          medStage: 1,
          aeonIdx: 2
        }
      ]
    },

    // ========================================================================
    // SUBPAGE 3: FUTURE PORTFOLIO DEVELOPMENT (Strategic Possibilities)
    // ========================================================================
    3: {
      subpageTitle: 'FUTURE PORTFOLIO DEVELOPMENT · STRATEGIC POSSIBILITIES',
      prompt: 'STRATEGIC DEVELOPMENT AREAS:',
      filters: [
        { label: 'ALL STRATEGIC POSSIBILITIES', slug: 'all' },
        { label: 'COMPLEMENTARY MEDICAL DEVICES', slug: 'devices-dev' },
        { label: 'PHARMACEUTICAL OPPORTUNITIES', slug: 'pharma-dev' },
        { label: 'DIAGNOSTIC TECHNOLOGIES', slug: 'diagnostics-dev' },
        { label: 'HOSPITAL SUPPLIES & EQUIPMENT', slug: 'equipment-dev' }
      ],
      items: [
        {
          id: 'future-medical-devices',
          code: 'DEV-01',
          brand: 'FUTURE PORTFOLIO',
          kicker: 'STRATEGIC POSSIBILITY / SUBJECT TO AUTHORIZATIONS',
          title: 'MEDICAL\nDEVICES',
          emboss: 'STRATEGIC PIPELINE',
          subtitle: 'Exploring complementary medical devices and surgical technologies — strategic possibilities subject to applicable authorizations and supplier rights.',
          desc: 'STRATEGIC EXPLORATION OF COMPLEMENTARY MEDICAL DEVICES AND SPECIALTY SURGICAL TECHNOLOGIES FOR PHILIPPINE HEALTHCARE INSTITUTIONS, SUBJECT TO LOCAL REGULATORY STATUS AND SUPPLIER RIGHTS.',
          badge: 'Strategic Possibility · Subject to Authorizations',
          packshot: 'assets/img/packshots/authentic_emv.png',
          accent: '#00e5ff',
          tags: ['all', 'devices-dev'],
          keywords: ['devices', 'medical', 'complementary', 'future', 'strategic'],
          detailSlide: 3
        },
        {
          id: 'future-pharmaceuticals',
          code: 'DEV-02',
          brand: 'FUTURE PORTFOLIO',
          kicker: 'STRATEGIC POSSIBILITY / SUBJECT TO AUTHORIZATIONS',
          title: 'PHARMACEUTICAL\nPIPELINE',
          emboss: 'FUTURE PHARMA',
          subtitle: 'Exploring future pharmaceutical opportunities — strategic possibilities, not current licensed offerings, subject to applicable regulatory authorizations.',
          desc: 'FUTURE PORTFOLIO DEVELOPMENT EXPLORING SPECIALTY AND THERAPEUTIC PHARMACEUTICAL OPPORTUNITIES SUBJECT TO APPLICABLE PHILIPPINE FDA AUTHORIZATIONS AND SUPPLIER AGREEMENTS.',
          badge: 'Strategic Possibility · Not Current Licensed Offering',
          packshot: 'assets/img/packshots/aeon_protect_plus.png',
          accent: '#a855f7',
          tags: ['all', 'pharma-dev'],
          keywords: ['pharmaceutical', 'pharma', 'pipeline', 'future', 'authorizations'],
          detailSlide: 3
        },
        {
          id: 'future-diagnostics',
          code: 'DEV-03',
          brand: 'FUTURE PORTFOLIO',
          kicker: 'STRATEGIC POSSIBILITY / SUBJECT TO AUTHORIZATIONS',
          title: 'DIAGNOSTIC\nOPPORTUNITIES',
          emboss: 'FUTURE DIAGNOSTICS',
          subtitle: 'Exploring clinical and specialty diagnostic opportunities — strategic possibilities subject to applicable authorizations.',
          desc: 'EVALUATING COMPLEMENTARY DIAGNOSTIC TECHNOLOGIES AND CLINICAL SCREENING PLATFORMS AS FUTURE PORTFOLIO DEVELOPMENT POSSIBILITIES SUBJECT TO APPLICABLE AUTHORIZATIONS.',
          badge: 'Strategic Possibility · Subject to Authorizations',
          packshot: 'assets/img/packshots/authentic_trifocal_toric.png',
          accent: '#10b981',
          tags: ['all', 'diagnostics-dev'],
          keywords: ['diagnostics', 'diagnostic', 'screening', 'future'],
          detailSlide: 3
        },
        {
          id: 'future-hospital-equipment',
          code: 'DEV-04',
          brand: 'FUTURE PORTFOLIO',
          kicker: 'STRATEGIC POSSIBILITY / SUBJECT TO AUTHORIZATIONS',
          title: 'HOSPITAL SUPPLIES\n& EQUIPMENT',
          emboss: 'HOSPITAL SUPPLIES',
          subtitle: 'Exploring hospital supplies and medical equipment — strategic possibilities subject to applicable authorizations and supplier rights.',
          desc: 'STRATEGIC ASSESSMENT OF INSTITUTIONAL HOSPITAL SUPPLIES AND CLINICAL EQUIPMENT OPPORTUNITIES FOR FUTURE COMMERCIALIZATION SUBJECT TO APPLICABLE AUTHORIZATIONS.',
          badge: 'Strategic Possibility · Subject to Authorizations',
          packshot: 'assets/img/packshots/authentic_aspheric.png',
          accent: '#f59e0b',
          tags: ['all', 'equipment-dev'],
          keywords: ['hospital', 'supplies', 'equipment', 'future'],
          detailSlide: 3
        }
      ]
    },

    // ========================================================================
    // SUBPAGE 4: PRODUCT CATALOGS (Clinical Monographs & Technical Dossiers)
    // ========================================================================
    4: {
      subpageTitle: 'PRODUCT CATALOGS · CLINICAL MONOGRAPHS',
      prompt: 'WHAT ARE YOU LOOKING FOR?',
      filters: [
        { label: 'ALL PUBLICATIONS', slug: 'all' },
        { label: 'IOL CLINICAL COMPENDIUM', slug: 'iol-cat' },
        { label: 'OVD & DRY EYE MONOGRAPHS', slug: 'pharma-cat' },
        { label: 'SURGICAL NOMOGRAMS', slug: 'nomogram' }
      ],
      items: [
        {
          id: 'cat-rayone-compendium',
          code: 'DOC-01',
          brand: 'CLINICAL COMPENDIUM',
          kicker: '2026 / RAYNER UK / 18-PAGE TECHNICAL DOSSIER / PDF',
          title: 'RAYONE IOL\nCOMPENDIUM',
          emboss: 'COMPENDIUM 26',
          subtitle: 'Complete A-constants, diopter ranges, MTF curves, and injector preparation guide.',
          desc: '18-PAGE CLINICAL BROCHURE COVERING RAYONE EMV, TRIFOCAL, TRIFOCAL TORIC, ASPHERIC, HYDROPHOBIC, AND SULCOFLEX.',
          badge: '18-Page Interactive Brochure',
          packshot: 'assets/img/packshots/authentic_emv.png',
          accent: '#00e5ff',
          tags: ['all', 'iol-cat'],
          keywords: ['brochure', 'compendium', 'catalog', 'rayone'],
          detailSlide: 4,
          openBrochure: true
        },
        {
          id: 'cat-emv-monograph',
          code: 'DOC-02',
          brand: 'CLINICAL MONOGRAPH',
          kicker: '2026 / PROF. GRAHAM BARRETT / DEFOCUS CURVES / STUDY',
          title: 'EMV CLINICAL\nMONOGRAPH',
          emboss: 'BARRETT EMV',
          subtitle: 'Multi-center clinical registry outcomes, binocular defocus curves, and emmetropia targeting.',
          desc: 'CLINICAL NOMOGRAMS AND PEER-REVIEWED VISUAL ACUITY RESULTS FOR ENHANCED MONOVISION SURGERY.',
          badge: 'Clinical Study · Defocus Curves',
          packshot: 'assets/img/packshots/authentic_trifocal.png',
          accent: '#a855f7',
          tags: ['all', 'iol-cat', 'nomogram'],
          keywords: ['monograph', 'emv', 'barrett', 'defocus'],
          detailSlide: 4,
          openBrochure: true
        },
        {
          id: 'cat-ophteis-dossier',
          code: 'DOC-03',
          brand: 'RHEOLOGY DOSSIER',
          kicker: '2026 / RAYNER UK / SHEAR-VISCOSITY CURVES / DOSSIER',
          title: 'OPHTEIS OVD\nDOSSIER',
          emboss: 'OVD RHEOLOGY',
          subtitle: 'Zero-shear viscosity curves, molecular weight distribution, and endothelial protection data.',
          desc: 'TECHNICAL COMPARISON OF BIO-FERMENTED SODIUM HYALURONATE AND HPMC DISPERSIVE VISCOELASTICS.',
          badge: 'Rheology & Safety Dossier',
          packshot: 'assets/img/packshots/ophteis_cohesive_clean.png',
          accent: '#10b981',
          tags: ['all', 'pharma-cat'],
          keywords: ['ophteis', 'rheology', 'ovd', 'dossier'],
          detailSlide: 4,
          openBrochure: true
        },
        {
          id: 'cat-aeon-protocol',
          code: 'DOC-04',
          brand: 'SURGICAL PROTOCOL',
          kicker: '2026 / MEDIQ PHARMA / PERI-OPERATIVE PROTOCOL / GUIDE',
          title: 'AEON OCULAR\nSURFACE GUIDE',
          emboss: 'AEON PROTOCOL',
          subtitle: 'Standardized pre- and post-operative dry eye management algorithm for cataract surgery.',
          desc: 'CLINICAL DECISION MATRIX FOR AEON PROTECT, AEON PROTECT PLUS, AND AEON REPAIR.',
          badge: 'Peri-Operative Protocol Guide',
          packshot: 'assets/img/packshots/aeon_protect_plus.png',
          accent: '#f43f5e',
          tags: ['all', 'pharma-cat', 'nomogram'],
          keywords: ['aeon', 'protocol', 'dry eye', 'guide'],
          detailSlide: 4,
          openBrochure: true
        }
      ]
    }
  };

  // ============================================================================
  // ACTIVE THEORY RANDOM-DIGIT SCRAMBLE ("0123456789")
  // ============================================================================
  const SCRAMBLE_DIGITS = '0123456789';

  function scrambleStringWithDigits(targetStr, progress) {
    if (progress >= 1) return targetStr;
    if (progress <= 0) return '';
    const totalLen = targetStr.length;
    const visibleLen = Math.max(1, Math.floor(totalLen * Math.min(1, progress * 1.15)));
    const lockIndex = Math.floor(totalLen * Math.max(0, (progress - 0.18) / 0.82));
    let out = '';
    for (let i = 0; i < visibleLen; i++) {
      const ch = targetStr[i];
      if (ch === ' ' || ch === '\n') {
        out += ch;
      } else if (i < lockIndex) {
        out += ch;
      } else if (i < 2 && targetStr.startsWith('->')) {
        out += ch;
      } else {
        out += SCRAMBLE_DIGITS[Math.floor(Math.random() * 10)];
      }
    }
    return out;
  }

  function animateScrambleElement(el, finalText, durationMs = 600, delayMs = 0, onDone) {
    if (!el) return;
    if (el._scrambleTimer) clearTimeout(el._scrambleTimer);
    if (el._scrambleIv) clearInterval(el._scrambleIv);
    el.textContent = '';

    const startTimer = setTimeout(() => {
      const t0 = performance.now();
      el._scrambleIv = setInterval(() => {
        const elapsed = performance.now() - t0;
        const p = Math.min(1, elapsed / durationMs);
        const eased = 1 - Math.pow(1 - p, 2);
        el.textContent = scrambleStringWithDigits(finalText, eased);
        if (p >= 1) {
          clearInterval(el._scrambleIv);
          el._scrambleIv = null;
          el.textContent = finalText;
          if (typeof onDone === 'function') onDone();
        }
      }, 28);
    }, delayMs);
    el._scrambleTimer = startTimer;
  }

  // ============================================================================
  // PROGRESSIVE LEFT-TO-RIGHT KINETIC GLITCH GENERATOR (00:00 - 00:16 in video)
  // - Stage A (absRel < 0.06): 100% clean text ("CHILE 20", "E.C.H.O.", "PAPER PLANES")
  // - Stage B (0.06 <= absRel < 0.24): Left 78% clean, trailing right characters doubled/sliced ("CHILE 200", "E.C.H.O..", "SECRET|")
  // - Stage C (absRel >= 0.24): Full doubled characters ("PPAAPPEERR\nPPLLAANNEESS", "FFRROONNTTIIEERR\nWWIITTHHIINN")
  // ============================================================================
  function buildProgressiveGlitchText(text, absRel) {
    if (absRel < 0.06) return text;
    const lines = String(text || '').split('\n');

    // Stage B: Near-center settling — only trailing 1-2 chars on the right edge of each line stutter/slice
    if (absRel < 0.24) {
      const cleanFraction = Math.max(0.55, 1 - (absRel - 0.06) / 0.22);
      return lines
        .map((line) => {
          const splitIdx = Math.max(1, Math.floor(line.length * cleanFraction));
          const cleanPart = line.slice(0, splitIdx);
          const tailPart = line.slice(splitIdx);
          let glitchedTail = '';
          for (let i = 0; i < tailPart.length; i++) {
            const ch = tailPart[i];
            glitchedTail += ch === ' ' ? ' ' : ch + ch;
          }
          if (absRel > 0.12 && tailPart.length > 0) {
            glitchedTail += '|';
          }
          return cleanPart + glitchedTail;
        })
        .join('\n');
    }

    // Stage C & D: Side-wing / Mid-orbit — every non-space character is doubled ("PPAAPPEERR PPLLAANNEESS")
    return lines
      .map((line) => {
        let out = '';
        for (let i = 0; i < line.length; i++) {
          const ch = line[i];
          out += ch === ' ' ? '  ' : ch + ch;
        }
        return out;
      })
      .join('\n');
  }

  // ============================================================================
  // MOUNT DOM STAGE INSIDE #products
  // ============================================================================
  const prodSec = document.getElementById('products');
  if (!prodSec) return;

  let host = document.getElementById('at-products-work-stage');
  if (!host) {
    host = document.createElement('div');
    host.id = 'at-products-work-stage';
    host.className = 'at-work-stage is-hidden';
    host.setAttribute('aria-label', 'Interactive 3D Product Showcase');
    prodSec.appendChild(host);
  }

  host.innerHTML = `
    <!-- 1. Diagonal Atmospheric Dust & Streak Canvas (Behind everything) -->
    <canvas id="at-work-bg-dust-canvas" class="at-work-bg-dust-canvas" aria-hidden="true"></canvas>

    <!-- 2. 3D Perspective Viewport: Contains Both the Central 3D Spine Plane (Z = 0) and 3D Cards (Z > 0 & Z < 0) -->
    <div id="at-work-viewport" class="at-work-viewport">
      <div id="at-work-helix-world" class="at-work-helix-world">
        <!-- Central 3D Biomechanical / Iridescent Spine + 3D Crystal Shards at Z = 0px -->
        <div id="at-work-spine-plane" class="at-work-spine-plane" aria-hidden="true">
          <canvas id="at-work-vortex-canvas" class="at-work-vortex-canvas"></canvas>
        </div>
        <!-- 3D Cards Container -->
        <div id="at-work-cards-mount" style="transform-style: preserve-3d; -webkit-transform-style: preserve-3d;"></div>
      </div>
    </div>

    <!-- 3. Centered 16:10 Landscape Detail Stage (00:11 - 00:15 "DAY 1 CLUB" in video) -->
    <div id="at-work-detail-drawer" class="at-work-detail-drawer is-hidden" aria-live="polite"></div>

    <!-- 5. Floating Return Button when inspecting full 360° 3D Box Stage -->
    <button type="button" id="at-work-back-spiral-btn" class="at-work-back-spiral-btn is-hidden">
      <span>&lt;- BACK TO 3D SPIRAL</span>
    </button>

    <!-- 6. Bottom-Left "WHAT ARE YOU LOOKING FOR?" ChatDOM Terminal -->
    <div id="at-chat-wrapper" class="at-chat-wrapper">
      <div id="at-chat-messages" class="at-chat-messages" role="log" aria-live="polite"></div>
      <form id="at-chat-form" class="at-chat-input-form" autocomplete="off">
        <input
          id="at-chat-input"
          type="text"
          class="at-chat-input"
          placeholder="ASK ME ANYTHING..."
          aria-label="Ask about any MediQ product or filter"
        />
      </form>
    </div>
  `;

  // References
  const bgDustCanvas = document.getElementById('at-work-bg-dust-canvas');
  const vortexCanvas = document.getElementById('at-work-vortex-canvas');
  const spinePlaneEl = document.getElementById('at-work-spine-plane');
  const viewportEl = document.getElementById('at-work-viewport');
  const cardsMountEl = document.getElementById('at-work-cards-mount');
  const detailDrawerEl = document.getElementById('at-work-detail-drawer');
  const kickerEl = document.getElementById('at-work-kicker');
  const counterCurEl = document.getElementById('at-work-counter-cur');
  const counterTotEl = document.getElementById('at-work-counter-tot');
  const backSpiralBtn = document.getElementById('at-work-back-spiral-btn');
  const chatMessages = document.getElementById('at-chat-messages');
  const chatForm = document.getElementById('at-chat-form');
  const chatInput = document.getElementById('at-chat-input');

  // State
  let activeSubpage = 0; // 0 = overview, 1..4 = subpages
  let currentFilter = 'all';
  let visibleItems = [];
  let cardObjs = [];
  let scrollTarget = 0;
  let scrollCurrent = 0;
  let detailMode = false; // true = centered 16:10 showcase frame (00:11 - 00:15)
  let box3dMode = false;  // true = inspecting underlying 360° 3D box on Slides 1/2
  let activeDetailItem = null;
  let vortexBoost = 0;
  let vortexAngle = 0;
  let filterTransitioning = false;

  // ============================================================================
  // 1. CENTRAL 3D BIOMECHANICAL / IRIDESCENT SPINE + 320 FACETED CRYSTAL SHARDS
  // ============================================================================
  const bgCtx = bgDustCanvas ? bgDustCanvas.getContext('2d') : null;
  const vCtx = vortexCanvas ? vortexCanvas.getContext('2d') : null;
  let vw = window.innerWidth;
  let vh = window.innerHeight;
  let vdpr = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvases() {
    vdpr = Math.min(window.devicePixelRatio || 1, 2);
    vw = host.clientWidth || prodSec.clientWidth || window.innerWidth;
    vh = host.clientHeight || (prodSec.clientHeight - 128) || (window.innerHeight - 128);
    if (spinePlaneEl) {
      spinePlaneEl.style.width = vw + 'px';
      spinePlaneEl.style.height = vh + 'px';
    }
    [bgDustCanvas, vortexCanvas].forEach((c) => {
      if (!c) return;
      c.width = Math.floor(vw * vdpr);
      c.height = Math.floor(vh * vdpr);
      c.style.width = vw + 'px';
      c.style.height = vh + 'px';
    });
  }
  resizeCanvases();
  window.addEventListener('resize', resizeCanvases, { passive: true });

  // 420 3D Faceted Triangular Shards orbiting the central spine (like 00:00 - 00:10)
  const SHARD_COUNT = 420;
  const shards = Array.from({ length: SHARD_COUNT }, (_, i) => {
    const frac = i / SHARD_COUNT;
    const isCoreCluster = i < 270; // Dense cluster hugging the central spine
    return {
      baseAngle: frac * Math.PI * 26 + Math.random() * 1.5,
      yNorm: (frac - 0.5) * 2.2,
      radius: isCoreCluster
        ? 22 + Math.pow(Math.random(), 1.45) * 125
        : 135 + Math.random() * 310,
      size: isCoreCluster ? 2.4 + Math.random() * 6.2 : 1.6 + Math.random() * 4.0,
      speedOffset: 0.45 + Math.random() * 0.95,
      spinSpeed: (Math.random() - 0.5) * 0.08,
      spinPhase: Math.random() * Math.PI * 2,
      hueType: i % 6 // 0: cyan, 1: magenta/rose, 2: violet, 3: emerald, 4: gold, 5: ice-silver
    };
  });

  // 220 Multi-Colored Lower-Spine Disintegration Confetti Pixels (seen at bottom of spine in screenshot & video)
  const LOWER_CONFETTI_COUNT = 220;
  const lowerConfetti = Array.from({ length: LOWER_CONFETTI_COUNT }, (_, i) => {
    const spreadRight = Math.random() < 0.72; // Mostly billowing to the right of the lower spine as in screenshot
    return {
      angle: Math.random() * Math.PI * 2,
      distX: (spreadRight ? 1 : -0.65) * (12 + Math.pow(Math.random(), 1.25) * 230),
      yFrac: 0.62 + Math.random() * 0.37, // Bottom 38% of viewport height
      zOffset: (Math.random() - 0.45) * 190,
      size: 2.0 + Math.random() * 4.6,
      driftSpeed: 0.35 + Math.random() * 0.85,
      colorIdx: i % 6
    };
  });
  const CONFETTI_COLORS = [
    '#10b981', // emerald
    '#facc15', // gold
    '#f43f5e', // crimson/magenta
    '#06b6d4', // cyan
    '#a855f7', // violet
    '#fb923c'  // coral-amber
  ];

  // 75 Diagonal Atmospheric Dust Streaks (visible in both spiral & detail view 00:11 - 00:15)
  const DUST_COUNT = 75;
  const dustStreaks = Array.from({ length: DUST_COUNT }, () => ({
    x: Math.random(),
    y: Math.random(),
    len: 8 + Math.random() * 22,
    speed: 0.0004 + Math.random() * 0.0009,
    alpha: 0.08 + Math.random() * 0.28,
    size: 0.8 + Math.random() * 1.6
  }));

  // Draw the central 3D biomechanical / iridescent vertebral spine column + shards
  function drawCentralSpineAndShards(scrollVel) {
    if (bgCtx) {
      bgCtx.save();
      bgCtx.setTransform(vdpr, 0, 0, vdpr, 0, 0);
      bgCtx.clearRect(0, 0, vw, vh);

      // Diagonal atmospheric dust streaks (like 00:00 - 00:15)
      for (let i = 0; i < DUST_COUNT; i++) {
        const d = dustStreaks[i];
        d.x = (d.x - d.speed + 1) % 1;
        d.y = (d.y + d.speed * 0.65) % 1;
        const sx = d.x * vw;
        const sy = d.y * vh;
        bgCtx.strokeStyle = `rgba(210, 225, 255, ${d.alpha.toFixed(3)})`;
        bgCtx.lineWidth = d.size;
        bgCtx.beginPath();
        bgCtx.moveTo(sx, sy);
        bgCtx.lineTo(sx - d.len * 0.6, sy + d.len * 0.4);
        bgCtx.stroke();
      }
      bgCtx.restore();
    }

    if (!vCtx || detailMode || box3dMode) {
      if (vCtx) vCtx.clearRect(0, 0, vortexCanvas.width, vortexCanvas.height);
      return;
    }

    vCtx.save();
    vCtx.setTransform(vdpr, 0, 0, vdpr, 0, 0);
    vCtx.clearRect(0, 0, vw, vh);

    const cx = vw * 0.5;
    const cy = vh * 0.5;
    const fov = 700;

    // 1. Back-half shards (pz < 0)
    drawShardLayer(vCtx, cx, cy, fov, true);

    // 2. Central 3D Biomechanical / Iridescent Vertebral Spine Column (22 stacked 3D segments)
    const segCount = 22;
    const segStepY = (vh + 220) / segCount;
    const verticalScrollShift = ((scrollCurrent * 145) % segStepY + segStepY) % segStepY;

    // Subtle central dark metallic core aura
    const coreGlow = vCtx.createLinearGradient(cx - 85, 0, cx + 85, 0);
    coreGlow.addColorStop(0, 'rgba(0, 0, 0, 0)');
    coreGlow.addColorStop(0.32, 'rgba(18, 12, 36, 0.55)');
    coreGlow.addColorStop(0.5, 'rgba(6, 8, 18, 0.92)');
    coreGlow.addColorStop(0.68, 'rgba(12, 28, 46, 0.55)');
    coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    vCtx.fillStyle = coreGlow;
    vCtx.fillRect(cx - 85, 0, 170, vh);

    for (let s = -1; s <= segCount; s++) {
      const sy = s * segStepY - 90 - verticalScrollShift;
      const worldSegIndex = s + Math.floor(scrollCurrent * 145 / segStepY);
      const baseRot = vortexAngle * 1.4 - scrollCurrent * 1.85 + worldSegIndex * 0.52;

      // Each vertebra has 4 radial sculptural fins rotating in 3D around the Y axis
      const finCount = 4;
      const fins = [];
      for (let f = 0; f < finCount; f++) {
        const a = baseRot + (f * Math.PI * 2) / finCount;
        fins.push({
          a,
          nx: Math.sin(a),
          nz: Math.cos(a),
          fIdx: f
        });
      }
      // Painter's sort fins back-to-front by nz
      fins.sort((a, b) => a.nz - b.nz);

      // Draw central vertebral disc / core cylinder ring (wider toward upper spine as in screenshot)
      const yTaper = sy < cy ? 1.24 - Math.max(0, sy / cy) * 0.22 : 1.0 - Math.min(0.32, ((sy - cy) / cy) * 0.35);
      const discW = (40 + Math.sin(worldSegIndex * 0.7) * 8) * yTaper;
      const discH = segStepY * 0.62;
      const coreGrad = vCtx.createLinearGradient(cx - discW, sy, cx + discW, sy);
      coreGrad.addColorStop(0, '#070913');
      coreGrad.addColorStop(0.28, '#283150');
      coreGrad.addColorStop(0.52, '#0d101f');
      coreGrad.addColorStop(0.78, '#40265e');
      coreGrad.addColorStop(1, '#060811');

      vCtx.fillStyle = coreGrad;
      vCtx.beginPath();
      vCtx.ellipse(cx, sy, discW, discH * 0.52, 0, 0, Math.PI * 2);
      vCtx.fill();

      // Draw each 3D sculptural fin/wing of the vertebra
      for (let f = 0; f < fins.length; f++) {
        const fin = fins[f];
        const reachX = fin.nx * (64 + (worldSegIndex % 3) * 13 + vortexBoost * 12) * yTaper;
        const depthScale = 0.76 + (fin.nz + 1) * 0.26;
        const wingH = (14 + (f % 2) * 7) * depthScale * yTaper;
        const tiltY = Math.cos(fin.a * 2) * 10;

        // Iridescent metallic shader colors based on 3D normal (cyan / magenta / violet / emerald)
        let rimColor = 'rgba(0, 240, 255, 0.82)';
        let bodyStop = 'rgba(26, 78, 118, 0.9)';
        if (fin.fIdx === 1) {
          rimColor = 'rgba(255, 42, 138, 0.82)';
          bodyStop = 'rgba(88, 22, 68, 0.9)';
        } else if (fin.fIdx === 2) {
          rimColor = 'rgba(168, 85, 247, 0.82)';
          bodyStop = 'rgba(54, 28, 98, 0.9)';
        } else if (fin.fIdx === 3) {
          rimColor = 'rgba(52, 211, 153, 0.78)';
          bodyStop = 'rgba(20, 68, 66, 0.9)';
        }

        const finGrad = vCtx.createLinearGradient(cx, sy - wingH, cx + reachX, sy + wingH);
        finGrad.addColorStop(0, '#090b16');
        finGrad.addColorStop(0.55, bodyStop);
        finGrad.addColorStop(0.92, rimColor);
        finGrad.addColorStop(1, '#ffffff');

        vCtx.fillStyle = finGrad;
        vCtx.beginPath();
        vCtx.moveTo(cx - fin.nx * 12, sy - wingH * 0.65);
        vCtx.quadraticCurveTo(
          cx + reachX * 0.65,
          sy - wingH * 1.18 + tiltY,
          cx + reachX,
          sy + tiltY * 0.6
        );
        vCtx.quadraticCurveTo(
          cx + reachX * 0.55,
          sy + wingH * 1.08 + tiltY,
          cx - fin.nx * 10,
          sy + wingH * 0.55
        );
        vCtx.closePath();
        vCtx.fill();

        // Specular chrome ridge line on foreground fins
        if (fin.nz > -0.15) {
          vCtx.strokeStyle = fin.nz > 0.35 ? 'rgba(240, 250, 255, 0.78)' : rimColor;
          vCtx.lineWidth = fin.nz > 0.35 ? 1.5 : 0.95;
          vCtx.beginPath();
          vCtx.moveTo(cx, sy - wingH * 0.3);
          vCtx.quadraticCurveTo(cx + reachX * 0.6, sy - wingH * 0.8 + tiltY, cx + reachX, sy + tiltY * 0.6);
          vCtx.stroke();
        }
      }
    }

    // 3. Metallic Wireframe Pedestal Cage at the Bottom of the Spine (visible at end of helix in 00:02 of video)
    const maxCardIdx = Math.max(1, visibleItems.length - 1);
    if (scrollCurrent > maxCardIdx - 0.85) {
      const endProgress = Math.min(1, (scrollCurrent - (maxCardIdx - 0.85)) / 0.85);
      const pedTopY = vh - endProgress * (vh * 0.42);
      const pedW = 92;
      vCtx.save();
      vCtx.strokeStyle = `rgba(140, 175, 220, ${(0.38 * endProgress).toFixed(3)})`;
      vCtx.lineWidth = 1.1;
      for (let r = -3; r <= 3; r++) {
        const rx = cx + r * (pedW / 3) * Math.cos(vortexAngle * 0.5 + r * 0.3);
        vCtx.beginPath();
        vCtx.moveTo(rx, pedTopY);
        vCtx.lineTo(rx + r * 4, vh + 20);
        vCtx.stroke();
      }
      for (let ring = 0; ring < 4; ring++) {
        const ry = pedTopY + ring * 44;
        if (ry > vh + 20) continue;
        vCtx.beginPath();
        vCtx.ellipse(cx, ry, pedW + ring * 6, 12, 0, 0, Math.PI * 2);
        vCtx.stroke();
      }
      vCtx.restore();
    }

    // 4. Lower-Spine Multi-Colored Disintegration Confetti Pixels (matches bottom of spine in screenshot)
    for (let i = 0; i < LOWER_CONFETTI_COUNT; i++) {
      const c = lowerConfetti[i];
      const sw = vortexAngle * c.driftSpeed - scrollCurrent * 0.65;
      const px = cx + c.distX + Math.sin(c.angle + sw) * (18 + vortexBoost * 14);
      const py = ((c.yFrac - (scrollCurrent * 0.08) % 0.36 + 0.36) % 0.36 + 0.62) * vh;
      const alpha = Math.max(0.18, Math.min(0.9, 1 - Math.abs(c.distX) / 260));
      vCtx.save();
      vCtx.translate(px, py);
      vCtx.rotate(c.angle + sw * 1.8);
      vCtx.fillStyle = CONFETTI_COLORS[c.colorIdx];
      vCtx.globalAlpha = alpha;
      const half = c.size * 0.5;
      vCtx.fillRect(-half, -half, c.size, c.size * 0.82);
      vCtx.restore();
    }

    // 4. Front-half 3D faceted crystal shards (pz >= 0)
    drawShardLayer(vCtx, cx, cy, fov, false);

    vCtx.restore();
  }

  function drawShardLayer(ctx, cx, cy, fov, backHalfOnly) {
    for (let i = 0; i < SHARD_COUNT; i++) {
      const p = shards[i];
      const a = p.baseAngle + vortexAngle * p.speedOffset - scrollCurrent * 0.85;
      const r = p.radius * (1 + vortexBoost * 0.25);

      const px = Math.sin(a) * r;
      const pz = Math.cos(a) * r;
      if (backHalfOnly ? pz >= 0 : pz < 0) continue;

      const py = ((p.yNorm - (scrollCurrent * 0.24) % 2.2 + 3.3) % 2.2 - 1.1) * (vh * 0.56);
      const scaleProj = fov / (fov - pz + 260);
      if (scaleProj <= 0.1) continue;

      const sx = cx + px * scaleProj;
      const sy = cy + py * scaleProj;
      const sz = p.size * scaleProj * (1 + vortexBoost * 0.22);

      const depthAlpha = Math.max(0.14, Math.min(0.94, scaleProj * 0.82));
      if (p.hueType === 0) {
        ctx.fillStyle = `rgba(0, 242, 255, ${(depthAlpha * 0.88).toFixed(3)})`;
      } else if (p.hueType === 1) {
        ctx.fillStyle = `rgba(255, 46, 144, ${(depthAlpha * 0.84).toFixed(3)})`;
      } else if (p.hueType === 2) {
        ctx.fillStyle = `rgba(168, 85, 247, ${(depthAlpha * 0.86).toFixed(3)})`;
      } else if (p.hueType === 3) {
        ctx.fillStyle = `rgba(16, 185, 129, ${(depthAlpha * 0.86).toFixed(3)})`;
      } else if (p.hueType === 4) {
        ctx.fillStyle = `rgba(250, 204, 21, ${(depthAlpha * 0.85).toFixed(3)})`;
      } else {
        ctx.fillStyle = `rgba(225, 244, 255, ${(depthAlpha * 0.9).toFixed(3)})`;
      }

      // Draw faceted 3D triangle shard
      const rot = p.spinPhase + vortexAngle * 3.2;
      const c1x = sx + Math.cos(rot) * sz;
      const c1y = sy + Math.sin(rot) * sz;
      const c2x = sx + Math.cos(rot + 2.1) * sz * 0.85;
      const c2y = sy + Math.sin(rot + 2.1) * sz * 0.85;
      const c3x = sx + Math.cos(rot + 4.2) * sz * 0.7;
      const c3y = sy + Math.sin(rot + 4.2) * sz * 0.7;

      ctx.beginPath();
      ctx.moveTo(c1x, c1y);
      ctx.lineTo(c2x, c2y);
      ctx.lineTo(c3x, c3y);
      ctx.closePath();
      ctx.fill();
    }
  }

  // ============================================================================
  // 2. BOTTOM-LEFT ChatDOM CONTROLLER ("WHAT ARE YOU LOOKING FOR?")
  // Follows the exact Sub-Navbar categories:
  //   -> OVERVIEW
  //   -> MEDICAL DEVICES
  //   -> PHARMACEUTICAL
  //   -> DEVICES & EQUIPMENT
  //   -> PRODUCT CATALOGS
  // ============================================================================
  const SUBNAV_ITEMS = [
    { label: 'OVERVIEW', slide: 0 },
    { label: 'MEDICAL DEVICES', slide: 1 },
    { label: 'PHARMACEUTICAL', slide: 2 },
    { label: 'DEVICES & EQUIPMENT', slide: 3 },
    { label: 'PRODUCT CATALOGS', slide: 4 }
  ];

  function clearChatMessages() {
    if (!chatMessages) return;
    Array.from(chatMessages.children).forEach((child) => {
      if (child._scrambleIv) clearInterval(child._scrambleIv);
      if (child._scrambleTimer) clearTimeout(child._scrambleTimer);
    });
    chatMessages.innerHTML = '';
    chatMessages.dataset.menuMode = '';
  }

  function appendChatLine(tag, className, text, opts = {}) {
    if (!chatMessages) return null;
    const el = document.createElement(tag);
    el.className = className;
    if (opts.color) el.style.color = opts.color;
    if (opts.href) el.setAttribute('href', opts.href);
    if (opts.slug) el.setAttribute('data-filter-slug', opts.slug);
    if (typeof opts.slide === 'number') el.setAttribute('data-subnav-slide', String(opts.slide));

    chatMessages.insertBefore(el, chatMessages.firstChild);

    if (opts.animate !== false) {
      animateScrambleElement(el, text, opts.duration || 560, opts.delay || 0, opts.onDone);
    } else {
      el.textContent = text;
    }
    return el;
  }

  function renderSpiralChatMenu(subpageIdx, forceRescramble = false) {
    if (!chatMessages) return;

    // If the sub-navbar menu is already rendered in ChatDOM, simply update the active highlight smoothly
    if (!forceRescramble && chatMessages.dataset.menuMode === 'subnav') {
      chatMessages.querySelectorAll('[data-subnav-slide]').forEach((a) => {
        const sIdx = Number(a.getAttribute('data-subnav-slide'));
        a.classList.toggle('active', sIdx === subpageIdx);
      });
      return;
    }

    clearChatMessages();
    chatMessages.dataset.menuMode = 'subnav';

    appendChatLine('p', 'at-chat-line at-chat-prompt', 'WHAT ARE YOU LOOKING FOR?', {
      color: '#f4f4f4',
      duration: 480,
      delay: 30
    });

    SUBNAV_ITEMS.forEach((navItem, idx) => {
      const isAct = navItem.slide === subpageIdx;
      const a = appendChatLine(
        'a',
        'at-chat-line at-chat-filter' + (isAct ? ' active' : ''),
        `-> ${navItem.label}`,
        {
          slide: navItem.slide,
          duration: 580,
          delay: 90 + idx * 80
        }
      );
      if (a) {
        a.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (detailMode || box3dMode) {
            exitDetailMode(false);
          }
          if (navItem.slide === 0) {
            if (typeof window.goToProductSlide === 'function') {
              window.goToProductSlide(0);
            }
            return;
          }
          if (navItem.slide === activeSubpage && currentFilter === 'all') {
            scrollTarget = 0;
            vortexBoost = 1.25;
            return;
          }
          // Scale out current spiral cards, boost central spine vortex, and switch subpage
          vortexBoost = 1.65;
          cardObjs.forEach((c) => {
            c.el.classList.remove('is-entering');
            c.el.classList.add('is-exiting');
          });
          setTimeout(() => {
            if (typeof window.goToProductSlide === 'function') {
              window.goToProductSlide(navItem.slide);
            } else {
              window.__activateProductsActiveTheory(navItem.slide);
            }
          }, cardObjs.length ? 220 : 10);
        });
      }
    });
  }

  // Detail Mode Chat Brief (Exact 00:11 - 00:15 layout in video)
  function renderDetailChatBrief(item) {
    clearChatMessages();

    appendChatLine('p', 'at-chat-line at-chat-prompt', item.title.replace(/\n/g, ' '), {
      color: '#ffffff',
      duration: 440,
      delay: 20
    });

    appendChatLine('p', 'at-chat-line', item.kicker, {
      color: item.accent || '#f43f5e',
      duration: 540,
      delay: 140
    });

    appendChatLine('p', 'at-chat-line', item.desc, {
      color: '#d4dce8',
      duration: 720,
      delay: 280
    });

    const closeLink = appendChatLine('a', 'at-chat-line at-chat-close', '<- CLOSE', {
      duration: 460,
      delay: 520
    });
    if (closeLink) {
      closeLink.addEventListener('click', (e) => {
        e.preventDefault();
        exitDetailMode(true);
      });
    }
  }

  // Handle "ASK ME ANYTHING..." input
  if (chatInput && chatForm) {
    chatInput.addEventListener('focus', () => chatInput.classList.add('extended'));
    chatInput.addEventListener('blur', () => {
      if (!chatInput.value.trim()) chatInput.classList.remove('extended');
    });

    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = (chatInput.value || '').trim();
      if (!q) return;
      chatInput.value = '';

      const userLine = appendChatLine('p', 'at-chat-line at-chat-user blink', `> ${q.toUpperCase()}`, {
        color: '#00ffff',
        duration: 360,
        delay: 0
      });

      const qLower = q.toLowerCase();
      const cat = CATALOG[activeSubpage] || CATALOG[1];
      let bestItem = null;
      let bestScore = 0;

      const scoreItem = (it) => {
        let s = 0;
        if (it.title.toLowerCase().includes(qLower)) s += 6;
        if (it.subtitle.toLowerCase().includes(qLower)) s += 4;
        if (it.desc.toLowerCase().includes(qLower)) s += 3;
        (it.keywords || []).forEach((kw) => {
          if (qLower.includes(kw) || kw.includes(qLower)) s += 5;
        });
        return s;
      };

      cat.items.forEach((it) => {
        const sc = scoreItem(it);
        if (sc > bestScore) {
          bestScore = sc;
          bestItem = it;
        }
      });

      if (!bestItem) bestItem = visibleItems[0] || cat.items[0];

      setTimeout(() => {
        if (userLine) userLine.classList.remove('blink');
        if (detailMode || box3dMode) exitDetailMode(false);

        const idx = visibleItems.findIndex((x) => x.id === bestItem.id);
        if (idx >= 0) {
          scrollTarget = idx;
        } else {
          applyFilter('all', bestItem.id);
        }

        appendChatLine(
          'p',
          'at-chat-line',
          `MATCHED: ${bestItem.title.replace(/\n/g, ' ')} (${bestItem.code})`,
          { color: '#ffffff', duration: 520, delay: 40 }
        );

        const openMatch = appendChatLine(
          'a',
          'at-chat-line at-chat-action active',
          `-> OPEN ${bestItem.title.replace(/\n/g, ' ')}`,
          { duration: 480, delay: 180 }
        );
        if (openMatch) {
          openMatch.addEventListener('click', (ev) => {
            ev.preventDefault();
            enterDetailMode(bestItem);
          });
        }
      }, 380);
    });
  }

  // ============================================================================
  // 3. WIDE LANDSCAPE SMOKY-GLASS 3D CARDS + KINETIC RGB GLITCH (00:00 - 00:10)
  // ============================================================================
  function buildHelixCards(items) {
    if (!cardsMountEl) return;
    cardsMountEl.innerHTML = '';
    cardObjs = [];

    items.forEach((item, idx) => {
      const card = document.createElement('article');
      card.className = 'at-work-card is-entering';
      card.setAttribute('data-card-index', String(idx));
      card.setAttribute('data-product-id', item.id);
      card.style.setProperty('--at-card-accent', item.accent || '#00e5ff');
      card.style.setProperty('--at-stagger-delay', `${60 + idx * 95}ms`);

      const cleanTitle = item.title;
      const hoverLocation = item.badge || item.emboss || 'WORTHING, UK';
      const emblemGlyphs = ['【= ◈ ︿ ◈ =】', '【= ◇  Incre ◇ =】', '【= ◈ △ ◈ =】', '【= ◯ ︿ ◯ =】'];
      const emblem = emblemGlyphs[idx % emblemGlyphs.length].replace('Incre', '︿');

      card.innerHTML = `
        <div class="at-card-inner">
          <!-- Full-Bleed Environmental Landscape & Pathway Scene (Revealed on Hover like SECRET SKY close-up 2) -->
          <div class="at-card-scene-layer" aria-hidden="true">
            <svg class="at-card-scene-svg" viewBox="0 0 650 406" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="at-plaza-${idx}" cx="52%" cy="68%" r="48%">
                  <stop offset="0%" stop-color="rgba(195, 225, 212, 0.42)" />
                  <stop offset="62%" stop-color="rgba(140, 178, 162, 0.22)" />
                  <stop offset="100%" stop-color="rgba(35, 55, 48, 0)" />
                </radialGradient>
                <linearGradient id="at-hill-${idx}" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="rgba(32, 52, 46, 0.85)" />
                  <stop offset="55%" stop-color="rgba(54, 88, 74, 0.78)" />
                  <stop offset="100%" stop-color="rgba(26, 42, 38, 0.92)" />
                </linearGradient>
              </defs>
              <!-- Rolling hillside & horizon -->
              <path d="M -20 155 Q 240 42 465 118 T 670 185 L 670 420 L -20 420 Z" fill="url(#at-hill-${idx})" />
              <!-- Winding bright hillside pathway -->
              <path d="M 335 65 C 445 105, 505 178, 435 245 C 365 312, 480 355, 650 335 L 650 398 L 285 398 C 265 310, 395 225, 375 145 Z" fill="rgba(165, 195, 182, 0.28)" />
              <!-- Illuminated circular plaza on the lower-right -->
              <ellipse cx="478" cy="276" rx="132" ry="62" fill="url(#at-plaza-${idx})" />
              <!-- Subtle architectural / ridge silhouettes -->
              <path d="M 555 25 L 645 15 L 650 165 L 542 138 Z" fill="rgba(28, 38, 36, 0.65)" />
              <path d="M 105 125 Q 215 95 340 120 L 330 168 L 92 175 Z" fill="rgba(24, 36, 34, 0.58)" />
              <!-- Silhouetted observer figures along the pathway (matching SECRET SKY) -->
              <g fill="rgba(22, 34, 32, 0.78)">
                <ellipse cx="300" cy="215" rx="18" ry="12" />
                <path d="M 286 224 L 314 224 L 322 296 L 282 296 Z" />
                <ellipse cx="462" cy="182" rx="14" ry="9" />
                <path d="M 451 190 L 473 190 L 478 248 L 447 248 Z" />
                <ellipse cx="486" cy="176" rx="13" ry="9" />
                <path d="M 476 184 L 496 184 L 500 242 L 472 242 Z" />
                <ellipse cx="508" cy="185" rx="15" ry="10" />
                <path d="M 496 193 L 520 193 L 525 258 L 492 258 Z" />
                <ellipse cx="128" cy="212" rx="14" ry="9" />
                <path d="M 117 220 L 139 220 L 144 272 L 114 272 Z" />
              </g>
            </svg>
            <span class="at-card-scene-tag" style="top: 38%; left: 43%;">Worthing, UK</span>
            <span class="at-card-scene-tag" style="top: 35%; left: 68%;">${item.code} &bull; ${item.badge.split('·')[0].trim()}</span>
          </div>

          <!-- Organic Mottled Cloud Cover (Visible at rest like SECRET SKY image 1; dissolves on hover!) -->
          <div class="at-card-smoke-layer"></div>

          <div class="at-card-bg-packshot">
            <img src="${item.packshot}" alt="${cleanTitle.replace(/\n/g, ' ')}" draggable="false" />
          </div>
          <div class="at-card-hover-watermark" aria-hidden="true">${hoverLocation}</div>
          <div class="at-card-sheen"></div>
          <div class="at-card-rgb-bars"></div>

          <div class="at-card-lockup">
            <div class="at-card-brand">
              <span class="at-card-brand-emblem">${emblem}</span>
              <span class="at-card-brand-text">${item.brand}</span>
            </div>
            <div class="at-card-title-stage">
              <h3 class="at-card-title-main">${cleanTitle.replace(/\n/g, '<br/>')}</h3>
              <div class="at-card-title-glitch at-card-title-glitch--cyan" aria-hidden="true">${cleanTitle}</div>
              <div class="at-card-title-glitch at-card-title-glitch--magenta" aria-hidden="true">${cleanTitle}</div>
            </div>
          </div>
        </div>
      `;

      const lockupEl = card.querySelector('.at-card-lockup');
      const packshotWrapEl = card.querySelector('.at-card-bg-packshot');
      const brandTextEl = card.querySelector('.at-card-brand-text');
      const mainTitleEl = card.querySelector('.at-card-title-main');
      const cyanGlitchEl = card.querySelector('.at-card-title-glitch--cyan');
      const magGlitchEl = card.querySelector('.at-card-title-glitch--magenta');
      const rgbBarsEl = card.querySelector('.at-card-rgb-bars');

      // Subtle 3D tilt on pointer move
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--card-tilt-rx', `${(-ny * 9).toFixed(2)}deg`);
        card.style.setProperty('--card-tilt-ry', `${(nx * 13).toFixed(2)}deg`);
      });

      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--card-tilt-rx', '0deg');
        card.style.setProperty('--card-tilt-ry', '0deg');
      });

      // Clicking a card: if it's far in the background, orbit it to front; if in foreground, open Detail View (00:11 - 00:15)!
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        if (Math.abs(scrollCurrent - idx) > 0.72) {
          scrollTarget = idx;
          vortexBoost = Math.min(1.8, vortexBoost + 0.65);
        } else {
          scrollTarget = idx;
          enterDetailMode(item);
        }
      });

      cardsMountEl.appendChild(card);
      cardObjs.push({
        el: card,
        item,
        lockupEl,
        packshotWrapEl,
        baseBrand: item.brand,
        brandTextEl,
        baseTitle: cleanTitle,
        mainTitleEl,
        cyanGlitchEl,
        magGlitchEl,
        rgbBarsEl,
        lastGlitchBucket: -1
      });

      setTimeout(() => {
        card.classList.remove('is-entering');
      }, 900 + idx * 95);
    });

    if (counterTotEl) {
      counterTotEl.textContent = String(items.length).padStart(2, '0');
    }
  }

  function applyFilter(slug, focusItemId) {
    if (filterTransitioning) return;
    const cat = CATALOG[activeSubpage];
    if (!cat) return;

    currentFilter = slug || 'all';
    if (chatMessages) {
      chatMessages.querySelectorAll('.at-chat-filter').forEach((a) => {
        a.classList.toggle('active', a.getAttribute('data-filter-slug') === currentFilter);
      });
    }

    const nextItems = currentFilter === 'all'
      ? cat.items.slice()
      : cat.items.filter((it) => (it.tags || []).includes(currentFilter));

    filterTransitioning = true;
    vortexBoost = 1.65;
    cardObjs.forEach((c) => {
      c.el.classList.remove('is-entering');
      c.el.classList.add('is-exiting');
    });

    setTimeout(() => {
      visibleItems = nextItems.length ? nextItems : cat.items.slice();
      let nextIdx = 0;
      if (focusItemId) {
        const found = visibleItems.findIndex((x) => x.id === focusItemId);
        if (found >= 0) nextIdx = found;
      }
      scrollTarget = nextIdx;
      scrollCurrent = nextIdx;
      buildHelixCards(visibleItems);
      filterTransitioning = false;
    }, cardObjs.length ? 270 : 20);
  }

  // ============================================================================
  // 4. CENTERED 16:10 LANDSCAPE DETAIL SHOWCASE (00:11 - 00:15 "DAY 1 CLUB" STYLE)
  // ============================================================================
  function renderCenteredDetailShowcase(item) {
    if (!detailDrawerEl || !item) return;
    const has3dBox = item.detailSlide === 1 || item.detailSlide === 2;
    const ctaLabel = item.openBrochure
      ? 'OPEN CLINICAL BROCHURE'
      : has3dBox
      ? 'EXPLORE 3D BOX'
      : 'INQUIRE / REQUEST SPEC';

    const embossWords = (item.emboss || item.title.replace(/\n/g, ' ')).split(' ');
    const embossRepeated = Array.from({ length: 9 }, (_, i) => embossWords[i % embossWords.length]).join(' ');

    detailDrawerEl.innerHTML = `
      <div class="at-detail-showcase-frame">
        <!-- Giant Matte-Black 3D Embossed Background Letters (00:12 - 00:15 in video) -->
        <div class="at-detail-embossed-bg" aria-hidden="true">${embossRepeated}</div>

        <!-- Top Micro Controls inside the 16:10 Frame -->
        <div class="relative z-10 w-full flex items-center justify-between text-[10px] font-mono tracking-[0.18em] text-white/60 uppercase">
          <span>${item.brand} &bull; ${item.code}</span>
          <span>${item.badge}</span>
        </div>

        <!-- Center Hero Lockup (Packshot + Giant Display Title + Subtitle + Pill CTA) -->
        <div class="at-detail-hero-center">
          <img
            src="${item.packshot}"
            alt="${item.title.replace(/\n/g, ' ')}"
            class="at-detail-packshot-float"
            draggable="false"
          />
          <h2 class="at-detail-giant-title">${item.title.replace(/\n/g, ' ')}</h2>
          <p class="at-detail-sub-question">${item.subtitle}</p>
          <button type="button" id="at-detail-primary-cta" class="at-detail-prove-btn">
            <span>${ctaLabel}</span>
          </button>
        </div>

        <!-- Bottom Partner & Regulatory Credits Bar (00:14 - 00:15 in video) -->
        <div class="at-detail-footer-bar">
          <span>RAYNER UK EXCLUSIVE</span>
          <span>FDA &bull; CE CERTIFIED</span>
          <span>MEDIQ OPHTHALMIC DISTRIBUTION</span>
        </div>
      </div>
    `;

    detailDrawerEl.classList.remove('is-hidden');

    const ctaBtn = document.getElementById('at-detail-primary-cta');
    if (ctaBtn) {
      ctaBtn.addEventListener('click', () => {
        if (item.openBrochure) {
          const openBtn = document.getElementById('open-brochure-modal');
          if (openBtn) openBtn.click();
          return;
        }
        if (has3dBox) {
          enter3dBoxInspectMode(item);
        } else {
          const contactSec = document.getElementById('contact');
          if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  function enterDetailMode(item) {
    if (!item) return;
    detailMode = true;
    box3dMode = false;
    activeDetailItem = item;
    vortexBoost = 1.5;

    host.style.setProperty('--at-stage-accent', item.accent || '#e11d48');
    host.style.setProperty('--at-stage-glow', `${item.accent || '#e11d48'}33`);
    host.classList.add('is-detail-mode');
    host.classList.remove('is-3d-box-mode');
    prodSec.classList.add('at-spiral-active');
    if (backSpiralBtn) backSpiralBtn.classList.remove('is-hidden');

    renderCenteredDetailShowcase(item);
    renderDetailChatBrief(item);
  }

  // Optional deeper zoom into the full 360° rotatable 3D box stage on Slides 1 & 2
  function enter3dBoxInspectMode(item) {
    box3dMode = true;
    host.classList.add('is-3d-box-mode');
    prodSec.classList.remove('at-spiral-active');
    if (detailDrawerEl) detailDrawerEl.classList.add('is-hidden');
    if (backSpiralBtn) backSpiralBtn.classList.remove('is-hidden');

    if (item.detailSlide === 1 && typeof item.iolStage === 'number') {
      if (typeof window.jumpIolStage === 'function') window.jumpIolStage(item.iolStage);
    } else if (item.detailSlide === 2) {
      if (typeof item.medStage === 'number' && typeof window.jumpMedSuppliesStage === 'function') {
        window.jumpMedSuppliesStage(item.medStage);
      }
      if (typeof item.ophteisIdx === 'number' && typeof window.selectOphteisTab === 'function') {
        setTimeout(() => window.selectOphteisTab(item.ophteisIdx), 60);
      }
      if (typeof item.aeonIdx === 'number' && typeof window.selectAeonTab === 'function') {
        setTimeout(() => window.selectAeonTab(item.aeonIdx), 60);
      }
    }
  }

  function exitDetailMode(restoreChat = true) {
    if (!detailMode && !box3dMode) return;
    detailMode = false;
    box3dMode = false;
    activeDetailItem = null;
    vortexBoost = 1.25;

    host.classList.remove('is-detail-mode', 'is-3d-box-mode');
    if (detailDrawerEl) detailDrawerEl.classList.add('is-hidden');
    if (activeSubpage >= 1) {
      prodSec.classList.add('at-spiral-active');
    }
    if (backSpiralBtn) backSpiralBtn.classList.add('is-hidden');

    if (restoreChat) {
      renderSpiralChatMenu(activeSubpage);
    }
  }

  if (backSpiralBtn) {
    backSpiralBtn.addEventListener('click', () => exitDetailMode(true));
  }

  // Click background outside detail frame to return to spiral
  if (detailDrawerEl) {
    detailDrawerEl.addEventListener('click', (e) => {
      if (e.target === detailDrawerEl) {
        exitDetailMode(true);
      }
    });
  }

  // Continuous Free-Scroll with Rubber-Band Overscroll at Ends (00:01 - 00:03 in video — NO forced jump/snap!)
  function applyWheelImpulse(deltaY) {
    const maxIdx = Math.max(0, visibleItems.length - 1);
    const step = deltaY * 0.0028;
    // Allow rubber-band overscroll up to ±0.55 beyond [0, maxIdx], as seen at 00:02 in the video
    scrollTarget = Math.max(-0.55, Math.min(maxIdx + 0.55, scrollTarget + step));
    vortexBoost = Math.min(1.75, vortexBoost + Math.abs(step) * 0.65);
  }

  // Pointer drag on the 3D viewport to orbit the helix
  let isDraggingHelix = false;
  let dragStartY = 0;
  let dragStartX = 0;
  let dragStartTarget = 0;

  if (viewportEl) {
    viewportEl.addEventListener('pointerdown', (e) => {
      if (detailMode || box3dMode) return;
      if (e.target.closest('button, a, input')) return;
      isDraggingHelix = true;
      dragStartY = e.clientY;
      dragStartX = e.clientX;
      dragStartTarget = scrollTarget;
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDraggingHelix || detailMode || box3dMode) return;
      const dy = dragStartY - e.clientY;
      const dx = dragStartX - e.clientX;
      const combined = (dy + dx * 0.65) / 195;
      const maxIdx = Math.max(0, visibleItems.length - 1);
      scrollTarget = Math.max(-0.55, Math.min(maxIdx + 0.55, dragStartTarget + combined));
    }, { passive: true });

    window.addEventListener('pointerup', () => {
      if (!isDraggingHelix) return;
      isDraggingHelix = false;
    }, { passive: true });
  }

  // Direct wheel listener on #at-products-work-stage
  host.addEventListener('wheel', (e) => {
    if (activeSubpage === 0 || box3dMode) return;
    if (detailMode) {
      e.preventDefault();
      return;
    }
    if (Math.abs(e.deltaY) < 2) return;
    e.preventDefault();
    e.stopPropagation();
    applyWheelImpulse(e.deltaY);
  }, { passive: false });

  window.addEventListener('keydown', (e) => {
    if (activeSubpage === 0) return;
    if (e.key === 'Escape' && (detailMode || box3dMode)) {
      exitDetailMode(true);
    } else if (!detailMode && !box3dMode) {
      const maxIdx = Math.max(0, visibleItems.length - 1);
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        scrollTarget = Math.min(maxIdx, Math.round(scrollTarget) + 1);
        vortexBoost = Math.min(1.65, vortexBoost + 0.55);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollTarget = Math.max(0, Math.round(scrollTarget) - 1);
        vortexBoost = Math.min(1.65, vortexBoost + 0.55);
      }
    }
  });

  // ============================================================================
  // 5. WIDE-SPACED CYLINDRICAL HELIX (79deg/card) + INTERNAL COUNTER-PARALLAX
  // ============================================================================
  // Exact geometry from 00:00 - 00:08 video & SECRET SKY close-up:
  // - angleStep = 1.38 rad (~79deg per card around the spine cylinder)
  // - Wide horizontal orbit (radiusX = ~680px-750px) so adjacent cards NEVER overlap or crowd each other
  // - At rel = ±0.5 (00:00, 00:03, 00:07): Left card & Right card sit ~920px apart with the spine unobstructed in the center
  // - At rel = ±1.0 (00:02, 00:04, 00:06, 00:08): Clean open space between the center card and the lower-right / upper-left card
  // - At rel = ±2.0 (00:01, 00:02, 00:05, 00:06): angle = ±158deg so cards orbit cleanly BEHIND the upper & lower spine (z = -355px)!
  function sampleHelixPose(rel, curVw) {
    const isMob = curVw < 900;
    const radiusX = isMob ? curVw * 0.43 : Math.min(750, Math.max(580, curVw * 0.445));
    const radiusZ = isMob ? 255 : 380;
    const yStep = isMob ? 104 : 156;

    const angle = rel * 1.38; // ~79 degrees per card step around the cylinder
    const sinA = Math.sin(angle);
    const cosA = Math.cos(angle);
    const absRel = Math.abs(rel);

    const x = sinA * radiusX - 24 * Math.max(0, cosA);
    const y = rel * yStep;
    const z = cosA * radiusZ - 35; // +345px at rel=0, +255px at rel=±0.5, +38px at rel=±1.0, -352px at rel=±2.0 (behind spine!)

    const ry = -sinA * 48;
    const rx = 1.6 - Math.max(-2.5, Math.min(2.5, rel * 0.8));
    const rz = cosA > 0 ? cosA * 1.2 - sinA * 1.4 : -sinA * 1.8;

    const sc = Math.max(0.58, Math.min(1.0, 1.0 - Math.max(0, absRel - 0.12) * 0.088));
    const op = absRel > 3.3 ? 0 : Math.max(0, Math.min(1, 1.15 - Math.max(0, absRel - 0.85) * 0.38));

    return { x, y, z, ry, rx, rz, sc, op };
  }

  function renderLoop() {
    requestAnimationFrame(renderLoop);
    if (activeSubpage === 0) return;

    // 1. Rubber-band spring-back when overscrolled past [0, maxIdx] (matches 00:02 -> 00:03 in video)
    const maxIdx = Math.max(0, visibleItems.length - 1);
    if (!isDraggingHelix) {
      if (scrollTarget < 0) {
        scrollTarget += (0 - scrollTarget) * 0.11;
      } else if (scrollTarget > maxIdx) {
        scrollTarget += (maxIdx - scrollTarget) * 0.11;
      }
    }

    const prevScroll = scrollCurrent;
    scrollCurrent += (scrollTarget - scrollCurrent) * 0.075;
    const scrollVelocity = Math.abs(scrollCurrent - prevScroll);

    // Update top-right HUD counter & stage ambient accent color
    const focusIdx = Math.max(0, Math.min(maxIdx, Math.round(scrollCurrent)));
    if (counterCurEl) {
      counterCurEl.textContent = String(focusIdx + 1).padStart(2, '0');
    }
    if (!detailMode && visibleItems[focusIdx]) {
      const acc = visibleItems[focusIdx].accent || '#00e5ff';
      host.style.setProperty('--at-stage-accent', acc);
      host.style.setProperty('--at-stage-glow', `${acc}26`);
    }

    // 2. Position each wide 16:10 landscape card + apply internal horizontal counter-parallax (00:00 - 00:08)
    const isMob = vw < 900;
    const maxInternalShift = isMob ? 65 : 142;

    for (let i = 0; i < cardObjs.length; i++) {
      const cObj = cardObjs[i];
      const card = cObj.el;
      if (!card) continue;

      const rel = i - scrollCurrent;
      const absRel = Math.abs(rel);
      const pose = sampleHelixPose(rel, vw);

      card.style.transform = `translate3d(${pose.x.toFixed(1)}px, ${pose.y.toFixed(1)}px, ${pose.z.toFixed(1)}px) rotateY(${pose.ry.toFixed(2)}deg) rotateX(${pose.rx.toFixed(2)}deg) rotateZ(${pose.rz.toFixed(2)}deg) scale(${pose.sc.toFixed(3)})`;
      card.style.opacity = pose.op.toFixed(3);
      card.style.pointerEvents = pose.op > 0.22 ? 'auto' : 'none';
      card.classList.toggle('is-focused', absRel < 0.45);
      card.classList.toggle('is-sliced', absRel >= 0.18);
      card.classList.toggle('is-barcode', rel > 0.72);

      // Internal Horizontal Counter-Parallax inside the card (00:00 - 00:08 & SECRET SKY close-up):
      // - When card is on the LEFT (rel < 0), Brand + Title shift LEFT inside the card while artwork shifts RIGHT
      // - When card is in CENTER (rel = 0), Brand + Title sit dead-center (0px)
      // - When card is on the RIGHT (rel > 0), Brand + Title shift RIGHT inside the card while artwork shifts LEFT
      const textShiftX = Math.max(-maxInternalShift, Math.min(maxInternalShift, rel * (isMob ? 75 : 155)));
      const artShiftX = Math.max(-maxInternalShift * 0.82, Math.min(maxInternalShift * 0.82, -rel * (isMob ? 60 : 122)));
      if (cObj.lockupEl) {
        cObj.lockupEl.style.transform = `translate3d(${textShiftX.toFixed(1)}px, 0, 0)`;
      }
      if (cObj.packshotWrapEl) {
        cObj.packshotWrapEl.style.transform = `translate3d(${artShiftX.toFixed(1)}px, 0, 0) scale(1.04)`;
      }

      // 3. Progressive Left-to-Right Kinetic Glitch (00:00 - 00:08 in video):
      const effectiveRel = Math.min(1.2, absRel + scrollVelocity * 2.8);
      const bucket = Math.floor(effectiveRel * 16);
      if (bucket !== cObj.lastGlitchBucket) {
        cObj.lastGlitchBucket = bucket;
        const glitchedTitle = buildProgressiveGlitchText(cObj.baseTitle, effectiveRel);
        if (cObj.mainTitleEl) {
          cObj.mainTitleEl.innerHTML = glitchedTitle.replace(/\n/g, '<br/>');
        }
        if (cObj.cyanGlitchEl) cObj.cyanGlitchEl.textContent = glitchedTitle;
        if (cObj.magGlitchEl) cObj.magGlitchEl.textContent = glitchedTitle;
        if (cObj.brandTextEl) {
          cObj.brandTextEl.textContent = effectiveRel >= 0.24
            ? buildProgressiveGlitchText(cObj.baseBrand, effectiveRel)
            : cObj.baseBrand;
        }
      }

      // RGB barcode intensity is strongest on the incoming right wing (rel > 0.65) and subtle during mid-transition
      const isRightBarcode = rel > 0.65;
      const rgbAlpha = isRightBarcode
        ? 0.95
        : effectiveRel > 0.14
        ? Math.min(0.62, (effectiveRel - 0.12) * 0.72)
        : 0;
      const shiftPx = (Math.min(1, effectiveRel) * 5.5).toFixed(1);

      if (cObj.mainTitleEl) {
        cObj.mainTitleEl.style.opacity = isRightBarcode ? '0.16' : (1 - rgbAlpha * 0.22).toFixed(2);
      }
      if (cObj.cyanGlitchEl) {
        cObj.cyanGlitchEl.style.opacity = rgbAlpha.toFixed(2);
        cObj.cyanGlitchEl.style.transform = `translate3d(-${shiftPx}px, 0, 0)`;
      }
      if (cObj.magGlitchEl) {
        cObj.magGlitchEl.style.opacity = (rgbAlpha * 0.92).toFixed(2);
        cObj.magGlitchEl.style.transform = `translate3d(${shiftPx}px, 0, 0)`;
      }
    }

    // 4. Advance spine rotation & render central 3D biomechanical spine + crystal shards
    vortexBoost *= 0.93;
    vortexAngle += 0.0055 + scrollVelocity * 0.22 + vortexBoost * 0.04;
    drawCentralSpineAndShards(scrollVelocity);
  }
  requestAnimationFrame(renderLoop);

  // ============================================================================
  // 6. SUBPAGE HOOKS & SELF-HEALING ACTIVATION
  // ============================================================================
  window.__activateProductsActiveTheory = function(slideIdx) {
    const idx = Number(slideIdx) || 0;
    activeSubpage = idx;
    if (idx >= 1 && CATALOG[idx]) {
      const cat = CATALOG[idx];
      currentFilter = 'all';
      visibleItems = cat.items.slice();
      scrollTarget = 0;
      scrollCurrent = 0;
      detailMode = false;
      box3dMode = false;
      activeDetailItem = null;
      vortexBoost = 1.4;

      prodSec.classList.add('at-spiral-active');
      host.classList.remove('is-hidden', 'is-detail-mode', 'is-3d-box-mode');
      if (detailDrawerEl) detailDrawerEl.classList.add('is-hidden');
      if (backSpiralBtn) backSpiralBtn.classList.add('is-hidden');
      if (kickerEl) kickerEl.textContent = cat.subpageTitle;

      resizeCanvases();
      buildHelixCards(visibleItems);
      renderSpiralChatMenu(idx);
    } else {
      prodSec.classList.remove('at-spiral-active');
      host.classList.add('is-hidden');
      if (detailDrawerEl) detailDrawerEl.classList.add('is-hidden');
      detailMode = false;
      box3dMode = false;
    }
  };

  window.__onProductsActiveTheoryWheel = function(deltaY) {
    if (activeSubpage === 0) return false;
    if (box3dMode) return false;
    if (detailMode) return true;

    applyWheelImpulse(deltaY);
    return true;
  };

  window.__isProductsActiveTheoryDetailMode = function() {
    return box3dMode;
  };

  function bindGoToProductSlideWrapper() {
    if (typeof window.goToProductSlide === 'function' && !window.goToProductSlide.__atWrapped) {
      const origFn = window.goToProductSlide;
      const wrapped = function(idx) {
        const res = origFn.apply(this, arguments);
        window.__activateProductsActiveTheory(Number(idx) || 0);
        return res;
      };
      wrapped.__atWrapped = true;
      window.goToProductSlide = wrapped;
    }
  }
  bindGoToProductSlideWrapper();
  setTimeout(bindGoToProductSlideWrapper, 250);
  setTimeout(bindGoToProductSlideWrapper, 1000);

  const productSlides = Array.from(prodSec.querySelectorAll('.product-slide'));
  if (productSlides.length && typeof MutationObserver !== 'undefined') {
    const slideObserver = new MutationObserver(() => {
      bindGoToProductSlideWrapper();
      let detectedIdx = 0;
      productSlides.forEach((sl) => {
        const idx = Number(sl.getAttribute('data-product-index') || 0);
        if (idx >= 1 && sl.classList.contains('opacity-100')) {
          detectedIdx = idx;
        }
      });
      if (detectedIdx !== activeSubpage) {
        window.__activateProductsActiveTheory(detectedIdx);
      }
    });
    productSlides.forEach((sl) => {
      slideObserver.observe(sl, { attributes: true, attributeFilter: ['class'] });
    });
  }

  document.querySelectorAll('[data-product-slide]').forEach((link) => {
    link.addEventListener('click', () => {
      const targetIdx = Number(link.getAttribute('data-product-slide') || 0);
      setTimeout(() => {
        if (activeSubpage !== targetIdx) {
          window.__activateProductsActiveTheory(targetIdx);
        }
      }, 60);
    });
  });

  document.querySelectorAll('[data-prod-pill]').forEach((pill) => {
    pill.addEventListener('click', () => {
      const targetIdx = Number(pill.getAttribute('data-prod-pill') || 0);
      setTimeout(() => {
        if (activeSubpage !== targetIdx) {
          window.__activateProductsActiveTheory(targetIdx);
        }
      }, 40);
    });
  });

  if (typeof window.__productsDeckCurrentIndex === 'number' && window.__productsDeckCurrentIndex >= 1) {
    window.__activateProductsActiveTheory(window.__productsDeckCurrentIndex);
  } else {
    productSlides.forEach((sl) => {
      const idx = Number(sl.getAttribute('data-product-index') || 0);
      if (idx >= 1 && sl.classList.contains('opacity-100')) {
        window.__activateProductsActiveTheory(idx);
      }
    });
  }
})();
