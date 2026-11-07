card_html = """
<div class="relative group">
  <!-- Architectural Corner Crosshairs -->
  <span class="absolute -top-3 -left-3 size-6 flex items-center justify-center font-mono text-sm text-sky/60 pointer-events-none select-none">+</span>
  <span class="absolute -top-3 -right-3 size-6 flex items-center justify-center font-mono text-sm text-sky/60 pointer-events-none select-none">+</span>
  <span class="absolute -bottom-3 -left-3 size-6 flex items-center justify-center font-mono text-sm text-sky/60 pointer-events-none select-none">+</span>
  <span class="absolute -bottom-3 -right-3 size-6 flex items-center justify-center font-mono text-sm text-sky/60 pointer-events-none select-none">+</span>

  <!-- Extended Construction Tick Lines -->
  <div class="pointer-events-none absolute -top-4 -bottom-4 left-0 w-px bg-sky/20"></div>
  <div class="pointer-events-none absolute -top-4 -bottom-4 right-0 w-px bg-sky/20"></div>
  <div class="pointer-events-none absolute -left-4 -right-4 top-0 h-px bg-sky/20"></div>
  <div class="pointer-events-none absolute -left-4 -right-4 bottom-0 h-px bg-sky/20"></div>

  <!-- Card Body -->
  <div class="relative rounded-xl bg-[#071530]/85 border border-sky/30 p-6 sm:p-7 backdrop-blur-xl shadow-[0_16px_45px_rgba(0,0,0,0.5)] transition-all group-hover:border-sky/60 group-hover:bg-[#0a1e42]/90">
    <!-- Quote / Badge Icon -->
    <div class="text-sky/60 mb-4">
      <svg class="size-6" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
    </div>

    <!-- Text -->
    <p class="text-sm sm:text-[15px] text-cream/90 leading-relaxed mb-6 font-normal">
      Statement goes here...
    </p>

    <!-- Author / Identity Footer -->
    <div class="flex items-center gap-3 pt-4 border-t border-sky/15">
      <div class="size-10 rounded-full bg-sky/15 border border-sky/30 flex items-center justify-center shrink-0 text-sky">
        ICON
      </div>
      <div>
        <div class="text-sm font-bold text-white tracking-wide">Title</div>
        <div class="text-xs text-sky/80">Subtitle</div>
      </div>
    </div>
  </div>
</div>
"""
print("Card layout drafted successfully.")

