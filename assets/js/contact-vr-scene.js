/**
 * MEDIQ Contact Us — Nationwide 3D Map of the Philippines (Right Stage)
 * --------------------------------------------------------------------------
 * Renders a 3D holographic Map of the Philippines on the right side of #contact
 * featuring a 14-node branching optical network across Luzon, Mindoro, Palawan,
 * Visayas, and Mindanao (not just a single line).
 */
(function () {
  'use strict';

  var PH_ISLANDS = [
    [[121.1,18.62],[121.72,18.33],[122.04,18.33],[122.22,18.5],[122.32,18.32],[122.18,18.06],[122.18,17.58],[122.36,17.34],[122.41,17.18],[122.5,17.06],[122.23,16.43],[121.97,16.16],[121.6,15.93],[121.61,15.72],[121.49,15.51],[121.39,15.32],[121.54,15],[121.69,14.74],[121.65,14.48],[121.8,14.11],[122.08,13.95],[122.23,13.98],[122.2,14.11],[122.28,14.19],[122.63,14.32],[122.94,14.19],[123.07,13.9],[123.1,13.75],[123.31,13.94],[123.32,14.06],[123.63,13.9],[123.81,13.84],[123.61,13.71],[123.7,13.43],[123.82,13.19],[123.95,13.1],[124.14,13.04],[123.96,12.6],[123.95,12.92],[123.8,12.91],[123.4,13.03],[123.3,13.21],[123.16,13.44],[122.78,13.74],[122.49,13.93],[122.5,13.76],[122.6,13.56],[122.68,13.25],[122.51,13.31],[122.38,13.52],[121.78,13.94],[121.64,13.92],[121.44,13.71],[121.1,13.68],[120.84,13.88],[120.62,13.99],[120.69,14.29],[120.94,14.65],[120.71,14.78],[120.55,14.77],[120.56,14.44],[120.4,14.49],[120.25,14.79],[120.08,14.85],[120,15.23],[119.89,15.84],[119.81,15.95],[119.77,16.25],[119.89,16.29],[120.03,16.18],[120.27,16.05],[120.39,16.16],[120.3,16.53],[120.41,16.96],[120.43,17.38],[120.36,17.64],[120.58,18.37],[120.81,18.6],[121.05,18.61]],
    [[126.01,9.32],[126.19,9.13],[126.32,8.85],[126.14,8.63],[126.28,8.54],[126.46,8.2],[126.44,7.83],[126.57,7.68],[126.58,7.25],[126.3,6.88],[126.24,6.74],[126.14,6.4],[126.04,6.84],[125.9,7.12],[125.69,7.26],[125.64,7.1],[125.4,6.79],[125.49,6.57],[125.67,6.22],[125.46,5.66],[125.24,5.76],[125.27,6.03],[125.17,6.05],[124.97,5.87],[124.4,6.12],[124.05,6.53],[123.98,6.93],[124.12,7.18],[124.21,7.33],[124.07,7.58],[123.72,7.79],[123.55,7.83],[123.48,7.71],[123.28,7.46],[123.14,7.63],[123.05,7.62],[122.84,7.53],[122.71,7.77],[122.47,7.64],[122.25,7.17],[122.1,6.91],[121.9,7.08],[122.05,7.36],[122.13,7.81],[122.39,8.04],[122.8,8.13],[123,8.29],[123.05,8.43],[123.29,8.54],[123.44,8.7],[123.68,8.62],[123.86,8.38],[123.75,8.06],[124,8.16],[124.22,8.27],[124.36,8.56],[124.62,8.52],[124.79,8.87],[124.94,8.96],[125.17,8.92],[125.38,8.99],[125.51,9.28],[125.52,9.76],[125.96,9.43]],
    [[117.31,8.44],[117.23,8.46],[117.35,8.71],[117.53,8.9],[117.75,9.1],[117.93,9.25],[118.03,9.27],[118.34,9.6],[118.73,10.04],[118.85,10.13],[119.08,10.38],[119.19,10.44],[119.28,10.57],[119.3,10.75],[119.31,10.97],[119.47,11.29],[119.55,11.31],[119.53,11.16],[119.56,11.04],[119.62,10.71],[119.69,10.5],[119.54,10.38],[119.37,10.33],[119.23,10.15],[119.19,10.06],[118.83,9.95],[118.76,9.86],[118.57,9.42],[118.44,9.26],[118.23,9.17],[118.07,8.98],[117.89,8.8],[117.68,8.68],[117.54,8.6],[117.47,8.51],[117.31,8.44]],
    [[120.7,13.48],[120.92,13.5],[121.02,13.43],[121.12,13.38],[121.28,13.38],[121.44,13.19],[121.54,13.09],[121.47,12.93],[121.54,12.64],[121.46,12.51],[121.42,12.39],[121.39,12.3],[121.32,12.3],[121.24,12.22],[121.12,12.25],[121.08,12.34],[120.96,12.45],[120.92,12.58],[120.86,12.7],[120.78,12.79],[120.77,12.97],[120.65,13.17],[120.51,13.26],[120.45,13.39],[120.39,13.4],[120.35,13.47],[120.47,13.52],[120.7,13.48]],
    [[125.24,12.53],[125.33,12.39],[125.35,12.29],[125.48,12.25],[125.5,12.13],[125.46,11.95],[125.5,11.71],[125.49,11.59],[125.59,11.38],[125.58,11.28],[125.63,11.23],[125.75,11.07],[125.67,11.12],[125.43,11.11],[125.23,11.15],[125.09,11.29],[124.94,11.48],[124.98,11.64],[125,11.77],[124.88,11.78],[124.8,11.9],[124.68,12.02],[124.53,12.08],[124.39,12.24],[124.29,12.57],[124.84,12.54],[125.24,12.53]],
    [[124.57,11.34],[124.72,11.32],[124.93,11.37],[125.03,11.21],[125.04,10.95],[125.03,10.75],[125.13,10.68],[125.19,10.59],[125.26,10.35],[125.25,10.26],[125.14,10.24],[125.11,10.22],[124.99,10.37],[125.02,10.12],[124.93,10.1],[124.78,10.17],[124.79,10.33],[124.8,10.68],[124.79,10.78],[124.66,10.96],[124.5,10.9],[124.41,11.15],[124.33,11.43],[124.33,11.54],[124.44,11.46],[124.55,11.4]],
    [[123.13,9.06],[122.99,9.06],[122.87,9.32],[122.67,9.41],[122.56,9.48],[122.4,9.82],[122.47,9.96],[122.65,9.98],[122.86,10.09],[122.87,10.29],[122.82,10.5],[122.91,10.6],[122.97,10.77],[122.98,10.89],[123.22,10.99],[123.51,10.92],[123.57,10.78],[123.49,10.58],[123.34,10.32],[123.27,10.06],[123.16,9.87],[123.15,9.66],[123.31,9.36],[123.32,9.27],[123.23,9.12],[123.13,9.06]],
    [[122.5,11.61],[122.73,11.61],[122.93,11.53],[122.9,11.44],[123.16,11.54],[123.14,11.36],[123.08,11.2],[122.94,11.06],[122.8,10.99],[122.79,10.88],[122.67,10.8],[122.2,10.62],[122.05,10.51],[121.95,10.44],[121.94,10.49],[121.97,10.7],[121.96,10.87],[122.05,11.1],[122.1,11.64],[122.07,11.72],[121.89,11.79],[121.96,11.9],[122.09,11.86],[122.4,11.7]],
    [[123.37,9.45],[123.33,9.42],[123.32,9.49],[123.33,9.58],[123.4,9.89],[123.39,9.97],[123.52,10.14],[123.59,10.3],[123.71,10.47],[123.73,10.56],[123.83,10.73],[123.93,10.96],[123.93,11.04],[123.95,11.08],[123.97,11.14],[123.97,11.19],[124.04,11.27],[124.06,11.22],[124.04,11.11],[124.04,11.05],[124.05,11.03],[124.05,10.93],[124.03,10.77],[124.05,10.59],[124,10.4],[123.95,10.32],[123.88,10.26],[123.79,10.22],[123.7,10.13],[123.64,10.02],[123.63,9.92],[123.49,9.59],[123.37,9.45]],
    [[123.72,12.29],[123.91,12.17],[124.04,11.97],[124.06,11.81],[124.05,11.75],[123.98,11.82],[123.85,11.91],[123.75,11.93],[123.72,11.95],[123.73,12],[123.67,12.05],[123.67,12.07],[123.61,12.09],[123.53,12.2],[123.47,12.22],[123.42,12.19],[123.29,12.04],[123.16,11.93],[123.16,11.97],[123.21,12.11],[123.25,12.33],[123.27,12.4],[123.24,12.49],[123.23,12.58],[123.33,12.54],[123.46,12.5],[123.56,12.44],[123.57,12.41],[123.72,12.29]],
    [[124.59,9.79],[124.58,9.75],[124.5,9.75],[124.48,9.75],[124.41,9.65],[124.36,9.63],[124.12,9.6],[123.94,9.62],[123.87,9.68],[123.83,9.76],[123.82,9.82],[123.86,9.88],[123.91,9.92],[124.06,10],[124.09,10.06],[124.17,10.13],[124.34,10.16],[124.35,10.14],[124.37,10.13],[124.41,10.13],[124.49,10.07],[124.58,10.03],[124.56,9.88],[124.58,9.83],[124.59,9.79]],
    [[120.1,12.17],[120.15,12.15],[120.19,12.17],[120.23,12.22],[120.26,12.14],[120.34,12.08],[120.31,12.01],[120.24,12.01],[120.17,12.02],[120.1,11.99],[120.01,12.01],[119.96,12.07],[119.9,12.18],[119.86,12.2],[119.87,12.24],[119.89,12.27],[119.88,12.28],[119.89,12.3],[119.9,12.31],[119.92,12.32],[119.96,12.27],[120.08,12.2],[120.1,12.17]],
    [[125.69,9.91],[125.67,9.89],[125.65,9.94],[125.59,10],[125.53,10.09],[125.5,10.12],[125.52,10.19],[125.52,10.31],[125.58,10.36],[125.61,10.38],[125.65,10.44],[125.67,10.44],[125.69,10.39],[125.65,10.24],[125.7,10.07],[125.68,9.96],[125.69,9.94],[125.69,9.91]],
    [[124.35,13.63],[124.33,13.57],[124.29,13.59],[124.25,13.59],[124.17,13.53],[124.06,13.61],[124.04,13.66],[124.12,13.79],[124.12,13.98],[124.15,14.03],[124.19,14.06],[124.22,14.08],[124.31,13.95],[124.34,13.93],[124.42,13.87],[124.4,13.75],[124.41,13.68],[124.35,13.63]],
    [[122.03,15.01],[122.05,14.97],[122.03,14.97],[122.02,14.96],[121.97,14.89],[122.02,14.76],[121.99,14.66],[121.93,14.66],[121.91,14.67],[121.92,14.71],[121.94,14.74],[121.92,14.8],[121.89,14.84],[121.86,14.92],[121.82,14.96],[121.84,15.04],[121.97,15.05],[122.03,15.01]],
    [[120.25,5.26],[120.22,5.2],[120.19,5.17],[120.15,5.18],[120.12,5.22],[120.1,5.17],[120.01,5.15],[119.96,5.08],[119.88,5.06],[119.82,5.07],[119.83,5.13],[119.98,5.23],[120.08,5.26],[120.16,5.33],[120.21,5.34],[120.23,5.28],[120.25,5.26]],
    [[121.16,6.08],[121.22,6],[121.28,6.02],[121.39,6],[121.41,5.96],[121.41,5.94],[121.29,5.87],[121.22,5.94],[121.08,5.89],[121.02,5.92],[120.93,5.9],[120.88,5.95],[120.9,6.01],[121.04,6.1],[121.16,6.08]],
    [[120.04,11.7],[119.96,11.67],[119.94,11.69],[119.93,11.74],[119.93,11.77],[119.86,11.96],[119.92,11.98],[119.95,11.96],[120,11.93],[120.03,11.92],[120.07,11.86],[120.06,11.82],[120.07,11.78],[120.04,11.7]],
    [[122.65,10.47],[122.62,10.46],[122.6,10.46],[122.54,10.43],[122.52,10.49],[122.54,10.61],[122.63,10.69],[122.65,10.72],[122.67,10.74],[122.7,10.74],[122.73,10.71],[122.74,10.65],[122.68,10.5],[122.65,10.47]],
    [[122.09,6.43],[121.99,6.42],[121.96,6.42],[121.88,6.52],[121.87,6.56],[121.81,6.61],[121.83,6.66],[121.91,6.68],[122.06,6.74],[122.29,6.64],[122.32,6.6],[122.25,6.58],[122.2,6.48],[122.09,6.43]],
    [[121.91,13.54],[121.98,13.54],[122,13.55],[122.11,13.46],[122.11,13.42],[122.12,13.36],[122.05,13.27],[122.04,13.24],[122,13.21],[121.88,13.28],[121.83,13.33],[121.82,13.43],[121.87,13.57],[121.91,13.54]],
    [[122.09,12.35],[122.01,12.11],[121.96,12.19],[121.98,12.24],[121.94,12.29],[121.92,12.33],[121.94,12.38],[121.99,12.44],[122,12.6],[122.1,12.65],[122.14,12.65],[122.13,12.61],[122.13,12.54],[122.09,12.35]],
    [[123.28,12.85],[123.37,12.7],[123.27,12.8],[123.17,12.88],[123.06,12.99],[122.97,13.04],[122.95,13.06],[122.96,13.11],[123.02,13.12],[123.04,13.11],[123.21,12.91],[123.28,12.85]],
    [[126.06,9.77],[126.05,9.76],[125.99,9.84],[126,9.93],[126.08,10.06],[126.13,9.94],[126.13,9.89],[126.12,9.87],[126.17,9.8],[126.14,9.77],[126.06,9.77]],
    [[122.66,12.31],[122.61,12.29],[122.5,12.38],[122.44,12.43],[122.42,12.46],[122.47,12.49],[122.61,12.49],[122.67,12.42],[122.68,12.38],[122.66,12.31]],
    [[122.94,7.41],[122.95,7.39],[122.94,7.36],[122.84,7.31],[122.81,7.32],[122.8,7.39],[122.82,7.43],[122.87,7.4],[122.91,7.43],[122.94,7.41]]
  ];

  // 14 distributed cities / hubs spread across the entire Philippine archipelago
  var NETWORK_NODES = [
    // Primary labeled regional hubs
    { id: 'ncr', region: 'ncr', title: 'Metro Manila (NCR)', sub: 'Commercial Base', lon: 120.98, lat: 14.60, primary: true, labeled: true, side: 'left' },
    { id: 'luzon', region: 'luzon', title: 'Northern Luzon', sub: 'Institutional Network', lon: 120.59, lat: 16.40, primary: false, labeled: true, side: 'left' },
    { id: 'visayas', region: 'visayas', title: 'Visayas', sub: 'Scheduled Distribution', lon: 123.89, lat: 10.32, primary: false, labeled: true, side: 'right' },
    { id: 'mindanao', region: 'mindanao', title: 'Mindanao', sub: 'Scheduled Distribution', lon: 125.52, lat: 7.15, primary: false, labeled: true, side: 'left' },

    // Secondary spread nodes (cagayan, central luzon, bicol, mindoro, palawan, iloilo, tacloban, cdo, zamboanga, gensan)
    { id: 'tuguegarao', region: 'luzon', lon: 121.73, lat: 17.61, labeled: false },
    { id: 'clark', region: 'luzon', lon: 120.58, lat: 15.18, labeled: false },
    { id: 'bicol', region: 'luzon', lon: 123.74, lat: 13.15, labeled: false },
    { id: 'mindoro', region: 'visayas', lon: 121.18, lat: 13.10, labeled: false },
    { id: 'palawan', region: 'visayas', lon: 118.74, lat: 9.74, labeled: true, title: 'Palawan', sub: 'Regional Link', side: 'left' },
    { id: 'iloilo', region: 'visayas', lon: 122.56, lat: 10.72, labeled: false },
    { id: 'tacloban', region: 'visayas', lon: 125.00, lat: 11.24, labeled: false },
    { id: 'cdo', region: 'mindanao', lon: 124.64, lat: 8.48, labeled: false },
    { id: 'zamboanga', region: 'mindanao', lon: 122.08, lat: 6.92, labeled: false },
    { id: 'gensan', region: 'mindanao', lon: 125.17, lat: 6.11, labeled: false }
  ];

  // Branching constellation routes across islands (curve lateral bow + arc height)
  var ROUTE_LINKS = [
    // Northern & Central Luzon spread
    { region: 'luzon', from: 'ncr', to: 'clark', arcH: 0.25, bowX: -0.18, bowY: 0.06 },
    { region: 'luzon', from: 'clark', to: 'luzon', arcH: 0.30, bowX: -0.22, bowY: 0.04 },
    { region: 'luzon', from: 'luzon', to: 'tuguegarao', arcH: 0.32, bowX: 0.14, bowY: 0.14 },
    { region: 'luzon', from: 'ncr', to: 'tuguegarao', arcH: 0.56, bowX: 0.32, bowY: 0.08 },
    // South Luzon & Bicol spread
    { region: 'luzon', from: 'ncr', to: 'bicol', arcH: 0.42, bowX: 0.24, bowY: 0.14 },
    // Mindoro & Palawan Western Arcs
    { region: 'visayas', from: 'ncr', to: 'mindoro', arcH: 0.28, bowX: -0.20, bowY: -0.05 },
    { region: 'visayas', from: 'mindoro', to: 'palawan', arcH: 0.48, bowX: -0.34, bowY: 0.18 },
    { region: 'visayas', from: 'palawan', to: 'iloilo', arcH: 0.46, bowX: 0.06, bowY: -0.24 },
    // Central, Western & Eastern Visayas Mesh
    { region: 'visayas', from: 'bicol', to: 'tacloban', arcH: 0.42, bowX: 0.22, bowY: 0.04 },
    { region: 'visayas', from: 'ncr', to: 'iloilo', arcH: 0.62, bowX: -0.24, bowY: -0.10 },
    { region: 'visayas', from: 'iloilo', to: 'visayas', arcH: 0.26, bowX: 0.05, bowY: 0.14 },
    { region: 'visayas', from: 'visayas', to: 'tacloban', arcH: 0.28, bowX: 0.16, bowY: -0.06 },
    { region: 'visayas', from: 'bicol', to: 'visayas', arcH: 0.55, bowX: -0.16, bowY: -0.08 },
    // Mindanao Multi-Hub Distribution Network
    { region: 'mindanao', from: 'visayas', to: 'cdo', arcH: 0.44, bowX: -0.18, bowY: -0.04 },
    { region: 'mindanao', from: 'tacloban', to: 'mindanao', arcH: 0.58, bowX: 0.28, bowY: 0.02 },
    { region: 'mindanao', from: 'cdo', to: 'mindanao', arcH: 0.28, bowX: 0.14, bowY: 0.08 },
    { region: 'mindanao', from: 'cdo', to: 'zamboanga', arcH: 0.42, bowX: -0.22, bowY: 0.18 },
    { region: 'mindanao', from: 'mindanao', to: 'gensan', arcH: 0.24, bowX: 0.14, bowY: -0.06 },
    { region: 'mindanao', from: 'zamboanga', to: 'gensan', arcH: 0.44, bowX: -0.08, bowY: -0.26 }
  ];

  function projectLonLat(lon, lat) {
    var cosMid = Math.cos(12.2 * Math.PI / 180);
    var scale = 0.44;
    return [(lon - 122.0) * cosMid * scale, (lat - 12.1) * scale];
  }

  function pointInRing(x, y, ringXY) {
    var inside = false;
    for (var i = 0, j = ringXY.length - 1; i < ringXY.length; j = i++) {
      var xi = ringXY[i][0];
      var yi = ringXY[i][1];
      var xj = ringXY[j][0];
      var yj = ringXY[j][1];
      var intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1e-9) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function makeGlowTexture(innerRgba, midRgba) {
    var c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    var ctx = c.getContext('2d');
    var g = ctx.createRadialGradient(64, 64, 2, 64, 64, 62);
    g.addColorStop(0.0, innerRgba || 'rgba(255,255,255,1)');
    g.addColorStop(0.28, midRgba || 'rgba(114,197,248,0.85)');
    g.addColorStop(0.65, 'rgba(56,189,248,0.18)');
    g.addColorStop(1.0, 'rgba(10,29,64,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    var tex = new window.THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function initPhilippinesRightMap() {
    var section = document.getElementById('contact');
    if (!section || !window.THREE) return;
    if (section.dataset.vrBayMounted === '1') return;

    var bgHost = document.getElementById('contact-vr-bg-host') || section.querySelector('.pointer-events-none.absolute.inset-0');
    if (!bgHost) return;

    var THREE = window.THREE;
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var canvas = document.createElement('canvas');
    canvas.id = 'contact-vr-bg-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.className = 'pointer-events-none absolute inset-0 z-[3] block size-full';
    canvas.style.pointerEvents = 'none';
    bgHost.appendChild(canvas);

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      canvas.remove();
      return;
    }

    section.dataset.vrBayMounted = '1';
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040915, 0.032);

    var camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.1, 80);
    var baseCamPos = new THREE.Vector3(0.0, 0.25, 10.6);
    var baseLookAt = new THREE.Vector3(0.0, -0.15, 0.0);
    camera.position.copy(baseCamPos);
    camera.lookAt(baseLookAt);

    scene.add(new THREE.AmbientLight(0x88c8f2, 0.92));
    var dirLight = new THREE.DirectionalLight(0xc2ecff, 1.4);
    dirLight.position.set(4.5, 6.5, 8.5);
    scene.add(dirLight);
    var rimLight = new THREE.PointLight(0x38bdf8, 2.0, 26);
    rimLight.position.set(3.2, 2.2, 3.6);
    scene.add(rimLight);

    var glowTex = makeGlowTexture('rgba(255,255,255,1)', 'rgba(114,197,248,0.88)');

    // -----------------------------------------------------------------------
    // 1. PURE 3D PHILIPPINE ARCHIPELAGO MAP (RIGHT STAGE SHOWCASE)
    // -----------------------------------------------------------------------
    var mapGroup = new THREE.Group();
    mapGroup.position.set(2.75, -0.32, 0.0);
    mapGroup.rotation.set(-0.22, -0.18, 0.0);
    scene.add(mapGroup);

    // Subtle faint cartographic coordinate hairlines fading cleanly behind the islands
    var graticulePts = [];
    for (var gx = -4.2; gx <= 4.2; gx += 1.05) {
      graticulePts.push(new THREE.Vector3(gx, -3.6, -0.12), new THREE.Vector3(gx, 3.8, -0.12));
    }
    for (var gy = -3.4; gy <= 3.4; gy += 1.1) {
      graticulePts.push(new THREE.Vector3(-4.4, gy, -0.12), new THREE.Vector3(4.4, gy, -0.12));
    }
    mapGroup.add(new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(graticulePts),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.08 })
    ));

    var islandBodyMat = new THREE.MeshStandardMaterial({
      color: 0x0b2856,
      emissive: 0x0e447d,
      emissiveIntensity: 0.45,
      metalness: 0.35,
      roughness: 0.4,
      transparent: true,
      opacity: 0.9
    });
    var frontShoreMat = new THREE.LineBasicMaterial({
      color: 0x8fd9ff,
      transparent: true,
      opacity: 0.92
    });
    var backShoreMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.34
    });

    var projectedRings = [];
    var extrudeDepth = 0.14;

    PH_ISLANDS.forEach(function (ring) {
      if (ring.length < 4) return;
      var shape = new THREE.Shape();
      var ringXY = [];
      var topLinePts = [];
      var botLinePts = [];

      for (var i = 0; i < ring.length; i++) {
        var xy = projectLonLat(ring[i][0], ring[i][1]);
        ringXY.push(xy);
        if (i === 0) shape.moveTo(xy[0], xy[1]);
        else shape.lineTo(xy[0], xy[1]);
        topLinePts.push(new THREE.Vector3(xy[0], xy[1], extrudeDepth + 0.01));
        botLinePts.push(new THREE.Vector3(xy[0], xy[1], -0.005));
      }
      var closeXY = ringXY[0];
      topLinePts.push(new THREE.Vector3(closeXY[0], closeXY[1], extrudeDepth + 0.01));
      botLinePts.push(new THREE.Vector3(closeXY[0], closeXY[1], -0.005));
      projectedRings.push(ringXY);

      mapGroup.add(new THREE.Mesh(
        new THREE.ExtrudeGeometry(shape, { depth: extrudeDepth, bevelEnabled: false, curveSegments: 1 }),
        islandBodyMat
      ));
      mapGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(topLinePts), frontShoreMat));
      mapGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(botLinePts), backShoreMat));
    });

    // Crisp dotted clinical archipelago interior
    var dotCoords = [];
    for (var dy = -3.2; dy <= 3.1; dy += 0.12) {
      for (var dx = -2.25; dx <= 2.15; dx += 0.12) {
        var insideAny = false;
        for (var r = 0; r < projectedRings.length; r++) {
          if (pointInRing(dx, dy, projectedRings[r])) {
            insideAny = true;
            break;
          }
        }
        if (insideAny) dotCoords.push(dx, dy, extrudeDepth + 0.025);
      }
    }
    var dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dotCoords, 3));
    var dotMat = new THREE.PointsMaterial({
      map: glowTex,
      color: 0xb2e9ff,
      size: 0.068,
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    mapGroup.add(new THREE.Points(dotGeo, dotMat));

    // -----------------------------------------------------------------------
    // 2. 14-NODE DISTRIBUTED ARCHIPELAGO BEACONS & BRANCHING ARCS
    // -----------------------------------------------------------------------
    var hubs = {};
    var hubList = [];

    NETWORK_NODES.forEach(function (spec, idx) {
      var xy = projectLonLat(spec.lon, spec.lat);
      var hGroup = new THREE.Group();
      hGroup.position.set(xy[0], xy[1], extrudeDepth + 0.02);
      mapGroup.add(hGroup);

      var isMajor = !!spec.primary || spec.labeled;
      var waveMat = new THREE.MeshBasicMaterial({
        color: spec.primary ? 0xcff2ff : 0x72c5f8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isMajor ? 0.5 : 0.32,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      var waveMesh = new THREE.Mesh(
        new THREE.RingGeometry(isMajor ? 0.075 : 0.045, isMajor ? 0.115 : 0.07, 28),
        waveMat
      );
      hGroup.add(waveMesh);

      var pinH = spec.primary ? 0.44 : (isMajor ? 0.28 : 0.16);
      var pinGeo = new THREE.CylinderGeometry(0.007, 0.016, pinH, 8);
      pinGeo.rotateX(Math.PI / 2);
      pinGeo.translate(0, 0, pinH * 0.5);
      hGroup.add(new THREE.Mesh(pinGeo, new THREE.MeshBasicMaterial({
        color: 0x9ae4ff,
        transparent: true,
        opacity: spec.primary ? 0.85 : (isMajor ? 0.68 : 0.48),
        blending: THREE.AdditiveBlending
      })));

      var baseOrbSize = spec.primary ? 0.48 : (isMajor ? 0.34 : 0.22);
      var orbSprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTex,
        color: spec.primary ? 0xe8f9ff : 0x72c5f8,
        transparent: true,
        opacity: spec.primary ? 0.96 : (isMajor ? 0.85 : 0.72),
        blending: THREE.AdditiveBlending,
        depthWrite: false
      }));
      orbSprite.position.z = pinH;
      orbSprite.scale.set(baseOrbSize, baseOrbSize, 1);
      hGroup.add(orbSprite);

      hubs[spec.id] = {
        spec: spec,
        baseOrbSize: baseOrbSize,
        group: hGroup,
        surfacePos: new THREE.Vector3(xy[0], xy[1], extrudeDepth + 0.03),
        tipPos: new THREE.Vector3(xy[0], xy[1], extrudeDepth + 0.02 + pinH),
        waveMesh: waveMesh,
        waveMat: waveMat,
        orbSprite: orbSprite,
        phase: idx * 0.65,
        energy: 0
      };
      hubList.push(hubs[spec.id]);
    });

    var reticleGroup = new THREE.Group();
    reticleGroup.visible = false;
    mapGroup.add(reticleGroup);

    var retRingOuter = new THREE.Mesh(
      new THREE.RingGeometry(0.22, 0.265, 36),
      new THREE.MeshBasicMaterial({
        color: 0xc2f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    reticleGroup.add(retRingOuter);

    var retRingDash = new THREE.Mesh(
      new THREE.RingGeometry(0.32, 0.355, 6),
      new THREE.MeshBasicMaterial({
        color: 0x72c5f8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    retRingDash.position.z = 0.05;
    reticleGroup.add(retRingDash);

    var arcs = [];
    var ambientPhotons = [];
    ROUTE_LINKS.forEach(function (ls, idx) {
      var fromHub = hubs[ls.from];
      var toHub = hubs[ls.to];
      if (!fromHub || !toHub) return;

      var p0 = fromHub.tipPos.clone();
      var p2 = toHub.tipPos.clone();
      var mid = p0.clone().lerp(p2, 0.5);
      mid.x += (ls.bowX || 0);
      mid.y += (ls.bowY || 0);
      mid.z += ls.arcH;

      var curve = new THREE.QuadraticBezierCurve3(p0, mid, p2);
      var arcMat = new THREE.MeshBasicMaterial({
        color: 0x72c5f8,
        transparent: true,
        opacity: 0.26,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      mapGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 0.009, 6, false), arcMat));

      var photon = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTex,
        color: 0xe6f9ff,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      }));
      photon.scale.set(0.18, 0.18, 1);
      mapGroup.add(photon);

      arcs.push({ spec: ls, curve: curve, mat: arcMat, boost: 0 });
      ambientPhotons.push({ curve: curve, sprite: photon, t: (idx * 0.19) % 1, speed: 0.22 + (idx % 5) * 0.035 });
    });

    var burstPackets = [];
    function spawnArcPacket(curve, speed, size, targetHub) {
      var sp = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTex,
        color: 0xffffff,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      }));
      sp.scale.set(size, size, 1);
      mapGroup.add(sp);
      burstPackets.push({ curve: curve, sprite: sp, t: 0, speed: speed, targetHub: targetHub });
    }

    var starCount = 70;
    var starPos = new Float32Array(starCount * 3);
    for (var s = 0; s < starCount; s++) {
      starPos[s * 3] = (Math.random() - 0.5) * 18;
      starPos[s * 3 + 1] = (Math.random() - 0.5) * 10;
      starPos[s * 3 + 2] = -3.0 + Math.random() * 4.0;
    }
    var starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({
      map: glowTex,
      size: 0.095,
      color: 0x72c5f8,
      transparent: true,
      opacity: 0.34,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })));

    // -----------------------------------------------------------------------
    // 3. FLOATING LABELED HUB PINS OVER THE RIGHT MAP
    // -----------------------------------------------------------------------
    var pinLayer = document.getElementById('contact-ph-pins');
    var pinEls = {};
    var hoveredId = null;

    function setActiveRegion(regId) {
      hoveredId = regId || null;
      var activeRegionGroup = (hoveredId && hubs[hoveredId]) ? hubs[hoveredId].spec.region : hoveredId;

      Object.keys(pinEls).forEach(function (id) {
        pinEls[id].classList.toggle('is-active', id === hoveredId);
      });

      if (hoveredId && hubs[hoveredId]) {
        hubList.forEach(function (h) {
          if (h.spec.region === activeRegionGroup || h.spec.id === hoveredId) {
            h.energy = Math.max(h.energy, 1.0);
          }
        });
        arcs.forEach(function (a, i) {
          if (hoveredId === 'ncr' || a.spec.region === activeRegionGroup || a.spec.to === hoveredId) {
            a.boost = 1.0;
            spawnArcPacket(a.curve, 1.15, 0.34, hubs[a.spec.to]);
          }
        });
      }
    }

    if (pinLayer) {
      pinLayer.innerHTML = '';
      NETWORK_NODES.forEach(function (spec) {
        if (!spec.labeled) return;
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('data-vr-region', spec.id);
        btn.className = 'cnt-map-pin cnt-map-pin-' + spec.side + (spec.primary ? ' cnt-map-pin-primary' : '');
        btn.innerHTML =
          '<span class="cnt-map-pin-dot"></span>' +
          '<span class="cnt-map-pin-text"><strong>' + spec.title + '</strong><em>' + spec.sub + '</em></span>';
        btn.addEventListener('mouseenter', function () { setActiveRegion(spec.id); });
        btn.addEventListener('focus', function () { setActiveRegion(spec.id); });
        btn.addEventListener('mouseleave', function () { if (hoveredId === spec.id) setActiveRegion(null); });
        btn.addEventListener('click', function () { setActiveRegion(spec.id); });
        pinLayer.appendChild(btn);
        pinEls[spec.id] = btn;
      });
    }

    // -----------------------------------------------------------------------
    // 4. INTERACTIONS: CURSOR VR HEAD-LOOK & FORM / STAKEHOLDER CHANNEL PULSE
    // -----------------------------------------------------------------------
    var mouseTarget = { x: 0, y: 0 };
    var mouseSmooth = { x: 0, y: 0 };
    var reticleAlpha = 0;
    var typingEnergy = 0;

    window.addEventListener('mousemove', function (ev) {
      var rect = section.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      mouseTarget.x = Math.max(-1, Math.min(1, ((ev.clientX - rect.left) / rect.width) * 2 - 1));
      mouseTarget.y = Math.max(-1, Math.min(1, -(((ev.clientY - rect.top) / rect.height) * 2 - 1)));
    }, { passive: true });

    var quoteForm = document.getElementById('quote-form');
    var nameInput = document.getElementById('inq-name');
    var clinicInput = document.getElementById('inq-clinic');
    var emailInput = document.getElementById('inq-email');
    var msgInput = document.getElementById('inq-message');
    var consentInput = document.getElementById('inq-consent');

    function triggerDispatchWaves() {
      typingEnergy = 1.45;
      hubs.ncr.energy = 1.5;
      arcs.forEach(function (a, idx) {
        a.boost = 1.35;
        setTimeout(function () {
          spawnArcPacket(a.curve, 0.95, 0.36, hubs[a.spec.to]);
        }, idx * 40);
      });
    }

    if (quoteForm) {
      [nameInput, clinicInput, emailInput, msgInput, consentInput].forEach(function (el) {
        if (!el) return;
        el.addEventListener('input', function () {
          typingEnergy = Math.min(1.2, typingEnergy + 0.35);
          hubs.ncr.energy = Math.max(hubs.ncr.energy, 0.55);
        });
      });

      quoteForm.addEventListener('submit', function () {
        if (nameInput && nameInput.value.trim() && clinicInput && clinicInput.value.trim() && emailInput && emailInput.value.trim() && consentInput && consentInput.checked) {
          triggerDispatchWaves();
        }
      }, { capture: true });
    }

    window.__mediqContactVr = {
      hoverRegion: setActiveRegion,
      dispatchBurst: triggerDispatchWaves,
      getState: function () {
        return {
          mounted: true,
          nodeCount: hubList.length,
          arcCount: arcs.length,
          hoveredId: hoveredId,
          activePackets: burstPackets.length
        };
      }
    };

    // -----------------------------------------------------------------------
    // 5. RESPONSIVE FRAMING & RENDER LOOP
    // -----------------------------------------------------------------------
    var lastW = 0;
    var lastH = 0;
    var projVec = new THREE.Vector3();

    function syncSize() {
      var rect = section.getBoundingClientRect();
      var w = Math.max(320, Math.round(rect.width || window.innerWidth));
      var h = Math.max(240, Math.round(rect.height || window.innerHeight));
      if (w !== lastW || h !== lastH) {
        lastW = w;
        lastH = h;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      if (w >= 1024) {
        var halfH = 10.6 * Math.tan((42 * Math.PI / 180) * 0.5);
        var halfW = halfH * (w / h);
        mapGroup.position.set(Math.min(3.05, halfW * 0.41), -0.32, 0.0);
        mapGroup.scale.setScalar(1.0);
      } else {
        mapGroup.position.set(0.0, -0.35, -0.6);
        mapGroup.scale.setScalar(0.84);
      }
    }
    syncSize();
    window.addEventListener('resize', syncSize);

    var isVisible = false;
    var rafId = 0;
    var prevTime = performance.now();

    function tick(now) {
      rafId = 0;
      if (!isVisible || document.hidden) return;
      rafId = requestAnimationFrame(tick);

      var dt = Math.min(0.05, Math.max(0.001, (now - prevTime) / 1000));
      prevTime = now;
      var t = now * 0.001;
      syncSize();

      var lookScale = reducedMotion ? 0.2 : 1.0;
      mouseSmooth.x += (mouseTarget.x - mouseSmooth.x) * Math.min(1, dt * 4.5);
      mouseSmooth.y += (mouseTarget.y - mouseSmooth.y) * Math.min(1, dt * 4.5);

      camera.position.x = baseCamPos.x + mouseSmooth.x * 0.85 * lookScale + Math.sin(t * 0.25) * 0.14 * lookScale;
      camera.position.y = baseCamPos.y + mouseSmooth.y * 0.42 * lookScale + Math.cos(t * 0.2) * 0.07 * lookScale;
      camera.lookAt(
        baseLookAt.x + mouseSmooth.x * 0.2 * lookScale,
        baseLookAt.y + mouseSmooth.y * 0.12 * lookScale,
        baseLookAt.z
      );

      mapGroup.rotation.y = -0.18 + Math.sin(t * 0.34) * 0.035 * lookScale + mouseSmooth.x * 0.055 * lookScale;
      mapGroup.rotation.x = -0.22 + mouseSmooth.y * 0.04 * lookScale;
      mapGroup.updateMatrixWorld(true);

      typingEnergy = Math.max(0, typingEnergy - dt * 0.85);
      dotMat.opacity = 0.72 + typingEnergy * 0.2 + Math.sin(t * 1.4) * 0.05;

      var activeRegionGroup = (hoveredId && hubs[hoveredId]) ? hubs[hoveredId].spec.region : hoveredId;

      hubList.forEach(function (h) {
        h.energy = Math.max(0, h.energy - dt * 0.72);
        var boost = (hoveredId === h.spec.id || (activeRegionGroup && h.spec.region === activeRegionGroup)) ? 1.0 : h.energy;
        var pulse = (t * 0.68 + h.phase) % 1;
        var wS = 1 + pulse * (h.spec.primary ? 2.5 : (h.spec.labeled ? 1.9 : 1.55));
        h.waveMesh.scale.set(wS, wS, 1);
        h.waveMat.opacity = (1 - pulse) * ((h.spec.labeled ? 0.44 : 0.32) + boost * 0.44);
        var oS = h.baseOrbSize * (1 + boost * 0.55);
        h.orbSprite.scale.set(oS, oS, 1);

        var el = pinEls[h.spec.id];
        if (el && lastW >= 1024) {
          projVec.copy(h.tipPos).applyMatrix4(mapGroup.matrixWorld).project(camera);
          var sx = (projVec.x * 0.5 + 0.5) * lastW;
          var sy = (-projVec.y * 0.5 + 0.5) * lastH;
          el.style.transform = 'translate3d(' + sx.toFixed(1) + 'px,' + sy.toFixed(1) + 'px,0)';
        }
      });

      if (hoveredId && hubs[hoveredId]) {
        reticleGroup.visible = true;
        reticleAlpha = Math.min(1, reticleAlpha + dt * 7);
        reticleGroup.position.lerp(hubs[hoveredId].surfacePos, Math.min(1, dt * 11));
        retRingDash.rotation.z = t * 1.4;
        retRingOuter.material.opacity = 0.92 * reticleAlpha;
        retRingDash.material.opacity = 0.75 * reticleAlpha;
      } else {
        reticleAlpha = Math.max(0, reticleAlpha - dt * 5);
        if (reticleAlpha <= 0.01) reticleGroup.visible = false;
      }

      arcs.forEach(function (a) {
        a.boost = Math.max(0, a.boost - dt * 0.8);
        var active = hoveredId && (hoveredId === 'ncr' || a.spec.region === activeRegionGroup || a.spec.to === hoveredId);
        a.mat.opacity = Math.min(0.95, 0.25 + a.boost * 0.55 + (active ? 0.34 : 0));
      });

      ambientPhotons.forEach(function (ap) {
        ap.t = (ap.t + dt * ap.speed) % 1;
        ap.curve.getPointAt(ap.t, ap.sprite.position);
      });

      for (var p = burstPackets.length - 1; p >= 0; p--) {
        var pk = burstPackets[p];
        pk.t += dt * pk.speed;
        if (pk.t >= 1) {
          if (pk.targetHub) pk.targetHub.energy = Math.max(pk.targetHub.energy, 1.3);
          mapGroup.remove(pk.sprite);
          pk.sprite.material.dispose();
          burstPackets.splice(p, 1);
          continue;
        }
        pk.curve.getPointAt(pk.t, pk.sprite.position);
      }

      renderer.render(scene, camera);
    }

    function checkVisible() {
      var rect = section.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      var inView = rect.bottom > 40 && rect.top < vh - 40 && !document.hidden;
      if (inView && !isVisible) {
        isVisible = true;
        prevTime = performance.now();
        if (!rafId) rafId = requestAnimationFrame(tick);
      } else if (!inView && isVisible) {
        isVisible = false;
      }
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !document.hidden) {
            isVisible = true;
            prevTime = performance.now();
            if (!rafId) rafId = requestAnimationFrame(tick);
          } else {
            isVisible = false;
          }
        });
      }, { threshold: 0.04 });
      io.observe(section);
    } else {
      isVisible = true;
      rafId = requestAnimationFrame(tick);
    }

    document.addEventListener('visibilitychange', checkVisible);
    checkVisible();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPhilippinesRightMap);
  } else {
    initPhilippinesRightMap();
  }
})();
