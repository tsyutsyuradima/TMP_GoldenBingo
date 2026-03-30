import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BINGO_LETTERS, BINGO_COLORS } from '../constants';
import { triggerExplosion } from './ParticleCanvas';

const HEADER_COLORS: Record<string, string> = {
  B: '#1e40af',
  I: '#a21caf',
  N: '#15803d',
  G: '#16a34a',
  O: '#dc2626',
};

const CELL_DARK = '#d4a574';
const CELL_LIGHT = '#f5e6d0';

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
  const ballsToGo = 75 - drawnBalls.length;

  React.useEffect(() => {
    if (lastBingoTime > 0) {
      setShowBingo(true);
      const timer = setTimeout(() => setShowBingo(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastBingoTime]);

  return (
    <div ref={boardRef} className="relative w-full max-w-md mx-auto">
      {/* Golden Card Frame */}
      <div className="bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 p-2.5 sm:p-3 rounded-2xl shadow-[0_8px_32px_rgba(180,83,9,0.35)]">
        <div className="bg-amber-100/90 rounded-xl overflow-hidden relative">
          {/* Pause Overlay */}
          <AnimatePresence>
            {isPaused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-center"
                >
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-5xl block mb-3"
                  >
                    ⏸️
                  </motion.span>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Paused</h3>
                  <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest animate-pulse mt-1">Choose a spell!</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BINGO! Banner */}
          <AnimatePresence>
            {showBingo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1.1, rotate: 0 }}
                exit={{ opacity: 0, scale: 2 }}
                className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none"
              >
                <div className="bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 text-white px-10 py-4 rounded-full shadow-[0_0_40px_rgba(245,158,11,0.6)] border-4 border-white -rotate-3">
                  <h2 className="text-5xl font-black italic uppercase tracking-tighter drop-shadow-2xl">BINGO!</h2>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BINGO Header Row */}
          <div className="grid grid-cols-5 gap-1 px-2 pt-2 pb-1">
            {BINGO_LETTERS.map((letter) => (
              <div
                key={letter}
                className="flex items-center justify-center py-2 rounded-md font-black text-white text-base sm:text-lg shadow-sm"
                style={{ backgroundColor: HEADER_COLORS[letter] }}
              >
                {letter}
              </div>
            ))}
          </div>

          {/* 5x5 Checkerboard Grid */}
          <div className="grid grid-cols-5 gap-[2px] p-2 pt-1">
            {cardData.map((val, i) => {
              const row = Math.floor(i / 5);
              const col = i % 5;
              const isDark = (row + col) % 2 === 0;
              const letter = BINGO_LETTERS[col];
              const isMarked = markedCells[i];
              const isBlocked = blockedCells.includes(i);
              const canBeMarked = !isBlocked && (val === "FREE" || drawnBalls.includes(val as number));
              const bonus = bonusCells[i];
              const isFree = val === "FREE";

              return (
                <motion.div
                  key={i}
                  data-cell-index={i}
                  whileHover={!isMarked && !isGameOver && !isBlocked ? { scale: 1.06 } : {}}
                  whileTap={!isMarked && !isGameOver && !isBlocked ? { scale: 0.94 } : {}}
                  onClick={(e) => {
                    if (isGameOver || isMarked || isBlocked) return;
                    if (canBeMarked) {
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                      triggerExplosion(
                        rect.left + rect.width / 2,
                        rect.top + rect.height / 2,
                        bonus ? "#fbbf24" : BINGO_COLORS[letter.toLowerCase()],
                        15
                      );
                      onMarkCell(i);
                    }
                  }}
                  className={`
                    aspect-square flex items-center justify-center font-bold rounded-md cursor-pointer
                    transition-all duration-200 select-none relative
                    ${isBlocked ? 'opacity-40 cursor-not-allowed' : ''}
                    ${!isMarked && !isBlocked && canBeMarked && hintsEnabled
                      ? 'ring-4 ring-green-400 ring-inset shadow-[0_0_20px_rgba(74,222,128,0.8),inset_0_0_15px_rgba(74,222,128,0.4)] animate-pulse z-10'
                      : ''}
                  `}
                  style={{
                    backgroundColor: (!isMarked && !isFree) ? (isDark ? CELL_DARK : CELL_LIGHT) : (isDark ? CELL_DARK : CELL_LIGHT),
                  }}
                >
                  {isBlocked ? (
                    <span className="text-xl sm:text-2xl">🚫</span>
                  ) : isMarked || isFree ? (
                    /* Glossy chip */
                    <div
                      className="w-[75%] h-[75%] rounded-full flex items-center justify-center"
                      style={{
                        background: isFree && !isMarked
                          ? 'radial-gradient(circle at 38% 32%, #86efac, #22c55e 50%, #15803d)'
                          : `radial-gradient(circle at 38% 32%, ${BINGO_COLORS[letter.toLowerCase()]}99, ${BINGO_COLORS[letter.toLowerCase()]} 50%, ${BINGO_COLORS[letter.toLowerCase()]}dd)`,
                        boxShadow: 'inset 0 2px 6px rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.2)',
                      }}
                    >
                      {isFree && !isMarked && (
                        <span className="text-white text-[10px] sm:text-xs font-black drop-shadow-sm">FREE</span>
                      )}
                      {isMarked && (
                        <span className="text-white/90 text-xs sm:text-sm font-black drop-shadow-sm">{val === "FREE" ? "★" : val}</span>
                      )}
                    </div>
                  ) : (
                    <span className={`text-sm sm:text-base font-bold ${isDark ? 'text-[#8b6242]' : 'text-[#b08860]'}`}>
                      {val}
                    </span>
                  )}

                  {/* Bonus badge */}
                  {bonus && !isMarked && !isBlocked && (
                    <div className="absolute -top-0.5 -right-0.5 text-[8px] px-1 py-0.5 rounded font-black bg-gradient-to-br from-amber-500 to-yellow-400 text-white shadow-sm animate-bounce z-10 leading-none">
                      +{bonus.val}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Balls to go counter */}
      <div className="flex justify-center mt-2.5">
        <div className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg border border-white/50">
          <span className="text-sm font-black text-slate-700">{ballsToGo} balls to go</span>
        </div>
      </div>
    </div>
  );
};
