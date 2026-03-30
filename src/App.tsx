/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { useBingoGame } from './hooks/useBingoGame';
import { BingoBoard } from './components/BingoBoard';
import { ControlPanel } from './components/ControlPanel';
import { ScoreAttack } from './components/ScoreAttack';
import { WinModal } from './components/WinModal';
import { ParticleCanvas } from './components/ParticleCanvas';
import { LiveBossZone } from './components/LiveBossZone';
import { BossChoice } from './components/BossChoice';
import { BINGO_COLORS } from './constants';

export default function App() {
  const {
    gameState,
    drawBall,
    markCell,
    updateSettings,
    resetGame,
    collectMilestone,
    applyCast,
    rerollChoices,
    switchBossType,
  } = useBingoGame();

  const {
    cardData,
    markedCells,
    bonusCells,
    drawnBalls,
    currentScore,
    isGameOver,
    settings,
    milestones,
    boss,
    activeChoice,
    choiceTimer,
  } = gameState;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-amber-100 font-sans text-slate-900 selection:bg-blue-100 overflow-x-hidden">
      <ParticleCanvas />

      {/* Screen Flash on Choice */}
      <AnimatePresence>
        {activeChoice && (
          <motion.div
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-white z-[100] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Boss Action Announcement */}
      <AnimatePresence>
        {boss.currentAction && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[70]"
          >
            <div className="bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-2xl border-2 border-purple-400 flex items-center gap-2">
              <span className="text-lg">
                {boss.currentAction === 'daub' ? '🎯' :
                 boss.currentAction === 'powerup' ? '⚡' :
                 boss.currentAction === 'block' ? '🚫' :
                 boss.currentAction === 'remove-daub' ? '🧼' : '🌪️'}
              </span>
              <span className="text-xs font-black uppercase tracking-tight">
                {boss.currentAction === 'daub' ? 'Binky Daubed!' :
                 boss.currentAction === 'powerup' ? 'Binky Powerup!' :
                 boss.currentAction === 'block' ? 'Cell Blocked!' :
                 boss.currentAction === 'remove-daub' ? 'Daub Removed!' : 'Board Scrambled!'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative clouds */}
      <div className="fixed top-10 left-[10%] w-32 h-12 bg-white/20 rounded-full blur-xl pointer-events-none" />
      <div className="fixed top-20 right-[15%] w-48 h-16 bg-white/15 rounded-full blur-2xl pointer-events-none" />
      <div className="fixed top-6 right-[40%] w-24 h-10 bg-white/20 rounded-full blur-lg pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 py-4 relative z-10">
        {/* TOP BAR: Drawn balls + controls */}
        <ControlPanel
          drawnBalls={drawnBalls}
          onDraw={drawBall}
          onReset={resetGame}
          settings={settings}
          onUpdateSettings={updateSettings}
          isGameOver={isGameOver}
        />

        {/* VS SCORE BAR */}
        <div className="mt-3">
          <ScoreAttack
            currentScore={currentScore}
            milestones={milestones}
            onCollect={collectMilestone}
            boss={boss}
          />
        </div>

        {/* 3-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 xl:gap-6 mt-4 items-start">

          {/* LEFT: Round Log */}
          <div className="lg:col-span-3">
            <div className="bg-white/30 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/40">
              <div className="flex justify-between items-center mb-3 px-1">
                <span className="text-[10px] font-black uppercase text-slate-700 tracking-widest">Round Log</span>
                <span className="text-[10px] font-bold text-white bg-slate-800/70 px-2.5 py-0.5 rounded-full">{drawnBalls.length} / 75</span>
              </div>
              <div className="flex flex-wrap gap-2 max-h-[420px] overflow-y-auto pr-1">
                {drawnBalls.map((b, i) => {
                  const l = "BINGO"[Math.floor((b - 1) / 15)];
                  const color = BINGO_COLORS[l.toLowerCase()];
                  const isLatest = i === 0;
                  return (
                    <motion.div
                      key={i}
                      initial={isLatest ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm border-2 border-white/60 relative ${isLatest ? 'ring-2 ring-offset-1 ring-yellow-400' : ''}`}
                      style={{ backgroundColor: color }}
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
                {drawnBalls.length === 0 && (
                  <p className="text-xs text-slate-500 italic w-full text-center py-4">No balls drawn yet</p>
                )}
              </div>
            </div>

            {/* Draw Controls under Round Log */}
            <div className="flex flex-col items-center gap-3 mt-4">
              {!settings.autoDraw ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={drawBall}
                  disabled={isGameOver || !!activeChoice}
                  className="w-full bg-gradient-to-b from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-black py-3.5 rounded-2xl shadow-[0_4px_16px_rgba(220,38,38,0.4)] text-base uppercase tracking-tight disabled:opacity-50 transition-all border-2 border-red-400/50"
                >
                  Draw Ball
                </motion.button>
              ) : (
                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-md">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-5 h-5 rounded-full border-[3px] border-blue-500 border-t-transparent"
                  />
                  <span className="text-sm font-bold text-slate-600">Auto-Drawing...</span>
                </div>
              )}
              <button
                onClick={resetGame}
                className="text-[10px] font-bold text-slate-500 hover:text-red-600 transition uppercase tracking-widest"
              >
                Reset Progress
              </button>
            </div>
          </div>

          {/* CENTER: Bingo Card */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <BingoBoard
              cardData={cardData}
              markedCells={markedCells}
              bonusCells={bonusCells}
              drawnBalls={drawnBalls}
              hintsEnabled={settings.hints}
              isGameOver={isGameOver}
              isPaused={!!activeChoice}
              lastBingoTime={gameState.lastBingoTime}
              onMarkCell={markCell}
              blockedCells={boss.blockedCells}
            />
          </div>

          {/* RIGHT: Live Boss Zone */}
          <LiveBossZone
            boss={boss}
            activeChoice={activeChoice}
            choiceTimer={choiceTimer}
            onSelectCast={applyCast}
            onReroll={rerollChoices}
            canReroll={currentScore >= 50}
            onSwitchType={switchBossType}
          />
        </div>
      </div>

      {/* BOSS CHOICE OVERLAY */}
      <BossChoice
        casts={activeChoice}
        timer={choiceTimer}
        onSelect={applyCast}
        onReroll={rerollChoices}
        canReroll={currentScore >= 50}
      />

      {/* WIN MODAL */}
      <WinModal
        isOpen={isGameOver}
        title={boss.progress >= 500 ? "Binky Won!" : (currentScore >= 500 ? "Super Treasure!" : "Treasure Collected!")}
        amount={boss.progress >= 500 ? 0 : (currentScore >= 500 ? 10000 : 5000)}
        icon={boss.progress >= 500 ? "😭" : (currentScore >= 500 ? "🏺" : "💰")}
        score={currentScore}
        onReset={resetGame}
      />
    </div>
  );
}
