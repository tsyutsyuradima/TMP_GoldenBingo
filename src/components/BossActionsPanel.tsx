import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BOSS_ACTIONS } from '../config/bossActionsConfig';

interface BossActionsPanelProps {
  onActivate: (actionId: 'block' | 'freeze' | 'blind') => void;
}

export const BossActionsPanel: React.FC<BossActionsPanelProps> = ({ onActivate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleActivate = (id: string) => {
    if (activeId) return;
    setActiveId(id);
    onActivate(id as 'block' | 'freeze' | 'blind');
    setTimeout(() => setActiveId(null), 1500);
  };

  return (
    <div className="bg-white/30 backdrop-blur-sm rounded-2xl shadow-lg border border-white/40 overflow-hidden">
      <button
        onClick={() => setIsOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">😈</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Boss Actions</span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-500 text-xs"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 flex flex-col gap-1.5">
              {BOSS_ACTIONS.map(action => {
                const isActive = activeId === action.id;
                return (
                  <motion.button
                    key={action.id}
                    onClick={() => handleActivate(action.id)}
                    disabled={!!activeId}
                    whileHover={!activeId ? { x: 4 } : {}}
                    whileTap={!activeId ? { scale: 0.97 } : {}}
                    animate={isActive ? { scale: [1, 1.04, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-3 rounded-xl px-3 py-2 border text-left transition-all w-full
                      ${isActive
                        ? 'bg-red-100 border-red-300 shadow-md shadow-red-100'
                        : 'bg-red-50/60 border-red-100/60 hover:bg-red-100/80 hover:border-red-200 cursor-pointer'}
                      ${activeId && !isActive ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <span className="text-xl mt-0.5 shrink-0">{action.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-red-700 uppercase tracking-tight">{action.name}</p>
                      <p className="text-[9px] text-slate-500 font-medium leading-tight mt-0.5">{action.description}</p>
                      <p className="text-[8px] text-red-400 font-bold uppercase tracking-wider mt-1">Trigger: {action.trigger}</p>
                    </div>
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-[9px] font-black text-red-600 uppercase tracking-wide shrink-0 self-center"
                        >
                          ✓ Fired
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
