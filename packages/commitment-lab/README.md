# commitment-lab

A quarantined experiment for the **commitment ledger** — the "product = commitment keeper"
thesis from `notes/ui-architecture.md`. It adds `role` + `signature` to a composite so the same
function can be bound once and reused everywhere, instead of re-decided per screen (drift).

**Zero-touch guarantee.** Nothing in `packages/move` is modified. This package imports move
**read-only**: the live design patterns by deep source import (`../../move/patterns/*`), and
`CompositeSpec` from move's source. The two new fields live in `src/types.ts` as `LabComposite
extends CompositeSpec` — an intersection, not an edit. Delete this folder and the repo is exactly
as it was. It is not wired into `check:all`, so the pre-commit hook and CI never see it.

## Spikes

- **Spike 1 — the commitment record.** `src/types.ts` (`role` + `signature`) and the first real
  composite spec, `src/composites/VideoTile.spec.ts`, resolving against the live `media-tile`
  pattern. `npm run resolve` prints every axis → committed value → the Move node it binds to, and
  flags unresolved / illegal / stray decisions. **← done, runnable.**
- **Spike 2 — the proof app.** Home + Search composites over `item-gallery`, both delegating to
  `VideoTile`, so `collection-browse` recurs and the tile is provably shared.
- **Spike 3 — the derived ledger + drift check.** Index every composite → `role → instance`;
  flag one-role-two-decisions (drift) and one-signature-two-roles (near-miss, surfaced for a human).

## Run

```
npm run resolve     # Spike-1 proof: resolve VideoTile against the live media-tile pattern
npm run typecheck
```

## Graduating

If it proves out, moving `role` + `signature` into move's own `composite-spec.ts` and promoting
the ledger derivation into `scripts/checks/` is a deliberate, separate step — not a side effect.
