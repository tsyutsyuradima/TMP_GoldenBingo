import { useState, useCallback, useEffect, useRef } from 'react';
import { fireBossProjectile, firePlayerProjectile } from '../utils/animationUtils';
import { GameState, GameSettings, Milestone, BonusCell, Cast } from '../types';
import { BINGO_RANGES, INITIAL_MILESTONES, TARGET_SCORE, BOSS_MESSAGES } from '../constants';
import { BOSS_CASTS } from '../config/casts';
import { CHOICE_TRIGGER_CONFIG } from '../config/choiceConfig';
import { BOSS_CONFIG } from '../config/bossConfig';
import { useBossLogic } from './useBossLogic';
import { generateBingoCard, checkJustCompletedBingo, FREE_SPACE_INDEX } from '../utils/bingoUtils';

export function useBingoGame() {
  const autoDrawTimerRef = useRef<NodeJS.Timeout | null>(null);
  const choiceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const marksSinceLastChoice = useRef(0);

  const [gameState, setGameState] = useState<GameState>(() => {
    return initNewGame();
  });

  const { boss, applyBossEffect, resetBoss, setBoss, setReaction, switchBossType } = useBossLogic(gameState.isGameOver);

  // Handle Active Boss Actions with Flying Projectiles
  useEffect(() => {
    if (boss.type === 'active' && boss.currentAction) {
      if (boss.currentAction === 'block') {
        const availableIndices = gameState.cardData.map((_, i) => i).filter(i => i !== FREE_SPACE_INDEX && !gameState.boss.blockedCells.includes(i));
        if (availableIndices.length > 0) {
          const randomIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
          fireBossProjectile(`[data-cell-index="${randomIdx}"]`, "#ef4444", () => {
            setGameState(prev => {
              const newBlocked = [...prev.boss.blockedCells, randomIdx].slice(-BOSS_CONFIG.activeBoss.maxBlockedCells);
              const newMarked = [...prev.markedCells];
              newMarked[randomIdx] = false;
              
              setTimeout(() => {
                setBoss(curr => ({
                  ...curr,
                  blockedCells: curr.blockedCells.filter(id => id !== randomIdx)
                }));
              }, BOSS_CONFIG.activeBoss.blockDurationMs);

              return {
                ...prev,
                markedCells: newMarked,
                boss: { ...prev.boss, blockedCells: newBlocked }
              };
            });
          });
        }
      } else if (boss.currentAction === 'remove-daub') {
        const markedIndices = gameState.markedCells.map((m, i) => m ? i : -1).filter(i => i !== -1 && i !== FREE_SPACE_INDEX);
        if (markedIndices.length > 0) {
          const randomIdx = markedIndices[Math.floor(Math.random() * markedIndices.length)];
          fireBossProjectile(`[data-cell-index="${randomIdx}"]`, "#38bdf8", () => {
            setGameState(prev => {
              const newMarked = [...prev.markedCells];
              let scoreLoss = 0;
              if (newMarked[randomIdx]) {
                newMarked[randomIdx] = false;
                const bonus = prev.bonusCells[randomIdx];
                scoreLoss = bonus ? bonus.val : 20;
              }
              return { 
                ...prev, 
                markedCells: newMarked,
                currentScore: Math.max(0, prev.currentScore - scoreLoss)
              };
            });
          });
        }
      } else if (boss.currentAction === 'remove-points') {
        fireBossProjectile('#score-display', "#f59e0b", () => {
          setGameState(prev => {
            const loss = Math.floor(Math.random() * 50) + 20;
            return {
              ...prev,
              currentScore: Math.max(0, prev.currentScore - loss)
            };
          });
        });
      } else if (boss.currentAction === 'scramble') {
        const markedIndices = gameState.markedCells.map((m, i) => m ? i : -1).filter(i => i !== -1 && i !== FREE_SPACE_INDEX);
        if (markedIndices.length >= 2) {
          const targets = markedIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
          targets.forEach(idx => {
            fireBossProjectile(`[data-cell-index="${idx}"]`, "#a855f7", () => {
              setGameState(prev => {
                const newMarked = [...prev.markedCells];
                let scoreLoss = 0;
                if (newMarked[idx]) {
                  newMarked[idx] = false;
                  const bonus = prev.bonusCells[idx];
                  scoreLoss = bonus ? bonus.val : 20;
                }
                return { 
                  ...prev, 
                  markedCells: newMarked,
                  currentScore: Math.max(0, prev.currentScore - scoreLoss)
                };
              });
            });
          });
        }
      }
    }
  }, [boss.currentAction, boss.type]);

  // Sync boss state back to main game state
  useEffect(() => {
    setGameState(prev => ({ ...prev, boss }));
  }, [boss]);

  const triggerChoice = useCallback(() => {
    setGameState(prev => {
      if (prev.activeChoice || prev.boss.activeSpellId || prev.boss.type === 'active') return prev;
      const randomCasts = [...BOSS_CASTS].sort(() => 0.5 - Math.random()).slice(0, 4);
      marksSinceLastChoice.current = 0;
      return {
        ...prev,
        activeChoice: randomCasts,
        choiceTimer: CHOICE_TRIGGER_CONFIG.choiceDurationSeconds
      };
    });
  }, []);

  const drawBall = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver || prev.drawnBalls.length >= 75 || prev.activeChoice) return prev;
      let b: number;
      do {
        b = Math.floor(Math.random() * 75) + 1;
      } while (prev.drawnBalls.includes(b));

      const newDrawnBalls = [b, ...prev.drawnBalls];

      if (CHOICE_TRIGGER_CONFIG.triggerEveryXBalls > 0 && 
          newDrawnBalls.length % CHOICE_TRIGGER_CONFIG.triggerEveryXBalls === 0) {
        setTimeout(triggerChoice, 500);
      }

      return {
        ...prev,
        drawnBalls: newDrawnBalls,
      };
    });
  }, [triggerChoice]);

  // Auto-draw effect
  useEffect(() => {
    if (gameState.settings.autoDraw && !gameState.isGameOver && !gameState.activeChoice) {
      autoDrawTimerRef.current = setInterval(() => {
        drawBall();
      }, 3000);
    } else {
      if (autoDrawTimerRef.current) clearInterval(autoDrawTimerRef.current);
    }
    return () => {
      if (autoDrawTimerRef.current) clearInterval(autoDrawTimerRef.current);
    };
  }, [gameState.settings.autoDraw, gameState.isGameOver, gameState.activeChoice, drawBall]);

  function initNewGame(): GameState {
    const { cardData, markedCells, bonusCells } = generateBingoCard();

    marksSinceLastChoice.current = 0;

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
        type: 'goal',
        progress: 0,
        isPaused: false,
        isBlurred: false,
        isSlowed: false,
        message: BOSS_MESSAGES.idle[0],
        lastAction: null,
        currentAction: null,
        reaction: 'idle',
        blockedCells: [],
        nextActionProgress: 0
      },
      activeChoice: null,
      choiceTimer: 0,
      lastBingoTime: 0,
      projectiles: []
    };
  }

  const resetGame = useCallback(() => {
    setGameState(initNewGame());
    resetBoss();
  }, [resetBoss]);

  const applyCast = useCallback((cast: Cast) => {
    // Clear UI instantly
    setGameState(prev => ({
      ...prev,
      activeChoice: null,
      choiceTimer: 0
    }));

    // Derive a thematic color based on cast id
    let color = "#eab308"; // default gold
    if (cast.id === 'tea-break') color = "#d97706";
    else if (cast.id === 'foggy-glasses') color = "#94a3b8";
    else if (cast.id === 'lucky-magnet') color = "#ef4444";
    else if (cast.id === 'soap-bubbles') color = "#38bdf8";
    else if (cast.id === 'yarn-tangle') color = "#a855f7";
    else if (cast.id === 'cookie-crumbs') color = "#f59e0b";

    firePlayerProjectile(color, () => {
      applyBossEffect(cast);
      
      // Some casts affect player score too, apply them on impact
      if (cast.id === 'lucky-magnet') {
        setGameState(prev => ({
          ...prev,
          currentScore: prev.currentScore + Math.floor(prev.boss.progress * 0.15)
        }));
      } else if (cast.id === 'magic-mirror') {
        setGameState(prev => ({
          ...prev,
          currentScore: prev.currentScore + Math.min(prev.boss.progress, 50)
        }));
      }
    });
  }, [applyBossEffect]);

  const rerollChoices = useCallback(() => {
    setGameState(prev => {
      if (!prev.activeChoice || prev.currentScore < 50) return prev;
      const randomCasts = [...BOSS_CASTS].sort(() => 0.5 - Math.random()).slice(0, 4);
      return {
        ...prev,
        currentScore: prev.currentScore - 50,
        activeChoice: randomCasts
      };
    });
  }, []);

  const updateScore = useCallback((amount: number) => {
    setGameState(prev => {
      if (prev.isGameOver) return prev;
      const newScore = prev.currentScore + amount;
      
      const newMilestones = prev.milestones.map(m => {
        if (newScore >= m.score && !m.reached) {
          return { ...m, reached: true };
        }
        return m;
      });

      const isGameOver = newScore >= TARGET_SCORE;

      return {
        ...prev,
        currentScore: newScore,
        milestones: newMilestones,
        isGameOver: isGameOver || prev.isGameOver,
      };
    });
  }, []);

  const markCell = useCallback((index: number) => {
    setGameState(prev => {
      if (prev.isGameOver || prev.markedCells[index] || prev.activeChoice) return prev;
      
      const val = prev.cardData[index];
      const isBlocked = prev.boss.blockedCells.includes(index);
      const canBeMarked = !isBlocked && (val === "FREE" || prev.drawnBalls.includes(val as number));

      if (!canBeMarked) return prev;

      const newMarked = [...prev.markedCells];
      newMarked[index] = true;

      marksSinceLastChoice.current += 1;

      const bonus = prev.bonusCells[index];
      const scoreGain = bonus ? bonus.val : 20;

      let bingoBonus = 0;
      const justCompletedBingo = checkJustCompletedBingo(prev.markedCells, newMarked);

      const totalGain = scoreGain + bingoBonus;
      const newScore = prev.currentScore + totalGain;
      const isGameOver = newScore >= TARGET_SCORE;

      const newMilestones = prev.milestones.map(m => {
        if (newScore >= m.score && !m.reached) {
          return { ...m, reached: true };
        }
        return m;
      });

      if (justCompletedBingo) {
        bingoBonus = 100;
        setReaction('angry', 3000);
        if (CHOICE_TRIGGER_CONFIG.triggerOnBingo) {
          setTimeout(triggerChoice, 500);
        }
        return {
          ...prev,
          markedCells: newMarked,
          currentScore: newScore,
          milestones: newMilestones,
          isGameOver: isGameOver || prev.isGameOver,
          lastBingoTime: Date.now()
        };
      } else if (CHOICE_TRIGGER_CONFIG.triggerOnCombo > 0 && 
                 marksSinceLastChoice.current >= CHOICE_TRIGGER_CONFIG.triggerOnCombo) {
        setReaction('surprised', 2000);
        setTimeout(triggerChoice, 500);
      }

      return {
        ...prev,
        markedCells: newMarked,
        currentScore: newScore,
        milestones: newMilestones,
        isGameOver: isGameOver || prev.isGameOver,
      };
    });
  }, [triggerChoice, setReaction]);

  const updateSettings = useCallback((settings: Partial<GameSettings>) => {
    setGameState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
    }));
  }, []);

  const collectMilestone = useCallback((score: number) => {
    setGameState(prev => {
      const milestone = prev.milestones.find(m => m.score === score);
      if (milestone && milestone.reached && !milestone.collected) {
        if (CHOICE_TRIGGER_CONFIG.triggerOnMilestone) {
          setTimeout(triggerChoice, 500);
        }
        return {
          ...prev,
          milestones: prev.milestones.map(m => m.score === score ? { ...m, collected: true } : m)
        };
      }
      return prev;
    });
  }, [triggerChoice]);

  // Choice Timer Effect
  useEffect(() => {
    if (gameState.activeChoice && gameState.choiceTimer > 0) {
      choiceTimerRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.choiceTimer <= 1) {
            if (choiceTimerRef.current) clearInterval(choiceTimerRef.current);
            return { ...prev, activeChoice: null, choiceTimer: 0 };
          }
          return { ...prev, choiceTimer: prev.choiceTimer - 1 };
        });
      }, 1000);
    } else {
      if (choiceTimerRef.current) clearInterval(choiceTimerRef.current);
    }
    return () => {
      if (choiceTimerRef.current) clearInterval(choiceTimerRef.current);
    };
  }, [gameState.activeChoice, gameState.choiceTimer]);

  // Sync game over state from boss
  useEffect(() => {
    if (boss.progress >= 500 && !gameState.isGameOver) {
      setGameState(prev => ({ ...prev, isGameOver: true }));
    }
  }, [boss.progress, gameState.isGameOver]);

  return {
    gameState,
    drawBall,
    markCell,
    updateSettings,
    resetGame,
    collectMilestone,
    applyCast,
    rerollChoices,
    switchBossType
  };
}
