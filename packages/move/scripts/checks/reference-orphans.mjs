#!/usr/bin/env node
/**
 * Reference-orphan guard — every file under `skills/references/` must be read
 * by something live.
 *
 * `check:skill-refs` guards one direction: a path a skill names must exist.
 * This guards the other: a reference file must be named. References ship to
 * every consumer (`npx move skills` copies them into `.claude/skills` and
 * `.agents/skills`), so a file nothing reads is still one an agent can find,
 * trust, and copy — and nothing type-checks it, so it drifts from the API
 * while it waits.
 *
 * The failure this exists for: the recipe pipeline was deleted, its readers
 * went with it, and 38 recipe files stayed behind. Every composite recipe
 * drifted until none of them compiled, and nothing failed.
 *
 * A reference file is LIVE when a live file cites it. The roots are the skills
 * (`SKILL.md` and anything else in a skill folder) and the tooling (scripts,
 * checks, bin, hooks, scaffold, src, the docs and create-move sources). From
 * there it is reachability: a reference file cited only by another orphan is
 * an orphan too, so a dead cluster cannot keep itself alive.
 *
 * A citation is any of:
 *   • the path relative to `references/`, with its directory
 *     (`component/animation-map.ts`) — how skill prose names them;
 *   • the same path spelled as quoted segments
 *     (`'references', 'component', 'animation-map.ts'`) — how scripts join it;
 *   • a relative import between reference files (`from './spec-type'`).
 *
 * A directory is not a citation. A scan root that sweeps a folder (the
 * `recipes` roots in move.config.json) runs checks over whatever is there; it
 * does not make any one file something an agent is sent to read.
 *
 * @enforces none  (meta-check — guards the agent interface, not an entity rule)
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE = join(HERE, '..', '..');
const REPO = join(MOVE, '..', '..');
const SKILLS = join(MOVE, 'skills');
const REFS = join(SKILLS, 'references');

const TEXT = /\.(?:md|ts|tsx|mts|js|mjs|cjs|json|css|sh)$/;
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '__screenshots__']);

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    if (SKIP_DIRS.has(e)) continue;
    const full = join(dir, e);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const isRef = (f) => f.startsWith(REFS + sep);

// ── the reference files, and how each one may be cited ───────────────────────
const refs = walk(REFS);
const relOf = (f) => relative(REFS, f).split(sep).join('/');

// ── live roots: skill folders (minus references/) + tooling ──────────────────
const roots = [
  ...walk(SKILLS).filter((f) => !isRef(f)),
  ...['scripts', 'checks', 'bin', 'hooks', 'scaffold', 'src'].flatMap((d) => walk(join(MOVE, d))),
  join(MOVE, 'package.json'),
  ...walk(join(REPO, '.githooks')),
  ...walk(join(REPO, 'packages', 'docs', 'src')),
  ...walk(join(REPO, 'packages', 'create-move', 'src')),
].filter((f) => f === join(MOVE, 'package.json') || TEXT.test(f) || f.includes(`${sep}.githooks${sep}`));

// Read once, and fold quoted path segments ('a', 'b') into a/b so a joined
// path reads the same as a written one.
const cache = new Map();
function textOf(file) {
  if (!cache.has(file)) {
    const raw = readFileSync(file, 'utf8');
    cache.set(file, { raw, folded: raw.replace(/(['"])\s*,\s*(['"])/g, '/') });
  }
  return cache.get(file);
}

/** Reference files a given file cites. */
function citedBy(file) {
  const { raw, folded } = textOf(file);
  const hits = new Set();
  for (const r of refs) {
    if (r === file) continue;
    const rel = relOf(r);
    if (rel.includes('/') && (raw.includes(rel) || folded.includes(rel))) hits.add(r);
  }
  // Relative imports between reference files.
  if (isRef(file)) {
    for (const m of raw.matchAll(/from\s+['"](\.{1,2}\/[^'"]+)['"]/g)) {
      const base = resolve(dirname(file), m[1]);
      for (const cand of [base, ...['.ts', '.tsx', '.mjs', '.js'].map((x) => base + x), join(base, 'index.ts')]) {
        if (isRef(cand) && existsSync(cand)) hits.add(cand);
      }
    }
  }
  return hits;
}

// ── reachability ─────────────────────────────────────────────────────────────
const live = new Set();
const queue = [];
for (const root of roots) {
  for (const r of citedBy(root)) if (!live.has(r)) live.add(r), queue.push(r);
}
while (queue.length) {
  for (const r of citedBy(queue.shift())) if (!live.has(r)) live.add(r), queue.push(r);
}

const orphans = refs.filter((r) => !live.has(r)).map(relOf).sort();

if (orphans.length) {
  console.error(`\n✗ reference-orphans: ${orphans.length} of ${refs.length} reference file(s) are read by nothing live.\n`);
  for (const o of orphans) console.error(`  - skills/references/${o}`);
  console.error(
    `\n  A reference ships to every consumer, so an unread one is still found, trusted\n` +
      `  and copied — and nothing keeps it in step with the API. Cite it from the skill\n` +
      `  that needs it, or delete it.\n`,
  );
  process.exit(1);
}

console.log(`✓ reference-orphans: all ${refs.length} reference file(s) are read by a skill or by tooling.`);
