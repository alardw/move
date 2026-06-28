#!/usr/bin/env node
/**
 * Recipe purity.
 *
 * The recipe golden rule (skills/references/recipes/rules.md, rule 1):
 * recipes are built ENTIRELY from Move components — no raw HTML elements
 * (`<div>`, `<span>`, `<main>`, `<p>`, …), no inline `style=` props, no
 * custom CSS. This check enforces that on the published, site-rendered
 * recipes by parsing each source with the TypeScript compiler and flagging:
 *
 *   1. Intrinsic JSX elements (lowercase tag names → raw HTML).
 *   2. `style` JSX attributes (inline styles → custom CSS).
 *
 * Escape hatch: a few app-shell layouts need viewport sizing (`height: 100vh`,
 * `flex: 1`) that no Move primitive expresses yet. Mark such a line with a
 *
 *     {/* recipe-purity-ignore: <reason> *\/}
 *
 * comment on the same line or the line directly above, and the check skips it
 * — so the exception stays visible and justified instead of silently allowed.
 *
 * Scope: the COMPOSITE recipes (the ones registered on the docs /recipes page),
 * in both the canonical reference tree and the docs copy. The single-component
 * `component/` recipes carry pre-existing demo-layout scaffolding and are a
 * separate cleanup — add their dir to SCAN_ROOTS once converted.
 *
 * Exit: 0 = pass, 1 = fail.
 */

import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..', '..', '..', '..'); // packages/move/scripts/checks → repo root
const VERBOSE = process.argv.includes('--verbose');

const IGNORE_MARKER = 'recipe-purity-ignore';

// Source trees to enforce: composite recipes AND the docs component samples +
// card previews. All must be built only from Move components — no raw HTML, no
// inline `style=` (use the recipe-purity-ignore marker for the rare case with
// no Move primitive, e.g. fixed-height demo frames or colored filler tiles).
const SCAN_ROOTS = [
  join(REPO, 'packages/move/skills/references/recipes/composite'),
  join(REPO, 'packages/docs/src/content/recipes'),
  join(REPO, 'packages/docs/src/content/components'),
];

/** Recursively collect every .tsx file under a directory. */
function collectTsx(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) collectTsx(full, out);
    else if (entry.endsWith('.tsx')) out.push(full);
  }
  return out;
}

/** Find every recipe file, de-duplicated. */
const files = [...new Set(SCAN_ROOTS.flatMap((root) => collectTsx(root)))].sort();

const violations = [];

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const lines = src.split('\n');
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  // A line is exempt if it — or the line directly above — carries the marker.
  const isIgnored = (line1) => {
    const here = lines[line1 - 1] ?? '';
    const above = lines[line1 - 2] ?? '';
    return here.includes(IGNORE_MARKER) || above.includes(IGNORE_MARKER);
  };

  const record = (node, kind, detail) => {
    const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
    const line1 = line + 1;
    if (isIgnored(line1)) return;
    violations.push({ file, line: line1, kind, detail });
  };

  const visit = (node) => {
    // Raw HTML: a JSX element whose tag name is a lowercase identifier.
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(sf);
      if (/^[a-z]/.test(tag)) record(node, 'raw-html', `<${tag}>`);
    }
    // Inline style: a `style=` JSX attribute.
    if (ts.isJsxAttribute(node) && node.name.getText(sf) === 'style') {
      record(node, 'inline-style', 'style=');
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

if (violations.length === 0) {
  console.log(`✓ recipe-purity: ${files.length} recipe files are 100% Move components.`);
  process.exit(0);
}

// Group by file for a tight report.
const byFile = new Map();
for (const v of violations) {
  if (!byFile.has(v.file)) byFile.set(v.file, []);
  byFile.get(v.file).push(v);
}

console.error(`✗ recipe-purity: ${violations.length} violation(s) in ${byFile.size} file(s).\n`);
for (const [file, vs] of byFile) {
  console.error(`  ${relative(REPO, file)}`);
  for (const v of vs) {
    console.error(`    ${v.line}: ${v.kind} — ${v.detail}`);
  }
}
console.error(
  `\n  Recipes must be built only from Move components — replace raw HTML with` +
    `\n  Move primitives (Stack/Text/Grid/…) and inline styles with component props.` +
    `\n  Unavoidable viewport sizing: mark the line with {/* ${IGNORE_MARKER}: <reason> */}.`,
);
if (!VERBOSE) console.error('\n  (run with --verbose for full paths)');
process.exit(1);
