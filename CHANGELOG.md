# TickrBoom — Changelog

All notable changes to TickrBoom are recorded here.
Format: `[version] — date — description`
Commits are on GitHub: https://github.com/boomstackdev/tickrboom
Live URL: https://tickrboom.boomstack.dev

---

## [0.4.3] — 2026-03-21
### Changed
- Renamed IND to INDUSTRIALS in default stock names for clarity
- Added DICE_LABELS map: dice display uses short abbreviations (GOLD, SLVR, OIL, BNDS, IND, GRN) while full names appear everywhere else
- Removed commodity customization feature — default stocks are now fixed

**Commit:** f7c6865

---

## [0.4.2] — 2026-03-21
### Fixed
- Removed all debug console.log statements from processRoll.ts

**Commits:** a80a274 and subsequent cleanup

---

## [0.4.1] — 2026-03-21
### Fixed
- EventModal now renders via React portal to document.body, fixing overlay z-index and
  stacking context issues caused by parent transforms and backdrop-blur
- Shuffle bags lazy-initialized on first client-side use, fixing Next.js hydration error

**Commits:** aceaed2

---

## [0.4.0] — 2026-03-21 — Phase 3 Complete: Market Events & Gameplay Depth
### Added
- Shuffle-bag randomizer: stocks, actions, and amounts now draw from a shuffled pool
  using Fisher-Yates algorithm, preventing long streaks of the same result
- Market Events system (events.ts): 13 weighted events across 3 categories fire every
  5-8 rolls and affect commodity prices
- Breaking News modal: EventModal updated with pill badge label and Newspaper icon for
  market events, visually distinct from tutorial events
- Trade logging: buy and sell transactions now appear in the Market Activity feed
- MAX_LOGS constant: activity log expanded from 50 to 250 entries for testing visibility

### Already built (confirmed via CC search, March 7 commit af2322a):
- Sprint mode: tracks roll count, ends game at Hard 50 / Normal 100 / Easy 150 rolls
- Timed mode: 5-minute countdown, turbo disabled, ends game when timer hits zero
- Daily Challenge mode: seeded dice rolls by date, same rolls for all players, once per day
- GameOverModal: mode-specific messaging for Sprint, Timed, and Daily endings

**Commits:** 829283c, fc0a3d7

---

## [0.3.3] — 2026-03-07
### Fixed
- Desktop layout: dice and ROLL button moved inline with stats in header on lg: screens
- Stock cards on desktop now have larger padding, text, and button sizes via lg: breakpoints
- More vertical spacing between cards on desktop (gap-4 at lg:)

---

## [0.3.2] — 2026-03-07
### Fixed
- iOS Safari auto-zoom when tapping qty input
- Users could no longer get stuck zoomed in on mobile after tapping the quantity field

---

## [0.3.1] — 2026-03-07
### Changed
- Stock card trade controls consolidated from 3 rows into 2 rows
- Row 1: increment buttons (500, 1k, 2.5k, 5k, MAX)
- Row 2: [SELL] [qty input] [BUY]

---

## [0.3.0] — 2026-03-07 — Phase 2: Visual & Audio Overhaul
### Added
- Theme system: Dark / Light / System via next-themes
- Three-way theme toggle in Settings modal

### Changed
- Dice redesigned: square, labels underneath (COMMODITY / ACTION / AMOUNT)
- Menu screen: CSS grid background, large logo, terminal-style name input
- Stock cards: pill-shaped status badges, SPLIT WATCH pulse animation

**Bundle size:** 1.1MB client, well under 5MB limit

---

## [0.2.0] — 2026-03-07 — Phase 1: Foundation & Core Rebuild
### Added
- Full Next.js 15 + TypeScript + Tailwind + Zustand project scaffolded
- Pure game engine in /src/lib/engine/ with zero React dependencies
- Platform adapter pattern: PlatformAdapter interface + LocalPlatformAdapter
- Zustand stores: gameStore.ts and uiStore.ts
- All UI components and modals, one per file
- Auto-save, manual save slots, load/overwrite/delete saves
- Vercel deployment

---

## [0.1.0] — pre-2026-03-07 — Original Prototype
### Notes
- Single-file React prototype built with Gemini + CodeSandbox
- Source files preserved in Claude Chat project for reference

---

## Upcoming

### itch.io Launch
- Publish to itch.io for early player testing before portal submissions

### Phase 4 — Achievements System
### Phase 5 — Leaderboards (portal SDKs at launch)
### Phase 6 — Real-Time Multiplayer (deferred indefinitely)

---

*Last updated: 2026-03-21*
