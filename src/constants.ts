import { BingoLetter } from "./types";

export const BINGO_LETTERS: BingoLetter[] = ['B', 'I', 'N', 'G', 'O'];

export const BINGO_COLORS: Record<string, string> = {
  b: '#3b82f6',
  i: '#ef4444',
  n: '#f59e0b',
  g: '#10b981',
  o: '#8b5cf6',
};

export const BINGO_RANGES: [number, number][] = [
  [1, 15],
  [16, 30],
  [31, 45],
  [46, 60],
  [61, 75],
];

export const TARGET_SCORE = 500;

export const INITIAL_MILESTONES = [
  { score: 150, reward: 1000, reached: false, collected: false },
  { score: 300, reward: 2000, reached: false, collected: false },
];
