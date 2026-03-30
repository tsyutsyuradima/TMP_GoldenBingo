import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TARGET_SCORE } from '../constants';
import { Milestone, BossState } from '../types';

interface ScoreAttackProps {
  currentScore: number;
  milestones: Milestone[];
  onCollect: (score: number) => void;
  boss: BossState;
}

const MilestoneNotification: React.FC<{ milestone: Milestone; onCollect: (score: number) => void }> = ({ milestone, onCollect }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onCollect(milestone.score);
    }, 4000);
    return () => clearTimeout(timer);
  }, [milestone.score, onCollect]);

  return (
    <motion.button
      initial={{ scale: 0, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0, y: -20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onCollect(milestone.score)}
      className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-5 py-2 rounded-full text-sm font-black shadow-lg border-2 border-amber-300"
    >
      COLLECT {milestone.reward} 🪙
      <div className="w-full h-1 bg-white/20 mt-1 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: 0 }}
          transition={{ duration: 4, ease: "linear" }}
          className="h-full bg-white/60"
        />
      </div>
    </motion.button>
  );
};

export const ScoreAttack: React.FC<ScoreAttackProps> = ({
  currentScore,
  milestones,
  onCollect,
  boss,
}) => {
  const playerLeading = currentScore >= boss.progress;
  const percent = Math.min((currentScore / TARGET_SCORE) * 100, 100);

  return (
    <div className="w-full flex flex-col items-center gap-2">
      {/* VS Score Bar */}
      <div className="w-full bg-slate-800/90 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between shadow-xl border border-white/10">
        {/* Player Side */}
        <div className="flex items-center gap-3">
          <div className="relative">
            {playerLeading && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-sm">👑</span>
            )}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-lg shadow-md border-2 border-blue-300/50">
              👤
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black text-xl sm:text-2xl tabular-nums leading-none">
              {currentScore.toLocaleString()}
            </span>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">You</span>
          </div>
        </div>

        {/* Score Progress Bar */}
        <div className="flex-1 mx-4 sm:mx-8">
          <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full"
            />
            {/* Milestone markers */}
            {milestones.map((m, i) => {
              const pos = (m.score / TARGET_SCORE) * 100;
              return (
                <div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                  style={{ left: `${pos}%` }}
                >
                  <span className={`text-xs ${m.reached ? 'grayscale-0 opacity-100' : 'grayscale opacity-40'}`}>🎁</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-0.5 px-0.5">
            <span className="text-[7px] text-slate-500 font-bold">0</span>
            <span className="text-[7px] text-amber-400 font-black">{TARGET_SCORE}</span>
          </div>
        </div>

        {/* VS */}
        <span className="text-slate-500 font-black text-xs uppercase tracking-widest mx-1">vs</span>

        {/* Boss Side */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-white font-black text-xl sm:text-2xl tabular-nums leading-none">
              {boss.progress.toLocaleString()}
            </span>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Binky</span>
          </div>
          <div className="relative">
            {!playerLeading && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-sm">👑</span>
            )}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-lg shadow-md border-2 border-purple-300/50">
              🐰
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Notifications */}
      <AnimatePresence>
        {milestones.map((m, i) =>
          m.reached && !m.collected ? (
            <MilestoneNotification key={i} milestone={m} onCollect={onCollect} />
          ) : null
        )}
      </AnimatePresence>
    </div>
  );
};
