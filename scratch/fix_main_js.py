with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('inner.style.transform = scale();', 'inner.style.transform = "scale(" + targetScale.toFixed(3) + ")";')
text = text.replace('inner.style.filter =  rightness();', 'inner.style.filter = "brightness(" + targetBrightness.toFixed(2) + ")";')

with open('assets/js/main.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated lines in main.js")
