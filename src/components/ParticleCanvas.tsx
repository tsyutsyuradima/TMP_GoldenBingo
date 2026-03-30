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

        // Add trail particles
        if (Math.random() > 0.5) {
          particlesRef.current.push({
            x: p.x,
            y: p.y,
            color: p.color,
            size: p.size * 0.6,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            gravity: 0.05,
            life: 0.5,
            decay: 0.02
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
      const { x, y, color, count = 20 } = e.detail;
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x, y, color,
          size: Math.random() * 4 + 2,
          speedX: (Math.random() - 0.5) * 12,
          speedY: (Math.random() - 0.5) * 12,
          gravity: 0.25,
          life: 1.0,
          decay: Math.random() * 0.02 + 0.015,
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

export const triggerExplosion = (x: number, y: number, color: string, count?: number) => {
  window.dispatchEvent(new CustomEvent('bingo-explosion', { detail: { x, y, color, count } }));
};

export const triggerProjectile = (startX: number, startY: number, targetX: number, targetY: number, color: string, onComplete?: () => void) => {
  window.dispatchEvent(new CustomEvent('bingo-projectile', { detail: { startX, startY, targetX, targetY, color, onComplete } }));
};
