export interface BossAction {
  id: string;
  name: string;
  icon: string;
  description: string;
  trigger: string;
}

export const BOSS_ACTIONS: BossAction[] = [
  {
    id: 'block',
    name: 'Cell Block',
    icon: '🚫',
    description: 'Blocks a random cell for 15s. Any mark on it is cleared.',
    trigger: 'At player score milestones (150 pts & 300 pts)',
  },
  {
    id: 'freeze',
    name: 'Freeze Cell',
    icon: '❄️',
    description: 'Freezes a random cell for 12s. Frozen cells cannot be marked.',
    trigger: 'At player score milestones (150 pts & 300 pts)',
  },
  {
    id: 'blind',
    name: 'Blind Cell',
    icon: '❓',
    description: 'Hides a random cell\'s number for 10s. You can still mark it — if you dare.',
    trigger: 'At player score milestones (150 pts & 300 pts)',
  },
];
