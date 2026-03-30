import { Cast } from "../types";

export const BOSS_CASTS: Cast[] = [
  {
    id: 'tea-break',
    name: 'Tea Break',
    description: 'Pauses Boss for 10s.',
    icon: '☕',
    juice: 'Binky sips tea; steam covers the panel.'
  },
  {
    id: 'foggy-glasses',
    name: 'Foggy Glasses',
    description: 'Boss misses 3 numbers.',
    icon: '👓',
    juice: 'Screen blurs; Binky frantically wipes his lenses.'
  },
  {
    id: 'lucky-magnet',
    name: 'Lucky Magnet',
    description: 'Siphons 15% of Boss points.',
    icon: '🧲',
    juice: 'A magnet pulls coins from Binky’s jar to the player\'s.'
  },
  {
    id: 'soap-bubbles',
    name: 'Soap Bubbles',
    description: 'Resets Boss progress.',
    icon: '🧼',
    juice: 'Bubbles pop and "wash away" the Boss’s progress bar.'
  },
  {
    id: 'yarn-tangle',
    name: 'Yarn Tangle',
    description: 'Binky gets tangled! -40 points.',
    icon: '🧶',
    juice: 'Binky is wrapped in yarn; his progress bar unravels.'
  },
  {
    id: 'golden-nap',
    name: 'Golden Nap',
    description: 'Binky sleeps for 15s.',
    icon: '💤',
    juice: 'Binky snores loudly; zzz\'s float over the panel.'
  },
  {
    id: 'cookie-crumbs',
    name: 'Cookie Crumbs',
    description: 'Binky is distracted! 80% slower for 12s.',
    icon: '🍪',
    juice: 'Binky munches on cookies; crumbs slow down his progress.'
  },
  {
    id: 'magic-mirror',
    name: 'Magic Mirror',
    description: 'Swap 50 points from Binky to you.',
    icon: '🪞',
    juice: 'A mirror reflects Binky\'s progress back to the player.'
  }
];
