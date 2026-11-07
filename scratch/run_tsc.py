import subprocess

res = subprocess.run(['npx', 'tsc', '--noEmit'], capture_output=True, text=True, shell=True)
print("STDOUT:")
print(res.stdout[:2000])
print("STDERR:")
print(res.stderr[:2000])

