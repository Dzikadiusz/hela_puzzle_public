"""
Extract per-state GIFs for all 4 directions from ezgif.com-crop.gif.

States:
  idle   (4 frames):  0-3
  walk   (6 frames):  8-13
  run    (6 frames): 24-29
    death  (5 frames): 45,46,48,49,50

Output files:
  boar_<direction>_<state>.gif
Example:
  boar_down_walk.gif
"""

from PIL import Image
import os

SRC = os.path.join(os.path.dirname(__file__), "ezgif.com-crop.gif")
OUT_DIR = os.path.join(os.path.dirname(__file__), "..")  # hela-puzzle-web/img/

BG = (157, 157, 157, 255)
TRANSPARENT = (0, 0, 0, 0)
TRANSPARENCY_INDEX = 255

# Shadow-anchored crop setup
HALF_W = 80
ABOVE = 130
BELOW = 10
OUT_W = HALF_W * 2      # 160
OUT_H = ABOVE + BELOW   # 140

# Shadow anchor points from frame analysis
DIRECTIONS = {
    "up":    {"shadow_cx": 300, "shadow_bottom": 114},
    "down":  {"shadow_cx": 300, "shadow_bottom": 270},
    "left":  {"shadow_cx": 184, "shadow_bottom": 192},
    "right": {"shadow_cx": 415, "shadow_bottom": 192},
}

STATES = {
    "idle":   list(range(0, 4)),
    "walk":   list(range(8, 14)),
    "run":    list(range(24, 30)),
    # Frame 47 duplicates frame 46 in source, so we skip it.
    "death":  [45, 46, 48, 49, 50],
}

# Only these directions had visible edge leftovers in source crops.
CLEAN_DIRECTIONS = {"down", "left", "right"}


def cleanup_border_artifacts(frame_rgba):
    """Remove small non-background components that touch frame edges."""
    w, h = frame_rgba.size
    pixels = frame_rgba.load()
    visited = [[False] * w for _ in range(h)]

    max_component_area = 220
    max_component_y = 56
    corner_band = 20
    corner_max_y = 60

    for y in range(h):
        for x in range(w):
            if visited[y][x]:
                continue

            if pixels[x, y] == BG:
                visited[y][x] = True
                continue

            # BFS connected component
            stack = [(x, y)]
            component = []
            touches_edge = False
            comp_max_y = y

            while stack:
                cx, cy = stack.pop()
                if cx < 0 or cy < 0 or cx >= w or cy >= h:
                    continue
                if visited[cy][cx]:
                    continue
                visited[cy][cx] = True
                if pixels[cx, cy] == BG:
                    continue

                component.append((cx, cy))
                if cy > comp_max_y:
                    comp_max_y = cy
                if cx == 0 or cy == 0 or cx == w - 1 or cy == h - 1:
                    touches_edge = True

                stack.append((cx + 1, cy))
                stack.append((cx - 1, cy))
                stack.append((cx, cy + 1))
                stack.append((cx, cy - 1))
                stack.append((cx + 1, cy + 1))
                stack.append((cx - 1, cy - 1))
                stack.append((cx + 1, cy - 1))
                stack.append((cx - 1, cy + 1))

            if not component:
                continue

            # Remove tiny edge components near the top edge area.
            remove_component = (
                touches_edge
                and len(component) <= max_component_area
                and comp_max_y <= max_component_y
            )

            # Also remove larger remnants that appear in top-left/top-right corners.
            if not remove_component and touches_edge and comp_max_y <= corner_max_y:
                comp_min_x = min(pos[0] for pos in component)
                comp_max_x = max(pos[0] for pos in component)
                near_left_corner = comp_max_x <= corner_band
                near_right_corner = comp_min_x >= (w - 1 - corner_band)
                remove_component = near_left_corner or near_right_corner

            if remove_component:
                for px, py in component:
                    pixels[px, py] = BG

    return frame_rgba


def strip_background_to_alpha(frame_rgba):
    """Turn the flat grey source background into transparency."""
    cleaned = frame_rgba.copy()
    pixels = cleaned.load()
    width, height = cleaned.size

    for y in range(height):
        for x in range(width):
            if pixels[x, y] == BG:
                pixels[x, y] = TRANSPARENT

    return cleaned


def rgba_to_transparent_gif_frame(frame_rgba):
    """Convert an RGBA frame into a paletted GIF frame with transparency preserved."""
    alpha = frame_rgba.getchannel("A")
    base = frame_rgba.convert("RGB").convert("P", palette=Image.ADAPTIVE, colors=255)
    mask = Image.eval(alpha, lambda value: 255 if value <= 0 else 0)
    base.paste(TRANSPARENCY_INDEX, mask)
    base.info["transparency"] = TRANSPARENCY_INDEX
    base.info["disposal"] = 2
    return base

src = Image.open(SRC)

def build_direction_frames(direction_cfg):
    """Build all 51 cropped frames for one direction."""
    cx = direction_cfg["shadow_cx"]
    sy = direction_cfg["shadow_bottom"]

    src_x0 = cx - HALF_W
    src_y0 = sy - ABOVE
    src_x1 = cx + HALF_W
    src_y1 = sy + BELOW

    dst_x0 = max(0, -src_x0)
    dst_y0 = max(0, -src_y0)

    clamp_x0 = max(0, src_x0)
    clamp_y0 = max(0, src_y0)
    clamp_x1 = min(src.size[0], src_x1)
    clamp_y1 = min(src.size[1] - 1, src_y1)  # Skip bottom white marker row.

    all_frames = []

    for frame_idx in range(src.n_frames):
        src.seek(frame_idx)
        frame_rgba = src.convert("RGBA")

        canvas = Image.new("RGBA", (OUT_W, OUT_H), TRANSPARENT)
        region = frame_rgba.crop((clamp_x0, clamp_y0, clamp_x1, clamp_y1))
        canvas.paste(region, (dst_x0, dst_y0))

        all_frames.append(canvas)

    return all_frames

for direction_name, direction_cfg in DIRECTIONS.items():
    all_dir_frames = build_direction_frames(direction_cfg)

    for state_name, indices in STATES.items():
        state_frames_rgba = [all_dir_frames[i].copy() for i in indices]
        if direction_name in CLEAN_DIRECTIONS:
            state_frames_rgba = [cleanup_border_artifacts(frame) for frame in state_frames_rgba]
        state_frames_rgba = [strip_background_to_alpha(frame) for frame in state_frames_rgba]
        state_frames_gif = [
            rgba_to_transparent_gif_frame(fr)
            for fr in state_frames_rgba
        ]

        out_path = os.path.join(OUT_DIR, f"boar_{direction_name}_{state_name}.gif")
        state_frames_gif[0].save(
            out_path,
            save_all=True,
            append_images=state_frames_gif[1:],
            loop=0,
            duration=120,
            transparency=TRANSPARENCY_INDEX,
            optimize=False,
            disposal=2,
        )

        print(f"Saved {os.path.basename(out_path):22s}  frames={len(indices)}")

print("Done.")
