with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'authentic_emv' in line or 'iol_emv' in line or 'emv_stage' in line or 'RayOne EMV' in line:
        print(f"Line {i+1}: {line.strip()[:140]}")

