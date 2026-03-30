import React from 'react';
import { motion } from 'motion/react';
import { BossState } from '../types';
import { BOSS_CONFIG } from '../config/bossConfig';

interface BossProgressBarProps {
  boss: BossState;
}

export const BossProgressBar: React.FC<BossProgressBarProps> = ({ boss }) => {
  const jarPercent = (boss.progress / BOSS_CONFIG.maxProgress) * 100;

  if (boss.type === 'goal') {
    return (
      <div className="w-full flex flex-col items-center gap-3 z-10">
        <div className="relative w-28 h-40 bg-white/60 border-4 border-slate-300/50 rounded-b-[2rem] rounded-t-lg overflow-hidden shadow-inner">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${jarPercent}%` }}
            className={`absolute bottom-0 left-0 w-full transition-colors duration-1000 ${
              boss.progress > 400
                ? 'bg-gradient-to-t from-red-600 to-orange-400'
                : 'bg-gradient-to-t from-purple-600 to-indigo-400'
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-4 bg-white/20 animate-pulse" />
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -80],
                    x: [0, (i % 2 === 0 ? 8 : -8)],
                    opacity: [0, 0.5, 0],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2 + Math.random() * 2,
                    delay: Math.random() * 2,
                  }}
                  className="absolute w-1.5 h-1.5 rounded-full bg-white/40"
                  style={{ left: `${Math.random() * 100}%`, bottom: '-10%' }}
                />
              ))}
            </div>
          </motion.div>
          <div className="absolute top-0 right-3 w-3 h-full bg-white/10 skew-x-6" />
        </div>

        <div className="text-center">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Boss Progress</p>
          <motion.p
            key={Math.floor(jarPercent)}
            initial={{ scale: 1.2, color: '#ef4444' }}
            animate={{ scale: 1, color: '#1e293b' }}
            className="text-xl font-black tracking-tighter"
          >
            {Math.floor(jarPercent)}%
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-4 z-10">
      <div className="bg-red-100/60 border-2 border-red-200/50 p-4 rounded-2xl text-center max-w-[180px] shadow-sm">
        <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-2">Active Boss Mode</p>
        <p className="text-[10px] text-slate-600 font-medium leading-tight mb-3">
          Binky blocks cells and removes your daubs!
        </p>

        <div className="w-full h-3 bg-red-100 rounded-full overflow-hidden relative border border-red-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${boss.nextActionProgress}%` }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-orange-500"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[7px] font-black text-red-900 uppercase tracking-tighter mix-blend-overlay">Next Action</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {boss.blockedCells.length > 0 ? (
          boss.blockedCells.map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
              className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center text-xs shadow-lg shadow-red-200/50 border-2 border-red-400"
            >
              🚫
            </motion.div>
          ))
        ) : (
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">No cells blocked</div>
        )}
      </div>
    </div>
  );
};
