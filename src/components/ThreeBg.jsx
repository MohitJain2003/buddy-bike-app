import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBg = () => {
  const mountRef = useRef(null);
  const cleanedUpRef = useRef(false);

  useEffect(() => {
    // Reset the cleanup flag on each mount
    cleanedUpRef.current = false;

    // Basic Three.js setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.02);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const mountNode = mountRef.current;
    if (mountNode) {
        mountNode.appendChild(renderer.domElement);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0); 
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    const rimLight = new THREE.DirectionalLight(0xE63946, 3.0);
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);
    
    const fillLight = new THREE.PointLight(0x00e5ff, 1.5);
    fillLight.position.set(5, 0, 5);
    scene.add(fillLight);

    const bikeGroup = new THREE.Group();
    scene.add(bikeGroup);

    let bikeModel = null;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    const handleMouseMove = (event) => {
        if (event.clientX !== undefined) mouseX = (event.clientX - windowHalfX);
        if (event.clientY !== undefined) mouseY = (event.clientY - windowHalfY);
    };

    try {
        bikeModel = new THREE.Group();
        bikeModel.userData.gears = [];
        bikeModel.userData.pistons = [];
        bikeModel.userData.wires = [];
        
        const darkMetal = new THREE.MeshPhysicalMaterial({ color: 0x1a1a1a, metalness: 0.9, roughness: 0.5, clearcoat: 0.3 });
        const goldMetal = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1.0, roughness: 0.3 });
        const silverMetal = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 1.0, roughness: 0.2 });
        const neonRed = new THREE.MeshBasicMaterial({ color: 0xE63946 });
        const neonCyan = new THREE.MeshBasicMaterial({ color: 0x00e5ff });

        const createGear = (radius, thickness, teethCount, material) => {
            const gearGroup = new THREE.Group();
            const core = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, thickness, 32), material);
            gearGroup.add(core);
            const inner = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.7, radius * 0.7, thickness * 1.1, 16), darkMetal);
            gearGroup.add(inner);

            const toothGeo = new THREE.BoxGeometry(radius * 0.2, thickness * 0.8, radius * 0.2);
            for (let i = 0; i < teethCount; i++) {
                const angle = (i / teethCount) * Math.PI * 2;
                const tooth = new THREE.Mesh(toothGeo, material);
                tooth.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
                tooth.rotation.y = -angle;
                gearGroup.add(tooth);
            }
            gearGroup.rotation.z = Math.PI / 2;
            return gearGroup;
        };

        const rearGear = createGear(0.7, 0.2, 16, goldMetal);
        rearGear.position.set(0, -0.2, -1.2);
        bikeModel.add(rearGear);
        bikeModel.userData.gears.push({ mesh: rearGear, speed: 0.02 });

        const frontGear = createGear(0.4, 0.2, 10, silverMetal);
        frontGear.position.set(0, -0.4, 0.8);
        bikeModel.add(frontGear);
        bikeModel.userData.gears.push({ mesh: frontGear, speed: 0.035 });

        const beltGeo = new THREE.BoxGeometry(0.1, 0.05, 2.2);
        const topBelt = new THREE.Mesh(beltGeo, darkMetal);
        topBelt.position.set(0.15, 0.2, -0.2);
        topBelt.rotation.x = -0.1;
        bikeModel.add(topBelt);

        const bottomBelt = new THREE.Mesh(beltGeo, darkMetal);
        bottomBelt.position.set(0.15, -0.8, -0.2);
        bottomBelt.rotation.x = 0.1;
        bikeModel.add(bottomBelt);

        const engineBlock = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 1.0), darkMetal);
        engineBlock.position.set(0, 0.5, 0);
        bikeModel.add(engineBlock);

        for (let i = 0; i < 3; i++) {
            const pistonGroup = new THREE.Group();
            pistonGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16), darkMetal));
            const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 16), silverMetal);
            pistonGroup.add(piston);
            pistonGroup.position.set(0, 1.0, -0.3 + (i * 0.3));
            bikeModel.add(pistonGroup);
            bikeModel.userData.pistons.push({ mesh: piston, offset: i * (Math.PI * 0.6) });
        }

        const wireGeo = new THREE.TorusGeometry(0.8, 0.03, 8, 32, Math.PI);
        const wire1 = new THREE.Mesh(wireGeo, neonRed);
        wire1.rotation.y = Math.PI / 2;
        wire1.position.set(0.35, 0.5, 0);
        bikeModel.add(wire1);
        bikeModel.userData.wires.push(wire1);

        const wire2 = new THREE.Mesh(wireGeo, neonCyan);
        wire2.rotation.y = Math.PI / 2;
        wire2.rotation.x = Math.PI; 
        wire2.position.set(-0.35, 0.5, 0);
        bikeModel.add(wire2);
        bikeModel.userData.wires.push(wire2);

        const beamGeo = new THREE.BoxGeometry(0.1, 0.1, 2.5);
        const topBeam = new THREE.Mesh(beamGeo, silverMetal);
        topBeam.position.set(0, 1.2, 0);
        topBeam.rotation.x = 0.1;
        bikeModel.add(topBeam);

        const fork = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.5, 0.1), silverMetal);
        fork.position.set(0, 0.5, 1.2);
        fork.rotation.x = -0.3;
        bikeModel.add(fork);

        bikeModel.scale.set(1.5, 1.5, 1.5);
        bikeModel.position.set(0, 0, -2);
        
        bikeGroup.add(bikeModel);
    } catch (err) {
        console.error('Failed to generate procedural mechanical composition:', err);
    }

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 50;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMesh = new THREE.Points(particlesGeometry, new THREE.PointsMaterial({
        size: 0.15, color: 0xE63946, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending
    }));
    scene.add(particleMesh);

    let scrollY = window.scrollY || 0;
    const handleScroll = () => {
        scrollY = window.scrollY || 0;
    };

    const startTime = performance.now();

    const tick = () => {
        // Stop the loop if cleanup has been called
        if (cleanedUpRef.current) return;

        // Guaranteed safe time calculation
        const time = (performance.now() - startTime) * 0.001; 

        // Safe fallback for scroll parallax
        const sY = isNaN(scrollY) ? 0 : scrollY;
        bikeGroup.position.y = sY * 0.002 - 1;
        particleMesh.position.y = sY * 0.005;

        // Safe mouse targets
        targetX = (isNaN(mouseX) ? 0 : mouseX) * 0.001;
        targetY = (isNaN(mouseY) ? 0 : mouseY) * 0.001;

        if (bikeModel) {
            bikeGroup.rotation.y += 0.05 * (targetX - bikeGroup.rotation.y);
            bikeGroup.rotation.x += 0.05 * (targetY - bikeGroup.rotation.x);
            
            bikeModel.rotation.y = (Math.PI / 4) + (time * 0.15);

            if (bikeModel.userData.gears) {
                bikeModel.userData.gears.forEach(gear => {
                    gear.mesh.rotation.x += gear.speed; 
                });
            }
            if (bikeModel.userData.pistons) {
                bikeModel.userData.pistons.forEach(piston => {
                    piston.mesh.position.y = Math.sin((time * 5) + piston.offset) * 0.15;
                });
            }
            if (bikeModel.userData.wires) {
                const pulse = Math.sin(time * 4) * 0.05 + 1.0;
                bikeModel.userData.wires.forEach(wire => {
                    wire.scale.setScalar(pulse);
                });
            }
        }
        
        // Simple and safe particle rotation
        particleMesh.rotation.y = -0.05 * time;
        particleMesh.rotation.x = 0.02 * targetY;

        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    };

    tick();

    const handleResize = () => {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
        // Signal the animation loop to stop
        cleanedUpRef.current = true;
        
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', handleScroll);
        
        // Dispose of Three.js resources
        renderer.dispose();
        scene.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(m => m.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        
        if (mountNode && renderer.domElement && mountNode.contains(renderer.domElement)) {
            mountNode.removeChild(renderer.domElement);
        }
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }} />;
};

export default ThreeBg;
