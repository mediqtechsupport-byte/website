const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Update Products Slides 1-4 top-[126px] -> top-[128px] to match 80px header + 48px mediq-subnavbar
html = html.replace(/product-slide absolute inset-x-0 top-\[126px\] bottom-0/g, 'product-slide absolute inset-x-0 top-[128px] bottom-0');

// 2. Define the 5 deck sub-navbars in the exact unified format
const DECK_SUBNAVBARS = {
  brands: `      <!-- Attached Brands Sub-Navbar: Flush with Main Header (top-20) -->
      <div data-deck-bar="brands" class="mediq-subnavbar absolute inset-x-0 top-20 z-40 w-full opacity-0 pointer-events-none -translate-y-2 transition-all duration-300">
        <nav aria-label="Brands &amp; Partners Subsections" class="mediq-subnavbar__inner">
          <button type="button" onclick="if(window.goToDeckSlide){window.goToDeckSlide('brands', 0);}" class="mediq-subnavbar__overview">Overview</button>
          <button type="button" data-deck-pill="brands:1" onclick="if(window.goToDeckSlide){window.goToDeckSlide('brands', 1);}" class="mediq-subnavbar__tab is-active">Principal Brands</button>
          <span class="mediq-subnavbar__sep" aria-hidden="true"></span>
          <button type="button" data-deck-pill="brands:2" onclick="if(window.goToDeckSlide){window.goToDeckSlide('brands', 2);}" class="mediq-subnavbar__tab">Brand Profiles</button>
          <span class="mediq-subnavbar__sep" aria-hidden="true"></span>
          <button type="button" data-deck-pill="brands:3" onclick="if(window.goToDeckSlide){window.goToDeckSlide('brands', 3);}" class="mediq-subnavbar__tab">Downloadable Brochures</button>
        </nav>
      </div>`,
  services: `      <!-- Attached Services Sub-Navbar: Flush with Main Header (top-20) -->
      <div data-deck-bar="services" class="mediq-subnavbar absolute inset-x-0 top-20 z-40 w-full opacity-0 pointer-events-none -translate-y-2 transition-all duration-300">
        <nav aria-label="Services Subsections" class="mediq-subnavbar__inner">
          <button type="button" onclick="if(window.goToDeckSlide){window.goToDeckSlide('services', 0);}" class="mediq-subnavbar__overview">Overview</button>
          <button type="button" data-deck-pill="services:1" onclick="if(window.goToDeckSlide){window.goToDeckSlide('services', 1);}" class="mediq-subnavbar__tab is-active">Distribution</button>
          <span class="mediq-subnavbar__sep" aria-hidden="true"></span>
          <button type="button" data-deck-pill="services:2" onclick="if(window.goToDeckSlide){window.goToDeckSlide('services', 2);}" class="mediq-subnavbar__tab">Product Support</button>
          <span class="mediq-subnavbar__sep" aria-hidden="true"></span>
          <button type="button" data-deck-pill="services:3" onclick="if(window.goToDeckSlide){window.goToDeckSlide('services', 3);}" class="mediq-subnavbar__tab">Training &amp; Education</button>
          <span class="mediq-subnavbar__sep" aria-hidden="true"></span>
          <button type="button" data-deck-pill="services:4" onclick="if(window.goToDeckSlide){window.goToDeckSlide('services', 4);}" class="mediq-subnavbar__tab">Customer Service</button>
        </nav>
      </div>`,
  resources: `      <!-- Attached Resources Sub-Navbar: Flush with Main Header (top-20) -->
      <div data-deck-bar="resources" class="mediq-subnavbar absolute inset-x-0 top-20 z-40 w-full opacity-0 pointer-events-none -translate-y-2 transition-all duration-300">
        <nav aria-label="Resources Subsections" class="mediq-subnavbar__inner">
          <button type="button" onclick="if(window.goToDeckSlide){window.goToDeckSlide('resources', 0);}" class="mediq-subnavbar__overview">Overview</button>
          <button type="button" data-deck-pill="resources:1" onclick="if(window.goToDeckSlide){window.goToDeckSlide('resources', 1);}" class="mediq-subnavbar__tab is-active">Downloads</button>
          <span class="mediq-subnavbar__sep" aria-hidden="true"></span>
          <button type="button" data-deck-pill="resources:2" onclick="if(window.goToDeckSlide){window.goToDeckSlide('resources', 2);}" class="mediq-subnavbar__tab">FAQs</button>
          <span class="mediq-subnavbar__sep" aria-hidden="true"></span>
          <button type="button" data-deck-pill="resources:3" onclick="if(window.goToDeckSlide){window.goToDeckSlide('resources', 3);}" class="mediq-subnavbar__tab">Regulatory Information</button>
          <span class="mediq-subnavbar__sep" aria-hidden="true"></span>
          <button type="button" data-deck-pill="resources:4" onclick="if(window.goToDeckSlide){window.goToDeckSlide('resources', 4);}" class="mediq-subnavbar__tab">Media Library</button>
        </nav>
      </div>`,
  news: `      <!-- Attached News & Events Sub-Navbar: Flush with Main Header (top-20) -->
      <div data-deck-bar="news" class="mediq-subnavbar absolute inset-x-0 top-20 z-40 w-full opacity-0 pointer-events-none -translate-y-2 transition-all duration-300">
        <nav aria-label="News &amp; Events Subsections" class="mediq-subnavbar__inner">
          <button type="button" onclick="if(window.goToDeckSlide){window.goToDeckSlide('news', 0);}" class="mediq-subnavbar__overview">Overview</button>
          <button type="button" data-deck-pill="news:1" onclick="if(window.goToDeckSlide){window.goToDeckSlide('news', 1);}" class="mediq-subnavbar__tab is-active">Congresses &amp; Symposia</button>
          <span class="mediq-subnavbar__sep" aria-hidden="true"></span>
          <button type="button" data-deck-pill="news:2" onclick="if(window.goToDeckSlide){window.goToDeckSlide('news', 2);}" class="mediq-subnavbar__tab">Wet-Labs &amp; Workshops</button>
          <span class="mediq-subnavbar__sep" aria-hidden="true"></span>
          <button type="button" data-deck-pill="news:3" onclick="if(window.goToDeckSlide){window.goToDeckSlide('news', 3);}" class="mediq-subnavbar__tab">Corporate News</button>
        </nav>
      </div>`,
  contact: `      <!-- Attached Contact Sub-Navbar: Flush with Main Header (top-20) -->
      <div data-deck-bar="contact" class="mediq-subnavbar absolute inset-x-0 top-20 z-40 w-full opacity-0 pointer-events-none -translate-y-2 transition-all duration-300">
        <nav aria-label="Contact Us Subsections" class="mediq-subnavbar__inner">
          <button type="button" onclick="if(window.goToDeckSlide){window.goToDeckSlide('contact', 0);}" class="mediq-subnavbar__overview">Overview</button>
          <button type="button" data-deck-pill="contact:1" onclick="if(window.goToDeckSlide){window.goToDeckSlide('contact', 1);}" class="mediq-subnavbar__tab is-active">Inquiry Form</button>
          <span class="mediq-subnavbar__sep" aria-hidden="true"></span>
          <button type="button" data-deck-pill="contact:2" onclick="if(window.goToDeckSlide){window.goToDeckSlide('contact', 2);}" class="mediq-subnavbar__tab">Office Details</button>
          <span class="mediq-subnavbar__sep" aria-hidden="true"></span>
          <button type="button" data-deck-pill="contact:3" onclick="if(window.goToDeckSlide){window.goToDeckSlide('contact', 3);}" class="mediq-subnavbar__tab">Map</button>
          <span class="mediq-subnavbar__sep" aria-hidden="true"></span>
          <button type="button" data-deck-pill="contact:4" onclick="if(window.goToDeckSlide){window.goToDeckSlide('contact', 4);}" class="mediq-subnavbar__tab">Sales Contacts</button>
        </nav>
      </div>`
};

// Inject each deck subnavbar before its Slide 0
const SLIDE_0_MARKERS = {
  brands: '<!-- SLIDE 0: BRANDS OVERVIEW -->',
  services: '<!-- SLIDE 0: SERVICES OVERVIEW -->',
  resources: '<!-- SLIDE 0: RESOURCES OVERVIEW -->',
  news: '<!-- SLIDE 0: NEWS OVERVIEW -->',
  contact: '<!-- SLIDE 0: CONTACT OVERVIEW -->'
};

for (const [key, marker] of Object.entries(SLIDE_0_MARKERS)) {
  const target = `      <!-- Main Slides Container -->\n      <div class="relative w-full h-full overflow-hidden">\n        ${marker}`;
  const replacement = `${DECK_SUBNAVBARS[key]}\n\n      <!-- Main Slides Container -->\n      <div class="relative w-full h-full overflow-hidden">\n        ${marker}`;
  if (!html.includes(target)) {
    throw new Error('Could not find marker for ' + key);
  }
  html = html.replace(target, replacement);
}

// Update deck-slide positioning:
// Slide 0: top-20 bottom-0
html = html.replace(
  /<div class="deck-slide absolute top-0 left-0 right-0 w-full h-\[calc\(100svh-4\.5rem\)\]([^"]*)" data-deck="([^"]+)" data-slide-index="0">/g,
  '<div class="deck-slide absolute inset-x-0 top-20 bottom-0 w-full$1" data-deck="$2" data-slide-index="0">'
);

// Slides 1..N: top-[128px] bottom-0
html = html.replace(
  /<div class="deck-slide absolute top-0 left-0 right-0 w-full h-\[calc\(100svh-4\.5rem\)\]([^"]*)" data-deck="([^"]+)" data-slide-index="([1-9])">/g,
  '<div class="deck-slide absolute inset-x-0 top-[128px] bottom-0 w-full$1" data-deck="$2" data-slide-index="$3">'
);

// Remove the 18 old inline Top Pill Navigation Bar blocks inside Slides 1..N
const pillRegex = /\s*<!-- Top Pill Navigation Bar -->[\s\S]*?(?=\s*<!-- Compact Header Row -->)/g;
const removedCount = (html.match(pillRegex) || []).length;
console.log('Removing inline Top Pill Navigation Bar blocks:', removedCount);
html = html.replace(pillRegex, '');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated index.html!');

