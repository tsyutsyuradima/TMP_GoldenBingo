import React, { useState } from 'react';
import { BossState } from '../types';
import { StatusTooltip } from './StatusTooltip';

interface BossStatusEffectsProps {
  boss: BossState;
}

export const BossStatusEffects: React.FC<BossStatusEffectsProps> = ({ boss }) => {
  const [hoveredStatus, setHoveredStatus] = useState<string | null>(null);

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2 z-20">
      {boss.isPaused && (
        <div
          className="relative"
          onMouseEnter={() => setHoveredStatus('paused')}
          onMouseLeave={() => setHoveredStatus(null)}
        >
          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-[8px] font-black rounded-full uppercase cursor-help shadow-sm border border-blue-200">
            {boss.lastAction === 'golden-nap' ? 'Golden Nap' : 'Tea Break'}
          </span>
          {hoveredStatus === 'paused' && (
            <StatusTooltip
              icon={boss.lastAction === 'golden-nap' ? '💤' : '☕'}
              title={boss.lastAction === 'golden-nap' ? 'Golden Nap' : 'Tea Break'}
              desc={boss.lastAction === 'golden-nap' ? 'Binky is in a deep slumber. Progress halted for 15s.' : 'Binky is enjoying a warm tea. Progress halted for 10s.'}
            />
          )}
        </div>
      )}
      {boss.isBlurred && (
        <div
          className="relative"
          onMouseEnter={() => setHoveredStatus('blurred')}
          onMouseLeave={() => setHoveredStatus(null)}
        >
          <span className="px-2 py-1 bg-amber-100 text-amber-600 text-[8px] font-black rounded-full uppercase cursor-help shadow-sm border border-amber-200">
            Foggy Glasses
          </span>
          {hoveredStatus === 'blurred' && (
            <StatusTooltip
              icon="👓"
              title="Foggy Glasses"
              desc="Binky can't see the board! Progress severely slowed for 5s."
            />
          )}
        </div>
      )}
      {boss.isSlowed && (
        <div
          className="relative"
          onMouseEnter={() => setHoveredStatus('slowed')}
          onMouseLeave={() => setHoveredStatus(null)}
        >
          <span className="px-2 py-1 bg-orange-100 text-orange-600 text-[8px] font-black rounded-full uppercase cursor-help shadow-sm border border-orange-200">
            Distracted
          </span>
          {hoveredStatus === 'slowed' && (
            <StatusTooltip
              icon="🍪"
              title="Distracted"
              desc="Binky is munching on cookies. Progress slowed by 80% for 12s."
            />
          )}
        </div>
      )}
    </div>
  );
};
