/**
 * Shared helpers for the per-family check scripts. Lets each script
 * stay short by reusing the spec-loading + AST utilities. Mirrors the
 * helpers in `spec-drift.mjs` so the family checks don't duplicate
 * them.
 */

import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';

export function parse(file) {
  const text = readFileSync(file, 'utf8');
  return ts.createSourceFile(file, text, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);
}

export function getProp(obj, name) {
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

export function asString(node) {
  if (!node) return null;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return null;
}

export function asBool(node) {
  if (!node) return null;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  return null;
}

export function asArray(node) {
  if (!node || !ts.isArrayLiteralExpression(node)) return null;
  return node.elements.map(asString).filter((x) => x != null);
}

export function loadSpec(file) {
  const sf = parse(file);
  let specObj = null;
  function walk(node) {
    if (specObj) return;
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.name.text === 'spec' && decl.initializer) {
          let init = decl.initializer;
          while (ts.isAsExpression(init) || ts.isParenthesizedExpression(init) || ts.isSatisfiesExpression(init)) init = init.expression;
          if (ts.isObjectLiteralExpression(init)) specObj = init;
        }
      }
    }
    ts.forEachChild(node, walk);
  }
  walk(sf);
  return specObj;
}

export function listComponents(componentsDir) {
  const out = [];
  for (const cat of readdirSync(componentsDir)) {
    const catDir = join(componentsDir, cat);
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

/** Convenience: check whether a spec lists `family` on the given axis. */
export function isInFamily(specObj, axis, family) {
  const families = getProp(specObj, 'families');
  const arr = asArray(getProp(families, axis)) ?? [];
  return arr.includes(family);
}

/** Print a one-line header + summary, then exit 0/1. Lets each
 *  family script avoid hand-rolling the same epilogue. */
export function exitWithSummary({ familyName, members, totalErrors, weakFlags }) {
  console.log('');
  if (totalErrors > 0) {
    console.log(`✗ ${totalErrors} error(s) across ${members} ${familyName} components.`);
  } else {
    console.log(`✓ ${members} ${familyName} components declare a complete contract.`);
  }
  if (weakFlags > 0) {
    console.log(`· ${weakFlags} flag(s) declared as false — known limitations or unfixed bugs.`);
  }
  process.exit(totalErrors > 0 ? 1 : 0);
}
