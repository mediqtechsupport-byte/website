with open("assets/js/main.js", "r", encoding="utf-8") as f:
    text = f.read()

old_fn = '''/* ========================================================================= */
/* ABOUT MEDIQ STACKING CARDS DYNAMIC PHYSICS                                */
/* ========================================================================= */
function initAboutStackingCards() {
  const slide = document.getElementById('about-slide-what-we-do');
  if (!slide) return;
  const cardItems = slide.querySelectorAll('.stacking-card-item');
  if (!cardItems.length) return;

  function updateCardScales() {
    const slideRect = slide.getBoundingClientRect();
    const totalCards = cardItems.length;

    cardItems.forEach((item, index) => {
      const inner = item.querySelector('.stacking-card-inner');
      if (!inner) return;

      let coveredProgress = 0;
      for (let nextIdx = index + 1; nextIdx < totalCards; nextIdx++) {
        const nextItem = cardItems[nextIdx];
        const nextRect = nextItem.getBoundingClientRect();
        const nextTop = nextRect.top - slideRect.top;
        const targetNextTop = 155 + nextIdx * 15;

        const dist = nextTop - targetNextTop;
        if (dist < 220) {
          const factor = Math.max(0, Math.min(1, (220 - dist) / 220));
          coveredProgress = Math.max(coveredProgress, factor * (nextIdx - index));
        }
      }

      const targetScale = Math.max(0.90, 1 - coveredProgress * 0.035);
      const targetBrightness = Math.max(0.70, 1 - coveredProgress * 0.10);

      inner.style.transform = "scale(" + targetScale.toFixed(3) + ")";
      inner.style.filter = "brightness(" + targetBrightness.toFixed(2) + ")";
    });
  }

  slide.addEventListener('scroll', updateCardScales, { passive: true });
  window.addEventListener('resize', updateCardScales, { passive: true });
  setTimeout(updateCardScales, 200);
}'''

new_fn = '''/* ========================================================================= */
/* ABOUT MEDIQ STACKING CARDS DYNAMIC PHYSICS                                */
/* ========================================================================= */
function initAboutStackingCards() {
  const slide = document.getElementById('about-slide-what-we-do');
  if (!slide) return;
  const scrollContainer = document.getElementById('about-stacking-scroll-viewport') || slide;
  const cardItems = scrollContainer.querySelectorAll('.stacking-card-item');
  if (!cardItems.length) return;

  function updateCardScales() {
    const containerRect = scrollContainer.getBoundingClientRect();
    const totalCards = cardItems.length;

    cardItems.forEach((item, index) => {
      const inner = item.querySelector('.stacking-card-inner');
      if (!inner) return;

      let coveredProgress = 0;
      for (let nextIdx = index + 1; nextIdx < totalCards; nextIdx++) {
        const nextItem = cardItems[nextIdx];
        const nextRect = nextItem.getBoundingClientRect();
        const nextTop = nextRect.top - containerRect.top;
        const targetNextTop = 10 + nextIdx * 15;

        const dist = nextTop - targetNextTop;
        if (dist < 260) {
          const factor = Math.max(0, Math.min(1, (260 - dist) / 260));
          coveredProgress = Math.max(coveredProgress, factor * (nextIdx - index));
        }
      }

      const targetScale = Math.max(0.90, 1 - coveredProgress * 0.035);
      const targetBrightness = Math.max(0.70, 1 - coveredProgress * 0.10);

      inner.style.transform = "scale(" + targetScale.toFixed(3) + ")";
      inner.style.filter = "brightness(" + targetBrightness.toFixed(2) + ")";
    });
  }

  scrollContainer.addEventListener('scroll', updateCardScales, { passive: true });
  window.addEventListener('resize', updateCardScales, { passive: true });
  setTimeout(updateCardScales, 200);
}'''

if old_fn in text:
    text = text.replace(old_fn, new_fn)
    with open("assets/js/main.js", "w", encoding="utf-8") as f:
        f.write(text)
    print("Updated main.js successfully.")
else:
    print("old_fn not found directly, checking...")

