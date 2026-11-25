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
        { label: 'NEW · GALAXY SPIRAL IOL', slug: 'galaxy' },
        { label: 'ENHANCED MONOVISION (EMV)', slug: 'emv' },
        { label: 'TRIFOCAL OPTICS', slug: 'trifocal' },
        { label: 'TORIC ASTIGMATISM', slug: 'toric' },
        { label: 'MONOFOCAL ASPHERIC', slug: 'monofocal' },
        { label: 'PSEUDOPHAKIC SUPPLEMENTARY', slug: 'sulcoflex' }
      ],
      items: [
        {
          id: 'rayone-galaxy',
          code: 'RAO605G',
          brand: 'RAYNER UK',
          kicker: 'NEW 2026 / RAYNER UK / SPIRAL OPTIC / FULL RANGE IOL',
          title: 'RAYONE\nGALAXY',
          emboss: 'GALAXY SPIRAL IOL',
          subtitle: 'The new spiral IOL — a smooth, continuous full range of vision with minimised dysphotopsia and 0% loss of transmitted light.',
          desc: 'UNIQUE NON-DIFFRACTIVE SPIRAL OPTIC · 6.0 MM BICONVEX ABERRATION-CORRECTING OPTIC · RAYACRYL HYDROPHILIC ACRYLIC · +5.0 TO +30.0 D · FULLY PRELOADED 2.2 MM INCISION.',
          badge: 'NEW · Spiral Optic · Preloaded',
          packshot: 'assets/img/packshots/galaxy_carton.png?v=2',
          accent: '#3aa0db',
          tags: ['all', 'galaxy'],
          keywords: ['galaxy', 'spiral', 'new', 'full range', 'edof', 'non-diffractive', 'rao605g', 'latest'],
          detailSlide: 1,
          iolStage: 0
        },
        {
          id: 'rayone-galaxy-toric',
          code: 'RAO615X',
          brand: 'RAYNER UK',
          kicker: 'NEW 2026 / RAYNER UK / SPIRAL OPTIC / TORIC IOL',
          title: 'GALAXY\nTORIC',
          emboss: 'GALAXY TORIC',
          subtitle: 'Galaxy spiral full-range optics with astigmatism correction from +0.75 D to +4.5 D cylinder.',
          desc: 'SPIRAL OPTIC WITH ANTI-VAULTING HAPTIC (AVH) ROTATIONAL STABILITY · SE +6.0 TO +30.0 D · CYL +0.75 TO +4.5 D · AMON-APPLE 360° SQUARE EDGE.',
          badge: 'NEW · Toric · Cyl +0.75 to +4.5 D',
          packshot: 'assets/img/packshots/galaxy_toric_carton.png?v=2',
          accent: '#94a3b8',
          tags: ['all', 'galaxy', 'toric'],
          keywords: ['galaxy', 'toric', 'spiral', 'astigmatism', 'new', 'rao615x', 'latest'],
          detailSlide: 1,
          iolStage: 1
        },
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
          iolStage: 2
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
          iolStage: 4
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
          iolStage: 5
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
          iolStage: 6
        },
        {
          id: 'rayone-emv-toric',
          code: 'RAO210T',
          brand: 'RAYNER UK',
          kicker: '2026 / RAYNER UK / ENHANCED MONOVISION TORIC / IOL',
          title: 'RAYONE\nEMV TORIC',
          emboss: 'EMV TORIC',
          subtitle: 'Up to 1.5 D extended range of vision combined with precise astigmatism correction and Lock & Roll delivery.',
          desc: 'PATENTED POSITIVE SPHERICAL ABERRATION OPTIC WITH ANTI-VAULTING HAPTIC (AVH) ROTATIONAL STABILITY FOR ASTIGMATIC PATIENTS.',
          badge: 'Up to 1.5 D Range · Toric AVH',
          packshot: 'assets/img/packshots/authentic_emv_toric.png',
          accent: '#eb5a28',
          tags: ['all', 'emv', 'toric'],
          keywords: ['emv', 'toric', 'monovision', 'astigmatism', 'rao210t', '210t'],
          detailSlide: 1,
          iolStage: 3
        },
        {
          id: 'sulcoflex-aspheric',
          code: '653L',
          brand: 'RAYNER UK',
          kicker: '2026 / RAYNER UK / PSEUDOPHAKIC SUPPLEMENTARY / IOL',
          title: 'SULCOFLEX\nASPHERIC',
          emboss: 'SULCOFLEX 653L',
          subtitle: 'Pseudophakic supplementary sulcus lens for reversible residual refractive error correction.',
          desc: 'LARGE 6.5 MM UNDULATING ROUND-EDGE SULCUS OPTIC WITH 10° POSTERIOR ANGULATED HAPTICS DESIGNED TO REDUCE UVEAL CONTACT AND PIGMENT DISPERSION.',
          badge: 'Supplementary Sulcus · 6.5 mm Optic',
          packshot: 'assets/img/packshots/authentic_sulcoflex.png',
          accent: '#a855f7',
          tags: ['all', 'sulcoflex', 'monofocal'],
          keywords: ['sulcoflex', 'aspheric', 'supplementary', 'duet', 'sulcus', '653l'],
          detailSlide: 1,
          iolStage: 7
        }
      ]
    },

    // ========================================================================
    // SUBPAGE 2: OPHTHALMIC SOLUTIONS & VERIFIED OVDs (Ophteis OVDs & AEON Eye Solutions)
    // ========================================================================
    2: {
      subpageTitle: 'OPHTHALMIC SOLUTIONS & VERIFIED OVDs · OPHTEIS & AEON™',
      prompt: 'WHAT ARE YOU LOOKING FOR?',
      filters: [
        { label: 'ALL OPHTHALMIC SOLUTIONS', slug: 'all' },
        { label: 'VERIFIED OVDs (OPHTEIS)', slug: 'ovd' },
        { label: 'OPHTHALMIC EYE SOLUTIONS (AEON™)', slug: 'aeon' },
        { label: 'DISPERSIVE PROTECTION', slug: 'dispersive' },
        { label: 'OCULAR SURFACE CARE', slug: 'dryeye' }
      ],
      items: [
        {
          id: 'ophteis-bio-30',
          code: 'OPH-30',
          brand: 'OPHTEIS OVD',
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
          brand: 'OPHTEIS OVD',
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
          brand: 'OPHTEIS OVD',
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

    <!-- 2. Interactive WebGL2 Warp Carousel Viewport (Transparent over dark MedTech background) -->
    <div id="at-work-viewport" class="at-work-viewport">
      <div id="at-work-warp-mount" style="position:relative;width:100%;height:100%;"></div>
      <div class="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-30 hidden sm:flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-sky/25 bg-[#050814]/70 text-[10px] font-mono tracking-[0.2em] uppercase text-[#a8d4f5]/90 backdrop-blur-md">
        <span class="size-1.5 rounded-full bg-[#38bdf8]"></span>
        <span>Drag / Scroll to Rotate &middot; Click Center Card to Inspect</span>
      </div>
    </div>

    <!-- 3. Centered 16:10 Landscape Detail Stage (Opens on card press) -->
    <div id="at-work-detail-drawer" class="at-work-detail-drawer is-hidden" aria-live="polite"></div>

    <!-- 5. Floating Return Button when inspecting card detail or 3D box -->
    <button type="button" id="at-work-back-spiral-btn" class="at-work-back-spiral-btn is-hidden">
      <span>&larr; Back</span>
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
  const viewportEl = document.getElementById('at-work-viewport');
  const warpMountEl = document.getElementById('at-work-warp-mount');
  const detailDrawerEl = document.getElementById('at-work-detail-drawer');
  const kickerEl = document.getElementById('at-work-kicker');
  const counterCurEl = document.getElementById('at-work-counter-cur');
  const counterTotEl = document.getElementById('at-work-counter-tot');
  const backSpiralBtn = document.getElementById('at-work-back-spiral-btn');
  const chatMessages = document.getElementById('at-chat-messages');
  const chatForm = document.getElementById('at-chat-form');
  const chatInput = document.getElementById('at-chat-input');

  // State
  let activeSubpage = 0;
  let currentFilter = 'all';
  let visibleItems = [];
  let detailMode = false;
  let box3dMode = false;
  let activeDetailItem = null;
  let filterTransitioning = false;
  let isStageVisible = false;

  // ============================================================================
  // 1. LIGHTWEIGHT DIAGONAL DUST STREAKS (Visibility-gated; 0 CPU off-screen)
  // ============================================================================
  const bgCtx = bgDustCanvas ? bgDustCanvas.getContext('2d') : null;
  let vw = window.innerWidth;
  let vh = window.innerHeight;
  let vdpr = 1;

  function resizeCanvases() {
    vdpr = 1;
    vw = host.clientWidth || prodSec.clientWidth || window.innerWidth;
    vh = host.clientHeight || (prodSec.clientHeight - 128) || (window.innerHeight - 128);
    if (bgDustCanvas) {
      bgDustCanvas.width = Math.max(1, Math.floor(vw * vdpr));
      bgDustCanvas.height = Math.max(1, Math.floor(vh * vdpr));
      bgDustCanvas.style.width = vw + 'px';
      bgDustCanvas.style.height = vh + 'px';
    }
  }
  resizeCanvases();
  window.addEventListener('resize', resizeCanvases, { passive: true });

  const DUST_COUNT = 52;
  const dustStreaks = Array.from({ length: DUST_COUNT }, () => {
    const alpha = 0.08 + Math.random() * 0.24;
    return {
      x: Math.random(),
      y: Math.random(),
      len: 8 + Math.random() * 20,
      speed: 0.025 + Math.random() * 0.048,
      alpha,
      strokeStyle: `rgba(210, 225, 255, ${alpha.toFixed(3)})`,
      size: 0.8 + Math.random() * 1.3
    };
  });

  let dustRafId = 0;
  let lastDustTs = 0;
  function stopDust() {
    if (dustRafId) {
      cancelAnimationFrame(dustRafId);
      dustRafId = 0;
    }
    lastDustTs = 0;
  }
  function shouldRunDust() {
    return false;
  }
  if (bgCtx) {
    bgCtx.setTransform(1, 0, 0, 1, 0, 0);
    bgCtx.clearRect(0, 0, vw, vh);
  }
  function drawDustFrame(now) {
    dustRafId = 0;
  }
  function kickDust() {
    stopDust();
    if (bgCtx) {
      bgCtx.setTransform(1, 0, 0, 1, 0, 0);
      bgCtx.clearRect(0, 0, vw, vh);
    }
  }

  function notifyProductsStageChange() {
    window.dispatchEvent(new CustomEvent('mediq:products-stage-change', {
      detail: {
        activeSubpage,
        detailMode,
        box3dMode,
        spiralCovering: prodSec.classList.contains('at-spiral-active')
      }
    }));
  }

  if ('IntersectionObserver' in window) {
    const stageIo = new IntersectionObserver((entries) => {
      isStageVisible = entries.some((en) => en.isIntersecting);
      if (isStageVisible) kickDust();
      else stopDust();
      notifyProductsStageChange();
    }, { rootMargin: '120px 0px', threshold: 0.01 });
    stageIo.observe(prodSec);
  } else {
    isStageVisible = true;
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopDust();
    else kickDust();
  });

  const SUBNAV_ITEMS = [
    { label: 'OVERVIEW', slide: 0 },
    { label: 'OPHTHALMOLOGY \u00B7 IOLS', slide: 1 },
    { label: 'OPHTHALMIC OVDS', slide: 2 },
    { label: 'FUTURE PORTFOLIO', slide: 3 },
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
            buildHelixCards(visibleItems, 0);
            return;
          }
          if (typeof window.goToProductSlide === 'function') {
            window.goToProductSlide(navItem.slide);
          } else {
            window.__activateProductsActiveTheory(navItem.slide);
          }
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
          // warp carousel index synced
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
  // 3. WARP CAROUSEL CARD MAPPING & FILTERING (Mesh matched 1:1 to Box Color)
  // ============================================================================
  const WARP_SPECS = {
    'rayone-galaxy': { value: '0%', unit: '', detail: 'ring', preset: 'obsidian' },
    'rayone-galaxy-toric': { value: '0%', unit: '', detail: 'ring', preset: 'pearl' },
    'rayone-emv': { value: '1.5', unit: 'D', detail: 'slider', labels: ['Monofocal', 'Binocular EDoF'], preset: 'magenta' },
    'rayone-trifocal': { value: '89', unit: '%', detail: 'ring', preset: 'cerulean' },
    'rayone-trifocal-toric': { value: '1.8', unit: '°', detail: 'cross', labels: ['AVH', 'Haptic', 'Toric'], preset: 'cobalt' },
    'rayone-aspheric': { value: '1.65', unit: 'mm', detail: 'wave', preset: 'plum' },
    'rayone-emv-toric': { value: '1.5', unit: 'D', detail: 'ring', preset: 'orange' },
    'sulcoflex-aspheric': { value: '6.5', unit: 'mm', detail: 'cross', labels: ['Sulcus', 'Aspheric', '10°'], preset: 'aubergine' },
    'ophteis-bio-30': { value: '3.0', unit: '%', detail: 'slider', labels: ['Cohesive', '85k mPa·s'], preset: 'cerulean' },
    'ophteis-bio-18': { value: '1.8', unit: '%', detail: 'ring', preset: 'lavender' },
    'ophteis-max': { value: '2.0', unit: '%', detail: 'cross', labels: ['HPMC', 'Cell', 'Shield'], preset: 'marigold' },
    'aeon-protect-plus': { value: '0.30', unit: '%', detail: 'wave', preset: 'gold' },
    'aeon-protect': { value: '0.15', unit: '%', detail: 'slider', labels: ['Vit A', 'Vit E'], preset: 'emerald' },
    'aeon-repair': { value: '0.20', unit: '%', detail: 'ring', preset: 'amethyst' },
    'future-medical-devices': { value: '01', unit: '', detail: 'slider', labels: ['Devices', 'Surgical'], preset: 'magenta' },
    'future-pharmaceuticals': { value: '02', unit: '', detail: 'cross', labels: ['FDA', 'Pipeline', 'PH'], preset: 'gold' },
    'future-diagnostics': { value: '03', unit: '', detail: 'ring', preset: 'cobalt' },
    'future-hospital-equipment': { value: '04', unit: '', detail: 'wave', preset: 'plum' },
    'cat-rayone-compendium': { value: '18', unit: 'p', detail: 'slider', labels: ['A-Const', 'MTF'], preset: 'magenta' },
    'cat-emv-monograph': { value: '1.5', unit: 'D', detail: 'cross', labels: ['Defocus', 'EMV', 'Study'], preset: 'cerulean' },
    'cat-ophteis-dossier': { value: '03', unit: '', detail: 'ring', preset: 'cobalt' },
    'cat-aeon-protocol': { value: '04', unit: '', detail: 'wave', preset: 'gold' }
  };
  const PRESET_ORDER = ['magenta', 'cerulean', 'cobalt', 'plum', 'orange', 'aubergine'];

  function toWarpCard(item, idx) {
    const presets = window.MEDIQ_WARP_MESH_PRESETS || {};
    const spec = WARP_SPECS[item.id] || {};
    const pKey = spec.preset || PRESET_ORDER[idx % PRESET_ORDER.length];
    const p = presets[pKey] || presets.cyan || {};
    const titleLines = item.title.includes('\n') ? item.title : item.title.replace(/\s+/, '\n');
    const shortBadge = (item.badge || '').split('·')[0].trim();
    return {
      title: titleLines,
      value: spec.value || String(idx + 1).padStart(2, '0'),
      unit: spec.unit !== undefined ? spec.unit : '',
      footer: 'Explore more →',
      codeTag: item.code || '',
      image: item.packshot || '',
      mesh: p.mesh,
      numeral: p.numeral,
      glow: p.glow || item.accent,
      accent: p.accent || item.accent,
      lightCard: !!p.lightCard,
      detail: spec.detail || ['slider', 'cross', 'ring', 'wave'][idx % 4],
      labels: spec.labels || ['MediQ', 'in', 'out'],
      itemRef: item
    };
  }

  function openProductInquiry(it) {
    if (!it) return;
    if ((detailMode || box3dMode) && typeof exitDetailMode === 'function') {
      exitDetailMode(false);
    }
    const cleanTitle = (it.title || '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    const codePart = it.code ? ` (${it.code})` : '';
    const preferredTopic = activeSubpage === 1 ? 'IOL portfolio' : 'Hospital supply';
    const topicBtn = document.querySelector(`#contact-topic-pills button[data-contact-topic="${preferredTopic}"]`);
    if (topicBtn) topicBtn.click();
    const prodSel = document.getElementById('inq-product');
    if (prodSel && prodSel.options && cleanTitle) {
      const titleLow = cleanTitle.toLowerCase();
      let matchedVal = '';
      for (let i = 0; i < prodSel.options.length; i++) {
        const optVal = prodSel.options[i].value || '';
        const optLow = optVal.toLowerCase();
        if (optLow.includes(titleLow) || (titleLow.includes('trifocal') && optLow.includes('trifocal')) || (titleLow.includes('aspheric') && optLow.includes('aspheric')) || (titleLow.includes('hydrophobic') && optLow.includes('hydrophobic')) || (titleLow.includes('sulcoflex') && optLow.includes('sulcoflex')) || (titleLow.includes('ophteis') && optLow.includes('ophteis')) || (titleLow.includes('aeon') && optLow.includes('aeon'))) {
          matchedVal = optVal;
          break;
        }
      }
      if (matchedVal) {
        prodSel.value = matchedVal;
        prodSel.dispatchEvent(new Event('change'));
      }
    }
    const subj = document.getElementById('inq-subject');
    if (subj) {
      subj.value = `Product Inquiry: ${cleanTitle}${codePart}`;
    }
    const msg = document.getElementById('inq-message');
    if (msg && (!msg.value.trim() || msg.value.startsWith('I would like to inquire about '))) {
      msg.value = `I would like to inquire about ${cleanTitle}${codePart}.`;
    }
    if (typeof window.navigateToSection === 'function') {
      window.navigateToSection('#contact');
    } else {
      if (typeof window.goToProductSlide === 'function') window.goToProductSlide(0);
      if (typeof window.__unlockOuterPageScroll === 'function') window.__unlockOuterPageScroll({ skipRestore: true });
      const contactSec = document.getElementById('contact');
      if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
    }
    if (msg && window.innerWidth >= 1024) {
      setTimeout(() => { try { msg.focus({ preventScroll: true }); } catch (_) {} }, 600);
    }
  }

  let warpCtrl = null;
  function ensureWarpCarousel() {
    if (warpCtrl || !warpMountEl || typeof window.createMediqWarpCarousel !== 'function') return warpCtrl;
    warpCtrl = window.createMediqWarpCarousel({
      container: warpMountEl,
      interval: 4.2,
      step: 1,
      warp: 0,
      onIndexChange(frontIdx, card) {
        if (counterCurEl) {
          counterCurEl.textContent = String((frontIdx || 0) + 1).padStart(2, '0');
        }
        const it = card && card.itemRef;
        if (it && !detailMode) {
          const acc = it.accent || '#00e5ff';
          host.style.setProperty('--at-stage-accent', acc);
          host.style.setProperty('--at-stage-glow', `${acc}26`);
        }
      },
      onFrontClick(card) {
        const it = card && card.itemRef;
        if (it) enterDetailMode(it);
      },
      onInquireClick(card) {
        openProductInquiry(card && card.itemRef);
      }
    });
    return warpCtrl;
  }

  function buildHelixCards(items, focusIndex) {
    if (counterTotEl) {
      counterTotEl.textContent = String(items.length).padStart(2, '0');
    }
    const ctrl = ensureWarpCarousel();
    if (ctrl) {
      const warpCards = items.map((item, idx) => toWarpCard(item, idx));
      ctrl.setCards(warpCards, focusIndex || 0);
      ctrl.setPaused(activeSubpage === 0 || detailMode || box3dMode);
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
    visibleItems = nextItems.length ? nextItems : cat.items.slice();
    let nextIdx = 0;
    if (focusItemId) {
      const found = visibleItems.findIndex((x) => x.id === focusItemId);
      if (found >= 0) nextIdx = found;
    }
    buildHelixCards(visibleItems, nextIdx);
    setTimeout(() => { filterTransitioning = false; }, 120);
  }

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
          openProductInquiry(item);
        }
      });
    }
  }

  function enterDetailMode(item) {
    if (!item) return;
    detailMode = true;
    box3dMode = false;
    activeDetailItem = item;

    if (warpCtrl) warpCtrl.setPaused(true);
    stopDust();
    host.style.setProperty('--at-stage-accent', item.accent || '#e11d48');
    host.style.setProperty('--at-stage-glow', `${item.accent || '#e11d48'}33`);
    host.classList.add('is-detail-mode');
    host.classList.remove('is-3d-box-mode');
    prodSec.classList.add('at-spiral-active');
    if (backSpiralBtn) backSpiralBtn.classList.remove('is-hidden');
    notifyProductsStageChange();

    renderCenteredDetailShowcase(item);
    renderDetailChatBrief(item);
  }

  // Optional deeper zoom into the full 360° rotatable 3D box stage on Slides 1 & 2
  function enter3dBoxInspectMode(item) {
    box3dMode = true;
    stopDust();
    host.classList.add('is-3d-box-mode');
    prodSec.classList.remove('at-spiral-active');
    if (detailDrawerEl) detailDrawerEl.classList.add('is-hidden');
    if (backSpiralBtn) backSpiralBtn.classList.remove('is-hidden');
    notifyProductsStageChange();

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

    host.classList.remove('is-detail-mode', 'is-3d-box-mode');
    if (detailDrawerEl) detailDrawerEl.classList.add('is-hidden');
    if (activeSubpage >= 1) {
      prodSec.classList.add('at-spiral-active');
    }
    if (backSpiralBtn) backSpiralBtn.classList.add('is-hidden');
    if (warpCtrl) warpCtrl.setPaused(activeSubpage === 0);
    kickDust();
    notifyProductsStageChange();

    if (restoreChat) {
      renderSpiralChatMenu(activeSubpage);
    }
  }

  if (backSpiralBtn) {
    backSpiralBtn.addEventListener('click', () => exitDetailMode(true));
  }

  if (detailDrawerEl) {
    detailDrawerEl.addEventListener('click', (e) => {
      if (e.target === detailDrawerEl) {
        exitDetailMode(true);
      }
    });
  }

  function applyWheelImpulse(deltaY) {
    if (warpCtrl) warpCtrl.wheel(deltaY);
  }

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
    } else if (!detailMode && !box3dMode && warpCtrl) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        warpCtrl.step(1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        warpCtrl.step(-1);
      } else if (e.key === 'Enter' && document.activeElement !== chatInput) {
        e.preventDefault();
        warpCtrl.openFront();
      }
    }
  });

  // 6. SUBPAGE HOOKS, IDLE PACKSHOT PRELOAD & SELF-HEALING ACTIVATION
  // ============================================================================
  let prewarmedSubpage = 0;

  function preloadAllCatalogPackshots() {
    const urls = [];
    const seen = new Set();
    [1, 2, 4].forEach((k) => {
      const cat = CATALOG[k];
      if (!cat || !cat.items) return;
      cat.items.forEach((it) => {
        if (it.packshot && !seen.has(it.packshot)) {
          seen.add(it.packshot);
          urls.push(it.packshot);
        }
      });
    });
    if (typeof window.__mediqWarpPreloadImages === 'function') {
      window.__mediqWarpPreloadImages(urls);
    } else {
      urls.forEach((src) => {
        const pre = new Image();
        pre.decoding = 'async';
        pre.src = src;
      });
    }
  }

  function prewarmWarpStage() {
    if (warpCtrl || activeSubpage !== 0 || !warpMountEl) return;
    const cat = CATALOG[1];
    if (!cat || !cat.items) return;
    resizeCanvases();
    const ctrl = ensureWarpCarousel();
    if (ctrl) {
      const items = cat.items.slice();
      visibleItems = items;
      ctrl.setCards(items.map((item, idx) => toWarpCard(item, idx)), 0);
      ctrl.setPaused(true);
      prewarmedSubpage = 1;
    }
  }

  function schedulePrewarm() {
    preloadAllCatalogPackshots();
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => prewarmWarpStage(), { timeout: 2200 });
    } else {
      setTimeout(prewarmWarpStage, 1200);
    }
  }

  if (typeof IntersectionObserver !== 'undefined' && prodSec) {
    let prewarmScheduled = false;
    const preIo = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting) && !prewarmScheduled) {
        prewarmScheduled = true;
        preIo.disconnect();
        schedulePrewarm();
      }
    }, { rootMargin: '500px 0px', threshold: 0.01 });
    preIo.observe(prodSec);
  }
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(schedulePrewarm, { timeout: 2200 });
  } else {
    setTimeout(schedulePrewarm, 1200);
  }

  window.__activateProductsActiveTheory = function(slideIdx) {
    const idx = Number(slideIdx) || 0;
    if (
      idx >= 1 &&
      idx !== 3 &&
      idx === activeSubpage &&
      currentFilter === 'all' &&
      !detailMode &&
      !box3dMode &&
      !host.classList.contains('is-hidden')
    ) {
      if (warpCtrl) warpCtrl.setPaused(false);
      kickDust();
      return;
    }
    activeSubpage = idx;
    if (idx >= 1 && idx !== 3 && CATALOG[idx]) {
      const cat = CATALOG[idx];
      currentFilter = 'all';
      visibleItems = cat.items.slice();
      detailMode = false;
      box3dMode = false;
      activeDetailItem = null;

      prodSec.classList.add('at-spiral-active');
      host.classList.remove('is-hidden', 'is-detail-mode', 'is-3d-box-mode');
      if (detailDrawerEl) detailDrawerEl.classList.add('is-hidden');
      if (backSpiralBtn) backSpiralBtn.classList.add('is-hidden');
      if (kickerEl) kickerEl.textContent = cat.subpageTitle;

      resizeCanvases();
      if (idx === 1 && prewarmedSubpage === 1 && warpCtrl) {
        prewarmedSubpage = 0;
        if (counterTotEl) counterTotEl.textContent = String(visibleItems.length).padStart(2, '0');
        warpCtrl.setPaused(false);
        if (typeof warpCtrl.replayIntro === 'function') warpCtrl.replayIntro(0);
      } else {
        prewarmedSubpage = 0;
        buildHelixCards(visibleItems, 0);
      }
      renderSpiralChatMenu(idx);
      kickDust();
      notifyProductsStageChange();
    } else {
      prodSec.classList.remove('at-spiral-active');
      host.classList.add('is-hidden');
      if (detailDrawerEl) detailDrawerEl.classList.add('is-hidden');
      detailMode = false;
      box3dMode = false;
      stopDust();
      if (warpCtrl) warpCtrl.setPaused(true);
      notifyProductsStageChange();
    }
  };

  window.__openProductCatalogItem = function(subpageIdx, itemId) {
    const idx = Number(subpageIdx) || 1;
    if (typeof window.goToProductSlide === 'function') {
      window.goToProductSlide(idx);
    }
    window.__activateProductsActiveTheory(idx);
    const cat = CATALOG[idx];
    if (cat && itemId) {
      const foundIdx = cat.items.findIndex((it) => it.id === itemId);
      if (foundIdx >= 0) {
        visibleItems = cat.items.slice();
        buildHelixCards(visibleItems, foundIdx);
        setTimeout(() => enterDetailMode(visibleItems[foundIdx]), 120);
      }
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
        const nextIdx = Number(idx) || 0;
        if (activeSubpage !== nextIdx) {
          window.__activateProductsActiveTheory(nextIdx);
        }
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
