import { BonusCell } from '../types';
import { BINGO_RANGES } from '../constants';

export const FREE_SPACE_INDEX = 12;

export function generateBingoCard() {
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
        markedCells[FREE_SPACE_INDEX] = true;
      } else {
        cardData.push(columns[c][r]);
      }
    }
  }

  let b = 0;
  while (b < 6) {
    const i = Math.floor(Math.random() * 25);
    if (i !== FREE_SPACE_INDEX && !bonusCells[i]) {
      bonusCells[i] = { val: [50, 100, 150][Math.floor(Math.random() * 3)] };
      b++;
    }
  }

  return { cardData, markedCells, bonusCells };
}

export const WINNING_LINES = [
  [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
];

export function checkJustCompletedBingo(oldMarked: boolean[], newMarked: boolean[]): boolean {
  return WINNING_LINES.some(line => {
    const wasComplete = line.every(idx => oldMarked[idx]);
    const isComplete = line.every(idx => newMarked[idx]);
    return !wasComplete && isComplete;
  });
}
