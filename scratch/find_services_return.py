with open(r'scratch/zandrellez_portfolio/src/components/ui/services.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('return (')
while idx != -1:
    print(text[idx:idx+400])
    print("="*40)
    idx = text.find('return (', idx+400)

