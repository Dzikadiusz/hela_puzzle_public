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
best_cost = None


def orth_neighbors(r, c):
    for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        nr, nc = r + dr, c + dc
        if 0 <= nr < ROWS and 0 <= nc < COLS:
            yield (nr, nc)


def adjacency_cost(new_pos, visited_set, prev_pos):
    # Count side-neighbors among visited tiles, excluding the tile we just left.
    cost = 0
    for n in orth_neighbors(new_pos[0], new_pos[1]):
        if n in visited_set and n != prev_pos:
            cost += 1
    return cost


def dfs(path, steps, used_dirs, total_cost):
    global best_path, best_steps, best_cost

    depth = len(steps)
    if depth == TARGET_STEPS:
        if all(d in used_dirs for d in "UDLR"):
            if best_cost is None or total_cost < best_cost:
                best_cost = total_cost
                best_path = path[:]
                best_steps = steps[:]
        return

    if best_cost is not None and total_cost > best_cost:
        return

    r, c = path[-1]
    visited = set(path)

    candidates = []
    for label, dr, dc in DIRS:
        nr, nc = r + dr, c + dc
        if nr < 0 or nr >= ROWS or nc < 0 or nc >= COLS:
            continue
        if (nr, nc) in visited:
            continue

        next_used = used_dirs | {label}
        remaining = TARGET_STEPS - (depth + 1)
        missing = [d for d in "UDLR" if d not in next_used]
        if len(missing) > remaining:
            continue

        move_cost = adjacency_cost((nr, nc), visited, (r, c))
        candidates.append((move_cost, label, nr, nc))

    # Prefer lower adjacency cost first.
    candidates.sort(key=lambda item: item[0])

    for move_cost, label, nr, nc in candidates:
        path.append((nr, nc))
        steps.append(label)
        dfs(path, steps, used_dirs | {label}, total_cost + move_cost)
        steps.pop()
        path.pop()


dfs([START], [], set(), 0)

if best_path is None:
    raise SystemExit("No valid path found")

print("TEXT:", TEXT)
print("PATH:", best_path)
print("STEPS:", "".join(best_steps))
print("COUNTS:", dict(Counter(best_steps)))
print("ADJACENCY_COST:", best_cost)
