import { useState, useEffect, useRef, useCallback } from 'react';
import { BossState, Cast } from '../types';
import { BOSS_MESSAGES } from '../constants';
import { BOSS_CONFIG } from '../config/bossConfig';

export function useBossLogic(isGameOver: boolean) {
  const [boss, setBoss] = useState<BossState>({
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
  });

  const bossTimerRef = useRef<NodeJS.Timeout | null>(null);
  const actionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeBossTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeSpellTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetBoss = useCallback(() => {
    setBoss(prev => ({
      ...prev,
      progress: 0,
      isPaused: false,
      isBlurred: false,
      isSlowed: false,
      message: BOSS_MESSAGES.idle[0],
      lastAction: null,
      currentAction: null,
      reaction: 'idle',
      blockedCells: [],
      nextActionProgress: 0,
      activeSpellId: null
    }));
    if (activeSpellTimeoutRef.current) clearTimeout(activeSpellTimeoutRef.current);
  }, []);

  const switchBossType = useCallback((type: BossState['type']) => {
    if (activeSpellTimeoutRef.current) clearTimeout(activeSpellTimeoutRef.current);
    
    setBoss(prev => {
      if (prev.type === type) return prev;
      return {
        ...prev,
        type,
        activeSpellId: null,
        isPaused: false,
        isSlowed: false,
        isBlurred: false,
        message: type === 'active' ? "Let's play together! 😈" : "Try to beat my progress! 🐰",
        reaction: 'evil'
      };
    });
  }, []);

  const setReaction = useCallback((reaction: BossState['reaction'], duration = 2000) => {
    setBoss(prev => ({ ...prev, reaction }));
    if (reactionTimeoutRef.current) clearTimeout(reactionTimeoutRef.current);
    reactionTimeoutRef.current = setTimeout(() => {
      setBoss(prev => ({ ...prev, reaction: 'idle' }));
    }, duration);
  }, []);

  const triggerBossAction = useCallback(() => {
    if (isGameOver || boss.isPaused) return;

    const actions = ['daub', 'powerup'];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    setBoss(prev => {
      let increment = 0;
      let message = "";
      let reaction: BossState['reaction'] = 'happy';

      if (action === 'daub') {
        increment = 10;
        message = BOSS_MESSAGES.reaction.daub[Math.floor(Math.random() * BOSS_MESSAGES.reaction.daub.length)];
        reaction = 'happy';
      } else if (action === 'powerup') {
        increment = 25;
        message = BOSS_MESSAGES.reaction.powerup[Math.floor(Math.random() * BOSS_MESSAGES.reaction.powerup.length)];
        reaction = 'taunting';
      }

      return {
        ...prev,
        progress: Math.min(BOSS_CONFIG.maxProgress, prev.progress + increment),
        message,
        reaction,
        currentAction: action
      };
    });

    // Clear action after 3s
    setTimeout(() => {
      setBoss(prev => ({ ...prev, currentAction: null, reaction: 'idle' }));
    }, 3000);
  }, [isGameOver, boss.isPaused]);

  const applyBossEffect = useCallback((cast: Cast) => {
    if (activeSpellTimeoutRef.current) clearTimeout(activeSpellTimeoutRef.current);

    setBoss(prev => {
      const cleanState = { 
        ...prev, 
        isPaused: false, 
        isSlowed: false, 
        isBlurred: false 
      };

      let newBoss = { 
        ...cleanState, 
        lastAction: cast.id, 
        activeSpellId: cast.activeDurationMs ? cast.id : null,
        message: BOSS_MESSAGES.hit[Math.floor(Math.random() * BOSS_MESSAGES.hit.length)],
        reaction: 'angry' as const
      };
      
      if (cast.onExecute) {
        newBoss = cast.onExecute(newBoss);
      }
      return newBoss;
    });

    if (cast.activeDurationMs) {
      activeSpellTimeoutRef.current = setTimeout(() => {
        setBoss(curr => {
          if (curr.activeSpellId !== cast.id) return curr;
          return { 
            ...curr, 
            isPaused: false, 
            isSlowed: false, 
            isBlurred: false, 
            activeSpellId: null, 
            reaction: 'idle', 
            message: BOSS_MESSAGES.idle[0] 
          };
        });
      }, cast.activeDurationMs);
    }
  }, []);

  // Main tick for Boss Progress
  useEffect(() => {
    if (!isGameOver && !boss.isPaused) {
      bossTimerRef.current = setInterval(() => {
        setBoss(prev => {
          if (prev.isPaused || isGameOver) return prev;
          
          let increment = BOSS_CONFIG.baseIncrement;
          if (prev.isBlurred) increment = BOSS_CONFIG.slowIncrement;
          if (prev.isSlowed) increment = Math.max(1, Math.floor(increment * BOSS_CONFIG.slowMultiplier));

          const newProgress = Math.min(BOSS_CONFIG.maxProgress, prev.progress + increment);
          
          let newMessage = prev.message;
          let newReaction = prev.reaction;

          if (prev.type === 'goal' && newProgress % BOSS_CONFIG.tauntFrequency === 0) {
            newMessage = BOSS_MESSAGES.taunt[Math.floor(Math.random() * BOSS_MESSAGES.taunt.length)];
            newReaction = 'taunting';
          }

          if (prev.type === 'goal' && newProgress >= BOSS_CONFIG.maxProgress) {
            return { ...prev, progress: BOSS_CONFIG.maxProgress, message: BOSS_MESSAGES.win[0], reaction: 'happy' };
          }

          return { ...prev, progress: newProgress, message: newMessage, reaction: newReaction };
        });
      }, BOSS_CONFIG.tickIntervalMs);
    } else {
      if (bossTimerRef.current) clearInterval(bossTimerRef.current);
    }
    return () => {
      if (bossTimerRef.current) clearInterval(bossTimerRef.current);
    };
  }, [isGameOver, boss.isPaused, boss.isBlurred, boss.isSlowed]);

  // Active Boss Actions Effect (Granular for progress bar)
  useEffect(() => {
    if (!isGameOver && !boss.isPaused && boss.type === 'active') {
      const stepMs = 100;
      const totalMs = BOSS_CONFIG.activeBoss.actionIntervalMs;
      const increment = (stepMs / totalMs) * 100;

      activeBossTimerRef.current = setInterval(() => {
        setBoss(prev => {
          if (prev.isPaused || isGameOver || prev.type !== 'active') return prev;
          
          const newProgress = prev.nextActionProgress + increment;
          
          if (newProgress >= 100) {
            // Trigger action
            const actions = ['block', 'remove-daub', 'scramble', 'remove-points'];
            const action = actions[Math.floor(Math.random() * actions.length)];
            
            let message = "";
            let reaction: BossState['reaction'] = 'evil';
            let currentAction = action;

            if (action === 'block') {
              message = "I'm blocking this cell! 🚫";
            } else if (action === 'remove-daub') {
              message = "Oops! Did you lose something? 🧼";
            } else if (action === 'scramble') {
              message = "Let's mix it up! 🌪️";
            } else if (action === 'remove-points') {
              message = "I'll take some points! 💰";
            }

            // Clear action after 3s
            setTimeout(() => {
              setBoss(p => ({ ...p, currentAction: null, reaction: 'idle' }));
            }, 3000);

            return {
              ...prev,
              nextActionProgress: 0,
              message,
              reaction,
              currentAction
            };
          }

          return { ...prev, nextActionProgress: newProgress };
        });
      }, stepMs);
    } else {
      if (activeBossTimerRef.current) clearInterval(activeBossTimerRef.current);
    }
    return () => {
      if (activeBossTimerRef.current) clearInterval(activeBossTimerRef.current);
    };
  }, [isGameOver, boss.isPaused, boss.type]);

  // Random actions for Goal Mode
  useEffect(() => {
    if (!isGameOver && !boss.isPaused && boss.type === 'goal') {
      actionTimerRef.current = setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance every 5s
          triggerBossAction();
        }
      }, 5000);
    } else {
      if (actionTimerRef.current) clearInterval(actionTimerRef.current);
    }
    return () => {
      if (actionTimerRef.current) clearInterval(actionTimerRef.current);
    };
  }, [isGameOver, boss.isPaused, triggerBossAction, boss.type]);

  return {
    boss,
    applyBossEffect,
    resetBoss,
    setBoss,
    setReaction,
    switchBossType
  };
}
