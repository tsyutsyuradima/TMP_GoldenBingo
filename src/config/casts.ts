import { Cast } from "../types";
import { BOSS_CONFIG } from "./bossConfig";
import { BOSS_MESSAGES } from "../constants";

export const BOSS_CASTS: Cast[] = [
  {
    id: 'tea-break',
    name: 'Tea Break',
    description: 'Pauses Boss for 10s.',
    icon: '☕',
    juice: 'Binky sips tea; steam covers the panel.',
    activeDurationMs: BOSS_CONFIG.pauseDurationMs,
    onExecute: (prev) => {
      return { ...prev, isPaused: true, reaction: 'sleeping', message: BOSS_MESSAGES.reaction.happy[Math.floor(Math.random() * BOSS_MESSAGES.reaction.happy.length)] };
    }
  },
  {
    id: 'foggy-glasses',
    name: 'Foggy Glasses',
    description: 'Boss misses 3 numbers.',
    icon: '👓',
    juice: 'Screen blurs; Binky frantically wipes his lenses.',
    activeDurationMs: BOSS_CONFIG.blurDurationMs,
    onExecute: (prev) => {
      return { ...prev, isBlurred: true, reaction: 'confused', message: BOSS_MESSAGES.reaction.confused[Math.floor(Math.random() * BOSS_MESSAGES.reaction.confused.length)] };
    }
  },
  {
    id: 'lucky-magnet',
    name: 'Lucky Magnet',
    description: 'Siphons 15% of Boss points.',
    icon: '🧲',
    juice: 'A magnet pulls coins from Binky’s jar to the player\'s.',
    onExecute: (prev) => {
      const siphon = Math.floor(prev.progress * 0.15);
      return { ...prev, progress: Math.max(0, prev.progress - siphon), reaction: 'scared', message: BOSS_MESSAGES.reaction.scared[Math.floor(Math.random() * BOSS_MESSAGES.reaction.scared.length)] };
    }
  },
  {
    id: 'soap-bubbles',
    name: 'Soap Bubbles',
    description: 'Resets Boss progress.',
    icon: '🧼',
    juice: 'Bubbles pop and "wash away" the Boss’s progress bar.',
    onExecute: (prev) => {
      return { ...prev, progress: 0, reaction: 'dizzy', message: BOSS_MESSAGES.reaction.dizzy[Math.floor(Math.random() * BOSS_MESSAGES.reaction.dizzy.length)] };
    }
  },
  {
    id: 'yarn-tangle',
    name: 'Yarn Tangle',
    description: 'Binky gets tangled! -40 points.',
    icon: '🧶',
    juice: 'Binky is wrapped in yarn; his progress bar unravels.',
    onExecute: (prev) => {
      return { ...prev, progress: Math.max(0, prev.progress - BOSS_CONFIG.tanglePenalty), reaction: 'angry', message: BOSS_MESSAGES.hit[Math.floor(Math.random() * BOSS_MESSAGES.hit.length)] };
    }
  },
  {
    id: 'golden-nap',
    name: 'Golden Nap',
    description: 'Binky sleeps for 15s.',
    icon: '💤',
    juice: 'Binky snores loudly; zzz\'s float over the panel.',
    activeDurationMs: BOSS_CONFIG.longPauseDurationMs,
    onExecute: (prev) => {
      return { ...prev, isPaused: true, reaction: 'sleeping', message: BOSS_MESSAGES.reaction.happy[Math.floor(Math.random() * BOSS_MESSAGES.reaction.happy.length)] };
    }
  },
  {
    id: 'cookie-crumbs',
    name: 'Cookie Crumbs',
    description: 'Binky is distracted! 80% slower for 12s.',
    icon: '🍪',
    juice: 'Binky munches on cookies; crumbs slow down his progress.',
    activeDurationMs: BOSS_CONFIG.slowDurationMs,
    onExecute: (prev) => {
      return { ...prev, isSlowed: true, reaction: 'happy', message: BOSS_MESSAGES.reaction.happy[Math.floor(Math.random() * BOSS_MESSAGES.reaction.happy.length)] };
    }
  },
  {
    id: 'magic-mirror',
    name: 'Magic Mirror',
    description: 'Swap 50 points from Binky to you.',
    icon: '🪞',
    juice: 'A mirror reflects Binky\'s progress back to the player.',
    onExecute: (prev) => {
      return { ...prev, progress: Math.max(0, prev.progress - BOSS_CONFIG.swapAmount), reaction: 'evil', message: BOSS_MESSAGES.reaction.evil[Math.floor(Math.random() * BOSS_MESSAGES.reaction.evil.length)] };
    }
  }
];
