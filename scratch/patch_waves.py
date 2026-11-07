with open('assets/js/main.js', 'rb') as f:
    b = f.read()

prefix = b"const wavesShaderCanvas = document.getElementById('hero-waves-shader-canvas');\r\n  if (wavesShaderCanvas) {"
idx1 = b.find(prefix)

end_marker = b"gl.drawArrays(gl.TRIANGLES, 0, 3);\r\n      };\r\n      requestAnimationFrame(renderSilkShader);\r\n    }\r\n  }"
idx2 = b.find(end_marker, idx1)

if idx1 == -1 or idx2 == -1:
    print(f"Error markers: {idx1}, {idx2}")
    exit(1)

inner_code = b[idx1 + len(prefix) : idx2 + len(b"gl.drawArrays(gl.TRIANGLES, 0, 3);\r\n      };\r\n      requestAnimationFrame(renderSilkShader);\r\n    }")]

new_block = b"""function initSilkWavesShader(canvasId) {
    const wavesShaderCanvas = document.getElementById(canvasId);
    if (!wavesShaderCanvas || wavesShaderCanvas._wavesActive) return;
    wavesShaderCanvas._wavesActive = true;
""" + inner_code + b"""
  }
  initSilkWavesShader('hero-waves-shader-canvas');
  initSilkWavesShader('about-waves-shader-canvas');"""

new_b = b[:idx1] + new_block + b[idx2 + len(end_marker):]

with open('assets/js/main.js', 'wb') as f:
    f.write(new_b)

print("SUCCESS: Wrapped silk waves shader to support both hero and about canvases!")

