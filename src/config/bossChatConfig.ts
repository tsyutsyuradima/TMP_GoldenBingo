import { BossChatMessageType } from '../types';

export interface ChatMessageStyle {
  senderLabel: string;
  labelColor: string;
  bg: string;
  textClass: string;
  border: string;
  defaultIcon: string;
}

export const BOSS_CHAT_STYLES: Record<BossChatMessageType, ChatMessageStyle> = {
  boss_idle: {
    senderLabel: 'Binky',
    labelColor: 'text-purple-400',
    bg: 'bg-slate-700/80',
    textClass: 'text-slate-200',
    border: 'border-slate-600/40',
    defaultIcon: '😈',
  },
  boss_action: {
    senderLabel: 'Binky strikes!',
    labelColor: 'text-red-400',
    bg: 'bg-red-950/80',
    textClass: 'text-red-100',
    border: 'border-red-700/60',
    defaultIcon: '⚔️',
  },
  boss_reaction: {
    senderLabel: 'Binky',
    labelColor: 'text-amber-400',
    bg: 'bg-amber-950/60',
    textClass: 'text-amber-100',
    border: 'border-amber-700/50',
    defaultIcon: '😅',
  },
  system: {
    senderLabel: 'Game',
    labelColor: 'text-slate-500',
    bg: 'bg-slate-800/50',
    textClass: 'text-slate-400',
    border: 'border-slate-700/30',
    defaultIcon: '⚙️',
  },
};

export const BOSS_CHAT_MESSAGES = {
  idle: [
    "Just a normal day of winning!",
    "Is that all you've got?",
    "I love the smell of Bingo in the morning!",
    "Do you even Bingo, bro?",
    "My jar is looking quite full!",
    "Tick tock, player...",
  ],
  action: {
    block: [
      "That cell is MINE now!",
      "Blocked! Can't touch this!",
      "Say goodbye to that cell!",
      "Hehehe, try marking THAT!",
    ],
    freeze: [
      "Brrrr! Ice cold!",
      "Hope you brought a coat!",
      "That cell is frozen solid!",
      "Ice, ice, baby!",
    ],
    blind: [
      "You can't see that anymore!",
      "What number? I see nothing!",
      "Mystery cell activated!",
      "Peek-a-boo! Or... not.",
    ],
  },
  playerReaction: {
    'tea-break':     ["Zzz... wait, what happened?", "My tea... so warm...", "Just five more minutes..."],
    'golden-nap':    ["Mmm... golden dreams...", "So... sleepy... 💤", "Wake me up... never."],
    'foggy-glasses': ["Everything is blurry!", "WHO ARE YOU?!", "Is that... a bingo card?"],
    'cookie-crumbs': ["Ooh, cookies! Totally distracted!", "Nom nom nom...", "Did someone say cookies?!"],
    'lucky-magnet':  ["MY POINTS! NOOO!", "Stop that magnet!", "Come back, coins!"],
  } as Record<string, string[]>,
  bingo: [
    "WHAT?! A BINGO?! IMPOSSIBLE!",
    "Nooo! You got a line!!",
    "That's NOT fair! Recount!",
    "BINGO?! I demand a rematch!",
  ],
  gameStart: [
    "Welcome to MY arena!",
    "Let's play... if you dare! 😈",
    "The bingo begins... and I WILL win!",
    "Oh, a challenger? How adorable.",
  ],
};
