/* ==========================================================================
   RAYONE® GALAXY 3D SURGICAL PROCEDURE SIMULATOR (HIGH-FIDELITY MEDICAL LAB)
   Faithful to the official Rayner RayOne Implantation Video & Loading Guide:
   - Stage 01: Outer Carton Packaging Unboxing & Sterile Chevron Pouch Retrieval
   - Stage 02: Primary Blister Pack Peel (outer sterile barrier)
   - Stage 03: Secondary Blister Pack Half-Peel (exposing saline water)
   - Stage 04: Saline Drainage into disposal bin & remaining lid removal (<3 min alert)
   - Stage 05: OVD Viscoelastic Priming (0.3 mL into arrow port · Lock & Roll™ hydraulic)
   - Stage 06: Lock & Roll™ Snap Closure (Wing '2' against Wing '1' · Double Click)
   - Stage 07: Lift out injector from blister tray (ergonomic surgical grip)
   - Stage 08: Controlled plunger advancement into 1.65 mm parallel nozzle
   - Stage 09: 3D HUMAN EYE SURGICAL IMPLANTATION (Microscope view, clear corneal
               2.2 mm incision, capsular bag delivery & planar spiral unroll)
   ========================================================================== */

(function () {
  'use strict';

  let scene, camera, renderer, container;
  let mainGroup, syringeGroup, wing2Pivot, plungerGroup, iolGroup, cannulaGroup;
  let cartonBoxGroup, cartonFlapPivot, cartonFlapMesh;
  let primaryLidMesh, secondaryLidMesh, primaryTrayMesh, secondaryTrayMesh;
  let primaryPouchGroup, pouchTopMesh, pouchBottomMesh, pouchTopOrigGeo, pouchBottomOrigGeo;
  let waterMesh, waterOrigGeo, drainContainerGroup, procedureTubGroup, salineStreamMesh, salineSplashGroup;
  let flatLensGroup, rolledLensGroup, ovdStreamMesh, ovdChamberFill;
  let eyeGroup, corneaMesh, irisMesh, pupilMesh, incisionHighlight, capsularBagMesh, iaCannulaGroup, implantedLensGroup;

  let isXRayMode = false;
  let currentStage = 1;
  const TOTAL_STAGES = 9;
  let isVideoPlaying = true;
  let stageProgress = 0;
  let playbackSpeed = 1.0;
  let animClock = 0;

  // Camera navigation (Closer cinematic framing so tray and syringe are large and prominent!)
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;
  let userRotY = -0.16;
  let userRotX = 0.24;
  let targetRotY = -0.16;
  let targetRotX = 0.24;
  let targetCamPos = new THREE.Vector3(0.4, 6.2, 22.0);
  let targetCamLook = new THREE.Vector3(0.4, 1.2, 0.0);
  let currentCamLook = new THREE.Vector3(0.4, 1.2, 0.0);

  // Global resting levels
  const inTrayY = -0.50; // Deeply seated inside packaging tray cavity (zero foil penetration, zero rim clipping!)
  const inTubY = -0.32;  // Seated securely inside sterile procedure tub

  const mats = {};
  const polycarbMeshes = [];
  const cadEdgeLines = [];

  let primaryLidOrigGeo = null;
  let secondaryLidOrigGeo = null;

  /* --------------------------------------------------------------------------
     1. STUDIO SURGICAL ENVIRONMENT & PROCEDURAL TEXTURES
     -------------------------------------------------------------------------- */
  function createOphthalmicTheatreBackground() {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext('2d');

    // Formal Executive Ophthalmic Suite Panorama (Seamless, elegant studio ambiance)
    // Smooth continuous clinical sapphire gradient - ZERO harsh cutoffs or black slabs
    const bg = ctx.createLinearGradient(0, 0, 0, 512);
    bg.addColorStop(0.00, '#0d1f33'); // Upper executive navy
    bg.addColorStop(0.38, '#102740'); // Soft luminous surgical blue ambient
    bg.addColorStop(0.70, '#091829'); // Deep formal clinical slate
    bg.addColorStop(1.00, '#06101c'); // Refined subtle floor vignette
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1024, 512);

    // Focused surgical spotlight beam halo in central field (X=512, Y=220)
    const spotGrad = ctx.createRadialGradient(512, 220, 40, 512, 220, 460);
    spotGrad.addColorStop(0.00, 'rgba(56, 189, 248, 0.16)'); // Soft azure spotlight core
    spotGrad.addColorStop(0.40, 'rgba(14, 165, 233, 0.08)');
    spotGrad.addColorStop(0.75, 'rgba(2, 132, 199, 0.02)');
    spotGrad.addColorStop(1.00, 'rgba(2, 132, 199, 0.00)');
    ctx.fillStyle = spotGrad;
    ctx.fillRect(0, 0, 1024, 512);

    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    return tex;
  }

  function createRadialDropShadowTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');

    // Seamless radial drop shadow (100% smooth falloff to zero - ZERO harsh edges!)
    const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 250);
    grad.addColorStop(0.00, 'rgba(3, 8, 16, 0.65)');
    grad.addColorStop(0.45, 'rgba(3, 8, 16, 0.38)');
    grad.addColorStop(0.80, 'rgba(3, 8, 16, 0.10)');
    grad.addColorStop(1.00, 'rgba(3, 8, 16, 0.00)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function createStudioEnvironment(rendererInstance) {
    const pmrem = new THREE.PMREMGenerator(rendererInstance);
    pmrem.compileEquirectangularShader();

    const envCanvas = document.createElement('canvas');
    envCanvas.width = 512;
    envCanvas.height = 256;
    const ctx = envCanvas.getContext('2d');

    // Deep midnight slate / clinical blue environment
    const bg = ctx.createLinearGradient(0, 0, 0, 256);
    bg.addColorStop(0, '#0a1e32');
    bg.addColorStop(0.5, '#040d18');
    bg.addColorStop(1, '#02050a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 256);

    // Twin coaxial high-CRI operating microscope softbox LED rings
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(150, 42, 60, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(360, 42, 60, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Azure surgical LED ring accent band (creates stunning glints on clear plastics & glass)
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(20, 95, 472, 5);

    // Soft warm medical fill reflection
    ctx.fillStyle = 'rgba(240, 249, 255, 0.45)';
    ctx.fillRect(80, 160, 352, 16);

    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    const envMap = pmrem.fromEquirectangular(envTex).texture;
    envTex.dispose();
    pmrem.dispose();
    return envMap;
  }

  function createSterileDrapeTexture() {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 1024;
    const ctx = c.getContext('2d');

    // 1. Base sterile surgical drape (iconic ophthalmic deep blue-slate)
    const baseGrad = ctx.createRadialGradient(512, 512, 80, 512, 512, 620);
    baseGrad.addColorStop(0.00, '#0f2b46'); // Luminous surgical blue under spotlight
    baseGrad.addColorStop(0.45, '#0a1e34'); // Clean clinical teal-slate
    baseGrad.addColorStop(0.80, '#061422'); // Deep surgical perimeter
    baseGrad.addColorStop(1.00, '#030a12'); // Outer drape edge
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, 1024, 1024);

    // 2. Microscopic woven sterile surgical drape fabric microstructure
    ctx.fillStyle = 'rgba(255, 255, 255, 0.024)';
    for (let y = 0; y < 1024; y += 4) {
      ctx.fillRect(0, y, 1024, 1);
    }
    for (let x = 0; x < 1024; x += 4) {
      ctx.fillRect(x, 0, 1, 1024);
    }

    // 3. Crisp surgical datum perimeter boundary & sterile field outline
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(80, 80, 864, 864);

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(92, 92, 840, 840);

    // 4. Precision corner alignment registration marks
    const corners = [[80, 80], [944, 80], [80, 944], [944, 944]];
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3.0;
    corners.forEach(([cx, cy]) => {
      const dx = cx === 80 ? 1 : -1;
      const dy = cy === 80 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(cx + dx * 16, cy);
      ctx.lineTo(cx + dx * 48, cy);
      ctx.moveTo(cx, cy + dy * 16);
      ctx.lineTo(cx, cy + dy * 48);
      ctx.stroke();
    });

    // 5. Central surgical alignment crosshairs & datum circle
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.32)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(512, 512, 36, 0, Math.PI * 2);
    ctx.moveTo(512 - 55, 512);
    ctx.lineTo(512 + 55, 512);
    ctx.moveTo(512, 512 - 55);
    ctx.lineTo(512, 512 + 55);
    ctx.stroke();

    // 6. Laser-etched metric positioning scale along front edge
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.fillStyle = 'rgba(125, 211, 252, 0.60)';
    ctx.font = '600 13px Inter, sans-serif';
    ctx.textAlign = 'center';

    const rulerY = 890;
    ctx.beginPath();
    ctx.moveTo(140, rulerY);
    ctx.lineTo(884, rulerY);
    ctx.stroke();

    for (let i = -10; i <= 10; i++) {
      const rx = 512 + i * 35;
      const isMajor = i % 5 === 0;
      const tickH = isMajor ? 14 : 7;
      ctx.beginPath();
      ctx.moveTo(rx, rulerY);
      ctx.lineTo(rx, rulerY - tickH);
      ctx.stroke();
      if (isMajor) {
        ctx.fillText(i === 0 ? '0' : (i > 0 ? '+' + i : '' + i), rx, rulerY + 18);
      }
    }

    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function createWing1MoldedTexture() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 256, 256);

    // Molded trapezoidal guide boss with arrow pointing to OVD port (Matches Reference Photo 2!)
    ctx.strokeStyle = 'rgba(235, 248, 255, 0.95)';
    ctx.fillStyle = 'rgba(240, 250, 255, 0.35)';
    ctx.lineWidth = 5;

    // Trapezoid outline pointing left towards central OVD port
    ctx.beginPath();
    ctx.moveTo(40, 128);
    ctx.lineTo(190, 45);
    ctx.lineTo(210, 45);
    ctx.lineTo(210, 211);
    ctx.lineTo(190, 211);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    // Directional Arrow pointing left into the OVD port cup
    ctx.beginPath();
    ctx.moveTo(95, 128);
    ctx.lineTo(45, 128);
    ctx.moveTo(65, 110);
    ctx.lineTo(45, 128);
    ctx.lineTo(65, 146);
    ctx.lineWidth = 6;
    ctx.stroke();

    // Embossed Numeral '1'
    ctx.font = 'bold 95px "Inter", -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.strokeStyle = 'rgba(200, 230, 255, 0.90)';
    ctx.lineWidth = 4;
    ctx.strokeText('1', 148, 128);
    ctx.fillText('1', 148, 128);

    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function createWing2MoldedTexture() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 340;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 256, 340);

    // Molded Square enclosing Numeral '2' (Matches Reference Photo 2!)
    ctx.strokeStyle = 'rgba(235, 248, 255, 0.95)';
    ctx.fillStyle = 'rgba(240, 250, 255, 0.35)';
    ctx.lineWidth = 5;

    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(25, 20, 105, 105, 14);
    } else {
      ctx.rect(25, 20, 105, 105);
    }
    ctx.stroke();
    ctx.fill();

    ctx.font = 'bold 78px "Inter", -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.strokeText('2', 77, 72);
    ctx.fillText('2', 77, 72);

    // Circular badge with directional fold arrow
    ctx.beginPath();
    ctx.arc(180, 72, 36, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();

    // Arrow inside circle
    ctx.beginPath();
    ctx.moveTo(180, 50);
    ctx.lineTo(180, 94);
    ctx.moveTo(164, 76);
    ctx.lineTo(180, 95);
    ctx.lineTo(196, 76);
    ctx.lineWidth = 5;
    ctx.stroke();

    // Lower crescent grip arc ')'
    ctx.beginPath();
    ctx.arc(80, 260, 28, -Math.PI * 0.4, Math.PI * 0.4, false);
    ctx.lineWidth = 5;
    ctx.stroke();

    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function createPouchFilmTexture() {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext('2d');

    // 1. Transparent / translucent medical film base with clear margin
    ctx.fillStyle = 'rgba(240, 248, 255, 0.70)';
    ctx.fillRect(0, 0, 1024, 512);

    // 2. Crystal clear central viewing window (reveals secondary blister tray inside!)
    ctx.clearRect(145, 52, 792, 408);
    ctx.fillStyle = 'rgba(235, 248, 255, 0.10)';
    ctx.fillRect(145, 52, 792, 408);

    // 3. Signature Medical Cyan Heat-Seal Border Band (Matches official diagram!)
    // Solid, vibrant light-cyan medical seal band (width ~36px)
    const sealColor = 'rgba(125, 211, 252, 0.94)'; // #7dd3fc
    const sealBorder = '#0284c7'; // clean surgical blue outline

    ctx.save();
    ctx.fillStyle = sealColor;
    ctx.strokeStyle = sealBorder;
    ctx.lineWidth = 1.8;

    // Top seal band
    ctx.beginPath();
    ctx.rect(140, 20, 830, 36);
    ctx.fill();
    ctx.stroke();

    // Bottom seal band
    ctx.beginPath();
    ctx.rect(140, 456, 830, 36);
    ctx.fill();
    ctx.stroke();

    // Right end seal band
    ctx.beginPath();
    ctx.rect(934, 20, 36, 472);
    ctx.fill();
    ctx.stroke();

    // Left Chevron Seal Band (V-shape pointing to the right into the pouch)
    ctx.beginPath();
    ctx.moveTo(140, 20);
    ctx.lineTo(215, 256);
    ctx.lineTo(140, 492);
    ctx.lineTo(104, 492);
    ctx.lineTo(179, 256);
    ctx.lineTo(104, 20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Delicate inner heat-seal micro-waffle crimp lines
    ctx.strokeStyle = 'rgba(2, 132, 199, 0.35)';
    ctx.lineWidth = 1;
    for (let x = 145; x < 930; x += 10) {
      ctx.beginPath(); ctx.moveTo(x, 22); ctx.lineTo(x + 6, 54); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, 458); ctx.lineTo(x + 6, 490); ctx.stroke();
    }
    ctx.restore();

    // 4. Chevron Pull Tab on Left (Unsealed peel end)
    // Curved peel arrow & "PEEL OPEN" text oriented vertically along the chevron opening
    ctx.save();
    ctx.translate(62, 256);
    ctx.rotate(-Math.PI / 2); // Transverse orientation matching official diagram

    // Curved black peel arrow
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, -14, 15, Math.PI * 0.9, Math.PI * 1.9, false);
    ctx.stroke();
    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(15, -14);
    ctx.lineTo(21, -7);
    ctx.lineTo(9, -7);
    ctx.closePath();
    ctx.fill();

    // PEEL OPEN bold text
    ctx.font = 'bold 20px "Inter", -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PEEL OPEN', 0, 24);
    ctx.restore();

    // 5. Official Transverse Medical Graphics & Regulatory Information (Oriented -90 deg!)
    // Reference: media_1793251005183_156300ff.png

    // A. RayOne Emblem & Logo (x ~ 275)
    ctx.save();
    ctx.translate(275, 256);
    ctx.rotate(-Math.PI / 2);

    // "Ray" in bold black sans-serif
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 44px "Inter", -apple-system, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Ray', -14, 15);

    // Black capsule/pill badge with "One" in white
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(0, -28, 105, 52, 26);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Inter", -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('One', 52, 11);

    // Inner ring inside the 'O'
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(28, 0, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // B. Product Contents Description (x ~ 335)
    ctx.save();
    ctx.translate(335, 256);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#1e293b';
    ctx.font = '600 15px "Inter", -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Contents: One MICS Injection System', 0, -8);
    ctx.fillText('with Intraocular Lens', 0, 14);
    ctx.restore();

    // C. Medical ISO Regulatory Symbols Column (x ~ 410)
    ctx.save();
    ctx.translate(410, 256);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;

    // [STERILE | R] symbol box
    ctx.strokeRect(-140, -14, 82, 26);
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('STERILE | R', -99, 4);

    // (2) Do Not Re-use symbol
    ctx.beginPath();
    ctx.arc(-35, 0, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = 'bold 14px "Inter", sans-serif';
    ctx.fillText('②', -35, 5);
    ctx.font = '9px "Inter", sans-serif';
    ctx.fillText('DO NOT', -35, 18);
    ctx.fillText('RE-USE', -35, 28);

    // [i] Consult Instructions for Use
    ctx.strokeRect(15, -12, 24, 24);
    ctx.font = 'bold 15px serif';
    ctx.fillText('i', 27, 5);
    ctx.font = '8px "Inter", sans-serif';
    ctx.fillText('CONSULT IFU', 27, 24);

    // Do Not Use If Package Damaged
    ctx.strokeRect(75, -12, 26, 24);
    ctx.beginPath(); ctx.moveTo(75, -12); ctx.lineTo(101, 12); ctx.stroke();
    ctx.font = '8px "Inter", sans-serif';
    ctx.fillText('DO NOT USE IF', 88, 22);
    ctx.fillText('DAMAGED', 88, 32);
    ctx.restore();

    // D. Manufacturer Info: ▲ Rayner & Address (x ~ 495)
    ctx.save();
    ctx.translate(495, 256);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';

    // Triangle icon & Rayner
    ctx.beginPath();
    ctx.moveTo(-110, -2);
    ctx.lineTo(-98, 12);
    ctx.lineTo(-122, 12);
    ctx.closePath();
    ctx.fill();

    ctx.font = 'bold 24px "Inter", -apple-system, sans-serif';
    ctx.fillText('Rayner', -60, 10);

    ctx.font = '11px "Inter", sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('The Rayner Innovation Centre', 40, -4);
    ctx.fillText('10 Dominion Way, Worthing,', 40, 10);
    ctx.fillText('West Sussex, BN14 8AQ, United Kingdom', 40, 24);
    ctx.restore();

    // E. CE 2797 Mark (x ~ 580)
    ctx.save();
    ctx.translate(580, 256);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 28px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CE', 0, -4);
    ctx.font = 'bold 18px "Inter", sans-serif';
    ctx.fillText('2797', 0, 20);
    ctx.restore();

    // F. Part Number PP0000004 along top cyan seal band (horizontal, x ~ 620, y ~ 45)
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px "Inter", sans-serif';
    ctx.fillText('PP0000004', 620, 42);
    ctx.restore();

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }
  function createPouchBackingTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 256;
    const ctx = c.getContext('2d');

    // Tyvek pure sterile medical white backing
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 512, 256);

    // Heat-seal embossed border
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.65)';
    ctx.lineWidth = 16;
    ctx.strokeRect(8, 8, 496, 240);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(18, 18, 476, 220);
    ctx.setLineDash([]);

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

    function createGreyFoilTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 256;
    const ctx = c.getContext('2d');

    // Authentic brushed surgical aluminum metallic foil gradient (NO WORDS)
    const foilGrad = ctx.createLinearGradient(0, 0, 512, 256);
    foilGrad.addColorStop(0, '#c7d2de');
    foilGrad.addColorStop(0.20, '#9aa8b8');
    foilGrad.addColorStop(0.45, '#e4ecf4');
    foilGrad.addColorStop(0.70, '#94a3b4');
    foilGrad.addColorStop(1, '#c2ceda');
    ctx.fillStyle = foilGrad;
    ctx.fillRect(0, 0, 512, 256);

    // Fine brushed foil micro-lines across the foil surface
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1;
    for (let y = 3; y < 256; y += 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    // Heat-seal perimeter crimp border (clean medical look - ZERO TEXT)
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 500, 244);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, 488, 232);

    // Subtle waffle heat-seal micro-emboss along edges
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(16, 16, 480, 224);
    ctx.setLineDash([]);

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  function createBlisterLidTexture(packTitle, packSubtitle) {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 256;
    const ctx = c.getContext('2d');

    // Tyvek sterile medical peel lid background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 512, 256);

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 6;
    ctx.strokeRect(12, 12, 488, 232);

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(20, 20, 472, 216);
    ctx.setLineDash([]);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px "Inter", -apple-system, sans-serif';
    ctx.fillText('Rayner', 38, 68);

    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 18px "Inter", -apple-system, sans-serif';
    ctx.fillText('RayOne® PRELOADED IOL', 170, 68);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 22px "Inter", -apple-system, sans-serif';
    ctx.fillText(packTitle || 'STERILE BARRIER PACK', 38, 116);

    ctx.fillStyle = '#64748b';
    ctx.font = '15px "Inter", -apple-system, sans-serif';
    ctx.fillText(packSubtitle || 'Single-Use Injector · Hydrophilic Acrylic', 38, 146);

    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(380, 180);
    ctx.lineTo(470, 180);
    ctx.lineTo(470, 220);
    ctx.lineTo(380, 220);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Inter", -apple-system, sans-serif';
    ctx.fillText('PEEL HERE ➔', 390, 206);

    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function createRaynerBarrelTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 256;
    const ctx = c.getContext('2d');

    ctx.clearRect(0, 0, 512, 256);

    // Embossed "RAYNER" logo along barrel
    ctx.fillStyle = '#0f2942';
    ctx.font = '900 36px "Inter", "Helvetica Neue", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('R A Y N E R', 256, 95);

    // Subtle 3D emboss shadow highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '900 36px "Inter", "Helvetica Neue", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('R A Y N E R', 257, 93);

    // Longitudinal grip ribs along the bottom of the barrel
    ctx.fillStyle = '#0a2540';
    for (let y = 150; y <= 210; y += 18) {
      ctx.fillRect(80, y, 350, 6);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillRect(80, y - 2, 350, 2);
      ctx.fillStyle = '#0a2540';
    }

    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function createOVDBarrelTexture() {
    // AUTHENTIC 1.0 mL OPHTHALMIC VISCOELASTIC GLASS BARREL TEXTURE
    // Vertical UV alignment: 1.0 mL near top (y=80), 0.0 mL near bottom (y=440)
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');

    ctx.clearRect(0, 0, 512, 512);

    // Subtle glass reflections
    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
    grad.addColorStop(0.25, 'rgba(255, 255, 255, 0.22)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.04)');
    grad.addColorStop(0.75, 'rgba(255, 255, 255, 0.18)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Graduation ruler along vertical axis (maps to cylinder height!)
    const rulerX = 230;
    const topY = 75;
    const botY = 445;

    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(rulerX, topY);
    ctx.lineTo(rulerX, botY);
    ctx.stroke();

    const totalSteps = 10;
    for (let i = 0; i <= totalSteps; i++) {
      // i = 0 is 1.0 mL at top, i = 10 is 0.0 mL at bottom
      const y = topY + i * ((botY - topY) / totalSteps);
      const val = ((10 - i) * 0.1).toFixed(1);
      const isMajor = (10 - i) % 2 === 0;
      const tickW = isMajor ? 32 : 18;

      ctx.beginPath();
      ctx.moveTo(rulerX, y);
      ctx.lineTo(rulerX + tickW, y);
      ctx.stroke();

      if (isMajor && val !== '0.0') {
        ctx.font = 'bold 22px "Inter", sans-serif';
        ctx.fillStyle = '#0284c7';
        ctx.fillText(val, rulerX + tickW + 8, y + 7);
      }
    }

    // Medical label centered on opposite quadrant
    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.fillStyle = '#0284c7';
    ctx.fillText('RayVisc® OVD', 35, 240);
    ctx.font = '15px "Inter", sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('1.0 mL • 1.4% NaHA', 35, 268);

    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function createIrisTexture() {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 1024;
    const ctx = c.getContext('2d');

    // Rich hazel-blue ophthalmic surgical iris
    const baseGrad = ctx.createRadialGradient(512, 512, 160, 512, 512, 512);
    baseGrad.addColorStop(0.00, '#0c1a26'); // Inner pupillary zone margin
    baseGrad.addColorStop(0.18, '#1e3a5f'); // Pupillary sphincter zone
    baseGrad.addColorStop(0.38, '#2563eb'); // Collarette boundary
    baseGrad.addColorStop(0.65, '#0ea5e9'); // Ciliary zone striae
    baseGrad.addColorStop(0.85, '#0369a1'); // Peripheral iris base
    baseGrad.addColorStop(0.96, '#0f172a'); // Outer limbal border
    baseGrad.addColorStop(1.00, '#020617'); // Limbal junction
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, 1024, 1024);

    ctx.save();
    ctx.translate(512, 512);

    // 1. Radial trabecular striae and collagen fibrils (360-degree high density)
    for (let i = 0; i < 720; i++) {
      const a = (i / 720) * Math.PI * 2;
      const lenVar = Math.sin(i * 13) * 35;
      const rInner = 175 + (i % 7) * 2;
      const rOuter = 495 - lenVar;

      ctx.beginPath();
      const isHighlight = (i % 5 === 0);
      const isDarkCrypt = (i % 11 === 0);
      if (isDarkCrypt) {
        ctx.strokeStyle = 'rgba(2, 6, 23, 0.65)';
        ctx.lineWidth = 2.2;
      } else if (isHighlight) {
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.75)';
        ctx.lineWidth = 1.6;
      } else {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.40)';
        ctx.lineWidth = 0.9;
      }
      ctx.moveTo(Math.cos(a) * rInner, Math.sin(a) * rInner);
      ctx.lineTo(Math.cos(a) * rOuter, Math.sin(a) * rOuter);
      ctx.stroke();
    }

    // 2. Collarette ring with zigzag crypts of Fuchs
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(224, 242, 254, 0.85)';
    ctx.lineWidth = 3.2;
    for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.02) {
      const r = 295 + Math.sin(a * 28) * 14 + Math.cos(a * 14) * 8;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (a === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 3. Pupillary sphincter muscle band (circumferential fibers)
    for (let r = 185; r < 235; r += 8) {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(12, 74, 110, 0.55)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    ctx.restore();

    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function createFundusRedReflexTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');

    // Authentic ophthalmic microscope retro-illuminated fundus glow
    const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
    grad.addColorStop(0.00, '#ff7a45'); // Warm golden-amber optic nerve glow
    grad.addColorStop(0.35, '#d4380d'); // Brilliant retro-illumination red reflex
    grad.addColorStop(0.68, '#820014'); // Deep choroidal vascular red
    grad.addColorStop(0.92, '#430006'); // Peripheral retina
    grad.addColorStop(1.00, '#1f0003'); // Outer equator shadow
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle choroidal vascular tessellation
    ctx.save();
    ctx.translate(256, 256);
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 120, 60, 0.18)';
      ctx.lineWidth = 4;
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(
        Math.cos(a + 0.3) * 140,
        Math.sin(a + 0.3) * 140,
        Math.cos(a) * 240,
        Math.sin(a) * 240
      );
      ctx.stroke();
    }
    ctx.restore();

    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function createScleraVesselTexture() {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext('2d');

    // Equirectangular Scleral Canvas:
    // y = 0: Limbus (anterior boundary meeting clear cornea)
    // y = 512: Posterior globe pole
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
    bgGrad.addColorStop(0.00, '#ffffff'); // Clean white at limbus
    bgGrad.addColorStop(0.20, '#faf7f5'); // Soft pearlescent ivory
    bgGrad.addColorStop(0.60, '#f5ebe5'); // Micro-vascular undertone
    bgGrad.addColorStop(1.00, '#ebd7cf'); // Posterior equator
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // 1. Delicate deep episcleral vascular branches (subtle diffuse pink/burgundy plexus)
    for (let i = 0; i < 32; i++) {
      const startX = (i / 32) * 1024 + ((i * 13) % 17);
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(215, 65, 75, 0.22)';
      ctx.lineWidth = 3.2;
      let x = startX;
      let y = 460;
      ctx.moveTo(x, y);
      while (y > 35) {
        y -= 18;
        x += Math.sin(y * 0.08 + i) * 6;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // 2. Fine superficial conjunctival micro-capillaries (crisp, delicate branching vessels)
    for (let i = 0; i < 54; i++) {
      const startX = (i / 54) * 1024 + ((i * 19) % 23);
      ctx.beginPath();
      ctx.strokeStyle = (i % 3 === 0) ? 'rgba(195, 30, 40, 0.55)' : 'rgba(225, 55, 65, 0.38)';
      ctx.lineWidth = 1.0 + (i % 2) * 0.6;
      let x = startX;
      let y = 440;
      ctx.moveTo(x, y);
      while (y > 22) {
        y -= 14;
        x += Math.sin(y * 0.12 + i) * 5;
        ctx.lineTo(x, y);

        // Branching sub-capillary
        if (y > 80 && y < 320 && (y % 40 < 14)) {
          const bAngle = (i % 2 === 0) ? 0.35 : -0.35;
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.sin(bAngle) * 22, y - Math.cos(bAngle) * 22);
          ctx.moveTo(x, y);
        }
      }
      ctx.stroke();
    }

    // 3. Limbal transition zone (delicate translucent grey-blue band where sclera meets cornea)
    const limbusGrad = ctx.createLinearGradient(0, 0, 0, 28);
    limbusGrad.addColorStop(0.00, 'rgba(100, 140, 175, 0.55)');
    limbusGrad.addColorStop(0.50, 'rgba(125, 160, 190, 0.25)');
    limbusGrad.addColorStop(1.00, 'rgba(255, 255, 255, 0.00)');
    ctx.fillStyle = limbusGrad;
    ctx.fillRect(0, 0, 1024, 28);

    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  /* --------------------------------------------------------------------------
     2. INITIALIZATION
     -------------------------------------------------------------------------- */
  let initRetries = 0;
  function initSimulator() {
    container = document.getElementById('galaxy-delivery-canvas-wrap');
    const canvas = document.getElementById('galaxy-delivery-canvas');
    if (!container || !canvas) return;

    if (typeof THREE === 'undefined') {
      if (initRetries++ < 50) {
        setTimeout(initSimulator, 100);
      } else {
        console.error('Three.js failed to load within 5s');
      }
      return;
    }

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 620;

    scene = new THREE.Scene();
    scene.background = createOphthalmicTheatreBackground();

    camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.copy(targetCamPos);
    camera.lookAt(targetCamLook);

    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    scene.environment = createStudioEnvironment(renderer);

    // Focused Operating Theatre Lighting Rig (Calibrated contrast: whole procedure highlighted)
    const ambLight = new THREE.AmbientLight(0xdbeafe, 0.72);
    scene.add(ambLight);

    // Primary High-CRI Coaxial Surgical Luminaire (Locks focus directly on operating procedure)
    const surgicalSpot = new THREE.SpotLight(0xffffff, 3.6, 50, Math.PI / 3.2, 0.50, 1.0);
    surgicalSpot.position.set(0.5, 12.0, 4.5);
    surgicalSpot.target.position.set(-1.5, 0.0, 0.0);
    scene.add(surgicalSpot);
    scene.add(surgicalSpot.target);

    // Electric Azure Rim Accent (Highlights translucent polycarbonate walls, syringe wings & fluid streams)
    const rimAccent = new THREE.DirectionalLight(0x38bdf8, 1.95);
    rimAccent.position.set(7, 3, -6);
    scene.add(rimAccent);

    // Surgical Daylight Key Fill (Crisp high-CRI clarity on packaging graphics & graduations)
    const daylightFill = new THREE.DirectionalLight(0xf8fafc, 1.15);
    daylightFill.position.set(-6, 8, 7);
    scene.add(daylightFill);

    // Table Drape Ambient Bounce from Sterile Blue Drape
    const underFill = new THREE.DirectionalLight(0x0c4a6e, 0.65);
    underFill.position.set(0, -4, 3);
    scene.add(underFill);

    // Luminous Surgical Cyan Theater Accent (Atmospheric back-glow)
    const theatreAccent = new THREE.PointLight(0x0284c7, 1.6, 22, 1.1);
    theatreAccent.position.set(0, 3.5, -5.5);
    scene.add(theatreAccent);

    // Atmospheric Depth Fog (Softly recedes distant periphery while keeping foreground 100% crisp)
    scene.fog = new THREE.FogExp2(0x0a1828, 0.010);

    mainGroup = new THREE.Group();
    scene.add(mainGroup);

    buildMaterials();
    buildSurgicalTheatreStage();
    buildOuterCartonBox();
    buildCleanOphthalmicBlisterPacks();
    buildSalineDisposalContainer();
    buildProcedureTub();
    buildRayOneInjectorSyringe();
    buildGalaxySpiralLens();
    buildRefinedOVDSyringe();
    buildRealistic3DHumanEye();

    bindControls();
    setStage(1, true);
    animate();
  }

    /* --------------------------------------------------------------------------
     1B. OFFICIAL RAYONE® GALAXY PHARMACEUTICAL CARTON PACKAGING TEXTURES
     Pixel-perfect reproduction of official Rayner RayOne Galaxy packaging:
     - Top: Clean white cardstock, bold geometric GALAXY logo, concentric spiral optic loops, specs chips
     - Front: GALAXY brand, recessed clinical Rx label window with barcode, Rayner logo & "PULL HERE ◄" tab
     - Back: Multilingual medical indications, CE 0088, STERILE EO, IFU book & Raypro outcome mark
     - Flap: Top blue outcomes banner, spec table (+21.50 D, LOT, REF, EXP), tuck tab
     - Left: Closed end panel with vertical GALAXY & Rayner marks
     -------------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------
     1B. OFFICIAL RAYONE® GALAXY PRESENTATION BOX TEXTURES (EXACT PHOTO REPRODUCTION)
     Matches media_1793347035070_9e3428d3.jpg & assets/rayner/galaxy.webp:
     - Luxury deep obsidian midnight navy (#0d1b2a)
     - Pure white geometric GALAXY logo
     - Electric cyan concentric spiral optic loops (#38bdf8, #0ea5e9, #0284c7)
     - RAYONE PRELOADED SPIRAL IOL
     - ▲ Rayner logo in white
     - 3 YEARS FREE PATIENT OUTCOMES DATA bottom strip
     -------------------------------------------------------------------------- */
  function createDarkGalaxyFrontTexture() {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext('2d');

    // Deep luxury obsidian midnight navy
    ctx.fillStyle = '#0d1b2a';
    ctx.fillRect(0, 0, 1024, 512);

    // Subtle vignette
    const vig = ctx.createLinearGradient(0, 0, 1024, 512);
    vig.addColorStop(0, 'rgba(17, 34, 53, 0.4)');
    vig.addColorStop(0.5, 'rgba(0, 0, 0, 0.0)');
    vig.addColorStop(1, 'rgba(10, 20, 31, 0.5)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, 1024, 512);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    ctx.strokeRect(3, 3, 1018, 506);

    // GALAXY Title (Geometric Modern Typography)
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 68px "Segoe UI", Arial, sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('GALAXY', 85, 145);

    // Subtitle
    ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.letterSpacing = '1.5px';
    ctx.fillText('RAYONE PRELOADED', 88, 305);
    ctx.fillText('SPIRAL IOL', 88, 334);

    // Rayner Logo (▲ Rayner) in White
    ctx.beginPath();
    ctx.moveTo(490, 342);
    ctx.lineTo(505, 312);
    ctx.lineTo(520, 342);
    ctx.closePath();
    ctx.fill();

    ctx.font = 'bold 34px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Rayner', 532, 340);

    // Electric Cyan Concentric Spiral Optic Loops
    const cx = 690;
    const cy = 160;
    const ringColors = [
      '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#1e40af', '#172554'
    ];
    for (let idx = 0; idx < ringColors.length; idx++) {
      const r = 50 + idx * 34;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.72, 0, Math.PI * 0.69, Math.PI * 1.92);
      ctx.strokeStyle = ringColors[idx];
      ctx.lineWidth = 6;
      ctx.stroke();
    }

    // Bottom Outcomes strip
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 440);
    ctx.lineTo(984, 440);
    ctx.stroke();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(62, 462, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(62, 462, 5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = 'bold 13px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('3 YEARS FREE PATIENT OUTCOMES DATA · LEARN MORE AT RAYNER.COM/RAYPRO', 86, 466);

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  function createDarkGalaxyBackTexture() {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#0b1622';
    ctx.fillRect(0, 0, 1024, 512);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    ctx.strokeRect(3, 3, 1018, 506);

    ctx.font = '500 15px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('EN  One micro-incision injector with preloaded spiral intraocular lens', 60, 65);
    ctx.fillText('DE  Ein Mikro-Inzisions-System mit vorgeladener Intraokularlinse', 60, 100);
    ctx.fillText('FR  Un système d\'injection par micro-incision avec implant intraoculaire', 60, 135);
    ctx.fillText('ES  Un sistema de micro incisión con lente intraocular precargada', 60, 170);
    ctx.fillText('IT   Un sistema per microincisione con lente intraoculare precaricata', 60, 205);
    ctx.fillText('PT  Um sistema de injecção por micro-incisão com lente intra-ocular', 60, 240);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 280);
    ctx.lineTo(964, 280);
    ctx.stroke();

    ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Rayner Intraocular Lenses Ltd', 60, 315);
    ctx.font = '500 13px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('10 Dominion Way, Worthing, West Sussex, BN14 8AQ, United Kingdom · rayner.com', 60, 345);
    ctx.fillText('EC|REP: Rayner Surgical GmbH, Freiburg, Germany', 60, 375);

    ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('CE 0088   STERILE EO   15°C — 30°C   DO NOT REUSE ②   CONSULT IFU [i]', 60, 420);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('REF RAO800G · LOT 847291 · DIOPTER +21.5 D', 60, 455);

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  function createDarkGalaxySideTexture() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 512;
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#0a141f';
    ctx.fillRect(0, 0, 256, 512);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.strokeRect(3, 3, 250, 506);

    ctx.font = '900 34px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.letterSpacing = '3px';
    ctx.fillText('GALAXY', 60, 200);

    ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('SPIRAL IOL', 70, 245);

    ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('▲ Rayner', 70, 305);

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

function createCartonGalaxyTopTexture() {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 420;
    const ctx = c.getContext('2d');

    // Clean pharmaceutical white cardstock
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 1024, 420);

    // Subtle paper fold score crease around perimeter
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(3, 3, 1018, 414);

    // Subtle lighting sheen
    const sheen = ctx.createLinearGradient(0, 0, 1024, 420);
    sheen.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    sheen.addColorStop(0.5, 'rgba(255, 255, 255, 0.0)');
    sheen.addColorStop(1, 'rgba(241, 245, 249, 0.3)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, 1024, 420);

    // Top regulatory bar
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(48, 42);
    ctx.lineTo(976, 42);
    ctx.stroke();

    ctx.font = 'bold 12px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('CE 0088', 52, 26);
    ctx.fillText('STERILE  EO', 145, 26);
    ctx.font = '500 12px "Segoe UI", Arial, sans-serif';
    ctx.fillText('15°C — 30°C', 260, 26);
    ctx.fillText('DO NOT REUSE  ②', 380, 26);
    ctx.fillText('CONSULT IFU  [i]', 540, 26);
    ctx.font = 'bold 12px "Segoe UI", Arial, sans-serif';
    ctx.fillText('REF RAO800G · LOT 847291', 750, 26);

    // Bold GALAXY Logo (Geometric Modern Typography)
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 68px "Segoe UI", Arial, sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('GALAXY', 52, 135);

    // Subtitle
    ctx.font = 'bold 17px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.letterSpacing = '1px';
    ctx.fillText('RAYONE PRELOADED SPIRAL IOL', 54, 172);

    ctx.font = '500 13px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Fully Preloaded Injector System · 0% Light Loss AI Optic', 54, 196);

    // Specification Badges (+21.5 D Diopter Chip)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(52, 235, 185, 82, 8);
    else ctx.rect(52, 235, 185, 82);
    ctx.fill();

    ctx.font = 'bold 11px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('DIOPTER / SE', 68, 258);
    ctx.font = '900 32px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('+21.5 D', 68, 298);

    // Incision size chip
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(252, 235, 160, 82, 8);
    else ctx.rect(252, 235, 160, 82);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = 'bold 11px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('INCISION', 268, 258);
    ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('2.2 mm', 268, 295);

    // Overall Diameter chip
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(428, 235, 160, 82, 8);
    else ctx.rect(428, 235, 160, 82);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = 'bold 11px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('OVERALL Ø', 444, 258);
    ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('12.5 mm', 444, 295);

    // Iconic Concentric Spiral Optic Rings (Top Right)
    const cx = 820;
    const cy = 205;
    const ringColors = [
      'rgba(14, 165, 233, 0.95)',
      'rgba(2, 132, 199, 0.85)',
      'rgba(3, 105, 161, 0.75)',
      'rgba(71, 85, 105, 0.60)',
      'rgba(148, 163, 184, 0.50)',
      'rgba(203, 213, 225, 0.40)'
    ];
    for (let idx = 0; idx < ringColors.length; idx++) {
      const r = 40 + idx * 26;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.72, 0, Math.PI * 0.65, Math.PI * 2.0);
      ctx.strokeStyle = ringColors[idx];
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    // Rayner Logo (▲ Rayner) below spiral rings
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(740, 342);
    ctx.lineTo(754, 316);
    ctx.lineTo(768, 342);
    ctx.closePath();
    ctx.fill();

    ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Rayner', 778, 340);

    // Bottom origin bar
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(48, 385);
    ctx.lineTo(976, 385);
    ctx.stroke();

    ctx.font = '500 11px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Rayner Intraocular Lenses Ltd · 10 Dominion Way, Worthing, BN14 8AQ, United Kingdom · rayner.com', 52, 402);

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  function createCartonGalaxyFrontTexture() {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 160;
    const ctx = c.getContext('2d');

    // Clean pharmaceutical white cardstock
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 1024, 160);

    // Edge crease
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, 1020, 156);

    // Left GALAXY Branding
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 36px "Segoe UI", Arial, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('GALAXY', 36, 75);

    ctx.font = 'bold 11px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('PRELOADED SPIRAL IOL', 38, 104);

    // Recessed Medical Prescription Label Window in Center (Authentic to official photo!)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(310, 20, 450, 120, 6);
    else ctx.rect(310, 20, 450, 120);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = 'bold 13px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('RayOne® Galaxy · Model RAO800G', 326, 42);

    ctx.font = '500 12px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('Power: +21.50 D  ·  SE: 21.50 D  ·  Ø 12.5 mm', 326, 64);

    ctx.font = '500 11px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('LOT 847291  ·  EXP 2028-12-31  ·  STERILE EO', 326, 84);

    // Mini barcode
    ctx.fillStyle = '#0f172a';
    const barX = 326;
    const barY = 96;
    for (let b = 0; b < 280; b += 3) {
      if ((b * 7 + 11) % 9 > 2) {
        ctx.fillRect(barX + b, barY, 2, 24);
      }
    }
    ctx.font = '10px monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText('(01)05055248102345', 618, 114);

    // Right: Rayner Logo & Authentic "PULL HERE" Tab (Matches official photo!)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(785, 55);
    ctx.lineTo(797, 34);
    ctx.lineTo(809, 55);
    ctx.closePath();
    ctx.fill();

    ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Rayner', 818, 54);

    // Deep slate-blue pull tab with thumb notch
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(785, 82, 205, 52, 4);
    else ctx.rect(785, 82, 205, 52);
    ctx.fill();

    // Thumb pull arc
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(785, 108, 14, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();

    ctx.font = 'bold 13px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('PULL HERE ◄', 835, 114);

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  function createCartonGalaxyBackTexture() {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 160;
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 1024, 160);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, 1020, 156);

    ctx.font = '500 11px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('EN  One micro-incision injector with preloaded spiral intraocular lens', 36, 26);
    ctx.fillText('DE  Ein Mikro-Inzisions-System mit vorgeladener Intraokularlinse', 36, 48);
    ctx.fillText('FR  Un système d\'injection par micro-incision avec implant intraoculaire', 36, 70);
    ctx.fillText('ES  Un sistema de micro incisión con lente intraocular precargada', 36, 92);
    ctx.fillText('IT   Un sistema per microincisione con lente intraoculare precaricata', 36, 114);
    ctx.fillText('PT  Um sistema de injecção por micro-incisão com lente intra-ocular', 36, 136);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(680, 18);
    ctx.lineTo(680, 142);
    ctx.stroke();

    ctx.font = 'bold 12px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('Rayner Intraocular Lenses Ltd', 705, 30);
    ctx.font = '500 10px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('10 Dominion Way, Worthing, BN14 8AQ, UK', 705, 52);
    ctx.font = 'bold 11px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('CE 0088  ·  STERILE EO  ·  15-30°C', 705, 78);
    ctx.font = '500 10px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('EC|REP: Rayner Surgical GmbH, Freiburg, DE', 705, 102);
    ctx.font = 'bold 9px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#0284c7';
    ctx.fillText('3 YEARS FREE PATIENT OUTCOMES DATA: RAYPRO.COM', 705, 128);

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  function createCartonGalaxyFlapTexture() {
    const c = document.createElement('canvas');
    c.width = 420;
    c.height = 160;
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 420, 160);

    // Top blue outcomes banner (Matches authentic unboxing video!)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, 420, 32);

    ctx.font = 'bold 10px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('PEER PATIENT OUTCOMES DATA · RAYPRO.COM', 24, 21);

    // Specification table body
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(8, 40, 404, 112, 4);
    else ctx.rect(8, 40, 404, 112);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('RayOne® Galaxy', 22, 62);

    ctx.font = '500 11px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('REF RAO800G', 22, 82);
    ctx.fillText('LOT 847291', 22, 98);

    ctx.font = 'bold 13px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#0284c7';
    ctx.fillText('SE: +21.50 D  Sph: +21.50 D', 22, 118);

    ctx.font = '500 10px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('EXP 2028-12-31  ·  STERILE EO', 22, 138);

    // Rayner Logo on flap
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(270, 72);
    ctx.lineTo(280, 56);
    ctx.lineTo(290, 72);
    ctx.closePath();
    ctx.fill();
    ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Rayner', 296, 72);

    // QR scan box
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(290, 88, 95, 55, 4);
    else ctx.rect(290, 88, 95, 55);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = 'bold 10px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('SCAN IFU', 312, 120);

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  function createCartonGalaxyLeftTexture() {
    const c = document.createElement('canvas');
    c.width = 420;
    c.height = 160;
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 420, 160);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, 416, 156);

    ctx.fillStyle = '#0f172a';
    ctx.font = '900 32px "Segoe UI", Arial, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('GALAXY', 30, 75);

    ctx.font = 'bold 11px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('PRELOADED SPIRAL IOL', 32, 102);

    // Rayner logo
    ctx.beginPath();
    ctx.moveTo(260, 68);
    ctx.lineTo(272, 50);
    ctx.lineTo(284, 68);
    ctx.closePath();
    ctx.fill();
    ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Rayner', 292, 68);

    ctx.font = '500 10px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('CE 0088 · LOT 847291', 260, 100);

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

/* --------------------------------------------------------------------------
     3. MATERIALS
     -------------------------------------------------------------------------- */
  function buildMaterials() {
    // Authentic RayOne Medical-Grade Polycarbonate (Matches official studio photo media_1793413332402_e9107fe8.png!)
    // Ultra-clear optical polymer with true refractive index (IOR 1.586) and glossy specular clearcoat
    mats.polycarbClear = new THREE.MeshPhysicalMaterial({
      color: 0xf2f8ff, // Crystal-clear medical polycarbonate with subtle clinical ice sheen
      roughness: 0.05,
      metalness: 0.02,
      transmission: 0.94,
      ior: 1.586, // Exact optical index of medical polycarbonate
      thickness: 0.35,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    mats.polycarbXRay = new THREE.MeshPhysicalMaterial({
      color: 0x0c315e,
      roughness: 0.15,
      metalness: 0.10,
      transparent: true,
      opacity: 0.22,
      clearcoat: 0.8,
      side: THREE.DoubleSide
    });

    // Frosted structural ribs, clips & wings (Authentic satin-finish clear polymer matching official photo!)
    mats.polycarbFrosted = new THREE.MeshPhysicalMaterial({
      color: 0xebf4fc, // Clean frosted satin polycarbonate (matches photo - NOT artificial dark blue!)
      roughness: 0.22,
      metalness: 0.02,
      transmission: 0.78,
      ior: 1.54,
      transparent: true,
      opacity: 0.86,
      side: THREE.DoubleSide,
      depthWrite: true
    });

    mats.cadEdge = new THREE.LineBasicMaterial({
      color: 0x38bdf8, // Subtle specular silhouette definition
      transparent: true,
      opacity: 0.35
    });

    mats.cadEdgeStrong = new THREE.LineBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.60
    });

    mats.darkGalaxyFront = new THREE.MeshStandardMaterial({
      map: createDarkGalaxyFrontTexture(),
      color: 0xffffff,
      roughness: 0.38,
      metalness: 0.04,
      transparent: true,
      opacity: 1.0,
      side: THREE.FrontSide,
      depthWrite: true
    });

    mats.darkGalaxyBack = new THREE.MeshStandardMaterial({
      map: createDarkGalaxyBackTexture(),
      color: 0xffffff,
      roughness: 0.38,
      metalness: 0.04,
      transparent: true,
      opacity: 1.0,
      side: THREE.FrontSide,
      depthWrite: true
    });

    mats.darkGalaxySide = new THREE.MeshStandardMaterial({
      map: createDarkGalaxySideTexture(),
      color: 0xffffff,
      roughness: 0.38,
      metalness: 0.04,
      transparent: true,
      opacity: 1.0,
      side: THREE.FrontSide,
      depthWrite: true
    });

    mats.darkGalaxyTop = new THREE.MeshStandardMaterial({
      color: 0x0e1b29,
      roughness: 0.40,
      metalness: 0.04,
      transparent: true,
      opacity: 1.0,
      side: THREE.FrontSide,
      depthWrite: true
    });

    mats.cartonInnerLiner = new THREE.MeshStandardMaterial({
      color: 0x182636,
      roughness: 0.45,
      metalness: 0.08,
      transparent: true,
      opacity: 1.0,
      side: THREE.FrontSide,
      depthWrite: true
    });

    mats.cartonInnerBed = new THREE.MeshStandardMaterial({
      color: 0x050c14,
      roughness: 0.85,
      side: THREE.BackSide,
      transparent: true,
      opacity: 1.0,
      depthWrite: true
    });

    mats.cartonShadow = new THREE.MeshBasicMaterial({
      color: 0x020814,
      transparent: true,
      opacity: 0.40
    });
    mats.cartonTop = new THREE.MeshStandardMaterial({
      map: createCartonGalaxyTopTexture(),
      color: 0xffffff,
      roughness: 0.42,
      metalness: 0.02,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
      depthWrite: true
    });

    mats.cartonFront = new THREE.MeshStandardMaterial({
      map: createCartonGalaxyFrontTexture(),
      color: 0xffffff,
      roughness: 0.42,
      metalness: 0.02,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
      depthWrite: true
    });

    mats.cartonBack = new THREE.MeshStandardMaterial({
      map: createCartonGalaxyBackTexture(),
      color: 0xffffff,
      roughness: 0.42,
      metalness: 0.02,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
      depthWrite: true
    });

    mats.cartonLeft = new THREE.MeshStandardMaterial({
      map: createCartonGalaxyLeftTexture(),
      color: 0xffffff,
      roughness: 0.42,
      metalness: 0.02,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
      depthWrite: true
    });

    mats.cartonBottom = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.50,
      metalness: 0.02,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
      depthWrite: true
    });

    mats.cartonFlap = new THREE.MeshStandardMaterial({
      map: createCartonGalaxyFlapTexture(),
      color: 0xffffff,
      roughness: 0.42,
      metalness: 0.02,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
      depthWrite: true
    });

    mats.cartonInterior = new THREE.MeshStandardMaterial({
      color: 0x334155, // Realistic dark interior cavity shadow
      roughness: 0.85,
      metalness: 0.02,
      side: THREE.BackSide
    });

    mats.whitePlunger = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.24,
      metalness: 0.04
    });

    mats.rubberStopper = new THREE.MeshStandardMaterial({
      color: 0x24303f,
      roughness: 0.75,
      metalness: 0.08
    });

    mats.ovdGlass = new THREE.MeshPhysicalMaterial({
      color: 0xf0f9ff,
      roughness: 0.06,
      metalness: 0.02,
      transmission: 0.88,
      thickness: 0.25,
      transparent: true,
      opacity: 0.88,
      clearcoat: 1.0
    });

    mats.dropletWater = new THREE.MeshPhysicalMaterial({
      color: 0x90e0ff,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
      roughness: 0.02,
      metalness: 0.02,
      transmission: 0.95,
      transparent: true,
      opacity: 0.92
    });

    mats.siliconeBlue = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.28,
      metalness: 0.06
    });

    // AUTHENTIC RAYNER RAYACRYL® HYDROPHOBIC ACRYLIC OPTIC (Rayner GALAXY EDOF)
    mats.iolOptic = new THREE.MeshPhysicalMaterial({
      color: 0xf0f9ff,
      emissive: 0x0284c7,
      emissiveIntensity: 0.05,
      roughness: 0.015,
      metalness: 0.01,
      transmission: 0.94,
      ior: 1.46,
      thickness: 0.32,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      transparent: true,
      opacity: 0.88,
      reflectivity: 0.98,
      side: THREE.DoubleSide
    });

    // RAYNER ANTI-VAULTING HAPTIC (AVH®) - Crystal-Clear Acrylic with 360° Square Edge
    mats.iolHaptic = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      emissive: 0x0284c7,
      emissiveIntensity: 0.04,
      roughness: 0.02,
      metalness: 0.01,
      transmission: 0.95,
      ior: 1.46,
      thickness: 0.22,
      transparent: true,
      opacity: 0.86,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      reflectivity: 0.96,
      side: THREE.DoubleSide
    });

    // VIBRANT COHESIVE LIGHT BLUE OPHTHALMIC VISCOELASTIC GEL (100% CLEARLY VISIBLE LIQUID)
    mats.ovdGel = new THREE.MeshStandardMaterial({
      color: 0x00b4d8,         // Vibrant cohesive medical light-blue viscoelastic
      emissive: 0x0284c7,      // Luminous internal blue gel glow
      emissiveIntensity: 0.48, // Unmistakably visible liquid being injected!
      roughness: 0.04,         // Wet glistening specular sheen
      metalness: 0.02,
      transparent: true,
      opacity: 0.90,           // Dense, rich, volumetric gel!
      depthWrite: true,
      side: THREE.DoubleSide
    });

    mats.ovdSyringeLiquid = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      emissive: 0x0284c7,
      emissiveIntensity: 0.36,
      roughness: 0.04,
      metalness: 0.02,
      transparent: true,
      opacity: 0.86,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    // REAL SALINE WATER (Vivid, luminous, refractive - 100% visible against dark operating theatre!)
    mats.pouchTyvek = new THREE.MeshStandardMaterial({
      map: createPouchBackingTexture(),
      color: 0xffffff,
      roughness: 0.45,
      metalness: 0.02,
      side: THREE.DoubleSide,
      transparent: true
    });

    mats.pouchFilm = new THREE.MeshStandardMaterial({
      map: createPouchFilmTexture(),
      color: 0xffffff,
      roughness: 0.22,
      metalness: 0.02,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
      depthWrite: true
    });

    mats.salineWater = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      emissive: 0x0284c7,
      emissiveIntensity: 0.04,
      transmission: 0.94,
      ior: 1.333,
      roughness: 0.02,
      metalness: 0.01,
      reflectivity: 0.98,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    mats.salineStream = new THREE.MeshPhysicalMaterial({
      color: 0xc7e8ff,
      emissive: 0x0284c7,
      emissiveIntensity: 0.05,
      transmission: 0.96,
      ior: 1.333,
      roughness: 0.02,
      metalness: 0.01,
      reflectivity: 0.99,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      side: THREE.DoubleSide
    });

        // SURGICAL STAINLESS STEEL (Authentic 316L medical stainless steel with double-side rendering)
    mats.surgicalSteel = new THREE.MeshStandardMaterial({
      color: 0xd8e4f0,
      metalness: 0.82,
      roughness: 0.22,
      envMapIntensity: 1.6,
      side: THREE.DoubleSide
    });

    mats.stainlessSteel = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.94,
      roughness: 0.12
    });

    mats.syringeGlass = new THREE.MeshPhysicalMaterial({
      color: 0xf0f9ff,
      roughness: 0.04,
      metalness: 0.0,
      transmission: 0.96,
      ior: 1.52,
      thickness: 0.35,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide
    });

    mats.luerHub = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9, // Clean clinical medical polypropylene luer fitting
      roughness: 0.28,
      metalness: 0.04,
      transparent: true,
      opacity: 0.92
    });

    // SOLID MEDICAL THERMOFORMED BLISTER TRAY: Crisp pearl-white polypropylene
    // (Solid shading completely eliminates transparent ghost overlays!)
    mats.procedureTub = new THREE.MeshStandardMaterial({
      color: 0x0891b2, // Clean sterile surgical teal-blue medical polymer
      roughness: 0.25,
      metalness: 0.15,
      side: THREE.DoubleSide
    });

    mats.tubCradle = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // Soft medical silicone cradle
      roughness: 0.40,
      metalness: 0.05
    });

    // Translucent medical frosted polypropylene blister tray (transparent but clearly noticeable!)
    mats.medicalTray = new THREE.MeshStandardMaterial({
      color: 0xbeddf4,
      roughness: 0.18,
      metalness: 0.02,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.44,
      depthWrite: false
    });

    mats.theatreFloor = new THREE.MeshStandardMaterial({
      color: 0x0c1420, // Clean executive surgical table slate
      roughness: 0.90, // Non-reflective matte finish
      metalness: 0.02
    });

    mats.corneaGlass = new THREE.MeshPhysicalMaterial({
      color: 0xf0f9ff,
      roughness: 0.015,
      metalness: 0.0,
      transmission: 0.96,
      ior: 1.376,
      thickness: 0.45,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.40,
      side: THREE.DoubleSide
    });

    mats.sclera = new THREE.MeshStandardMaterial({
      color: 0xdae6f2,
      roughness: 0.55,
      metalness: 0.02
    });
  }

  function createPolycarbPart(geometry, isFrosted, edgeThreshold) {
    const group = new THREE.Group();
    const mat = isFrosted ? mats.polycarbFrosted : mats.polycarbClear;
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.renderOrder = 15; // Always render on top of opaque tray cavity!
    polycarbMeshes.push({ mesh, defaultMat: mat });
    group.add(mesh);

    const edgesGeo = new THREE.EdgesGeometry(geometry, edgeThreshold || 24);
    const lineMat = isFrosted ? mats.cadEdgeStrong : mats.cadEdge;
    const lines = new THREE.LineSegments(edgesGeo, lineMat);
    lines.renderOrder = 16;
    lines.visible = true; // Subtle engineering CAD edge definition so syringe is crisp and visible!
    cadEdgeLines.push(lines);
    group.add(lines);

    return group;
  }
  /* --------------------------------------------------------------------------
     4. DARK OPERATING THEATRE STAGE
     -------------------------------------------------------------------------- */
  function buildSurgicalTheatreStage() {
    // 1. Stainless Steel Mayo Stand Table Pedestal (Formal brushed medical rim)
    const pedestalW = 32.0;
    const pedestalD = 18.0;
    const pedestalH = 0.10;
    const pedestalGeo = new THREE.BoxGeometry(pedestalW, pedestalH, pedestalD);
    const pedestalMesh = new THREE.Mesh(pedestalGeo, mats.surgicalSteel);
    pedestalMesh.position.set(-3.0, -1.30, 0.0);
    mainGroup.add(pedestalMesh);

    // Crisp CAD highlight edges around the Mayo stand steel bevel
    const pedEdgeGeo = new THREE.EdgesGeometry(pedestalGeo, 24);
    const pedEdgeLines = new THREE.LineSegments(pedEdgeGeo, mats.cadEdgeStrong);
    pedEdgeLines.position.copy(pedestalMesh.position);
    mainGroup.add(pedEdgeLines);

    // 2. Sterile Surgical Blue Drape Surface (Resting on top of Mayo stand)
    const drapeGeo = new THREE.PlaneGeometry(pedestalW - 0.4, pedestalD - 0.4);
    mats.sterileDrape = new THREE.MeshStandardMaterial({
      map: createSterileDrapeTexture(),
      roughness: 0.72,
      metalness: 0.04
    });
    const drapeMesh = new THREE.Mesh(drapeGeo, mats.sterileDrape);
    drapeMesh.rotation.x = -Math.PI / 2;
    drapeMesh.position.set(-3.0, -1.248, 0.0); // Exactly at table surface level (-1.25)
    mainGroup.add(drapeMesh);

    // 3. Seamless Soft Radial Drop Shadow (Fades 100% smoothly to zero - ZERO harsh edges, ZERO black slabs!)
    const shadowGeo = new THREE.PlaneGeometry(44.0, 28.0);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createRadialDropShadowTexture(),
      transparent: true,
      opacity: 0.62,
      depthWrite: false
    });
    const dropShadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    dropShadowMesh.rotation.x = -Math.PI / 2;
    dropShadowMesh.position.set(-3.0, -1.36, 0.0);
    mainGroup.add(dropShadowMesh);

    // 4. Soft Contact Shadow Ambient Occlusion Decals (Grounding the resting devices)
    const contactShadowGeo = new THREE.PlaneGeometry(16.0, 6.0);
    const contactShadowMat = new THREE.MeshBasicMaterial({
      color: 0x010408,
      transparent: true,
      opacity: 0.38,
      depthWrite: false
    });
    const contactShadowMesh = new THREE.Mesh(contactShadowGeo, contactShadowMat);
    contactShadowMesh.rotation.x = -Math.PI / 2;
    contactShadowMesh.position.set(0.4, -1.246, 0.0);
    mainGroup.add(contactShadowMesh);
  }

  /* --------------------------------------------------------------------------
     5. CLEAN LARGE THERMOFORMED MEDICAL BLISTER TRAY WITH REALISTIC WATER
        (Built as a clean solid thermoformed tray without ANY overlapping transparent ghost planes!)
     -------------------------------------------------------------------------- */
  function createSolidBlisterTray(outerW, outerD, innerW, innerD, cavityDepth, skirtH) {
    // 100% WATERTIGHT, SEAMLESS, CONTINUOUS THERMOFORMED MEDICAL TRAY
    // All vertices are shared at the corners: ZERO GAPS, ZERO DISCONNECTIONS, ZERO BLACKHOLES!
    const group = new THREE.Group();

    const rimW = innerW + 0.30;
    const rimD = innerD + 0.20;

    // 16 key vertices
    const fX = innerW / 2, fZ = innerD / 2, fY = -cavityDepth;
    const rX = rimW / 2, rZ = rimD / 2, rY = 0;
    const oX = outerW / 2, oZ = outerD / 2, oY = 0;
    const sX = outerW / 2, sZ = outerD / 2, sY = -skirtH;

    const vertices = [
      // Floor (0-3)
      -fX, fY, -fZ, // 0 NW
       fX, fY, -fZ, // 1 NE
       fX, fY,  fZ, // 2 SE
      -fX, fY,  fZ, // 3 SW

      // Inner Cavity Rim (4-7)
      -rX, rY, -rZ, // 4 NW
       rX, rY, -rZ, // 5 NE
       rX, rY,  rZ, // 6 SE
      -rX, rY,  rZ, // 7 SW

      // Outer Flange (8-11)
      -oX, oY, -oZ, // 8 NW
       oX, oY, -oZ, // 9 NE
       oX, oY,  oZ, // 10 SE
      -oX, oY,  oZ, // 11 SW

      // Drop Skirt Bottom (12-15)
      -sX, sY, -sZ, // 12 NW
       sX, sY, -sZ, // 13 NE
       sX, sY,  sZ, // 14 SE
      -sX, sY,  sZ  // 15 SW
    ];

    const indices = [
      // 1. Solid Cavity Floor (normal +Y)
      0, 2, 1,   0, 3, 2,

      // 2. Beveled Cavity Walls (Closed at all 4 corners, perfectly joined!)
      // North Wall
      0, 1, 5,   0, 5, 4,
      // East Wall
      1, 2, 6,   1, 6, 5,
      // South Wall
      2, 3, 7,   2, 7, 6,
      // West Wall
      3, 0, 4,   3, 4, 7,

      // 3. Perimeter Sealing Flange at y = 0
      // North Flange
      4, 5, 9,   4, 9, 8,
      // East Flange
      5, 6, 10,  5, 10, 9,
      // South Flange
      6, 7, 11,  6, 11, 10,
      // West Flange
      7, 4, 8,   7, 8, 11,

      // 4. Drop Skirts to Sterile Drape
      // North Skirt
      8, 9, 13,   8, 13, 12,
      // East Skirt
      9, 10, 14,  9, 14, 13,
      // South Skirt
      10, 11, 15, 10, 15, 14,
      // West Skirt
      11, 8, 12,  11, 12, 15
    ];

    let geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    // Convert to non-indexed geometry so each face has independent, true surface normals
    // ZERO normal bleeding, ZERO Gouraud distortion, ZERO blackholes in tray corners!
    geo = geo.toNonIndexed();
    geo.computeVertexNormals();

    // Back-face mesh (renders behind interior syringe at renderOrder 2)
    const backMat = mats.medicalTray.clone();
    backMat.side = THREE.BackSide;
    const trayBackMesh = new THREE.Mesh(geo, backMat);
    trayBackMesh.renderOrder = 2;
    group.add(trayBackMesh);

    // Front-face mesh (renders over interior syringe at renderOrder 20 so syringe stays truly inside cavity)
    const frontMat = mats.medicalTray.clone();
    frontMat.side = THREE.FrontSide;
    const trayFrontMesh = new THREE.Mesh(geo, frontMat);
    trayFrontMesh.renderOrder = 20;
    group.add(trayFrontMesh);

    // Subtle translucent medical blister pack contours & rim definition
    const trayEdgeGeo = new THREE.EdgesGeometry(geo, 24);
    const trayEdgeLines = new THREE.LineSegments(trayEdgeGeo, new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.50
    }));
    trayEdgeLines.renderOrder = 21;
    group.add(trayEdgeLines);

    return group;
  }

  function createPouchHalfGeometry(isTop) {
    const L = 14.6;
    const W = 6.0;
    const segX = 64;
    const segZ = 24;
    const innerX = 5.7;
    const innerZ = 2.15;
    const yMid = -0.67;
    const yTopPeak = 0.085;
    const yBotTrough = -1.425;

    const geo = new THREE.PlaneGeometry(L, W, segX, segZ);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      const ax = Math.abs(x);
      const az = Math.abs(z);
      let p = 0.0;
      if (ax < innerX && az < innerZ) {
        const u = ax / innerX;
        const v = az / innerZ;
        const fx = 0.5 * (1.0 + Math.cos(u * Math.PI));
        const fz = 0.5 * (1.0 + Math.cos(v * Math.PI));
        p = Math.pow(fx * fz, 0.65);
      }

      // Authentic chevron grip tab separation at unsealed peel end (x < -6.5)
      let tabLift = 0.0;
      if (x < -6.5) {
        tabLift = ((-6.5 - x) / 0.8) * 0.06;
      }

      let y;
      if (isTop) {
        // Perimeter edges meet yMid; interior balloons up snugly over secondary lid!
        y = yMid + 0.004 + p * (yTopPeak - yMid) + tabLift;
      } else {
        // Perimeter edges meet yMid; interior balloons down snugly under secondary tray!
        y = yMid - 0.004 - p * (yMid - yBotTrough) - tabLift;
      }
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }

  function buildOuterCartonBox() {
    // AUTHENTIC RAYONE GALAXY CLINICAL PRESENTATION CARTON
    // Proportions matching real medical packaging: Length 14.5, Depth 6.6, Height 3.0
    // Rests stably on sterile drape, tilted 10 degrees towards camera so hero artwork is prominently visible!
    cartonBoxGroup = new THREE.Group();
    cartonBoxGroup.position.set(0.4, 0.95, -1.8);
    cartonBoxGroup.rotation.set(0.18, -0.12, 0);

    const bW = 14.5; // Length along X
    const bH = 3.0;  // Height along Y
    const bD = 6.6;  // Depth along Z

    // 1. Front Wall (+Z): Side branding & Rayner logo
    const frontGeo = new THREE.PlaneGeometry(bW, bH);
    frontGeo.translate(0, 0, bD / 2);
    const frontMesh = new THREE.Mesh(frontGeo, mats.darkGalaxySide);
    cartonBoxGroup.add(frontMesh);

    // 2. Rear Wall (-Z): Regulatory CE indications
    const backGeo = new THREE.PlaneGeometry(bW, bH);
    backGeo.rotateY(Math.PI);
    backGeo.translate(0, 0, -bD / 2);
    const backMesh = new THREE.Mesh(backGeo, mats.darkGalaxyBack);
    cartonBoxGroup.add(backMesh);

    // 3. Left End Wall (-X)
    const leftGeo = new THREE.PlaneGeometry(bD, bH);
    leftGeo.rotateY(-Math.PI / 2);
    leftGeo.translate(-bW / 2, 0, 0);
    const leftMesh = new THREE.Mesh(leftGeo, mats.darkGalaxyTop);
    cartonBoxGroup.add(leftMesh);

    // 4. Right End Wall (+X): Pull tab end
    const rightGeo = new THREE.PlaneGeometry(bD, bH);
    rightGeo.rotateY(Math.PI / 2);
    rightGeo.translate(bW / 2, 0, 0);
    const rightMesh = new THREE.Mesh(rightGeo, mats.darkGalaxyTop);
    cartonBoxGroup.add(rightMesh);

    // 5. Bottom Floor (-Y): Rests on table
    const botGeo = new THREE.PlaneGeometry(bW, bD);
    botGeo.rotateX(Math.PI / 2);
    botGeo.translate(0, -bH / 2, 0);
    const botMesh = new THREE.Mesh(botGeo, mats.darkGalaxyBack);
    cartonBoxGroup.add(botMesh);

    // 6. Hinged Top Lid Flap with Hero GALAXY Artwork & Front Tuck Lip
    cartonFlapPivot = new THREE.Group();
    // Pivot line at top-rear edge: Y = bH / 2, Z = -bD / 2
    cartonFlapPivot.position.set(0, bH / 2, -bD / 2);

    // Main top lid (bW x bD): displays the official dark Galaxy hero artwork with cyan spiral loops!
    // Exterior face (+Y normal when closed)
    const flapGeo = new THREE.PlaneGeometry(bW, bD);
    flapGeo.rotateX(-Math.PI / 2);
    flapGeo.translate(0, 0, bD / 2);
    cartonFlapMesh = new THREE.Mesh(flapGeo, mats.darkGalaxyFront);
    cartonFlapPivot.add(cartonFlapMesh);

    // Inner lid backing: authentic matte dark packaging liner facing user when lid swings open ~112 deg
    // Eliminates any mirrored/inverted reverse side artwork!
    const flapInnerGeo = new THREE.PlaneGeometry(bW, bD);
    flapInnerGeo.rotateX(Math.PI / 2); // points -Y when closed, faces camera when opened
    flapInnerGeo.translate(0, -0.01, bD / 2);
    const flapInnerMesh = new THREE.Mesh(flapInnerGeo, mats.cartonInnerLiner);
    cartonFlapPivot.add(flapInnerMesh);

    // Front tuck-in lip: hangs down along front face (+Z)
    const tuckGeo = new THREE.PlaneGeometry(bW * 0.98, 0.55);
    tuckGeo.translate(0, -0.55 / 2, bD);
    const tuckMesh = new THREE.Mesh(tuckGeo, mats.darkGalaxySide);
    cartonFlapPivot.add(tuckMesh);

    // Inner face of tuck lip
    const tuckInnerGeo = new THREE.PlaneGeometry(bW * 0.98, 0.55);
    tuckInnerGeo.rotateY(Math.PI);
    tuckInnerGeo.translate(0, -0.55 / 2, bD - 0.005);
    const tuckInnerMesh = new THREE.Mesh(tuckInnerGeo, mats.cartonInnerLiner);
    cartonFlapPivot.add(tuckInnerMesh);

    cartonBoxGroup.add(cartonFlapPivot);

    // 7. Dark Interior Cavity Bed (Visible when lid opens)
    const intGeo = new THREE.BoxGeometry(bW - 0.08, bH - 0.08, bD - 0.08);
    const intMesh = new THREE.Mesh(intGeo, mats.cartonInnerBed);
    cartonBoxGroup.add(intMesh);

    // Soft contact shadow on table beneath box
    const shadowGeo = new THREE.PlaneGeometry(bW * 1.15, bD * 1.25);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMesh = new THREE.Mesh(shadowGeo, mats.cartonShadow);
    shadowMesh.position.set(0, -bH / 2 + 0.02, 0);
    cartonBoxGroup.add(shadowMesh);

    mainGroup.add(cartonBoxGroup);
  }
  function buildCleanOphthalmicBlisterPacks() {
    // 1. AUTHENTIC PRIMARY CHEVRON STERILE PEEL POUCH (Unified 3D Medical Sealed Pouch!)
    // Generously sized (14.6 x 6.0) sealed pillow pouch enclosing the secondary blister pack
    primaryPouchGroup = new THREE.Group();
    primaryPouchGroup.position.set(0.4, 0.55, 0.0);

    // Top translucent medical film with central see-through window & chevron peel arrow
    pouchTopOrigGeo = createPouchHalfGeometry(true);
    pouchTopMesh = new THREE.Mesh(pouchTopOrigGeo.clone(), mats.pouchFilm);
    pouchTopMesh.position.set(0, 0, 0);
    primaryPouchGroup.add(pouchTopMesh);

    // Bottom opaque white medical grade Tyvek backing sheet
    pouchBottomOrigGeo = createPouchHalfGeometry(false);
    pouchBottomMesh = new THREE.Mesh(pouchBottomOrigGeo.clone(), mats.pouchTyvek);
    pouchBottomMesh.position.set(0, 0, 0);
    primaryPouchGroup.add(pouchBottomMesh);

    mainGroup.add(primaryPouchGroup);

    // Aliases
    primaryTrayMesh = primaryPouchGroup;
    primaryLidMesh = pouchTopMesh;
    primaryLidOrigGeo = pouchTopOrigGeo;

    // 2. Secondary Inner Blister Tray (Active in Stages 2-6)
    secondaryTrayMesh = createSolidBlisterTray(11.4, 4.0, 10.4, 3.0, 1.35, 0.45);
    secondaryTrayMesh.position.set(0.4, 0.48, 0.0);
    mainGroup.add(secondaryTrayMesh);

    // 3. Secondary Peelable Foil Lid (AUTHENTIC METALLIC GREY FOIL - NO WORDS!)
    secondaryLidOrigGeo = new THREE.PlaneGeometry(11.3, 3.9, 48, 12);
    secondaryLidOrigGeo.rotateX(-Math.PI / 2);
    const sLidMat = new THREE.MeshStandardMaterial({
      map: createGreyFoilTexture(),
      color: 0xc4ceda, // Clean surgical grey metallic foil
      roughness: 0.22, // Elegant satin foil sheen
      metalness: 0.88, // Gleaming aluminum foil reflectivity
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: true,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1
    });
    secondaryLidMesh = new THREE.Mesh(secondaryLidOrigGeo.clone(), sLidMat);
    secondaryLidMesh.position.set(0.4, 0.49, 0.0);
    mainGroup.add(secondaryLidMesh);

    // 4. Saline Water Surface inside secondary tray
    waterOrigGeo = new THREE.PlaneGeometry(10.3, 2.9, 36, 16);
    waterOrigGeo.rotateX(-Math.PI / 2);
    waterMesh = new THREE.Mesh(waterOrigGeo.clone(), mats.salineWater);
    waterMesh.position.set(0.4, 0.22, 0.0);
    mainGroup.add(waterMesh);
  }

  /* --------------------------------------------------------------------------
     4B. AUTHENTIC HOLLOW SURGICAL STAINLESS STEEL BASIN
     -------------------------------------------------------------------------- */
  function createSolidStainlessBasin(outerW, outerD, innerW, innerD, cavityDepth, skirtH) {
    // 100% WATERTIGHT, OPEN HOLLOW SURGICAL BASIN (Operating Room 316L Stainless Steel)
    // Sits ON TOP of the table: floor at y = 0.02, walls rise up to y = cavityDepth!
    const group = new THREE.Group();

    const fX = (innerW - 0.7) / 2, fZ = (innerD - 0.7) / 2, fY = 0.02; // Floor resting on table
    const rX = innerW / 2, rZ = innerD / 2, rY = cavityDepth;          // Top rim of basin
    const oX = outerW / 2, oZ = outerD / 2, oY = cavityDepth;          // Outer flange rim
    const sX = outerW / 2, sZ = outerD / 2, sY = cavityDepth - skirtH; // Drop skirt

    const vertices = [
      // Floor of basin (0-3) at y = fY
      -fX, fY, -fZ, // 0 NW
       fX, fY, -fZ, // 1 NE
       fX, fY,  fZ, // 2 SE
      -fX, fY,  fZ, // 3 SW

      // Inner Cavity Top Rim (4-7) at y = rY
      -rX, rY, -rZ, // 4 NW
       rX, rY, -rZ, // 5 NE
       rX, rY,  rZ, // 6 SE
      -rX, rY,  rZ, // 7 SW

      // Outer Perimeter Flange (8-11) at y = oY
      -oX, oY, -oZ, // 8 NW
       oX, oY, -oZ, // 9 NE
       oX, oY,  oZ, // 10 SE
      -oX, oY,  oZ, // 11 SW

      // Drop Skirt (12-15) at y = sY
      -sX, sY, -sZ, // 12 NW
       sX, sY, -sZ, // 13 NE
       sX, sY,  sZ, // 14 SE
      -sX, sY,  sZ  // 15 SW
    ];

    const indices = [
      // 1. Solid Stainless Floor (Facing UP into the hollow basin)
      0, 2, 1,   0, 3, 2,

      // 2. Beveled Inner Stainless Walls (North, East, South, West)
      0, 1, 5,   0, 5, 4,
      1, 2, 6,   1, 6, 5,
      2, 3, 7,   2, 7, 6,
      3, 0, 4,   3, 4, 7,

      // 3. Perimeter Rolled Flange
      4, 5, 9,   4, 9, 8,
      5, 6, 10,  5, 10, 9,
      6, 7, 11,  6, 11, 10,
      7, 4, 8,   7, 8, 11,

      // 4. Outer Drop Skirt
      8, 9, 13,   8, 13, 12,
      9, 10, 14,  9, 14, 13,
      10, 11, 15, 10, 15, 14,
      11, 8, 12,  11, 12, 15
    ];

    let geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo = geo.toNonIndexed();
    geo.computeVertexNormals();

    const mesh = new THREE.Mesh(geo, mats.surgicalSteel);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);

    // Specular highlight edges on rim and flange
    const edgesGeo = new THREE.EdgesGeometry(geo, 22);
    const edges = new THREE.LineSegments(edgesGeo, mats.cadEdgeStrong);
    group.add(edges);

    return group;
  }

  let drainWaterMesh = null;
  let drainWaterVolumeMesh = null;
  let drainWaterOrigGeo = null;
  let salineImpactMesh = null;

  function buildProcedureTub() {
    // AUTHENTIC STERILE SURGICAL PROCEDURE TUB (Mayo Stand Procedure Basin)
    // Rests stably on the sterile operating table at y = -0.65
    procedureTubGroup = new THREE.Group();
    procedureTubGroup.position.set(0.4, -0.65, 0.0);

    const tubW = 13.0, tubD = 5.2, innerW = 12.0, innerD = 4.2;
    const cavityDepth = 0.95, skirtH = 0.22;

    // 1. Hollow Medical Polymer Procedure Basin
    const fX = (innerW - 0.7) / 2, fZ = (innerD - 0.7) / 2, fY = 0.02;
    const rX = innerW / 2, rZ = innerD / 2, rY = cavityDepth;
    const oX = tubW / 2, oZ = tubD / 2, oY = cavityDepth;
    const sX = tubW / 2, sZ = tubD / 2, sY = cavityDepth - skirtH;

    const vertices = [
      -fX, fY, -fZ,  fX, fY, -fZ,  fX, fY,  fZ, -fX, fY,  fZ,
      -rX, rY, -rZ,  rX, rY, -rZ,  rX, rY,  rZ, -rX, rY,  rZ,
      -oX, oY, -oZ,  oX, oY, -oZ,  oX, oY,  oZ, -oX, oY,  oZ,
      -sX, sY, -sZ,  sX, sY, -sZ,  sX, sY,  sZ, -sX, sY,  sZ
    ];
    const indices = [
      0, 2, 1,   0, 3, 2,
      0, 1, 5,   0, 5, 4,   1, 2, 6,   1, 6, 5,   2, 3, 7,   2, 7, 6,   3, 0, 4,   3, 4, 7,
      4, 5, 9,   4, 9, 8,   5, 6, 10,  5, 10, 9,  6, 7, 11,  6, 11, 10, 7, 4, 8,   7, 8, 11,
      8, 9, 13,   8, 13, 12, 9, 10, 14,  9, 14, 13, 10, 11, 15, 10, 15, 14, 11, 8, 12,  11, 12, 15
    ];
    let geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo = geo.toNonIndexed();
    geo.computeVertexNormals();

    const tubMesh = new THREE.Mesh(geo, mats.procedureTub);
    procedureTubGroup.add(tubMesh);

    // 2. Dual Ergonomic Silicone Syringe Cradle Rests inside tub
    const cradleGeo = new THREE.CylinderGeometry(0.32, 0.38, 0.35, 16);
    cradleGeo.rotateZ(Math.PI / 2);

    const barrelCradle = new THREE.Mesh(cradleGeo, mats.tubCradle);
    barrelCradle.position.set(-1.2, 0.18, 0.0);
    procedureTubGroup.add(barrelCradle);

    const nozzleCradle = new THREE.Mesh(cradleGeo, mats.tubCradle);
    nozzleCradle.position.set(3.2, 0.18, 0.0);
    procedureTubGroup.add(nozzleCradle);

    procedureTubGroup.visible = false;
    mainGroup.add(procedureTubGroup);
  }

  function buildSalineDisposalContainer() {

    // AUTHENTIC OPERATING ROOM STAINLESS STEEL SURGICAL INSTRUMENT / RECEIVER TRAY
    // Sits directly on top of the operating table at tableY = -1.25 - ZERO CLIPPING!
    drainContainerGroup = new THREE.Group();
    drainContainerGroup.position.set(-9.8, -1.25, 0.2);

    const trayW = 6.8;
    const trayD = 4.8;
    const innerW = 5.8;
    const innerD = 3.8;
    const cavityDepth = 0.65;
    const skirtH = 0.22;

    // 1. Hollow Stamped Stainless Steel Basin (Rests on table, walls rise UP)
    const basinMesh = createSolidStainlessBasin(trayW, trayD, innerW, innerD, cavityDepth, skirtH);
    drainContainerGroup.add(basinMesh);

    // 2. Dedicated Surgical Spotlight illuminating the basin interior & metallic floor
    const traySpot = new THREE.PointLight(0xe0f2fe, 2.2, 7.5, 1.2);
    traySpot.position.set(0, 1.8, 0);
    drainContainerGroup.add(traySpot);

    // 3A. 3D Volumetric Water Body (Deep, luminous turquoise fluid block with physical depth!)
    const waterVolGeo = new THREE.BoxGeometry(innerW - 0.4, 0.48, innerD - 0.4);
    waterVolGeo.translate(0, 0.24, 0); // Origin at bottom of volume
    drainWaterVolumeMesh = new THREE.Mesh(waterVolGeo, mats.salineWater);
    drainWaterVolumeMesh.position.set(0, 0.02, 0);
    drainWaterVolumeMesh.scale.set(1, 0.01, 1);
    drainWaterVolumeMesh.visible = false;
    drainWaterVolumeMesh.renderOrder = 3;
    drainContainerGroup.add(drainWaterVolumeMesh);

    // 3B. Living Saline Water Surface (Rests on top of volume, animates with dynamic ripples!)
    drainWaterOrigGeo = new THREE.PlaneGeometry(innerW - 0.4, innerD - 0.4, 48, 32);
    drainWaterOrigGeo.rotateX(-Math.PI / 2);
    drainWaterMesh = new THREE.Mesh(drainWaterOrigGeo.clone(), mats.salineWater);
    drainWaterMesh.position.y = 0.06;
    drainWaterMesh.renderOrder = 4;
    drainContainerGroup.add(drainWaterMesh);

    // 4. Circular Impact Wave / Splash Ring on Water Surface
    const impactGeo = new THREE.RingGeometry(0.12, 0.48, 32);
    impactGeo.rotateX(-Math.PI / 2);
    salineImpactMesh = new THREE.Mesh(impactGeo, mats.salineWater);
    salineImpactMesh.position.set(0.6, 0.07, 0.0);
    salineImpactMesh.visible = false;
    salineImpactMesh.renderOrder = 4;
    drainContainerGroup.add(salineImpactMesh);

    mainGroup.add(drainContainerGroup);

    // 5. Realistic Cascading Fluid Sheet / Waterfall (Liquid curtain with planar width, NOT a round hose!)
    const streamWidthSegs = 10;
    const streamHeightSegs = 24;
    const streamGeo = new THREE.PlaneGeometry(1.0, 1.0, streamWidthSegs, streamHeightSegs);
    salineStreamMesh = new THREE.Mesh(streamGeo, mats.salineStream);
    salineStreamMesh.visible = false;
    salineStreamMesh.renderOrder = 10;
    mainGroup.add(salineStreamMesh);

    // 6. Dynamic Glistening Water Splash Droplets (Active ballistic fluid spray at impact)
    salineSplashGroup = new THREE.Group();
    const dropletGeo = new THREE.SphereGeometry(0.024, 8, 8);
    for (let d = 0; d < 12; d++) {
      const dropMesh = new THREE.Mesh(dropletGeo, mats.salineStream);
      salineSplashGroup.add(dropMesh);
    }
    salineSplashGroup.visible = false;
    salineSplashGroup.renderOrder = 11;
    mainGroup.add(salineSplashGroup);
  }

  function applyDualPouchPeel(topMesh, topOrigGeo, bottomMesh, bottomOrigGeo, progress) {
    if (!topMesh || !topOrigGeo || !bottomMesh || !bottomOrigGeo) return;
    const minX = -7.3;
    const maxX = 7.3;
    const totalW = maxX - minX;
    const peelFront = minX + totalW * Math.min(1.0, progress * 1.05);

    const curlR = 0.85;
    const bendLen = curlR * (Math.PI / 2); // 90-degree initial curve
    const pullAngle = 1.18; // ~68° upward & backward pull angle towards left grip tabs

    // 1. TOP TRANSLUCENT PLASTIC FILM: Curves up & pulls backward smoothly (Opening chevron peel!)
    const posTop = topMesh.geometry.attributes.position;
    const origTop = topOrigGeo.attributes.position;
    for (let i = 0; i < posTop.count; i++) {
      const ox = origTop.getX(i);
      const oy = origTop.getY(i);
      const oz = origTop.getZ(i);

      if (ox <= peelFront) {
        const delta = peelFront - ox;
        if (delta <= bendLen) {
          const a = delta / curlR;
          posTop.setX(i, peelFront - Math.sin(a) * curlR);
          posTop.setY(i, oy + (1 - Math.cos(a)) * curlR * 1.40);
          posTop.setZ(i, oz);
        } else {
          // Standing flap lifting high into the air and pulling back towards left tabs
          const rem = delta - bendLen;
          posTop.setX(i, peelFront - curlR - rem * Math.cos(pullAngle) * 0.85);
          posTop.setY(i, oy + curlR * 1.40 + rem * Math.sin(pullAngle) * 0.95);
          posTop.setZ(i, oz);
        }
      } else {
        posTop.setX(i, ox);
        posTop.setY(i, oy);
        posTop.setZ(i, oz);
      }
    }
    posTop.needsUpdate = true;
    topMesh.geometry.computeVertexNormals();

    // 2. BOTTOM TYVEK SHEET: Rests stably on sterile table, supporting the secondary blister pack
    const posBot = bottomMesh.geometry.attributes.position;
    const origBot = bottomOrigGeo.attributes.position;
    for (let i = 0; i < posBot.count; i++) {
      const ox = origBot.getX(i);
      const oy = origBot.getY(i);
      const oz = origBot.getZ(i);

      if (ox <= peelFront) {
        // As the seal opens, Tyvek flattens cleanly onto the drape with subtle tab flex at far left (ox < -6.5)
        let tabDip = 0.0;
        if (ox < -6.5) {
          tabDip = ((-6.5 - ox) / 0.8) * 0.06;
        }
        posBot.setX(i, ox);
        posBot.setY(i, oy - tabDip);
        posBot.setZ(i, oz);
      } else {
        posBot.setX(i, ox);
        posBot.setY(i, oy);
        posBot.setZ(i, oz);
      }
    }
    posBot.needsUpdate = true;
    bottomMesh.geometry.computeVertexNormals();
  }

  // Dual alias to guarantee zero runtime missing reference exceptions regardless of parameter order:
  function applyPouchPeel(topMesh, bottomMesh, topOrigGeo, bottomOrigGeo, progress) {
    applyDualPouchPeel(topMesh, topOrigGeo, bottomMesh, bottomOrigGeo, progress);
  }

  function applyPeelToMesh(mesh, origGeo, progress, maxPeelRatio) {
    if (!mesh || !origGeo) return;
    const pos = mesh.geometry.attributes.position;
    const origPos = origGeo.attributes.position;
    const minX = -5.5;
    const maxX = 5.5;
    const totalW = maxX - minX;

    const peelFront = minX + totalW * Math.min(1.0, progress * (maxPeelRatio || 1.0));
    const curlR = 0.65;
    const pullAngle = 1.25; // ~72 degrees upward natural surgical peel flap (Figure 1 & 2)

    for (let i = 0; i < pos.count; i++) {
      const ox = origPos.getX(i);
      const oy = origPos.getY(i);
      const oz = origPos.getZ(i);

      if (ox <= peelFront) {
        const delta = peelFront - ox;
        const bendLen = curlR * (Math.PI / 2); // 90 degree curved bend
        if (delta <= bendLen) {
          const a = delta / curlR;
          pos.setX(i, peelFront - Math.sin(a) * curlR);
          pos.setY(i, oy + (1 - Math.cos(a)) * curlR);
          pos.setZ(i, oz);
        } else {
          // Standing flap rising high into the air and pulling back naturally (ZERO flat sticking!)
          const rem = delta - bendLen;
          pos.setX(i, peelFront - curlR - rem * Math.cos(pullAngle));
          pos.setY(i, oy + curlR + rem * Math.sin(pullAngle));
          pos.setZ(i, oz);
        }
      } else {
        pos.setX(i, ox);
        pos.setY(i, oy);
        pos.setZ(i, oz);
      }
    }
    pos.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
  }

  /* --------------------------------------------------------------------------
     6. AUTHENTIC RAYONE® PRELOADED INJECTOR (STEPPED BARREL & DETAILED CAD)
     -------------------------------------------------------------------------- */
  function buildRayOneInjectorSyringe() {
    syringeGroup = new THREE.Group();

    // =========================================================================
    // 1. MAIN SYRINGE BARREL (Crystal-Clear Medical Polycarbonate)
    // Runs from X = -1.80 to X = 0.60 with uniform cylindrical outer radius 0.35
    // =========================================================================
    const barrelLen = 2.40;
    const barrelOuterR = 0.35;
    const barrelInnerR = 0.27;
    const barrelGeo = new THREE.CylinderGeometry(barrelOuterR, barrelOuterR, barrelLen, 36, 1, true);
    barrelGeo.rotateZ(-Math.PI / 2);
    const barrelMesh = createPolycarbPart(barrelGeo, false, 24);
    barrelMesh.position.set(-0.60, 0, 0);
    syringeGroup.add(barrelMesh);

    // Internal bore / lumen cylinder (authentic glass depth and internal reflections)
    const boreGeo = new THREE.CylinderGeometry(barrelInnerR, barrelInnerR, barrelLen, 28, 1, true);
    boreGeo.rotateZ(-Math.PI / 2);
    const boreMesh = new THREE.Mesh(boreGeo, mats.polycarbClear);
    boreMesh.position.set(-0.60, 0, 0);
    syringeGroup.add(boreMesh);

    // =========================================================================
    // 2. TAPERED GUSSET FAIRINGS & FUNNEL TRANSITION (Images 1, 2, 3, 4, 5)
    // Tapers smoothly from cylindrical barrel (X = 0.60) to cartridge bed (X = 1.25)
    // with distinct dual triangular structural reinforcement fairings on top/bottom!
    // =========================================================================
    const transLen = 0.65;
    const transGeo = new THREE.CylinderGeometry(0.32, barrelOuterR, transLen, 36, 1, true);
    transGeo.rotateZ(-Math.PI / 2);
    const transMesh = createPolycarbPart(transGeo, false, 24);
    transMesh.position.set(0.925, 0, 0);
    syringeGroup.add(transMesh);

    const transBoreGeo = new THREE.CylinderGeometry(0.20, barrelInnerR, transLen, 28, 1, true);
    transBoreGeo.rotateZ(-Math.PI / 2);
    const transBore = new THREE.Mesh(transBoreGeo, mats.polycarbClear);
    transBore.position.set(0.925, 0, 0);
    syringeGroup.add(transBore);

    // Signature Upper & Lower Triangular Tapered Gusset Fairings (from Images 2 & 3!)
    const buildGusset = (ySign) => {
      const gShape = new THREE.Shape();
      gShape.moveTo(0.60, ySign * barrelOuterR);
      gShape.lineTo(1.25, ySign * 0.18);
      gShape.lineTo(1.25, ySign * 0.10);
      gShape.lineTo(0.60, ySign * (barrelOuterR - 0.08));
      gShape.closePath();

      const extrudeSettings = {
        depth: 0.12,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.012,
        bevelThickness: 0.012
      };
      const gGeo = new THREE.ExtrudeGeometry(gShape, extrudeSettings);
      gGeo.translate(0, 0, -0.06); // Center along Z
      return createPolycarbPart(gGeo, true, 16);
    };
    syringeGroup.add(buildGusset(1));  // Top triangular fairing (+Y)
    syringeGroup.add(buildGusset(-1)); // Bottom triangular fairing (-Y)

    // =========================================================================
    // 3. ERGONOMIC FLARED FINGER FLANGE & REAR GUIDE BUSHING (Images 1 & 5)
    // Flared dual-ear finger rests at X = -1.80, guide collar to X = -2.05
    // =========================================================================
    // Authentic RayOne Dual-Ear Finger Flange (Matches official photo media_1793413332402_e9107fe8.png!)
    // Flared ergonomic lobes extending laterally along Z axis (safely inside tray cavity clearances!)
    const flangeShape = new THREE.Shape();
    const flZ = 1.18;    // Lateral ear span along Z (fits comfortably inside tray width 3.0)
    const flY = 0.30;    // Vertical profile in Y (strictly clears tray floor -0.87 and foil lid +0.49!)
    const waistR = 0.32; // Collar rim around barrel

    flangeShape.moveTo(waistR, 0.26);
    // Right Ear (+X in 2D -> +Z in 3D)
    flangeShape.bezierCurveTo(0.55, flY, 0.90, flY, flZ, 0.16);
    flangeShape.bezierCurveTo(flZ + 0.10, 0.06, flZ + 0.10, -0.06, flZ, -0.16);
    flangeShape.bezierCurveTo(0.90, -flY, 0.55, -flY, waistR, -0.26);
    // Bottom waist transition
    flangeShape.bezierCurveTo(0.15, -flY, -0.15, -flY, -waistR, -0.26);
    // Left Ear (-X in 2D -> -Z in 3D)
    flangeShape.bezierCurveTo(-0.55, -flY, -0.90, -flY, -flZ, -0.16);
    flangeShape.bezierCurveTo(-(flZ + 0.10), -0.06, -(flZ + 0.10), 0.06, -flZ, 0.16);
    flangeShape.bezierCurveTo(-0.90, flY, -0.55, flY, -waistR, 0.26);
    // Top waist transition
    flangeShape.bezierCurveTo(-0.15, flY, 0.15, flY, waistR, 0.26);

    const flangeHole = new THREE.Path();
    flangeHole.absarc(0, 0, barrelOuterR, 0, Math.PI * 2, true);
    flangeShape.holes.push(flangeHole);

    const flangeExtrude = new THREE.ExtrudeGeometry(flangeShape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.018,
      bevelThickness: 0.018
    });
    flangeExtrude.rotateY(Math.PI / 2);
    const flangePart = createPolycarbPart(flangeExtrude, true, 20);
    flangePart.position.set(-1.80, 0, 0);
    syringeGroup.add(flangePart);

    // Rear Guide Bushing Collar (X = -1.80 to -2.05)
    const rearCollarGeo = new THREE.CylinderGeometry(barrelOuterR * 0.90, barrelOuterR * 0.90, 0.25, 32);
    rearCollarGeo.rotateZ(Math.PI / 2);
    const rearCollar = createPolycarbPart(rearCollarGeo, true, 20);
    rearCollar.position.set(-1.925, 0, 0);
    syringeGroup.add(rearCollar);

    // =========================================================================
    // 4. LOCK & ROLL® CARTRIDGE CHAMBER (Center X = 1.675, Length = 0.85)
    // Semi-cylindrical cradle bed where the IOL rests, with central OVD port
    // =========================================================================
    const cartLen = 0.85;
    const cartR = 0.32;
    const cartBodyGeo = new THREE.CylinderGeometry(cartR, cartR, cartLen, 32, 1, true);
    cartBodyGeo.rotateZ(-Math.PI / 2);
    const cartBody = createPolycarbPart(cartBodyGeo, false, 22);
    cartBody.position.set(1.675, 0, 0);
    syringeGroup.add(cartBody);

    // Central OVD Priming Port Cup (Images 2 & 3: circular beveled port on cartridge body)
    const portCupGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.08, 24);
    portCupGeo.rotateX(Math.PI / 2);
    const portCup = createPolycarbPart(portCupGeo, true, 18);
    portCup.position.set(1.675, 0.0, cartR + 0.01);
    syringeGroup.add(portCup);

    // Open Funnel Lumen for OVD Needle Insertion (from Image 3!)
    const portLumenGeo = new THREE.CylinderGeometry(0.065, 0.09, 0.10, 20);
    portLumenGeo.rotateX(Math.PI / 2);
    const portLumen = new THREE.Mesh(portLumenGeo, mats.polycarbClear);
    portLumen.position.set(1.675, 0.0, cartR + 0.02);
    syringeGroup.add(portLumen);

    // Dual Forward & Rear Snap-Fit Retention Catch Towers (Images 2 & 3!)
    const buildClip = (xPos, toothDir) => {
      const clipG = new THREE.Group();
      clipG.position.set(xPos, 0.09, 0.24);
      const postG = new THREE.BoxGeometry(0.08, 0.22, 0.06);
      clipG.add(createPolycarbPart(postG, true, 16));
      const toothG = new THREE.BoxGeometry(0.06, 0.04, 0.06);
      const tooth = createPolycarbPart(toothG, true, 16);
      tooth.position.set(toothDir * 0.035, 0.09, 0.0);
      clipG.add(tooth);
      return clipG;
    };
    syringeGroup.add(buildClip(1.30, 1));  // Proximal clip (tooth faces +X toward center)
    syringeGroup.add(buildClip(2.05, -1)); // Distal clip (tooth faces -X toward center)

    // =========================================================================
    // 5. WING 1: FIXED LOWER PADDLE ('1 ↑' & STADIUM SLOT - Images 1, 2, 3!)
    // Extends horizontally from barrel along +Z (towards viewer/camera)
    // =========================================================================
    const wing1Group = new THREE.Group();
    wing1Group.position.set(1.675, 0, 0);

    const w1Shape = new THREE.Shape();
    const w1W = 0.85, w1H = 0.98, r1 = 0.12;
    w1Shape.moveTo(-w1W / 2 + r1, 0);
    w1Shape.lineTo(w1W / 2 - r1, 0);
    w1Shape.quadraticCurveTo(w1W / 2, 0, w1W / 2, r1);
    w1Shape.lineTo(w1W / 2, w1H - r1);
    w1Shape.quadraticCurveTo(w1W / 2, w1H, w1W / 2 - r1, w1H);
    w1Shape.lineTo(-w1W / 2 + r1, w1H);
    w1Shape.quadraticCurveTo(-w1W / 2, w1H, -w1W / 2, w1H - r1);
    w1Shape.lineTo(-w1W / 2, r1);
    w1Shape.quadraticCurveTo(-w1W / 2, 0, -w1W / 2 + r1, 0);

    // Outer vertical stadium/slot hole through Wing 1 (from Images 1, 2, 3!)
    const w1Slot = new THREE.Path();
    w1Slot.moveTo(0.18, 0.38);
    w1Slot.lineTo(0.28, 0.38);
    w1Slot.lineTo(0.28, 0.78);
    w1Slot.lineTo(0.18, 0.78);
    w1Slot.closePath();
    w1Shape.holes.push(w1Slot);

    const w1Extrude = new THREE.ExtrudeGeometry(w1Shape, {
      depth: 0.065,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.012,
      bevelThickness: 0.012
    });
    w1Extrude.rotateX(Math.PI / 2); // Extends flat horizontally along +Z
    const w1Part = createPolycarbPart(w1Extrude, true, 18);
    wing1Group.add(w1Part);

    // Molded '1 ↑' Raised Guide Boss (Images 1, 2, 3!)
    const badge1Geo = new THREE.PlaneGeometry(0.52, 0.52);
    badge1Geo.rotateX(-Math.PI / 2);
    const badge1Mat = new THREE.MeshBasicMaterial({
      map: createWing1MoldedTexture(),
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const badge1 = new THREE.Mesh(badge1Geo, badge1Mat);
    badge1.position.set(-0.06, 0.042, 0.42);
    wing1Group.add(badge1);
    syringeGroup.add(wing1Group);

    // =========================================================================
    // 6. WING 2: MOVING TOP PADDLE (ARCH WINDOW, '2', SNAP LATCHES - Images 1, 2, 3!)
    // Hinged at the top spine of the barrel (Y = 0.28, Z = 0.05).
    // In Stage 4 & early Stage 5: Stands straight upright at ~85° (facing camera!)
    // In Stage 5 snap & Stages 6-8: Folds down flat over Wing 1 along +Z!
    // =========================================================================
    wing2Pivot = new THREE.Group();
    wing2Pivot.position.set(1.675, 0.28, 0.05);

    const w2Shape = new THREE.Shape();
    const w2W = 0.85, w2H = 0.98, r2 = 0.12;
    w2Shape.moveTo(-w2W / 2 + r2, 0);
    w2Shape.lineTo(w2W / 2 - r2, 0);
    w2Shape.quadraticCurveTo(w2W / 2, 0, w2W / 2, r2);
    w2Shape.lineTo(w2W / 2, w2H - r2);
    w2Shape.quadraticCurveTo(w2W / 2, w2H, w2W / 2 - r2, w2H);
    // Lateral catch recesses for snapping under catch towers:
    w2Shape.lineTo(w2W / 2 - 0.20, w2H);
    w2Shape.lineTo(w2W / 2 - 0.20, w2H - 0.08);
    w2Shape.lineTo(w2W / 2 - 0.34, w2H - 0.08);
    w2Shape.lineTo(w2W / 2 - 0.34, w2H);
    w2Shape.lineTo(-w2W / 2 + r2, w2H);
    w2Shape.quadraticCurveTo(-w2W / 2, w2H, -w2W / 2, w2H - r2);
    w2Shape.lineTo(-w2W / 2, r2);
    w2Shape.quadraticCurveTo(-w2W / 2, 0, -w2W / 2 + r2, 0);

    // Inverted-U Arch Window Cutout (Images 1, 2, 3!)
    const archWin = new THREE.Path();
    archWin.moveTo(-0.24, 0.16);
    archWin.lineTo(-0.02, 0.16);
    archWin.lineTo(-0.02, 0.68);
    archWin.quadraticCurveTo(-0.13, 0.80, -0.24, 0.68);
    archWin.closePath();
    w2Shape.holes.push(archWin);

    const w2Extrude = new THREE.ExtrudeGeometry(w2Shape, {
      depth: 0.065,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.012,
      bevelThickness: 0.012
    });
    w2Extrude.rotateX(Math.PI / 2);
    const w2Part = createPolycarbPart(w2Extrude, true, 18);
    w2Part.position.set(0, -0.20, 0);
    wing2Pivot.add(w2Part);

    // Molded '2' Badge (Faces camera +Z when upright in Stage 4/5, matches Images 1, 2, 3!)
    const badge2Geo = new THREE.PlaneGeometry(0.52, 0.72);
    badge2Geo.rotateX(Math.PI / 2);
    const badge2Mat = new THREE.MeshBasicMaterial({
      map: createWing2MoldedTexture(),
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const badge2 = new THREE.Mesh(badge2Geo, badge2Mat);
    badge2.position.set(0.18, -0.155, 0.48);
    wing2Pivot.add(badge2);
    syringeGroup.add(wing2Pivot);

    // =========================================================================
    // 7. STEPPED FRONT SHOULDER & 1.65 mm BEVELED CONICAL NOZZLE (Images 4 & 5!)
    // Smooth transition into 1.65 mm nozzle diameter with 45° bevel tip!
    // =========================================================================
    // Stepped Front Shoulder Cradle Collar (X = 2.10)
    const frontCollarGeo = new THREE.CylinderGeometry(0.26, 0.30, 0.14, 32);
    frontCollarGeo.rotateZ(-Math.PI / 2);
    const frontCollar = createPolycarbPart(frontCollarGeo, true, 18);
    frontCollar.position.set(2.17, 0, 0);
    syringeGroup.add(frontCollar);

    // Slender 1.65 mm Tapered Conical Nozzle (from X = 2.24 to 3.75)
    const nozLen = 1.51;
    const nozBaseR = 0.22;
    const nozTipR = 0.095; // 1.65 mm scaled diameter!
    const nozGeo = new THREE.CylinderGeometry(nozTipR, nozBaseR, nozLen, 36, 16, true);
    nozGeo.rotateZ(-Math.PI / 2);

    // Sharp 45° bevel cut at leading tip (t > 0.70)
    const posAttr = nozGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      const t = Math.max(0, (vx + nozLen / 2) / nozLen);
      if (t > 0.70) {
        const shear = (t - 0.70) / 0.30;
        posAttr.setX(i, vx - vy * 0.85 * shear);
      }
    }
    nozGeo.computeVertexNormals();

    const nozzlePart = createPolycarbPart(nozGeo, false, 25);
    nozzlePart.position.set(2.995, 0, 0);
    syringeGroup.add(nozzlePart);

    // Inner lumen for nozzle (authentic glass depth and refractive thickness)
    const innerNozGeo = new THREE.CylinderGeometry(nozTipR * 0.72, nozBaseR * 0.72, nozLen, 28, 1, true);
    innerNozGeo.rotateZ(-Math.PI / 2);
    const innerNoz = new THREE.Mesh(innerNozGeo, mats.polycarbClear);
    innerNoz.position.set(2.995, 0, 0);
    syringeGroup.add(innerNoz);

    // Polished beveled rim highlight ring at tip (X = 3.75)
    const bevelRimGeo = new THREE.RingGeometry(nozTipR * 0.72, nozTipR, 32);
    bevelRimGeo.rotateY(Math.PI / 2);
    bevelRimGeo.rotateZ(0.40);
    const bevelRimMat = new THREE.MeshBasicMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.80,
      side: THREE.DoubleSide
    });
    const bevelRim = new THREE.Mesh(bevelRimGeo, bevelRimMat);
    bevelRim.position.set(3.74, 0, 0);
    syringeGroup.add(bevelRim);

    // =========================================================================
    // 8. CRUCIFORM PLUNGER SHAFT & CIRCULAR THUMB PAD (Images 1 & 5!)
    // 4-fin cruciform cross-section, soft silicone tip, circular push-pad
    // =========================================================================
    plungerGroup = new THREE.Group();
    plungerGroup.position.set(-2.4, 0, 0);

    const shaftLen = 3.60;
    const ribThick = 0.038;
    const ribWidth = 0.26;

    // 4-Fin Cruciform (+) Cross-Section
    const finVGeo = new THREE.BoxGeometry(shaftLen, ribWidth, ribThick);
    const finHGeo = new THREE.BoxGeometry(shaftLen, ribThick, ribWidth);
    const finV = new THREE.Mesh(finVGeo, mats.whitePlunger);
    const finH = new THREE.Mesh(finHGeo, mats.whitePlunger);
    plungerGroup.add(finV, finH);

    // Front Internal Guide Piston Head (Centers the plunger cleanly inside the barrel, matching photo)
    const frontGuideGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.15, 24);
    frontGuideGeo.rotateZ(-Math.PI / 2);
    const frontGuide = new THREE.Mesh(frontGuideGeo, mats.whitePlunger);
    frontGuide.position.set(shaftLen / 2 + 0.075, 0, 0);
    plungerGroup.add(frontGuide);

    // RayOne Frosted Medical Polymer Stopper Head (Matches official reference photos - 100% uniform white/frosted polymer)

    // Circular Thumb Push-Pad Disc (from Images 1 & 5!)
    const thumbDiscRadius = 0.34;
    const thumbDiscThick = 0.070;
    const thumbGeo = new THREE.CylinderGeometry(thumbDiscRadius, thumbDiscRadius * 0.95, thumbDiscThick, 36);
    thumbGeo.rotateZ(Math.PI / 2);
    const thumbMesh = new THREE.Mesh(thumbGeo, mats.whitePlunger);
    thumbMesh.position.set(-shaftLen / 2 - thumbDiscThick / 2, 0, 0);
    plungerGroup.add(thumbMesh);

    // Ergonomic concave thumb depression
    const thumbConcaveGeo = new THREE.SphereGeometry(0.30, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.32);
    thumbConcaveGeo.rotateZ(-Math.PI / 2);
    const thumbConcave = new THREE.Mesh(thumbConcaveGeo, mats.whitePlunger);
    thumbConcave.position.set(-shaftLen / 2 - thumbDiscThick - 0.01, 0, 0);
    plungerGroup.add(thumbConcave);

    syringeGroup.add(plungerGroup);
    syringeGroup.renderOrder = 15;
    syringeGroup.traverse((child) => {
      if (child.isMesh) child.renderOrder = 15;
    });
    mainGroup.add(syringeGroup);
  }
  function createGalaxyIOLMesh() {
    const lensGroup = new THREE.Group();

    // =========================================================================
    // 1. AUTHENTIC RAYNER GALAXY® EDOF OPTIC (6.0 mm Biconvex Optical Disc)
    // 360-degree Enhanced Square Edge (anti-PCO barrier) & Concentric EDOF Zones
    // =========================================================================
    const opticGroup = new THREE.Group();

    // A. Biconvex Optical Lens Body
    const coreGeo = new THREE.SphereGeometry(0.36, 48, 24);
    coreGeo.scale(1.0, 0.22, 1.0);
    const opticCore = new THREE.Mesh(coreGeo, mats.iolOptic);
    opticGroup.add(opticCore);

    // B. 360-Degree Enhanced Square Edge Rim (Rayner Anti-PCO Barrier)
    const rimGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.046, 48);
    const rimMesh = new THREE.Mesh(rimGeo, mats.iolOptic);
    opticGroup.add(rimMesh);

    // C. Peripheral Step Collar
    const stepGeo = new THREE.TorusGeometry(0.32, 0.008, 12, 48);
    stepGeo.rotateX(Math.PI / 2);
    const stepMesh = new THREE.Mesh(stepGeo, mats.iolOptic);
    stepMesh.position.y = 0.024;
    opticGroup.add(stepMesh);

    // D. Rayner Galaxy Concentric EDOF Refractive Micro-Zones
    const edofRadii = [0.08, 0.13, 0.18, 0.23, 0.28];
    edofRadii.forEach((r, idx) => {
      const sphereR = 0.36;
      const hNorm = Math.sqrt(Math.max(0, 1.0 - (r / sphereR) * (r / sphereR)));
      const ringY = (sphereR * hNorm) * 0.22 + 0.003;

      const ringGeo = new THREE.TorusGeometry(r, 0.005 + idx * 0.001, 10, 48);
      ringGeo.rotateX(Math.PI / 2);
      const ringMesh = new THREE.Mesh(ringGeo, mats.iolOptic);
      ringMesh.position.y = ringY;
      opticGroup.add(ringMesh);
    });

    lensGroup.add(opticGroup);

    // =========================================================================
    // 2. RAYNER PATENTED ANTI-VAULTING HAPTICS (AVH®)
    // Modeled with precision flat-ribbon geometry, signature AVH hinge notch,
    // and bulbous teardrop footplate matching Rayner Galaxy IOL reference!
    // =========================================================================
    const createAVHHaptic = () => {
      const hShape = new THREE.Shape();
      hShape.moveTo(0.31, 0.14);
      hShape.bezierCurveTo(0.44, 0.22, 0.58, 0.20, 0.65, 0.08);
      hShape.bezierCurveTo(0.70, -0.02, 0.68, -0.16, 0.58, -0.28);
      hShape.bezierCurveTo(0.50, -0.38, 0.38, -0.42, 0.28, -0.40); // Teardrop footplate
      hShape.bezierCurveTo(0.24, -0.39, 0.23, -0.34, 0.27, -0.31); // Bulbous tip curve
      hShape.bezierCurveTo(0.36, -0.30, 0.46, -0.24, 0.52, -0.14);
      hShape.bezierCurveTo(0.58, -0.04, 0.56, 0.08, 0.48, 0.14);
      hShape.bezierCurveTo(0.42, 0.18, 0.36, 0.19, 0.32, 0.20);
      hShape.bezierCurveTo(0.27, 0.23, 0.22, 0.22, 0.25, 0.17);
      hShape.lineTo(0.31, 0.14);
      hShape.closePath();

      const extrudeSettings = {
        depth: 0.038,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.004,
        bevelThickness: 0.004
      };
      const hGeo = new THREE.ExtrudeGeometry(hShape, extrudeSettings);
      hGeo.rotateX(Math.PI / 2);
      hGeo.translate(0, -0.019, 0);

      return new THREE.Mesh(hGeo, mats.iolHaptic);
    };

    // Primary Haptic
    const haptic1 = createAVHHaptic();
    lensGroup.add(haptic1);

    // Secondary Symmetrical Haptic (180° Rotational Symmetry)
    const haptic2 = createAVHHaptic();
    haptic2.rotation.y = Math.PI;
    lensGroup.add(haptic2);

    return lensGroup;
  }

  function buildGalaxySpiralLens() {
    iolGroup = new THREE.Group();

    flatLensGroup = createGalaxyIOLMesh();
    flatLensGroup.position.set(1.675, -0.04, 0);
    iolGroup.add(flatLensGroup);

    // =========================================================================
    // 3. ROLLED IOL GEOMETRY FOR CARTRIDGE ADVANCEMENT
    // =========================================================================
    rolledLensGroup = new THREE.Group();
    const rollOuterGeo = new THREE.CylinderGeometry(0.108, 0.108, 0.72, 24, 1, true);
    rollOuterGeo.rotateZ(Math.PI / 2);
    const rollOuter = new THREE.Mesh(rollOuterGeo, mats.iolOptic);
    rolledLensGroup.add(rollOuter);

    const rollCoreGeo = new THREE.CylinderGeometry(0.068, 0.068, 0.88, 20);
    rollCoreGeo.rotateZ(Math.PI / 2);
    const rollCore = new THREE.Mesh(rollCoreGeo, mats.iolHaptic);
    rolledLensGroup.add(rollCore);

    rolledLensGroup.position.set(1.675, 0, 0);
    rolledLensGroup.visible = false;
    iolGroup.add(rolledLensGroup);

    // Viscoelastic chamber fill (crystal clear glistening gel with micro-bubbles)
    ovdChamberFill = new THREE.Group();
    ovdChamberFill.position.set(1.675, 0.02, 0);

    const gelCoreGeo = new THREE.CylinderGeometry(0.24, 0.24, 1.02, 28);
    gelCoreGeo.rotateZ(Math.PI / 2);
    const gelCoreMesh = new THREE.Mesh(gelCoreGeo, mats.ovdGel);
    gelCoreMesh.renderOrder = 25;
    ovdChamberFill.add(gelCoreMesh);

    // Glistening meniscus top bulge
    const gelMeniscusGeo = new THREE.SphereGeometry(0.25, 20, 16);
    gelMeniscusGeo.scale(1.9, 0.25, 0.75);
    const gelMeniscus = new THREE.Mesh(gelMeniscusGeo, mats.ovdGel);
    gelMeniscus.position.set(0, 0.10, 0);
    gelMeniscus.renderOrder = 25;
    ovdChamberFill.add(gelMeniscus);

    // Authentic micro-bubbles inside the gel volume
    const bubbleMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.02,
      transmission: 0.92,
      transparent: true,
      opacity: 0.88,
      clearcoat: 1.0,
      depthWrite: false
    });
    const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.034, 12, 12), bubbleMat);
    b1.position.set(-0.25, 0.04, 0.05);
    const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 12), bubbleMat);
    b2.position.set(0.18, 0.06, -0.04);
    const b3 = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 12), bubbleMat);
    b3.position.set(0.02, 0.08, 0.07);
    ovdChamberFill.add(b1, b2, b3);

    ovdChamberFill.visible = false;
    iolGroup.add(ovdChamberFill);

    syringeGroup.add(iolGroup);
  }
  /* --------------------------------------------------------------------------
     8. 1 mL OPHTHALMIC OVD VISCOELASTIC SYRINGE (STAGE 4)
     -------------------------------------------------------------------------- */
  let ovdPlungerGroup = null;
  let ovdRubberStopper = null;
  let ovdSyringeFluidMesh = null;

  function buildRefinedOVDSyringe() {
    // AUTHENTIC 1.0 mL OPHTHALMIC PREFILLED VISCOELASTIC (OVD) GLASS SYRINGE
    // (Rayner RayVisc® / Healon® clinical standard: crystal borosilicate glass,
    // molded double-ear glass finger flange, 27G angled blunt cannula, medical rubber stopper)
    cannulaGroup = new THREE.Group();

    // 1. Curved 27G Stainless Steel Ophthalmic Viscoelastic Cannula
    // Starts at the cartridge arrow port (0, 0, 0) and curves smoothly up to the luer hub (0, 1.25, 1.45)
    const cannulaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.0, 0.0),
      new THREE.Vector3(0, 0.18, 0.42),
      new THREE.Vector3(0, 0.65, 0.95),
      new THREE.Vector3(0, 1.25, 1.45)
    ]);
    const needleGeo = new THREE.TubeGeometry(cannulaCurve, 32, 0.026, 12, false);
    const needleMesh = new THREE.Mesh(needleGeo, mats.stainlessSteel);
    cannulaGroup.add(needleMesh);

    // Active Viscoelastic Injection Stream & Meniscus Droplet (Thick cohesive light-blue gel)
    const streamCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -0.04, -0.06),
      new THREE.Vector3(0, -0.10, -0.14),
      new THREE.Vector3(0, -0.16, -0.20)
    ]);
    const streamGeo = new THREE.TubeGeometry(streamCurve, 24, 0.085, 16, false);
    ovdStreamMesh = new THREE.Mesh(streamGeo, mats.ovdGel);
    ovdStreamMesh.visible = false;
    ovdStreamMesh.renderOrder = 30;
    cannulaGroup.add(ovdStreamMesh);

    // Glistening meniscus droplet at needle orifice
    const dropletGeo = new THREE.SphereGeometry(0.046, 16, 16);
    dropletGeo.scale(1.0, 1.30, 1.0);
    const dropletMesh = new THREE.Mesh(dropletGeo, mats.ovdGel);
    dropletMesh.position.set(0, -0.015, 0);
    dropletMesh.renderOrder = 30;
    ovdStreamMesh.add(dropletMesh);

    // 2. Syringe Body Group (Anchored at the cannula hub junction, angled cleanly at 45 deg)
    const hubGroup = new THREE.Group();
    hubGroup.position.set(0, 1.25, 1.45);
    hubGroup.rotation.x = -0.785; // Clean 45-degree angle pointing towards surgeon

    // Standard Ophthalmic Luer-Lok Fitting (Medical polypropylene)
    const hubConeGeo = new THREE.CylinderGeometry(0.12, 0.08, 0.22, 20);
    const hubCone = new THREE.Mesh(hubConeGeo, mats.luerHub);
    hubCone.position.y = 0.15;
    hubGroup.add(hubCone);

    const hubCollarGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.14, 24);
    const hubCollar = new THREE.Mesh(hubCollarGeo, mats.luerHub);
    hubCollar.position.y = 0.33;
    hubGroup.add(hubCollar);

    // 3. Clear Graduated Borosilicate Glass Barrel (0.1 mL to 1.0 mL)
    const barrelGlassGeo = new THREE.CylinderGeometry(0.24, 0.24, 2.2, 32, 1, true);
    const ovdBarrelMat = new THREE.MeshPhysicalMaterial({
      map: createOVDBarrelTexture(),
      roughness: 0.06,
      metalness: 0.02,
      transmission: 0.94,
      ior: 1.52,
      thickness: 0.25,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide
    });
    const barrelGlass = new THREE.Mesh(barrelGlassGeo, ovdBarrelMat);
    barrelGlass.position.y = 1.55;
    hubGroup.add(barrelGlass);

    // 4. VISIBLE VISCOELASTIC LIQUID COLUMN INSIDE SYRINGE BARREL
    // Luminous cyan cohesive gel column that visibly decreases as 0.3 mL is injected!
    const fluidGeo = new THREE.CylinderGeometry(0.225, 0.225, 1.6, 24);
    ovdSyringeFluidMesh = new THREE.Mesh(fluidGeo, mats.ovdSyringeLiquid);
    ovdSyringeFluidMesh.position.y = 1.25;
    ovdSyringeFluidMesh.renderOrder = 4;
    hubGroup.add(ovdSyringeFluidMesh);

    // 5. AUTHENTIC MOLDED CLEAR GLASS DOUBLE-EAR FINGER FLANGE (NO BLUE DONUT!)
    // Standard borosilicate glass double-winged ear flange integrated into top of barrel
    const fFlangeShape = new THREE.Shape();
    fFlangeShape.absellipse(0, 0, 0.56, 0.28, 0, Math.PI * 2, false, 0);
    const fHole = new THREE.Path();
    fHole.absarc(0, 0, 0.22, 0, Math.PI * 2, true);
    fFlangeShape.holes.push(fHole);
    const fFlangeGeo = new THREE.ExtrudeGeometry(fFlangeShape, { depth: 0.035, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.015, bevelThickness: 0.015 });
    fFlangeGeo.rotateX(Math.PI / 2);
    const glassFlange = new THREE.Mesh(fFlangeGeo, mats.syringeGlass);
    glassFlange.position.y = 2.65;
    hubGroup.add(glassFlange);

    // Subtle polished glass rim edge
    const fEdgeGeo = new THREE.EdgesGeometry(fFlangeGeo, 24);
    const fEdgeLines = new THREE.LineSegments(fEdgeGeo, new THREE.LineBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.35
    }));
    fEdgeLines.position.copy(glassFlange.position);
    hubGroup.add(fEdgeLines);

    // 6. Plunger Group with Dual-Ribbed Rubber Stopper
    ovdPlungerGroup = new THREE.Group();
    ovdPlungerGroup.position.y = 2.05;

    // Charcoal surgical halobutyl rubber stopper with dual sealing ribs
    const stopperGeo = new THREE.CylinderGeometry(0.23, 0.23, 0.28, 28);
    ovdRubberStopper = new THREE.Mesh(stopperGeo, mats.rubberStopper);
    ovdRubberStopper.position.y = 0.14;
    ovdPlungerGroup.add(ovdRubberStopper);

    // Slender cruciform fluted plunger shaft
    const ovdRodGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.8, 16);
    const ovdRod = new THREE.Mesh(ovdRodGeo, mats.whitePlunger);
    ovdRod.position.y = 1.15;
    ovdPlungerGroup.add(ovdRod);

    // Ergonomic circular thumb rest pad
    const thumbPadGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.06, 32);
    const thumbPad = new THREE.Mesh(thumbPadGeo, mats.whitePlunger);
    thumbPad.position.y = 2.05;
    ovdPlungerGroup.add(thumbPad);

    hubGroup.add(ovdPlungerGroup);
    cannulaGroup.add(hubGroup);

    cannulaGroup.position.set(1.675, -0.04, 0.38);
    syringeGroup.add(cannulaGroup);
  }

  /* --------------------------------------------------------------------------
     9. REALISTIC 3D HUMAN EYE MODEL (STAGE 8 OPERATING MICROSCOPE ANTERIOR VIEW)
     -------------------------------------------------------------------------- */
  function buildRealistic3DHumanEye() {
    // REALISTIC ANATOMICAL HUMAN EYE (Operating Microscope Anterior Surgical View)
    eyeGroup = new THREE.Group();
    eyeGroup.position.set(4.80, 0.0, 0.0);

    // =========================================================================
    // 1. STERILE OPHTHALMIC SURGICAL DRAPE
    // Clean medical-blue surgical drape framing the eye globe
    // =========================================================================
    const drapeShape = new THREE.Shape();
    drapeShape.moveTo(-3.6, -2.8);
    drapeShape.lineTo(3.6, -2.8);
    drapeShape.lineTo(3.6, 2.8);
    drapeShape.lineTo(-3.6, 2.8);
    drapeShape.closePath();

    const drapeHole = new THREE.Path();
    drapeHole.absellipse(0, 0, 1.42, 1.42, 0, Math.PI * 2, true);
    drapeShape.holes.push(drapeHole);

    const drapeGeo = new THREE.ShapeGeometry(drapeShape, 36);
    drapeGeo.rotateX(-Math.PI / 2); // Lies flat on X-Z plane below the equator
    const drapeMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Surgical drape blue
      roughness: 0.88,
      metalness: 0.02,
      side: THREE.DoubleSide
    });
    const drapeMesh = new THREE.Mesh(drapeGeo, drapeMat);
    drapeMesh.position.set(0, -0.42, 0);
    eyeGroup.add(drapeMesh);

    // =========================================================================
    // 2. COMPLETE ANATOMICAL 3D SCLERA GLOBE (SPHERICAL EYEBALL)
    // Smooth spherical human eye globe with open anterior limbus (R = 0.82)
    // Seamlessly connects with cornea at Y = 0.22, wraps into 3D sphere to Y = -1.97
    // =========================================================================
    // thetaStart = 0.7155 rad (~41 deg), polar angle for limbus at R = 0.82 on R = 1.25 sphere
    const scleraGeo = new THREE.SphereGeometry(1.25, 64, 48, 0, Math.PI * 2, 0.7155, Math.PI - 0.7155);
    const scleraMat = new THREE.MeshStandardMaterial({
      map: createScleraVesselTexture(),
      roughness: 0.28,
      metalness: 0.02,
      side: THREE.DoubleSide
    });
    const scleraMesh = new THREE.Mesh(scleraGeo, scleraMat);
    // Center at Y = -0.723 places the limbus edge exactly at Y = 0.22 with R = 0.82:
    scleraMesh.position.set(0, -0.723, 0);
    eyeGroup.add(scleraMesh);

    // Limbal Transition Ring (Translucent grey-blue junction where sclera meets cornea)
    const limbusGeo = new THREE.RingGeometry(0.80, 0.84, 64);
    limbusGeo.rotateX(-Math.PI / 2);
    const limbusMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      transparent: true,
      opacity: 0.35,
      roughness: 0.4,
      side: THREE.DoubleSide
    });
    const limbusMesh = new THREE.Mesh(limbusGeo, limbusMat);
    limbusMesh.position.set(0, 0.221, 0);
    eyeGroup.add(limbusMesh);

    // =========================================================================
    // 3. RETRO-ILLUMINATED FUNDUS RED REFLEX & POSTERIOR CAPSULE
    // Warm glowing amber-red retro-illumination from coaxial operating light
    // =========================================================================
    const fundusGeo = new THREE.CircleGeometry(0.70, 48);
    fundusGeo.rotateX(-Math.PI / 2);
    const fundusMat = new THREE.MeshBasicMaterial({
      map: createFundusRedReflexTexture(),
      side: THREE.DoubleSide
    });
    const fundusMesh = new THREE.Mesh(fundusGeo, fundusMat);
    fundusMesh.position.set(0, 0.06, 0);
    eyeGroup.add(fundusMesh);

    // =========================================================================
    // 4. CAPSULAR BAG EQUATOR & CONTINUOUS CURVILINEAR CAPSULORHEXIS (CCC)
    // 5.2 mm circular capsular opening through which the IOL is delivered
    // =========================================================================
    // Capsular Bag Equator Ring (R = 0.68)
    const bagGeo = new THREE.TorusGeometry(0.68, 0.016, 16, 48);
    bagGeo.rotateX(-Math.PI / 2);
    const bagMat = new THREE.MeshBasicMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.30
    });
    capsularBagMesh = new THREE.Mesh(bagGeo, bagMat);
    capsularBagMesh.position.set(0, 0.14, 0);
    eyeGroup.add(capsularBagMesh);

    // Continuous Curvilinear Capsulorhexis (CCC 5.2 mm rim at R = 0.38)
    const cccGeo = new THREE.TorusGeometry(0.38, 0.009, 12, 48);
    cccGeo.rotateX(-Math.PI / 2);
    const cccMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.88
    });
    const cccMesh = new THREE.Mesh(cccGeo, cccMat);
    cccMesh.position.set(0, 0.18, 0);
    eyeGroup.add(cccMesh);

    // =========================================================================
    // 5. PHOTOREALISTIC IRIS & SURGICALLY DILATED PUPIL (MYDRIASIS)
    // Inner R = 0.44 (dilated 7.5 mm pupil), Outer R = 0.82 (limbus)
    // =========================================================================
    const irisGeo = new THREE.RingGeometry(0.44, 0.82, 64);
    irisGeo.rotateX(-Math.PI / 2);
    const irisMat = new THREE.MeshStandardMaterial({
      map: createIrisTexture(),
      roughness: 0.35,
      metalness: 0.02,
      side: THREE.DoubleSide
    });
    irisMesh = new THREE.Mesh(irisGeo, irisMat);
    irisMesh.position.set(0, 0.22, 0);
    eyeGroup.add(irisMesh);

    // =========================================================================
    // 6. CRYSTAL-CLEAR ASPHERIC CORNEAL DOME
    // Transparent dome rising from R = 0.82 at Y = 0.22 up to apex at Y = 0.52
    // =========================================================================
    const corneaGeo = new THREE.SphereGeometry(0.84, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.48);
    corneaGeo.scale(1.0, 0.42, 1.0);
    const corneaMat = new THREE.MeshPhysicalMaterial({
      color: 0xf0f9ff,
      roughness: 0.015,
      metalness: 0.0,
      transmission: 0.95,
      ior: 1.376,
      thickness: 0.30,
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    corneaMesh = new THREE.Mesh(corneaGeo, corneaMat);
    corneaMesh.position.set(0, 0.22, 0);
    eyeGroup.add(corneaMesh);

    // Coaxial Operating Microscope Purkinje Reflection Glints
    const glintGeo = new THREE.CircleGeometry(0.042, 24);
    glintGeo.rotateX(-Math.PI / 2);
    const glintMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });
    const glint1 = new THREE.Mesh(glintGeo, glintMat);
    glint1.position.set(-0.16, 0.54, -0.14);
    eyeGroup.add(glint1);

    const glint2 = new THREE.Mesh(glintGeo, glintMat);
    glint2.position.set(0.14, 0.53, 0.15);
    eyeGroup.add(glint2);

    // =========================================================================
    // 7. TEMPORAL CLEAR CORNEAL INCISION TUNNEL (2.2 mm CCI)
    // Tri-planar limbal incision slit at X = -0.80, Y = 0.24, Z = 0.0
    // =========================================================================
    // Realistic anatomical micro-incision bevel slit (clean tissue refraction - no cyan box)
    const incisionGeo = new THREE.BoxGeometry(0.12, 0.02, 0.20);
    const incisionMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      roughness: 0.08,
      transmission: 0.90,
      transparent: true,
      opacity: 0.38,
      depthWrite: false
    });
    incisionHighlight = new THREE.Mesh(incisionGeo, incisionMat);
    incisionHighlight.position.set(-0.80, 0.24, 0.0);
    eyeGroup.add(incisionHighlight);

    // =========================================================================
    // 8. IMPLANTED RAYNER GALAXY® IOL IN CAPSULAR BAG
    // Resting peacefully in capsular bag plane (Y = 0.16)
    // =========================================================================
    implantedLensGroup = createGalaxyIOLMesh();
    implantedLensGroup.position.set(0.0, 0.16, 0.0);
    implantedLensGroup.visible = false;
    eyeGroup.add(implantedLensGroup);

    eyeGroup.visible = false;
    mainGroup.add(eyeGroup);
  }

  /* --------------------------------------------------------------------------
     10. 8-STAGE OFFICIAL LOADING GUIDE CONTROLLER & TELEMETRY
     -------------------------------------------------------------------------- */
    function setStage(stageNum, immediate) {
    currentStage = Math.max(1, Math.min(TOTAL_STAGES, stageNum));
    stageProgress = 0;

    // Carton Box is ONLY visible in Stage 1!
    if (cartonBoxGroup) {
      cartonBoxGroup.visible = (currentStage === 1);
      cartonBoxGroup.position.set(0.4, 0.95, -1.8);
      cartonBoxGroup.rotation.set(0.18, -0.12, 0);
      if (cartonFlapPivot) cartonFlapPivot.rotation.set(0, 0, 0);
      ['darkGalaxyFront', 'darkGalaxyBack', 'darkGalaxySide', 'darkGalaxyTop', 'cartonInnerLiner', 'cartonInnerBed', 'cartonTop', 'cartonFront', 'cartonBack', 'cartonLeft', 'cartonBottom', 'cartonFlap'].forEach((mKey) => {
        if (mats[mKey]) mats[mKey].opacity = 1.0;
      });
      if (mats.cartonShadow) mats.cartonShadow.opacity = 0.40;
    }

    // Guaranteed baseline resets: reset positions, rotations, AND uncurled flat geometries
    if (primaryPouchGroup) {
      primaryPouchGroup.position.set(0.4, 0.55, 0.0);
      primaryPouchGroup.rotation.set(0, 0, 0);
      primaryPouchGroup.visible = (currentStage === 1 || currentStage === 2);
      if (pouchTopMesh && pouchTopOrigGeo) pouchTopMesh.geometry.copy(pouchTopOrigGeo);
      if (pouchBottomMesh && pouchBottomOrigGeo) pouchBottomMesh.geometry.copy(pouchBottomOrigGeo);
      if (mats.pouchFilm) mats.pouchFilm.opacity = 0.92;
      if (mats.pouchTyvek) mats.pouchTyvek.opacity = 1.0;
    }
    if (secondaryTrayMesh) {
      secondaryTrayMesh.position.set(0.4, 0.48, 0.0);
      secondaryTrayMesh.rotation.set(0, 0, 0);
      secondaryTrayMesh.visible = (currentStage >= 2 && currentStage <= 7);
      if (mats.medicalTray) {
        mats.medicalTray.transparent = true;
        mats.medicalTray.opacity = (currentStage >= 2 && currentStage <= 7) ? 0.44 : 0.0;
      }
    }
    if (procedureTubGroup) {
      procedureTubGroup.visible = false;
    }
    if (secondaryLidMesh && secondaryLidOrigGeo) {
      secondaryLidMesh.geometry.copy(secondaryLidOrigGeo);
      secondaryLidMesh.position.set(0.4, 0.49, 0.0);
      secondaryLidMesh.rotation.set(0, 0, 0);
      if (currentStage === 4) {
        applyPeelToMesh(secondaryLidMesh, secondaryLidOrigGeo, 0.50, 1.0);
      }
      secondaryLidMesh.visible = (currentStage >= 2 && currentStage <= 4);
      if (secondaryLidMesh.material) {
        secondaryLidMesh.material.opacity = 1.0;
        secondaryLidMesh.material.depthWrite = true;
      }
    }
    // Syringe is strictly HIDDEN in Stages 1 & 2 - ONLY revealed in Stage 3 (second peeling)!
    if (syringeGroup) syringeGroup.visible = currentStage >= 3;
    if (flatLensGroup) flatLensGroup.visible = currentStage >= 3;
    if (waterMesh) {
      waterMesh.position.set(0.4, 0.22, 0.0);
      waterMesh.rotation.set(0, 0, 0);
      waterMesh.scale.set(1.0, 1.0, 1.0);
      // Saline in blister pack is ONLY present in Stage 3 (sealed pack opened) and Stage 4 (prior to drainage)
      waterMesh.visible = (currentStage === 3) || (currentStage === 4);
    }
    if (cannulaGroup && currentStage !== 5) cannulaGroup.visible = false;
    if (ovdStreamMesh && currentStage !== 5) ovdStreamMesh.visible = false;
    if (salineStreamMesh) salineStreamMesh.visible = false;
    if (salineSplashGroup) salineSplashGroup.visible = false;
    if (salineImpactMesh) salineImpactMesh.visible = false;

    // Waste disposal basin: 100% EMPTY prior to pouring in Stage 4; retains drained saline in Stage 5+
    if (drainWaterMesh) {
      if (currentStage < 4) {
        drainWaterMesh.visible = false;
        drainWaterMesh.position.y = 0.02;
        if (drainWaterVolumeMesh) {
          drainWaterVolumeMesh.visible = false;
          drainWaterVolumeMesh.scale.set(1, 0.01, 1);
        }
      } else if (currentStage === 5) {
        drainWaterMesh.visible = false; // Starts 100% completely EMPTY before pouring!
        drainWaterMesh.position.y = 0.02;
        if (drainWaterVolumeMesh) {
          drainWaterVolumeMesh.visible = false;
          drainWaterVolumeMesh.scale.set(1, 0.01, 1);
        }
      } else {
        drainWaterMesh.visible = true;  // Retains drained fluid from Stage 5 onwards
        drainWaterMesh.position.y = 0.50;
        if (drainWaterVolumeMesh) {
          drainWaterVolumeMesh.visible = true;
          drainWaterVolumeMesh.scale.set(1, 1.0, 1);
        }
      }
    }

    document.querySelectorAll('[data-galaxy-step]').forEach((btn) => {
      const s = parseInt(btn.getAttribute('data-galaxy-step'), 10);
      const active = s === currentStage;
      btn.classList.toggle('is-active', active);
      btn.classList.toggle('border-sky', active);
      btn.classList.toggle('bg-sky/20', active);
      btn.classList.toggle('text-white', active);
      btn.classList.toggle('border-cream/15', !active);
      btn.classList.toggle('bg-white/[0.03]', !active);
      btn.classList.toggle('text-cream/70', !active);
    });

    const progressEl = document.getElementById('galaxy-video-progress');
    if (progressEl) {
      const pct = (currentStage / TOTAL_STAGES) * 100;
      progressEl.style.width = pct + '%';
    }

    const counterEl = document.getElementById('galaxy-stage-counter');
    if (counterEl) counterEl.textContent = `STAGE 0${currentStage} / 09`;

    const stageDropdown = document.getElementById('galaxy-stage-dropdown');
    if (stageDropdown && stageDropdown.value !== String(currentStage)) {
      stageDropdown.value = String(currentStage);
    }

    const stageNames = {
      1: 'Stage 01 · Carton Unboxing',
      2: 'Stage 02 · Primary Peel Pouch',
      3: 'Stage 03 · Secondary Foil Peel',
      4: 'Stage 04 · Saline Drainage',
      5: 'Stage 05 · OVD Priming',
      6: 'Stage 06 · Lock & Roll™',
      7: 'Stage 07 · Lift Injector',
      8: 'Stage 08 · Plunger Advance',
      9: 'Stage 09 · Micro-Implantation'
    };
    const stageLabel = document.getElementById('galaxy-stage-label');
    if (stageLabel && stageNames[currentStage]) {
      stageLabel.textContent = stageNames[currentStage];
    }
    document.querySelectorAll('.galaxy-stage-opt').forEach((opt) => {
      const isThis = parseInt(opt.getAttribute('data-stage-val'), 10) === currentStage;
      opt.classList.toggle('is-selected', isThis);
      const check = opt.querySelector('.stage-check');
      if (check) check.classList.toggle('opacity-100', isThis);
      if (check) check.classList.toggle('opacity-0', !isThis);
    });

    const camDropdown = document.getElementById('galaxy-cam-dropdown');
    if (camDropdown && camDropdown.value !== 'reset') {
      camDropdown.value = 'reset';
    }
    const camLabel = document.getElementById('galaxy-cam-label');
    if (camLabel) camLabel.textContent = 'Surgical Overview';
    document.querySelectorAll('.galaxy-cam-opt').forEach((opt) => {
      const isReset = opt.getAttribute('data-cam-val') === 'reset';
      opt.classList.toggle('is-selected', isReset);
      const check = opt.querySelector('.cam-check');
      if (check) check.classList.toggle('opacity-100', isReset);
      if (check) check.classList.toggle('opacity-0', !isReset);
    });

    updateTelemetry(currentStage);

    // Optimized close-up camera angles (Large, prominent view of sterile pack & injector!)
    // Balanced, comfortable camera zoom - whole procedure clearly visible with breathing space!
    switch (currentStage) {
      case 1: // Outer Presentation Box (Wide Studio Hero View - Zoomed Out & Elegant!)
        targetRotY = -0.12;
        targetRotX = 0.26;
        targetCamPos.set(0.4, 6.2, 22.0);
        targetCamLook.set(0.4, 1.2, 0.0);
        break;

      case 2: // Primary Blister Peel (Full pack view - Wide Comfortable Surgical View!)
        targetRotY = -0.12;
        targetRotX = 0.28;
        targetCamPos.set(0.4, 4.6, 15.2);
        targetCamLook.set(0.2, -0.15, 0.0);
        break;

      case 3: // Secondary Half Peel (Full pack & water reservoir - Wide Surgical View!)
        targetRotY = -0.14;
        targetRotX = 0.28;
        targetCamPos.set(0.4, 4.6, 15.2);
        targetCamLook.set(0.2, -0.15, 0.0);
        break;

      case 4: // Saline Drain: Panoramic View of Tilting Tray & Filling Basin
        targetRotY = -0.10;
        targetRotX = 0.28;
        targetCamPos.set(-4.5, 4.2, 16.5);
        targetCamLook.set(-5.0, 0.40, 0.0);
        break;

      case 5: // OVD Priming: Macro View of Cartridge Port & Cannula Entry
        targetRotY = -0.30;
        targetRotX = 0.34;
        targetCamPos.set(2.08, 1.8, 6.2);
        targetCamLook.set(2.08, 0.0, 0.20);
        break;

      case 6: // Lock & Roll Cartridge Click: Macro Close-up of Cartridge & Wings Snap
        targetRotY = -0.26;
        targetRotX = 0.32;
        targetCamPos.set(2.08, 1.6, 5.6);
        targetCamLook.set(2.08, -0.10, 0.20);
        break;

      case 7: // Lift Injector from Tray (Camera smoothly frames elevated syringe at Y=1.65)
        targetRotY = -0.16;
        targetRotX = 0.16;
        targetCamPos.set(0.6, 3.4, 11.2);
        targetCamLook.set(0.4, 1.15, 0.0);
        break;

      case 8: // Controlled Plunger Advance (Hero elevation view - completely clear of tray!)
        targetRotY = -0.18;
        targetRotX = 0.12;
        targetCamPos.set(0.6, 3.0, 10.8);
        targetCamLook.set(0.4, 1.65, 0.0);
        break;

      case 9: // 3D Human Eye Implantation: Operating Microscope Anterior View
        targetRotY = 0.0;
        targetRotX = 0.0; // Keep world level so mouse orbiting is completely natural
        targetCamPos.set(4.80, 5.2, 4.2); // High-angle operating microscope view looking directly through cornea
        targetCamLook.set(4.80, 0.18, 0.0);
        break;
    }

    if (immediate) {
      userRotY = targetRotY;
      userRotX = targetRotX;
      camera.position.copy(targetCamPos);
      currentCamLook.copy(targetCamLook);
      camera.lookAt(currentCamLook);
    }
  }

  function updateTelemetry(stage) {
    const titleEl = document.getElementById('galaxy-step-title');
    const descEl = document.getElementById('galaxy-step-desc');
    const statusEl = document.getElementById('galaxy-step-status');
    const metric1El = document.getElementById('galaxy-metric-1');
    const metric2El = document.getElementById('galaxy-metric-2');
    const metric3El = document.getElementById('galaxy-metric-3');
    const stageNameEl = document.getElementById('galaxy-stage-name');

    const stagesData = {
      1: {
        shortName: 'Carton Unbox',
        title: 'Stage 01 · Outer Packaging Carton Unboxing',
        desc: 'Inspect the clinical Rayner RayOne outer pharmaceutical carton box. Open the end tuck flap and smoothly retrieve the sealed primary chevron sterile pouch containing the preloaded RayOne delivery system onto the surgical preparation field.',
        status: 'OUTER CARTON OPENED · STERILE POUCH RETRIEVED',
        m1: 'RayOne®', m1Label: 'Packaging',
        m2: '+21.5 D', m2Label: 'Power / LOT',
        m3: 'Primary Pouch', m3Label: 'Retrieved'
      },
      2: {
        shortName: 'Primary Blister Peel',
        title: 'Stage 02 · Primary Blister Pack Peel',
        desc: 'Peel open the chevron sterile barrier pouch like a candy wrapper to aseptically transfer the secondary blister pack onto the operating table. The sealed secondary pack remains completely intact.',
        status: 'PRIMARY BLISTER UNSEALED · STERILE TRANSFER',
        m1: 'Primary Pack', m1Label: 'Layer 1',
        m2: '100% Sterile', m2Label: 'Barrier Status',
        m3: 'Complete Peel', m3Label: 'Lid Action'
      },
      3: {
        shortName: 'Secondary Half-Peel',
        title: 'Stage 03 · Secondary Blister Half-Peel',
        desc: 'Carefully peel back the lid half way down the second blister pack. Do not remove completely at this point in order to prepare for controlled saline drainage.',
        status: 'HALF-PEEL INITIATED · SALINE EXPOSED',
        m1: '50% Peel', m1Label: 'Lid Position',
        m2: 'Hydrated', m2Label: 'Saline Status',
        m3: 'Controlled', m3Label: 'Peel Motion'
      },
      4: {
        shortName: 'Saline Drainage',
        title: 'Stage 04 · Saline Drainage',
        desc: 'Carefully drain the saline from the blister tray into the disposal container and remove the remaining lid. The injector remains securely seated in its blister pack tray. For hydrophilic lenses, do not wait more than 3 minutes before adding OVD · dehydration risk.',
        status: 'SALINE DRAINED · TRAY RESTING ON FIELD',
        m1: '< 3 Min', m1Label: 'OVD Countdown',
        m2: 'Blister Tray', m2Label: 'Location',
        m3: 'Zero Saline', m3Label: 'Drain Complete'
      },
      5: {
        shortName: 'OVD Priming (0.3 mL)',
        title: 'Stage 05 · Viscoelastic (OVD) Priming',
        desc: '*IMPORTANT* With the injector seated in the blister tray, insert the viscoelastic cannula into the opening marked with an arrow on the cartridge and apply sufficient OVD to completely fill the cartridge (equivalent to approximately 0.3 ml). NOTE: Rayner’s patented "Lock & Roll" injector technology uses the mechanical force of OVD inserted into the indicated port to move the IOL from "storage" to "roll ready" position at the bottom of the cartridge; do not add OVD directly via the nozzle tip.',
        status: '*IMPORTANT* · 0.3 mL OVD DELIVERED',
        m1: '0.3 mL', m1Label: 'OVD Volume',
        m2: 'Blister Tray', m2Label: 'Staging Tray',
        m3: 'Hydraulic', m3Label: 'Roll Trigger'
      },
      6: {
        shortName: 'Lock & Roll™ Cartridge Click',
        title: 'Stage 06 · Lock & Roll™ Cartridge Closure',
        desc: 'Keep the injector resting in the blister tray and close the cartridge firmly together by pushing the moving half of the cartridge (labelled 2) against the fixed half until you hear it click closed. Check both clips have "clicked" shut and secured the cartridge.',
        status: 'AUDIBLE CLICK · CLIPS SECURED',
        m1: 'Audible Click', m1Label: 'Snap Lock',
        m2: 'Blister Tray', m2Label: 'Location',
        m3: 'Dual Clips', m3Label: 'Security Check'
      },
      7: {
        shortName: 'Lift from Blister Tray',
        title: 'Stage 07 · Lift Injector from Blister Tray',
        desc: 'Gently lift out the primed, locked injector from the blister tray. Stabilize the syringe between index and middle fingers on the elliptical flange, with thumb rested comfortably on the plunger pad ready for delivery.',
        status: 'INJECTOR LIFTED FROM TRAY · READY FOR DELIVERY',
        m1: 'Lifted from Tray', m1Label: 'Tray Status',
        m2: '1-Handed', m2Label: 'Surgical Grip',
        m3: 'Flange Rest', m3Label: 'Finger Position'
      },
      8: {
        shortName: 'Controlled Plunger Advance',
        title: 'Stage 08 · Controlled Plunger Advancement',
        desc: 'Press the plunger in a slow and controlled manner. If excessive resistance is felt this could indicate a blockage; discontinue use of the product and return the product and all packaging to Rayner. In the case of IOL rotation during ejection from the nozzle, gently rotate the injector in the opposite direction to counteract any movement.',
        status: 'SLOW & CONTROLLED · 1.65 mm NOZZLE GLIDE',
        m1: '1.65 mm', m1Label: 'Parallel Bore',
        m2: 'Resistance OK', m2Label: 'Safety Monitor',
        m3: 'Cruciform', m3Label: 'Anti-Flex Shaft'
      },
      9: {
        shortName: 'Human Eye Implantation',
        title: 'Stage 09 · 3D Human Eye Implantation & I/A Cleanup',
        desc: 'Stop depressing the plunger when the IOL exits the nozzle. Insert the 45° beveled nozzle tip through the 2.2 mm clear corneal incision. The RayOne® Galaxy AI spiral optic unfurls smoothly inside the capsular bag with 0% light loss. Discard injector. Following implantation, irrigate/aspirate to eliminate any OVD residues from the eye, especially behind the IOL.',
        status: 'EYE IMPLANTATION COMPLETE · 0% LIGHT LOSS',
        m1: '2.2 mm Incision', m1Label: 'Clear Corneal',
        m2: 'Planar AVH', m2Label: 'Bag Fixation',
        m3: 'I/A Clean', m3Label: 'OVD Clearance'
      }
    };

    const d = stagesData[stage];
    if (!d) return;

    if (titleEl) titleEl.textContent = d.title;
    if (descEl) descEl.textContent = d.desc;
    if (statusEl) statusEl.textContent = d.status;
    if (stageNameEl) stageNameEl.textContent = d.shortName;

    if (metric1El) {
      metric1El.querySelector('.metric-val').textContent = d.m1;
      metric1El.querySelector('.metric-label').textContent = d.m1Label;
    }
    if (metric2El) {
      metric2El.querySelector('.metric-val').textContent = d.m2;
      metric2El.querySelector('.metric-label').textContent = d.m2Label;
    }
    if (metric3El) {
      metric3El.querySelector('.metric-val').textContent = d.m3;
      metric3El.querySelector('.metric-label').textContent = d.m3Label;
    }
  }

  /* --------------------------------------------------------------------------
     11. CONTINUOUS 9-STAGE PROCEDURAL KINEMATICS & REALISTIC WATER RIPPLES
     -------------------------------------------------------------------------- */
  function updateProceduralKinematics(dt) {
    animClock += dt;

    // Senior Programmer Polish: Authentic Forward Demonstration Loop
    // Medical surgical procedures flow FORWARD in real surgical time.
    // They NEVER reverse or oscillate backwards (which would make drained saline flow uphill
    // into the blister pack, or peeled lids spontaneously re-seal themselves).
    // Instead: Action flows smoothly 0.0 -> 1.0. At 1.0, it holds in its pristine completed
    // state for ~1.5s so the surgeon can inspect the final result, then cleanly repeats forward.
    const speedRate = (currentStage === 4) ? 0.12 : 0.28;
    if (isVideoPlaying) {
      stageProgress += dt * speedRate * playbackSpeed;
      if (stageProgress >= 1.0) {
        stageProgress = 0;
        if (currentStage < TOTAL_STAGES) {
          setStage(currentStage + 1, false);
        } else {
          setStage(1, false);
        }
      }
    }

    // Update scrubber progress bar smoothly across full 8 stages
    const progressEl = document.getElementById('galaxy-video-progress');
    if (progressEl) {
      const overallFrac = ((currentStage - 1) + Math.min(1.0, stageProgress)) / TOTAL_STAGES;
      progressEl.style.width = (overallFrac * 100).toFixed(1.5) + '%';
    }

    const t = Math.min(1.0, stageProgress);

    // Visibility toggles:
    if (cartonBoxGroup) cartonBoxGroup.visible = currentStage === 1;
    if (primaryPouchGroup) primaryPouchGroup.visible = (currentStage === 1 || currentStage === 2);

    secondaryTrayMesh.visible = (currentStage >= 2 && currentStage <= 7);
    // Lid visible in Stages 2-3, and in Stage 4 until Phase 5 finishes peeling & dissolving:
    secondaryLidMesh.visible = (currentStage === 2) || (currentStage === 3) || (currentStage === 4 && t < 0.98);

    // Water in blister tray: strictly visible in Stage 3; in Stage 4 managed precisely by drainage volume; strictly hidden in Stage 5+!
    if (currentStage === 3) {
      waterMesh.visible = true;
    } else if (currentStage !== 4) {
      waterMesh.visible = false;
    }
    if (procedureTubGroup) procedureTubGroup.visible = false;

    // Syringe and lens are STRICTLY HIDDEN in Stages 1 & 2 - ONLY revealed in Stage 3 (second peeling)!
    syringeGroup.visible = currentStage >= 3;
    flatLensGroup.visible = currentStage >= 3;

    cannulaGroup.visible = currentStage === 5;
    drainContainerGroup.visible = currentStage === 4;
    // Fluid stream ONLY controlled by active pouring in Stage 4 (NO dangling pipe geometry!)
    if (salineStreamMesh && currentStage !== 4) salineStreamMesh.visible = false;
    if (salineSplashGroup && currentStage !== 4) salineSplashGroup.visible = false;
    if (salineImpactMesh && currentStage !== 4) salineImpactMesh.visible = false;
    eyeGroup.visible = currentStage === 9;
    if (implantedLensGroup && currentStage !== 9) implantedLensGroup.visible = false;

    // REAL SALINE WATER RIPPLES (Living liquid surface reflection in blister pack - Scale invariant)
    if (waterMesh.visible && waterOrigGeo) {
      const pos = waterMesh.geometry.attributes.position;
      const orig = waterOrigGeo.attributes.position;
      const isPouring = currentStage === 4 && stageProgress > 0.10 && stageProgress < 0.86;
      const scaleX = Math.max(0.05, waterMesh.scale.x);
      for (let i = 0; i < pos.count; i++) {
        const ox = orig.getX(i);
        const oz = orig.getZ(i);
        // Multiply by scaleX so physical wavelength in 3D space stays constant and never compresses into dots!
        const spatialX = ox * scaleX;
        const wave = isPouring
          ? (Math.sin(spatialX * 1.8 + animClock * 4.5) * 0.014 + Math.cos(oz * 2.2 + animClock * 3.5) * 0.009) * Math.min(1.0, scaleX * 1.8)
          : Math.sin(ox * 1.6 + animClock * 2.5) * 0.012 + Math.cos(oz * 2.0 + animClock * 2.0) * 0.008;
        pos.setY(i, orig.getY(i) + wave);
      }
      pos.needsUpdate = true;
      waterMesh.geometry.computeVertexNormals();
    }

    // SALINE WATER RIPPLES IN DISPOSAL TUB (Expanding impact waves with post-drain calm down)
    if (drainContainerGroup && drainContainerGroup.visible && drainWaterMesh && drainWaterMesh.visible && drainWaterOrigGeo) {
      const pos = drainWaterMesh.geometry.attributes.position;
      const orig = drainWaterOrigGeo.attributes.position;
      const isPouring = currentStage === 4 && stageProgress > 0.30 && stageProgress < 0.68;
      const postPouring = currentStage === 4 && stageProgress >= 0.68 && stageProgress < 0.85;
      const calmFactor = postPouring ? Math.max(0, 1.0 - (stageProgress - 0.68) / 0.17) : (isPouring ? 1.0 : 0.0);

      for (let i = 0; i < pos.count; i++) {
        const ox = orig.getX(i);
        const oz = orig.getZ(i);
        const distToImpact = Math.hypot(ox - 0.1, oz);
        const impactRipple = Math.sin(distToImpact * 7.5 - animClock * 14.0) * 0.024 * Math.exp(-distToImpact * 0.40);
        const ambientRipple = Math.sin(ox * 1.8 + animClock * 2.2) * 0.006 + Math.cos(oz * 2.2 + animClock * 1.8) * 0.005;
        pos.setY(i, orig.getY(i) + impactRipple * calmFactor + ambientRipple);
      }
      pos.needsUpdate = true;
      drainWaterMesh.geometry.computeVertexNormals();
    }



    // Syringe resting positions: inTrayY (-0.22) and inTubY (-0.32) defined at top scope

    // --- STAGE 1: Primary Chevron Peel Pouch ("Opening like a candy wrapper"!) ---
    if (currentStage === 1) {
      // -----------------------------------------------------------------------
      // STAGE 01: Official Dark Galaxy Presentation Box (Senior Developer Physical Unboxing)
      // 1. Box rests elegantly on table, hero artwork facing camera
      // 2. Top lid smoothly swings open upward & back by 112 degrees
      // 3. Sterile chevron pouch lifts out of cavity, arcs cleanly over front rim, lands on sterile field
      // 4. Empty carton slides back & dissolves, leaving sterile pouch centered for Stage 2
      // -----------------------------------------------------------------------
      if (cartonBoxGroup) {
        cartonBoxGroup.visible = true;

        if (t < 0.18) {
          // Phase A: Hero Presentation View - Closed presentation box resting stably on sterile field
          cartonBoxGroup.visible = true;
          cartonBoxGroup.position.set(0.4, 0.95, -1.8);
          cartonBoxGroup.rotation.set(0.18, -0.12, 0);
          if (cartonFlapPivot) cartonFlapPivot.rotation.x = 0;

          ['darkGalaxyFront', 'darkGalaxyBack', 'darkGalaxySide', 'darkGalaxyTop', 'cartonInnerLiner', 'cartonInnerBed'].forEach((mKey) => {
            if (mats[mKey]) mats[mKey].opacity = 1.0;
          });
          if (mats.cartonShadow) mats.cartonShadow.opacity = 0.40;

          // Pouch is nestled inside the box cavity
          if (primaryPouchGroup) {
            primaryPouchGroup.visible = false;
            primaryPouchGroup.position.set(0.4, 0.85, -1.8);
            primaryPouchGroup.rotation.set(0.18, -0.12, 0);
            primaryPouchGroup.scale.set(0.96, 0.96, 0.96);
          }
        } else if (t < 0.38) {
          // Phase B: Top Lid Smoothly Swings Open Upward (Natural ~68.4° angle, comfortably inside frame)
          const openT = (t - 0.18) / 0.20;
          const easeOpen = openT * openT * (3 - 2 * openT);

          cartonBoxGroup.visible = true;
          cartonBoxGroup.position.set(0.4, 0.95, -1.8);
          cartonBoxGroup.rotation.set(0.18, -0.12, 0);
          if (cartonFlapPivot) cartonFlapPivot.rotation.x = -easeOpen * (Math.PI * 0.38);

          ['darkGalaxyFront', 'darkGalaxyBack', 'darkGalaxySide', 'darkGalaxyTop', 'cartonInnerLiner', 'cartonInnerBed'].forEach((mKey) => {
            if (mats[mKey]) mats[mKey].opacity = 1.0;
          });
          if (mats.cartonShadow) mats.cartonShadow.opacity = 0.40;

          // Sterile pouch revealed nestled inside the opened box cavity
          if (primaryPouchGroup) {
            primaryPouchGroup.visible = true;
            if (pouchTopMesh && pouchTopOrigGeo) pouchTopMesh.geometry.copy(pouchTopOrigGeo);
            if (pouchBottomMesh && pouchBottomOrigGeo) pouchBottomMesh.geometry.copy(pouchBottomOrigGeo);
            if (mats.pouchFilm) mats.pouchFilm.opacity = 0.92;
            if (mats.pouchTyvek) mats.pouchTyvek.opacity = 1.0;

            primaryPouchGroup.position.set(0.4, 0.85 + easeOpen * 0.15, -1.8);
            primaryPouchGroup.rotation.set(0.18, -0.12, 0);
            primaryPouchGroup.scale.set(0.96, 0.96, 0.96);
          }
        } else if (t < 0.52) {
          // Phase C1: Pure vertical clearance lift out of box cavity (Y: 1.00 -> 3.80, safely clears 2.45 rim by 1.35 units!)
          const liftT = (t - 0.38) / 0.14;
          const easeLift = liftT * liftT * (3 - 2 * liftT);

          cartonBoxGroup.visible = true;
          cartonBoxGroup.position.set(0.4, 0.95, -1.8);
          cartonBoxGroup.rotation.set(0.18, -0.12, 0);
          if (cartonFlapPivot) cartonFlapPivot.rotation.x = -Math.PI * 0.38;

          ['darkGalaxyFront', 'darkGalaxyBack', 'darkGalaxySide', 'darkGalaxyTop', 'cartonInnerLiner', 'cartonInnerBed'].forEach((mKey) => {
            if (mats[mKey]) mats[mKey].opacity = 1.0;
          });
          if (mats.cartonShadow) mats.cartonShadow.opacity = 0.40;

          if (primaryPouchGroup) {
            primaryPouchGroup.visible = true;
            primaryPouchGroup.position.set(0.4, 1.00 + easeLift * 2.80, -1.8);
            primaryPouchGroup.rotation.set(0.18, -0.12, 0);
            primaryPouchGroup.scale.set(0.96, 0.96, 0.96);
          }
        } else if (t < 0.66) {
          // Phase C2: While pouch is elevated at Y = 3.80, the box cleanly dissolves in place!
          // Eliminates ANY spatial overlap or transparent box geometry slicing through the pouch!
          const fadeT = (t - 0.52) / 0.14;
          const easeFade = fadeT * fadeT * (3 - 2 * fadeT);
          const boxOp = Math.max(0, 1.0 - easeFade);

          cartonBoxGroup.position.set(0.4, 0.95, -1.8);
          cartonBoxGroup.rotation.set(0.18, -0.12, 0);
          if (cartonFlapPivot) cartonFlapPivot.rotation.x = -Math.PI * 0.38;

          ['darkGalaxyFront', 'darkGalaxyBack', 'darkGalaxySide', 'darkGalaxyTop', 'cartonInnerLiner', 'cartonInnerBed'].forEach((mKey) => {
            if (mats[mKey]) mats[mKey].opacity = boxOp;
          });
          if (mats.cartonShadow) mats.cartonShadow.opacity = 0.40 * boxOp;
          cartonBoxGroup.visible = boxOp > 0.02;

          // Pouch is elevated in air, completely unaffected
          if (primaryPouchGroup) {
            primaryPouchGroup.visible = true;
            primaryPouchGroup.position.set(0.4, 3.80, -1.8);
            primaryPouchGroup.rotation.set(0.18, -0.12, 0);
            primaryPouchGroup.scale.set(0.96, 0.96, 0.96);
          }
        } else if (t < 0.88) {
          // Phase C3: Box is 100% GONE. Pouch glides forward and descends gracefully onto the pristine sterile drape!
          cartonBoxGroup.visible = false;
          ['darkGalaxyFront', 'darkGalaxyBack', 'darkGalaxySide', 'darkGalaxyTop', 'cartonInnerLiner', 'cartonInnerBed'].forEach((mKey) => {
            if (mats[mKey]) mats[mKey].opacity = 0.0;
          });
          if (mats.cartonShadow) mats.cartonShadow.opacity = 0.0;

          const landT = (t - 0.66) / 0.22;
          const easeLand = landT * landT * (3 - 2 * landT);

          if (primaryPouchGroup) {
            primaryPouchGroup.visible = true;
            // Smooth trajectory from (0.4, 3.80, -1.8) down to (0.4, 0.55, 0.0)
            const pY = 3.80 - easeLand * 3.25;
            const pZ = -1.8 + easeLand * 1.8;
            const rotX = (1 - easeLand) * 0.18;
            const rotY = (1 - easeLand) * -0.12;
            const curScale = 0.96 + easeLand * 0.04;

            primaryPouchGroup.position.set(0.4, pY, pZ);
            primaryPouchGroup.rotation.set(rotX, rotY, 0);
            primaryPouchGroup.scale.set(curScale, curScale, curScale);
          }
        } else {
          // Phase D (t 0.88 -> 1.00): Box is GONE. Sterile pouch rests level and centered on sterile drape.
          cartonBoxGroup.visible = false;
          ['darkGalaxyFront', 'darkGalaxyBack', 'darkGalaxySide', 'darkGalaxyTop', 'cartonInnerLiner', 'cartonInnerBed'].forEach((mKey) => {
            if (mats[mKey]) mats[mKey].opacity = 0.0;
          });
          if (mats.cartonShadow) mats.cartonShadow.opacity = 0.0;

          if (primaryPouchGroup) {
            primaryPouchGroup.visible = true;
            primaryPouchGroup.position.set(0.4, 0.55, 0.0);
            primaryPouchGroup.rotation.set(0, 0, 0);
            primaryPouchGroup.scale.set(1.0, 1.0, 1.0);
            if (pouchTopMesh && pouchTopOrigGeo) pouchTopMesh.geometry.copy(pouchTopOrigGeo);
            if (pouchBottomMesh && pouchBottomOrigGeo) pouchBottomMesh.geometry.copy(pouchBottomOrigGeo);
            if (mats.pouchFilm) mats.pouchFilm.opacity = 0.92;
            if (mats.pouchTyvek) mats.pouchTyvek.opacity = 1.0;
          }
        }
      }
    }
    // --- STAGE 2: Primary Chevron Peel Pouch ("Opening like a candy wrapper"!) ---
    else if (currentStage === 2) {
      if (cartonBoxGroup) cartonBoxGroup.visible = false;
      if (primaryPouchGroup) {
        primaryPouchGroup.visible = true;
        primaryPouchGroup.position.set(0.4, 0.55, 0.0);
        primaryPouchGroup.rotation.set(0, 0, 0);
        primaryPouchGroup.scale.set(1.0, 1.0, 1.0);

        // Peeling animation: Chevron end pulls apart, opening top film from bottom Tyvek backing
        applyPouchPeel(pouchTopMesh, pouchBottomMesh, pouchTopOrigGeo, pouchBottomOrigGeo, t);

        // Secondary blister pack inside starts becoming visible as pouch opens:
        secondaryTrayMesh.position.set(0.4, 0.48, 0.0);
        secondaryTrayMesh.rotation.set(0, 0, 0);
        secondaryTrayMesh.visible = (t > 0.08);

        secondaryLidMesh.position.set(0.4, 0.49, 0.0);
        secondaryLidMesh.rotation.set(0, 0, 0);
        secondaryLidMesh.visible = (t > 0.08);

        // As peel completes, primary pouch film and Tyvek gracefully fade away
        if (t > 0.60) {
          const fadeT = (t - 0.60) / 0.40;
          const easeFade = fadeT * fadeT * (3 - 2 * fadeT);
          const currentOpacity = Math.max(0, 1.0 - easeFade);
          if (mats.pouchFilm) mats.pouchFilm.opacity = 0.88 * currentOpacity;
          if (mats.pouchTyvek) mats.pouchTyvek.opacity = currentOpacity;
          if (currentOpacity <= 0.01) {
            primaryPouchGroup.visible = false;
          }
        } else {
          if (mats.pouchFilm) mats.pouchFilm.opacity = 0.88;
          if (mats.pouchTyvek) mats.pouchTyvek.opacity = 1.0;
        }
      }
    }
    // --- STAGE 2: Secondary Half-Peel (Saline reservoir revealed; syringe fully seated under sealed half) ---
    else if (currentStage === 3) {
      secondaryTrayMesh.position.set(0.4, 0.48, 0.0);
      secondaryTrayMesh.rotation.set(0, 0, 0);
      secondaryTrayMesh.visible = true;

      secondaryLidMesh.position.set(0.4, 0.49, 0.0);
      secondaryLidMesh.rotation.set(0, 0, 0);
      secondaryLidMesh.visible = true;
      if (secondaryLidMesh.material) {
        secondaryLidMesh.material.opacity = 1.0;
        secondaryLidMesh.material.depthWrite = true;
      }

      // Smooth peel from 0% to exactly 50% (halfway mark revealing saline reservoir)
      applyPeelToMesh(secondaryLidMesh, secondaryLidOrigGeo, t * 0.50, 1.0);

      waterMesh.position.set(0.4, 0.22, 0.0);
      waterMesh.rotation.set(0, 0, 0);
      waterMesh.scale.set(1, 1, 1);
      waterMesh.visible = true;

      // Syringe seated safely inside cavity floor: ZERO protrusion above lid or foil!
      syringeGroup.position.set(0.4, inTrayY, 0.0);
      syringeGroup.rotation.set(0, 0, 0);
      wing2Pivot.rotation.x = 0.0;
      plungerGroup.position.x = -2.4;
      flatLensGroup.visible = true;
      rolledLensGroup.visible = false;
      ovdChamberFill.visible = false;
    }

    // =========================================================================
    // --- STAGE 3: SALINE DRAINAGE OVER BASIN (Senior Developer Protocol) ---
    // 1. Syringe stays securely in the actual packaging tray cavity.
    // 2. Remaining 50% foil lid STAYS FIRMLY COVERING the syringe throughout drainage!
    // 3. Tray lifts and tilts towards the disposal container on the left.
    // 4. Saline cascades in a realistic, gravity-driven fluid waterfall into the basin.
    // 5. Volume conservation: Blister tray empties 1.0 -> 0.0, Basin fills 0.0 -> 1.0.
    // 6. Tray returns level to table, 100% dry and empty.
    // 7. ONLY THEN does the remaining lid peel from 50% -> 100% and dissolve away!
    // =========================================================================
    else if (currentStage === 4) {
      if (procedureTubGroup) procedureTubGroup.visible = false;

      // =========================================================================
      // OFFICIAL RAYONE SALINE DRAINAGE SEQUENCE (CLINICALLY ACCURATE):
      // "Carefully peel back the lid halfway down the second blister pack.
      //  Do not remove completely at this point in order to prepare for controlled saline drainage."
      //  -> Blister pack tilts with lid firmly attached at 50% (protecting syringe inside).
      //  -> Saline drains completely into the disposal container on the left.
      //  -> Tray returns level to the operating table, 100% drained and dry.
      //  -> ONLY THEN does the remaining lid peel from 50% -> 100% and lift away cleanly!
      // =========================================================================

      // Natural, close-proximity pouring posture (STRICT ZERO COLLISION):
      // Blister pack lip hovers directly adjacent to the disposal basin opening (NO wide gap, NO shooting distance)
      // Lip at (-6.00, 0.60) keeps the entire blister pack (including its 1.35-deep cavity) strictly outside
      // and safely above the basin rim (X <= -6.40, Y = -0.60) with a clean 0.40 physical clearance!
      const targetLipX = -6.00;
      const targetLipY = 0.60;
      const maxTilt = 0.35; // ~20.0 degrees natural pouring angle

      let tiltAngle = 0.0;
      let curLipX = 0.4 - 5.7; // -5.30
      let curLipY = 0.48;
      let blisterFluidFrac = 1.0;
      let isDraining = false;

      // 5-Phase Timing:
      // Phase 1 (t: 0.00 -> 0.12): Tray rests level on field with 50% half-peeled lid covering syringe.
      // Phase 2 (t: 0.12 -> 0.30): Blister tray tilts smoothly over disposal basin with 50% lid attached.
      // Phase 3 (t: 0.30 -> 0.68): Gravitational waterfall drains saline 1.0 -> 0.0 into basin. Lid stays on tray!
      // Phase 4 (t: 0.68 -> 0.80): Drained, dry tray tilts back and rests level on table. Lid is still on tray.
      // Phase 5 (t: 0.80 -> 1.00): Container is fully drained and level -> NOW remaining lid peels 50% -> 100% and lifts away!

      if (t < 0.12) {
        tiltAngle = 0.0;
        curLipX = 0.4 - 5.7;
        curLipY = 0.48;
        blisterFluidFrac = 1.0;
      } else if (t < 0.30) {
        const tiltNorm = (t - 0.12) / 0.18;
        const smoothTilt = tiltNorm * tiltNorm * (3 - 2 * tiltNorm);
        tiltAngle = smoothTilt * maxTilt;
        curLipX = (1 - smoothTilt) * (0.4 - 5.7) + smoothTilt * targetLipX;
        curLipY = (1 - smoothTilt) * 0.48 + smoothTilt * targetLipY;
        blisterFluidFrac = 1.0;
      } else if (t < 0.68) {
        tiltAngle = maxTilt;
        curLipX = targetLipX;
        curLipY = targetLipY;
        const drainNorm = (t - 0.30) / 0.38;
        blisterFluidFrac = Math.max(0.0, 1.0 - drainNorm);
        isDraining = drainNorm > 0.02 && drainNorm < 0.96;
      } else if (t < 0.80) {
        const returnNorm = (t - 0.68) / 0.12;
        const smoothReturn = returnNorm * returnNorm * (3 - 2 * returnNorm);
        tiltAngle = (1 - smoothReturn) * maxTilt;
        curLipX = (1 - smoothReturn) * targetLipX + smoothReturn * (0.4 - 5.7);
        curLipY = (1 - smoothReturn) * targetLipY + smoothReturn * 0.48;
        blisterFluidFrac = 0.0;
      } else {
        tiltAngle = 0.0;
        curLipX = 0.4 - 5.7;
        curLipY = 0.48;
        blisterFluidFrac = 0.0;
      }

      const trayX = curLipX + 5.7 * Math.cos(tiltAngle);
      const trayY = curLipY + 5.7 * Math.sin(tiltAngle);

      secondaryTrayMesh.position.set(trayX, trayY, 0.0);
      secondaryTrayMesh.rotation.z = tiltAngle;
      secondaryTrayMesh.visible = true;

      // Lid movement:
      // While t < 0.80: lid STAYS AT EXACTLY 50% PEEL attached to the tray and tilts in lockstep!
      if (secondaryLidMesh && secondaryLidOrigGeo) {
        if (t < 0.80) {
          applyPeelToMesh(secondaryLidMesh, secondaryLidOrigGeo, 0.50, 1.0);
          const lidRelY = 0.01;
          secondaryLidMesh.position.set(
            trayX - lidRelY * Math.sin(tiltAngle),
            trayY + lidRelY * Math.cos(tiltAngle),
            0.0
          );
          secondaryLidMesh.rotation.set(0, 0, tiltAngle);
          secondaryLidMesh.visible = true;
          if (secondaryLidMesh.material) {
            secondaryLidMesh.material.opacity = 1.0;
            secondaryLidMesh.material.depthWrite = true;
          }
        } else {
          // Phase 5 (t: 0.80 -> 1.00): Tray is completely drained and level on the operating table!
          // Remaining foil lid peels from 50% to 100% and lifts smoothly away into waste!
          const remPeel = (t - 0.80) / 0.20;
          const easePeel = remPeel * remPeel * (3 - 2 * remPeel);
          applyPeelToMesh(secondaryLidMesh, secondaryLidOrigGeo, 0.50 + remPeel * 0.50, 1.0);
          secondaryLidMesh.position.set(0.4 + easePeel * 1.8, 0.49 + easePeel * 3.0, -easePeel * 2.0);
          secondaryLidMesh.rotation.set(-easePeel * 0.35, easePeel * 0.25, easePeel * 0.15);
          if (secondaryLidMesh.material) {
            secondaryLidMesh.material.opacity = Math.max(0, 1.0 - remPeel * 1.05);
          }
          secondaryLidMesh.visible = remPeel < 0.96;
        }
      }

      // Syringe rotates in exact lockstep inside the cavity floor
      const syrRelY = inTrayY - 0.48; // -0.50 - 0.48 = -0.98
      syringeGroup.position.set(
        trayX - syrRelY * Math.sin(tiltAngle),
        trayY + syrRelY * Math.cos(tiltAngle),
        0.0
      );
      syringeGroup.rotation.set(0, 0, tiltAngle);
      wing2Pivot.rotation.x = 0.0;
      plungerGroup.position.x = -2.4;
      flatLensGroup.visible = true;
      rolledLensGroup.visible = false;

      // =======================================================================
      // REAL CONSERVATION OF VOLUME & GRAVITATIONAL DRAINAGE
      // Liquid rests inside cavity floor (waterRelY = -0.26) matching Stage 3 exactly! ZERO JUMP!
      // =======================================================================
      const basinFluidFrac = Math.max(0.0, Math.min(1.0, 1.0 - blisterFluidFrac));

      if (blisterFluidFrac > 0.02) {
        const curLen = 10.3 * blisterFluidFrac;
        waterMesh.scale.set(blisterFluidFrac, 1, 1);
        const centerShift = - (10.3 - curLen) / 2;
        // Water lowers down smoothly toward cavity floor as it empties
        const waterRelY = -0.26 - (1 - blisterFluidFrac) * 0.08;
        const waterX = trayX + centerShift * Math.cos(tiltAngle) - waterRelY * Math.sin(tiltAngle);
        const waterY = trayY + centerShift * Math.sin(tiltAngle) + waterRelY * Math.cos(tiltAngle);
        waterMesh.position.set(waterX, waterY, 0.0);
        // Lockstep rotation with tray: eliminates ANY protrusion through back walls of tray!
        waterMesh.rotation.z = tiltAngle;
        waterMesh.visible = true;
      } else {
        waterMesh.visible = false;
      }

      // Drained Saline Accumulates Realistically in Waste Container
      if (drainWaterMesh) {
        drainWaterMesh.visible = basinFluidFrac > 0.02;
        drainWaterMesh.position.y = 0.02 + basinFluidFrac * 0.48;
      }
      if (drainWaterVolumeMesh) {
        drainWaterVolumeMesh.visible = basinFluidFrac > 0.02;
        const vH = Math.max(0.02, basinFluidFrac);
        drainWaterVolumeMesh.scale.set(1, vH, 1);
        drainWaterVolumeMesh.position.set(0, 0.02 + (vH * 0.48) / 2, 0);
      }

      // Gravitational Parabolic Waterfall Cascade (Directly into basin orifice)
      if (salineStreamMesh) {
        salineStreamMesh.visible = isDraining;
      }
      if (salineSplashGroup) {
        salineSplashGroup.visible = isDraining;
      }
      if (salineImpactMesh) {
        salineImpactMesh.visible = isDraining;
      }

      if (isDraining && salineStreamMesh) {
        salineStreamMesh.visible = true;

        // Physical coordinates of pouring corner of tilted blister pack:
        const pourLipX = curLipX + 0.12;
        const pourLipY = curLipY + 0.06;
        const pourLipZ = 0.0;

        // True physical coordinates of basin water surface impact:
        // Elegant parabolic cascade into the open basin cavity right in front of the lip (NO hose, NO distant squirt!)
        const basinLandX = -7.40;
        const basinLandY = drainContainerGroup.position.y + (drainWaterMesh ? drainWaterMesh.position.y : 0.06) + 0.02;
        const basinLandZ = 0.0;

        const flowT = Math.sin((t - 0.30) / 0.38 * Math.PI);
        // Broad fluid sheet width: starts wide at the tray lip (~1.10), tapering naturally (~0.75) as it plunges down
        const sheetWidthLip = 0.70 + flowT * 0.40;

        const posAttr = salineStreamMesh.geometry.attributes.position;
        const widthSegs = 10;
        const heightSegs = 24;

        let vIdx = 0;
        for (let j = 0; j <= heightSegs; j++) {
          const u = j / heightSegs; // 0.0 (pouring lip) to 1.0 (basin surface)
          const curW = sheetWidthLip * (1.0 - 0.28 * u);
          const curX = (1 - u) * pourLipX + u * basinLandX - Math.sin(u * Math.PI) * 0.10;
          const curY = (1 - Math.pow(u, 1.35)) * pourLipY + Math.pow(u, 1.35) * basinLandY;

          // Downward-rushing wave ripples traveling along the fluid sheet
          const waveY = Math.sin(u * 22.0 - animClock * 22.0) * 0.012;
          const waveX = Math.cos(u * 18.0 - animClock * 18.0) * 0.008;

          for (let i = 0; i <= widthSegs; i++) {
            const v = (i / widthSegs) - 0.5; // -0.5 to +0.5 across sheet
            const transverseWave = Math.sin(v * 6.0 + u * 12.0 - animClock * 16.0) * 0.008;
            const curZ = pourLipZ + v * curW;

            posAttr.setXYZ(
              vIdx,
              curX + waveX,
              curY + waveY + transverseWave,
              curZ
            );
            vIdx++;
          }
        }
        posAttr.needsUpdate = true;
        salineStreamMesh.geometry.computeVertexNormals();

        // Dynamic Splash Droplet Fountain (Active ballistic spray across the sheet impact zone)
        if (salineSplashGroup) {
          for (let d = 0; d < salineSplashGroup.children.length; d++) {
            const drop = salineSplashGroup.children[d];
            const phase = (animClock * 3.6 + d * 0.23) % 1.0;
            const angle = (d / 12) * Math.PI * 2 + animClock * 0.5;
            const spread = 0.04 + phase * 0.22;
            drop.position.set(
              basinLandX + Math.cos(angle) * spread,
              basinLandY + Math.sin(phase * Math.PI) * 0.14,
              basinLandZ + Math.sin(angle) * spread * 0.70
            );
            const dropScale = Math.sin(phase * Math.PI) * 0.85 + 0.35;
            drop.scale.set(dropScale, dropScale, dropScale);
          }
        }

        if (salineImpactMesh) {
          salineImpactMesh.position.set(
            basinLandX - drainContainerGroup.position.x,
            (drainWaterMesh ? drainWaterMesh.position.y : 0.06) + 0.015,
            basinLandZ - drainContainerGroup.position.z
          );
          const splashScale = 0.85 + flowT * 0.75 + Math.sin(animClock * 22.0) * 0.20;
          salineImpactMesh.scale.set(splashScale, splashScale, 1.0);
        }
      }
    }
    else if (currentStage === 5) {
      if (procedureTubGroup) procedureTubGroup.visible = false;
      secondaryTrayMesh.position.set(0.4, 0.48, 0.0);
      secondaryTrayMesh.rotation.set(0, 0, 0);
      secondaryTrayMesh.visible = true;

      // Injector securely seated in its actual packaging tray cavity
      syringeGroup.position.set(0.4, inTrayY, 0.0);
      syringeGroup.rotation.set(0, 0, 0);
      // Wing 2 stands UP vertically at ~83° for OVD entry (100% matches Reference Image 1!)
      wing2Pivot.rotation.x = -Math.PI * 0.46;
      plungerGroup.position.x = -2.4;

      cannulaGroup.visible = true;
      // Cannula tip curves precisely into the cartridge priming port at (1.675, 0.02, 0.33)
      const insertD = Math.max(0, (1 - t * 2.2)) * 0.45;
      cannulaGroup.position.set(1.675, 0.02 + insertD * 0.55, 0.33 + insertD * 0.95);

      const injectProgress = Math.max(0, Math.min(1.0, (t - 0.20) / 0.70));

      // 1. Plunger and dark rubber stopper visibly depress forward by 0.3 mL
      if (ovdPlungerGroup) {
        ovdPlungerGroup.position.y = 2.05 - injectProgress * 0.52;
      }

      // 2. Luminous light-blue viscoelastic column inside syringe barrel visibly discharges 0.3 mL
      if (ovdSyringeFluidMesh) {
        const fluidH = 1.6 - injectProgress * 0.52;
        ovdSyringeFluidMesh.scale.set(1, fluidH / 1.6, 1);
        ovdSyringeFluidMesh.position.y = 0.45 + fluidH / 2;
      }

      // 3. Active Luminous Light-Blue Viscoelastic Gel Stream from Needle into Cartridge
      if (ovdStreamMesh) {
        const isFlowing = injectProgress > 0.02 && injectProgress < 0.96;
        ovdStreamMesh.visible = isFlowing;
        if (isFlowing) {
          const streamScale = Math.sin(injectProgress * Math.PI) * 0.45 + 1.10;
          ovdStreamMesh.scale.set(streamScale, 1.25, streamScale);
        }
      }

      // 4. Vibrant Light-Blue Viscoelastic Gel Visibly Engulfs & Fills the Cartridge Cradle!
      ovdChamberFill.visible = injectProgress > 0.02;
      if (ovdChamberFill.visible) {
        const fillX = 0.35 + injectProgress * 0.75;
        const fillY = 0.30 + injectProgress * 0.90;
        const fillZ = 0.35 + injectProgress * 0.85;
        ovdChamberFill.scale.set(fillX, fillY, fillZ);
        ovdChamberFill.position.set(1.675, -0.02 + injectProgress * 0.04, 0.02);
      }

      // 5. Lock & Roll mechanism: IOL moves from 'storage' into 'roll-ready' position
      flatLensGroup.visible = true;
      flatLensGroup.position.set(1.675, -0.04 - injectProgress * 0.06, 0);
      rolledLensGroup.visible = false;
    }

    // --- STAGE 5: Lock & Roll Cartridge Snap Closure Inside Blister Tray ---
    else if (currentStage === 6) {
      if (procedureTubGroup) procedureTubGroup.visible = false;
      secondaryTrayMesh.position.set(0.4, 0.48, 0.0);
      secondaryTrayMesh.rotation.set(0, 0, 0);
      secondaryTrayMesh.visible = true;

      syringeGroup.position.set(0.4, inTrayY, 0.0);
      syringeGroup.rotation.set(0, 0, 0);
      plungerGroup.position.x = -2.4;

      // Authentic RayOne Lock & Roll Kinematics (Matches Reference Image 1!):
      // Wing 2 starts upright at ~83 deg (-Math.PI * 0.46) from Stage 4 OVD entry.
      // Phase 1 (t: 0.00 -> 0.72): Smooth folding arc pushing optic into curved cartridge bore.
      // Phase 2 (t: 0.72 -> 0.84): Crisp snap engagement into dual retention latches ("Audible & Tactile Click!").
      // Phase 3 (t: 0.84 -> 1.00): Micro-damping elastic settle into rock-solid locked alignment.
      const openAngle = Math.PI * 0.46; // ~83 deg upright
      let curAngle = 0.0;
      if (t < 0.72) {
        const foldT = t / 0.72;
        const smoothFold = foldT * foldT * (3 - 2 * foldT);
        curAngle = (1 - smoothFold) * openAngle;
      } else if (t < 0.84) {
        const snapT = (t - 0.72) / 0.12;
        const easeSnap = Math.pow(snapT, 2.5);
        curAngle = (1 - easeSnap) * 0.14;
      } else {
        const settleT = (t - 0.84) / 0.16;
        curAngle = Math.sin(settleT * Math.PI * 3.0) * Math.exp(-settleT * 7.0) * 0.015;
      }
      wing2Pivot.rotation.x = -Math.max(0.0, curAngle);

      // OVD Viscoelastic Gel compresses into cylindrical lumen around the rolled optic
      ovdChamberFill.visible = true;
      const compT = Math.min(1.0, t * 1.15);
      ovdChamberFill.scale.set(1 - compT * 0.35, 1 - compT * 0.48, 1 - compT * 0.48);
      ovdChamberFill.position.set(1.675, -0.02 * compT, 0);

      // Continuous IOL Rolling Kinematics (No abrupt pop! Seamless roll along bore axis)
      if (t < 0.75) {
        const curlT = t / 0.75;
        flatLensGroup.visible = true;
        rolledLensGroup.visible = false;
        flatLensGroup.position.set(1.675, -0.04 + curlT * 0.03, 0);
        // Optical disc curves and narrows along Z into a cylinder:
        flatLensGroup.scale.set(0.95, 0.95 * (1 - curlT * 0.12), 0.95 * Math.max(0.14, 1 - curlT * 0.86));
      } else {
        flatLensGroup.visible = false;
        rolledLensGroup.visible = true;
        rolledLensGroup.position.set(1.675, 0, 0);
        const rollT = Math.min(1.0, (t - 0.75) / 0.15);
        const scaleRoll = 0.88 + rollT * 0.12;
        rolledLensGroup.scale.set(scaleRoll, scaleRoll, scaleRoll);
      }
    }

    // --- STAGE 6: Lift Injector from Blister Tray (High Elevation & Smooth Tray Dissolve) ---
    else if (currentStage === 7) {
      if (procedureTubGroup) procedureTubGroup.visible = false;

      wing2Pivot.rotation.x = 0.0;
      plungerGroup.position.x = -2.4;
      flatLensGroup.visible = false;
      rolledLensGroup.visible = true;
      rolledLensGroup.position.set(1.675, 0, 0);
      ovdChamberFill.visible = false;

      // Smooth ergonomic lift: injector rises from inTrayY (-0.34) high into the surgeon's delivery hand height (+1.65)
      const liftEase = t * t * (3 - 2 * t);
      syringeGroup.position.set(
        0.4 - liftEase * 0.15,
        inTrayY + liftEase * (1.65 - inTrayY),
        liftEase * 0.45
      );
      syringeGroup.rotation.set(liftEase * 0.06, 0, -liftEase * 0.04);

      // Smooth tray dissolve: as the syringe lifts clear of the cavity, the tray dissolves away cleanly
      secondaryTrayMesh.position.set(0.4, 0.48, 0.0);
      secondaryTrayMesh.rotation.set(0, 0, 0);
      if (t < 0.35) {
        secondaryTrayMesh.visible = true;
        if (mats.medicalTray) {
          mats.medicalTray.transparent = true;
          mats.medicalTray.opacity = 0.44;
        }
      } else if (t < 0.85) {
        secondaryTrayMesh.visible = true;
        const fadeT = (t - 0.35) / 0.50;
        const easeFade = fadeT * fadeT * (3 - 2 * fadeT);
        if (mats.medicalTray) {
          mats.medicalTray.transparent = true;
          mats.medicalTray.opacity = Math.max(0, 0.44 * (1.0 - easeFade));
        }
      } else {
        secondaryTrayMesh.visible = false;
        if (mats.medicalTray) mats.medicalTray.opacity = 0.0;
      }
    }
    // --- STAGE 7: Controlled Plunger Advancement (PERFECTLY CENTERED HERO ELEVATION - ZERO OVERLAY!) ---
    else if (currentStage === 8) {
      // Packaging tray is fully dissolved / removed from the scene (ZERO collision or overlay with plunger!)
      secondaryTrayMesh.visible = false;
      if (mats.medicalTray) mats.medicalTray.opacity = 0.0;

      // Syringe is held stably in center at hero height y = 1.65
      syringeGroup.position.set(0.25, 1.65, 0.45);
      syringeGroup.rotation.set(0.06, 0, -0.04);

      wing2Pivot.rotation.x = 0.0;
      ovdChamberFill.visible = false;
      flatLensGroup.visible = false;
      rolledLensGroup.visible = true;

      plungerGroup.position.x = -2.4 + t * 2.95;

      rolledLensGroup.position.set(1.675 + t * 2.60, 0, 0);
      rolledLensGroup.scale.set(1, 1 - t * 0.16, 1 - t * 0.16);
    }

    // --- STAGE 8: 3D HUMAN EYE SURGICAL IMPLANTATION (MICROSCOPE VIEW) ---
    else if (currentStage === 9) {
      eyeGroup.visible = true;
      wing2Pivot.rotation.x = 0.0;
      ovdChamberFill.visible = false;
      flatLensGroup.visible = false; // Hide lens in syringe barrel during delivery

      // Injector bevel-down entry angle: 6.5 degrees through temporal incision
      const enterAngle = -0.11;

      if (t < 0.32) {
        // Phase 1 (t: 0.00 -> 0.32): Injector advances toward and enters 2.2 mm temporal corneal incision
        const enterT = t / 0.32;
        const easeEnter = enterT * enterT * (3 - 2 * enterT);

        // Syringe advances from left (-0.55) to seated delivery position (0.40):
        syringeGroup.position.set(
          -0.55 + easeEnter * 0.95,
          0.76 - easeEnter * 0.11,
          0.0
        );
        syringeGroup.rotation.set(0, 0, enterAngle);
        plungerGroup.position.x = -2.4 + enterT * 1.4;

        // Rolled IOL advances inside nozzle towards tip
        rolledLensGroup.visible = true;
        rolledLensGroup.position.set(2.40 + enterT * 1.30, 0, 0);

        if (implantedLensGroup) implantedLensGroup.visible = false;

      } else if (t < 0.72) {
        // Phase 2 (t: 0.32 -> 0.72): Nozzle tip inside anterior chamber; IOL emerges and unrolls into capsular bag!
        const deliverT = (t - 0.32) / 0.40;
        syringeGroup.position.set(0.40, 0.65, 0.0);
        syringeGroup.rotation.set(0, 0, enterAngle);
        plungerGroup.position.x = -1.0 + deliverT * 2.2;

        rolledLensGroup.visible = deliverT < 0.20;

        if (implantedLensGroup) {
          implantedLensGroup.visible = true;
          const unrollT = deliverT * deliverT * (3 - 2 * deliverT);

          // IOL advances from the nozzle tip (-0.65 in eyeGroup) to capsular bag center (0.0):
          implantedLensGroup.position.set(
            -0.65 * (1 - unrollT),
            0.18 - unrollT * 0.02,
            0.0
          );
          // Optic and AVH haptics gracefully unfurl into capsular equator:
          const sX = 0.32 + unrollT * 0.68;
          const sZ = 0.18 + unrollT * 0.82;
          implantedLensGroup.scale.set(sX, 1.0, sZ);
          implantedLensGroup.rotation.set((1 - unrollT) * 0.15, unrollT * 0.08, 0);
        }

      } else if (t < 0.88) {
        // Phase 3 (t: 0.72 -> 0.88): Trailing haptic springs into proximal equator; IOL fully centered
        syringeGroup.position.set(0.40, 0.65, 0.0);
        syringeGroup.rotation.set(0, 0, enterAngle);
        plungerGroup.position.x = 1.2;

        rolledLensGroup.visible = false;

        if (implantedLensGroup) {
          implantedLensGroup.visible = true;
          implantedLensGroup.position.set(0.0, 0.16, 0.0);
          implantedLensGroup.scale.set(1.0, 1.0, 1.0);
          implantedLensGroup.rotation.set(0.0, 0.0, 0.0);
        }

      } else {
        // Phase 4 (t: 0.88 -> 1.00): Injector smoothly withdraws backwards out through incision; IOL rests perfectly centered in capsular bag
        const withT = (t - 0.88) / 0.12;
        const easeWith = withT * withT * (3 - 2 * withT);

        // Retract syringe back out through the wound:
        syringeGroup.position.set(
          0.40 - easeWith * 1.80,
          0.65 + easeWith * 0.22,
          0.0
        );
        syringeGroup.rotation.set(0, 0, enterAngle + easeWith * 0.04);
        plungerGroup.position.x = 1.2;

        rolledLensGroup.visible = false;

        if (implantedLensGroup) {
          implantedLensGroup.visible = true;
          implantedLensGroup.position.set(0.0, 0.16, 0.0);
          implantedLensGroup.scale.set(1.0, 1.0, 1.0);
          implantedLensGroup.rotation.set(0.0, 0.0, 0.0);
        }
      }
    }
  }

  /* --------------------------------------------------------------------------
     12. CONTROLS & EVENT BINDINGS
     -------------------------------------------------------------------------- */
  function syncPlayStateUI() {
    const playBtn = document.getElementById('galaxy-video-play');
    const playText = document.getElementById('galaxy-play-text');
    const playIcon = document.getElementById('galaxy-play-icon');
    const topToggle = document.getElementById('galaxy-play-toggle');

    if (playText) playText.textContent = isVideoPlaying ? 'Pause Video' : 'Play Video';
    if (playIcon) {
      playIcon.innerHTML = isVideoPlaying
        ? '<rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/>'
        : '<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>';
    }
    if (playBtn) {
      playBtn.classList.toggle('border-sky', isVideoPlaying);
      playBtn.classList.toggle('bg-sky/20', isVideoPlaying);
      playBtn.classList.toggle('text-white', isVideoPlaying);
    }
    if (topToggle) {
      const topSpan = topToggle.querySelector('span');
      if (topSpan) topSpan.textContent = isVideoPlaying ? 'Pause' : 'Play';
      const topSvg = topToggle.querySelector('svg');
      if (topSvg) {
        topSvg.innerHTML = isVideoPlaying
          ? '<rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/>'
          : '<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>';
      }
    }
  }

  function toggleVideoPlayback() {
    isVideoPlaying = !isVideoPlaying;
    syncPlayStateUI();
  }

  function toggleXRayMode() {
    isXRayMode = !isXRayMode;
    const btn = document.getElementById('galaxy-xray-toggle');
    if (btn) {
      btn.classList.toggle('border-sky', isXRayMode);
      btn.classList.toggle('bg-sky/20', isXRayMode);
      btn.classList.toggle('text-white', isXRayMode);
    }

    polycarbMeshes.forEach((item) => {
      item.mesh.material = isXRayMode ? mats.polycarbXRay : item.defaultMat;
    });

    cadEdgeLines.forEach((line) => {
      line.visible = true;
      line.material.opacity = isXRayMode ? 0.90 : 0.78;
      if (line.material.color) {
        line.material.color.setHex(isXRayMode ? 0x38bdf8 : 0x0284c7);
      }
    });
  }

  function bindControls() {
    // Stage Selector Pills
    document.querySelectorAll('[data-galaxy-step]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const s = parseInt(btn.getAttribute('data-galaxy-step'), 10);
        if (s) {
          setStage(s, false);
          isVideoPlaying = true; // Auto-play stage on click!
          syncPlayStateUI();
        }
      });
    });

    // Play/Pause Buttons (both bottom and top controls)
    const playBtn = document.getElementById('galaxy-video-play');
    if (playBtn) playBtn.addEventListener('click', toggleVideoPlayback);

    const oldPlayBtn = document.getElementById('galaxy-play-toggle');
    if (oldPlayBtn) oldPlayBtn.addEventListener('click', toggleVideoPlayback);

    // Prev / Next Stage Buttons
    const prevBtn = document.getElementById('galaxy-prev-stage');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        setStage(currentStage > 1 ? currentStage - 1 : TOTAL_STAGES, false);
        isVideoPlaying = true;
        syncPlayStateUI();
      });
    }

    const nextBtn = document.getElementById('galaxy-next-stage');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        setStage(currentStage < TOTAL_STAGES ? currentStage + 1 : 1, false);
        isVideoPlaying = true;
        syncPlayStateUI();
      });
    }

    // Video Timeline Scrubber Track
    const track = document.getElementById('galaxy-video-track');
    if (track) {
      track.addEventListener('click', (e) => {
        const rect = track.getBoundingClientRect();
        const clickRatio = Math.max(0, Math.min(0.999, (e.clientX - rect.left) / rect.width));
        const totalPoint = clickRatio * TOTAL_STAGES;
        const targetStg = Math.floor(totalPoint) + 1;
        const inStageProgress = totalPoint - Math.floor(totalPoint);
        setStage(targetStg, false);
        stageProgress = inStageProgress;
        isVideoPlaying = true;
        syncPlayStateUI();
      });
    }

    // Playback Speed Toggle
    const speedBtn = document.getElementById('galaxy-speed-toggle');
    if (speedBtn) {
      speedBtn.addEventListener('click', () => {
        if (playbackSpeed === 1.0) {
          playbackSpeed = 0.5;
          speedBtn.textContent = '0.5x';
        } else if (playbackSpeed === 0.5) {
          playbackSpeed = 1.5;
          speedBtn.textContent = '1.5x';
        } else {
          playbackSpeed = 1.0;
          speedBtn.textContent = '1.0x';
        }
      });
    }

    const xrayBtn = document.getElementById('galaxy-xray-toggle');
    if (xrayBtn) xrayBtn.addEventListener('click', toggleXRayMode);

    function applyCamMode(camMode) {
      if (camMode === 'top') {
        targetRotY = 0;
        targetRotX = 0;
        if (currentStage === 9) {
          targetCamPos.set(4.80, 6.8, 0.01);
          targetCamLook.set(4.80, 0.16, 0.0);
        } else if (currentStage === 5 || currentStage === 6) {
          targetCamPos.set(2.08, 6.2, 0.201);
          targetCamLook.set(2.08, 0.0, 0.20);
        } else {
          targetCamPos.set(0.4, 15.2, 0.01);
          targetCamLook.set(0.2, 0, 0);
        }
      } else if (camMode === 'nozzle') {
        targetRotY = 0;
        targetRotX = 0;
        if (currentStage === 9) {
          targetCamPos.set(4.15, 2.2, 2.8);
          targetCamLook.set(4.25, 0.22, 0.0);
        } else {
          targetCamPos.set(3.4, 1.4, 7.2);
          targetCamLook.set(3.8, 0, 0);
        }
      } else if (camMode === 'box') {
        setStage(9, false);
        isVideoPlaying = true;
        syncPlayStateUI();
      } else {
        setStage(currentStage, false);
      }
    }

    // --- Custom Luxury Glass Dropdowns Initialization ---
    const camTrigger = document.getElementById('galaxy-cam-trigger');
    const camMenu = document.getElementById('galaxy-cam-menu');
    const camChevron = document.getElementById('galaxy-cam-chevron');
    const camLabel = document.getElementById('galaxy-cam-label');
    const camDropdown = document.getElementById('galaxy-cam-dropdown');
    const camOpts = document.querySelectorAll('.galaxy-cam-opt');

    const stageTrigger = document.getElementById('galaxy-stage-trigger');
    const stageMenu = document.getElementById('galaxy-stage-menu');
    const stageChevron = document.getElementById('galaxy-stage-chevron');
    const stageLabel = document.getElementById('galaxy-stage-label');
    const stageDropdown = document.getElementById('galaxy-stage-dropdown');
    const stageOpts = document.querySelectorAll('.galaxy-stage-opt');

    function toggleCamMenu(show) {
      if (!camMenu) return;
      const isOpen = show !== undefined ? show : camMenu.classList.contains('hidden');
      if (isOpen) {
        camMenu.classList.remove('hidden');
        if (camChevron) camChevron.style.transform = 'rotate(180deg)';
        if (camTrigger) camTrigger.setAttribute('aria-expanded', 'true');
      } else {
        camMenu.classList.add('hidden');
        if (camChevron) camChevron.style.transform = '';
        if (camTrigger) camTrigger.setAttribute('aria-expanded', 'false');
      }
    }

    function toggleStageMenu(show) {
      if (!stageMenu) return;
      const isOpen = show !== undefined ? show : stageMenu.classList.contains('hidden');
      if (isOpen) {
        stageMenu.classList.remove('hidden');
        if (stageChevron) stageChevron.style.transform = 'rotate(180deg)';
        if (stageTrigger) stageTrigger.setAttribute('aria-expanded', 'true');
      } else {
        stageMenu.classList.add('hidden');
        if (stageChevron) stageChevron.style.transform = '';
        if (stageTrigger) stageTrigger.setAttribute('aria-expanded', 'false');
      }
    }

    if (camTrigger) {
      camTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleStageMenu(false);
        toggleCamMenu();
      });
    }

    camOpts.forEach((opt) => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = opt.getAttribute('data-cam-val');
        const text = opt.querySelector('span')?.textContent || '';
        if (camLabel) camLabel.textContent = text;
        if (camDropdown) camDropdown.value = val;
        applyCamMode(val);

        camOpts.forEach((o) => {
          const isThis = o === opt;
          o.classList.toggle('is-selected', isThis);
          const check = o.querySelector('.cam-check');
          if (check) check.classList.toggle('opacity-100', isThis);
          if (check) check.classList.toggle('opacity-0', !isThis);
        });

        toggleCamMenu(false);
      });
    });

    if (stageTrigger) {
      stageTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCamMenu(false);
        toggleStageMenu();
      });
    }

    stageOpts.forEach((opt) => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = opt.getAttribute('data-stage-val');
        const text = opt.querySelector('span')?.textContent || '';
        if (stageLabel) stageLabel.textContent = text;
        if (stageDropdown) stageDropdown.value = val;
        const s = parseInt(val, 10);
        if (s) {
          setStage(s, false);
          isVideoPlaying = true;
          syncPlayStateUI();
        }
        toggleStageMenu(false);
      });
    });

    // Close on click outside or Escape
    document.addEventListener('click', () => {
      toggleCamMenu(false);
      toggleStageMenu(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        toggleCamMenu(false);
        toggleStageMenu(false);
      }
    });

    // Camera Presets Dropdown (fallback)
    if (camDropdown) {
      camDropdown.addEventListener('change', () => {
        applyCamMode(camDropdown.value);
      });
    }

    // Stage Selector Dropdown (fallback)
    if (stageDropdown) {
      stageDropdown.addEventListener('change', () => {
        const s = parseInt(stageDropdown.value, 10);
        if (s) {
          setStage(s, false);
          isVideoPlaying = true;
          syncPlayStateUI();
        }
      });
    }

    // Retain compatibility with any [data-galaxy-cam] buttons
    document.querySelectorAll('[data-galaxy-cam]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const camMode = btn.getAttribute('data-galaxy-cam');
        if (camDropdown) camDropdown.value = camMode || 'reset';
        applyCamMode(camMode);
      });
    });

    // 360° Drag & Orbit
    const canvas = document.getElementById('galaxy-delivery-canvas');
    if (canvas) {
      canvas.addEventListener('pointerdown', (e) => {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      });

      window.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - prevMouseX;
        const dy = e.clientY - prevMouseY;
        userRotY += dx * 0.006;
        userRotX = Math.max(-0.65, Math.min(0.85, userRotX + dy * 0.006));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      });

      window.addEventListener('pointerup', () => {
        isDragging = false;
      });

      canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        targetCamPos.z = Math.max(4.0, Math.min(24.0, targetCamPos.z + e.deltaY * 0.005));
      }, { passive: false });
    }

    window.addEventListener('resize', () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    // Initial play state sync
    syncPlayStateUI();
  }

  /* --------------------------------------------------------------------------
     13. RENDER LOOP
     -------------------------------------------------------------------------- */
  function animate() {
    requestAnimationFrame(animate);

    updateProceduralKinematics(0.016);

    camera.position.lerp(targetCamPos, 0.07);
    currentCamLook.lerp(targetCamLook, 0.07);
    camera.lookAt(currentCamLook);

    userRotY += (targetRotY - userRotY) * 0.1;
    userRotX += (targetRotX - userRotX) * 0.1;
    if (mainGroup) {
      mainGroup.rotation.y = userRotY;
      mainGroup.rotation.x = userRotX;
    }

    renderer.render(scene, camera);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimulator);
  } else {
    initSimulator();
  }
})();
