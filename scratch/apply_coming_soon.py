import os

with open('index.html', 'r', encoding='utf-8') as f:
    h = f.read()

# Load slide3_new and slide4_new from replace_slides_3_4.py namespace
scope = {}
with open('scratch/replace_slides_3_4.py', 'r', encoding='utf-8') as f:
    code = f.read()
    exec(code, scope)

slide3_new = scope['slide3_new']
slide4_new = scope['slide4_new']

idx3 = h.find('data-product-index="3"')
div3_start = h.rfind('<div', 0, idx3)

idx4 = h.find('data-product-index="4"')
sec_end = h.find('</section>', idx4)
slides_container_close = h.rfind('</div>', idx4, sec_end)
slide4_close = h.rfind('</div>', idx4, slides_container_close) + len('</div>')

new_content = slide3_new + '\n\n' + slide4_new

h_updated = h[:div3_start] + new_content + h[slide4_close:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(h_updated)

print("SUCCESS: index.html updated with Coming Soon sections for Slide 3 & Slide 4!")
