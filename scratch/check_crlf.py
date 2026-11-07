with open('index.html', 'rb') as f:
    b1 = f.read()
with open('components/hero-locked-backup.html', 'rb') as f:
    b2 = f.read()

s1 = b1.find(b'<section id="hero"')
e1 = b1.find(b'</section>', s1) + len(b'</section>')

s2 = b2.find(b'<section id="hero"')
e2 = b2.find(b'</section>', s2) + len(b'</section>')

slice1 = b1[s1:e1]
slice2 = b2[s2:e2]

print("slice1 len:", len(slice1), "slice2 len:", len(slice2))
print("CRLF in slice1:", slice1.count(b'\r\n'))
print("CRLF in slice2:", slice2.count(b'\r\n'))

