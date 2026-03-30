import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cast } from '../types';

interface BossChoiceProps {
  casts: Cast[] | null;
  timer: number;
  onSelect: (cast: Cast) => void;
  onReroll: () => void;
  canReroll: boolean;
}

export const BossChoice: React.FC<BossChoiceProps> = ({
  casts,
  timer,
  onSelect,
  onReroll,
  canReroll,
}) => {
  return (
    <AnimatePresence>
      {casts && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute inset-0 bg-slate-900/95 backdrop-blur-md z-50 flex flex-col p-6 rounded-[2.5rem]"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="text-left">
              <h3 className="text-xl font-black text-amber-400 italic uppercase leading-none">Binky's Choice!</h3>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pick your sabotage</p>
            </div>
            <div className="flex items-center gap-4">
              {canReroll && (
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onReroll}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl hover:bg-white/20 transition-colors border border-white/10"
                  title="Reroll Choices (Costs 50 Score)"
                >
                  🔄
                </motion.button>
              )}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 44 44">
                  <circle className="fill-none stroke-white/10 stroke-[4]" cx="22" cy="22" r="20" />
                  <motion.circle
                    initial={{ pathLength: 1 }}
                    animate={{ pathLength: 0 }}
                    transition={{ duration: 7, ease: "linear" }}
                    className="fill-none stroke-amber-400 stroke-[4] stroke-round"
                    cx="22"
                    cy="22"
                    r="20"
                  />
                </svg>
                <motion.div 
                  animate={{ scale: timer <= 3 ? [1, 1.2, 1] : 1 }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className={`z-10 text-lg font-black ${timer <= 3 ? 'text-red-400' : 'text-white'}`}
                >
                  {timer}
                </motion.div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 flex-1 justify-center">
            {casts.map((cast, i) => (
              <motion.button
                key={cast.id}
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.03, x: 8, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelect(cast)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 p-3.5 rounded-2xl flex items-center gap-4 text-left transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-amber-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="text-4xl group-hover:scale-125 transition-transform drop-shadow-lg">{cast.icon}</span>
                <div className="flex-1">
                  <h4 className="text-xs font-black text-white uppercase italic tracking-tight">{cast.name}</h4>
                  <p className="text-[8px] font-bold text-slate-400 uppercase leading-tight mt-0.5 opacity-80 group-hover:opacity-100">{cast.description}</p>
                </div>
                <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px]">✨</span>
                </div>
              </motion.button>
            ))}
          </div>

          <p className="text-[7px] font-black text-slate-500 uppercase tracking-[0.2em] mt-4">Game paused for player</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
