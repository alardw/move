#!/usr/bin/env node
/**
 * Icon-usage spec ↔ source linter.
 *
 * Each component renders built-in icons via `useResolvedIcon('name', size)` or
 * `<Icon name="name" />`. The docs "which icon each component renders" table
 * (packages/docs/src/pages/customize/IconsPage.tsx) derives from each spec's
 * `iconsUsed` field — this check keeps that field in sync with the source so the
 * table can never drift.
 *
 * For every component under `src/components/<category>/<Name>/` containing a
 * `<Name>.spec.ts`:
 *   - Scan all `.tsx`/`.ts` source (component + sub-files + hooks), excluding
 *     `.test.tsx`, `.spec.ts`, `.stories.*`, for icon names.
 *   - Read the spec's `iconsUsed: [...]` (absent = empty).
 *   - VALIDATE (default): sorted(spec.iconsUsed) must deep-equal sorted(source).
 *   - `--write`: rewrite each spec so `iconsUsed` matches the source set
 *     (inserting as the last property before the `} satisfies` closing, replacing
 *     an existing line, or removing it when the set is empty).
 *
 * Exit codes:
 *   0 — all components in sync (validate) / written ok
 *   1 — at least one mismatch (validate)
 *
 * @enforces icons-2 icons-3
 * @instead render through `useResolvedIcon(name, size)` or `<Icon name>` and declare the name in
 *   the spec's `iconsUsed`, so the consumer's `iconResolver` can swap the whole set.
 */

import { readdirSync, statSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const COMPONENTS_DIR = join(MOVE_ROOT, 'src', 'components');
const ROLES_FILE = join(MOVE_ROOT, 'src', 'infrastructure', 'Icon', 'roles.ts');

const WRITE = process.argv.includes('--write');

// Icon-name extraction regexes (kebab/lowercase names only — never generic
// `name:` props, which are far too noisy).
const RE_RESOLVED = /useResolvedIcon\(\s*['"]([a-z0-9-]+)['"]/g;
const RE_JSX = /<Icon\b[^>]*\bname=['"]([a-z0-9-]+)['"]/g;
// The same two, written as an EXPRESSION rather than a literal — which is how a
// component that picks its icon by state has to write it:
//   <Icon name={sorted === 'asc' ? 'chevron-up' : 'chevron-down'} />
//   useResolvedIcon(open ? 'chevron-up' : 'chevron-down')
// Matching only the literal form meant such a component declared no icons at all
// and stayed green, so Table rendered three and listed none. Every quoted
// kebab-case string inside the expression counts; the braces are balanced by
// hand because a regex cannot, and only the first level is needed here.
const RE_JSX_EXPR = /<Icon\b[^>]*\bname=\{([^}]*)\}/g;
const RE_RESOLVED_EXPR = /useResolvedIcon\(([^)]*\?[^)]*)\)/g;
const RE_QUOTED_NAME = /['"]([a-z][a-z0-9-]*)['"]/g;
// Role-based usage: `useIcon('close')` / `useIcon('status.success')` (literal) and
// the dynamic `useIcon(`status.${…}`)` template (→ the full status icon set).
const RE_USEICON = /useIcon\(\s*['"]([a-zA-Z0-9.]+)['"]/g;
const RE_USEICON_DYN_STATUS = /useIcon\(\s*`status\.\$\{/;
// A role chosen by state — `useIcon(sorted === 'asc' ? 'sortAscending' : …)`.
// Roles are camelCase, so unlike icon names they cannot be confused with a
// ternary's test value: every quoted string here either resolves to a role or is
// discarded by roleToName.
const RE_USEICON_EXPR = /useIcon\(([^)]*\?[^)]*)\)/g;
const RE_QUOTED_ROLE = /['"]([a-zA-Z][a-zA-Z0-9.]*)['"]/g;

// ──────────────────────────────────────────────────────────────────────────────
// Role → built-in name resolution (parsed from roles.ts so this never drifts)
// ──────────────────────────────────────────────────────────────────────────────

/** Build { topLevel: {role→name}, status: {key→name}, statusNames: [...] }. */
function loadRoleMap() {
  const text = readFileSync(ROLES_FILE, 'utf8');

  // Nested `status: { info: 'info', … }` block.
  const status = {};
  const statusBlock = text.match(/status:\s*\{([\s\S]*?)\}/);
  if (statusBlock) {
    for (const m of statusBlock[1].matchAll(/([a-zA-Z]+):\s*['"]([a-z0-9-]+)['"]/g)) {
      status[m[1]] = m[2];
    }
  }

  // Every `key: 'name'` pair (top-level roles; nested status pairs overlap
  // harmlessly and are resolved via the status map instead).
  const topLevel = {};
  for (const m of text.matchAll(/^\s*([a-zA-Z]+):\s*['"]([a-z0-9-]+)['"]/gm)) {
    topLevel[m[1]] = m[2];
  }

  return { topLevel, status, statusNames: [...new Set(Object.values(status))] };
}

const ROLE_MAP = loadRoleMap();

const BUILTINS_FILE = join(MOVE_ROOT, 'src', 'infrastructure', 'Icon', 'builtinIcons.tsx');
/** Built-in icon names — the fallback set every rendered icon should resolve into. */
const BUILTINS = new Set(
  [...readFileSync(BUILTINS_FILE, 'utf8').matchAll(/^\s*'([a-z][a-z0-9-]*)':/gm)].map((m) => m[1]),
);

/** Resolve a role literal (`close` or `status.success`) to its built-in name. */
function roleToName(role) {
  if (role.startsWith('status.')) return ROLE_MAP.status[role.slice(7)] ?? null;
  return ROLE_MAP.topLevel[role] ?? null;
}

// ──────────────────────────────────────────────────────────────────────────────
// Discovery
// ──────────────────────────────────────────────────────────────────────────────

/** Every component dir under src/components/* that holds a `<Name>.spec.ts`. */
function listComponents() {
  const out = [];
  for (const category of readdirSync(COMPONENTS_DIR)) {
    const catDir = join(COMPONENTS_DIR, category);
    if (!statSync(catDir).isDirectory()) continue;
    for (const compName of readdirSync(catDir)) {
      if (compName.startsWith('_')) continue; // _shared
      const compDir = join(catDir, compName);
      if (!statSync(compDir).isDirectory()) continue;
      if (existsSync(join(compDir, `${compName}.spec.ts`))) out.push(compDir);
    }
  }
  return out;
}

/** Sorted unique icon names rendered by the source files in `dir`. */
function iconsFromSource(dir) {
  const found = new Set();
  for (const entry of readdirSync(dir)) {
    if (!entry.endsWith('.tsx') && !entry.endsWith('.ts')) continue;
    if (entry.endsWith('.test.tsx') || entry.endsWith('.test.ts')) continue;
    if (entry.endsWith('.spec.ts')) continue;
    if (entry.includes('.stories.')) continue;
    const fp = join(dir, entry);
    if (!statSync(fp).isFile()) continue;
    const text = readFileSync(fp, 'utf8');
    for (const m of text.matchAll(RE_RESOLVED)) found.add(m[1]);
    for (const m of text.matchAll(RE_JSX)) found.add(m[1]);
    // Expression form: every quoted kebab-case name a state-chosen icon can
    // resolve to. All of them are rendered, just not at the same time.
    for (const m of [...text.matchAll(RE_JSX_EXPR), ...text.matchAll(RE_RESOLVED_EXPR)]) {
      for (const n of m[1].matchAll(RE_QUOTED_NAME)) {
        // An expression carries strings that are not icon names — the ternary's
        // own test (`sorted === 'asc'`), a type guard's `'string'`. A regex
        // cannot tell a branch from its condition, so accept only what could be
        // an icon: a hyphenated name, or one the built-in set already knows.
        // The cost is that a NEW single-word name with no built-in stays
        // invisible in expression form; it is still caught written literally.
        if (n[1].includes('-') || BUILTINS.has(n[1])) found.add(n[1]);
      }
    }
    // Role-based literals (`useIcon('close')`, `useIcon('status.success')`).
    for (const m of text.matchAll(RE_USEICON)) {
      const name = roleToName(m[1]);
      if (name) found.add(name);
    }
    // Role chosen by state: every role the expression can resolve to.
    for (const m of text.matchAll(RE_USEICON_EXPR)) {
      for (const r of m[1].matchAll(RE_QUOTED_ROLE)) {
        const name = roleToName(r[1]);
        if (name) found.add(name);
      }
    }
    // Dynamic `useIcon(`status.${…}`)` → the component renders the whole status
    // set (info / success / warning / danger).
    if (RE_USEICON_DYN_STATUS.test(text)) {
      for (const name of ROLE_MAP.statusNames) found.add(name);
    }
  }
  return [...found].sort();
}

/** Icon names declared in a spec's `iconsUsed: [...]` (absent = []). */
function iconsFromSpec(specText) {
  const m = specText.match(/iconsUsed:\s*\[([^\]]*)\]/);
  if (!m) return [];
  return [...m[1].matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]).sort();
}

// ──────────────────────────────────────────────────────────────────────────────
// Write mode
// ──────────────────────────────────────────────────────────────────────────────

/** Rewrite a spec's `iconsUsed` line to match `icons` (sorted). Returns the new
 *  text, or null if no change was needed. */
function rewriteSpec(specText, icons) {
  const has = /^[ \t]*iconsUsed:\s*\[[^\]]*\],?\s*$/m.test(specText);

  if (icons.length === 0) {
    if (!has) return null;
    // Remove the existing iconsUsed line entirely.
    return specText.replace(/^[ \t]*iconsUsed:\s*\[[^\]]*\],?\s*\n/m, '');
  }

  const line = `  iconsUsed: [${icons.map((i) => `'${i}'`).join(', ')}],`;

  if (has) {
    const next = specText.replace(/^[ \t]*iconsUsed:\s*\[[^\]]*\],?\s*$/m, line);
    return next === specText ? null : next;
  }

  // Insert as the last property, before the `} satisfies` closing (every spec has it).
  if (!/^\} satisfies\b/m.test(specText)) {
    throw new Error('no `} satisfies` anchor to insert iconsUsed before');
  }
  return specText.replace(/^(\} satisfies\b)/m, `${line}\n$1`);
}

// ──────────────────────────────────────────────────────────────────────────────
// Run
// ──────────────────────────────────────────────────────────────────────────────

const components = listComponents();
let mismatches = 0;
let written = 0;
const fallbackMisses = []; // icons-3: rendered icons with no built-in fallback
const usageMap = {}; // name → sorted icons (for the --write summary)

for (const dir of components) {
  const name = basename(dir);
  const specFile = join(dir, `${name}.spec.ts`);
  const specText = readFileSync(specFile, 'utf8');
  const source = iconsFromSource(dir);
  const spec = iconsFromSpec(specText);

  if (WRITE) {
    const next = rewriteSpec(specText, source);
    if (next != null) {
      writeFileSync(specFile, next);
      written++;
    }
    if (source.length) usageMap[name] = source;
    continue;
  }

  // icons-3: every icon the source renders must have a built-in fallback.
  const noFallback = source.filter((n) => !BUILTINS.has(n));
  if (noFallback.length) fallbackMisses.push({ name, icons: noFallback });

  const equal = source.length === spec.length && source.every((v, i) => v === spec[i]);
  if (!equal) {
    mismatches++;
    const missingInSpec = source.filter((v) => !spec.includes(v));
    const extraInSpec = spec.filter((v) => !source.includes(v));
    console.log(`\n${name}`);
    if (spec.length === 0 && source.length) {
      console.log(`  ✗ source renders [${source.join(', ')}] but spec has no iconsUsed`);
    } else {
      if (missingInSpec.length) console.log(`  ✗ missing in spec: ${missingInSpec.join(', ')}`);
      if (extraInSpec.length) console.log(`  ✗ extra in spec (not in source): ${extraInSpec.join(', ')}`);
    }
  }
}

console.log('');
if (WRITE) {
  console.log(`✓ icon-usage: wrote iconsUsed to ${written} spec(s) across ${components.length} components`);
  // Emit the full per-component map so the run is auditable.
  const entries = Object.entries(usageMap).sort(([a], [b]) => a.localeCompare(b));
  for (const [comp, icons] of entries) {
    console.log(`  ${comp}: ${icons.join(', ')}`);
  }
  process.exit(0);
}

if (fallbackMisses.length) {
  console.log('✗ icon-usage: icons rendered with no built-in fallback (add them to builtinIcons.tsx):');
  for (const { name, icons } of fallbackMisses) console.log(`  ${name}: ${icons.join(', ')}`);
}
if (mismatches > 0) {
  console.log(`✗ icon-usage: ${mismatches} component(s) out of sync with source (run with --write to fix)`);
}
if (mismatches > 0 || fallbackMisses.length) process.exit(1);
console.log(`✓ icon-usage: ${components.length} components — iconsUsed in sync + every icon has a built-in fallback`);
process.exit(0);
