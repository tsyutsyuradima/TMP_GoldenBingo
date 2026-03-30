import React from 'react';
import { motion } from 'motion/react';
import { BossState, Cast } from '../types';
import { BossAvatar } from './BossAvatar';
import { BossProgressBar } from './BossProgressBar';
import { BossStatusEffects } from './BossStatusEffects';
import { BossChoice } from './BossChoice';
import { BossActionAnnouncement } from './BossActionAnnouncement';

interface LiveBossZoneProps {
  boss: BossState;
  activeChoice: Cast[] | null;
  choiceTimer: number;
  onSelectCast: (cast: Cast) => void;
  onReroll: () => void;
  canReroll: boolean;
  onSwitchType: (type: BossState['type']) => void;
}

export const LiveBossZone: React.FC<LiveBossZoneProps> = ({
  boss,
  activeChoice,
  choiceTimer,
  onSelectCast,
  onReroll,
  canReroll,
  onSwitchType,
}) => {
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

        <div className="flex bg-slate-800/20 p-1 rounded-xl mb-4 relative z-10 border border-white/20">
          <button
            onClick={() => onSwitchType('goal')}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${
              boss.type === 'goal'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Goal Mode
          </button>
          <button
            onClick={() => onSwitchType('active')}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${
              boss.type === 'active'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Active Mode
          </button>
        </div>

        <BossAvatar boss={boss} />
        <BossProgressBar boss={boss} />
        <BossStatusEffects boss={boss} />

        <BossActionAnnouncement boss={boss} />
        <BossChoice 
          casts={activeChoice}
          timer={choiceTimer}
          onSelect={onSelectCast}
          onReroll={onReroll}
          canReroll={canReroll}
          boss={boss}
        />
      </div>
    </div>
  );
};
