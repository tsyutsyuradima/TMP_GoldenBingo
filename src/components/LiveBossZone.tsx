import React from 'react';
import { motion } from 'motion/react';
import { BossState } from '../types';
import { BossAvatar } from './BossAvatar';
import { BossProgressBar } from './BossProgressBar';
import { BossActionAnnouncement } from './BossActionAnnouncement';
import { BossChat } from './BossChat';
import { PlayerActionsPanel } from './PlayerActionsPanel';
import { BossActionsPanel } from './BossActionsPanel';

interface LiveBossZoneProps {
  boss: BossState;
  onTriggerBossAction: (action: 'block' | 'freeze' | 'blind') => void;
  onTriggerPlayerAction: (actionId: string) => void;
}

export const LiveBossZone: React.FC<LiveBossZoneProps> = ({ boss, onTriggerBossAction, onTriggerPlayerAction }) => {
  return (
    <div className="lg:col-span-3 flex flex-col gap-4">
      <div className="bg-white/30 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-white/40 flex flex-col items-center relative overflow-hidden h-full">
        <motion.div
          animate={{
            opacity: boss.reaction === 'angry' ? [0.1, 0.25, 0.1] : [0.03, 0.08, 0.03],
            backgroundColor: boss.reaction === 'angry' ? ['#fee2e2', '#fecaca', '#fee2e2'] : ['#e0e7ff', '#c7d2fe', '#e0e7ff'],
          }}
          transition={{ repeat: Infinity, duration: boss.reaction === 'angry' ? 0.5 : 4 }}
          className="absolute inset-0 pointer-events-none rounded-2xl"
        />

        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-700 mb-3 relative z-10">Live Boss Zone</h2>

        <BossAvatar boss={boss} />
        <BossProgressBar boss={boss} />
        <BossActionAnnouncement boss={boss} />
        <BossChat chatLog={boss.chatLog} />
      </div>

      <PlayerActionsPanel onActivate={onTriggerPlayerAction} />
      <BossActionsPanel onActivate={onTriggerBossAction} />
    </div>
  );
};
