import React from 'react';
import { motion } from 'motion/react';
import { BINGO_COLORS } from '../constants';

interface ControlPanelProps {
  drawnBalls: number[];
  onDraw: () => void;
  onReset: () => void;
  settings: { hints: boolean; autoDraw: boolean };
  onUpdateSettings: (s: any) => void;
  isGameOver: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  drawnBalls,
  settings,
  onUpdateSettings,
}) => {
  const ballsRemaining = 75 - drawnBalls.length;
  const recentBalls = drawnBalls.slice(0, 5);

  return (
    <div className="w-full flex items-center justify-between gap-2">
      {/* Ball Counter */}
      <div className="bg-slate-800/80 backdrop-blur-sm text-white px-3 py-2 rounded-xl flex flex-col items-center min-w-[60px] shadow-lg border border-white/10">
        <span className="text-2xl font-black leading-none">{ballsRemaining}</span>
        <span className="text-[7px] font-bold uppercase tracking-wide text-slate-300 whitespace-nowrap">Balls Left</span>
      </div>

      {/* Recent Drawn Balls */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-1 justify-center overflow-hidden">
        {recentBalls.map((ball, i) => {
          const letter = "BINGO"[Math.floor((ball - 1) / 15)];
          const color = BINGO_COLORS[letter.toLowerCase()];
          const isLatest = i === 0;
          return (
            <motion.div
              key={`${ball}-${i}`}
              initial={isLatest ? { scale: 0, rotate: -180 } : {}}
              animate={{ scale: 1, rotate: 0 }}
              className={`relative flex-shrink-0 ${isLatest ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-10 h-10 sm:w-12 sm:h-12'}`}
            >
              {/* Bingo ball: colored outer ring + white center */}
              <div
                className="w-full h-full rounded-full flex items-center justify-center shadow-lg border-[3px] border-white/80"
                style={{ backgroundColor: color }}
              >
                <div className="w-[70%] h-[70%] rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
                  <span
                    className="font-black leading-none"
                    style={{ color, fontSize: isLatest ? '8px' : '7px' }}
                  >
                    {letter}
                  </span>
                  <span className={`font-black leading-none text-slate-900 ${isLatest ? 'text-lg' : 'text-sm'}`}>
                    {ball}
                  </span>
                </div>
              </div>
              {/* Pulse ring on latest */}
              {isLatest && (
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 rounded-full border-2"
                  style={{ borderColor: color }}
                />
              )}
            </motion.div>
          );
        })}
        {recentBalls.length === 0 && (
          <div className="text-white/50 text-sm font-bold italic">No balls drawn yet</div>
        )}
      </div>

      {/* Settings Buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onUpdateSettings({ hints: !settings.hints })}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-base shadow-lg transition-all border-2 ${
            settings.hints
              ? 'bg-yellow-400 border-yellow-300 text-yellow-900 shadow-yellow-400/30'
              : 'bg-slate-800/80 border-white/10 text-white/40 hover:text-white/70'
          }`}
          title="Toggle Hints"
        >
          💡
        </button>
        <button
          onClick={() => onUpdateSettings({ autoDraw: !settings.autoDraw })}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-base shadow-lg transition-all border-2 ${
            settings.autoDraw
              ? 'bg-blue-500 border-blue-400 text-white shadow-blue-500/30'
              : 'bg-slate-800/80 border-white/10 text-white/40 hover:text-white/70'
          }`}
          title="Toggle Auto-Draw"
        >
          ⚡
        </button>
      </div>
    </div>
  );
};
