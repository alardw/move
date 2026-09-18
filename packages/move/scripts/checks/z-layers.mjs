#!/usr/bin/env node
/**
 * The stacking scale has ONE definition, and this proves it.
 *
 * `src/shared/z-layers.ts` is the source: it names the layers, fixes their
 * order, carries their meaning, and is exported so a consumer can place their
 * own chrome in the same scale. The `--move-z-*` tokens are what the browser
 * actually obeys. Those two must be the same scale, and until now nothing said
 * so — which is exactly how they stopped being it.
 *
 * What they had drifted into: the registry carried invented values (1020–1080)
 * that nothing rendered at, while components stacked on tokens running 0–700.
 * They disagreed about which of toast and tooltip covers the other, so the docs
 * page published the opposite of what shipped. Two of the registry's layers had
 * no token at all, and two layers components used every day — `dropdown`,
 * `modal` — were absent from it. And because `Z_LAYERS` is public API, a
 * consumer reading `Z_LAYERS.popover.value` got 1060, above everything Move
 * draws, and would have covered their own dialogs without ever learning why.
 *
 * None of that was catchable, because no artifact claimed to match another. The
 * fix is not a number; it is the claim.
 *
 * Checked BOTH ways, so neither file can grow a layer alone:
 *   registry → tokens   every layer's token exists, at exactly its value
 *   tokens → registry   every `--move-z-*` layer token is declared in the registry
 *   ordering            the registry's order is ascending by value, so reading it
 *                       top to bottom tells you what covers what
 *
 * The scale's endpoints — `--move-z-hide` and `--move-z-max` — are deliberately
 * not layers. They are escapes from the scale rather than places in it, and
 * naming them as layers would invite a component to sit at `max` and win
 * forever.
 *
 * It also guards the OTHER half of the stacking rule, the one about who may
 * write a number by hand.
 *
 * Local stacking — a component ordering its own parts inside its own box — is
 * legitimate and common: ToggleGroup lifting the active segment over its
 * neighbours' borders, a player's controls over the scrim. Those are small
 * integers meaningful only against each other, and a token would flatten them
 * all to one value. Twenty-three of them were already in the library when the
 * header here claimed components "never write raw z-index", which is how that
 * line taught everyone to skip it.
 *
 * What a check CAN see is the case that escapes the box: `position: sticky` or
 * `fixed` lifts an element out of its parent's flow to sit over whatever scrolls
 * past, which is other components by definition — so its order is a library
 * question, not a local one. Table's sticky header sat at a raw `z-index: 1`,
 * which loses to anything nearby that lifts itself at all, while the docs
 * claimed it occupied the `sticky` layer.
 *
 * What a check CANNOT see is an element that is positioned normally but still
 * has to beat another component. That is a judgement, and it stays in the header
 * of z-layers.ts where a person will read it.
 *
 * @enforces styles-21 styles-22
 * @instead add the layer to `Z_LAYERS` in src/shared/z-layers.ts AND define its
 *   `--move-z-*` token at the same value, or remove it from both. A layer that
 *   exists in one place is a layer nothing can reference or nothing can render.
 *   For a sticky or fixed element, use `var(--move-layer-*)` rather than a bare
 *   number — it is competing with other components whether or not it means to.
 *
 * Exit: 0 = clean, 1 = the two definitions disagree.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE = join(HERE, '..', '..');

const REGISTRY = join(MOVE, 'src', 'shared', 'z-layers.ts');
const TOKENS = join(MOVE, 'src', 'styles', 'tokens', 'primitives', 'z-index.css');

/** Endpoints of the scale, not places in it. */
const NOT_LAYERS = new Set(['--move-z-hide', '--move-z-max']);
/** The local space is a space, not a set of layers — see z-index.css. */
const LOCAL = /^--move-z-local-\d$/;

const registrySrc = readFileSync(REGISTRY, 'utf8');
const tokensSrc = readFileSync(TOKENS, 'utf8');

/** `'popover': { value: 500, token: '--move-z-popover' },` */
const layers = [...registrySrc.matchAll(/'([a-z-]+)':\s*\{\s*value:\s*(-?\d+),\s*token:\s*'([^']+)'/g)].map(
  (m) => ({ kind: m[1], value: Number(m[2]), token: m[3] }),
);

/** `--move-z-popover: 500;` */
const tokens = new Map(
  [...tokensSrc.matchAll(/(--move-z-[a-z0-9-]+):\s*(-?\d+)\s*;/g)].map((m) => [m[1], Number(m[2])]),
);

const problems = [];

if (layers.length === 0) {
  problems.push('styles-21|Z_LAYERS parsed as empty — the registry shape changed and this check cannot read it');
}

for (const layer of layers) {
  if (!tokens.has(layer.token)) {
    problems.push(`styles-21|'${layer.kind}' declares ${layer.token}, which z-index.css never defines`);
    continue;
  }
  const rendered = tokens.get(layer.token);
  if (rendered !== layer.value) {
    problems.push(
      `styles-21|'${layer.kind}' says ${layer.value}, but ${layer.token} renders at ${rendered} — ` +
        `the documented order and the real one have parted`,
    );
  }
}

const declared = new Set(layers.map((l) => l.token));
for (const [token] of tokens) {
  if (NOT_LAYERS.has(token) || LOCAL.test(token)) continue;
  if (!declared.has(token)) {
    problems.push(
      `styles-21|${token} is defined but named by no layer — nothing can reference it, and it is invisible in the docs`,
    );
  }
}

for (let i = 1; i < layers.length; i++) {
  if (layers[i].value <= layers[i - 1].value) {
    problems.push(
      `styles-21|'${layers[i].kind}' (${layers[i].value}) is listed after '${layers[i - 1].kind}' ` +
        `(${layers[i - 1].value}) but does not sit above it — the list must read low to high, ` +
        `because that is how anyone learns what covers what`,
    );
  }
}

// ── The local space sits UNDER the layers, always ───────────────────────────
//
// Otherwise a component ordering its own parts could outrank another
// component's layer by accident, which is the one thing separating the two
// spaces was meant to prevent. `base` is excluded: it IS zero, and local-0 is
// the same "not lifted" position by another name.
{
  const localValues = [...tokens].filter(([t]) => LOCAL.test(t)).map(([, v]) => v);
  const lowestLayer = layers.filter((l) => l.value > 0).sort((a, b) => a.value - b.value)[0];
  const highestLocal = Math.max(...localValues);
  if (localValues.length && lowestLayer && highestLocal >= lowestLayer.value) {
    problems.push(
      `styles-22|the local space reaches ${highestLocal}, which is not below '${lowestLayer.kind}' ` +
        `(${lowestLayer.value}) — a component ordering its own parts could outrank another ` +
        `component's layer, and keeping those apart is the whole reason there are two spaces`,
    );
  }
}

// ── The other half: who may write a number by hand ──────────────────────────

const COMPONENT_CSS = join(MOVE, 'src', 'components');

function cssFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) cssFiles(full, out);
    else if (entry.endsWith('.module.css')) out.push(full);
  }
  return out;
}

for (const file of cssFiles(COMPONENT_CSS)) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    const m = line.match(/z-index:\s*([^;]+);/);
    if (!m) return;
    const value = m[1].trim();

    // Every z-index resolves to a token, and the token's NAME says which space
    // it is in. A component token in between is the repo's own indirection —
    // it is the override point a consumer is given — so the chain is followed
    // rather than refused, and `calc()` around it is fine.
    const refs = [...value.matchAll(/var\((--move-[a-z0-9-]+)/g)].map((r) => r[1]);
    const resolves = (name, depth = 0) => {
      if (/^--move-(layer-[a-z-]+|z-local-\d)$/.test(name)) return true;
      if (depth > 3) return false;
      const def = text.match(new RegExp(`${name}:\\s*([^;]+);`));
      if (!def) return false;
      return [...def[1].matchAll(/var\((--move-[a-z0-9-]+)/g)].some((r) => resolves(r[1], depth + 1));
    };
    if (!refs.some((r) => resolves(r))) {
      problems.push(
        `styles-22|${relative(MOVE, file)}:${i + 1} — z-index: ${value}. Use ` +
          `var(--move-z-local-N) for ordering this component's own parts, or ` +
          `var(--move-layer-*) for sitting above other components`,
      );
      return;
    }

    // Sticky and fixed leave their parent's flow to sit over whatever scrolls
    // past — other components, by definition — so the local space is never the
    // right answer for them, however small the number looks.
    if (!refs.some((r) => /^--move-z-local-\d$/.test(r))) return;
    let escapes = false;
    for (let j = i; j >= 0 && j > i - 30; j--) {
      if (/position:\s*(sticky|fixed)/.test(lines[j])) escapes = true;
      if (j < i && /\{\s*$/.test(lines[j])) break;
    }
    if (escapes) {
      problems.push(
        `styles-22|${relative(MOVE, file)}:${i + 1} — a sticky/fixed element in the LOCAL space ` +
          `(${value}). It sits over whatever scrolls past it, which is other components, so its ` +
          `order belongs to the scale: use var(--move-layer-*)`,
      );
    }
  });
}

if (problems.length) {
  console.error(`\n✗ z-layers: ${problems.length} disagreement(s) between the registry and the tokens.\n`);
  for (const p of problems) {
    const [rule, ...rest] = p.split('|');
    console.error(`  [${rule}] ${rest.join('|')}`);
  }
  console.error(
    `\n  src/shared/z-layers.ts is the source. Add or remove the layer in BOTH it and\n` +
      `  src/styles/tokens/primitives/z-index.css, at the same value.\n`,
  );
  process.exit(1);
}

console.log(
  `✓ z-layers: ${layers.length} layers — registry and tokens agree on every value, and the order reads low to high.`,
);
