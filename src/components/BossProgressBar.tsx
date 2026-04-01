import React from 'react';
import { motion } from 'motion/react';
import { BossState } from '../types';

interface BossProgressBarProps {
  boss: BossState;
}

export const BossProgressBar: React.FC<BossProgressBarProps> = ({ boss }) => {
  const hasEffects = boss.blockedCells.length > 0 || boss.frozenCells.length > 0 || boss.blindCells.length > 0;

  return (
    <div className="w-full flex flex-col items-center gap-2 z-10 mt-2">
      {hasEffects ? (
        <div className="flex flex-wrap justify-center gap-2">
          {boss.blockedCells.map((_, i) => (
            <motion.div
              key={`block-${i}`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.2, type: "tween" }}
              className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center text-xs shadow-lg shadow-red-200/50 border-2 border-red-400"
              title="Blocked cell"
            >
              🚫
            </motion.div>
          ))}
          {boss.frozenCells.map((_, i) => (
            <motion.div
              key={`freeze-${i}`}
              animate={{ scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.3, type: "tween" }}
              className="w-7 h-7 bg-blue-300 rounded-lg flex items-center justify-center text-xs shadow-lg shadow-blue-200/50 border-2 border-blue-400"
              title="Frozen cell"
            >
              ❄️
            </motion.div>
          ))}
          {boss.blindCells.map((_, i) => (
            <motion.div
              key={`blind-${i}`}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.25, type: "tween" }}
              className="w-7 h-7 bg-slate-700 rounded-lg flex items-center justify-center text-xs shadow-lg border-2 border-slate-600"
              title="Blinded cell"
            >
              ❓
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">No active effects</div>
      )}
    </div>
  );
};
