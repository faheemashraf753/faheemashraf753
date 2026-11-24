from pathlib import Path
from math import sin, cos, pi
from PIL import Image, ImageDraw, ImageFont
import random

# --------------------------------------------------
# PROJECT PATHS
# --------------------------------------------------

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "assets" / "animations" / "tech-stack.gif"

OUTPUT.parent.mkdir(parents=True, exist_ok=True)

# --------------------------------------------------
# DESIGN SETTINGS
# --------------------------------------------------

WIDTH = 1200
HEIGHT = 520

FRAME_COUNT = 48
FRAME_DURATION = 80

BACKGROUND = (8, 11, 22)
WHITE = (235, 242, 255)
MUTED = (135, 151, 180)
CYAN = (34, 211, 238)
PURPLE = (168, 85, 247)

# --------------------------------------------------
# FONTS
# --------------------------------------------------

def load_font(size, bold=False):
    font_name = "arialbd.ttf" if bold else "arial.ttf"

    try:
        return ImageFont.truetype(font_name, size)
    except OSError:
        return ImageFont.load_default()


TITLE_FONT = load_font(34, True)
SUBTITLE_FONT = load_font(17)
CARD_FONT = load_font(22, True)
SMALL_FONT = load_font(12)

# --------------------------------------------------
# TECHNOLOGY CARDS
# --------------------------------------------------

technologies = [
    ("PYTHON", "Programming"),
    ("JAVA", "Programming"),
    ("FASTAPI", "Backend"),
    ("DJANGO", "Backend"),
    ("GEMINI AI", "Generative AI"),
    ("NUMPY", "Data Science"),
    ("PANDAS", "Data Analysis"),
    ("STREAMLIT", "Applications"),
]

card_width = 250
card_height = 125

gap_x = 25
gap_y = 22

start_x = 60
start_y = 170

# --------------------------------------------------
# PARTICLES
# --------------------------------------------------

random.seed(42)

particles = []

for _ in range(55):
    particles.append({
        "x": random.randint(0, WIDTH),
        "y": random.randint(0, HEIGHT),
        "speed": random.uniform(0.5, 2),
        "size": random.randint(1, 3),
        "phase": random.uniform(0, 2 * pi)
    })


# --------------------------------------------------
# DRAW HELPERS
# --------------------------------------------------

def draw_background(draw):
    draw.rectangle(
        (0, 0, WIDTH, HEIGHT),
        fill=BACKGROUND
    )

    # Subtle background grid
    for x in range(0, WIDTH, 50):
        draw.line(
            (x, 0, x, HEIGHT),
            fill=(17, 24, 42),
            width=1
        )

    for y in range(0, HEIGHT, 50):
        draw.line(
            (0, y, WIDTH, y),
            fill=(17, 24, 42),
            width=1
        )


def draw_particles(draw, frame):
    for particle in particles:

        x = particle["x"]

        y = (
            particle["y"]
            - frame * particle["speed"]
        ) % HEIGHT

        brightness = (
            sin(frame * 0.12 + particle["phase"]) + 1
        ) / 2

        alpha = int(70 + brightness * 130)

        color = (
            int(CYAN[0] * alpha / 200),
            int(CYAN[1] * alpha / 200),
            int(CYAN[2] * alpha / 200)
        )

        size = particle["size"]

        draw.ellipse(
            (x, y, x + size, y + size),
            fill=color
        )


def draw_header(draw):
    draw.text(
        (60, 55),
        "TECHNOLOGY STACK",
        font=TITLE_FONT,
        fill=WHITE
    )

    draw.text(
        (62, 105),
        "TOOLS I USE TO BUILD AND EXPLORE INTELLIGENT SYSTEMS",
        font=SUBTITLE_FONT,
        fill=MUTED
    )

    draw.rounded_rectangle(
        (60, 140, 250, 144),
        radius=2,
        fill=CYAN
    )


def draw_card(draw, x, y, title, category, frame, index):

    pulse = (
        sin(frame * 0.16 + index * 0.8) + 1
    ) / 2

    border_color = (
        int(CYAN[0] * (0.45 + pulse * 0.55)),
        int(CYAN[1] * (0.45 + pulse * 0.55)),
        int(CYAN[2] * (0.45 + pulse * 0.55))
    )

    # Card background
    draw.rounded_rectangle(
        (x, y, x + card_width, y + card_height),
        radius=17,
        fill=(15, 22, 39),
        outline=border_color,
        width=2
    )

    # Small animated accent
    accent_width = int(35 + pulse * 35)

    draw.rounded_rectangle(
        (x + 18, y + 17,
         x + 18 + accent_width, y + 21),
        radius=2,
        fill=PURPLE
    )

    # Technology name
    draw.text(
        (x + 18, y + 43),
        title,
        font=CARD_FONT,
        fill=WHITE
    )

    # Category
    draw.text(
        (x + 18, y + 83),
        category,
        font=SMALL_FONT,
        fill=MUTED
    )

    # Animated status indicator
    dot_alpha = (
        sin(frame * 0.2 + index) + 1
    ) / 2

    dot_color = (
        20,
        int(150 + dot_alpha * 105),
        190
    )

    draw.ellipse(
        (x + card_width - 32,
         y + 18,
         x + card_width - 22,
         y + 28),
        fill=dot_color
    )


# --------------------------------------------------
# CREATE ANIMATION
# --------------------------------------------------

frames = []

print("\nCreating FAHEEM // TECH DASHBOARD")
print("----------------------------------")

for frame_number in range(FRAME_COUNT):

    image = Image.new(
        "RGB",
        (WIDTH, HEIGHT),
        BACKGROUND
    )

    draw = ImageDraw.Draw(image)

    draw_background(draw)
    draw_particles(draw, frame_number)
    draw_header(draw)

    for index, (title, category) in enumerate(technologies):

        row = index // 4
        column = index % 4

        x = start_x + column * (card_width + gap_x)
        y = start_y + row * (card_height + gap_y)

        # Subtle floating movement
        floating = sin(
            frame_number * 0.12 + index
        ) * 3

        y = int(y + floating)

        draw_card(
            draw,
            x,
            y,
            title,
            category,
            frame_number,
            index
        )

    frames.append(image)

    if (frame_number + 1) % 12 == 0:
        print(f"Rendered {frame_number + 1}/{FRAME_COUNT} frames")

# --------------------------------------------------
# EXPORT GIF
# --------------------------------------------------

frames[0].save(
    OUTPUT,
    save_all=True,
    append_images=frames[1:],
    duration=FRAME_DURATION,
    loop=0,
    optimize=True
)

print("----------------------------------")
print("TECH DASHBOARD CREATED!")
print(f"Location: {OUTPUT}")
print("----------------------------------")