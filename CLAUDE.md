# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bingo: Golden Treasures — a browser-based bingo game built with React 19, TypeScript, Vite, and Tailwind CSS 4. Players mark bingo cards and compete against an animated boss character (Binky) across two game modes (Goal and Active).

## Commands

```bash
npm run dev        # Start dev server on 0.0.0.0:3000
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Type-check only (tsc --noEmit) — no ESLint
npm run clean      # Remove dist/
```

No test framework is configured.

## Architecture

**Entry:** `src/main.tsx` → `src/App.tsx` (root layout, passes all state down as props)

**State management** uses two custom hooks with no external state library:
- `src/hooks/useBingoGame.ts` — all game state: card generation, ball drawing, cell marking, bingo detection, scoring, spell choice triggering, milestones. This is the central hub (~424 lines).
- `src/hooks/useBossLogic.ts` — boss AI state machine with timer refs for tick, action, and active-mode intervals. Manages debuffs (pause/blur/slow), blocked cells, and reaction emoji state.

**Component tree** (all rendered by App.tsx):
- `ControlPanel` — settings toggles (hints, auto-draw), draw button, ball history
- `BingoBoard` — 5×5 grid, handles marking, shows blocked/bonus/hint states
- `ScoreAttack` — score progress bar toward 500, milestone markers
- `LiveBossZone` — boss display, progress jar, mode switcher; embeds `BossChoice` modal
- `BossChoice` — spell selection modal (4 random spells, 7s timer, reroll costs 50 score)
- `WinModal` — end-game overlay
- `ParticleCanvas` — canvas-based particle/projectile animations

**Config files** (`src/config/`):
- `bossConfig.ts` — timing, damage, and threshold constants
- `casts.ts` — 8 spell definitions
- `choiceConfig.ts` — spell trigger rules (every 10 balls, on bingo, on milestone, on 3-mark combo)

**Types:** All shared interfaces in `src/types.ts`.
**Constants:** `src/constants.ts` — BINGO_LETTERS, BINGO_COLORS, BINGO_RANGES, TARGET_SCORE, boss messages.

## Key Design Decisions

- Boss actions broadcast via `CustomEvent('boss-action-animation')` on `window` — decouples boss logic from rendering/particles.
- Choice modal blocks all gameplay (draw button disabled, game paused) until a spell is selected or the 7s timer expires.
- FREE cell is always index 12 (center) — hardcoded in multiple places.
- Bingo detection uses 12 hardcoded line definitions (5 rows + 5 cols + 2 diagonals).
- Column number ranges: B[1-15], I[16-30], N[31-45], G[46-60], O[61-75].

## Tech Stack

- React 19 + TypeScript 5.8 (ES2022 target, bundler module resolution)
- Vite 6.2 with `@vitejs/plugin-react` and `@tailwindcss/vite`
- Motion (Framer Motion successor) for component animations
- Lucide React for icons
- `@google/genai` SDK (Gemini API key injected via Vite `define`)
- Path alias: `@/*` → project root
