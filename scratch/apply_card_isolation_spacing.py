with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove space-y-10 from stacking-cards-container
content = content.replace(
    '<div id="stacking-cards-container" class="relative w-full space-y-10 pb-24">',
    '<div id="stacking-cards-container" class="relative w-full pb-32">'
)

# 2. Update Card 1 through 5 with mb-[65vh] so the next card is completely off-screen until scrolled
card_items = [
    # Card 1
    (
        '<div class="stacking-card-item sticky transition-transform duration-300 ease-out" style="top: 155px; z-index: 10;">',
        '<div class="stacking-card-item sticky mb-[65vh] sm:mb-[75vh] transition-transform duration-300 ease-out" style="top: 155px; z-index: 10;">'
    ),
    # Card 2
    (
        '<div class="stacking-card-item sticky transition-transform duration-300 ease-out" style="top: 170px; z-index: 20;">',
        '<div class="stacking-card-item sticky mb-[65vh] sm:mb-[75vh] transition-transform duration-300 ease-out" style="top: 170px; z-index: 20;">'
    ),
    # Card 3
    (
        '<div class="stacking-card-item sticky transition-transform duration-300 ease-out" style="top: 185px; z-index: 30;">',
        '<div class="stacking-card-item sticky mb-[65vh] sm:mb-[75vh] transition-transform duration-300 ease-out" style="top: 185px; z-index: 30;">'
    ),
    # Card 4
    (
        '<div class="stacking-card-item sticky transition-transform duration-300 ease-out" style="top: 200px; z-index: 40;">',
        '<div class="stacking-card-item sticky mb-[65vh] sm:mb-[75vh] transition-transform duration-300 ease-out" style="top: 200px; z-index: 40;">'
    ),
    # Card 5
    (
        '<div class="stacking-card-item sticky transition-transform duration-300 ease-out" style="top: 215px; z-index: 50;">',
        '<div class="stacking-card-item sticky mb-[65vh] sm:mb-[75vh] transition-transform duration-300 ease-out" style="top: 215px; z-index: 50;">'
    ),
    # Card 6 (Last card, normal bottom margin)
    (
        '<div class="stacking-card-item sticky transition-transform duration-300 ease-out" style="top: 230px; z-index: 60;">',
        '<div class="stacking-card-item sticky mb-16 transition-transform duration-300 ease-out" style="top: 230px; z-index: 60;">'
    ),
]

for old_tag, new_tag in card_items:
    if old_tag in content:
        content = content.replace(old_tag, new_tag, 1)
        print(f"Updated card wrapper: {old_tag[:40]}...")
    else:
        print(f"Warning: not found {old_tag[:40]}")

# 3. Enhance card-inner padding and min-height to match Image 1
old_inner_1 = 'class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#071530]/95 backdrop-blur-2xl p-6 sm:p-7 lg:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-8 items-center"'
new_inner_1 = 'class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#071530]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-10 items-center min-h-[380px] sm:min-h-[420px]"'

old_inner_2 = 'class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#081a3d]/95 backdrop-blur-2xl p-6 sm:p-7 lg:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-8 items-center"'
new_inner_2 = 'class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#081a3d]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-10 items-center min-h-[380px] sm:min-h-[420px]"'

old_inner_3 = 'class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#091f47]/95 backdrop-blur-2xl p-6 sm:p-7 lg:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-8 items-center"'
new_inner_3 = 'class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#091f47]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-10 items-center min-h-[380px] sm:min-h-[420px]"'

old_inner_4 = 'class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#082250]/95 backdrop-blur-2xl p-6 sm:p-7 lg:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-8 items-center"'
new_inner_4 = 'class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#082250]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-10 items-center min-h-[380px] sm:min-h-[420px]"'

old_inner_5 = 'class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#0a2354]/95 backdrop-blur-2xl p-6 sm:p-7 lg:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-8 items-center"'
new_inner_5 = 'class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#0a2354]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-10 items-center min-h-[380px] sm:min-h-[420px]"'

old_inner_6 = 'class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#071738]/95 backdrop-blur-2xl p-6 sm:p-7 lg:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-8 items-center"'
new_inner_6 = 'class="stacking-card-inner relative overflow-hidden rounded-3xl border border-sky/30 bg-[#071738]/95 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 hover:border-sky/50 transition-all flex flex-col lg:flex-row gap-6 lg:gap-10 items-center min-h-[380px] sm:min-h-[420px]"'

for o, n in [(old_inner_1, new_inner_1), (old_inner_2, new_inner_2), (old_inner_3, new_inner_3), (old_inner_4, new_inner_4), (old_inner_5, new_inner_5), (old_inner_6, new_inner_6)]:
    if o in content:
        content = content.replace(o, n, 1)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Saved index.html successfully.")

