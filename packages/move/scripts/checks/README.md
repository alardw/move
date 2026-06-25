# Quality checks

Scripts that verify Move's invariants — spec/source/docs sync,
bundle budgets, consistency rules. Each check is a self-contained
Node script that exits 0 on success and 1 on failure, so they slot
straight into CI.

See `notes/QUALITY.md` for the full framework and
why each check exists.

## Conventions

- One script per check. Names use kebab-case and match the QUALITY doc.
- Plain `.mjs` Node ESM — no compile step.
- Use the TypeScript compiler API (`typescript` is already a devDep)
  to parse `.ts` / `.tsx` files; avoid regex on TS structure.
- Exit 0 = pass, exit 1 = fail. Print a tight summary at the end.
- Optional `--fix` flag where automated repair makes sense.

## Run individually

```bash
node scripts/checks/spec-drift.mjs
```

## Wire to CI

Add to `package.json` scripts:

```json
"check:spec-drift": "node scripts/checks/spec-drift.mjs",
"check:all": "npm run check:spec-drift && npm run check:..."
```
