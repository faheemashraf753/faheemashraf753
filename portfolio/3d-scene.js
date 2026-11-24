import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";


// ------------------------------------
// BASIC SCENE SETUP
// ------------------------------------

const canvas = document.getElementById("ai-universe");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    65,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 9;


const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.5)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


// ------------------------------------
// LIGHTING
// ------------------------------------

const cyanLight = new THREE.PointLight(
    0x22d3ee,
    30,
    20
);

cyanLight.position.set(3, 3, 5);

scene.add(cyanLight);


const purpleLight = new THREE.PointLight(
    0xa855f7,
    25,
    20
);

purpleLight.position.set(-4, -3, 4);

scene.add(purpleLight);


// ------------------------------------
// CENTRAL AI STRUCTURE
// ------------------------------------

const coreGeometry = new THREE.IcosahedronGeometry(
    1.35,
    2
);

const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0x22d3ee,
    wireframe: true,
    transparent: true,
    opacity: 0.32
});

const core = new THREE.Mesh(
    coreGeometry,
    coreMaterial
);

scene.add(core);


// Inner structure

const innerGeometry = new THREE.IcosahedronGeometry(
    0.85,
    1
);

const innerMaterial = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    wireframe: true,
    transparent: true,
    opacity: 0.45
});

const innerCore = new THREE.Mesh(
    innerGeometry,
    innerMaterial
);

scene.add(innerCore);


// ------------------------------------
// ORBITAL RINGS
// ------------------------------------

const rings = [];

for (let i = 0; i < 3; i++) {

    const geometry = new THREE.TorusGeometry(
        2 + i * 0.35,
        0.008,
        8,
        120
    );

    const material = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x22d3ee : 0xa855f7,
        transparent: true,
        opacity: 0.35
    });

    const ring = new THREE.Mesh(
        geometry,
        material
    );

    ring.rotation.x = Math.PI / 2 + i * 0.45;
    ring.rotation.y = i * 0.6;

    scene.add(ring);

    rings.push(ring);
}


// ------------------------------------
// PARTICLE UNIVERSE
// ------------------------------------

const particleCount = 900;

const particlePositions = new Float32Array(
    particleCount * 3
);

for (let i = 0; i < particleCount; i++) {

    const i3 = i * 3;

    particlePositions[i3] =
        (Math.random() - 0.5) * 22;

    particlePositions[i3 + 1] =
        (Math.random() - 0.5) * 16;

    particlePositions[i3 + 2] =
        (Math.random() - 0.5) * 12;
}

const particleGeometry = new THREE.BufferGeometry();

particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3)
);

const particleMaterial = new THREE.PointsMaterial({
    color: 0x67e8f9,
    size: 0.035,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true
});

const particles = new THREE.Points(
    particleGeometry,
    particleMaterial
);

scene.add(particles);


// ------------------------------------
// NEURAL NETWORK CONNECTIONS
// ------------------------------------

const networkPoints = [];

for (let i = 0; i < 55; i++) {

    networkPoints.push(
        new THREE.Vector3(
            (Math.random() - 0.5) * 14,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 5
        )
    );
}

const networkPositions = [];

for (let i = 0; i < networkPoints.length; i++) {

    for (let j = i + 1; j < networkPoints.length; j++) {

        const distance = networkPoints[i].distanceTo(
            networkPoints[j]
        );

        if (distance < 2.1) {

            networkPositions.push(
                networkPoints[i].x,
                networkPoints[i].y,
                networkPoints[i].z,

                networkPoints[j].x,
                networkPoints[j].y,
                networkPoints[j].z
            );
        }
    }
}

const networkGeometry = new THREE.BufferGeometry();

networkGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(networkPositions, 3)
);

const networkMaterial = new THREE.LineBasicMaterial({
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.13
});

const network = new THREE.LineSegments(
    networkGeometry,
    networkMaterial
);

scene.add(network);


// ------------------------------------
// MOUSE INTERACTION
// ------------------------------------

let mouseX = 0;
let mouseY = 0;

window.addEventListener("pointermove", (event) => {

    mouseX =
        (event.clientX / window.innerWidth - 0.5) * 0.5;

    mouseY =
        (event.clientY / window.innerHeight - 0.5) * 0.5;

});


// ------------------------------------
// ANIMATION
// ------------------------------------

const clock = new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    core.rotation.x = elapsed * 0.12;
    core.rotation.y = elapsed * 0.18;

    innerCore.rotation.x = -elapsed * 0.16;
    innerCore.rotation.y = elapsed * 0.22;

    rings.forEach((ring, index) => {

        ring.rotation.z =
            elapsed * (0.08 + index * 0.025);

    });

    particles.rotation.y = elapsed * 0.008;
    network.rotation.y = elapsed * 0.012;

    camera.position.x +=
        (mouseX - camera.position.x) * 0.025;

    camera.position.y +=
        (-mouseY - camera.position.y) * 0.025;

    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}

animate();


// ------------------------------------
// RESPONSIVE RESIZING
// ------------------------------------

window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 1.5)
    );

});