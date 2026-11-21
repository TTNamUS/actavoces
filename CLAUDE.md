# CLAUDE.md — ActaVoces

Local-first meeting recorder (Tauri v2 + Preact frontend + Rust backend + Python AI worker).
This is the repo we develop. The sibling folder `../debrief` is a **read-only design/feature reference** — never edit it.

@AGENTS.md

`AGENTS.md` (imported above) is the source of truth for commands, directory layout, the strict triplet pattern,
TypeScript/Rust/Python rules and SQLite migration rules. Everything below adds to it; where they conflict, this file wins
**only** for the frontend visual design (see "Design system").

## Current initiative: frontend redesign

The whole UI layer (`src/`) is being rebuilt with Debrief's visual language while keeping our stack and logic.

- Design spec: `docs/frontend-redesign/DESIGN.md` (tokens, typography, layout, page wireframes, component list, feature mapping F1–F14)
- Implementation plan: `docs/frontend-redesign/PLAN.md` (Phase 0–7 checklists, risks)
- Future AI/management backlog: `docs/future/AI_FEATURES_NOTES.md` (chat/Ask, hybrid search, templates, folders/tags, …)

Before frontend work: read the relevant DESIGN section and the current PLAN phase; tick checklist items in PLAN.md as you finish them.

### Rules for the redesign

- **Rewrite views, keep logic.** Keep `services/`, `stores/app.store.ts`, `types/`, `utils/` and all `*/hooks/*.hook.ts` / `*.helpers.ts`
  unless a PLAN step says otherwise. `src/tests/useApp.hook.test.tsx` must keep passing.
- **Do not change the stack.** No React, `class-variance-authority`, `react-router`, `lucide`. Port Debrief styles/markup into
  Preact + `@preact/signals` + `@base-ui/react` + `@tabler/icons-react` + `clsx`, following the triplet pattern.
  Only new deps allowed: `@fontsource-variable/manrope`, `@fontsource/instrument-serif`, `@fontsource-variable/jetbrains-mono`.
- **Stop prop-drilling `app`.** New views read from `AppContext` (`useAppContext()`); containers stay thin.
- **Routing:** `wouter-preact` with hash location; routes `/`, `/recordings/:id`, `/activity`, `/ask`, `/settings/:section?`, `/setup`.
- **Backend changes are additive only** (new commands/DTOs, no breaking changes to existing commands or SQLite schema).
  Register new commands in `src-tauri/src/lib.rs` `generate_handler!` pointing at the defining module.
- Every feature F1–F14 listed in DESIGN §1.1 must still work after each phase.

## Design system (supersedes the "Frontend Design System" section of AGENTS.md)

Warm, editorial, light + dark. Full spec: `docs/frontend-redesign/DESIGN.md` §2–§5. Essentials:

- Tokens (OKLCH only, defined in `src/App.css`): `canvas`, `canvas-2`, `canvas-3`, `ink`, `ink-2`, `ink-3`, `line`, `line-2`,
  `ember` (single accent: recording / danger / highlight), `ember-2`, `ember-soft`, `on-ember`, `moss(-soft)` (ready),
  `amber(-soft)` (processing / warning). Never hard-code colors in components; never use HEX/RGBA in tokens.
- Fonts: `Instrument Serif` for page/recording titles (`font-serif`), `Manrope` for UI (`font-sans`, body 14px),
  `JetBrains Mono` for all times, durations, percentages, hotkeys (`font-mono tabular-nums`).
- Shape: radius 10/14/20px (`rounded-md/lg/xl`), pills `rounded-full`; shadows only `shadow-card` and `shadow-float`.
- Section labels: `text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-3`. No uppercase buttons.
- Status → tone mapping lives in `utils/status.ts`; always render status through `StatusBadge`.
- Theme: `system | light | dark`, `data-theme` on `<html>`, persisted in `localStorage` (`actavoces.theme`), synced across windows.
- Layout: 232px sidebar (nav + record card + worker pill), content centered (`max-w-3xl/4xl/5xl px-8 py-8`), toasts bottom-right 360px.
- Layout spacing still follows AGENTS.md: flex/grid + `gap`, no `space-y-*` / child margins.
- Check every UI change in **both** light and dark.

## Working with the Debrief reference

- Look, don't copy wholesale: Debrief is React 19 with large route components and `useState`.
  Useful references: `../debrief/app/src/index.css` (tokens), `components/Shell.tsx`, `components/ui/*`,
  `routes/Library.tsx`, `routes/Meeting.tsx`, `components/ChatPanel.tsx`, screenshots in `../debrief/docs/img/`.
- Debrief is MIT, ActaVoces is AGPL-3.0: porting is allowed; credit Debrief in the commit message when porting a non-trivial piece.

## Validation

```bash
pnpm format && pnpm validate      # Biome + type-check
pnpm test                         # Vitest (frontend)
pnpm lint:rust && pnpm test:rust  # when src-tauri changed
pnpm tauri dev                    # visual check, light + dark
```
