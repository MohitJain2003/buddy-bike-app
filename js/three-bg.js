document.addEventListener('DOMContentLoaded', () => {
    // If canvas doesn't exist, create it dynamically for global background
    let canvas = document.getElementById('hero-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'hero-canvas';
        // Add to the top of body so it stays behind everything
        document.body.insertBefore(canvas, document.body.firstChild);
    }

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- GEOMETRY: Abstract Cyber Form ---
    const geometry = new THREE.IcosahedronGeometry(12, 1);
    
    // Wireframe glowing material
    const material = new THREE.MeshBasicMaterial({ 
        color: 0xE63946, // Vibrant Red
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x00e5ff, // Electric Blue
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });

    const mesh1 = new THREE.Mesh(geometry, material);
    const mesh2 = new THREE.Mesh(new THREE.TorusKnotGeometry(8, 2, 100, 16), coreMaterial);
    
    const group = new THREE.Group();
    group.add(mesh1);
    group.add(mesh2);
    scene.add(group);

    // --- PARTICLES: Flow Field / Mesh Gradient Effect ---
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 150;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x00e5ff, 
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    
    const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleMesh);

    // --- SCROLLYTELLING INTERACTION ---
    let scrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // --- MOUSE INTERACTION ---
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

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        // Idle floating rotation
        mesh1.rotation.y = 0.1 * elapsedTime;
        mesh1.rotation.x = 0.15 * elapsedTime;
        
        mesh2.rotation.y = -0.1 * elapsedTime;
        mesh2.rotation.z = 0.05 * elapsedTime;

        particleMesh.rotation.y = -0.02 * elapsedTime;

        // Scrollytelling physics (moves camera and objects based on scroll)
        // Group moves up as we scroll down to give a parallax effect
        group.position.y = scrollY * 0.01;
        particleMesh.position.y = scrollY * 0.005;

        // Easing for smooth mouse follow
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        // Apply parallax effect based on mouse
        group.rotation.y += 0.05 * (targetX - group.rotation.y);
        group.rotation.x += 0.05 * (targetY - group.rotation.x);
        
        particleMesh.rotation.x += 0.02 * (targetY - particleMesh.rotation.x);
        particleMesh.rotation.y += 0.02 * (targetX - particleMesh.rotation.y);

        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    };

    tick();

    // --- RESIZE HANDLER ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
