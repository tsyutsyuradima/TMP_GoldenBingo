export interface PlayerAction {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const PLAYER_ACTIONS: PlayerAction[] = [
  {
    id: 'tea-break',
    name: 'Tea Break',
    icon: '☕',
    description: 'Pauses the boss for 10 seconds.',
  },
  {
    id: 'golden-nap',
    name: 'Golden Nap',
    icon: '💤',
    description: 'Puts the boss to sleep for 15 seconds.',
  },
  {
    id: 'foggy-glasses',
    name: 'Foggy Glasses',
    icon: '👓',
    description: 'Blurs the boss — severely slows progress for 5s.',
  },
  {
    id: 'cookie-crumbs',
    name: 'Cookie Crumbs',
    icon: '🍪',
    description: 'Distracts the boss — 80% slower for 12s.',
  },
  {
    id: 'lucky-magnet',
    name: 'Lucky Magnet',
    icon: '🧲',
    description: 'Siphons 15% of boss points to you.',
  }
];
