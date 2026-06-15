from collections import Counter

rows = cols = 9
start = (0, 4)
text = "ynpvafxn anmjn qmvxn".replace(" ", "")
N = len(text)
dirs = [("U", -1, 0), ("D", 1, 0), ("L", 0, -1), ("R", 0, 1)]

best = None


def dfs(path, used_dirs):
    global best
    i = len(path)
    if i == N:
        if all(d in used_dirs for d in "UDLR"):
            best = (path[:], used_dirs.copy())
            return True
        return False

    r, c = path[-1]
    ordered = sorted(dirs, key=lambda t: (t[0] in used_dirs,))
    for label, dr, dc in ordered:
        nr, nc = r + dr, c + dc
        if not (0 <= nr < rows and 0 <= nc < cols):
            continue
        if (nr, nc) in path:
            continue

        missing = [d for d in "UDLR" if d not in (used_dirs | {label})]
        rem = N - (i + 1)
        if len(missing) > rem:
            continue

        path.append((nr, nc))
        if dfs(path, used_dirs | {label}):
            return True
        path.pop()
    return False


path = [start]
if not dfs(path, set()):
    raise SystemExit("no path")

path, _ = best
steps = []
for (r1, c1), (r2, c2) in zip(path, path[1:]):
    if r2 == r1 - 1:
        steps.append("U")
    elif r2 == r1 + 1:
        steps.append("D")
    elif c2 == c1 - 1:
        steps.append("L")
    elif c2 == c1 + 1:
        steps.append("R")

print("TEXT", text)
print("PATH", path)
print("STEPS", "".join(steps))
print("COUNTS", dict(Counter(steps)))
