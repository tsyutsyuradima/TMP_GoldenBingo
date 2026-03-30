import { triggerProjectile } from '../components/ParticleCanvas';

export const fireBossProjectile = (targetSelector: string | null, color: string, onComplete: () => void) => {
  const startEl = document.getElementById('boss-projectile-start');
  if (!startEl) {
    onComplete();
    return;
  }
  const startRect = startEl.getBoundingClientRect();
  const startX = startRect.left + startRect.width / 2;
  const startY = startRect.top + startRect.height / 2;

  if (targetSelector) {
    const endEl = document.querySelector(targetSelector);
    if (endEl) {
      const endRect = endEl.getBoundingClientRect();
      const targetX = endRect.left + endRect.width / 2;
      const targetY = endRect.top + endRect.height / 2;
      triggerProjectile(startX, startY, targetX, targetY, color, onComplete);
    } else {
      onComplete();
    }
  } else {
    onComplete();
  }
};

export const firePlayerProjectile = (color: string, onComplete: () => void) => {
  const endEl = document.getElementById('boss-projectile-start');
  if (!endEl) {
    onComplete();
    return;
  }
  const endRect = endEl.getBoundingClientRect();
  const targetX = endRect.left + endRect.width / 2;
  const targetY = endRect.top + endRect.height / 2;

  // Spawn from center bottom of the screen (simulating the UI/Player controls)
  const startX = window.innerWidth / 2;
  const startY = window.innerHeight - 50;

  triggerProjectile(startX, startY, targetX, targetY, color, onComplete);
};
