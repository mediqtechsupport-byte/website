with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

old_header_tag = '<div class="sticky top-0 z-[70] bg-[#0a1d40]/95 backdrop-blur-xl pt-2 pb-4 mb-6 text-center max-w-3xl mx-auto rounded-b-2xl border-b border-sky/20 shadow-[0_10px_30px_rgba(10,29,64,0.8)]">'
new_header_tag = '<div class="sticky top-0 z-[70] pt-2 pb-4 mb-6 text-center max-w-3xl mx-auto">'

if old_header_tag in content:
    content = content.replace(old_header_tag, new_header_tag)
    print("Removed standalone background from header successfully.")
else:
    print("Error: old_header_tag not found!")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

