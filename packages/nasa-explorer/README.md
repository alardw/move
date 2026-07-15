# nasa-explorer

A Move app. Built from Move components; conformance and accessibility are gated
from the first commit.

## Develop

```bash
npm install
npm run dev
```

## Build your screens

Ask your AI assistant (Claude Code / Codex — skills are installed under
`.claude/skills` and `.agents/skills`) to run `/app-compose`. It writes
composites into `src/composites`, built entirely from Move components.

## Conformance

```bash
npm run check       # static: composites are 100% Move components
npm run test:a11y   # render-time: axe over every composite (ratchet)
npm run typecheck
```

Both gates also run in CI (`.github/workflows/checks.yml`).
