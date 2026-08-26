#!/usr/bin/env node
/**
 * Aggregate API-surface generator.
 *
 * Reads every `src/components/<cat>/<Name>/<Name>.spec.ts` and emits a single
 * machine-readable API surface at the package root:
 *
 *   - move.api.json — structured: component → props → { type, values, default }
 *   - llms.txt       — prose, one component per section, props + allowed values
 *                      + a one-line example. The llms.txt convention exists so an
 *                      AI consumer reads ONE file instead of spelunking dist/*.d.ts.
 *
 * Prop `values` are resolved: a spec `typeRef` (Size/Gap/Color/…) resolves to its
 * literal set via the canonical registry (single-sourced from typeRegistry.ts +
 * shared/color.ts); an inline `type` that is a string-literal union is parsed.
 *
 * Regenerated in `build` and shipped via package.json `files`. Do not hand-edit
 * the outputs.
 *
 * `--check` (check:api-surface) regenerates in memory and fails if the committed
 * outputs differ — the apiSurface-1 gate. Same logic as the write path, so it can't
 * drift from the generator it guards.
 *
 * @enforces apiSurface-1
 */

import { readdirSync, statSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const COMPONENTS_DIR = join(ROOT, 'src', 'components');

// ── AST helpers ────────────────────────────────────────────────────────────
const parse = (f) =>
  ts.createSourceFile(f, readFileSync(f, 'utf8'), ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);
const walk = (n, v) => {
  v(n);
  ts.forEachChild(n, (c) => walk(c, v));
};
const asString = (n) =>
  n && (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) ? n.text : null;
const unwrap = (n) => {
  while (
    n &&
    (ts.isAsExpression(n) || ts.isParenthesizedExpression(n) || ts.isSatisfiesExpression(n))
  )
    n = n.expression;
  return n;
};
function getProp(obj, name) {
  if (!obj || !ts.isObjectLiteralExpression(obj)) return null;
  for (const p of obj.properties) {
    if (
      ts.isPropertyAssignment(p) &&
      ((ts.isIdentifier(p.name) && p.name.text === name) || asString(p.name) === name)
    )
      return p.initializer;
  }
  return null;
}
const stripQuotes = (s) =>
  s == null
    ? null
    : String(s)
        .trim()
        .replace(/^['"`]|['"`]$/g, '');

/** Parse a string-literal union like "'a' | 'b' | 'c'" → ['a','b','c'], else null. */
function parseUnion(type) {
  if (!type) return null;
  const parts = type.split('|').map((s) => s.trim());
  if (parts.length < 2) return null;
  const lits = parts.map((p) => (/^'[^']*'$/.test(p) ? p.slice(1, -1) : null));
  return lits.every((l) => l !== null) ? lits : null;
}

// ── Canonical typeRef → values (single-sourced from the registry + color list) ──
function loadCanonicalTypes() {
  const map = {};
  // MOVE_COLORS array from shared/color.ts
  let moveColors = [];
  const colorFile = join(ROOT, 'src', 'shared', 'color.ts');
  if (existsSync(colorFile)) {
    walk(parse(colorFile), (n) => {
      if (
        ts.isVariableDeclaration(n) &&
        ts.isIdentifier(n.name) &&
        n.name.text === 'MOVE_COLORS' &&
        n.initializer
      ) {
        const arr = unwrap(n.initializer);
        if (ts.isArrayLiteralExpression(arr))
          moveColors = arr.elements.map(asString).filter(Boolean);
      }
    });
  }
  // CANONICAL_TYPES object from shared/typeRegistry.ts
  const regFile = join(ROOT, 'src', 'shared', 'typeRegistry.ts');
  if (existsSync(regFile)) {
    walk(parse(regFile), (n) => {
      if (
        ts.isVariableDeclaration(n) &&
        ts.isIdentifier(n.name) &&
        n.name.text === 'CANONICAL_TYPES' &&
        n.initializer
      ) {
        const obj = unwrap(n.initializer);
        if (ts.isObjectLiteralExpression(obj)) {
          for (const p of obj.properties) {
            if (!ts.isPropertyAssignment(p)) continue;
            const key = ts.isIdentifier(p.name) ? p.name.text : asString(p.name);
            const init = unwrap(p.initializer);
            if (ts.isArrayLiteralExpression(init))
              map[key] = init.elements.map(asString).filter(Boolean);
            else if (ts.isIdentifier(init) && init.text === 'MOVE_COLORS') map[key] = moveColors;
          }
        }
      }
    });
  }
  return map;
}
const CANONICAL = loadCanonicalTypes();

// ── Extract one prop object → API entry ─────────────────────────────────────
function extractProp(p) {
  const name = asString(getProp(p, 'name'));
  if (!name) return null;
  const typeRef = asString(getProp(p, 'typeRef'));
  const type = asString(getProp(p, 'type'));
  const def = getProp(p, 'default');
  const defVal = def ? stripQuotes(asString(def) ?? unwrap(def).getText()) : undefined;
  const description = asString(getProp(p, 'description')) ?? '';
  let values = null;
  let typeStr = type ?? undefined;
  if (typeRef) {
    typeStr = typeRef;
    values = CANONICAL[typeRef] ?? null;
  } else if (type) {
    values = parseUnion(type);
  }
  const entry = { name, type: typeStr };
  if (values) entry.values = values;
  if (defVal !== undefined) entry.default = defVal;
  if (description) entry.description = description;
  return entry;
}

function extractPropsArray(node) {
  if (!node || !ts.isArrayLiteralExpression(node)) return [];
  return node.elements.map(extractProp).filter(Boolean);
}

// ── Extract one spec ────────────────────────────────────────────────────────
function extractComponent(specFile, category) {
  const sf = parse(specFile);
  let specObj = null;
  walk(sf, (node) => {
    if (specObj) return;
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === 'spec' &&
      node.initializer
    ) {
      const init = unwrap(node.initializer);
      if (ts.isObjectLiteralExpression(init)) specObj = init;
    }
  });
  if (!specObj) return null;

  const name = asString(getProp(specObj, 'name'));
  if (!name) return null;
  const description = asString(getProp(specObj, 'description')) ?? '';
  const componentClass = asString(getProp(specObj, 'componentClass')) ?? null;
  const props = extractPropsArray(getProp(specObj, 'props'));

  const subComponents = [];
  const subsNode = getProp(specObj, 'subComponents');
  if (subsNode && ts.isArrayLiteralExpression(subsNode)) {
    for (const el of subsNode.elements) {
      const subName = asString(getProp(el, 'name'));
      if (!subName) continue;
      const subProps = extractPropsArray(getProp(el, 'props'));
      if (subName !== 'Root' || subProps.length)
        subComponents.push({ name: subName, props: subProps });
    }
  }

  // Is the exported value callable? Three shapes ship from this repo:
  //
  //   export const Alert  = withMoveComponent(...)        → callable
  //   export const Button = Object.assign(ButtonRoot, {}) → callable, has parts
  //   export const Switch = { Root, Thumb }               → NOT callable
  //
  // Only the third makes `<Switch checked />` a type error, and 27 components
  // have that shape. Emitting a flat prop block for them documents JSX that
  // cannot compile — which is worse than documenting nothing, because an agent
  // writes what it can find.
  const sourceFile = specFile.replace(/\.spec\.ts$/, '.tsx');
  let callable = true;
  if (existsSync(sourceFile)) {
    const src = readFileSync(sourceFile, 'utf8');
    const m = new RegExp(`export const ${name}(?::[^=]+)? = (Object\\.assign|withMoveComponent|\\{)`).exec(src);
    if (m) callable = m[1] !== '{';
  }

  return { name, category, componentClass, description, props, subComponents, callable };
}

// ── Collect ─────────────────────────────────────────────────────────────────
const components = [];
for (const category of readdirSync(COMPONENTS_DIR)) {
  const catDir = join(COMPONENTS_DIR, category);
  if (!statSync(catDir).isDirectory()) continue;
  for (const compName of readdirSync(catDir)) {
    if (compName.startsWith('_')) continue;
    const compDir = join(catDir, compName);
    if (!statSync(compDir).isDirectory()) continue;
    const specFile = join(compDir, `${compName}.spec.ts`);
    if (!existsSync(specFile)) continue;
    const c = extractComponent(specFile, category);
    if (c) components.push(c);
  }
}
components.sort((a, b) => a.name.localeCompare(b.name));

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

// `--check` (apiSurface-1): don't write — compare what we'd generate against what's
// committed, and fail on any difference. Same generation logic either way, so the check
// can't drift from the generator. A drifted move.api.json (which shipped this session
// with nothing to catch it) means the public API changed without the generated surface
// being regenerated + committed — i.e. an unreviewed API change.
const CHECK = process.argv.includes('--check');
const drifted = [];
const emit = (relPath, content) => {
  const abs = join(ROOT, relPath);
  if (!CHECK) {
    writeFileSync(abs, content);
    return;
  }
  const current = existsSync(abs) ? readFileSync(abs, 'utf8') : null;
  if (current !== content) drifted.push(relPath);
};

// ── Emit move.api.json ──────────────────────────────────────────────────────
const apiJson = {
  name: pkg.name,
  version: pkg.version,
  description:
    'Machine-readable API surface for the Move component library. One entry per component: props, allowed values, defaults. Generated from *.spec.ts.',
  componentCount: components.length,
  components,
};
emit('move.api.json', JSON.stringify(apiJson, null, 2) + '\n');

// ── Emit llms.txt ───────────────────────────────────────────────────────────
function propLine(p) {
  const val = p.values ? p.values.map((v) => `'${v}'`).join(' | ') : (p.type ?? 'unknown');
  const dft = p.default !== undefined ? ` (default: ${p.default})` : '';
  const desc = p.description ? ` — ${p.description}` : '';
  return `- ${p.name}: ${val}${dft}${desc}`;
}
function example(c) {
  // Pick up to two enum-ish props to show a realistic usage.
  const shown = c.props.filter((p) => p.values && p.name !== 'size').slice(0, 2);
  const attrs = shown.map((p) => ` ${p.name}="${p.default ?? p.values[0]}"`).join('');
  // A non-callable compound is only ever entered through `.Root` — `<Switch>`
  // does not typecheck, so it must not appear in a generated example either.
  const tag = c.callable ? c.name : `${c.name}.Root`;
  return `<${tag}${attrs}>…</${tag}>`;
}
const lines = [];
lines.push(`# ${pkg.name} — Component API`);
lines.push('');
lines.push(`> Machine-readable API surface, generated from *.spec.ts. One section per component:`);
lines.push(
  `> props, allowed values, defaults, and an example. Import components from '${pkg.name}'.`,
);
lines.push(`> ${components.length} components. Version ${pkg.version}.`);
lines.push('');
for (const c of components) {
  lines.push(`## ${c.name} (${c.category})`);
  if (c.description) lines.push(c.description);
  const hasRootSub = c.subComponents.some((s) => s.name === 'Root');
  if (c.props.length && (c.callable || !hasRootSub)) {
    // A non-callable compound with no Root entry still needs its props somewhere;
    // they are the Root's, so label them that way rather than as flat props.
    lines.push(c.callable ? 'Props:' : `${c.name}.Root props:`);
    for (const p of c.props) lines.push(propLine(p));
  }
  for (const sub of c.subComponents) {
    if (!sub.props.length) continue;
    lines.push(`${c.name}.${sub.name} props:`);
    for (const p of sub.props) lines.push(propLine(p));
  }
  lines.push(`Example: ${example(c)}`);
  lines.push('');
}
emit('llms.txt', lines.join('\n'));

if (CHECK) {
  if (drifted.length) {
    console.error('  ✗ Generated API surface is out of date:');
    for (const f of drifted) console.error(`      ${f}`);
    console.error('\n  apiSurface-1: the public API changed but the generated surface was not');
    console.error('  regenerated + committed. Run `npm run gen:api` and commit, so the change is');
    console.error('  a reviewed diff rather than a silent drift.');
    process.exit(1);
  }
  console.log(
    `✓ apiSurface: move.api.json + llms.txt match the specs (${components.length} components).`,
  );
  process.exit(0);
}

console.log(`✓ generate-api: ${components.length} components → move.api.json + llms.txt`);
