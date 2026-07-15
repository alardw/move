# create-move

The deterministic scaffolder for [Move](../move) apps. One invocation, one set of
flags, identical bytes out — and it validates its own output against the creation
spec before it finishes, so a scaffold either matches the contract or fails.

```bash
npm create move@latest my-app -- --shell sidebar --router react-router
```

## Options

| Flag        | Values                                | Default        |
| ----------- | ------------------------------------- | -------------- |
| `--shell`   | `sidebar` · `top-nav` · `minimal`     | `sidebar`      |
| `--router`  | `react-router` · `tanstack` · `none`  | `react-router` |
| `--icons`   | `lucide` · `none`                     | `lucide`       |
| `--theme`   | `light` · `dark`                      | `light`        |
| `--ci`      | `github` · `none`                     | `github`       |
| `--move`    | override the `move` dependency spec   | `latest`       |
| `--local`   | shorthand for `--move "*"` (monorepo) | —              |
| `--no-install` | skip `npm install`                 | —              |
| `--force`   | write into an existing non-empty dir  | —              |

## What it lays down

Everything a Move app needs to run **and** to stay honest:

- `MoveRoot` + the chosen shell + routing wired in `src/App.tsx`
- `src/composites/` — where `/app-compose` writes your screens
- `move.config.json` pointing the gates at `src/composites`
- the **conformance harness from day one**: `move check` (static — composites are
  100% Move components) and `src/a11y-sweep.test.tsx` (render-time axe ratchet),
  exposed as the portable `check` + `test:a11y` npm scripts. `--ci github` (default)
  also drops in a GitHub Actions workflow that runs them; `--ci none` leaves the CI
  binding to you (the scripts run on any pipeline)
- Move AI skills in `.claude/skills` and `.agents/skills`

## The contract

Both the files this writes and the deps/scripts it resolves come from a single
source — [`move/scaffold/creation-spec.mjs`](../move/scaffold/creation-spec.mjs).
The same spec powers `move check creation`, which validates any project against
it. Generate and verify read from one place, so they can't drift.
