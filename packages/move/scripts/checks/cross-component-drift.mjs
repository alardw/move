#!/usr/bin/env node
/**
 * Cross-component drift check.
 *
 * Asserts that recurring prop names use the canonical `typeRef`
 * instead of a hand-rolled literal union. Each canonical-claimed
 * prop name maps to the set of canonical types it's allowed to
 * reference (a strict superset is allowed — e.g. `size` may use
 * `Size` or any of the four Size supersets).
 *
 *   size     → Size | SizeWithXS | SizeWithXL | SizeFull
 *               | TypographySize | DisplaySize
 *   gap      → Gap | GapWithXL2
 *   padding  → Gap | GapWithXL2
 *   color    → Color
 *   radius   → Radius
 *
 * What gets flagged:
 *
 *   - prop has no `typeRef` AND its inline `type` matches one of the
 *     canonical literal forms (drift candidate — should migrate)
 *   - prop has `typeRef` that's NOT in the allowed list for this
 *     prop name (real bug)
 *
 * What's exempt:
 *
 *   - Props with neither `typeRef` nor a canonical literal are
 *     treated as "intentionally local" (e.g. Loader.color is
 *     `'primary' | 'secondary' | 'current'`, a semantic union, not
 *     the palette). The script logs them under "intentional locals"
 *     for review but does not error.
 *
 * Exit: 0 = no migration candidates, 1 = at least one drift found.
 */

import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const HERE = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(HERE, '..', '..', 'src', 'components');

const VERBOSE = process.argv.includes('--verbose');
const STRICT = process.argv.includes('--strict');

// ─── What each canonical-claimed prop name accepts ──────────────────

const ALLOWED_TYPEREFS = {
  size:    ['Size', 'SizeWithXS', 'SizeWithXL', 'SizeFull', 'TypographySize', 'DisplaySize'],
  gap:     ['Gap', 'GapWithXL2'],
  padding: ['Gap', 'GapWithXL2'],
  color:   ['Color'],
  radius:  ['Radius'],
};

// Literal-union signatures that mean "this is the canonical thing,
// you should be using typeRef." Used to flag non-migrated specs.
// Sorted comparison so prop order doesn't matter.

const sortedSig = (parts) => parts.map((p) => `'${p}'`).sort().join(' | ');

const CANONICAL_LITERALS = {
  size: new Set([
    sortedSig(['sm', 'md', 'lg']),
    sortedSig(['xs', 'sm', 'md', 'lg']),
    sortedSig(['xs', 'sm', 'md', 'lg', 'xl']),
    sortedSig(['xs', 'sm', 'md', 'lg', 'xl', 'full']),
    sortedSig(['xs', 'sm', 'base', 'lg', 'xl']),
    sortedSig(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl']),
  ]),
  gap: new Set([
    sortedSig(['xs', 'sm', 'md', 'lg', 'xl', 'none']),
    sortedSig(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'none']),
  ]),
  padding: new Set([
    sortedSig(['xs', 'sm', 'md', 'lg', 'xl', 'none']),
    sortedSig(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'none']),
  ]),
  color: new Set([
    sortedSig(['gray', 'red', 'pink', 'grape', 'violet', 'indigo',
               'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange']),
  ]),
  radius: new Set([
    sortedSig(['none', 'sm', 'md', 'lg', 'full']),
    sortedSig(['none', 'sm', 'md', 'lg']),
  ]),
};

// ─── AST helpers ─────────────────────────────────────────────────────

function parse(file) {
  const text = readFileSync(file, 'utf8');
  return ts.createSourceFile(file, text, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);
}

function asString(node) {
  if (!node) return null;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return null;
}

function getProp(obj, name) {
  if (!obj || !ts.isObjectLiteralExpression(obj)) return null;
  for (const p of obj.properties) {
    if (
      ts.isPropertyAssignment(p) &&
      ((ts.isIdentifier(p.name) && p.name.text === name) ||
        (ts.isStringLiteral(p.name) && p.name.text === name))
    ) {
      return p.initializer;
    }
  }
  return null;
}

function loadSpec(file) {
  const sf = parse(file);
  let specObj = null;
  function walk(node) {
    if (specObj) return;
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.name.text === 'spec' && decl.initializer) {
          let init = decl.initializer;
          while (ts.isAsExpression(init) || ts.isParenthesizedExpression(init)) init = init.expression;
          if (ts.isObjectLiteralExpression(init)) specObj = init;
        }
      }
    }
    ts.forEachChild(node, walk);
  }
  walk(sf);
  return specObj;
}

/** Pull every prop entry across `spec.subComponents[].props` and `spec.props`. */
function collectAllProps(specObj) {
  const out = []; // { context, name, typeRef, typeLiteral }
  function pushFromArray(arr, contextLabel) {
    if (!arr || !ts.isArrayLiteralExpression(arr)) return;
    for (const el of arr.elements) {
      const name = asString(getProp(el, 'name'));
      if (!name) continue;
      const typeRef = asString(getProp(el, 'typeRef'));
      const typeLiteral = asString(getProp(el, 'type'));
      out.push({ context: contextLabel, name, typeRef, typeLiteral });
    }
  }

  // Root-level props
  pushFromArray(getProp(specObj, 'props'), 'Root');

  // subComponents[].props
  const subs = getProp(specObj, 'subComponents');
  if (subs && ts.isArrayLiteralExpression(subs)) {
    for (const sub of subs.elements) {
      const subName = asString(getProp(sub, 'name'));
      const subProps = getProp(sub, 'props');
      pushFromArray(subProps, subName ?? '?');
    }
  }
  return out;
}

/** Pull the ordered set of values out of a literal type string like
 *  `"'sm' | 'md' | 'lg'"`. Returns null if the type isn't a clean
 *  string-literal union. */
function extractLiteralSignature(typeLiteral) {
  if (!typeLiteral) return null;
  const parts = typeLiteral.split('|').map((p) => p.trim());
  const values = [];
  for (const p of parts) {
    const m = p.match(/^'([^']*)'$/) ?? p.match(/^"([^"]*)"$/);
    if (!m) return null;
    values.push(m[1]);
  }
  return values.map((v) => `'${v}'`).sort().join(' | ');
}

// ─── Walk components ─────────────────────────────────────────────────

function listComponents() {
  const out = [];
  for (const cat of readdirSync(COMPONENTS_DIR)) {
    const catDir = join(COMPONENTS_DIR, cat);
    if (!statSync(catDir).isDirectory()) continue;
    for (const compName of readdirSync(catDir)) {
      if (compName.startsWith('_')) continue;
      const compDir = join(catDir, compName);
      if (!statSync(compDir).isDirectory()) continue;
      const specFile = join(compDir, `${compName}.spec.ts`);
      if (existsSync(specFile)) out.push({ name: compName, specFile });
    }
  }
  return out;
}

// ─── Run ─────────────────────────────────────────────────────────────

const components = listComponents();

const errors = [];           // wrong typeRef value
const migrationCandidates = []; // canonical literal but no typeRef
const intentionalLocals = []; // canonical-claimed prop name with neither typeRef nor canonical literal

for (const c of components) {
  const specObj = loadSpec(c.specFile);
  if (!specObj) continue;
  const props = collectAllProps(specObj);

  for (const p of props) {
    const allowed = ALLOWED_TYPEREFS[p.name];
    if (!allowed) continue; // not a canonical-claimed name

    if (p.typeRef) {
      if (!allowed.includes(p.typeRef)) {
        errors.push({
          component: c.name,
          context: p.context,
          prop: p.name,
          got: p.typeRef,
          allowed,
        });
      }
      continue; // typeRef present + valid → done
    }

    // No typeRef. Check if the literal looks canonical → migration candidate.
    const sig = extractLiteralSignature(p.typeLiteral);
    const canonicalSet = CANONICAL_LITERALS[p.name];
    if (sig && canonicalSet.has(sig)) {
      // Allowlist for intentional strict subsets that don't want the
      // wider canonical accidentally enabled.
      if (p.name === 'radius' && c.name === 'VideoPlayer') {
        intentionalLocals.push({ component: c.name, context: p.context, prop: p.name, type: p.typeLiteral, note: 'no full radius' });
      } else {
        migrationCandidates.push({ component: c.name, context: p.context, prop: p.name, type: p.typeLiteral });
      }
    } else {
      intentionalLocals.push({ component: c.name, context: p.context, prop: p.name, type: p.typeLiteral });
    }
  }
}

// ─── Report ──────────────────────────────────────────────────────────

if (errors.length > 0) {
  console.log('\n✗ Wrong typeRef values:');
  for (const e of errors) {
    console.log(`  ${e.component}.${e.context}.${e.prop} uses typeRef="${e.got}"; expected one of: ${e.allowed.join(', ')}`);
  }
}

if (migrationCandidates.length > 0) {
  console.log('\n· Migration candidates (canonical literal, no typeRef):');
  for (const m of migrationCandidates) {
    console.log(`  ${m.component}.${m.context}.${m.prop} — type: ${m.type}`);
  }
}

if (VERBOSE && intentionalLocals.length > 0) {
  console.log('\n  Intentional locals (canonical name, non-canonical literal):');
  for (const i of intentionalLocals) {
    console.log(`    ${i.component}.${i.context}.${i.prop} — type: ${i.type}`);
  }
}

console.log('');
console.log(`${errors.length} error(s), ${migrationCandidates.length} migration candidate(s), ${intentionalLocals.length} intentional local(s).`);

const fail = errors.length > 0 || (STRICT && migrationCandidates.length > 0);
process.exit(fail ? 1 : 0);
