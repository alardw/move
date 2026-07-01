#!/usr/bin/env node
/**
 * App-conformance audit (AST) — is an app built purely from Move?
 *
 * Flags the hand-rolling Move exists to eliminate, across a whole app tree:
 *   css-module  — a *.module.css file: styling that should come from Move components
 *   inline-style — style={{ … }}: one-off styling
 *   raw-html    — a lowercase JSX element: layout / prose that should be a Move component
 *
 * Findings are FLAGS, recomputed from source each run — nothing is persisted.
 * The same engine ships with `move check` (a consumer runs it on their own app);
 * the docs "Dogfood" page renders our run of it. Non-blocking by default; pass
 * --strict to exit 1 (a future gate). Mark a real, tracked exception with a
 * `dogfood-ignore` comment on the line — that residual IS the component backlog.
 *
 * Usage: node app-conformance.mjs [srcDir] [--strict] [--json]
 */
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..', '..', '..', '..');
const args = process.argv.slice(2);
const STRICT = args.includes('--strict');
const UPDATE = args.includes('--update');
const JSON_OUT = args.includes('--json');
const SRC = join(REPO, args.find((a) => !a.startsWith('--')) ?? 'packages/docs/src');
const BASELINE = join(dirname(SRC), 'app-conformance.baseline.json');
const IGNORE = 'dogfood-ignore';

// Category from the path convention: examples vs routes vs chrome vs root.
function categoryOf(relPath) {
  const top = relPath.split(sep)[0];
  if (top === 'content') return 'content (examples)';
  if (top === 'pages') return 'pages (routes)';
  if (top === 'components') return 'components (chrome)';
  return 'root';
}

function walk(dir, pred, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, pred, out);
    else if (pred(p)) out.push(p);
  }
  return out;
}

const findings = []; // { file, cat, rule, detail }
const add = (file, rule, detail) =>
  findings.push({ file: relative(SRC, file), cat: categoryOf(relative(SRC, file)), rule, detail });

if (!existsSync(SRC)) {
  console.error(`✗ app-conformance: no such src dir: ${relative(REPO, SRC)}`);
  process.exit(1);
}

// --- CSS modules: each one is hand-rolled styling ---
for (const css of walk(SRC, (p) => p.endsWith('.module.css'))) {
  add(css, 'css-module', 'custom stylesheet — replace with Move component styling');
}

// --- TSX: raw HTML + inline styles ---
for (const file of walk(SRC, (p) => p.endsWith('.tsx') && !p.endsWith('.test.tsx'))) {
  const src = readFileSync(file, 'utf8');
  const lines = src.split('\n');
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const ignored = (node) => {
    const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
    return (lines[line] ?? '').includes(IGNORE) || (lines[line - 1] ?? '').includes(IGNORE);
  };
  const visit = (node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(sf);
      if (/^[a-z]/.test(tag) && !ignored(node)) add(file, 'raw-html', `<${tag}>`);
    }
    if (ts.isJsxAttribute(node) && node.name.getText(sf) === 'style' && !ignored(node)) {
      add(file, 'inline-style', 'style={…}');
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

// ── Aggregate to per-file/per-rule counts (robust to line shifts) ────────────
const counts = {}; // file -> { rule -> n }
const catOf = {};
for (const f of findings) {
  (counts[f.file] ??= {})[f.rule] = (counts[f.file]?.[f.rule] ?? 0) + 1;
  catOf[f.file] = f.cat;
}
const total = findings.length;

const sortCounts = (c) => {
  const out = {};
  for (const file of Object.keys(c).sort()) {
    out[file] = {};
    for (const rule of Object.keys(c[file]).sort()) out[file][rule] = c[file][rule];
  }
  return out;
};

if (JSON_OUT) {
  console.log(JSON.stringify({ total, counts: sortCounts(counts) }, null, 2));
  process.exit(0);
}

// --update: snapshot the current findings as the accepted baseline (the ratchet floor).
if (UPDATE) {
  writeFileSync(BASELINE, JSON.stringify(sortCounts(counts), null, 2) + '\n');
  console.log(
    `⚑ app-conformance: baseline written — ${total} flag(s) across ${Object.keys(counts).length} file(s)\n  ${relative(REPO, BASELINE)}`,
  );
  process.exit(0);
}

const summary = () => {
  const byCat = {};
  const byRule = {};
  for (const f of findings) {
    byCat[f.cat] = (byCat[f.cat] ?? 0) + 1;
    byRule[f.rule] = (byRule[f.rule] ?? 0) + 1;
  }
  console.log('By category:');
  for (const [c, n] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${c}`);
  console.log('By rule:');
  for (const [r, n] of Object.entries(byRule).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${r}`);
};

const baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : null;

// No baseline yet → plain flag report; --strict fails on any flag.
if (!baseline) {
  console.log(`\n⚑ app-conformance: ${total} flag(s) in ${relative(REPO, SRC)} — no baseline yet\n`);
  summary();
  console.log(`\n  Run with --update to snapshot these ${total} as the accepted debt (the ratchet floor).`);
  process.exit(STRICT && total > 0 ? 1 : 0);
}

// Ratchet: any (file, rule) whose live count EXCEEDS the baseline is new hand-rolling.
let baseTotal = 0;
for (const rules of Object.values(baseline)) for (const n of Object.values(rules)) baseTotal += n;
const regressions = [];
for (const [file, rules] of Object.entries(counts))
  for (const [rule, n] of Object.entries(rules)) {
    const allowed = baseline[file]?.[rule] ?? 0;
    if (n > allowed) regressions.push({ file, rule, added: n - allowed });
  }
let fixed = 0;
for (const [file, rules] of Object.entries(baseline))
  for (const [rule, n] of Object.entries(rules)) fixed += Math.max(0, n - (counts[file]?.[rule] ?? 0));

const added = regressions.reduce((a, r) => a + r.added, 0);
console.log(`⚑ app-conformance: ${total} live · ${baseTotal} baseline · ${added} new · ${fixed} fixed`);

if (regressions.length) {
  console.error(`\n✗ new hand-rolling introduced (above the baseline):`);
  for (const r of regressions.sort((a, b) => b.added - a.added))
    console.error(`  +${r.added}  ${r.file}  [${r.rule}]`);
  console.error(`\n  → build it from Move components, mark a tracked exception with a ${IGNORE} comment,`);
  console.error(`    or (if truly intentional) re-baseline with --update.`);
  process.exit(1);
}

if (fixed > 0) console.log(`\n✓ ${fixed} fewer than baseline — run --update to lock in the progress.`);
else console.log(`\n✓ holding at baseline — no new hand-rolling.`);
process.exit(0);
