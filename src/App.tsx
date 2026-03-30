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
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 selection:bg-blue-100">
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
      
      <div className="max-w-[1600px] mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-stretch">
          
          {/* LEFT COLUMN: CONTROLS */}
          <ControlPanel
            drawnBalls={drawnBalls}
            onDraw={drawBall}
            onReset={resetGame}
            settings={settings}
            onUpdateSettings={updateSettings}
            isGameOver={isGameOver}
          />

          {/* MIDDLE COLUMN: GAMEPLAY */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <ScoreAttack
              currentScore={currentScore}
              milestones={milestones}
              onCollect={collectMilestone}
            />

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

          {/* RIGHT COLUMN: BOSS ZONE */}
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
