import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Replace header and card tops in Slide 2
old_header = '''            <!-- Eyebrow Pill & Header -->
            <div class="text-center max-w-3xl mx-auto mb-10 pt-4">
              <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
                What <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky via-[#72c5f8] to-white">We Do</span>
              </h2>
              <p class="text-xs sm:text-sm text-cream/75 leading-relaxed max-w-2xl mx-auto">
                Comprehensive commercial operations, clinical distribution, and surgical healthcare partnerships across the Philippine archipelago.
              </p>

              <!-- Interactive Stacking Card Scroll Hint -->
              <div class="mt-5 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#071530]/80 border border-sky/20 text-[11px] font-semibold text-sky uppercase tracking-wider backdrop-blur-md">
                <span>Scroll down to stack all 6 capabilities</span>
                <svg class="size-3.5 animate-bounce text-[#72c5f8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>'''

new_header = '''            <!-- Sticky Header Section (Remains visible & pinned while cards stack) -->
            <div class="sticky top-0 z-[70] bg-[#0a1d40]/95 backdrop-blur-xl pt-2 pb-4 mb-6 text-center max-w-3xl mx-auto rounded-b-2xl border-b border-sky/20 shadow-[0_10px_30px_rgba(10,29,64,0.8)]">
              <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2">
                What <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky via-[#72c5f8] to-white">We Do</span>
              </h2>
              <p class="text-xs sm:text-sm text-cream/75 leading-relaxed max-w-2xl mx-auto">
                Comprehensive commercial operations, clinical distribution, and surgical healthcare partnerships across the Philippine archipelago.
              </p>

              <!-- Interactive Stacking Card Scroll Hint -->
              <div class="mt-3 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#071530]/80 border border-sky/20 text-[11px] font-semibold text-sky uppercase tracking-wider backdrop-blur-md">
                <span>Scroll down to stack all 6 capabilities</span>
                <svg class="size-3.5 animate-bounce text-[#72c5f8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>'''

if old_header in content:
    content = content.replace(old_header, new_header)
    print("Replaced header with sticky header.")
else:
    print("Warning: old_header not found directly, checking regex...")

# Update top offsets on the 6 cards so they stack below the sticky header
card_top_map = [
    ('style="top: 75px; z-index: 10;"', 'style="top: 155px; z-index: 10;"'),
    ('style="top: 92px; z-index: 20;"', 'style="top: 170px; z-index: 20;"'),
    ('style="top: 109px; z-index: 30;"', 'style="top: 185px; z-index: 30;"'),
    ('style="top: 126px; z-index: 40;"', 'style="top: 200px; z-index: 40;"'),
    ('style="top: 143px; z-index: 50;"', 'style="top: 215px; z-index: 50;"'),
    ('style="top: 160px; z-index: 60;"', 'style="top: 230px; z-index: 60;"')
]

for old_top, new_top in card_top_map:
    if old_top in content:
        content = content.replace(old_top, new_top, 1)
        print(f"Replaced {old_top} -> {new_top}")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated index.html successfully.")

