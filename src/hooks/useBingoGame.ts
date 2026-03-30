import { useState, useCallback, useEffect, useRef } from 'react';
import { triggerProjectile } from '../components/ParticleCanvas';
import { GameState, GameSettings, Milestone, BonusCell, Cast } from '../types';
import { BINGO_RANGES, INITIAL_MILESTONES, TARGET_SCORE, BOSS_MESSAGES } from '../constants';
import { BOSS_CASTS } from '../config/casts';
import { CHOICE_TRIGGER_CONFIG } from '../config/choiceConfig';
import { BOSS_CONFIG } from '../config/bossConfig';
import { useBossLogic } from './useBossLogic';

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
      const startEl = document.getElementById('boss-projectile-start');
      if (!startEl) return;
      const startRect = startEl.getBoundingClientRect();
      const startX = startRect.left + startRect.width / 2;
      const startY = startRect.top + startRect.height / 2;

      if (boss.currentAction === 'block') {
        const availableIndices = gameState.cardData.map((_, i) => i).filter(i => i !== 12 && !gameState.boss.blockedCells.includes(i));
        if (availableIndices.length > 0) {
          const randomIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
          const endEl = document.querySelector(`[data-cell-index="${randomIdx}"]`);
          if (endEl) {
            const endRect = endEl.getBoundingClientRect();
            triggerProjectile(startX, startY, endRect.left + endRect.width / 2, endRect.top + endRect.height / 2, "#ef4444", () => {
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
        }
      } else if (boss.currentAction === 'remove-daub') {
        const markedIndices = gameState.markedCells.map((m, i) => m ? i : -1).filter(i => i !== -1 && i !== 12);
        if (markedIndices.length > 0) {
          const randomIdx = markedIndices[Math.floor(Math.random() * markedIndices.length)];
          const endEl = document.querySelector(`[data-cell-index="${randomIdx}"]`);
          if (endEl) {
            const endRect = endEl.getBoundingClientRect();
            triggerProjectile(startX, startY, endRect.left + endRect.width / 2, endRect.top + endRect.height / 2, "#38bdf8", () => {
              setGameState(prev => {
                const newMarked = [...prev.markedCells];
                newMarked[randomIdx] = false;
                return { ...prev, markedCells: newMarked };
              });
            });
          }
        }
      } else if (boss.currentAction === 'remove-points') {
        const scoreEl = document.getElementById('score-display');
        if (scoreEl) {
          const rect = scoreEl.getBoundingClientRect();
          const targetX = rect.left + rect.width / 2;
          const targetY = rect.top + rect.height / 2;
          triggerProjectile(startX, startY, targetX, targetY, "#f59e0b", () => {
            setGameState(prev => {
              const loss = Math.floor(Math.random() * 50) + 20;
              return {
                ...prev,
                currentScore: Math.max(0, prev.currentScore - loss)
              };
            });
          });
        }
      } else if (boss.currentAction === 'scramble') {
        const markedIndices = gameState.markedCells.map((m, i) => m ? i : -1).filter(i => i !== -1 && i !== 12);
        if (markedIndices.length >= 2) {
          const targets = markedIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
          targets.forEach(idx => {
            const endEl = document.querySelector(`[data-cell-index="${idx}"]`);
            if (endEl) {
              const endRect = endEl.getBoundingClientRect();
              triggerProjectile(startX, startY, endRect.left + endRect.width / 2, endRect.top + endRect.height / 2, "#a855f7", () => {
                setGameState(prev => {
                  const newMarked = [...prev.markedCells];
                  newMarked[idx] = false;
                  return { ...prev, markedCells: newMarked };
                });
              });
            }
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
      if (prev.activeChoice) return prev;
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
    const columns = BINGO_RANGES.map(([min, max]) => {
      const s = new Set<number>();
      while (s.size < 5) s.add(Math.floor(Math.random() * (max - min + 1)) + min);
      return Array.from(s).sort((a, b) => a - b);
    });

    const cardData: (number | "FREE")[] = [];
    const markedCells = Array(25).fill(false);
    const bonusCells: (BonusCell | null)[] = Array(25).fill(null);

    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (r === 2 && c === 2) {
          cardData.push("FREE");
          markedCells[12] = true;
        } else {
          cardData.push(columns[c][r]);
        }
      }
    }

    let b = 0;
    while (b < 6) {
      const i = Math.floor(Math.random() * 25);
      if (i !== 12 && !bonusCells[i]) {
        bonusCells[i] = { val: [50, 100, 150][Math.floor(Math.random() * 3)] };
        b++;
      }
    }

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
    applyBossEffect(cast);
    
    // Some casts affect player score too
    if (cast.id === 'lucky-magnet') {
      setGameState(prev => ({
        ...prev,
        currentScore: prev.currentScore + Math.floor(prev.boss.progress * 0.15),
        activeChoice: null,
        choiceTimer: 0
      }));
    } else if (cast.id === 'magic-mirror') {
      setGameState(prev => ({
        ...prev,
        currentScore: prev.currentScore + Math.min(prev.boss.progress, 50),
        activeChoice: null,
        choiceTimer: 0
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        activeChoice: null,
        choiceTimer: 0
      }));
    }
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

      const lines = [
        [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
        [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
        [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
      ];

      let bingoBonus = 0;
      const justCompletedBingo = lines.some(line => {
        const wasComplete = line.every(idx => prev.markedCells[idx]);
        const isComplete = line.every(idx => newMarked[idx]);
        return !wasComplete && isComplete;
      });

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
