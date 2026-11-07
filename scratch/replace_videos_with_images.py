with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Replace each video container with image container in Slide 2

replacements = [
    # Card 1
    (
        '<video src="assets/video/about-rayner.mp4#t=25" autoplay loop muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>',
        '<img src="assets/img/pillars/p1_cleanroom_inspect.jpg" alt="Strategic Importation &amp; Distribution - Cleanroom Cold-Chain Packaging" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none" loading="lazy">'
    ),
    # Card 2
    (
        '<video src="assets/video/about-rayner.mp4#t=4" autoplay loop muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>',
        '<img src="assets/img/pillars/p2_headquarters_brand.jpg" alt="Product Marketing &amp; Brand Development - Rayner Global Headquarters" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none" loading="lazy">'
    ),
    # Card 3
    (
        '<video src="assets/video/about-rayner.mp4#t=112" autoplay loop muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>',
        '<img src="assets/img/pillars/p3_commercial_meeting.jpg" alt="Sales, Promotion &amp; Commercialization - Hospital &amp; Commercial Presentations" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none" loading="lazy">'
    ),
    # Card 4
    (
        '<video src="assets/video/about-rayner.mp4#t=145" autoplay loop muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>',
        '<img src="assets/img/pillars/p4_customer_growth.jpg" alt="Market Development - Global Healthcare Network &amp; Expansion" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none" loading="lazy">'
    ),
    # Card 5
    (
        '<video src="assets/video/about-rayner.mp4#t=88" autoplay loop muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>',
        '<img src="assets/img/pillars/p5_microscope_education.jpg" alt="Professional Education - Surgeon Microscope Demonstrations &amp; Training" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none" loading="lazy">'
    ),
    # Card 6
    (
        '<video src="assets/video/about-rayner.mp4#t=58" autoplay loop muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>',
        '<img src="assets/img/pillars/p6_quality_metrology.jpg" alt="Quality &amp; Customer Support - Precision Optical Metrology &amp; ISO Standards" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none" loading="lazy">'
    ),
]

for old_tag, new_tag in replacements:
    if old_tag in content:
        content = content.replace(old_tag, new_tag, 1)
        print(f"Replaced video with image successfully: {new_tag[:60]}...")
    else:
        print(f"Warning: could not find old video tag: {old_tag[:50]}...")

# Also update the comment on the slide
content = content.replace(
    '<!-- SLIDE 3: WHAT WE DO (6 Stacking Cards - 100% Watermark-Free Footage)         -->',
    '<!-- SLIDE 3: WHAT WE DO (6 Stacking Cards with Authentic Contextual Images)      -->'
)

# Also update the column comments
content = content.replace('<!-- Video Column -->', '<!-- Image Column -->')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Saved index.html successfully.")

