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

export type BossChatMessageType = 'boss_idle' | 'boss_action' | 'boss_reaction' | 'system';

export interface BossChatMessage {
  id: string;
  type: BossChatMessageType;
  text: string;
  actionIcon?: string;
  timestamp: number;
}

export interface BossState {
  chatLog: BossChatMessage[];
  lastAction: string | null;
  currentAction: string | null;
  reaction: 'idle' | 'happy' | 'angry' | 'surprised' | 'sleeping' | 'focused' | 'taunting' | 'scared' | 'confused' | 'evil' | 'dizzy';
  blockedCells: number[];
  frozenCells: number[];
  blindCells: number[];
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
  lastBingoTime: number;
}
