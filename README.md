# Move

Move is a React component library where the components come finished —
accessible, animated, and consistent out of the box — so you and the AI
building with you can ship real products, not just demos. ~65 components
built on Radix UI primitives, with motion, theming, and a strict component
contract, all authored and maintained through specs and AI skills.

📖 **[Read the docs →](https://alardw.github.io/move/)** — getting started,
every component, theming, recipes, and the AI workflow. Everything about
*using* Move lives there; this README is just the repo map.

## Repo layout

An npm-workspaces monorepo — everything lives under `packages/`:

| Package | What it is |
| --- | --- |
| [`move`](packages/move) | The published component library: components, the `withMoveComponent` engine, the animation system, theming, and the `move` CLI. |
| [`create-move-app`](packages/create-move-app) | Scaffolding CLI — `npx create-move-app` stands up a full Move app. |
| [`docs`](packages/docs) | The documentation site (Vite + React Router), deployed to GitHub Pages. Page-by-page plan in [`PLAN.md`](packages/docs/PLAN.md). |

## Development

```bash
npm install                          # install all workspaces
npm run build  --workspace move      # build the library
npm run test   --workspace move      # run the test suite
npm run dev    --workspace docs      # run the docs site locally
```

The docs site auto-deploys to GitHub Pages on every push to `dev`.
