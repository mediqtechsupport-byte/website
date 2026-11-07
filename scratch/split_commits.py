import subprocess

def run(cmd):
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if res.returncode != 0:
        print("CMD FAILED:", cmd, res.stderr)
    return res.stdout

# Reset commit history softly back to empty root while keeping all files on disk untouched!
run("git update-ref -d HEAD")
run("git rm -rf --cached .")

# Commit 1: All HTML, CSS, JS, TS, configs, components, and scripts (~4 MB)
c1_paths = [
    ".gitignore", ".vscode", "AGENTS.md", "index.html", "globals.css",
    "package.json", "package-lock.json", "tsconfig.json", "components.json",
    "components", "lib", "assets/js", "scratch"
]
for p in c1_paths:
    run(f'git add "{p}"')
run('git commit -m "Part 1: Core website HTML, JS, CSS, components, and scripts"')
run('git tag -f part1')

# Commit 2: Activities, brochures, 3D models, Rayner logos (~12 MB)
for p in ["assets/activities", "assets/brochure", "assets/models", "assets/rayner"]:
    run(f'git add "{p}"')
run('git commit -m "Part 2: 3D GLB models, brochures, and activity media"')
run('git tag -f part2')

# Commit 3: Main hero & pillar images (excluding packshots) (~25 MB)
run('git add assets/img')
run('git reset HEAD assets/img/packshots')
run('git commit -m "Part 3: Hero, iris, and clinical pillar imagery"')
run('git tag -f part3')

# Commit 4: Packshots (~45 MB)
run('git add assets/img/packshots')
run('git commit -m "Part 4: Authentic Rayner IOL, OVD, and AEON packshots"')
run('git tag -f part4')

# Commit 5: Videos & remaining root files (~40 MB)
run('git add .')
run('git commit -m "Part 5: Clinical videos and remaining assets"')
run('git tag -f part5')

print(run("git log --oneline"))
