document.addEventListener('DOMContentLoaded', () => {
    let canvas = document.getElementById('particles-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'particles-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.zIndex = '-2';
        canvas.style.pointerEvents = 'none';
        document.body.insertBefore(canvas, document.body.firstChild);
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.02);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 1;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles for cyber atmosphere
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800; // Match index.html
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 50;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        color: 0xE63946, 
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });
    const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleMesh);

    let scrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    const clock = new THREE.Clock();

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        particleMesh.position.y = scrollY * 0.005;

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        particleMesh.rotation.y = -0.05 * elapsedTime;
        particleMesh.rotation.x += 0.02 * (targetY - particleMesh.rotation.x);
        particleMesh.rotation.y += 0.02 * (targetX - particleMesh.rotation.y);

        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    };

    tick();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
