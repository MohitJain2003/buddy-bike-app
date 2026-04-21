document.addEventListener('DOMContentLoaded', () => {
    let canvas = document.getElementById('hero-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'hero-canvas';
        document.body.insertBefore(canvas, document.body.firstChild);
    }

    const scene = new THREE.Scene();
    
    // Add Fog to blend into the dark background
    scene.fog = new THREE.FogExp2(0x050505, 0.02);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 1;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Tech-focused Premium Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0); 
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    const rimLight = new THREE.DirectionalLight(0xE63946, 3.0); // Neon red energy glow
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);
    
    const fillLight = new THREE.PointLight(0x00e5ff, 1.5); // Cyan tech fill
    fillLight.position.set(5, 0, 5);
    scene.add(fillLight);

    const bikeGroup = new THREE.Group();
    scene.add(bikeGroup);

    let bikeModel = null;
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

    // Procedural Abstract Mechanical Composition (Bypasses all DNS/404 errors)
    try {
        bikeModel = new THREE.Group();
        bikeModel.userData.gears = [];
        bikeModel.userData.pistons = [];
        bikeModel.userData.wires = [];
        
        // Premium Futuristic Materials
        const darkMetal = new THREE.MeshPhysicalMaterial({ 
            color: 0x1a1a1a, metalness: 0.9, roughness: 0.5, clearcoat: 0.3 
        });
        const goldMetal = new THREE.MeshStandardMaterial({ 
            color: 0xd4af37, metalness: 1.0, roughness: 0.3 
        });
        const silverMetal = new THREE.MeshStandardMaterial({ 
            color: 0xcccccc, metalness: 1.0, roughness: 0.2 
        });
        const neonRed = new THREE.MeshBasicMaterial({ 
            color: 0xE63946 
        });
        const neonCyan = new THREE.MeshBasicMaterial({ 
            color: 0x00e5ff 
        });

        // Helper to create a stylized mechanical gear
        const createGear = (radius, thickness, teethCount, material) => {
            const gearGroup = new THREE.Group();
            
            // Core plate
            const coreGeo = new THREE.CylinderGeometry(radius, radius, thickness, 32);
            const core = new THREE.Mesh(coreGeo, material);
            gearGroup.add(core);
            
            // Inner cutout ring (visual contrast)
            const innerGeo = new THREE.CylinderGeometry(radius * 0.7, radius * 0.7, thickness * 1.1, 16);
            const inner = new THREE.Mesh(innerGeo, darkMetal);
            gearGroup.add(inner);

            // Teeth around the edge
            const toothGeo = new THREE.BoxGeometry(radius * 0.2, thickness * 0.8, radius * 0.2);
            for (let i = 0; i < teethCount; i++) {
                const angle = (i / teethCount) * Math.PI * 2;
                const tooth = new THREE.Mesh(toothGeo, material);
                tooth.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
                tooth.rotation.y = -angle;
                gearGroup.add(tooth);
            }
            
            // Rotate the entire gear to stand up and face the X axis like a wheel
            gearGroup.rotation.z = Math.PI / 2;
            return gearGroup;
        };

        // 1. Drivetrain (Gears & Sprockets)
        const rearGear = createGear(0.7, 0.2, 16, goldMetal);
        rearGear.position.set(0, -0.2, -1.2);
        bikeModel.add(rearGear);
        bikeModel.userData.gears.push({ mesh: rearGear, speed: 0.02 });

        const frontGear = createGear(0.4, 0.2, 10, silverMetal);
        frontGear.position.set(0, -0.4, 0.8);
        bikeModel.add(frontGear);
        // Ratio: 0.7/0.4 = 1.75
        bikeModel.userData.gears.push({ mesh: frontGear, speed: 0.035 });

        // 2. Abstract Chain Drive (Top and Bottom drive belts)
        const beltGeo = new THREE.BoxGeometry(0.1, 0.05, 2.2);
        
        const topBelt = new THREE.Mesh(beltGeo, darkMetal);
        topBelt.position.set(0.15, 0.2, -0.2);
        topBelt.rotation.x = -0.1; // Angle connecting front to rear
        bikeModel.add(topBelt);

        const bottomBelt = new THREE.Mesh(beltGeo, darkMetal);
        bottomBelt.position.set(0.15, -0.8, -0.2);
        bottomBelt.rotation.x = 0.1;
        bikeModel.add(bottomBelt);

        // 3. Central Engine Block / Pistons
        const engineBlock = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 1.0), darkMetal);
        engineBlock.position.set(0, 0.5, 0);
        bikeModel.add(engineBlock);

        for (let i = 0; i < 3; i++) {
            const pistonGroup = new THREE.Group();
            
            // Engine cylinder
            const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16), darkMetal);
            pistonGroup.add(cylinder);
            
            // Moving piston rod
            const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 16), silverMetal);
            pistonGroup.add(piston);
            
            pistonGroup.position.set(0, 1.0, -0.3 + (i * 0.3));
            bikeModel.add(pistonGroup);
            
            bikeModel.userData.pistons.push({ mesh: piston, offset: i * (Math.PI * 0.6) });
        }

        // 4. Flowing Energy Cables
        const wireGeo = new THREE.TorusGeometry(0.8, 0.03, 8, 32, Math.PI);
        
        const wire1 = new THREE.Mesh(wireGeo, neonRed);
        wire1.rotation.y = Math.PI / 2;
        wire1.position.set(0.35, 0.5, 0);
        bikeModel.add(wire1);
        bikeModel.userData.wires.push(wire1);

        const wire2 = new THREE.Mesh(wireGeo, neonCyan);
        wire2.rotation.y = Math.PI / 2;
        wire2.rotation.x = Math.PI; // upside down arch
        wire2.position.set(-0.35, 0.5, 0);
        bikeModel.add(wire2);
        bikeModel.userData.wires.push(wire2);

        // 5. Minimal Abstract Chassis Beams
        const beamGeo = new THREE.BoxGeometry(0.1, 0.1, 2.5);
        const topBeam = new THREE.Mesh(beamGeo, silverMetal);
        topBeam.position.set(0, 1.2, 0);
        topBeam.rotation.x = 0.1;
        bikeModel.add(topBeam);

        const forkGeo = new THREE.BoxGeometry(0.1, 1.5, 0.1);
        const fork = new THREE.Mesh(forkGeo, silverMetal);
        fork.position.set(0, 0.5, 1.2);
        fork.rotation.x = -0.3;
        bikeModel.add(fork);

        // Scale and Position
        bikeModel.scale.set(1.5, 1.5, 1.5);
        bikeModel.position.set(0, 0, -2); // Moved up from -1.0 to 0
        
        bikeGroup.add(bikeModel);
        
    } catch (err) {
        console.error('Failed to generate procedural mechanical composition:', err);
    }

    // Particles for cyber atmosphere
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800; // Increased count for better scattering
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 50;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15, // Made particles significantly larger
        color: 0xE63946, 
        transparent: true,
        opacity: 0.9, // Increased visibility/opacity
        blending: THREE.AdditiveBlending
    });
    const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleMesh);

    let scrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    const clock = new THREE.Clock();

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        // Parallax scroll effect
        bikeGroup.position.y = scrollY * 0.002 - 1;
        particleMesh.position.y = scrollY * 0.005;

        // Easing for smooth mouse follow
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        if (bikeModel) {
            // Interactive: follows mouse smoothly
            bikeGroup.rotation.y += 0.05 * (targetX - bikeGroup.rotation.y);
            bikeGroup.rotation.x += 0.05 * (targetY - bikeGroup.rotation.x);
            
            // Continuous rotation to view all angles
            bikeModel.rotation.y = (Math.PI / 4) + (elapsedTime * 0.15);

            // Smooth Animations for Mechanical Parts
            if (bikeModel.userData.gears) {
                bikeModel.userData.gears.forEach(gear => {
                    // Rotate around X since gear group was rotated Z by PI/2
                    gear.mesh.rotation.x += gear.speed; 
                });
            }
            if (bikeModel.userData.pistons) {
                bikeModel.userData.pistons.forEach(piston => {
                    // Smooth up and down piston pumping motion
                    piston.mesh.position.y = Math.sin((elapsedTime * 5) + piston.offset) * 0.15;
                });
            }
            if (bikeModel.userData.wires) {
                // Pulse wire scale slightly for flowing energy effect
                const pulse = Math.sin(elapsedTime * 4) * 0.05 + 1.0;
                bikeModel.userData.wires.forEach(wire => {
                    wire.scale.setScalar(pulse);
                });
            }
        }
        
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
