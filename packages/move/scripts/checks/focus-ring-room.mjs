#!/usr/bin/env node
/**
 * A container of focusable children must leave room for their focus rings.
 *
 * An outset ring is drawn OUTSIDE the element box: it reaches
 * `--move-focus-ring-offset + --move-focus-ring-width` beyond it, and wants a
 * little clearance past that to read as a ring rather than an edge. That total
 * is `--move-focus-ring-room`. Put focusable rows in a flex/grid container with
 * a smaller `gap` and each ring lands on the neighbour — worst against a filled
 * row, where the two read as joined.
 *
 * The mistake is never in the ring, which is why it keeps coming back: every
 * `:focus-visible` rule looks right on its own, and the defect only exists in
 * the relationship between a container's `gap` and its children's rings. So
 * that is what this checks. It flags a container whose gap is smaller than the
 * room its focusable descendants need, and the fix goes on the CONTAINER —
 * `gap: max(<your gap>, var(--move-focus-ring-room))` — not on the ring.
 *
 * Only sees what one stylesheet can prove: a class with a `gap`, and a class in
 * the same file with an outset `:focus-visible`. It cannot know the DOM nests
 * them, so it treats co-location as the signal, which is right far more often
 * than not inside a single component's CSS.
 *
 * @enforces styles-14
 * @instead widen the container: `gap: max(var(--move-spacing-xs), var(--move-focus-ring-room))`.
 *   Where the rows genuinely must sit tight, inset the ring instead
 *   (`outline-offset: calc(-1 * var(--move-focus-ring-width))`), which is the
 *   row/cell/list-item convention in semantic.css.
 *
 * Exit: 0 = clean, 1 = at least one container without room.
 */
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const COMPONENTS = join(MOVE_ROOT, 'src', 'components');
const SEMANTIC = join(MOVE_ROOT, 'src', 'styles', 'tokens', 'semantic.css');
const PRIMITIVES = join(MOVE_ROOT, 'src', 'styles', 'tokens', 'primitives');

/** Every `--move-*: <length>` we can reach, so a gap token becomes a number. */
function loadLengths() {
  const files = [SEMANTIC, ...readdirSync(PRIMITIVES).map((f) => join(PRIMITIVES, f))];
  const raw = {};
  for (const file of files) {
    if (!file.endsWith('.css')) continue;
    for (const m of readFileSync(file, 'utf8').matchAll(/(--move-[a-z0-9-]+):\s*([^;]+);/g)) {
      if (!(m[1] in raw)) raw[m[1]] = m[2].trim();
    }
  }
  return raw;
}

const RAW = loadLengths();
const ROOT_FONT_PX = 16;

/** A length in px, or null when it is not a plain length we can compare. */
function toPx(value, depth = 0) {
  if (depth > 6 || value == null) return null;
  const v = String(value).trim();

  const alias = /^var\(\s*(--move-[a-z0-9-]+)\s*\)$/.exec(v);
  if (alias) return toPx(RAW[alias[1]], depth + 1);

  const calc = /^calc\(([\s\S]+)\)$/.exec(v);
  if (calc) {
    // Only the shape these tokens actually use: a sum of lengths.
    const parts = calc[1].split('+');
    if (parts.length < 2) return null;
    let total = 0;
    for (const part of parts) {
      const px = toPx(part, depth + 1);
      if (px == null) return null;
      total += px;
    }
    return total;
  }

  const max = /^max\(([\s\S]+)\)$/.exec(v);
  if (max) {
    const parts = max[1].split(',').map((p) => toPx(p, depth + 1));
    return parts.some((p) => p == null) ? null : Math.max(...parts);
  }

  const px = /^(-?[\d.]+)px$/.exec(v);
  if (px) return parseFloat(px[1]);
  const rem = /^(-?[\d.]+)rem$/.exec(v);
  if (rem) return parseFloat(rem[1]) * ROOT_FONT_PX;
  if (v === '0') return 0;
  return null;
}

const ROOM_PX = toPx(RAW['--move-focus-ring-room']);
if (ROOM_PX == null) {
  console.error('✗ focus-ring-room: --move-focus-ring-room does not resolve to a length.');
  process.exit(1);
}

function cssFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...cssFiles(full));
    else if (entry.endsWith('.module.css')) out.push(full);
  }
  return out;
}

const violations = [];

for (const file of cssFiles(COMPONENTS)) {
  const css = readFileSync(file, 'utf8');
  const lines = css.split('\n');

  // Classes whose :focus-visible draws an OUTSET ring (a positive offset).
  const outset = new Set();
  for (const m of css.matchAll(
    /\.([A-Za-z][\w-]*)[^{}]*:focus-visible[^{}]*\{([^}]*)\}/g,
  )) {
    const offset = /outline-offset:\s*([^;]+);/.exec(m[2]);
    if (!offset) continue;
    const px = toPx(offset[1]);
    if (px != null && px > 0) outset.add(m[1]);
  }
  if (outset.size === 0) continue;

  // Containers that lay their children out with a gap.
  for (const m of css.matchAll(/(^|\n)\.([A-Za-z][\w-]*)\s*\{([^}]*)\}/g)) {
    const [, , cls, body] = m;
    if (!/display:\s*(flex|grid|inline-flex|inline-grid)/.test(body)) continue;
    const gap = /(?:^|\n)\s*(?:gap|row-gap):\s*([^;]+);/.exec(body);
    if (!gap) continue;
    const gapPx = toPx(gap[1]);
    // Unresolvable means "not a plain length" (a max() we already widened, a
    // var we cannot follow) — not a violation, since we cannot prove it small.
    if (gapPx == null || gapPx >= ROOM_PX) continue;
    // Only meaningful when the file also has an outset ring to collide.
    if (/flex-direction:\s*row/.test(body) && !/wrap/.test(body)) {
      // A row of controls collides horizontally just the same; keep it.
    }
    const line = lines.findIndex((l) => l.includes(`.${cls} {`)) + 1;
    violations.push({
      file: relative(MOVE_ROOT, file),
      line: line || 0,
      cls,
      gapPx,
      rings: [...outset].join(', '),
    });
  }
}

/**
 * Ratcheted, not swept. The first run found this in twelve components at once,
 * which is the point — the defect lives between two rules that each look fine,
 * so it accumulated silently for as long as the ring tokens have existed.
 * Widening twelve gaps unseen would move layout in eight components with no way
 * to check the result, so what exists is recorded and what is NEW fails. Clear
 * the baseline a component at a time, looking at each one.
 */
const BASELINE = join(HERE, 'focus-ring-room.baseline.json');
const key = (v) => `${v.file}:.${v.cls}`;
const live = violations.map(key).sort();

if (process.argv.includes('--write')) {
  writeFileSync(BASELINE, JSON.stringify(live, null, 2) + '\n');
  console.log(`⚑ focus-ring-room: baseline written with ${live.length} entr(ies).`);
  process.exit(0);
}

const baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : [];
const known = new Set(baseline);
const fresh = violations.filter((v) => !known.has(key(v)));
const fixed = baseline.filter((b) => !live.includes(b));

if (fresh.length === 0) {
  console.log(
    `⚑ focus-ring-room: ${live.length} live · ${baseline.length} baseline · 0 new · ` +
      `${fixed.length} fixed — an outset ring needs ${ROOM_PX}px.`,
  );
  if (fixed.length) {
    console.log('  Fixed since the baseline — run with --write to lock them in:');
    for (const f of fixed) console.log(`    ${f}`);
  }
  process.exit(0);
}

console.log(`✗ focus-ring-room: ${fresh.length} container(s) with no room for a focus ring.`);
for (const v of fresh) {
  console.log(
    `\n  [styles-14] ${v.file}:${v.line} — .${v.cls} has gap ${v.gapPx}px, ` +
      `below the ${ROOM_PX}px an outset ring needs (.${v.rings} draws one).`,
  );
  console.log(`      gap: max(<your gap>, var(--move-focus-ring-room));`);
}
process.exit(1);
