import re

with open('index.html', 'r', encoding='utf-8') as f:
    h = f.read()

# 1. Update Slide 2 parent container padding & vertical alignment
old_parent = '<div class="product-slide absolute inset-0 w-full h-full flex flex-col justify-start items-center px-3 sm:px-6 lg:px-10 py-5 sm:py-7 transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0 overflow-y-auto" data-product-index="2">'
new_parent = '<div class="product-slide absolute inset-0 w-full h-full flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 py-3 sm:py-4 transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0 overflow-y-auto" data-product-index="2">'

if old_parent in h:
    h = h.replace(old_parent, new_parent)
    print("Replaced Slide 2 parent container!")
else:
    print("Warning: old_parent not found, checking regex")
    h = re.sub(r'<div class="product-slide[^"]*" data-product-index="2">', new_parent, h)

# 2. Update inner container - eliminate dead padding
old_inner = '<div class="relative z-10 w-full max-w-[1720px] mx-auto my-auto py-3 sm:py-5">'
new_inner = '<div class="relative z-10 w-full max-w-[1680px] mx-auto flex flex-col justify-center">'

if old_inner in h:
    h = h.replace(old_inner, new_inner)
    print("Replaced inner wrapper!")
else:
    print("Warning: old_inner not found, checking regex")
    h = re.sub(r'<div class="relative z-10 w-full max-w-\[1720px\] mx-auto my-auto[^"]*">', new_inner, h)

# 3. Compact navigation bar margin
h = h.replace(
    '<!-- Category Navigation Bar (Pill Buttons matching user style) -->\n            <div class="flex items-center justify-between gap-3 mb-4">',
    '<!-- Category Navigation Bar (Pill Buttons matching user style) -->\n            <div class="flex items-center justify-between gap-3 mb-2.5">'
)

# 4. Compact Category Header
old_header = '''            <!-- Category Header with Back Link -->
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <h3 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  Medical Supplies &bull; <span class="text-sky">Ophteis&reg; OVDs &amp; AEON&reg; Care</span>
                </h3>
                <p class="text-xs sm:text-sm text-cream/70 mt-1 max-w-2xl">
                  Bio-engineered sodium hyaluronate viscoelastics with antioxidant Sorbitol, alongside premier AEON ophthalmic solutions for surgical recovery and ocular surface health.
                </p>
              </div>

              <!-- Filter / Category Indicator -->
              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 rounded-full bg-sky/10 border border-sky/30 text-[10px] font-mono font-bold text-sky uppercase">3 OPHTEIS OVDS</span>
                <span class="px-3 py-1 rounded-full bg-sky/10 border border-sky/30 text-[10px] font-mono font-bold text-sky uppercase">4 AEON SOLUTIONS</span>
              </div>
            </div>'''

new_header = '''            <!-- Category Header with Back Link -->
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-3">
              <div>
                <h3 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                  Medical Supplies &bull; <span class="text-sky">Ophteis&reg; OVDs &amp; AEON&reg; Care</span>
                </h3>
                <p class="text-[11px] sm:text-xs text-cream/70 mt-0.5 max-w-2xl">
                  Bio-engineered sodium hyaluronate viscoelastics with antioxidant Sorbitol, alongside premier AEON ophthalmic solutions for surgical recovery.
                </p>
              </div>

              <!-- Filter / Category Indicator -->
              <div class="hidden sm:flex flex-wrap gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-sky/10 border border-sky/30 text-[9px] font-mono font-bold text-sky uppercase">3 OPHTEIS OVDS</span>
                <span class="px-2.5 py-0.5 rounded-full bg-sky/10 border border-sky/30 text-[9px] font-mono font-bold text-sky uppercase">4 AEON SOLUTIONS</span>
              </div>
            </div>'''

h_norm = h.replace('\r\n', '\n')
old_header_norm = old_header.replace('\r\n', '\n')
new_header_norm = new_header.replace('\r\n', '\n')

if old_header_norm in h_norm:
    h_norm = h_norm.replace(old_header_norm, new_header_norm)
    print("Replaced Category Header!")
else:
    print("Warning: old_header not found directly")

# 5. Compact Section A (Ophteis)
h_norm = h_norm.replace(
    '<!-- SECTION A: OPHTEIS VISCOSURGICAL OVDS (3 BOX PACKSHOTS) -->\n            <div class="mb-8">',
    '<!-- SECTION A: OPHTEIS VISCOSURGICAL OVDS (3 BOX PACKSHOTS) -->\n            <div class="mb-3">'
)
h_norm = h_norm.replace(
    '<span>01 &bull; OPHTEIS&reg; VISCOSURGICAL DEVICES (OVDS)</span>\n                <span class="h-px flex-1 bg-sky/20"></span>\n              </h4>\n              \n              <div class="grid grid-cols-1 md:grid-cols-3 gap-5">',
    '<span>01 &bull; OPHTEIS&reg; VISCOSURGICAL DEVICES (OVDS)</span>\n                <span class="h-px flex-1 bg-sky/20"></span>\n              </h4>\n              \n              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">'
)

# Replace Ophteis box image heights from h-52 lg:h-64 to h-36 lg:h-44
h_norm = h_norm.replace('class="relative w-full h-52 lg:h-64 rounded-xl bg-radial', 'class="relative w-full h-36 lg:h-44 rounded-xl bg-radial')
h_norm = h_norm.replace('p-4 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between', 'p-3 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between')

# 6. Compact Section B (AEON)
h_norm = h_norm.replace(
    '<!-- SECTION B: AEON EYE SOLUTIONS & OCULAR SURFACE CARE (4 PRODUCTS) -->\n            <div>\n              <h4 class="text-sm font-mono font-bold tracking-widest text-sky uppercase mb-3',
    '<!-- SECTION B: AEON EYE SOLUTIONS & OCULAR SURFACE CARE (4 PRODUCTS) -->\n            <div>\n              <h4 class="text-xs font-mono font-bold tracking-widest text-sky uppercase mb-2'
)
h_norm = h_norm.replace(
    '<div class="grid grid-cols-2 md:grid-cols-4 gap-4">',
    '<div class="grid grid-cols-2 md:grid-cols-4 gap-3">'
)

# Replace AEON box image heights from h-44 lg:h-52 to h-28 lg:h-34
h_norm = h_norm.replace('class="relative w-full h-44 lg:h-52 rounded-lg bg-radial', 'class="relative w-full h-28 lg:h-34 rounded-lg bg-radial')
h_norm = h_norm.replace('p-3.5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between', 'p-2.5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(h_norm)
print("Updated index.html successfully!")

