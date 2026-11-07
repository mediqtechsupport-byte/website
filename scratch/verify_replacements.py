with open('index.html', 'r', encoding='utf-8') as f:
    h = f.read()

# 1. Update Card 1 on Slide 0:
# Change p-2 to p-4 sm:p-5 so authentic_emv is centered with no bottom cropping!
# And Card 2: use ophteis_adaptive.png?v=370.00
# And Card 3: use authentic_emv_toric.png?v=370.00 or RayOne EMV Carton with p-4

# Check Card 1 in h
old_card_1 = '<img src="assets/img/packshots/authentic_emv.png?v=367.00" alt="Intraocular Lenses" class="object-contain p-2" loading="lazy">'
new_card_1 = '<img src="assets/img/packshots/authentic_emv.png?v=370.00" alt="Intraocular Lenses" class="object-contain p-4 group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_12px_20px_rgba(0,0,0,0.7)]" loading="lazy">'

old_card_2 = '<img src="assets/img/packshots/Ophteis Adaptive Pro.png" alt="Medical Supplies" loading="lazy">'
new_card_2 = '<img src="assets/img/packshots/ophteis_adaptive.png?v=370.00" alt="Medical Supplies" class="object-contain p-3 group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_12px_20px_rgba(0,0,0,0.7)]" loading="lazy">'

print("Card 1 found:", old_card_1 in h)
print("Card 2 found:", old_card_2 in h)

# 2. Check Slide 2 wrapper
old_s2_wrap = '<div class="product-slide absolute inset-0 w-full h-full flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 py-3 sm:py-4 transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0 overflow-y-auto" data-product-index="2">\n          <div class="relative z-10 w-full max-w-[1680px] mx-auto flex flex-col justify-center">'
new_s2_wrap = '<div class="product-slide absolute inset-0 w-full h-full overflow-y-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-6 transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0" data-product-index="2">\n          <div class="relative z-10 w-full max-w-[1680px] mx-auto min-h-full flex flex-col justify-start md:justify-center py-2 pb-24">'

print("Slide 2 wrapper found:", old_s2_wrap in h)

