export const BOSS_CONFIG = {
  maxProgress: 500,
  baseIncrement: 5,
  slowIncrement: 1,
  tickIntervalMs: 2000,
  tauntFrequency: 50, // Every 50 points
  pauseDurationMs: 10000, // Tea Break
  longPauseDurationMs: 15000, // Golden Nap
  blurDurationMs: 5000,
  slowDurationMs: 12000,
  slowMultiplier: 0.2,
  swapAmount: 50,
  tanglePenalty: 40,
  activeBoss: {
    actionIntervalMs: 8000, // Boss performs an action every 8 seconds
    actionChance: 0.6, // 60% chance to perform an action
    maxBlockedCells: 3,
    blockDurationMs: 15000,
  }
};
