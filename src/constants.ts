import { BingoLetter, Cast } from "./types";

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
  { score: 200, reward: 1000, reached: false, collected: false },
  { score: 350, reward: 2000, reached: false, collected: false },
];

export const BOSS_MESSAGES = {
  idle: ["Just a normal day of winning!", "Is that all you've got?", "I love the smell of Bingo in the morning!", "My jar is looking quite full!", "Do you even Bingo, bro?"],
  hit: ["Hey! My tea!", "Who turned out the lights?", "My coins! Come back!", "I'm melting! Wait, no, just bubbles.", "That's not very neighborly!", "Ouch! My progress!"],
  win: ["Better luck next time, neighbor!", "Victory is sweet, like cake!", "I'm the Bingo King!", "Maybe try a different hobby?"],
  taunt: ["You're falling behind!", "Watch and learn!", "Bingo is my middle name!", "I'm speed-daubing now!", "Can't touch this!"],
  reaction: {
    daub: ["Found one!", "Got it!", "Easy peasy!", "Right there!"],
    bingo: ["BINGO! I'm a genius!", "Look at that line!", "Perfecto!"],
    powerup: ["Espresso time!", "Lucky clover found!", "Turbo mode engaged!"],
    scared: ["Wait, what's happening?!", "My coins! Nooo!", "Stop that magnet!", "I'm losing my grip!"],
    confused: ["Where am I?", "Is this B or O?", "I need my glasses!", "Everything is blurry..."],
    evil: ["Hehehe, watch this!", "You're in for it now!", "Time for a little surprise...", "Mirror, mirror, on the wall..."],
    dizzy: ["Whoa, the room is spinning!", "Too many bubbles...", "I think I'm gonna be sick...", "Which way is up?"],
    happy: ["Mmm, cookies!", "This tea is perfect.", "I'm feeling great!", "Best day ever!"]
  }
};
