import { useState, useCallback, useEffect, useRef } from 'react';
import { fireBossProjectile } from '../utils/animationUtils';
import { GameState, GameSettings } from '../types';
import { INITIAL_MILESTONES, TARGET_SCORE } from '../constants';
import { BOSS_CHAT_MESSAGES } from '../config/bossChatConfig';
import { AUTO_DRAW_CONFIG } from '../config/autoDrawConfig';
import { BOSS_CONFIG } from '../config/bossConfig';
import { useBossLogic } from './useBossLogic';
import { generateBingoCard, checkJustCompletedBingo, FREE_SPACE_INDEX } from '../utils/bingoUtils';

export function useBingoGame() {
  const autoDrawTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [gameState, setGameState] = useState<GameState>(() => initNewGame());

  const { boss, resetBoss, setBoss, setReaction, pushChat, triggerMilestoneAction, triggerSpecificBossAction, triggerPlayerAction: triggerPlayerActionBoss } = useBossLogic(gameState.isGameOver);

  // Handle Boss Milestone Actions
  useEffect(() => {
    if (boss.currentAction === 'block') {
      const available = gameState.cardData
        .map((_, i) => i)
        .filter(i => i !== FREE_SPACE_INDEX && !gameState.boss.blockedCells.includes(i));
      if (available.length > 0) {
        const idx = available[Math.floor(Math.random() * available.length)];
        fireBossProjectile(`[data-cell-index="${idx}"]`, "#ef4444", () => {
          setGameState(prev => {
            const newBlocked = [...prev.boss.blockedCells, idx].slice(-BOSS_CONFIG.activeBoss.maxBlockedCells);
            const newMarked = [...prev.markedCells];
            newMarked[idx] = false;
            setTimeout(() => {
              setBoss(curr => ({ ...curr, blockedCells: curr.blockedCells.filter(id => id !== idx) }));
            }, BOSS_CONFIG.activeBoss.blockDurationMs);
            return { ...prev, markedCells: newMarked, boss: { ...prev.boss, blockedCells: newBlocked } };
          });
        });
      }
    } else if (boss.currentAction === 'freeze') {
      const available = gameState.cardData
        .map((_, i) => i)
        .filter(i => i !== FREE_SPACE_INDEX && !gameState.boss.frozenCells.includes(i) && !gameState.boss.blockedCells.includes(i));
      if (available.length > 0) {
        const idx = available[Math.floor(Math.random() * available.length)];
        fireBossProjectile(`[data-cell-index="${idx}"]`, "#93c5fd", () => {
          setGameState(prev => {
            const newFrozen = [...prev.boss.frozenCells, idx];
            setTimeout(() => {
              setBoss(curr => ({ ...curr, frozenCells: curr.frozenCells.filter(id => id !== idx) }));
            }, BOSS_CONFIG.activeBoss.freezeDurationMs);
            return { ...prev, boss: { ...prev.boss, frozenCells: newFrozen } };
          });
        });
      }
    } else if (boss.currentAction === 'blind') {
      const available = gameState.cardData
        .map((_, i) => i)
        .filter(i => i !== FREE_SPACE_INDEX && !gameState.boss.blindCells.includes(i));
      if (available.length > 0) {
        const idx = available[Math.floor(Math.random() * available.length)];
        fireBossProjectile(`[data-cell-index="${idx}"]`, "#7c3aed", () => {
          setGameState(prev => {
            const newBlind = [...prev.boss.blindCells, idx];
            setTimeout(() => {
              setBoss(curr => ({ ...curr, blindCells: curr.blindCells.filter(id => id !== idx) }));
            }, BOSS_CONFIG.activeBoss.blindDurationMs);
            return { ...prev, boss: { ...prev.boss, blindCells: newBlind } };
          });
        });
      }
    }
  }, [boss.currentAction]);

  // Sync boss state back to main game state
  useEffect(() => {
    setGameState(prev => ({ ...prev, boss }));
  }, [boss]);

  function initNewGame(): GameState {
    const { cardData, markedCells, bonusCells } = generateBingoCard();
    return {
      cardData,
      markedCells,
      bonusCells,
      drawnBalls: [],
      currentScore: 0,
      isGameOver: false,
      settings: { hints: false, autoDraw: false },
      milestones: INITIAL_MILESTONES.map(m => ({ ...m })),
      boss: {
        chatLog: [],
        lastAction: null,
        currentAction: null,
        reaction: 'idle',
        blockedCells: [],
        frozenCells: [],
        blindCells: [],
      },
      lastBingoTime: 0,
    };
  }

  const resetGame = useCallback(() => {
    setGameState(initNewGame());
    resetBoss();
  }, [resetBoss]);

  const drawBall = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver || prev.drawnBalls.length >= 75) return prev;
      let b: number;
      do {
        b = Math.floor(Math.random() * 75) + 1;
      } while (prev.drawnBalls.includes(b));
      return { ...prev, drawnBalls: [b, ...prev.drawnBalls] };
    });
  }, []);

  // Auto-draw effect
  useEffect(() => {
    if (gameState.settings.autoDraw && !gameState.isGameOver) {
      autoDrawTimerRef.current = setInterval(() => {
        drawBall();
      }, AUTO_DRAW_CONFIG.intervalMs);
    } else {
      if (autoDrawTimerRef.current) clearInterval(autoDrawTimerRef.current);
    }
    return () => {
      if (autoDrawTimerRef.current) clearInterval(autoDrawTimerRef.current);
    };
  }, [gameState.settings.autoDraw, gameState.isGameOver, drawBall]);

  const markCell = useCallback((index: number) => {
    setGameState(prev => {
      if (prev.isGameOver || prev.markedCells[index]) return prev;

      const val = prev.cardData[index];
      const isBlocked = prev.boss.blockedCells.includes(index);
      const isFrozen = prev.boss.frozenCells.includes(index);
      const canBeMarked = !isBlocked && !isFrozen && (val === "FREE" || prev.drawnBalls.includes(val as number));

      if (!canBeMarked) return prev;

      const newMarked = [...prev.markedCells];
      newMarked[index] = true;

      const bonus = prev.bonusCells[index];
      const scoreGain = bonus ? bonus.val : 20;
      const newScore = prev.currentScore + scoreGain;
      const isGameOver = newScore >= TARGET_SCORE;

      const newMilestones = prev.milestones.map(m => {
        if (newScore >= m.score && !m.reached) return { ...m, reached: true };
        return m;
      });

      const milestoneJustHit = newMilestones.some((m, idx) => m.reached && !prev.milestones[idx].reached);
      if (milestoneJustHit) {
        setTimeout(triggerMilestoneAction, 500);
      }

      const justCompletedBingo = checkJustCompletedBingo(prev.markedCells, newMarked);
      if (justCompletedBingo) {
        setReaction('angry', 3000);
        const bingoPool = BOSS_CHAT_MESSAGES.bingo;
        setTimeout(() => pushChat('boss_reaction', bingoPool[Math.floor(Math.random() * bingoPool.length)], '😡'), 0);
      }

      return {
        ...prev,
        markedCells: newMarked,
        currentScore: newScore,
        milestones: newMilestones,
        isGameOver: isGameOver || prev.isGameOver,
        lastBingoTime: justCompletedBingo ? Date.now() : prev.lastBingoTime,
      };
    });
  }, [setReaction, triggerMilestoneAction]);

  const updateSettings = useCallback((settings: Partial<GameSettings>) => {
    setGameState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
    }));
  }, []);

  const triggerPlayerAction = useCallback((actionId: string) => {
    triggerPlayerActionBoss(actionId);
    if (actionId === 'lucky-magnet') {
      setGameState(prev => {
        if (prev.isGameOver) return prev;
        const bonus = Math.floor(TARGET_SCORE * 0.15);
        const newScore = Math.min(prev.currentScore + bonus, TARGET_SCORE);
        const newMilestones = prev.milestones.map(m => {
          if (newScore >= m.score && !m.reached) return { ...m, reached: true };
          return m;
        });
        const milestoneJustHit = newMilestones.some((m, idx) => m.reached && !prev.milestones[idx].reached);
        if (milestoneJustHit) {
          setTimeout(triggerMilestoneAction, 500);
        }
        return { ...prev, currentScore: newScore, milestones: newMilestones, isGameOver: newScore >= TARGET_SCORE };
      });
    }
  }, [triggerPlayerActionBoss, triggerMilestoneAction]);

  const collectMilestone = useCallback((score: number) => {
    setGameState(prev => {
      const milestone = prev.milestones.find(m => m.score === score);
      if (milestone && milestone.reached && !milestone.collected) {
        return {
          ...prev,
          milestones: prev.milestones.map(m => m.score === score ? { ...m, collected: true } : m)
        };
      }
      return prev;
    });
  }, []);

  return {
    gameState,
    drawBall,
    markCell,
    updateSettings,
    resetGame,
    collectMilestone,
    pushChat,
    triggerBossAction: triggerSpecificBossAction,
    triggerPlayerAction: triggerPlayerAction,
  };
}
