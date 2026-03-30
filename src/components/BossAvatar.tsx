import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BossState } from '../types';

interface BossAvatarProps {
  boss: BossState;
}

export const BossAvatar: React.FC<BossAvatarProps> = ({ boss }) => {
  const [isPoked, setIsPoked] = useState(false);

  const handlePoke = () => {
    if (isPoked) return;
    setIsPoked(true);
    setTimeout(() => setIsPoked(false), 600);
  };

  const getBossEmoji = () => {
    if (isPoked) return '😣';
    if (boss.isPaused) return '😴';
    if (boss.reaction === 'angry') return '💢';
    if (boss.reaction === 'happy') return '😎';
    if (boss.reaction === 'surprised') return '😲';
    if (boss.reaction === 'sleeping') return '💤';
    if (boss.reaction === 'focused') return '🧐';
    if (boss.reaction === 'taunting') return '😜';
    if (boss.reaction === 'scared') return '😨';
    if (boss.reaction === 'confused') return '😵‍💫';
    if (boss.reaction === 'evil') return '😈';
    if (boss.reaction === 'dizzy') return '🌀';
    if (boss.progress > 400) return '👿';
    return '🐰';
  };

  return (
    <div id="boss-projectile-start" className="relative w-full aspect-square flex items-center justify-center mb-4 z-10 max-w-[200px]" style={{ perspective: 1000 }}>
      {/* 2.5D Parallax Container */}
      <motion.div
        className="w-full h-full flex items-center justify-center relative"
      >
        {/* Aura Effect */}
        <motion.div
          animate={{
            scale: boss.reaction === 'angry' ? [1.2, 1.5, 1.2] : [1, 1.2, 1],
            opacity: boss.reaction === 'angry' ? [0.2, 0.5, 0.2] : [0.05, 0.2, 0.05],
            backgroundColor: boss.reaction === 'angry' ? '#ef4444' : (boss.isPaused ? '#60a5fa' : '#a855f7'),
          }}
          transition={{ repeat: Infinity, duration: boss.reaction === 'angry' ? 0.5 : 2 }}
          className="absolute w-32 h-32 rounded-full blur-3xl -z-10"
        />

        {/* Binky Avatar */}
        <motion.div
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.4}
          onTap={handlePoke}
          animate={{
            y: isPoked ? 0 : (boss.reaction === 'happy' ? [0, -25, 0] : [0, -10, 0]),
            x: (boss.reaction === 'angry' || boss.reaction === 'scared' || boss.reaction === 'dizzy') ? [-6, 6, -6, 6, 0] : 0,
            rotateZ: isPoked ? [-15, 15, -15, 0] : (boss.isPaused ? 0 : (boss.reaction === 'angry' ? [-10, 10, -10] : (boss.reaction === 'dizzy' ? [0, 360] : [0, 3, -3, 0]))),
            scale: isPoked ? 0.8 : (boss.isSlowed ? 0.8 : (boss.reaction === 'happy' ? 1.2 : (boss.progress > 400 ? 1.15 : 1))),
            scaleY: isPoked ? 0.5 : (boss.reaction === 'happy' ? [1, 1.15, 1] : [1, 1.05, 1]), // Squash and Stretch
            scaleX: isPoked ? 1.5 : (boss.reaction === 'happy' ? [1, 0.9, 1] : [1, 0.98, 1]),  // Squash and Stretch
            filter: boss.isBlurred ? 'blur(8px)' : 'blur(0px)',
          }}
          transition={{
            rotateZ: { repeat: isPoked ? 0 : Infinity, duration: isPoked ? 0.3 : ((boss.reaction === 'angry' || boss.reaction === 'scared') ? 0.2 : (boss.reaction === 'dizzy' ? 1 : 3)), ease: "easeInOut" },
            y: { repeat: isPoked ? 0 : Infinity, duration: isPoked ? 0.6 : (boss.reaction === 'happy' ? 0.5 : 3), ease: "easeInOut" },
            scaleY: { repeat: isPoked ? 0 : Infinity, duration: isPoked ? 0.6 : (boss.reaction === 'happy' ? 0.5 : 3), ease: "easeInOut" },
            scaleX: { repeat: isPoked ? 0 : Infinity, duration: isPoked ? 0.6 : (boss.reaction === 'happy' ? 0.5 : 3), ease: "easeInOut" },
            scale: { type: 'spring', stiffness: 400, damping: 15 }
          }}
          className="text-[120px] select-none relative drop-shadow-2xl cursor-grab active:cursor-grabbing origin-bottom"
        >
          {getBossEmoji()}

          {/* Sweat Drops */}
          {(boss.reaction === 'angry' || boss.reaction === 'scared') && (
            <div className="absolute top-0 right-0 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: 50, opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.3 }}
                  className="absolute text-2xl text-blue-400"
                  style={{ right: i * 15 }}
                >
                  💧
                </motion.span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Speech Bubble */}
        <AnimatePresence mode="wait">
          <motion.div
            key={boss.message}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            className="absolute -top-10 -right-6 bg-white p-3.5 rounded-2xl rounded-bl-none text-xs font-bold text-slate-700 max-w-[140px] shadow-lg z-20 border border-slate-200 pointer-events-none"
            style={{ transformStyle: "preserve-3d", translateZ: 30 }} // Popping out a bit
          >
            {boss.message}
            <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-0 h-0 border-8 border-transparent border-t-white -rotate-45" />
          </motion.div>
        </AnimatePresence>

        {/* Juice: Pause Effect */}
        <AnimatePresence>
          {boss.isPaused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="absolute inset-0 bg-white/40 backdrop-blur-sm z-30 flex items-center justify-center rounded-full pointer-events-none"
            >
              <motion.span
                animate={{ y: [0, -30], opacity: [1, 0], scale: [1, 1.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-5xl"
              >
                {boss.lastAction === 'golden-nap' ? '💤' : '☕'}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Juice: Slow Cookies */}
        {boss.isSlowed && (
          <div className="absolute inset-0 pointer-events-none z-30">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{
                  x: [0, (i - 2) * 50],
                  y: [0, 60],
                  opacity: [0, 1, 0],
                  rotate: [0, 360],
                }}
                transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.4 }}
                className="absolute top-1/2 left-1/2 text-2xl"
              >
                🍪
              </motion.span>
            ))}
          </div>
        )}

        {/* Hit Effect (Angry) */}
        {boss.reaction === 'angry' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }}
            className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
          >
            <div className="w-full h-full border-6 border-red-500 rounded-full animate-ping" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
