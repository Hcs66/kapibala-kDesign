# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

The Kapibala team's **frontend design + engineering standard for web admin dashboards**, distilled from shipped production projects and packaged as a **Claude Code plugin + skill**. It is **not a runnable application** — it is portable guidance + copy-paste artifacts that get installed into the *consuming* admin projects where the actual UI work happens.

This one repo is **both the marketplace and the plugin source** (self-referential layout):

```
.claude-plugin/marketplace.json            ← marketplace "kapibala-plugins"
plugins/kapibala-design-admin/
├─ .claude-plugin/plugin.json              ← plugin "kapibala-design-admin"
└─ skills/design-admin/
   ├─ SKILL.md                             ← skill entry (frontmatter + hard constraints + nav + apply steps)
   ├─ references/   *.md                   ← detail chapters, loaded on demand (progressive disclosure)
   └─ assets/       *.css/.ts/.js/.json    ← droppable code artifacts (copied into consuming projects)
```

Installed by a teammate with `/plugin marketplace add Hcs66/kapibala-kDesign` then `/plugin install kapibala-design-admin@kapibala-plugins`; the skill auto-loads (via its `description`) when building admin-dashboard frontend, or is invoked manually as `/kapibala-design-admin:design-admin`.

Consequence: there is **no build / test / lint to run against this repo itself**. The artifacts under `assets/` (e.g. `eslint.config.js`) are shipped into consuming projects, not used to lint these files. Validate structure instead: `claude plugin validate .` (marketplace) and `claude plugin validate ./plugins/kapibala-design-admin` (plugin). Work here = editing the skill prose + the artifacts, keeping the two in sync.

Tech stack the standard targets (the version baseline doc is authoritative): React 18+ · Vite 6+ · TypeScript 5 strict · Tailwind CSS v4 (OKLCH `@theme`) · shadcn/ui + Radix · @tanstack/react-query 5 · react-hook-form + zod · react-i18next · react-router-dom 6.

## Document map

The skill is one entry (`SKILL.md`) plus five `references/` chapters that cross-link each other. Read the entry first — it carries the hard constraints and is the index. Paths below are under `plugins/kapibala-design-admin/skills/design-admin/`.

| File | Role |
|---|---|
| `SKILL.md` | **Entry.** Frontmatter trigger, apply steps (§0.5), MUST-vs-MAY split, the 10 hard constraints (§2), red-flag grep signals (§3), version baseline |
| `references/principles.md` | Design philosophy, type scale, spacing/grid, radius, shadow/elevation, optional "intelligent layer" skin |
| `references/tokens.md` | Full design-token table (OKLCH + source HSL), shadcn semantic naming, white-label override, v3 equivalents |
| `references/status-system.md` | ⭐ The status semantic-color system — the standard's core differentiator (status → `tone` → class, single source) |
| `references/components.md` | Three-tier component model: shadcn primitives → required shared components → business components; the app shell |
| `references/conventions.md` | Directory layout, naming, i18n, data layer, logging, the ESLint rule set, pre-commit grep self-check |
| `references/rationale.md` | The "why" behind the conventions + historical post-mortems (background, not generation-time rules — moved out of `SKILL.md` to keep the entry light) |

`assets/` holds the droppable implementation, mapped to destinations by `SKILL.md` §0.5: config (`globals.css` v4 `@theme`, `tailwind.config.ts` v4+v3, `eslint.config.js`, `components.json` shadcn new-york/zinc), tools & single sources (`lib/cn.ts`, `lib/logger.ts`, `statusMap.ts`), the discipline-bearing shared components (`components/{StatusBadge,PermissionGate,QueryState,EmptyState,MockBadge,ErrorBoundary}.tsx`, `contexts/AuthContext.tsx`), and the i18n skeleton (`i18n/locales/{zh-CN,en}.json`). These artifacts must themselves obey the standard (semantic tokens only, `t()` for text, `statusMap` for status color, `logger` not `console`).

## The non-negotiable mechanisms (what the whole standard hangs on)

These are the load-bearing ideas. When editing docs or snippets, do not contradict them; when generating consuming-project code, enforce them. The framing throughout is **"mechanism is mandatory, skin is optional"** — `statusMap` the *mechanism* is required; specific color values are white-labelable.

1. **Status colors go through `statusMap.ts`, never literal palette colors.** Business status string → `StatusDef { tone, i18nKey, fallback }` → `TONE_BADGE_CLASS[tone]` → `<StatusBadge>`. There are exactly **6 tones** (`success` `warning` `destructive` `info` `muted` `primary`) — a closed set, so "red always means danger." New statuses pick a tone; they never introduce a new color. Colliding keys across domains (e.g. `banned`, `pending`, `failed` mean different things per domain) get a domain-specific `resolveXxxStatus` instead of joining the global `resolveStatus` chain. `statusMap.ts` is the **only** file exempt from `no-hardcoded-color` and `i18next/no-literal-string`.
2. **Colors use semantic tokens only** (`bg-background`, `text-muted-foreground`, `bg-primary`, `border-border`) — never `bg-white` / `bg-slate-900`, or dark mode breaks. Tokens are shadcn-semantic-named (deliberately not Material `surface-container-*`). `--primary` and `--ring` both track `--brand`; white-labeling = override `--brand` once.
3. **All user-visible text goes through i18n `t()`** (zh-CN / en); no hardcoded CN/EN literals in JSX.
4. **Permission-gated UI uses `<PermissionGate>` / `useHasPermission()`**, never `role === 'admin'`. Frontend gating only hides UI — backend middleware is the real authority.
5. **Logging goes through `src/lib/logger.ts`**; no bare `console.*`; **zero tolerance for silent catch** (`catch {}` with no log). Variables referenced across a try/catch boundary must be hoisted to the outer scope (real-incident lesson).
6. **Server data goes through React Query**; mutate then `invalidateQueries`, never `setQueryData`.
7. **Backend DTO types are `import type`-d only inside `src/adapters/**`**; components/hooks see ViewModels, never `@backend`.
8. **Brand / product name** comes from `VITE_PRODUCT_NAME` / i18n `app.name`, never hardcoded.

Constraints 1, 3, 4, 5, 7, 8 are enforced by `assets/eslint.config.js` (custom `no-hardcoded-color` regex, `i18next/no-literal-string` jsx-only, `no-restricted-syntax` for role/brand, `no-restricted-imports` for `@backend`, `no-console`). `SKILL.md` §3 lists the grep red-flag signals that mirror these rules.

## When editing this repo

- **After any structural change, re-validate** with `claude plugin validate .` and `claude plugin validate ./plugins/kapibala-design-admin`. Editing `SKILL.md` frontmatter (`name`/`description`), the plugin/marketplace names, or moving files can silently break install/trigger.
- **Mind the relative paths.** `SKILL.md` links chapters as `references/x.md` and artifacts as `assets/x`; chapters link sibling chapters as `./x.md` and artifacts as `../assets/x`; artifact header comments link chapters as `../references/x.md`. A skill cannot reference files outside its own directory (no `../` escaping the skill) — keep everything under `skills/design-admin/`.
- **Keep prose and artifacts in sync.** A change to the tone set, token names, or constraints in a `references/` chapter must be reflected in the corresponding `assets/` artifact (`statusMap.ts`, `globals.css`, `eslint.config.js`) and vice versa — they are two views of one standard, and drift between them is the main failure mode.
- **Respect the MUST/MAY split.** `principles.md`'s "intelligent layer" (glassmorphism, AI-tint cards, Indigo/Slate) and tools like Zustand / virtual scrolling are explicitly optional skin. Don't promote optional things to mandatory, or vice versa.
- **Tailwind v4 is the primary baseline; v3 is a documented fallback.** Token tables and `tailwind.config.ts` carry both — when you touch one form, update the v3 note too.
- **Placeholders in the kit are intentional.** `eslint.config.js` has `PRODUCT_BRAND_REGEX = (your-product-name)` and `statusMap.ts` domain tables are examples to be replaced per project — don't "fix" them to a concrete value.
- Docs are bilingual-leaning Chinese; match the existing voice and the dense table-driven format when adding to a chapter.
