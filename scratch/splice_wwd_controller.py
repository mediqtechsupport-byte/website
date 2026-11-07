from pathlib import Path

js_path = Path("assets/js/main.js")
src = js_path.read_bytes().decode("utf-8")
new_block = Path("scratch/wwd_light_controller.js").read_text(encoding="utf-8").replace("\r\n", "\n").replace("\n", "\r\n")

start_marker = "/* WHAT WE DO — FEATURED STAGE"
end_marker = "/* MULTI-SECTION DECK CONTROLLER"
s = src.index(start_marker)
s = src.rindex("/* ====", 0, s)  # include the separator line above the title
e = src.index(end_marker)
e = src.rindex("/* ====", 0, e)
js_path.write_bytes((src[:s] + new_block + src[e:]).encode("utf-8"))
print("main.js What We Do controller replaced")

