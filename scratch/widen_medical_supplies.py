import re

with open('index.html', 'r', encoding='utf-8') as f:
    h = f.read()

# 1. Update Slide 2 parent container padding
old_slide2_open = '<div class="product-slide absolute inset-0 w-full h-full flex flex-col justify-start items-center px-4 sm:px-8 lg:px-12 py-16 transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0 overflow-y-auto" data-product-index="2">'
new_slide2_open = '<div class="product-slide absolute inset-0 w-full h-full flex flex-col justify-start items-center px-3 sm:px-6 lg:px-10 py-5 sm:py-7 transition-all duration-500 ease-out opacity-0 pointer-events-none translate-x-12 z-0 overflow-y-auto" data-product-index="2">'

if old_slide2_open in h:
    h = h.replace(old_slide2_open, new_slide2_open)
    print("Updated Slide 2 parent container padding!")
else:
    print("Warning: old_slide2_open not found directly, checking regex")
    h = re.sub(
        r'<div class="product-slide[^"]*" data-product-index="2">',
        new_slide2_open,
        h
    )

# 2. Update inner container from max-w-7xl to max-w-[1720px]
old_inner = '<div class="relative z-10 w-full max-w-7xl mx-auto my-auto py-6">'
new_inner = '<div class="relative z-10 w-full max-w-[1720px] mx-auto my-auto py-3 sm:py-5">'

if old_inner in h:
    h = h.replace(old_inner, new_inner)
    print("Replaced max-w-7xl with max-w-[1720px]!")
else:
    print("Warning: old_inner not found directly, checking regex")
    h = re.sub(
        r'<div class="relative z-10 w-full max-w-7xl mx-auto my-auto py-6">',
        new_inner,
        h
    )

# 3. Enhance Ophteis cards image container height from h-44 to h-52 lg:h-60
h = h.replace('class="relative w-full h-44 rounded-xl bg-radial', 'class="relative w-full h-52 lg:h-64 rounded-xl bg-radial')

# 4. Enhance AEON cards image container height from h-36 to h-44 lg:h-52
h = h.replace('class="relative w-full h-36 rounded-lg bg-radial', 'class="relative w-full h-44 lg:h-52 rounded-lg bg-radial')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(h)
print("Updated index.html successfully!")

