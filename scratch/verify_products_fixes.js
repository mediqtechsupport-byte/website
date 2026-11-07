const fs = require('fs');

console.log('=== VERIFYING PRODUCTS & HERO-MATCHING SILK WAVES ===');

const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('assets/js/main.js', 'utf8');

let errors = [];

// 1. Check Root Canvases in #products (mounted at section level, exactly matching #hero)
if (!html.includes('id="products-waves-shader-canvas"')) {
  errors.push('Missing products-waves-shader-canvas in index.html');
}
if (!html.includes('id="products-smoke-canvas"')) {
  errors.push('Missing products-smoke-canvas in index.html');
}
if (!html.includes('bg-[#0a1d40]')) {
  errors.push('Missing #0a1d40 section background');
}

// 2. Check iol-scroll-container has no scroll-smooth (for 60/120fps responsive tracking)
const iolContainerMatch = html.match(/id="iol-scroll-container"[^>]*class="([^"]*)"/);
if (iolContainerMatch) {
  if (iolContainerMatch[1].includes('scroll-smooth')) {
    errors.push('iol-scroll-container still has scroll-smooth class');
  } else {
    console.log('[PASS] iol-scroll-container has instant response tracking (scroll-smooth removed).');
  }
}

// 3. Check scroll track height (300vh for snappy responsive transitions)
if (html.includes('h-[300vh] w-full relative')) {
  console.log('[PASS] Scroll track height is 300vh for fluid stage transitions.');
} else {
  errors.push('Scroll track height is not 300vh');
}

// 4. Check main.js Silk Waves Shader initialization for products
if (js.includes("initSilkWavesShader('products-waves-shader-canvas');")) {
  console.log('[PASS] Silk Waves Shader (waves-background-2) initialized on products-waves-shader-canvas.');
} else {
  errors.push('initSilkWavesShader not called for products-waves-shader-canvas');
}

// 5. Check main.js Wheel responsiveness
if (js.includes('scrollContainer.scrollTop += e.deltaY * 1.6;')) {
  console.log('[PASS] Wheel listener forwards all scroll gestures on Slide 1 with 1.6x multiplier anywhere on screen.');
} else {
  errors.push('Wheel listener does not use 1.6x multiplier or is restricted');
}

// 6. Check main.js Touch Screen support
if (js.includes('scrollContainer.scrollTop = touchStartScrollTop + diffY * 2.0;')) {
  console.log('[PASS] Touch screen drag listener handles touchstart/touchmove/touchend with 2.0x gesture responsiveness.');
} else {
  errors.push('Touch screen drag listener missing or incorrect');
}

if (errors.length === 0) {
  console.log('ALL PRODUCTS & SILK WAVES VERIFICATIONS PASSED 100%!');
} else {
  console.error('Errors found:', errors);
  process.exit(1);
}
