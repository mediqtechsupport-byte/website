const fs = require('fs');

const mainJsPath = 'assets/js/main.js';
let content = fs.readFileSync(mainJsPath, 'utf8');

const targetStr = `  /* ========================================================================= */
  /* ABOUT PILLAR CARDS (Company Overview, Mission, Management, Compliance)    */
  /* ========================================================================= */
  function initAboutPillarCards() {
    const cards = document.querySelectorAll('.about-pillar-card');
    if (!cards.length) return;

    function selectPillar(idx) {
      cards.forEach((card, i) => {
        const isActive = i === idx;
        card.classList.toggle('is-active', isActive);
        card.classList.toggle('border-sky/50', isActive);
        card.classList.toggle('bg-[#07162e]/95', isActive);
        card.classList.toggle('shadow-[0_8px_30px_rgba(58,160,219,0.18)]', isActive);
        card.classList.toggle('border-white/10', !isActive);
        card.classList.toggle('bg-[#071324]/60', !isActive);

        const drawer = card.querySelector('.pillar-drawer');
        if (drawer) {
          drawer.classList.toggle('hidden', !isActive);
        }

        const icon = card.querySelector('.pillar-toggle-icon');
        if (icon) {
          icon.classList.toggle('rotate-45', isActive);
          icon.classList.toggle('rotate-0', !isActive);
          icon.classList.toggle('text-white', isActive);
          icon.classList.toggle('text-white/70', !isActive);
        }

        const indicator = card.querySelector('.pillar-indicator');
        if (indicator) {
          indicator.classList.toggle('border-sky/50', isActive);
          indicator.classList.toggle('bg-sky/20', isActive);
          indicator.classList.toggle('text-sky', isActive);
          indicator.classList.toggle('border-white/20', !isActive);
          indicator.classList.toggle('bg-white/[0.05]', !isActive);
          indicator.classList.toggle('text-cream/50', !isActive);
        }
      });
    }

    cards.forEach((card, i) => {
      card.addEventListener('click', () => {
        const wasActive = card.classList.contains('is-active');
        if (wasActive) {
          // Toggle closed if already active
          card.classList.remove('is-active', 'border-sky/50', 'bg-[#07162e]/95', 'shadow-[0_8px_30px_rgba(58,160,219,0.18)]');
          card.classList.add('border-white/10', 'bg-[#071324]/60');
          const drawer = card.querySelector('.pillar-drawer');
          if (drawer) drawer.classList.add('hidden');
          const icon = card.querySelector('.pillar-toggle-icon');
          if (icon) {
            icon.classList.remove('rotate-45', 'text-white');
            icon.classList.add('rotate-0', 'text-white/70');
          }
          const indicator = card.querySelector('.pillar-indicator');
          if (indicator) {
            indicator.classList.remove('border-sky/50', 'bg-sky/20', 'text-sky');
            indicator.classList.add('border-white/20', 'bg-white/[0.05]', 'text-cream/50');
          }
        } else {
          selectPillar(i);
        }
      });
    });

    // Link navbar dropdown items (Company Overview, Mission, Management, Compliance)
    document.querySelectorAll('[data-open-pel], [data-pillar-idx]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const idx = parseInt(link.getAttribute('data-pillar-idx') || link.getAttribute('data-open-pel') || '0', 10);
        selectPillar(idx);
        const aboutSec = document.getElementById('about');
        if (aboutSec) {
          aboutSec.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }`;

const replacementStr = `  /* ========================================================================= */
  /* ABOUT PRESCRIPTION BOND PAPER DRAWER & NAVIGATION ACCORDION               */
  /* ========================================================================= */
  function initAboutPillarCards() {
    const fqCards = document.querySelectorAll('.fq-card');
    const legacyCards = document.querySelectorAll('.about-pillar-card');

    function selectIndexCard(idx) {
      if (fqCards && fqCards.length) {
        fqCards.forEach((c, i) => {
          if (i === idx) {
            c.setAttribute('open', '');
          } else {
            c.removeAttribute('open');
          }
        });
      }
      if (legacyCards && legacyCards.length) {
        legacyCards.forEach((card, i) => {
          const isActive = i === idx;
          card.classList.toggle('is-active', isActive);
          card.classList.toggle('border-sky/50', isActive);
          card.classList.toggle('bg-[#07162e]/95', isActive);
          card.classList.toggle('shadow-[0_8px_30px_rgba(58,160,219,0.18)]', isActive);
          card.classList.toggle('border-white/10', !isActive);
          card.classList.toggle('bg-[#071324]/60', !isActive);
        });
      }
    }

    // Single-card open mutual exclusion (robust cross-browser accordion)
    if (fqCards && fqCards.length) {
      fqCards.forEach((card, i) => {
        card.addEventListener('toggle', () => {
          if (card.open) {
            fqCards.forEach((other, j) => {
              if (i !== j && other.open) {
                other.removeAttribute('open');
              }
            });
          }
        });
      });
    }

    // Link navbar dropdown items (Company Overview, Mission, Management, Compliance)
    document.querySelectorAll('[data-open-pel], [data-pillar-idx]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const idx = parseInt(link.getAttribute('data-pillar-idx') || link.getAttribute('data-open-pel') || '0', 10);
        selectIndexCard(idx);
        const aboutSec = document.getElementById('about');
        if (aboutSec) {
          aboutSec.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }`;

if (!content.includes(targetStr)) {
  console.error('Target string not found in assets/js/main.js');
  process.exit(1);
}

content = content.replace(targetStr, replacementStr);
fs.writeFileSync(mainJsPath, content, 'utf8');
console.log('Successfully updated assets/js/main.js!');

