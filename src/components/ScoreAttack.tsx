import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TARGET_SCORE } from '../constants';
import { Milestone } from '../types';

interface ScoreAttackProps {
  currentScore: number;
  milestones: Milestone[];
  onCollect: (score: number) => void;
}

const MilestonePopup: React.FC<{ milestone: Milestone; onCollect: (score: number) => void }> = ({ milestone, onCollect }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onCollect(milestone.score);
    }, 4000);
    return () => clearTimeout(timer);
  }, [milestone.score, onCollect]);

  return (
    <motion.button
      initial={{ scale: 0, x: '-50%' }}
      animate={{ scale: 1, x: '-50%' }}
      exit={{ scale: 0, x: '-50%' }}
      whileHover={{ scale: 1.1, x: '-50%' }}
      whileTap={{ scale: 0.9, x: '-50%' }}
      onClick={() => onCollect(milestone.score)}
      className="absolute -top-16 left-1/2 bg-slate-900 border-2 border-amber-400 text-white px-4 py-2 rounded-xl text-[10px] font-black whitespace-nowrap shadow-xl z-40"
    >
      COLLECT {milestone.reward} 🪙
      <div className="w-full h-1 bg-white/20 mt-1 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: 0 }}
          transition={{ duration: 4, ease: "linear" }}
          className="h-full bg-amber-400"
        />
      </div>
    </motion.button>
  );
};

export const ScoreAttack: React.FC<ScoreAttackProps> = ({
  currentScore,
  milestones,
  onCollect,
}) => {
  const percent = Math.min((currentScore / TARGET_SCORE) * 100, 100);
  const [hoveredMilestone, setHoveredMilestone] = useState<number | null>(null);

  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-10">
      <div className="flex-1">
        <div className="flex justify-between items-end mb-4 px-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <span className="text-sm font-black text-slate-900 uppercase tracking-tighter italic">Score Attack Challenge</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Get {TARGET_SCORE} for a Super Reward</p>
          </div>
          <span id="score-display" className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">
            {currentScore}<span className="text-slate-200 text-xl mx-0.5">/</span><span className="text-slate-400 text-xl">{TARGET_SCORE}</span>
          </span>
        </div>

        <div className="relative h-9 bg-slate-100 rounded-full p-1 border-2 border-slate-200 shadow-inner flex items-center">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 shadow-[0_6px_15px_rgba(245,158,11,0.2)]"
          />

          {milestones.map((m, i) => {
            const pos = (m.score / TARGET_SCORE) * 100;
            return (
              <div
                key={i}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `${pos}%` }}
              >
                <div
                  className={`relative cursor-pointer transition-all duration-300 ${m.reached ? 'grayscale-0 scale-125 opacity-100' : 'grayscale opacity-50'}`}
                  onMouseEnter={() => setHoveredMilestone(m.score)}
                  onMouseLeave={() => setHoveredMilestone(null)}
                >
                  <span className="text-xl">🎁</span>
                  
                  <AnimatePresence>
                    {hoveredMilestone === m.score && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -10, x: '-50%' }}
                        className="absolute bottom-full mb-2 left-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-black whitespace-nowrap z-50"
                      >
                        REWARD: {m.reward.toLocaleString()} 🪙
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {m.reached && !m.collected && (
                    <MilestonePopup milestone={m} onCollect={onCollect} />
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-24 h-24 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner flex flex-col items-center justify-center relative shrink-0">
        <span className="text-5xl select-none">🧰</span>
        <div className="absolute -bottom-2 bg-slate-900 text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-black border border-amber-400">
          10,000 🪙
        </div>
      </div>
    </div>
  );
};
