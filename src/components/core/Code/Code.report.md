# Code — Validation Report
Generated from Code.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)

## Checklist

| Rule | Status |
|------|--------|
| Provenance headers on all files | PASS |
| Props interface extends Record<string, unknown> | PASS |
| Factory contract (sp/cx/attrs pattern) | PASS |
| CSS: tokens on .root | PASS |
| CSS: data-attribute selectors | PASS |
| CSS: no hardcoded color/spacing values | PASS |
| CSS: no CSS animations | PASS |
| CSS: variant color tokens use canonical names | PASS |
| Barrel exports (index.ts) | PASS |
| src/index.ts exports | PASS |
| className/style passthrough on root | PASS |
| Ref forwarding | PASS |
| Tests: all passing | PASS (26/26) |
| Meta file generated | PASS |
| Demo file generated | PASS |

## Delta Report (vs original)

### Token changes
- No token changes. All four component tokens are identical to the original.

### CSS changes
- Identical to original. No changes in selectors, values, or structure.

### Props
- No props added or removed. Identical interface: `variant`, `size`, `block`, `language`, `className`, `style`, `children`.
- Type exports identical: `CodeProps`, `CodeVariant`, `CodeSize`.

### Structural changes
- `moveProps` is now `['block', 'language']` instead of `['variant', 'size', 'block', 'language']` in the original. `variant` and `size` are in `defaults` so they are stripped automatically by the factory; only `block` and `language` need explicit listing since they have no default.
- The inline code path now sets `data-language={language}` when a language prop is provided. The original omitted `data-language` on inline code elements. This aligns with the spec's `data-language-conditional` render contract.
- Block mode render logic is preserved: `<pre>` wrapping `<code>` with `data-block=""`.

### CodeHighlighter companion
- Identical to original. No changes in context API, types, or provider implementation.

### Behavior
- Visual output identical. All spec render contracts satisfied.
- Syntax highlighting behavior preserved: sync, async, and null fallback all work.
