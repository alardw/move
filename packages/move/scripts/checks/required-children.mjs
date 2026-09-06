#!/usr/bin/env node
/**
 * A compound part that MUST contain another one, does.
 *
 * A compound API is a set of parts the caller assembles, and most assemblies are
 * a matter of taste. Some are not: `Select.Content` needs a `Select.Viewport`,
 * because Viewport is what holds `.contentInner` — the container the reveal
 * animation targets and takes its ref from.
 *
 * The failure is silent, which is the whole reason this exists. Omit the
 * Viewport and the select still renders, still opens, still selects, still
 * closes; the items simply mount as direct children of `.content`, the container
 * the animation queries stays empty, and the reveal never runs. Nothing throws.
 *
 * CalendarNav omitted it for the entire life of the Radix Select rebuild — the
 * items were passed straight to `Select.Content` — and nothing said a word:
 * not tsc, not the 2313 tests, not any of the fifty-odd checks here. It was
 * found by a person noticing the months did not fade in.
 *
 * Declared as data on the sub-component (`requiredChildren` in the spec), so
 * this reads the requirement rather than hardcoding one library's shape.
 * Scanned across the library AND the docs, because a sample that omits it
 * teaches every reader to omit it.
 *
 * @enforces apiSurface-3
 * @instead nest the required part, or drop the requirement from the spec if it
 *   is genuinely optional. A requirement that some call sites may skip is not a
 *   requirement; it is a default, and belongs in the component.
 *
 * Exit: 0 = clean, 1 = at least one required child missing.
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const REPO_ROOT = join(MOVE_ROOT, '..', '..');
const SCAN_ROOTS = [join(MOVE_ROOT, 'src'), join(REPO_ROOT, 'packages', 'docs', 'src')];

function walk(dir, ext, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e === 'node_modules' || e === 'dist') continue;
    const full = join(dir, e);
    if (statSync(full).isDirectory()) walk(full, ext, out);
    else if (e.endsWith(ext)) out.push(full);
  }
  return out;
}

/** Requirements, read from every spec: Component.Part → [required part names]. */
function loadRequirements() {
  const reqs = [];
  for (const specPath of walk(join(MOVE_ROOT, 'src', 'components'), '.spec.ts')) {
    const src = readFileSync(specPath, 'utf8');
    const component = basename(specPath, '.spec.ts');
    // Sub-component blocks, split on the name declared at THEIR indentation (6
    // spaces). Searching backward from `requiredChildren` for the nearest
    // `name:` instead found whichever prop happened to be declared last before
    // it — 'required', in Select — and the check then looked for a part that
    // does not exist and passed on the very code it was written to catch. The
    // same resolve-by-proximity mistake has now cost this repo four scripts.
    const heads = [...src.matchAll(/^ {6}name: '(\w+)',$/gm)];
    for (let i = 0; i < heads.length; i++) {
      const part = heads[i][1];
      const from = heads[i].index;
      const to = i + 1 < heads.length ? heads[i + 1].index : src.length;
      const block = src.slice(from, to);
      const decl = /requiredChildren:\s*\[([\s\S]*?)\n {6}\],/.exec(block);
      if (!decl) continue;
      for (const c of decl[1].matchAll(/name:\s*'(\w+)',\s*\n?\s*why:\s*\n?\s*'([^']*)'/g)) {
        reqs.push({ component, part, child: c[1], why: c[2] });
      }
    }
  }
  return reqs;
}

/** The slice of source between <Ns.Part …> and its matching </Ns.Part>. */
function bodiesOf(src, tag) {
  const open = new RegExp(`<${tag}(\\s|>|/>)`, 'g');
  const bodies = [];
  for (const m of src.matchAll(open)) {
    // Self-closing: no body at all, which is itself a missing child.
    const head = src.slice(m.index, src.indexOf('>', m.index) + 1);
    if (head.endsWith('/>')) {
      bodies.push({ index: m.index, body: '' });
      continue;
    }
    let depth = 0;
    // No lastIndex here: the string is already sliced from m.index, so setting
    // it too would skip forward twice and step over this tag's own opening —
    // depth never reached 1, no close was ever found, and the check reported
    // every file clean including the one it was written for.
    const scan = new RegExp(`<${tag}[\\s>]|</${tag}>`, 'g');
    let close = -1;
    for (const t of src.slice(m.index).matchAll(scan)) {
      if (t[0].startsWith('</')) {
        depth -= 1;
        if (depth === 0) {
          close = m.index + t.index;
          break;
        }
      } else depth += 1;
    }
    if (close > 0) bodies.push({ index: m.index, body: src.slice(m.index, close) });
  }
  return bodies;
}

const REQS = loadRequirements();
const problems = [];

for (const root of SCAN_ROOTS) {
  for (const file of walk(root, '.tsx')) {
    if (file.endsWith('.test.tsx')) continue;
    const src = readFileSync(file, 'utf8');
    const rel = relative(REPO_ROOT, file);
    for (const req of REQS) {
      const parentTag = `${req.component}.${req.part}`;
      const childTag = `${req.component}.${req.child}`;
      if (!src.includes(`<${parentTag}`)) continue;
      for (const { index, body } of bodiesOf(src, parentTag)) {
        if (body.includes(`<${childTag}`)) continue;
        const line = src.slice(0, index).split('\n').length;
        problems.push({ rel, line, parentTag, childTag, why: req.why });
      }
    }
  }
}

if (problems.length === 0) {
  console.log(
    `✓ required-children: ${REQS.length} composition requirement(s) hold at every call site.`,
  );
  process.exit(0);
}

console.log(`✗ required-children: ${problems.length} call site(s) missing a required part.`);
for (const p of problems) {
  console.log(`\n  [apiSurface-3] ${p.rel}:${p.line} — <${p.parentTag}> without <${p.childTag}>`);
  console.log(`    ${p.why}`);
}
process.exit(1);
