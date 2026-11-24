const canvas = document.getElementById("portraitCanvas");
const ctx = canvas.getContext("2d");

const image = new Image();

image.src = "../assets/profile/portrait-dots.svg";

const particles = [];

let width = 0;
let height = 0;

let mouse = {
    x: -1000,
    y: -1000
};

const settings = {
    gap: 3,
    particleSize: 1.6,
    mouseRadius: 65,
    movement: 0.8
};


// Resize canvas

function resizeCanvas() {

    const rect = canvas.getBoundingClientRect();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = rect.width;
    height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createParticles();
}


// Create particles from the portrait

function createParticles() {

    particles.length = 0;

    if (!image.complete || !image.naturalWidth) return;

    const offscreen = document.createElement("canvas");

    const offCtx = offscreen.getContext("2d", {
        willReadFrequently: true
    });

    const sourceSize = 400;

    offscreen.width = sourceSize;
    offscreen.height = sourceSize;

    offCtx.clearRect(0, 0, sourceSize, sourceSize);

    offCtx.drawImage(
        image,
        0,
        0,
        sourceSize,
        sourceSize
    );

    const pixels = offCtx.getImageData(
        0,
        0,
        sourceSize,
        sourceSize
    ).data;

    const scale = Math.min(
        width / sourceSize,
        height / sourceSize
    ) * 0.92;

    const offsetX = (width - sourceSize * scale) / 2;
    const offsetY = (height - sourceSize * scale) / 2;

    for (let y = 0; y < sourceSize; y += settings.gap) {

        for (let x = 0; x < sourceSize; x += settings.gap) {

            const index = (y * sourceSize + x) * 4;

            const r = pixels[index];
            const g = pixels[index + 1];
            const b = pixels[index + 2];
            const alpha = pixels[index + 3];

            if (alpha < 40) continue;

            const brightness = (r + g + b) / 3;

            // Ignore the dark SVG background.
            if (alpha < 30) continue;
            if (brightness < 25) continue;
            const color = x / sourceSize;

            const opacity = Math.min(1, 0.65 + brightness / 500);

            const particleColor = color < 0.5
                ? `rgba(34, 211, 238, ${opacity})`
                : `rgba(168, 85, 247, ${opacity})`;

            const px = offsetX + x * scale;
            const py = offsetY + y * scale;

            particles.push({

                x: px,
                y: py,

                originalX: px,
                originalY: py,

                size: settings.particleSize,

                color: particleColor,

                phase: Math.random() * Math.PI * 2

            });

        }
    }
}


// Mouse interaction

canvas.addEventListener("pointermove", event => {

    const rect = canvas.getBoundingClientRect();

    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;

});

canvas.addEventListener("pointerleave", () => {

    mouse.x = -1000;
    mouse.y = -1000;

});


// Animation

function animate(time) {

    ctx.clearRect(0, 0, width, height);

    particles.forEach(particle => {

        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        let targetX = particle.originalX;
        let targetY = particle.originalY;

        if (distance < settings.mouseRadius && distance > 0) {

            const force =
                (settings.mouseRadius - distance) /
                settings.mouseRadius;

            targetX += (dx / distance) * force * 22;
            targetY += (dy / distance) * force * 22;

        }

        const floating =
            Math.sin(time * 0.0015 + particle.phase) *
            settings.movement;

        particle.x += (targetX - particle.x) * 0.08;
        particle.y += (targetY + floating - particle.y) * 0.08;

        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = particle.color;
        ctx.fill();

    });

    requestAnimationFrame(animate);
}


// Start

image.onload = () => {

    resizeCanvas();

    animate(0);

};

image.onerror = () => {
    console.error("Could not load the portrait SVG.");
};

window.addEventListener("resize", resizeCanvas);