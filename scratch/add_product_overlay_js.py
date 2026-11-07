with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    text = f.read()

product_overlay_code = '''
/* ========================================================================= */
/* PRODUCTS SECTION 3-CARD OVERLAYS CONTROLLER                               */
/* ========================================================================= */
let activeProductOverlay = null;

function openProductOverlay(type) {
  closeProductOverlay();
  let overlayId = '';
  if (type === 'iols' || type === 'lenses') {
    overlayId = 'product-overlay-iols';
  } else if (type === 'ovds' || type === 'viscoelastics') {
    overlayId = 'product-overlay-ovds';
  } else if (type === 'injectors' || type === 'systems') {
    overlayId = 'product-overlay-injectors';
  }

  const overlay = document.getElementById(overlayId);
  if (!overlay) return;

  activeProductOverlay = overlay;
  overlay.classList.remove('opacity-0', 'pointer-events-none');
  overlay.classList.add('opacity-100', 'pointer-events-auto');
  document.body.style.overflow = 'hidden';
}

function closeProductOverlay() {
  const overlays = document.querySelectorAll('#product-overlay-iols, #product-overlay-ovds, #product-overlay-injectors');
  overlays.forEach((ov) => {
    ov.classList.remove('opacity-100', 'pointer-events-auto');
    ov.classList.add('opacity-0', 'pointer-events-none');
  });
  activeProductOverlay = null;
  document.body.style.overflow = '';
}

window.openProductOverlay = openProductOverlay;
window.closeProductOverlay = closeProductOverlay;

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && activeProductOverlay) {
    closeProductOverlay();
  }
});
'''

if 'openProductOverlay' not in text:
    text = text + product_overlay_code
    with open('assets/js/main.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Added product overlay logic to main.js successfully!")
else:
    print("openProductOverlay already exists in main.js")

