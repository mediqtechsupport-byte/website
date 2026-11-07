with open(r'scratch/zandrellez_portfolio/src/components/ui/services.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('isDesktop &&')
if idx != -1:
    print(text[idx:idx+1500])

