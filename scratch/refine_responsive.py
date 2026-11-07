with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Make sure stage and cards have optimal responsive heights
# Stage:
text = text.replace(
    'class="relative z-20 w-full max-w-5xl mx-auto flex-1 min-h-[370px] sm:min-h-[410px] max-h-[450px] my-auto flex items-center justify-center"',
    'class="relative z-20 w-full max-w-5xl mx-auto flex-1 min-h-[420px] sm:min-h-[440px] max-h-[500px] lg:max-h-[450px] my-auto flex items-center justify-center"'
)

# Card padding:
text = text.replace(
    'p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]',
    'p-5 sm:p-7 lg:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]'
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Optimized responsive classes in index.html")

