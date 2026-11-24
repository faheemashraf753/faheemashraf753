const canvas = document.getElementById("ai-universe");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

async function startUniverse() {
  if (!canvas || reduceMotion) return;

  try {
    const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js");
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power"
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 10);

    const group = new THREE.Group();
    scene.add(group);

    const ambient = new THREE.AmbientLight(0x8abbd0, 1.4);
    scene.add(ambient);
    const cyanLight = new THREE.PointLight(0x22d3ee, 22, 22);
    cyanLight.position.set(3, 2, 3);
    scene.add(cyanLight);
    const violetLight = new THREE.PointLight(0x8b5cf6, 18, 20);
    violetLight.position.set(-4, -2, 2);
    scene.add(violetLight);

    // A layered wireframe nucleus gives the scene a recognisable focal point.
    const nucleus = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.18, 2),
      new THREE.MeshBasicMaterial({ color: 0x39dff0, wireframe: true, transparent: true, opacity: 0.27 })
    );
    const nucleusInner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.72, 1),
      new THREE.MeshBasicMaterial({ color: 0xa78bfa, wireframe: true, transparent: true, opacity: 0.4 })
    );
    group.add(nucleus, nucleusInner);

    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(1.03, 32, 24),
      new THREE.MeshBasicMaterial({ color: 0x0c5367, transparent: true, opacity: 0.08 })
    );
    group.add(halo);

    const rings = [];
    [1.75, 2.15, 2.55].forEach((radius, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.008, 6, 150),
        new THREE.MeshBasicMaterial({
          color: index === 1 ? 0xa78bfa : 0x22d3ee,
          transparent: true,
          opacity: 0.23 - index * 0.035
        })
      );
      ring.rotation.set(0.7 + index * 0.55, 0.35 + index * 0.4, index * 0.5);
      group.add(ring);
      rings.push(ring);
    });

    // Star field with deterministic positions and slow drift.
    const count = window.innerWidth < 700 ? 430 : 850;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 25;
      positions[i3 + 1] = (Math.random() - 0.5) * 17;
      positions[i3 + 2] = (Math.random() - 0.5) * 13;
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.15 + Math.random() * 0.35;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        color: 0x80eaff,
        size: 0.025,
        transparent: true,
        opacity: 0.68,
        sizeAttenuation: true
      })
    );
    scene.add(stars);

    // Neural constellation: nodes and nearby links move as one subtle layer.
    const nodeCount = 48;
    const nodePositions = [];
    for (let i = 0; i < nodeCount; i++) {
      nodePositions.push(new THREE.Vector3(
        (Math.random() - 0.5) * 13,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4
      ));
    }
    const linkPositions = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 2.35) {
          linkPositions.push(...nodePositions[i].toArray(), ...nodePositions[j].toArray());
        }
      }
    }
    const linkGeometry = new THREE.BufferGeometry();
    linkGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linkPositions, 3));
    const links = new THREE.LineSegments(
      linkGeometry,
      new THREE.LineBasicMaterial({ color: 0x7865bd, transparent: true, opacity: 0.12 })
    );
    scene.add(links);

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(nodePositions.flatMap(p => p.toArray()), 3));
    const nodes = new THREE.Points(
      nodeGeometry,
      new THREE.PointsMaterial({ color: 0x9eecff, size: 0.045, transparent: true, opacity: 0.72 })
    );
    scene.add(nodes);

    const pointer = { x: 0, y: 0 };
    let targetX = 0;
    let targetY = 0;
    let frameId = 0;
    let active = !document.hidden;

    window.addEventListener("pointermove", event => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.7;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.45;
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
      active = !document.hidden;
      if (active && !frameId) animate();
    });

    const clock = new THREE.Clock();
    function animate() {
      frameId = 0;
      if (!active) return;
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      nucleus.rotation.x = t * 0.11;
      nucleus.rotation.y = t * 0.16;
      nucleusInner.rotation.x = -t * 0.17;
      nucleusInner.rotation.y = t * 0.21;
      halo.scale.setScalar(1 + Math.sin(t * 1.3) * 0.035);
      rings.forEach((ring, i) => {
        ring.rotation.z += 0.0008 * (i + 1);
        ring.rotation.x += 0.00025 * (i + 1);
      });
      stars.rotation.y = t * 0.008;
      links.rotation.y = t * 0.012;
      nodes.rotation.y = t * 0.012;

      targetX += (pointer.x - targetX) * 0.018;
      targetY += (pointer.y - targetY) * 0.018;
      camera.position.x += (targetX - camera.position.x) * 0.025;
      camera.position.y += (-targetY - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);

      // Gentle twinkle without rebuilding the particle buffer.
      const starAttribute = starGeometry.attributes.position;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        starAttribute.array[i3 + 1] += Math.sin(t * speeds[i] + phases[i]) * 0.0007;
      }
      starAttribute.needsUpdate = true;
      renderer.render(scene, camera);
    }

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height, false);
    };
    window.addEventListener("resize", resize, { passive: true });

    animate();

    window.addEventListener("pagehide", () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      starGeometry.dispose();
      linkGeometry.dispose();
      nodeGeometry.dispose();
    }, { once: true });

  } catch (error) {
    console.warn("3D background unavailable; the portfolio will use its CSS background.", error);
    canvas.hidden = true;
  }
}

startUniverse();
