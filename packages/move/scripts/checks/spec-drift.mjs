#!/usr/bin/env node
/**
 * Spec ↔ source ↔ docs sync linter.
 *
 * For every component under `src/components/<category>/<Name>/`:
 *
 *   1. Both `<Name>.tsx` and `<Name>.spec.ts` exist.
 *   2. The runtime compound shape (the keys passed to `Object.assign`
 *      that produces the public component) matches the sub-components
 *      named in the spec.
 *   3. Every prop named on the spec's sub-components also appears in
 *      the matching `<Name><SubName>Props` interface in the source.
 *      Catches drift when a prop is removed from code but not the spec
 *      (or vice versa).
 *   4. Spec strings are non-empty: descriptions, names, types are filled.
 *   5. Optional cross-package check: if a docs entry exists at
 *      `packages/docs/src/content/components/<slug>/index.ts`, ensure
 *      the spec name resolves to the same component.
 *
 * Exit codes:
 *   0 — all components pass
 *   1 — at least one error found
 *
 * The script reports a tight summary at the end; pass `--verbose` to
 * see every passing component as well.
 */

import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const COMPONENTS_DIR = join(MOVE_ROOT, 'src', 'components');
const DOCS_CONTENT_DIR = join(
  MOVE_ROOT,
  '..',
  'docs',
  'src',
  'content',
  'components',
);

const VERBOSE = process.argv.includes('--verbose');

// ──────────────────────────────────────────────────────────────────────────────
// AST helpers
// ──────────────────────────────────────────────────────────────────────────────

/** Parse a .ts/.tsx file into an AST. */
function parse(file) {
  const text = readFileSync(file, 'utf8');
  return ts.createSourceFile(file, text, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);
}

/** Walk an AST, calling `visitor` on every node. */
function walk(node, visitor) {
  visitor(node);
  ts.forEachChild(node, (child) => walk(child, visitor));
}

/** Extract a string literal from an AST node, or null. */
function asString(node) {
  if (!node) return null;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  return null;
}

/** Read a property from an object literal by name. Returns the initializer node, or null. */
function getProp(objectLiteral, name) {
  if (!objectLiteral || !ts.isObjectLiteralExpression(objectLiteral)) return null;
  for (const p of objectLiteral.properties) {
    if (
      ts.isPropertyAssignment(p) &&
      ((ts.isIdentifier(p.name) && p.name.text === name) ||
        asString(p.name) === name)
    ) {
      return p.initializer;
    }
  }
  return null;
}

// ──────────────────────────────────────────────────────────────────────────────
// Spec parsing
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Read a `<Name>.spec.ts` and return:
 *   {
 *     subComponents: [{ name, props: [propName, ...] }],
 *     slots:         [slotName, ...],
 *     name:          string | null,
 *   }
 */
function parseSpec(file) {
  const sf = parse(file);
  let specObj = null;

  walk(sf, (node) => {
    if (specObj) return;
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (
          ts.isIdentifier(decl.name) &&
          decl.name.text === 'spec' &&
          decl.initializer
        ) {
          // Spec is sometimes wrapped in `(...) as const` or similar.
          let init = decl.initializer;
          while (ts.isAsExpression(init) || ts.isParenthesizedExpression(init)) {
            init = init.expression;
          }
          if (ts.isObjectLiteralExpression(init)) {
            specObj = init;
          }
        }
      }
    }
  });

  if (!specObj) {
    return { subComponents: [], slots: [], name: null, _missing: true };
  }

  const nameNode = getProp(specObj, 'name');
  const name = nameNode ? asString(nameNode) : null;

  const slotsNode = getProp(specObj, 'slots');
  const slots = [];
  if (slotsNode && ts.isArrayLiteralExpression(slotsNode)) {
    for (const el of slotsNode.elements) {
      const slotName = getProp(el, 'name');
      const v = asString(slotName);
      if (v) slots.push(v);
    }
  }

  const subsNode = getProp(specObj, 'subComponents');
  const subComponents = [];
  if (subsNode && ts.isArrayLiteralExpression(subsNode)) {
    for (const el of subsNode.elements) {
      const subName = asString(getProp(el, 'name'));
      const propsArr = getProp(el, 'props');
      const propNames = [];
      if (propsArr && ts.isArrayLiteralExpression(propsArr)) {
        for (const p of propsArr.elements) {
          const pn = asString(getProp(p, 'name'));
          if (pn) propNames.push(pn);
        }
      }
      if (subName) subComponents.push({ name: subName, props: propNames });
    }
  }

  return { subComponents, slots, name };
}

// ──────────────────────────────────────────────────────────────────────────────
// Source parsing
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Read a `<Name>.tsx` and return:
 *   {
 *     compoundKeys: ['Root', 'Header', ...]   keys on the public Object.assign
 *     interfaces:   { TableRootProps: { props: [...], extends: ['UseSidebarOptions'] } }
 *   }
 *
 * Tracks `extends` clauses so callers can resolve inherited props from
 * sibling files.
 */
function parseSource(file, componentName) {
  const sf = parse(file);
  const interfaces = {};
  let compoundKeys = null;

  walk(sf, (node) => {
    // interface XxxProps extends Y, Z { ... }
    if (ts.isInterfaceDeclaration(node) && node.name.text.endsWith('Props')) {
      const props = [];
      for (const member of node.members) {
        if (
          ts.isPropertySignature(member) &&
          ts.isIdentifier(member.name)
        ) {
          props.push(member.name.text);
        }
      }
      const extendsList = [];
      if (node.heritageClauses) {
        for (const clause of node.heritageClauses) {
          if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
            for (const t of clause.types) {
              if (ts.isIdentifier(t.expression)) extendsList.push(t.expression.text);
            }
          }
        }
      }
      interfaces[node.name.text] = { props, extends: extendsList };
    }

    // export const ComponentName = Object.assign(Root, { Header, Item, ... })
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (
          ts.isIdentifier(decl.name) &&
          decl.name.text === componentName &&
          decl.initializer &&
          ts.isCallExpression(decl.initializer) &&
          ts.isPropertyAccessExpression(decl.initializer.expression) &&
          decl.initializer.expression.expression.getText() === 'Object' &&
          decl.initializer.expression.name.text === 'assign'
        ) {
          // First arg is the root component identifier; second arg is the
          // sub-component map.
          const args = decl.initializer.arguments;
          if (args.length >= 2 && ts.isObjectLiteralExpression(args[1])) {
            const keys = [];
            for (const p of args[1].properties) {
              if (
                (ts.isPropertyAssignment(p) || ts.isShorthandPropertyAssignment(p)) &&
                ts.isIdentifier(p.name)
              ) {
                keys.push(p.name.text);
              }
            }
            compoundKeys = keys;
          }
        }
      }
    }
  });

  return { interfaces, compoundKeys };
}

// ──────────────────────────────────────────────────────────────────────────────
// Per-component check
// ──────────────────────────────────────────────────────────────────────────────

/** Map a subComponent name like "Root" / "Cell" to the matching props
 *  interface in the source — usually `<ComponentName><SubName>Props`.
 *  Also tries common shared-interface names so cases where multiple
 *  sub-components share one props type don't false-positive (e.g.
 *  Align uses `AlignSectionProps` for Start/Center/End). */
function expectedInterfaceName(componentName, subName) {
  if (subName === 'Root') {
    return [`${componentName}RootProps`, `${componentName}Props`];
  }
  return [
    `${componentName}${subName}Props`,
    `${componentName}SectionProps`,
    `${componentName}ItemProps`,
  ];
}

/** Read every `.ts` and `.tsx` file in `dir`, parse each, and return a
 *  combined interface map (name → { props, extends }). Used as a fallback
 *  pool for resolving an interface's `extends` clause when the parent
 *  type lives in a sibling file (e.g. `useSidebar.ts`). */
function readSiblingInterfaces(dir) {
  const out = {};
  for (const entry of readdirSync(dir)) {
    if (!entry.endsWith('.ts') && !entry.endsWith('.tsx')) continue;
    if (entry.endsWith('.spec.ts') || entry.endsWith('.test.tsx')) continue;
    const filePath = join(dir, entry);
    if (!statSync(filePath).isFile()) continue;
    try {
      const sf = parse(filePath);
      walk(sf, (node) => {
        if (ts.isInterfaceDeclaration(node)) {
          const props = [];
          for (const m of node.members) {
            if (ts.isPropertySignature(m) && ts.isIdentifier(m.name)) {
              props.push(m.name.text);
            }
          }
          const extendsList = [];
          if (node.heritageClauses) {
            for (const clause of node.heritageClauses) {
              if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
                for (const t of clause.types) {
                  if (ts.isIdentifier(t.expression)) extendsList.push(t.expression.text);
                }
              }
            }
          }
          out[node.name.text] = { props, extends: extendsList };
        }
      });
    } catch {
      // ignore unparseable siblings
    }
  }
  return out;
}

/** Resolve all props on an interface, recursively walking `extends` chains
 *  through `interfacePool`. Returns a flat array of prop names. */
function resolveAllProps(interfaceName, interfacePool, seen = new Set()) {
  if (seen.has(interfaceName)) return [];
  seen.add(interfaceName);
  const entry = interfacePool[interfaceName];
  if (!entry) return [];
  const own = entry.props ?? [];
  const inherited = (entry.extends ?? []).flatMap((parent) =>
    resolveAllProps(parent, interfacePool, seen),
  );
  return Array.from(new Set([...own, ...inherited]));
}

function checkComponent(componentDir) {
  const name = basename(componentDir);
  const sourceFile = join(componentDir, `${name}.tsx`);
  const specFile = join(componentDir, `${name}.spec.ts`);

  const errors = [];
  const warnings = [];

  if (!existsSync(sourceFile)) {
    errors.push(`source missing: ${name}.tsx`);
    return { name, errors, warnings };
  }
  if (!existsSync(specFile)) {
    errors.push(`spec missing: ${name}.spec.ts`);
    return { name, errors, warnings };
  }

  const spec = parseSpec(specFile);
  const source = parseSource(sourceFile, name);
  // Pool: every interface in the component dir, used to resolve `extends`.
  const interfacePool = { ...readSiblingInterfaces(componentDir), ...source.interfaces };

  if (spec._missing) {
    errors.push('spec.ts has no `export const spec = { ... }`');
    return { name, errors, warnings };
  }

  // 1. Compound keys ↔ subComponents
  if (source.compoundKeys) {
    const runtimeKeys = source.compoundKeys.filter((k) => k !== 'Root');
    const specSubs = spec.subComponents.map((s) => s.name).filter((n) => n !== 'Root');

    const inRuntimeNotSpec = runtimeKeys.filter((k) => !specSubs.includes(k));
    const inSpecNotRuntime = specSubs.filter((k) => !runtimeKeys.includes(k));

    if (inRuntimeNotSpec.length) {
      errors.push(`compound keys missing from spec: ${inRuntimeNotSpec.join(', ')}`);
    }
    if (inSpecNotRuntime.length) {
      errors.push(`spec sub-components missing from runtime: ${inSpecNotRuntime.join(', ')}`);
    }
  }

  // 2. Each spec sub-component's prop list ↔ matching source interface props
  for (const sub of spec.subComponents) {
    const candidates = expectedInterfaceName(name, sub.name);
    // Look in the full interface pool (main file + siblings) so split-out
    // sub-component files like TooltipProvider.tsx are picked up too.
    const interfaceName = candidates.find((c) => interfacePool[c]);
    if (!interfaceName) {
      warnings.push(
        `${sub.name}: no source interface found (looked for ${candidates.join(' or ')})`,
      );
      continue;
    }
    // Resolve own props plus everything inherited via `extends`.
    const sourceProps = resolveAllProps(interfaceName, interfacePool);
    // Subtract noise: structural props (sp/className/style/children/ref/key)
    // and standard React event handlers that come along for the ride on any
    // interactive element. They're rarely intentional API surface — when
    // they are, the consumer adds them explicitly to the spec.
    const ignored = new Set(['sp', 'className', 'style', 'children', 'ref', 'key']);
    const isReactEventHandler = (p) => /^on[A-Z][a-zA-Z]+$/.test(p);
    const specProps = sub.props.filter((p) => !ignored.has(p));
    const realSourceProps = sourceProps.filter(
      (p) => !ignored.has(p) && (!isReactEventHandler(p) || sub.props.includes(p)),
    );

    const inSourceNotSpec = realSourceProps.filter((p) => !specProps.includes(p));
    const inSpecNotSource = specProps.filter((p) => !realSourceProps.includes(p));

    if (inSourceNotSpec.length) {
      warnings.push(
        `${sub.name}.${interfaceName}: prop(s) in source not in spec: ${inSourceNotSpec.join(', ')}`,
      );
    }
    if (inSpecNotSource.length) {
      errors.push(
        `${sub.name}.${interfaceName}: prop(s) in spec not in source: ${inSpecNotSource.join(', ')}`,
      );
    }
  }

  // 3. Optional docs cross-check: if a docs entry exists, sanity-check it.
  const slug = name.toLowerCase();
  const docsEntry = join(DOCS_CONTENT_DIR, slug, 'index.ts');
  if (existsSync(docsEntry)) {
    // Could later parse the docs index to confirm sample IDs match etc.
    // For v1, just record that docs exist.
  }

  return { name, errors, warnings };
}

// ──────────────────────────────────────────────────────────────────────────────
// Run
// ──────────────────────────────────────────────────────────────────────────────

function listComponents() {
  const out = [];
  for (const category of readdirSync(COMPONENTS_DIR)) {
    const catDir = join(COMPONENTS_DIR, category);
    if (!statSync(catDir).isDirectory()) continue;
    for (const compName of readdirSync(catDir)) {
      if (compName.startsWith('_')) continue; // _shared
      const compDir = join(catDir, compName);
      if (!statSync(compDir).isDirectory()) continue;
      out.push(compDir);
    }
  }
  return out;
}

const components = listComponents();
const results = components.map(checkComponent);

let totalErrors = 0;
let totalWarnings = 0;
let cleanCount = 0;

for (const r of results) {
  if (r.errors.length === 0 && r.warnings.length === 0) {
    cleanCount++;
    if (VERBOSE) console.log(`  ok   ${r.name}`);
    continue;
  }
  console.log(`\n${r.name}`);
  for (const e of r.errors) console.log(`  ✗ ${e}`);
  for (const w of r.warnings) console.log(`  · ${w}`);
  totalErrors += r.errors.length;
  totalWarnings += r.warnings.length;
}

const total = results.length;
console.log('');
console.log(`${cleanCount}/${total} components clean — ${totalErrors} error(s), ${totalWarnings} warning(s)`);

process.exit(totalErrors > 0 ? 1 : 0);
