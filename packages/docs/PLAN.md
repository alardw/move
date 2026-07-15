# Move docs — page-by-page plan

Record of the docs structure as originally planned, with one paragraph
per page describing intended content. Kept as a reference so the
original scope doesn't get lost when the live nav (`packages/docs/src/nav.ts`)
gets pruned for shipping.

When the live nav is smaller than this document, the difference is
deferred-not-deleted: the brief still lives here, the page can come back
later.

---

## Getting started

The on-ramp. Goal: a developer reading these pages in order goes from
"never heard of Move" to "shipping their first screen" in under thirty
minutes.

### Overview
Front door. One paragraph on what Move is (a React component library
where you write specs and AI generates the code), one paragraph on the
shape of the docs site, and a "next step" link to Installation. Should
read like a person introducing the project, not a feature list.

### Installation
`npm install move`. List the three lines a consumer needs in their
entry file (`import 'move/styles.css'`, wrap with `<MoveRoot>`, pick a
theme). Cover Vite + Next.js gotchas only as one-liners with a link to
the dedicated framework pages below.

### MoveRoot
What `MoveRoot` wraps (Theme + Tooltip + Icon providers), why you need
exactly one, and what its props mean (`theme`, `iconResolver`,
`slotProps`). Closes with the three patterns: simple, theme-aware,
icon-resolver-aware.

### Create Move App
`npm create move`: what shells are available (sidebar, top-nav, minimal),
what scripts/AI skills come pre-wired, and how the generated project
differs from a hand-rolled Vite/Next setup. Includes the "I just want
to start" path.

### Vite
The Vite-specific moves: alias `move/styles.css`, set up the icon
resolver, and (if you're working from the monorepo) alias `move` to the
source. Short and tactical.

### Next.js
Next.js-specific moves: `'use client'` boundaries, the App Router
gotchas with `MoveRoot`, server-component-safe imports.

---

## Core Concepts

The "how does Move think" layer. People should read this section once
when they adopt the library, and never again unless they're building
their own component.

### Overview
Sets up the three big ideas in plain language: specs are the contract,
components are generated from specs, validators check conformance. One
paragraph each, with links forward.

### How Move Works
The pipeline in five steps: spec → generator → React source → built
package → consumer app. Names the key files (`*.spec.ts`,
`*.tsx`, `*.module.css`, `*.meta.ts`) and what each one is for. The
"if you're new to Move, read this first" page.

### Component Contract
The shared shape every Move component obeys: compound parts pattern
(`Root / Trigger / Content`), `className`/`style` passthrough, `sp`
slot-props for deep overrides, `size`/`variant`/`radius`/`color` as the
canonical prop axes. Once you've read this, every component is
predictable.

### Animation System
The "trigger + sequence" model in plain English. Names the runtime
primitives (`moveAnimate`, `animateDimension`, springs) and points at
the `useAnimations` hook. Acknowledges `prefers-reduced-motion`. May
absorb the Animation sub-pages (Triggers / Sequences / Springs /
Stagger / useAnimations) inline if those don't earn their own pages.

### Theming Model
How themes work: light/dark by default, `MoveRoot theme={…}` to swap,
semantic tokens (`bg-base`, `fg-base`, `border-base`, etc.) as the
single source of truth, `defineTheme` (planned) for compact authoring.
May absorb the Theming sub-pages (Tokens / Colors / Typography / Slot
props) inline.

### Hooks
*(Lives here in the consolidated nav; was originally in Reference.)*
`useAnimations`, `useMorphHeight`, `useSidebarContext`, `useControlledState`,
`useMergedRef`. Each gets a paragraph: signature, what it does, when to
reach for it.

---

## AI

Move's differentiator. If a visitor reads only one section, this is the
one that should make them go "oh, I see why this is different."

### Overview
What's different about a spec-driven library: components aren't files
you copy, they're outputs of a contract. Pitch the three things you get
from this: predictable composition, free validation, AI that stays
inside the system.

### Skills
Catalog of every skill that ships with Move. For each: what it does,
when to invoke it, what input it expects, what it outputs. Library
skills (`/analyze`, `/create-spec`, `/generate-source`, `/generate-all`,
`/validate`) and app skills (`/app-setup`, `/app-compose`).
One short paragraph each, no walls
of text.

### Specs
What's in a spec, why specs exist, how they drive both generation and
validation. Walks one real spec (Button or List) and annotates the
sections. The page that tells someone "specs are the contract, source
is the output, not the other way around."

### Writing Your Own Skills
Pragmatic guide: where skills live (`.agents/skills/<name>/SKILL.md`),
the SKILL.md frontmatter, how the agent discovers them, how to scope a
skill to the library vs an app. Includes a worked example of building
a custom skill end-to-end.

---

## Components

The bulk of the site. Each component gets its own page driven by
`packages/docs/src/content/components/<slug>/`.

### Overview
The component index. Searchable, filterable by category (layout, input,
navigation, overlay, etc.), with a preview thumbnail per card. Replaces
the "scroll the sidebar to find what you need" problem at 65+
components. Probably also where we'd surface the "missing components"
list as transparency.

### Per-component pages
Each component renders a standard template: tagline, badges,
highlights, related, install snippet, samples (Preview + Code toggle),
accessibility notes, API table, design tokens. All 65 pages exist and
are data-driven, but the *quality* varies. Open work is per-meta:
tighten taglines, de-jargon highlights, ensure ≥2 samples each.

---

## Animation

Deep-dive series for the animation system. Each page expands on one
aspect of what's introduced in Core Concepts > Animation System. Plan
is to merge these into Core Concepts for now and let pages graduate
back out once they earn dedicated depth.

### Overview
The animation system in one paragraph, then a roadmap to the sub-pages
below.

### Triggers
What a trigger is, the available trigger types (lifecycle, state,
deps, delegate), and how triggers connect refs to animations.

### Sequences
Sequencing model: parallel vs sequential, `[[…]]` syntax, why steps
exist, when to use `onComplete`.

### Springs & easings
The named springs Move ships (snappy, quick, poppy, gentle, slow,
lazy, jelly, stiff, tooltip, sidebar, pagination) and when to reach
for each. Compares spring vs ease-based animation.

### Stagger
How `stagger` works on a children-targeting step. Patterns for list
reveal, accordion content, dropdown items.

### useAnimations
The hook contract: input shape, ref map, returned handlers, pause /
resume, `runExit`. The end-to-end consumer guide.

---

## Theming

Deep-dive series for the theme system. Each page expands on what's
introduced in Core Concepts > Theming Model. Plan is to merge these
into Core Concepts and let pages graduate back out as they earn depth.

### Overview
The theming model in one paragraph, then a roadmap to the sub-pages
below.

### Tokens
Anatomy of a Move theme token name (`--move-<scope>-<role>-<state>`),
how primitive → semantic → component-token layering works, and how to
override at any layer.

### Colors
The 13 Open Color palettes + Move gray; per-palette text/soft-bg
pairs; how palettes map onto status colors (success/warning/error/info);
which components take a `color` prop.

### Typography
Font families (body, mono), the size scale (xs..3xl), weights, and the
heading scale. How to swap the font family at the theme level.

### Surfaces
*(Exists.)* The bg-base / bg-subtle / bg-muted / bg-emphasis hierarchy
and when to reach for each.

### Stacking
*(Exists.)* The z-layer system.

### Slot props
The `sp` prop pattern: how to pass styles to a deep slot of a compound
component, and why this beats `className` everywhere.

---

## Recipes

Real app-level recipes that prove "compose everything from Move
components" isn't aspirational. Plan is to ship the Overview with 3–5
inline recipes; the sub-categories are placeholders for the day a
single category needs its own page.

### Overview
A small handful (3–5 max) of full-screen recipes:
- An app shell with sidebar + header + content
- A settings form
- A data table with filters and pagination
- A dashboard with cards + chart placeholders

Each recipe shows the JSX, lists the components used, and links to the
component pages.

### App shells
Sub-page for shell patterns: sidebar+content, header+content,
split-pane, multi-pane editor.

### Forms
Sub-page for form patterns: single-column, two-column, wizards,
auto-saving, validation surfacing.

### Data patterns
Sub-page for table/list patterns: filters, pagination, infinite scroll,
empty states, loading states.

### Dashboards
Sub-page for dashboard patterns: card grids, KPI tiles, chart
placeholders, multi-pane layouts.

---

## Reference

Originally planned as a generated-reference section. Most of it
duplicates what other pages do better; recommended for cuts. Kept here
as a record of the original intent.

### All exports
Flat list of everything Move exports from its barrel. Recommended:
**cut.** The Components Overview page covers this with previews +
grouping; a flat export list ages poorly.

### Hooks
Hook API surface (`useAnimations`, `useMorphHeight`,
`useSidebarContext`, `useControlledState`, `useMergedRef`).
Recommended: **promote to Core Concepts > Hooks.** It's the one part of
Reference that has standalone value.

### Changelog
Per-version release notes. Recommended: **cut.** GitHub releases is
the canonical source; link from the footer.

### FAQ
Common questions and answers. Recommended: **cut.** FAQ pages collect
questions that should have been answered on the relevant page; they
signal "we didn't explain this well" and rot fast. Surface FAQ-style
questions inline on the relevant page instead.
