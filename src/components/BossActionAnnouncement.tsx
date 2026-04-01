import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BossState } from '../types';

interface BossActionAnnouncementProps {
  boss: BossState;
}

const ACTION_CONFIG: Record<string, { icon: string; label: string; borderColor: string }> = {
  block: { icon: '🚫', label: 'Cell Blocked!',  borderColor: 'border-purple-400' },
  freeze: { icon: '❄️', label: 'Cell Frozen!',   borderColor: 'border-blue-400'   },
  blind:  { icon: '❓', label: 'Cell Blinded!',  borderColor: 'border-violet-400' },
};

export const BossActionAnnouncement: React.FC<BossActionAnnouncementProps> = ({ boss }) => {
  const config = boss.currentAction ? ACTION_CONFIG[boss.currentAction] : null;

  return (
    <AnimatePresence>
      {config && (
        <motion.div
          key={boss.currentAction}
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-2 left-1/2 -translate-x-1/2 z-[70] pointer-events-none w-max max-w-[90%]"
        >
          <div className={`bg-slate-900 text-white px-4 py-2 rounded-full shadow-2xl border-2 ${config.borderColor} flex items-center justify-center gap-2`}>
            <span className="text-sm">{config.icon}</span>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-tight whitespace-nowrap">
              {config.label}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
