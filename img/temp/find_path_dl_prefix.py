ROWS = 7
COLS = 7
START = (0, COLS // 2)
TEXT = "ynpvafxn anmjn qmvxn".replace(" ", "")
# +1 because the first tile is boar start tile
TARGET_STEPS = len(TEXT)

DIRS = {
    "U": (-1, 0),
    "D": (1, 0),
    "L": (0, -1),
    "R": (0, 1),
}

PREFIX = ["D", "L"]
best_steps = None
best_path = None


def apply_step(pos, step):
    dr, dc = DIRS[step]
    return (pos[0] + dr, pos[1] + dc)


def in_bounds(pos):
    return 0 <= pos[0] < ROWS and 0 <= pos[1] < COLS


def dfs(path, steps):
    global best_steps, best_path

    if len(steps) == TARGET_STEPS:
        best_steps = steps[:]
        best_path = path[:]
        return True

    last = path[-1]
    # Simple preference: continue exploring vertically then horizontally
    for step in ["D", "L", "U", "R"]:
        nxt = apply_step(last, step)
        if not in_bounds(nxt):
            continue
        if nxt in path:
            continue

        path.append(nxt)
        steps.append(step)
        if dfs(path, steps):
            return True
        steps.pop()
        path.pop()

    return False


path = [START]
steps = []
for step in PREFIX:
    nxt = apply_step(path[-1], step)
    if not in_bounds(nxt):
        raise SystemExit("Prefix goes out of bounds")
    path.append(nxt)
    steps.append(step)

if not dfs(path, steps):
    raise SystemExit("No path found")

print("STEPS:", ",".join(best_steps))
print("PATH:", best_path)
print("STEP_COUNT:", len(best_steps))
