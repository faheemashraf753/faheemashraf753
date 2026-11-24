from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
BANNER_FOLDER = PROJECT_ROOT / "assets" / "banners"

BANNER_FOLDER.mkdir(parents=True, exist_ok=True)

banner = r'''<svg width="1600" height="500"
     viewBox="0 0 1600 500"
     fill="none"
     xmlns="http://www.w3.org/2000/svg">

    <defs>
        <linearGradient id="background" x1="0" y1="0" x2="1600" y2="500">
            <stop offset="0%" stop-color="#080B16"/>
            <stop offset="55%" stop-color="#10152A"/>
            <stop offset="100%" stop-color="#090D1C"/>
        </linearGradient>

        <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#22D3EE"/>
            <stop offset="100%" stop-color="#A855F7"/>
        </linearGradient>

        <radialGradient id="glow">
            <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
    </defs>

    <!-- Background -->
    <rect width="1600" height="500" fill="url(#background)"/>

    <!-- Ambient lighting -->
    <circle cx="1300" cy="230" r="350" fill="url(#glow)"/>

    <!-- Background grid -->
    <g stroke="#64748B" stroke-opacity="0.09" stroke-width="1">
        <path d="M0 100 H1600"/>
        <path d="M0 200 H1600"/>
        <path d="M0 300 H1600"/>
        <path d="M0 400 H1600"/>

        <path d="M200 0 V500"/>
        <path d="M400 0 V500"/>
        <path d="M600 0 V500"/>
        <path d="M800 0 V500"/>
        <path d="M1000 0 V500"/>
        <path d="M1200 0 V500"/>
        <path d="M1400 0 V500"/>
    </g>

    <!-- Decorative orbit -->
    <circle cx="1320" cy="250" r="155"
            stroke="url(#accent)"
            stroke-opacity="0.35"
            stroke-width="1.5"
            stroke-dasharray="5 12">

        <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 1320 250"
            to="360 1320 250"
            dur="45s"
            repeatCount="indefinite"/>
    </circle>

    <circle cx="1320" cy="250" r="115"
            stroke="#22D3EE"
            stroke-opacity="0.15"
            stroke-width="1"/>

    <!-- Floating particles -->
    <g fill="#22D3EE">
        <circle cx="1150" cy="110" r="3">
            <animate attributeName="opacity"
                     values="0.2;1;0.2"
                     dur="3s"
                     repeatCount="indefinite"/>
        </circle>

        <circle cx="1450" cy="370" r="4">
            <animate attributeName="opacity"
                     values="1;0.2;1"
                     dur="4s"
                     repeatCount="indefinite"/>
        </circle>

        <circle cx="1320" cy="75" r="3">
            <animate attributeName="opacity"
                     values="0.3;1;0.3"
                     dur="2.5s"
                     repeatCount="indefinite"/>
        </circle>
    </g>

    <!-- Top label -->
    <text x="125" y="115"
          fill="#22D3EE"
          font-family="Consolas, monospace"
          font-size="17"
          letter-spacing="5">
        FAHEEM // DIGITAL SPACE
    </text>

    <!-- Main heading -->
    <text x="120" y="220"
          fill="#F8FAFC"
          font-family="Arial, Helvetica, sans-serif"
          font-size="65"
          font-weight="bold">
        FAHEEM UL ISLAM RATHER
    </text>

    <!-- Accent line -->
    <rect x="125" y="250"
          width="110" height="4"
          rx="2"
          fill="url(#accent)"/>

    <!-- Role -->
    <text x="125" y="310"
          fill="#CBD5E1"
          font-family="Arial, Helvetica, sans-serif"
          font-size="29">
        Aspiring AI Engineer
    </text>

    <text x="125" y="355"
          fill="#94A3B8"
          font-family="Arial, Helvetica, sans-serif"
          font-size="20">
        Python  /  Machine Learning  /  Generative AI
    </text>

    <!-- Bottom label -->
    <text x="125" y="430"
          fill="#64748B"
          font-family="Consolas, monospace"
          font-size="15"
          letter-spacing="3">
        BUILDING IDEAS INTO INTELLIGENT SYSTEMS
    </text>

    <!-- Corner decoration -->
    <path d="M1450 70 H1510 V130"
          stroke="url(#accent)"
          stroke-width="2"
          opacity="0.8"/>

    <path d="M1450 430 H1510 V370"
          stroke="url(#accent)"
          stroke-width="2"
          opacity="0.8"/>

</svg>
'''

output_file = BANNER_FOLDER / "hero-banner.svg"
output_file.write_text(banner, encoding="utf-8")

print("\n================================")
print("FAHEEM // NEXUS")
print("================================")
print("Hero banner created successfully!")
print(f"Output: {output_file}")
print("================================\n")