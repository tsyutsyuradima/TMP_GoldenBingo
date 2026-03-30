import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BossState } from '../types';

interface BossActionAnnouncementProps {
  boss: BossState;
}

export const BossActionAnnouncement: React.FC<BossActionAnnouncementProps> = ({ boss }) => {
  return (
    <AnimatePresence>
      {boss.currentAction && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-2 left-1/2 -translate-x-1/2 z-[70] pointer-events-none w-max max-w-[90%]"
        >
          <div className="bg-slate-900 text-white px-4 py-2 rounded-full shadow-2xl border-2 border-purple-400 flex items-center justify-center gap-2">
            <span className="text-sm">
              {boss.currentAction === 'daub' ? '🎯' :
               boss.currentAction === 'powerup' ? '⚡' :
               boss.currentAction === 'block' ? '🚫' :
               boss.currentAction === 'remove-daub' ? '🧼' : '🌪️'}
            </span>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-tight whitespace-nowrap">
              {boss.currentAction === 'daub' ? 'Binky Daubed!' :
               boss.currentAction === 'powerup' ? 'Binky Powerup!' :
               boss.currentAction === 'block' ? 'Cell Blocked!' :
               boss.currentAction === 'remove-daub' ? 'Daub Removed!' : 'Board Scrambled!'}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
