with open(r'scratch/zandrellez_portfolio/src/components/ui/services.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find where the service title, subtitle, paragraph and rows are rendered
idx = text.find('service.title')
if idx != -1:
    print(text[idx-200:idx+1500])

