with open("assets/js/main.js", "r", encoding="utf-8") as f:
    text = f.read()

old_calc = 'const targetNextTop = 90 + nextIdx * 20;'
new_calc = 'const targetNextTop = 155 + nextIdx * 15;'

if old_calc in text:
    text = text.replace(old_calc, new_calc)
    with open("assets/js/main.js", "w", encoding="utf-8") as f:
        f.write(text)
    print("Updated main.js targetNextTop.")
else:
    print("old_calc not found, checking...")

