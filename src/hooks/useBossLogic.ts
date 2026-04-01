import { useState, useCallback, useRef, useEffect } from 'react';
import { BossState, BossChatMessage, BossChatMessageType } from '../types';
import { BOSS_CHAT_MESSAGES } from '../config/bossChatConfig';

const MAX_CHAT_LOG = 50;

function makeChatMessage(type: BossChatMessageType, text: string, actionIcon?: string): BossChatMessage {
  return { id: `${Date.now()}-${Math.random()}`, type, text, actionIcon, timestamp: Date.now() };
}

function createInitialBoss(): BossState {
  const startMsg = BOSS_CHAT_MESSAGES.gameStart[Math.floor(Math.random() * BOSS_CHAT_MESSAGES.gameStart.length)];
  return {
    chatLog: [makeChatMessage('system', startMsg)],
    lastAction: null,
    currentAction: null,
    reaction: 'idle',
    blockedCells: [],
    frozenCells: [],
    blindCells: [],
  };
}

export function useBossLogic(isGameOver: boolean) {
  const [boss, setBoss] = useState<BossState>(createInitialBoss);
  const reactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const pushChat = useCallback((type: BossChatMessageType, text: string, actionIcon?: string) => {
    setBoss(prev => ({
      ...prev,
      chatLog: [...prev.chatLog, makeChatMessage(type, text, actionIcon)].slice(-MAX_CHAT_LOG),
    }));
  }, []);

  // Idle taunts every 12-20 seconds
  useEffect(() => {
    if (isGameOver) return;
    const schedule = () => {
      const delay = 12000 + Math.random() * 8000;
      idleTimerRef.current = setTimeout(() => {
        const pool = BOSS_CHAT_MESSAGES.idle;
        const text = pool[Math.floor(Math.random() * pool.length)];
        setBoss(prev => ({
          ...prev,
          chatLog: [...prev.chatLog, makeChatMessage('boss_idle', text)].slice(-MAX_CHAT_LOG),
        }));
        schedule();
      }, delay);
    };
    schedule();
    return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); };
  }, [isGameOver]);

  const resetBoss = useCallback(() => {
    setBoss(createInitialBoss());
  }, []);

  const setReaction = useCallback((reaction: BossState['reaction'], duration = 2000) => {
    setBoss(prev => ({ ...prev, reaction }));
    if (reactionTimeoutRef.current) clearTimeout(reactionTimeoutRef.current);
    reactionTimeoutRef.current = setTimeout(() => {
      setBoss(prev => ({ ...prev, reaction: 'idle' }));
    }, duration);
  }, []);

  const triggerSpecificBossAction = useCallback((action: 'block' | 'freeze' | 'blind') => {
    if (isGameOver) return;
    const actionMessages: Record<string, string[]> = {
      block: BOSS_CHAT_MESSAGES.action.block,
      freeze: BOSS_CHAT_MESSAGES.action.freeze,
      blind: BOSS_CHAT_MESSAGES.action.blind,
    };
    const actionIcons: Record<string, string> = { block: '🚫', freeze: '❄️', blind: '❓' };
    const pool = actionMessages[action];
    const text = pool[Math.floor(Math.random() * pool.length)];
    setBoss(prev => ({
      ...prev,
      reaction: 'evil',
      currentAction: action,
      chatLog: [...prev.chatLog, makeChatMessage('boss_action', text, actionIcons[action])].slice(-MAX_CHAT_LOG),
    }));
    setTimeout(() => {
      setBoss(prev => ({ ...prev, currentAction: null, reaction: 'idle' }));
    }, 3000);
  }, [isGameOver]);

  const triggerMilestoneAction = useCallback(() => {
    const actions = ['block', 'freeze', 'blind'] as const;
    triggerSpecificBossAction(actions[Math.floor(Math.random() * actions.length)]);
  }, [triggerSpecificBossAction]);

  const triggerPlayerAction = useCallback((actionId: string) => {
    const effects: Record<string, { reaction: BossState['reaction']; icon: string }> = {
      'tea-break':      { reaction: 'sleeping', icon: '☕' },
      'golden-nap':     { reaction: 'sleeping', icon: '💤' },
      'foggy-glasses':  { reaction: 'confused', icon: '👓' },
      'cookie-crumbs':  { reaction: 'happy',    icon: '🍪' },
      'lucky-magnet':   { reaction: 'scared',   icon: '🧲' },
    };
    const effect = effects[actionId];
    if (!effect) return;
    const pool = BOSS_CHAT_MESSAGES.playerReaction[actionId];
    const text = pool ? pool[Math.floor(Math.random() * pool.length)] : "Huh?!";
    setBoss(prev => ({
      ...prev,
      reaction: effect.reaction,
      chatLog: [...prev.chatLog, makeChatMessage('boss_reaction', text, effect.icon)].slice(-MAX_CHAT_LOG),
    }));
    if (reactionTimeoutRef.current) clearTimeout(reactionTimeoutRef.current);
    reactionTimeoutRef.current = setTimeout(() => {
      setBoss(prev => ({ ...prev, reaction: 'idle' }));
    }, 3000);
  }, []);

  return {
    boss,
    resetBoss,
    setBoss,
    setReaction,
    pushChat,
    triggerMilestoneAction,
    triggerSpecificBossAction,
    triggerPlayerAction,
  };
}
