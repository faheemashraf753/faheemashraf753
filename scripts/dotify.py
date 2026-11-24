from PIL import Image
import numpy as np
from pathlib import Path


# ==========================================
# FAHEEM // NEXUS
# DIGITAL PARTICLE PORTRAIT GENERATOR
# ==========================================

ROOT = Path(__file__).resolve().parent.parent

INPUT_IMAGE = ROOT / "assets" / "profile" / "my_photo.PNG"
OUTPUT_IMAGE = ROOT / "assets" / "profile" / "portrait-dots.svg"

# Configuration
WIDTH = 700
HEIGHT = 700
GRID_SIZE = 7

MIN_RADIUS = 0.35
MAX_RADIUS = 2.5


def load_image():

    if not INPUT_IMAGE.exists():
        raise FileNotFoundError(
            f"Image not found: {INPUT_IMAGE}"
        )

    image = Image.open(INPUT_IMAGE).convert("RGB")

    # Center crop into a square
    width, height = image.size
    side = min(width, height)

    left = (width - side) // 2
    top = (height - side) // 2

    image = image.crop(
        (left, top, left + side, top + side)
    )

    image = image.resize(
        (WIDTH // GRID_SIZE, HEIGHT // GRID_SIZE),
        Image.Resampling.LANCZOS
    )

    return np.asarray(image)


def calculate_color(x, y, brightness):

    # Cyan to violet gradient
    ratio = x / (WIDTH // GRID_SIZE)

    cyan = np.array([0, 230, 255])
    violet = np.array([155, 90, 255])

    color = (
        cyan * (1 - ratio) +
        violet * ratio
    )

    # Slight brightness variation
    intensity = 0.45 + (brightness / 255) * 0.55

    color = np.clip(
        color * intensity,
        0,
        255
    ).astype(int)

    return "#{:02x}{:02x}{:02x}".format(*color)


def generate_portrait():

    pixels = load_image()

    rows, cols, _ = pixels.shape

    svg_elements = []

    svg_elements.append(
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'width="{WIDTH}" height="{HEIGHT}" '
        f'viewBox="0 0 {WIDTH} {HEIGHT}">'
    )

    # Dark futuristic background
    svg_elements.append(
        '<rect width="100%" height="100%" '
        'fill="#080b16"/>'
    )

    for y in range(rows):

        for x in range(cols):

            r, g, b = pixels[y, x]

            brightness = (
                0.299 * r +
                0.587 * g +
                0.114 * b
            )

            # Darker pixels produce larger dots
            radius = MIN_RADIUS + (
                (255 - brightness) / 255
            ) * (MAX_RADIUS - MIN_RADIUS)

            color = calculate_color(
                x, y, brightness
            )

            opacity = 0.35 + (
                brightness / 255
            ) * 0.65

            cx = x * GRID_SIZE + GRID_SIZE / 2
            cy = y * GRID_SIZE + GRID_SIZE / 2

            svg_elements.append(
                f'<circle cx="{cx:.2f}" '
                f'cy="{cy:.2f}" '
                f'r="{radius:.2f}" '
                f'fill="{color}" '
                f'opacity="{opacity:.2f}"/>'
            )

    svg_elements.append("</svg>")

    OUTPUT_IMAGE.write_text(
        "\n".join(svg_elements),
        encoding="utf-8"
    )

    print("\n================================")
    print("FAHEEM // NEXUS")
    print("================================")

    print("Portrait generated successfully!")
    print(f"Output: {OUTPUT_IMAGE}")

    print("================================")


if __name__ == "__main__":
    generate_portrait()