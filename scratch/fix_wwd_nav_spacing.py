from pathlib import Path

p = Path("scratch/apply_wwd_light_exact.py")
s = p.read_text(encoding="utf-8")
reps = [
    ("px-4 sm:px-6 lg:px-10 pt-2.5 pb-4", "px-4 sm:px-6 lg:px-10 pt-6 pb-4"),
    ('<div class="flex items-center justify-between gap-3 mb-1.5 shrink-0">',
     '<div class="flex items-center justify-between gap-3 mb-3 shrink-0">'),
    ("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold",
     "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold"),
]
for a, b in reps:
    if a not in s:
        raise SystemExit("missing: " + a)
    s = s.replace(a, b)
p.write_text(s, encoding="utf-8")
print("patched")

