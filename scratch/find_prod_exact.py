with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

prod_start = text.find('<section id="products"')
prod_end = text.find('</section>', prod_start) + len('</section>')

print(f"Products section spans from {prod_start} to {prod_end}")
print("Section begins with:\n", text[prod_start:prod_start+200])
print("Section ends with:\n", text[prod_end-200:prod_end])

