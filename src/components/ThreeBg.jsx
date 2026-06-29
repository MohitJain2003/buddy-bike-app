import { useEffect, useRef } from 'react';

const ThreeBg = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const getTheme = () => document.documentElement.getAttribute('data-theme') || 'dark';

    // Particle class representing a point in 3D space
    class Particle {
      constructor() {
        this.reset();
        // Distribute initial particles across the Z depth
        this.z = Math.random() * 1000;
      }

      reset() {
        this.x = (Math.random() - 0.5) * width * 2.5;
        this.y = (Math.random() - 0.5) * height * 2.5;
        this.z = 1000; // start far away
        this.vx = (Math.random() - 0.5) * 0.15;
        this.vy = (Math.random() - 0.5) * 0.15;
        this.vz = -(Math.random() * 0.5 + 0.25); // move towards camera
        this.radius = Math.random() * 1.2 + 0.4;
        this.isAccent = Math.random() > 0.85;
      }

      update(mouseX, mouseY) {
        this.x += this.vx - mouseX * 0.15;
        this.y += this.vy - mouseY * 0.15;
        this.z += this.vz;

        if (this.z <= 0) {
          this.reset();
        }
      }

      draw(projX, projY, isDark) {
        const fov = 300;
        const scale = fov / (fov + this.z);
        const x2d = this.x * scale + projX;
        const y2d = this.y * scale + projY;
        const r2d = this.radius * scale * (isDark ? 5 : 6);

        let alpha = 1.0;
        if (this.z > 800) alpha = (1000 - this.z) / 200;
        if (this.z < 200) alpha = this.z / 200;

        let color;
        if (this.isAccent) {
          color = isDark
            ? `rgba(220, 38, 38, ${alpha * 0.5})`
            : `rgba(220, 38, 38, ${alpha * 0.65})`;
        } else {
          color = isDark
            ? `rgba(255, 255, 255, ${alpha * 0.3})`
            : `rgba(220, 38, 38, ${alpha * 0.35})`;
        }

        ctx.beginPath();
        ctx.arc(x2d, y2d, r2d, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    const particles = Array.from({ length: 100 }, () => new Particle());

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    };

    let lastWidth = window.innerWidth;
    const handleResize = () => {
      const newWidth = window.innerWidth;
      // Only resize if the width changed (e.g. orientation change or desktop resize)
      // to prevent mobile address bar scrolls from clearing/flickering the canvas
      if (newWidth !== lastWidth) {
        width = canvas.width = newWidth;
        height = canvas.height = window.innerHeight;
        lastWidth = newWidth;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const render = () => {
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const projX = width / 2;
      const projY = height / 2;
      const isDark = getTheme() !== 'light';

      particles.forEach((p) => {
        p.update(targetX, targetY);
        p.draw(projX, projY, isDark);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -2,
      pointerEvents: 'none',
      background: 'var(--bg-primary)',
      overflow: 'hidden',
      transition: 'background 0.3s ease',
    }}>
      {/* Floating Ambient Glow 1 (Red) */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '20%',
        width: '50vw',
        height: '50vw',
        background: 'radial-gradient(circle, rgba(220, 38, 38, 0.07) 0%, rgba(220, 38, 38, 0) 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />

      {/* Floating Ambient Glow 2 */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        width: '60vw',
        height: '60vw',
        background: 'radial-gradient(circle, rgba(240, 240, 245, 0.015) 0%, rgba(240, 240, 245, 0) 70%)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        pointerEvents: 'none',
      }} />

      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
};

export default ThreeBg;
