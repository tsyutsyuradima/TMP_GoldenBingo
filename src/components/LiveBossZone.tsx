import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BossState, Cast } from '../types';
import { BossChoice } from './BossChoice';
import { BOSS_CONFIG } from '../config/bossConfig';

interface LiveBossZoneProps {
  boss: BossState;
  activeChoice: Cast[] | null;
  choiceTimer: number;
  onSelectCast: (cast: Cast) => void;
  onReroll: () => void;
  canReroll: boolean;
  onSwitchType: (type: BossState['type']) => void;
}

const StatusTooltip: React.FC<{ title: string; desc: string; icon: string }> = ({ title, desc, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-2 rounded-lg text-[8px] w-32 z-50 pointer-events-none shadow-xl border border-slate-700"
  >
    <div className="flex items-center gap-1 mb-1">
      <span>{icon}</span>
      <span className="font-black uppercase tracking-tighter">{title}</span>
    </div>
    <p className="text-slate-400 font-medium leading-tight">{desc}</p>
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-slate-900" />
  </motion.div>
);

export const LiveBossZone: React.FC<LiveBossZoneProps> = ({ 
  boss, 
  activeChoice, 
  choiceTimer, 
  onSelectCast,
  onReroll,
  canReroll,
  onSwitchType
}) => {
  const [hoveredStatus, setHoveredStatus] = useState<string | null>(null);
  const jarPercent = (boss.progress / BOSS_CONFIG.maxProgress) * 100;

  const getBossEmoji = () => {
    if (boss.isPaused) return '😴';
    if (boss.reaction === 'angry') return '💢';
    if (boss.reaction === 'happy') return '😎';
    if (boss.reaction === 'surprised') return '😲';
    if (boss.reaction === 'sleeping') return '💤';
    if (boss.reaction === 'focused') return '🧐';
    if (boss.reaction === 'taunting') return '😜';
    if (boss.reaction === 'scared') return '😨';
    if (boss.reaction === 'confused') return '😵‍💫';
    if (boss.reaction === 'evil') return '😈';
    if (boss.reaction === 'dizzy') return '🌀';
    if (boss.progress > 400) return '👿';
    return '🐰';
  };

  return (
    <div className="lg:col-span-3 flex flex-col gap-6">
      <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center relative overflow-hidden h-full">
        {/* Animated Background Pulse */}
        <motion.div 
          animate={{ 
            opacity: boss.reaction === 'angry' ? [0.1, 0.3, 0.1] : [0.05, 0.1, 0.05],
            backgroundColor: boss.reaction === 'angry' ? ['#fee2e2', '#fecaca', '#fee2e2'] : ['#f3e8ff', '#e0e7ff', '#f3e8ff']
          }}
          transition={{ repeat: Infinity, duration: boss.reaction === 'angry' ? 0.5 : 4 }}
          className="absolute inset-0 pointer-events-none" 
        />
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-indigo-500"></div>
        
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 italic relative z-10">Live Boss Zone</h2>

        {/* Boss Type Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6 relative z-10">
          <button
            onClick={() => onSwitchType('goal')}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${boss.type === 'goal' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Goal Mode
          </button>
          <button
            onClick={() => onSwitchType('active')}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${boss.type === 'active' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Active Mode
          </button>
        </div>

        {/* Boss Action Announcement */}
        <AnimatePresence>
          {boss.currentAction && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 1.1 }}
              className="absolute top-24 left-0 w-full flex justify-center z-50 pointer-events-none"
            >
              <div className="bg-slate-900 text-white px-4 py-2 rounded-full shadow-2xl border-2 border-purple-400 flex items-center gap-2">
                <span className="text-lg">
                  {boss.currentAction === 'daub' ? '🎯' : 
                   boss.currentAction === 'powerup' ? '⚡' :
                   boss.currentAction === 'block' ? '🚫' :
                   boss.currentAction === 'remove-daub' ? '🧼' : '🌪️'}
                </span>
                <span className="text-[10px] font-black uppercase tracking-tighter">
                  {boss.currentAction === 'daub' ? 'Binky Daubed!' : 
                   boss.currentAction === 'powerup' ? 'Binky Powerup!' :
                   boss.currentAction === 'block' ? 'Cell Blocked!' :
                   boss.currentAction === 'remove-daub' ? 'Daub Removed!' : 'Board Scrambled!'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Choice Overlay */}
        <BossChoice 
          casts={activeChoice} 
          timer={choiceTimer} 
          onSelect={onSelectCast} 
          onReroll={onReroll}
          canReroll={canReroll}
        />

        {/* Binky the Boss */}
        <div id="boss-projectile-start" className="relative w-full aspect-square flex items-center justify-center mb-6 z-10">
          {/* Aura Effect */}
          <motion.div
            animate={{ 
              scale: boss.reaction === 'angry' ? [1.2, 1.5, 1.2] : [1, 1.2, 1],
              opacity: boss.reaction === 'angry' ? [0.3, 0.6, 0.3] : [0.1, 0.3, 0.1],
              backgroundColor: boss.reaction === 'angry' ? '#ef4444' : (boss.isPaused ? '#60a5fa' : '#a855f7')
            }}
            transition={{ repeat: Infinity, duration: boss.reaction === 'angry' ? 0.5 : 2 }}
            className="absolute w-40 h-40 rounded-full blur-3xl"
          />

          <motion.div
            animate={{
              y: boss.reaction === 'happy' ? [0, -30, 0] : [0, -10, 0],
              x: (boss.reaction === 'angry' || boss.reaction === 'scared' || boss.reaction === 'dizzy') ? [-5, 5, -5, 5, 0] : 0,
              rotate: boss.isPaused ? [0, 0, 0] : (boss.reaction === 'angry' ? [-10, 10, -10] : (boss.reaction === 'dizzy' ? [0, 360] : [0, 2, -2, 0])),
              filter: boss.isBlurred ? 'blur(8px)' : 'blur(0px)',
              scale: boss.isSlowed ? 0.8 : (boss.reaction === 'happy' ? 1.3 : (boss.progress > 400 ? 1.2 : 1.1)),
            }}
            transition={{ 
              repeat: Infinity, 
              duration: (boss.reaction === 'angry' || boss.reaction === 'scared') ? 0.2 : (boss.reaction === 'dizzy' ? 1 : (boss.reaction === 'happy' ? 0.5 : 3)),
              ease: (boss.reaction === 'dizzy') ? "linear" : "easeInOut"
            }}
            className="text-9xl select-none relative z-10 drop-shadow-2xl"
          >
            {getBossEmoji()}
            
            {/* Sweat Drops */}
            {(boss.reaction === 'angry' || boss.reaction === 'scared') && (
              <div className="absolute top-0 right-0">
                {[...Array(3)].map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: 40, opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.3 }}
                    className="absolute text-2xl text-blue-400"
                    style={{ right: i * 10 }}
                  >
                    💧
                  </motion.span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Speech Bubble */}
          <AnimatePresence mode="wait">
            <motion.div
              key={boss.message}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -20 }}
              className="absolute -top-8 -right-4 bg-slate-900 text-white p-4 rounded-2xl rounded-bl-none text-xs font-bold max-w-[140px] shadow-2xl z-20 border border-slate-700"
            >
              {boss.message}
              <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-0 h-0 border-8 border-transparent border-t-slate-900 -rotate-45" />
            </motion.div>
          </AnimatePresence>

          {/* Juice Effects */}
          <AnimatePresence>
            {boss.isPaused && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                className="absolute inset-0 bg-white/40 backdrop-blur-sm z-30 flex items-center justify-center rounded-full"
              >
                 <motion.span 
                   animate={{ y: [0, -30], opacity: [1, 0], scale: [1, 1.5] }}
                   transition={{ repeat: Infinity, duration: 2 }}
                   className="text-5xl"
                 >
                   {boss.lastAction === 'golden-nap' ? '💤' : '☕'}
                 </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {boss.isSlowed && (
            <div className="absolute inset-0 pointer-events-none z-30">
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{ 
                    x: [0, (i - 2) * 50], 
                    y: [0, 60], 
                    opacity: [0, 1, 0],
                    rotate: [0, 360]
                  }}
                  transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.4 }}
                  className="absolute top-1/2 left-1/2 text-2xl"
                >
                  🍪
                </motion.span>
              ))}
            </div>
          )}

          {/* Hit Effect (Angry) */}
          {boss.reaction === 'angry' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }}
              className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
            >
              <div className="w-full h-full border-8 border-red-500 rounded-full animate-ping" />
            </motion.div>
          )}
        </div>

        {/* The Filling Jar */}
        {boss.type === 'goal' ? (
          <div className="w-full flex-1 flex flex-col items-center justify-end gap-4 z-10">
            <div className="relative w-32 h-48 bg-slate-50 border-4 border-slate-200 rounded-b-[2rem] rounded-t-lg overflow-hidden shadow-inner">
              {/* Liquid/Jar Fill */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${jarPercent}%` }}
                className={`absolute bottom-0 left-0 w-full transition-colors duration-1000 ${boss.progress > 400 ? 'bg-gradient-to-t from-red-600 to-orange-400' : 'bg-gradient-to-t from-purple-600 to-indigo-400'}`}
              >
                <div className="absolute top-0 left-0 w-full h-4 bg-white/20 animate-pulse" />
                
                {/* Floating Bubbles/Particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        y: [0, -100], 
                        x: [0, (i % 2 === 0 ? 10 : -10)],
                        opacity: [0, 0.6, 0],
                        scale: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2 + Math.random() * 2, 
                        delay: Math.random() * 2 
                      }}
                      className="absolute w-2 h-2 rounded-full bg-white/40"
                      style={{ left: `${Math.random() * 100}%`, bottom: '-10%' }}
                    />
                  ))}
                  
                  {/* Floating Coins in Jar */}
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -20, 0], x: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 + i, delay: i * 0.5 }}
                      className="absolute text-xs"
                      style={{ left: `${20 * i}%`, bottom: `${10 * i}%` }}
                    >
                      🪙
                    </motion.span>
                  ))}
                </div>
              </motion.div>
              
              {/* Jar Reflection */}
              <div className="absolute top-0 right-4 w-4 h-full bg-white/10 skew-x-6" />
            </div>
            
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Boss Progress</p>
              <motion.p 
                key={Math.floor(jarPercent)}
                initial={{ scale: 1.2, color: '#ef4444' }}
                animate={{ scale: 1, color: '#0f172a' }}
                className="text-2xl font-black tracking-tighter italic"
              >
                {Math.floor(jarPercent)}%
              </motion.p>
            </div>
          </div>
        ) : (
          <div className="w-full flex-1 flex flex-col items-center justify-center gap-6 z-10">
             <div className="bg-red-50 border-2 border-red-100 p-4 rounded-2xl text-center max-w-[180px] shadow-sm">
                <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-2">Active Boss Mode</p>
                <p className="text-[10px] text-slate-600 font-medium leading-tight mb-4">
                  Binky is playing with you! He will block cells and remove your daubs.
                </p>
                
                {/* Next Action Progress Bar */}
                <div className="w-full h-3 bg-red-100 rounded-full overflow-hidden relative border border-red-200">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${boss.nextActionProgress}%` }}
                     className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-orange-500"
                   />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[7px] font-black text-red-900 uppercase tracking-tighter mix-blend-overlay">Next Action</span>
                   </div>
                </div>
             </div>
             
             <div className="flex gap-2">
                {boss.blockedCells.length > 0 ? (
                  boss.blockedCells.map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-sm shadow-lg shadow-red-200 border-2 border-red-400"
                    >
                      🚫
                    </motion.div>
                  ))
                ) : (
                  <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic">No cells blocked</div>
                )}
             </div>
          </div>
        )}

        {/* Status Indicators with Tooltips */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 z-20">
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
      </div>
    </div>
  );
};
