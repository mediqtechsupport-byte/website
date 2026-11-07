with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Change Slide 2 background from bg-[#0a1d40] to bg-transparent
old_slide2 = '<div id="about-slide-what-we-do" class="about-slide absolute inset-0 w-full h-full block bg-[#0a1d40] text-cream'
new_slide2 = '<div id="about-slide-what-we-do" class="about-slide absolute inset-0 w-full h-full block bg-transparent text-cream'

if old_slide2 in content:
    content = content.replace(old_slide2, new_slide2)
    print("Updated Slide 2 to bg-transparent.")
else:
    print("Warning: old_slide2 not found!")

# Also update Slide 3 and Slide 4 so the smoke effect is continuous across all about slides
old_slide3 = '<div class="about-slide absolute inset-0 w-full h-full flex items-center bg-[#0a1d40] text-white'
new_slide3 = '<div class="about-slide absolute inset-0 w-full h-full flex items-center bg-transparent text-white'

if old_slide3 in content:
    content = content.replace(old_slide3, new_slide3)
    print("Updated Slide 3 to bg-transparent.")

old_slide4 = '<div class="about-slide absolute inset-0 w-full h-full flex flex-col justify-between bg-[#0a1d40] text-cream'
new_slide4 = '<div class="about-slide absolute inset-0 w-full h-full flex flex-col justify-between bg-transparent text-cream'

if old_slide4 in content:
    content = content.replace(old_slide4, new_slide4)
    print("Updated Slide 4 to bg-transparent.")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Saved index.html.")

