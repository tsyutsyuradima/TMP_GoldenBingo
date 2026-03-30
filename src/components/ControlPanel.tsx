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
  onDraw,
  onReset,
  settings,
  onUpdateSettings,
  isGameOver,
}) => {
  const currentBall = drawnBalls[0];
  const letter = currentBall ? "BINGO"[Math.floor((currentBall - 1) / 15)] : null;

  return (
    <div className="lg:col-span-3 flex flex-col gap-6">
      <div className="px-4 py-2">
        <h1 className="text-5xl xl:text-6xl font-black italic tracking-tighter leading-none select-none">
          <span className="text-blue-500">B</span>
          <span className="text-red-500">I</span>
          <span className="text-amber-500">N</span>
          <span className="text-green-500">G</span>
          <span className="text-purple-500">O</span>
        </h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 ml-1">Golden Treasures</p>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col gap-4">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2 italic">Settings</h3>
        <div className="flex items-center justify-between px-2">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-700 tracking-tight">Hints</span>
            <span className="text-[9px] text-slate-300 font-bold uppercase">Help Mode</span>
          </div>
          <button
            onClick={() => onUpdateSettings({ hints: !settings.hints })}
            className={`w-11 h-6 rounded-full transition-colors relative ${settings.hints ? 'bg-blue-500' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.hints ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
        <div className="h-px bg-slate-50"></div>
        <div className="flex items-center justify-between px-2">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-700 tracking-tight">Auto-Draw</span>
            <span className="text-[9px] text-slate-300 font-bold uppercase">3 Sec</span>
          </div>
          <button
            onClick={() => onUpdateSettings({ autoDraw: !settings.autoDraw })}
            className={`w-11 h-6 rounded-full transition-colors relative ${settings.autoDraw ? 'bg-blue-500' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.autoDraw ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center relative overflow-hidden flex-1 flex flex-col justify-center">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-red-400 to-purple-400"></div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 italic">Next Ball</h2>
        
        <div className="h-32 flex items-center justify-center mb-10">
          {currentBall ? (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              key={currentBall}
              className="w-24 h-24 rounded-full flex flex-col items-center justify-center text-white font-black shadow-2xl"
              style={{ backgroundColor: BINGO_COLORS[letter!.toLowerCase()] }}
            >
              <span className="text-xs opacity-70">{letter}</span>
              <span className="text-4xl -mt-1">{currentBall}</span>
            </motion.div>
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-dashed border-slate-100 flex items-center justify-center text-slate-200 text-4xl font-black italic">?</div>
          )}
        </div>

        {!settings.autoDraw ? (
          <button
            onClick={onDraw}
            disabled={isGameOver}
            className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 px-6 rounded-3xl transition-all active:scale-95 shadow-xl text-lg tracking-widest italic disabled:opacity-50"
          >
            DRAW BALL
          </button>
        ) : (
          <div className="flex flex-col items-center">
             <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                  <circle className="fill-none stroke-slate-100 stroke-[4]" cx="22" cy="22" r="20" />
                  <motion.circle
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="fill-none stroke-blue-500 stroke-[4] stroke-round"
                    cx="22"
                    cy="22"
                    r="20"
                  />
                </svg>
                <span className="absolute text-sm font-black text-slate-900">!</span>
             </div>
             <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Auto Drawing...</p>
          </div>
        )}

        <button
          onClick={onReset}
          className="mt-8 text-[10px] font-bold text-slate-300 hover:text-red-500 transition uppercase tracking-[0.3em] italic"
        >
          Reset Progress
        </button>
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-md border border-slate-100">
        <div className="flex justify-between items-center mb-4 px-1">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Round Log</span>
          <span className="text-[10px] font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">{drawnBalls.length} / 75</span>
        </div>
        <div className="flex flex-wrap gap-2.5 max-h-48 overflow-y-auto pr-1">
          {drawnBalls.map((b, i) => {
            const l = "BINGO"[Math.floor((b - 1) / 15)];
            const isLatest = i === 0;
            return (
              <motion.div
                key={i}
                initial={isLatest ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`w-11 h-11 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm relative ${isLatest ? 'ring-4 ring-blue-400 ring-offset-2' : ''}`}
                style={{ backgroundColor: BINGO_COLORS[l.toLowerCase()] }}
              >
                {b}
                {isLatest && (
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="absolute inset-0 rounded-full bg-white/30"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
