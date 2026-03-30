import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BINGO_LETTERS, BINGO_COLORS } from '../constants';
import { triggerExplosion } from './ParticleCanvas';

interface BingoBoardProps {
  cardData: (number | "FREE")[];
  markedCells: boolean[];
  bonusCells: (any | null)[];
  drawnBalls: number[];
  hintsEnabled: boolean;
  isGameOver: boolean;
  isPaused: boolean;
  lastBingoTime: number;
  onMarkCell: (index: number) => void;
  blockedCells: number[];
}

export const BingoBoard: React.FC<BingoBoardProps> = ({
  cardData,
  markedCells,
  bonusCells,
  drawnBalls,
  hintsEnabled,
  isGameOver,
  isPaused,
  lastBingoTime,
  onMarkCell,
  blockedCells,
}) => {
  const [showBingo, setShowBingo] = React.useState(false);
  const boardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleBossAction = (e: any) => {
      const { type, index, amount } = e.detail;
      
      if (type === 'remove-points') {
        const scoreEl = document.getElementById('score-display');
        if (scoreEl) {
          const rect = scoreEl.getBoundingClientRect();
          const targetX = rect.left + rect.width / 2;
          const targetY = rect.top + rect.height / 2;
          
          import('./ParticleCanvas').then(({ triggerProjectile, triggerExplosion }) => {
            triggerProjectile(
              window.innerWidth / 2,
              window.innerHeight + 50,
              targetX,
              targetY,
              "#ef4444", // Red for point removal
              () => triggerExplosion(targetX, targetY, "#ef4444", 30)
            );
          });
        }
        return;
      }

      if (index !== undefined && boardRef.current) {
        const cells = boardRef.current.querySelectorAll('.bingo-cell');
        const cell = cells[index] as HTMLElement;
        if (cell) {
          const rect = cell.getBoundingClientRect();
          const targetX = rect.left + rect.width / 2;
          const targetY = rect.top + rect.height / 2;
          
          const color = type === 'block' ? "#64748b" : "#3b82f6"; // Slate for block, Blue for daub removal

          import('./ParticleCanvas').then(({ triggerProjectile, triggerExplosion }) => {
            triggerProjectile(
              window.innerWidth / 2,
              window.innerHeight + 50,
              targetX,
              targetY,
              color,
              () => triggerExplosion(targetX, targetY, color, 25)
            );
          });
        }
      }
    };

    window.addEventListener('boss-action-animation', handleBossAction);
    return () => window.removeEventListener('boss-action-animation', handleBossAction);
  }, []);

  React.useEffect(() => {
    if (lastBingoTime > 0) {
      setShowBingo(true);
      const timer = setTimeout(() => setShowBingo(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastBingoTime]);

  return (
    <div ref={boardRef} className="bg-white p-5 rounded-[3.5rem] shadow-2xl border-4 border-white flex-1 relative overflow-hidden">
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px] z-50 flex items-center justify-center p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ 
                scale: [1, 1.02, 1],
                y: 0 
              }}
              transition={{
                scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
              }}
              className="bg-white p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-amber-400 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-400 animate-pulse" />
              <motion.span 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-6xl mb-4 block"
              >
                ⏸️
              </motion.span>
              <h3 className="text-3xl font-black text-slate-900 italic uppercase leading-none tracking-tighter">Game Paused</h3>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.3em] mt-3 animate-pulse">Binky is making a choice!</p>
              
              <div className="mt-6 flex gap-1 justify-center">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full bg-amber-400"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBingo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1.2, rotate: 0 }}
            exit={{ opacity: 0, scale: 2, rotate: 10 }}
            className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none"
          >
            <div className="bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 text-white px-12 py-6 rounded-full shadow-[0_0_50px_rgba(245,158,11,0.6)] border-4 border-white transform -rotate-3">
              <h2 className="text-7xl font-black italic uppercase tracking-tighter drop-shadow-2xl">BINGO!</h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-5 text-center font-black text-4xl py-4 italic mb-2">
        {BINGO_LETTERS.map((letter, i) => (
          <div key={i} style={{ color: BINGO_COLORS[letter.toLowerCase()] }}>
            {letter}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-2 p-4 bg-slate-50 rounded-[2.5rem]">
        {cardData.map((val, i) => {
          const letter = BINGO_LETTERS[i % 5];
          const isMarked = markedCells[i];
          const isBlocked = blockedCells.includes(i);
          const canBeMarked = !isBlocked && (val === "FREE" || drawnBalls.includes(val as number));
          const bonus = bonusCells[i];

          return (
            <motion.div
              key={i}
              whileHover={!isMarked && !isGameOver && !isBlocked ? { scale: 1.05 } : {}}
              whileTap={!isMarked && !isGameOver && !isBlocked ? { scale: 0.95 } : {}}
              onClick={(e) => {
                if (isGameOver || isMarked || isBlocked) return;
                if (canBeMarked) {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  triggerExplosion(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2,
                    bonus ? "#fbbf24" : "#cbd5e1",
                    15
                  );
                  onMarkCell(i);
                }
              }}
              className={`
                bingo-cell aspect-square flex items-center justify-center font-bold rounded-xl cursor-pointer transition-all duration-200 text-xl select-none relative
                ${isMarked ? 'text-white shadow-md' : 'bg-white border-2 border-slate-100'}
                ${isBlocked ? 'bg-slate-200 border-slate-300 opacity-50 cursor-not-allowed' : ''}
                ${!isMarked && !isBlocked && canBeMarked && hintsEnabled ? 'bg-yellow-50 border-yellow-300 shadow-[0_0_15px_rgba(253,224,71,0.5)] animate-pulse' : ''}
              `}
              style={{
                backgroundColor: isMarked ? BINGO_COLORS[letter.toLowerCase()] : undefined,
                transform: isMarked ? 'scale(0.92)' : undefined,
              }}
            >
              {isBlocked ? "🚫" : (val === "FREE" ? "⭐" : val)}
              {bonus && !isMarked && !isBlocked && (
                <div className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-md font-black bg-gradient-to-br from-amber-600 to-yellow-400 text-amber-950 animate-bounce">
                  +{bonus.val}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
