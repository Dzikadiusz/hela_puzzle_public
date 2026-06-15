"""
Extract 4 directional walk GIFs from ezgif.com-crop.gif
Uses the bottom grey shadow as the anchor point for consistent alignment.

Shadow measurements (frame 0):
  TOP    : shadow center_x=300, shadow bottom y=114  → back view (walking up)
  BOTTOM : shadow center_x=300, shadow bottom y=270  → front view (walking down)
  LEFT   : shadow center_x=184, shadow bottom y=192  → side view (walking left)
  RIGHT  : shadow center_x=415, shadow bottom y=192  → side view (walking right)

Output: 160×140 px GIFs, all aligned so shadow bottom sits at y=130 (10 px margin below).
"""

from PIL import Image, ImageSequence
import os

SRC = os.path.join(os.path.dirname(__file__), "ezgif.com-crop.gif")
OUT_DIR = os.path.join(os.path.dirname(__file__), "..")  # hela-puzzle-web/img/

BG = (157, 157, 157, 255)

# Crop box: (shadow_cx - half_w, shadow_bottom - above_px, shadow_cx + half_w, shadow_bottom + below_px)
HALF_W   = 80   # 160 px wide total
ABOVE    = 130  # 130 px above shadow bottom
BELOW    = 10   # 10 px below shadow bottom
OUT_W    = HALF_W * 2        # 160
OUT_H    = ABOVE + BELOW     # 140

directions = {
    "walk_up":    {"shadow_cx": 300, "shadow_bottom": 114},  # back view
    "walk_down":  {"shadow_cx": 300, "shadow_bottom": 270},  # front view
    "walk_left":  {"shadow_cx": 184, "shadow_bottom": 192},  # left side
    "walk_right": {"shadow_cx": 415, "shadow_bottom": 192},  # right side
}

src = Image.open(SRC)

for name, cfg in directions.items():
    cx   = cfg["shadow_cx"]
    sy   = cfg["shadow_bottom"]

    # Source crop box (may extend outside source image bounds)
    src_x0 = cx - HALF_W
    src_y0 = sy - ABOVE
    src_x1 = cx + HALF_W
    src_y1 = sy + BELOW

    # Offsets into the output canvas if source box is out of bounds
    dst_x0 = max(0, -src_x0)
    dst_y0 = max(0, -src_y0)

    # Clamped source region
    clamp_x0 = max(0, src_x0)
    clamp_y0 = max(0, src_y0)
    clamp_x1 = min(src.size[0], src_x1)
    clamp_y1 = min(src.size[1] - 1, src_y1)  # -1 to skip white marker row

    frames = []
    durations = []

    for frame_idx in range(src.n_frames):
        src.seek(frame_idx)
        frame_rgba = src.convert("RGBA")

        # Create output canvas filled with background colour
        canvas = Image.new("RGBA", (OUT_W, OUT_H), BG)

        # Paste the clamped source region at the correct offset
        region = frame_rgba.crop((clamp_x0, clamp_y0, clamp_x1, clamp_y1))
        canvas.paste(region, (dst_x0, dst_y0))

        # Convert to P mode (palette) for GIF output
        frames.append(canvas.convert("P", palette=Image.ADAPTIVE, dither=Image.Dither.NONE))

        try:
            durations.append(src.info.get("duration", 100))
        except Exception:
            durations.append(100)

    # Save as GIF
    out_path = os.path.join(OUT_DIR, f"{name}.gif")
    frames[0].save(
        out_path,
        save_all=True,
        append_images=frames[1:],
        loop=0,
        duration=durations,
        optimize=False,
    )
    print(f"Saved {out_path}  ({len(frames)} frames, {OUT_W}x{OUT_H}px)")

print("Done.")
