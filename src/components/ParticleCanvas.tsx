import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  color: string;
  size: number;
  speedX: number;
  speedY: number;
  gravity: number;
  life: number;
  decay: number;
}

interface Projectile {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: string;
  size: number;
  speed: number;
  onComplete?: () => void;
}

export const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    let animationFrame: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update Particles
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
      particlesRef.current.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += p.gravity;
        p.life -= p.decay;

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update Projectiles
      projectilesRef.current = projectilesRef.current.filter(p => {
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < p.speed) {
          // Impact Explosion!
          const impactCount = 40 + Math.random() * 20; // Huge explosion
          window.dispatchEvent(new CustomEvent('bingo-explosion', { 
            detail: { x: p.targetX, y: p.targetY, color: p.color, count: impactCount, power: 1.5 } 
          }));

          if (p.onComplete) p.onComplete();
          return false;
        }

        const angle = Math.atan2(dy, dx);
        p.x += Math.cos(angle) * p.speed;
        p.y += Math.sin(angle) * p.speed;

        ctx.globalAlpha = 1;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Add trailing exhaust particles (rocket thrust)
        if (Math.random() > 0.2) {
          particlesRef.current.push({
            x: p.x - Math.cos(angle) * (p.size + 2), // Spawn behind the rocket
            y: p.y - Math.sin(angle) * (p.size + 2),
            color: p.color === '#a855f7' ? (Math.random() > 0.5 ? '#e879f9' : '#fff') : p.color, // Add some heat variation
            size: p.size * (0.4 + Math.random() * 0.4),
            speedX: -Math.cos(angle) * (1 + Math.random() * 3) + (Math.random() - 0.5) * 2, // Blast backwards
            speedY: -Math.sin(angle) * (1 + Math.random() * 3) + (Math.random() - 0.5) * 2,
            gravity: 0.1,
            life: 0.8,
            decay: 0.03 + Math.random() * 0.02
          });
        }

        return true;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  // Listen for custom events
  useEffect(() => {
    const handleExplosion = (e: any) => {
      const { x, y, color, count = 20, power = 1 } = e.detail;
      
      // Core flash (white/yellowish sparks)
      for (let i = 0; i < count * 0.4; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 20 * power + 5;
        particlesRef.current.push({
          x, y, color: '#ffffff',
          size: Math.random() * 3 + 1,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed,
          gravity: 0.1,
          life: 1.0,
          decay: Math.random() * 0.05 + 0.04, // Very fast decay
        });
      }

      // Main colored debris
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 * power;
        particlesRef.current.push({
          x, y, color,
          size: Math.random() * 6 + 3,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed,
          gravity: 0.3, // Heavier
          life: 1.0,
          decay: Math.random() * 0.02 + 0.01,
        });
      }
    };

    const handleProjectile = (e: any) => {
      const { startX, startY, targetX, targetY, color, speed = 15, size = 6, onComplete } = e.detail;
      projectilesRef.current.push({
        x: startX,
        y: startY,
        targetX,
        targetY,
        color,
        speed,
        size,
        onComplete
      });
    };

    window.addEventListener('bingo-explosion', handleExplosion);
    window.addEventListener('bingo-projectile', handleProjectile);
    return () => {
      window.removeEventListener('bingo-explosion', handleExplosion);
      window.removeEventListener('bingo-projectile', handleProjectile);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none z-[100]"
    />
  );
};

export const triggerExplosion = (x: number, y: number, color: string, count?: number, power?: number) => {
  window.dispatchEvent(new CustomEvent('bingo-explosion', { detail: { x, y, color, count, power } }));
};

export const triggerProjectile = (startX: number, startY: number, targetX: number, targetY: number, color: string, onComplete?: () => void) => {
  // Liftoff explosion
  triggerExplosion(startX, startY, color, 15, 0.5);
  
  window.dispatchEvent(new CustomEvent('bingo-projectile', { detail: { startX, startY, targetX, targetY, color, onComplete } }));
};
