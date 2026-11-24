from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from math import sin, cos, pi
import random

# ==========================================
# FAHEEM // AI SKILL RADAR
# ==========================================

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "assets" / "animations" / "skill-radar.gif"

OUTPUT.parent.mkdir(parents=True, exist_ok=True)

WIDTH = 1200
HEIGHT = 650

FRAME_COUNT = 48
FRAME_DURATION = 80

BG = (8, 11, 22)
CYAN = (34, 211, 238)
PURPLE = (168, 85, 247)
WHITE = (240, 245, 255)
MUTED = (135, 151, 180)

CENTER = (600, 350)
RADIUS = 205

# ==========================================
# FONTS
# ==========================================

def font(size, bold=False):
    name = "arialbd.ttf" if bold else "arial.ttf"

    try:
        return ImageFont.truetype(name, size)
    except OSError:
        return ImageFont.load_default()


TITLE = font(34, True)
SUBTITLE = font(17)
LABEL = font(19, True)
SMALL = font(13)

# ==========================================
# SKILL AREAS
# ==========================================

skills = [
    "PYTHON DEVELOPMENT",
    "MACHINE LEARNING",
    "GENERATIVE AI",
    "DATA ANALYTICS",
    "BACKEND DEVELOPMENT",
    "API INTEGRATION"
]

angles = [
    -90,
    -30,
    30,
    90,
    150,
    210
]

nodes = []

for angle in angles:
    radians = angle * pi / 180

    x = CENTER[0] + cos(radians) * RADIUS
    y = CENTER[1] + sin(radians) * RADIUS

    nodes.append((int(x), int(y)))

# ==========================================
# PARTICLES
# ==========================================

random.seed(42)

particles = [
    (
        random.randint(20, WIDTH - 20),
        random.randint(20, HEIGHT - 20),
        random.randint(1, 3)
    )
    for _ in range(65)
]

# ==========================================
# DRAW BACKGROUND
# ==========================================

def draw_background(draw):

    draw.rectangle(
        (0, 0, WIDTH, HEIGHT),
        fill=BG
    )

    for x in range(0, WIDTH, 50):
        draw.line(
            (x, 0, x, HEIGHT),
            fill=(17, 24, 42)
        )

    for y in range(0, HEIGHT, 50):
        draw.line(
            (0, y, WIDTH, y),
            fill=(17, 24, 42)
        )


def draw_particles(draw, frame):

    for index, (x, y, size) in enumerate(particles):

        brightness = (
            sin(frame * 0.12 + index) + 1
        ) / 2

        color = (
            10,
            int(100 + brightness * 100),
            int(130 + brightness * 100)
        )

        draw.ellipse(
            (x, y, x + size, y + size),
            fill=color
        )


# ==========================================
# RADAR GRID
# ==========================================

def draw_radar_grid(draw):

    cx, cy = CENTER

    # Concentric rings
    for radius in [55, 105, 155, 205]:

        draw.ellipse(
            (
                cx - radius,
                cy - radius,
                cx + radius,
                cy + radius
            ),
            outline=(35, 66, 88),
            width=2
        )

    # Radar axes
    for x, y in nodes:

        draw.line(
            (cx, cy, x, y),
            fill=(35, 66, 88),
            width=2
        )


# ==========================================
# RADAR BEAM
# ==========================================

def draw_radar_beam(draw, frame):

    cx, cy = CENTER

    angle = frame * 2 * pi / FRAME_COUNT

    beam_x = cx + cos(angle) * RADIUS
    beam_y = cy + sin(angle) * RADIUS

    draw.line(
        (cx, cy, beam_x, beam_y),
        fill=CYAN,
        width=3
    )

    # Beam endpoint
    draw.ellipse(
        (
            beam_x - 6,
            beam_y - 6,
            beam_x + 6,
            beam_y + 6
        ),
        fill=WHITE
    )


# ==========================================
# SKILL NODES
# ==========================================

def draw_nodes(draw, frame):

    for index, ((x, y), skill) in enumerate(
        zip(nodes, skills)
    ):

        pulse = (
            sin(frame * 0.16 + index) + 1
        ) / 2

        radius = int(6 + pulse * 4)

        draw.ellipse(
            (
                x - radius,
                y - radius,
                x + radius,
                y + radius
            ),
            fill=CYAN
        )

        # Label positions
        if index == 0:
            position = (x - 95, y - 45)

        elif index == 1:
            position = (x + 20, y - 25)

        elif index == 2:
            position = (x + 20, y + 10)

        elif index == 3:
            position = (x - 95, y + 25)

        elif index == 4:
            position = (x - 215, y + 10)

        else:
            position = (x - 215, y - 25)

        draw.text(
            position,
            skill,
            font=SMALL,
            fill=WHITE
        )


# ==========================================
# HEADER
# ==========================================


def draw_header(draw):

    draw.text(
        (60, 55),
        "AI ENGINEERING // SKILL RADAR",
        font=TITLE,
        fill=WHITE
    )

    draw.text(
        (62, 105),
        "MY CURRENT LEARNING AND DEVELOPMENT FOCUS",
        font=SUBTITLE,
        fill=MUTED
    )

    draw.rounded_rectangle(
        (60, 140, 260, 144),
        radius=2,
        fill=CYAN
    )


# ==========================================
# ANIMATION
# ==========================================

frames = []

print("\nFAHEEM // SKILL RADAR")
print("----------------------")

for frame in range(FRAME_COUNT):

    image = Image.new(
        "RGB",
        (WIDTH, HEIGHT),
        BG
    )

    draw = ImageDraw.Draw(image)

    draw_background(draw)
    draw_particles(draw, frame)
    draw_header(draw)

    draw_radar_grid(draw)
    draw_radar_beam(draw, frame)
    draw_nodes(draw, frame)

    # Center point
    cx, cy = CENTER

    draw.ellipse(
        (cx - 9, cy - 9, cx + 9, cy + 9),
        fill=PURPLE
    )

    frames.append(image)

    if (frame + 1) % 12 == 0:
        print(f"Rendering: {frame + 1}/{FRAME_COUNT}")

# ==========================================
# EXPORT
# ==========================================

frames[0].save(
    OUTPUT,
    save_all=True,
    append_images=frames[1:],
    duration=FRAME_DURATION,
    loop=0,
    optimize=True
)

print("----------------------")
print("SKILL RADAR CREATED!")
print(f"Output: {OUTPUT}")
print("----------------------")