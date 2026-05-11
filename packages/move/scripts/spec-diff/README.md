# spec-diff

Deterministic diff between two snapshots of Move's component specs. The output is structured JSON the audit/migration tooling uses to find consumer-side breakage.

## What it detects

| Kind | Meaning |
| --- | --- |
| `componentRemoved` | Spec file disappeared. Carries forward `replacement`/`reason` from the last snapshot if the component was deprecated. |
| `propRemoved` | A prop existed before, no longer does. Carries `hadDefault` so the audit can decide if the omission is harmless. |
| `propTypeChanged` | Same prop name, different `type` (or `typeRef`). |
| `propDefaultChanged` | Same prop name, different `default`. |
| `tokenRemoved` | A CSS custom property defined by the component was removed. |
| `tokenValueChanged` | A token's documented value changed (chained-var override risk). |

Renames are deliberately **not** inferred. A removed prop and an added prop with the same shape are reported as two separate entries; a human (or AI) reviewing the release PR collapses them into a single `propRenamed` if appropriate.

## Inputs

Either a directory of `*.spec.ts` files (a checked-out commit or `git worktree add`'d snapshot), or a JSON snapshot produced by the `snapshot` subcommand. Mix and match — typical release uses snapshot ↔ HEAD.

## Requirements

Node 22.6+ (the loader uses `--experimental-strip-types` to dynamically import the spec `.ts` files). For older Node, snapshot the specs to JSON first and diff JSON ↔ JSON.

## Recommended workflow

From `packages/move/`:

1. **At release time**, snapshot the current specs:

   ```bash
   npm run spec-snapshot -- --out ../../version-snapshots/v2.4.0.json
   ```

   Commit `version-snapshots/v2.4.0.json`.

2. **Before the next release**, diff against the previous snapshot:

   ```bash
   npm run spec-diff -- \
       --from ../../version-snapshots/v2.4.0.json \
       --to src/components \
       --out ../../version-log/v2.5.0.json
   ```

Or invoke the CLI directly:

```bash
node --experimental-strip-types scripts/spec-diff/cli.mjs diff \
    --from <old-path-or-snapshot> --to <new-path-or-snapshot>
```

3. **AI augmentation step** (separate tool, future) reads the commit history since the previous tag and enriches the diff with anything the spec doesn't capture (behavioural changes, animation defaults, portal targets). Output goes into the same `version-log/<v>.json`.

4. **Release PR** auto-opens with the generated `version-log/<v>.json` and a human reviews it.

5. **Tag the release**, ship the version-log entry alongside the package.

## Deprecation lifecycle

Mark a component deprecated in its spec **at least one minor version before removal**:

```ts
deprecated: {
  since: '2.4.0',
  removeIn: '3.0.0',
  replacement: 'Loader',
  reason: 'Spinner duplicated Loader\'s spinner variant.',
}
```

- spec-diff emits `componentDeprecated` (additive) when the metadata first appears
- Docs render a deprecation banner from the same field
- `move audit` flags consumer usages with a warning + the `replacement` pointer
- When the component is finally removed in the major bump, spec-diff emits `componentRemoved` and carries the `replacement` + `reason` forward into that entry
