# Move

Move is an animated React component library built on Radix UI primitives —
~65 accessible components that ship with motion, theming, and a strict
component contract out of the box. It's designed to be authored and
maintained through specs and AI skills, so the same generators and checks
that build the library also help you build with it.

## Packages

This is an npm-workspaces monorepo. Everything lives under `packages/`:

| Package | What it is |
| --- | --- |
| [`move`](packages/move) | The published component library. Components, the `withMoveComponent` engine, the animation system, theming, and the `move` CLI (`npx move skills`). |
| [`create-move-app`](packages/create-move-app) | Scaffolding CLI — `npx create-move-app` stands up a full Move app with shell, routing, and AI skills. |
| [`docs`](packages/docs) | The documentation site (Vite + React Router). The page-by-page plan lives in [`packages/docs/PLAN.md`](packages/docs/PLAN.md). |
| [`benchmark`](packages/benchmark) | A comparison app that renders the same screens in Move and in other libraries (MUI, Mantine, Chakra, Ant, HeroUI) for side-by-side evaluation. |

## Documentation

The docs site is the primary reference. Run it locally:

```bash
npm install
npm run dev --workspace docs
```

It covers getting started, core concepts (the component contract, the
animation system, the theming model, hooks), every component, theming,
recipes, and the AI workflow (specs and skills).

## Using Move in your app

```bash
npm install move
```

```tsx
import 'move/styles.css';
import { MoveRoot } from 'move';

export function App() {
  return (
    <MoveRoot>
      {/* your screens */}
    </MoveRoot>
  );
}
```

There are three adoption tiers:

1. **`npm install move`** — use the components and `MoveRoot`.
2. **`npx move skills`** — add the AI skills to an existing project.
3. **`npx create-move-app`** — full scaffold with shell, routing, and skills.

## The AI workflow

Move components are described by typed `.spec.ts` files, and a set of skills
(under `.agents/skills/`) generate the source, tests, meta, demos, and
recipes from those specs — then validate the result against the component
contract. The skills follow an open standard that works with both Codex and
Claude Code. See the docs' AI section for the full workflow.

## Development

```bash
npm install                              # install all workspaces
npm run build   --workspace move         # build the library
npm run test    --workspace move         # run the test suite
npm run dev     --workspace docs         # run the docs site
```
