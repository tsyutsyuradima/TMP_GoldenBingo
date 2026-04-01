import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BossState } from '../types';

interface BossAvatarProps {
  boss: BossState;
}

// Aura config per reaction
const AURA: Record<string, { color: string; scale: number[]; opacity: number[]; duration: number }> = {
  idle:      { color: '#a855f7', scale: [1, 1.2, 1],     opacity: [0.05, 0.18, 0.05], duration: 2 },
  angry:     { color: '#ef4444', scale: [1.2, 1.7, 1.2], opacity: [0.25, 0.6,  0.25], duration: 0.35 },
  evil:      { color: '#581c87', scale: [1.3, 2.0, 1.3], opacity: [0.3,  0.65, 0.3],  duration: 0.3 },
  sleeping:  { color: '#6366f1', scale: [1.0, 1.35, 1.0],opacity: [0.08, 0.2,  0.08], duration: 3.5 },
  confused:  { color: '#94a3b8', scale: [1.0, 1.2,  1.0],opacity: [0.1,  0.25, 0.1],  duration: 1.5 },
  happy:     { color: '#facc15', scale: [1.1, 1.55, 1.1],opacity: [0.15, 0.4,  0.15], duration: 0.7 },
  scared:    { color: '#f59e0b', scale: [1.0, 1.5,  1.0],opacity: [0.1,  0.35, 0.1],  duration: 0.28 },
  taunting:  { color: '#c026d3', scale: [1.1, 1.45, 1.1],opacity: [0.1,  0.3,  0.1],  duration: 0.9 },
  focused:   { color: '#3b82f6', scale: [1.0, 1.25, 1.0],opacity: [0.07, 0.2,  0.07], duration: 2.5 },
  surprised: { color: '#f97316', scale: [1.0, 1.6,  1.0],opacity: [0.15, 0.5,  0.15], duration: 0.5 },
  dizzy:     { color: '#ec4899', scale: [0.9, 1.4,  0.9],opacity: [0.1,  0.3,  0.1],  duration: 1.5 },
};

// --- Overlay Effects ---

const ZzzEffect: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-visible">
    {(['z', 'Z', 'zzz'] as const).map((z, i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0, y: 0, x: 0, scale: 0.6 }}
        animate={{ opacity: [0, 0.9, 0], y: -70 - i * 20, x: 20 + i * 18, scale: [0.6, 1.1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2.2, delay: i * 0.7, ease: 'easeOut', type: "tween" }}
        className="absolute top-2 right-4 text-indigo-300 font-black select-none"
        style={{ fontSize: 14 + i * 6 }}
      >
        {z}
      </motion.span>
    ))}
    {/* Dreamy ring */}
    <motion.div
      animate={{ scale: [1, 1.6, 1], opacity: [0.12, 0.0, 0.12] }}
      transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', type: "tween" }}
      className="absolute inset-0 m-auto w-28 h-28 rounded-full border-2 border-indigo-400"
      style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
    />
  </div>
);

const EvilSparksEffect: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-visible">
    {/* Expanding dark rings */}
    {[0, 0.3, 0.6].map((delay, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0.5, opacity: 0.7 }}
        animate={{ scale: [0.5, 2.2], opacity: [0.5, 0] }}
        transition={{ repeat: Infinity, duration: 1.1, delay, ease: 'easeOut' }}
        className="absolute rounded-full border-2 border-purple-500"
        style={{ inset: '20%' }}
      />
    ))}
    {/* Dark sparks flying out */}
    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
        animate={{
          opacity: [0, 1, 0],
          x: Math.cos((angle * Math.PI) / 180) * 55,
          y: Math.sin((angle * Math.PI) / 180) * 55,
          scale: [0, 1.2, 0],
        }}
        transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.15, ease: 'easeOut', type: "tween" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-300 select-none"
        style={{ fontSize: 10 + (i % 3) * 4 }}
      >
        ✦
      </motion.span>
    ))}
  </div>
);

const ConfusedOrbitsEffect: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none">
    {/* Blurring rings */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
      className="absolute inset-0 m-auto"
      style={{ width: 140, height: 140, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
    >
      {['?', '?', '?'].map((q, i) => (
        <span
          key={i}
          className="absolute text-xl font-black text-slate-400 select-none"
          style={{
            top: '50%',
            left: '50%',
            transform: `rotate(${i * 120}deg) translateY(-60px) rotate(${-(i * 120)}deg) translate(-50%,-50%)`,
          }}
        >
          {q}
        </span>
      ))}
    </motion.div>
    {/* Fog rings */}
    {[0, 0.5].map((delay, i) => (
      <motion.div
        key={i}
        animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0, 0.15] }}
        transition={{ repeat: Infinity, duration: 2.5, delay, ease: 'easeInOut', type: "tween" }}
        className="absolute rounded-full border border-slate-400"
        style={{ inset: i === 0 ? '25%' : '15%' }}
      />
    ))}
  </div>
);

const HappySparklesEffect: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-visible">
    {[{ x: -30, delay: 0 }, { x: 30, delay: 0.3 }, { x: 0, delay: 0.6 }, { x: -50, delay: 0.9 }, { x: 50, delay: 1.2 }].map((p, i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0, y: 10, x: p.x, scale: 0.5 }}
        animate={{ opacity: [0, 1, 0], y: -60 - i * 8, x: p.x + (i % 2 === 0 ? 8 : -8), scale: [0.5, 1.3, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: p.delay, ease: 'easeOut', type: "tween" }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-yellow-300 select-none"
        style={{ fontSize: 14 + (i % 3) * 4 }}
      >
        {i % 2 === 0 ? '✨' : '⭐'}
      </motion.span>
    ))}
  </div>
);

const ScaredEffect: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-visible">
    {/* Amber ripple rings */}
    {[0, 0.25, 0.5].map((delay, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0.6, opacity: 0.5 }}
        animate={{ scale: [0.6, 2.0], opacity: [0.4, 0] }}
        transition={{ repeat: Infinity, duration: 0.9, delay, ease: 'easeOut' }}
        className="absolute rounded-full border-2 border-amber-400"
        style={{ inset: '25%' }}
      />
    ))}
    {/* Sweat drops */}
    {[0, 1, 2].map(i => (
      <motion.span
        key={i}
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 55, opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.28, type: "tween" }}
        className="absolute text-2xl text-blue-300 select-none"
        style={{ top: '10%', right: `${10 + i * 14}%` }}
      >
        💧
      </motion.span>
    ))}
  </div>
);

const AngryEffect: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-visible">
    {[0, 0.2, 0.4].map((delay, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0.5, opacity: 0.8 }}
        animate={{ scale: [0.5, 2.4], opacity: [0.6, 0] }}
        transition={{ repeat: Infinity, duration: 0.6, delay, ease: 'easeOut' }}
        className="absolute rounded-full border-2 border-red-500"
        style={{ inset: '15%' }}
      />
    ))}
    {/* Rage sparks */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0, x: 0, y: 0 }}
        animate={{
          opacity: [0, 1, 0],
          x: Math.cos((angle * Math.PI) / 180) * 60,
          y: Math.sin((angle * Math.PI) / 180) * 60,
        }}
        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.06, ease: 'easeOut', type: "tween" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-400 font-black select-none"
        style={{ fontSize: 10 }}
      >
        ✦
      </motion.span>
    ))}
  </div>
);

export const BossAvatar: React.FC<BossAvatarProps> = ({ boss }) => {
  const [isPoked, setIsPoked] = useState(false);
  const aura = AURA[boss.reaction] ?? AURA.idle;

  const handlePoke = () => {
    if (isPoked) return;
    setIsPoked(true);
    setTimeout(() => setIsPoked(false), 600);
  };

  const bodyFilter =
    boss.reaction === 'confused' ? 'blur(3px) brightness(0.75) grayscale(0.5)' :
    boss.reaction === 'sleeping' ? 'blur(1.5px) brightness(0.8) saturate(0.5)' :
    undefined;

  return (
    <div id="boss-projectile-start" className="relative w-full aspect-square flex items-center justify-center mb-4 z-10 max-w-[200px]" style={{ perspective: 1000 }}>
      <motion.div className="w-full h-full flex items-center justify-center relative">

        {/* Dynamic Aura */}
        <motion.div
          animate={{ scale: aura.scale, opacity: aura.opacity, backgroundColor: aura.color }}
          transition={{ repeat: Infinity, duration: aura.duration, type: "tween" }}
          className="absolute w-32 h-32 rounded-full blur-3xl -z-10"
        />

        {/* Reaction overlays */}
        <AnimatePresence>
          {boss.reaction === 'sleeping' && <ZzzEffect key="zzz" />}
          {boss.reaction === 'evil' && <EvilSparksEffect key="evil" />}
          {boss.reaction === 'confused' && <ConfusedOrbitsEffect key="confused" />}
          {boss.reaction === 'happy' && <HappySparklesEffect key="happy" />}
          {boss.reaction === 'scared' && <ScaredEffect key="scared" />}
          {boss.reaction === 'angry' && <AngryEffect key="angry" />}
        </AnimatePresence>

        {/* Binky Avatar */}
        <motion.div
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.4}
          onTap={handlePoke}
          animate={{
            y: isPoked ? 0 : (boss.reaction === 'happy' ? [0, -25, 0] : boss.reaction === 'sleeping' ? [0, -5, 0] : [0, -10, 0]),
            x: (boss.reaction === 'angry' || boss.reaction === 'scared' || boss.reaction === 'dizzy') ? [-6, 6, -6, 6, 0] : 0,
            rotateZ: isPoked
              ? [-15, 15, -15, 0]
              : boss.reaction === 'angry' ? [-10, 10, -10]
              : boss.reaction === 'dizzy' ? [0, 360]
              : boss.reaction === 'confused' ? [-8, 8, -5, 5, 0]
              : [0, 3, -3, 0],
            scale: isPoked ? 0.8 : boss.reaction === 'happy' ? 1.2 : boss.reaction === 'evil' ? [1, 1.1, 1] : 1,
            scaleY: isPoked ? 0.5 : boss.reaction === 'happy' ? [1, 1.15, 1] : [1, 1.05, 1],
            scaleX: isPoked ? 1.5 : boss.reaction === 'happy' ? [1, 0.9, 1] : [1, 0.98, 1],
          }}
          transition={{
            rotateZ: { type: "tween", repeat: isPoked ? 0 : Infinity, duration: isPoked ? 0.3 : (boss.reaction === 'angry' || boss.reaction === 'scared') ? 0.2 : boss.reaction === 'dizzy' ? 1 : boss.reaction === 'confused' ? 0.6 : 3, ease: 'easeInOut' },
            y: { type: "tween", repeat: isPoked ? 0 : Infinity, duration: isPoked ? 0.6 : boss.reaction === 'happy' ? 0.5 : boss.reaction === 'sleeping' ? 4 : 3, ease: 'easeInOut' },
            scaleY: { type: "tween", repeat: isPoked ? 0 : Infinity, duration: isPoked ? 0.6 : boss.reaction === 'happy' ? 0.5 : 3, ease: 'easeInOut' },
            scaleX: { type: "tween", repeat: isPoked ? 0 : Infinity, duration: isPoked ? 0.6 : boss.reaction === 'happy' ? 0.5 : 3, ease: 'easeInOut' },
            scale: { type: "tween", ease: 'easeInOut', repeat: isPoked ? 0 : Infinity, duration: 0.8 },
            x: { type: "tween", ease: 'easeInOut', repeat: isPoked ? 0 : Infinity, duration: (boss.reaction === 'angry' || boss.reaction === 'scared' || boss.reaction === 'dizzy') ? 0.4 : 1 },
          }}
          style={{ filter: bodyFilter }}
          className="text-[120px] select-none relative drop-shadow-2xl cursor-grab active:cursor-grabbing origin-bottom z-10"
        >
          😈
        </motion.div>
      </motion.div>
    </div>
  );
};
