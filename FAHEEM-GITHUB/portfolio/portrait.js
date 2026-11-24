(() => {
  const canvas = document.getElementById("portraitCanvas");
  if (!canvas) return;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  const image = new Image();
  image.src = "../assets/profile/portrait-dots.svg";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const particles = [];
  const pointer = { x: -1000, y: -1000 };
  let width = 0;
  let height = 0;
  let animationId = 0;
  let lastFrame = 0;

  const config = {
    sampleSize: 520,
    step: 4,
    radius: 1.15,
    interactionRadius: 68,
    interactionStrength: 17,
    floatAmount: 0.55
  };

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    width = bounds.width;
    height = bounds.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildParticles();
    drawStatic();
  }

  function buildParticles() {
    particles.length = 0;
    if (!image.complete || !image.naturalWidth || !width || !height) return;

    const sample = document.createElement("canvas");
    sample.width = config.sampleSize;
    sample.height = config.sampleSize;
    const sampleContext = sample.getContext("2d", { willReadFrequently: true });
    sampleContext.clearRect(0, 0, sample.width, sample.height);
    sampleContext.drawImage(image, 0, 0, sample.width, sample.height);

    let pixels;
    try {
      pixels = sampleContext.getImageData(0, 0, sample.width, sample.height).data;
    } catch (error) {
      console.error("Could not read the portrait image.", error);
      showFallback();
      return;
    }

    const scale = Math.min(width / sample.width, height / sample.height) * 0.94;
    const offsetX = (width - sample.width * scale) / 2;
    const offsetY = (height - sample.height * scale) / 2;

    for (let y = 0; y < sample.height; y += config.step) {
      for (let x = 0; x < sample.width; x += config.step) {
        const index = (y * sample.width + x) * 4;
        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];
        const alpha = pixels[index + 3];
        const brightness = (r + g + b) / 3;

        // The SVG has a near-black background. Exclude it, retain coloured portrait dots.
        if (alpha < 30 || brightness < 28) continue;

        const hue = x / sample.width;
        const colour = hue < 0.52
          ? `rgba(65,225,245,${0.62 + brightness / 900})`
          : `rgba(174,130,255,${0.62 + brightness / 900})`;

        const px = offsetX + x * scale;
        const py = offsetY + y * scale;
        particles.push({
          x: px, y: py, originX: px, originY: py,
          phase: Math.random() * Math.PI * 2,
          size: config.radius * (0.72 + Math.random() * 0.55),
          colour
        });
      }
    }

    if (!particles.length) showFallback();
    else {
      const fallback = document.querySelector(".portrait-fallback");
      if (fallback) fallback.style.opacity = "0";
    }
  }

  function showFallback() {
    const fallback = document.querySelector(".portrait-fallback");
    if (fallback) fallback.style.opacity = "0.9";
  }

  function drawStatic() {
    context.clearRect(0, 0, width, height);
    particles.forEach(particle => {
      context.beginPath();
      context.arc(particle.originX, particle.originY, particle.size, 0, Math.PI * 2);
      context.fillStyle = particle.colour;
      context.fill();
    });
  }

  function render(timestamp) {
    animationId = 0;
    if (document.hidden) return;
    if (timestamp - lastFrame < 30) {
      animationId = requestAnimationFrame(render);
      return;
    }
    lastFrame = timestamp;
    context.clearRect(0, 0, width, height);

    for (const particle of particles) {
      const dx = particle.originX - pointer.x;
      const dy = particle.originY - pointer.y;
      const distance = Math.hypot(dx, dy);
      let targetX = particle.originX;
      let targetY = particle.originY;

      if (distance < config.interactionRadius && distance > 0.01) {
        const force = (1 - distance / config.interactionRadius) * config.interactionStrength;
        targetX += (dx / distance) * force;
        targetY += (dy / distance) * force;
      }

      const drift = prefersReducedMotion ? 0 : Math.sin(timestamp * 0.001 + particle.phase) * config.floatAmount;
      particle.x += (targetX - particle.x) * 0.12;
      particle.y += (targetY + drift - particle.y) * 0.12;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fillStyle = particle.colour;
      context.fill();
    }

    animationId = requestAnimationFrame(render);
  }

  function start() {
    resize();
    if (prefersReducedMotion) drawStatic();
    else if (!animationId) animationId = requestAnimationFrame(render);
  }

  canvas.addEventListener("pointermove", event => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
  }, { passive: true });

  canvas.addEventListener("pointerleave", () => {
    pointer.x = -1000;
    pointer.y = -1000;
  });

  image.addEventListener("load", start, { once: true });
  image.addEventListener("error", showFallback, { once: true });
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
      animationId = 0;
    } else if (!prefersReducedMotion && particles.length) {
      animationId = requestAnimationFrame(render);
    }
  });

  if (image.complete && image.naturalWidth) start();
})();
