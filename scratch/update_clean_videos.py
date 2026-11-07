import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Let's replace the video sources in Slide 2:
# Replace eye-city-reflection.mp4 and eye-iris-macro.mp4 with about-rayner.mp4#t=...

replacements = [
    # Card 1: Strategic Importation & Distribution
    (
        '<video src="assets/video/about-rayner.mp4"',
        '<video src="assets/video/about-rayner.mp4#t=25"'
    ),
    # Card 2: Product Marketing & Brand Development
    (
        '<video src="assets/video/eye-city-reflection.mp4" autoplay loop muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>\n                    <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/80 via-transparent to-black/20 pointer-events-none"></div>\n                    <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">\n                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#071530]/85 border border-sky/30 backdrop-blur-md">\n                        <span class="size-1.5 rounded-full bg-sky animate-pulse"></span>\n                        <span class="font-medium tracking-wide">Brand &amp; Medical Communication</span>\n                      </span>\n                      <span class="text-sky font-mono font-semibold">Product Awareness</span>\n                    </div>',
        '<video src="assets/video/about-rayner.mp4#t=4" autoplay loop muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>\n                    <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/80 via-transparent to-black/20 pointer-events-none"></div>\n                    <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">\n                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#071530]/85 border border-sky/30 backdrop-blur-md">\n                        <span class="size-1.5 rounded-full bg-sky animate-pulse"></span>\n                        <span class="font-medium tracking-wide">Rayner Global Headquarters &amp; Brand Innovation</span>\n                      </span>\n                      <span class="text-sky font-mono font-semibold">Product Awareness</span>\n                    </div>'
    ),
    # Card 3: Sales, Promotion & Commercialization
    (
        '<video src="assets/video/about-rayner.mp4"',
        '<video src="assets/video/about-rayner.mp4#t=112"'
    ),
    # Card 4: Market Development
    (
        '<video src="assets/video/eye-city-reflection.mp4" autoplay loop muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>\n                    <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/80 via-transparent to-black/20 pointer-events-none"></div>\n                    <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">\n                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#071530]/85 border border-sky/30 backdrop-blur-md">\n                        <span class="size-1.5 rounded-full bg-sky animate-pulse"></span>\n                        <span class="font-medium tracking-wide">Market Insight &amp; Healthcare Connectivity</span>\n                      </span>\n                      <span class="text-sky font-mono font-semibold">New Account Growth</span>\n                    </div>',
        '<video src="assets/video/about-rayner.mp4#t=145" autoplay loop muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>\n                    <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/80 via-transparent to-black/20 pointer-events-none"></div>\n                    <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">\n                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#071530]/85 border border-sky/30 backdrop-blur-md">\n                        <span class="size-1.5 rounded-full bg-sky animate-pulse"></span>\n                        <span class="font-medium tracking-wide">Global Healthcare Network &amp; Expansion</span>\n                      </span>\n                      <span class="text-sky font-mono font-semibold">New Account Growth</span>\n                    </div>'
    ),
    # Card 5: Professional Education
    (
        '<video src="assets/video/eye-iris-macro.mp4" autoplay loop muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>\n                    <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/80 via-transparent to-black/20 pointer-events-none"></div>\n                    <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">\n                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#071530]/85 border border-sky/30 backdrop-blur-md">\n                        <span class="size-1.5 rounded-full bg-[#72c5f8] animate-pulse"></span>\n                        <span class="font-medium tracking-wide">Macro Iris &amp; Surgical Precision</span>\n                      </span>\n                      <span class="text-sky font-mono font-semibold">Technical Engagement</span>\n                    </div>',
        '<video src="assets/video/about-rayner.mp4#t=88" autoplay loop muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"></video>\n                    <div class="absolute inset-0 bg-gradient-to-t from-[#071530]/80 via-transparent to-black/20 pointer-events-none"></div>\n                    <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">\n                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#071530]/85 border border-sky/30 backdrop-blur-md">\n                        <span class="size-1.5 rounded-full bg-[#72c5f8] animate-pulse"></span>\n                        <span class="font-medium tracking-wide">Surgeon Demonstrations &amp; Clinical Training</span>\n                      </span>\n                      <span class="text-sky font-mono font-semibold">Technical Engagement</span>\n                    </div>'
    ),
    # Card 6: Quality & Customer Support
    (
        '<video src="assets/video/about-rayner.mp4"',
        '<video src="assets/video/about-rayner.mp4#t=58"'
    )
]

print("Applying clean watermark-free video updates...")

