with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '<section id="about"'
end_marker = '<section id="products"'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print(f"Error finding markers: start={start_idx}, end={end_idx}")
    import sys
    sys.exit(1)

with open('scratch/built_orig_about.html', 'r', encoding='utf-8') as f:
    new_about = f.read().strip()

new_content = content[:start_idx] + new_about + "\n\n    " + content[end_idx:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully replaced #about in index.html! Old size: {len(content)}, New size: {len(new_content)}")

