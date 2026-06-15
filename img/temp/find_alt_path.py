from collections import Counter

ROWS = 9
COLS = 9
START = (0, COLS // 2)
TEXT = "ynpvafxn anmjn qmvxn".replace(" ", "")
TARGET_STEPS = len(TEXT) - 1

DIRS = [
    ("U", -1, 0),
    ("D", 1, 0),
    ("L", 0, -1),
    ("R", 0, 1),
]

best_path = None
best_steps = None


def dfs(path, steps, used_dirs, prev_dir):
    global best_path, best_steps

    if len(steps) == TARGET_STEPS:
        # Keep all four directions represented.
        if all(d in used_dirs for d in "UDLR"):
            best_path = path[:]
            best_steps = steps[:]
            return True
        return False

    r, c = path[-1]

    # Prefer directions not used yet for easier satisfaction.
    ordered = sorted(DIRS, key=lambda entry: (entry[0] in used_dirs,))

    for label, dr, dc in ordered:
        # Must change direction every move.
        if prev_dir is not None and label == prev_dir:
            continue

        nr, nc = r + dr, c + dc
        if nr < 0 or nr >= ROWS or nc < 0 or nc >= COLS:
            continue

        # Keep path simple: no revisiting cells.
        if (nr, nc) in path:
            continue

        # Prune if remaining moves cannot cover missing directions.
        next_used = used_dirs | {label}
        missing = [d for d in "UDLR" if d not in next_used]
        remaining_moves = TARGET_STEPS - (len(steps) + 1)
        if len(missing) > remaining_moves:
            continue

        path.append((nr, nc))
        steps.append(label)

        if dfs(path, steps, next_used, label):
            return True

        steps.pop()
        path.pop()

    return False

initial_path = [START]
initial_steps = []
found = dfs(initial_path, initial_steps, set(), None)

if not found:
    raise SystemExit("No valid path found")

print("TEXT:", TEXT)
print("PATH:", best_path)
print("STEPS:", "".join(best_steps))
print("COUNTS:", dict(Counter(best_steps)))
