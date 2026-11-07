with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update navbar dropdown for products
old_nav_block = '''            <div class="pointer-events-none absolute left-0 top-full pt-2 opacity-0 -translate-y-2 transition-all duration-200 ease-out group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 z-50">
              <div class="transparent-blue-dropdown w-64 rounded-2xl ring-1 ring-white/10 p-2 space-y-0.5">
                <!-- Intraocular Lenses -->
                <a href="#products" class="nav-dropdown-card flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream/85 hover:text-white hover:bg-sky/15 transition-all duration-150 group/item">
                  <span class="flex size-7 shrink-0 items-center justify-center text-sky group-hover/item:text-[#72c5f8] transition-colors">
                    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  </span>
                  <span class="text-[13px] font-medium tracking-wide text-pearl group-hover/item:text-white transition-colors">Intraocular Lenses</span>
                  <svg class="size-3.5 ml-auto text-sky/60 opacity-0 -translate-x-1 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3l5 5-5 5"/></svg>
                </a>
                <!-- Medical Supplies -->
                <a href="#products" class="nav-dropdown-card flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream/85 hover:text-white hover:bg-sky/15 transition-all duration-150 group/item">
                  <span class="flex size-7 shrink-0 items-center justify-center text-sky group-hover/item:text-[#72c5f8] transition-colors">
                    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="6" rx="2"/><path d="M10 6V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"/><line x1="12" x2="12" y1="11" y2="17"/><line x1="9" x2="15" y1="14" y2="14"/></svg>
                  </span>
                  <span class="text-[13px] font-medium tracking-wide text-pearl group-hover/item:text-white transition-colors">Medical Supplies</span>
                  <svg class="size-3.5 ml-auto text-sky/60 opacity-0 -translate-x-1 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3l5 5-5 5"/></svg>
                </a>
                <!-- Devices & Equipment -->
                <a href="#galaxy-delivery" class="nav-dropdown-card flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream/85 hover:text-white hover:bg-sky/15 transition-all duration-150 group/item">
                  <span class="flex size-7 shrink-0 items-center justify-center text-sky group-hover/item:text-[#72c5f8] transition-colors">
                    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="3" rx="2"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="m6 10 2.5-3 3 6 2-3 2.5 2 2-2"/></svg>
                  </span>
                  <span class="text-[13px] font-medium tracking-wide text-pearl group-hover/item:text-white transition-colors">Devices &amp; Equipment</span>
                  <svg class="size-3.5 ml-auto text-sky/60 opacity-0 -translate-x-1 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3l5 5-5 5"/></svg>
                </a>
                <!-- Product Catalogs -->
                <a href="https://mediqvision.com/mobile/index.html" target="_blank" rel="noopener noreferrer" class="nav-dropdown-card flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream/85 hover:text-white hover:bg-sky/15 transition-all duration-150 group/item">
                  <span class="flex size-7 shrink-0 items-center justify-center text-sky group-hover/item:text-[#72c5f8] transition-colors">
                    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
                  </span>
                  <span class="text-[13px] font-medium tracking-wide text-pearl group-hover/item:text-white transition-colors">Product Catalogs</span>
                  <svg class="size-3.5 ml-auto text-sky/60 opacity-0 -translate-x-1 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3l5 5-5 5"/></svg>
                </a>
              </div>
            </div>'''

new_nav_block = '''            <div class="pointer-events-none absolute left-0 top-full pt-2 opacity-0 -translate-y-2 transition-all duration-200 ease-out group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 z-50">
              <div class="transparent-blue-dropdown w-64 rounded-2xl ring-1 ring-white/10 p-2 space-y-0.5">
                <!-- Intraocular Lenses -->
                <a href="#products" data-product-slide="1" class="nav-dropdown-card flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream/85 hover:text-white hover:bg-sky/15 transition-all duration-150 group/item">
                  <span class="flex size-7 shrink-0 items-center justify-center text-sky group-hover/item:text-[#72c5f8] transition-colors">
                    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  </span>
                  <span class="text-[13px] font-medium tracking-wide text-pearl group-hover/item:text-white transition-colors">Intraocular Lenses</span>
                  <svg class="size-3.5 ml-auto text-sky/60 opacity-0 -translate-x-1 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3l5 5-5 5"/></svg>
                </a>
                <!-- Medical Supplies -->
                <a href="#products" data-product-slide="2" class="nav-dropdown-card flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream/85 hover:text-white hover:bg-sky/15 transition-all duration-150 group/item">
                  <span class="flex size-7 shrink-0 items-center justify-center text-sky group-hover/item:text-[#72c5f8] transition-colors">
                    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="6" rx="2"/><path d="M10 6V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"/><line x1="12" x2="12" y1="11" y2="17"/><line x1="9" x2="15" y1="14" y2="14"/></svg>
                  </span>
                  <span class="text-[13px] font-medium tracking-wide text-pearl group-hover/item:text-white transition-colors">Medical Supplies</span>
                  <svg class="size-3.5 ml-auto text-sky/60 opacity-0 -translate-x-1 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3l5 5-5 5"/></svg>
                </a>
                <!-- Devices & Equipment -->
                <a href="#products" data-product-slide="3" class="nav-dropdown-card flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream/85 hover:text-white hover:bg-sky/15 transition-all duration-150 group/item">
                  <span class="flex size-7 shrink-0 items-center justify-center text-sky group-hover/item:text-[#72c5f8] transition-colors">
                    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="3" rx="2"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="m6 10 2.5-3 3 6 2-3 2.5 2 2-2"/></svg>
                  </span>
                  <span class="text-[13px] font-medium tracking-wide text-pearl group-hover/item:text-white transition-colors">Devices &amp; Equipment</span>
                  <svg class="size-3.5 ml-auto text-sky/60 opacity-0 -translate-x-1 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3l5 5-5 5"/></svg>
                </a>
                <!-- Product Catalogs -->
                <a href="#products" data-product-slide="4" class="nav-dropdown-card flex items-center gap-3 px-3 py-2.5 rounded-xl text-cream/85 hover:text-white hover:bg-sky/15 transition-all duration-150 group/item">
                  <span class="flex size-7 shrink-0 items-center justify-center text-sky group-hover/item:text-[#72c5f8] transition-colors">
                    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
                  </span>
                  <span class="text-[13px] font-medium tracking-wide text-pearl group-hover/item:text-white transition-colors">Product Catalogs</span>
                  <svg class="size-3.5 ml-auto text-sky/60 opacity-0 -translate-x-1 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3l5 5-5 5"/></svg>
                </a>
              </div>
            </div>'''

if old_nav_block in content:
    content = content.replace(old_nav_block, new_nav_block)
    print("Updated navbar dropdown links with data-product-slide!")
else:
    print("Could not find exact old_nav_block, inspecting...")

# 2. Replace section #products
with open('scratch/new_products_deck.html', 'r', encoding='utf-8') as f:
    new_products_html = f.read().strip()

prod_start = content.find('<section id="products"')
prod_end = content.find('</section>', prod_start) + len('</section>')

if prod_start == -1:
    print("Error: Could not find <section id=\"products\"")
    import sys
    sys.exit(1)

content = content[:prod_start] + new_products_html + content[prod_end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Applied new products deck to index.html successfully!")

