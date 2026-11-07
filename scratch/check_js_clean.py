with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Check initAboutDeckController
print("Checking main.js...")
if "initAboutDeckController" in text:
    print("initAboutDeckController exists")
if "openAboutOverlay" in text:
    print("openAboutOverlay exists")
if "initModalStackingCards" in text:
    print("initModalStackingCards exists")

