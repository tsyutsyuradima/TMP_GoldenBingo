export type BingoLetter = 'B' | 'I' | 'N' | 'G' | 'O';

export interface Milestone {
  score: number;
  reward: number;
  reached: boolean;
  collected: boolean;
}

export interface BonusCell {
  val: number;
}

export interface GameSettings {
  hints: boolean;
  autoDraw: boolean;
}

export interface Cast {
  id: string;
  name: string;
  description: string;
  icon: string;
  juice: string;
  activeDurationMs?: number;
  onExecute?: (boss: BossState) => BossState;
}

export type BossType = 'goal' | 'active';

export interface BossState {
  type: BossType;
  progress: number;
  isPaused: boolean;
  isBlurred: boolean;
  isSlowed: boolean;
  message: string;
  lastAction: string | null;
  currentAction: string | null;
  reaction: 'idle' | 'happy' | 'angry' | 'surprised' | 'sleeping' | 'focused' | 'taunting' | 'scared' | 'confused' | 'evil' | 'dizzy';
  blockedCells: number[]; // Indices of blocked cells
  nextActionProgress: number; // 0 to 100 for Active mode
  activeSpellId?: string | null;
}

export interface Projectile {
  id: string;
  type: 'block' | 'remove-daub' | 'scramble';
  targetIndex: number;
}

export interface GameState {
  cardData: (number | "FREE")[];
  markedCells: boolean[];
  bonusCells: (BonusCell | null)[];
  drawnBalls: number[];
  currentScore: number;
  isGameOver: boolean;
  settings: GameSettings;
  milestones: Milestone[];
  boss: BossState;
  activeChoice: Cast[] | null;
  choiceTimer: number;
  lastBingoTime: number;
  projectiles: Projectile[];
}
