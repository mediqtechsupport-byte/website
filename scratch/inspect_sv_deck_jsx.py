with open(r'scratch/zandrellez_portfolio/src/components/ui/services.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Find the Desktop View or stage markup
idx = text.find('className="sv-deck"')
if idx != -1:
    print(text[idx-200:idx+2500])
else:
    idx2 = text.find('className="sv-')
    print(text[idx2:idx2+2500])

