import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TARGET_SCORE } from '../constants';
import { Milestone } from '../types';

interface ScoreAttackProps {
  currentScore: number;
  milestones: Milestone[];
  onCollect: (score: number) => void;
}

const MILESTONE_CONFIGS = [
  {
    element: 'electric' as const,
    icon: '⚡',
    activeLabel: 'Boss Alert!',
    subLabel: 'Incoming Attack',
    glow: '#facc15',
    line: 'bg-yellow-400',
    tick: 'bg-yellow-300/80',
    shadow: '0 0 10px #facc15',
  },
  {
    element: 'fire' as const,
    icon: '🔥',
    activeLabel: 'Boss Rage!',
    subLabel: 'Final Warning',
    glow: '#f97316',
    line: 'bg-orange-500',
    tick: 'bg-orange-400/80',
    shadow: '0 0 10px #f97316',
  },
];

interface MilestoneMarkerProps {
  milestone: Milestone;
  pos: number;
  index: number;
}

const MilestoneMarker: React.FC<MilestoneMarkerProps> = ({ milestone, pos, index }) => {
  const cfg = MILESTONE_CONFIGS[index % MILESTONE_CONFIGS.length];
  const isElectric = cfg.element === 'electric';
  const isActive = milestone.reached && !milestone.collected;
  const isDone = milestone.collected;

  if (isDone) {
    return (
      <div
        className="absolute bottom-0 flex flex-col items-center pointer-events-none"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
      >
        <span className="text-[8px] text-slate-500/50 font-black mb-0.5">✓</span>
        <div className="w-px h-10 bg-slate-600/20" />
      </div>
    );
  }

  return (
    <div
      className="absolute bottom-0 flex flex-col items-center pointer-events-none"
      style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
    >
      {isActive ? (
        <>
          {/* Warning label */}
          <motion.p
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: isElectric ? 0.35 : 0.8, type: "tween" }}
            className="text-[8px] font-black uppercase tracking-tight whitespace-nowrap mb-px leading-none"
            style={{ color: cfg.glow, textShadow: cfg.shadow }}
          >
            {cfg.activeLabel}
          </motion.p>
          <motion.p
            animate={{ opacity: [0.6, 0.3, 0.6] }}
            transition={{ repeat: Infinity, duration: isElectric ? 0.45 : 1.1, delay: 0.1, type: "tween" }}
            className="text-[6px] font-bold uppercase tracking-widest whitespace-nowrap mb-1 leading-none"
            style={{ color: cfg.glow }}
          >
            {cfg.subLabel}
          </motion.p>

          {/* Animated icon + glow */}
          <div className="relative flex items-center justify-center mb-1">
            <motion.div
              animate={{
                scale: isElectric ? [1, 1.9, 1, 1.6, 1] : [1, 1.5, 1],
                opacity: isElectric ? [0.5, 1, 0.3, 0.9, 0.5] : [0.4, 0.9, 0.4],
              }}
              transition={{ repeat: Infinity, duration: isElectric ? 0.35 : 1, type: "tween" }}
              className="absolute rounded-full blur-lg"
              style={{ width: 40, height: 40, backgroundColor: cfg.glow }}
            />
            <motion.span
              animate={
                isElectric
                  ? { scale: [1, 1.4, 0.85, 1.25, 1], x: [0, -3, 3, -1, 0], rotate: [0, -5, 5, 0] }
                  : { scale: [1, 1.2, 0.9, 1.15, 1], y: [0, -5, 1, -3, 0] }
              }
              transition={{ repeat: Infinity, duration: isElectric ? 0.3 : 0.85, ease: 'easeInOut', type: "tween" }}
              className="relative text-4xl"
              style={{ filter: `drop-shadow(${cfg.shadow})` }}
            >
              {cfg.icon}
            </motion.span>
          </div>
        </>
      ) : (
        <>
          {/* Idle: just show score threshold */}
          <p
            className="text-[8px] font-bold text-slate-400 uppercase tracking-tight whitespace-nowrap mb-1 leading-none"
          >
            {milestone.score} pts
          </p>
          <motion.span
            animate={{ opacity: [0.25, 0.45, 0.25] }}
            transition={{ repeat: Infinity, duration: 3, delay: index * 0.7, type: "tween" }}
            className="text-2xl mb-1"
            style={{ filter: 'grayscale(80%)' }}
          >
            {cfg.icon}
          </motion.span>
        </>
      )}

      {/* Connector line down to the bar */}
      <div className={`w-px h-2 ${isActive ? cfg.line : 'bg-slate-500/30'}`} />
    </div>
  );
};

const MilestoneNotification: React.FC<{ milestone: Milestone; onCollect: (score: number) => void }> = ({ milestone, onCollect }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => onCollect(milestone.score), 4000);
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
          transition={{ duration: 4, ease: 'linear' }}
          className="h-full bg-white/60"
        />
      </div>
    </motion.button>
  );
};

export const ScoreAttack: React.FC<ScoreAttackProps> = ({ currentScore, milestones, onCollect }) => {
  const percent = Math.min((currentScore / TARGET_SCORE) * 100, 100);

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="w-full bg-slate-800/90 backdrop-blur-sm rounded-2xl px-4 sm:px-6 py-4 flex items-end gap-4 shadow-xl border border-white/10">

        {/* Player Score */}
        <div className="flex items-center gap-3 shrink-0 pb-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-lg shadow-md border-2 border-blue-300/50">
            👤
          </div>
          <div className="flex flex-col">
            <span id="score-display" className="text-white font-black text-xl sm:text-2xl tabular-nums leading-none">
              {currentScore.toLocaleString()}
            </span>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Score</span>
          </div>
        </div>

        {/* Progress section */}
        <div className="flex-1 flex flex-col">

          {/* Milestone marker row — outside overflow-hidden so icons can be large */}
          <div className="relative" style={{ height: 76 }}>
            {milestones.map((m, i) => {
              const pos = (m.score / TARGET_SCORE) * 100;
              return <MilestoneMarker key={i} milestone={m} pos={pos} index={i} />;
            })}
          </div>

          {/* Bar */}
          <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ type: 'spring', stiffness: 60, damping: 20 }}
              className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full"
            />
            {/* Tick marks aligned with milestones */}
            {milestones.map((m, i) => {
              const cfg = MILESTONE_CONFIGS[i % MILESTONE_CONFIGS.length];
              const pos = (m.score / TARGET_SCORE) * 100;
              const isActive = m.reached && !m.collected;
              return (
                <div
                  key={i}
                  className={`absolute top-0 bottom-0 w-0.5 z-10 ${isActive ? cfg.tick : 'bg-white/20'}`}
                  style={{ left: `${pos}%` }}
                />
              );
            })}
          </div>

          {/* Score range labels */}
          <div className="flex justify-between mt-0.5 px-0.5">
            <span className="text-[7px] text-slate-500 font-bold">0</span>
            <span className="text-[7px] text-amber-400 font-black">{TARGET_SCORE}</span>
          </div>
        </div>

        {/* Goal */}
        <div className="flex items-center gap-3 shrink-0 pb-1">
          <div className="flex flex-col items-end">
            <span className="text-white font-black text-xl sm:text-2xl tabular-nums leading-none">
              {TARGET_SCORE.toLocaleString()}
            </span>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Goal</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-lg shadow-md border-2 border-amber-300/50">
            🏆
          </div>
        </div>
      </div>

      {/* Reward popups */}
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
