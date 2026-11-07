with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace Intraocular Lenses link
target1 = '''<!-- Intraocular Lenses -->
                <a href="#products" class="nav-dropdown-card flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream/85 hover:text-white hover:bg-sky/15 transition-all duration-150 group/item">'''
repl1 = '''<!-- Intraocular Lenses -->
                <a href="#products" data-product-slide="1" class="nav-dropdown-card flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream/85 hover:text-white hover:bg-sky/15 transition-all duration-150 group/item">'''

target2 = '''<!-- Medical Supplies -->
                <a href="#products" class="nav-dropdown-card flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream/85 hover:text-white hover:bg-sky/15 transition-all duration-150 group/item">'''
repl2 = '''<!-- Medical Supplies -->
                <a href="#products" data-product-slide="2" class="nav-dropdown-card flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream/85 hover:text-white hover:bg-sky/15 transition-all duration-150 group/item">'''

target3 = '''<!-- Devices & Equipment -->
                <a href="#galaxy-delivery" class="nav-dropdown-card flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream/85 hover:text-white hover:bg-sky/15 transition-all duration-150 group/item">'''
repl3 = '''<!-- Devices & Equipment -->
                <a href="#products" data-product-slide="3" class="nav-dropdown-card flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream/85 hover:text-white hover:bg-sky/15 transition-all duration-150 group/item">'''

target4 = '''<!-- Product Catalogs -->
                <a href="https://mediqvision.com/mobile/index.html" target="_blank" rel="noopener noreferrer" class="nav-dropdown-card flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream/85 hover:text-white hover:bg-sky/15 transition-all duration-150 group/item">'''
repl4 = '''<!-- Product Catalogs -->
                <a href="#products" data-product-slide="4" class="nav-dropdown-card flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream/85 hover:text-white hover:bg-sky/15 transition-all duration-150 group/item">'''

for t, r in [(target1, repl1), (target2, repl2), (target3, repl3), (target4, repl4)]:
    if t in text:
        text = text.replace(t, r)
        print("Replaced target successfully!")
    else:
        # Try normalizing whitespace
        print("Target not found directly, checking...")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

