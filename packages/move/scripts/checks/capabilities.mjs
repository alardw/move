#!/usr/bin/env node
/**
 * Capability contracts, both directions.
 *
 * A capability is one contract, written once, targeting slot KINDS rather than
 * slot names — so it covers every component whatever each calls its parts. The
 * definitions live in src/capabilities.ts as data; this reads them.
 *
 * Two directions, and the second is the one that earns the check:
 *
 *   declared → source   a component claiming a capability must satisfy it.
 *
 *   source → declared   a component whose slots exhibit a capability must
 *                       declare it. Every defect this repo found by eye was
 *                       something nobody had written down: sixteen scroll
 *                       containers with no focus indicator, five popup reveals
 *                       still selecting by role, two components setting
 *                       data-surface with no provider. A declaration-only check
 *                       would have said nothing about any of them, because
 *                       nothing was declared.
 *
 * This replaces the three bespoke family-* scripts, which each hardcoded their
 * own membership predicate and sat outside the rules registry entirely,
 * enforcing no registered rule.
 *
 * @enforces spec-10
 * @instead declare the capability in the spec and satisfy its contract, or
 *   remove the source that exhibits it. A capability that cannot be expressed
 *   here keeps a bespoke check — that should be the exception, not the design.
 *
 * Exit: 0 = clean, 1 = at least one unmet or undeclared contract.
 */
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const COMPONENTS = join(MOVE_ROOT, 'src', 'components');

/** Parse the capability definitions out of the TS source — no build step. */
function loadCapabilities() {
  const src = readFileSync(join(MOVE_ROOT, 'src', 'capabilities.ts'), 'utf8');
  const body = src.slice(src.indexOf('export const CAPABILITIES'));
  const caps = {};
  for (const m of body.matchAll(/'([a-z-]+)':\s*\{([\s\S]*?)\n  \},/g)) {
    const [, name, block] = m;
    const list = (key) => {
      const l = new RegExp(`${key}:\\s*\\[([^\\]]*)\\]`).exec(block);
      return l ? [...l[1].matchAll(/'([^']+)'/g)].map((x) => x[1]) : [];
    };
    const one = (key) => {
      const o = new RegExp(`${key}:\\s*'([^']+)'`).exec(block);
      return o ? o[1] : null;
    };
    caps[name] = {
      targets: list('targets'),
      sourceCalls: list('sourceCalls'),
      cssTokens: list('cssTokens'),
      attribute: one('attribute'),
      impliedByKind: /impliedByKind:\s*true/.test(block),
      cssDeclaration: one('cssDeclaration'),
      cssAlternative: one('cssAlternative'),
    };
  }
  return caps;
}

const CAPS = loadCapabilities();

function specFiles(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) out.push(...specFiles(full));
    else if (e.endsWith('.spec.ts')) out.push(full);
  }
  return out;
}

/** Slot name → kind, from the spec's top-level slots block. */
function slotKinds(spec) {
  const block = /\n  slots:\s*\[([\s\S]*?)\n  \],/.exec(spec);
  if (!block) return new Map();
  const out = new Map();
  for (const m of block[1].matchAll(
    /name:\s*'([^']+)',\s*element:\s*'[^']*',\s*kind:\s*'(\w+)'/g,
  )) {
    out.set(m[1], m[2]);
  }
  return out;
}

const problems = [];

for (const specPath of specFiles(COMPONENTS)) {
  const comp = basename(specPath, '.spec.ts');
  const dir = dirname(specPath);
  const cssPath = join(dir, `${comp}.module.css`);
  const tsxPath = join(dir, `${comp}.tsx`);
  if (!existsSync(cssPath) || !existsSync(tsxPath)) continue;

  const spec = readFileSync(specPath, 'utf8');
  const css = readFileSync(cssPath, 'utf8');
  const tsx = readFileSync(tsxPath, 'utf8');
  const rel = relative(MOVE_ROOT, specPath);

  const declared = new Set(
    (/\n  capabilities:\s*\[([^\]]*)\]/.exec(spec)?.[1] ?? '')
      .match(/'[^']+'/g)
      ?.map((s) => s.slice(1, -1)) ?? [],
  );
  const kinds = slotKinds(spec);
  const has = (kind) => [...kinds.values()].includes(kind);

  for (const [name, cap] of Object.entries(CAPS)) {
    const targeted = cap.targets.some(has);

    // source → declared: the slots are there, the declaration is not. Only
    // where the kind IMPLIES the capability — otherwise every list in the
    // library would be told it is not a table.
    if (targeted && cap.impliedByKind && !declared.has(name)) {
      const which = cap.targets.filter(has).join(', ');
      problems.push({
        rel,
        msg: `has a '${which}' slot but does not declare '${name}'`,
      });
      continue;
    }
    if (!declared.has(name)) continue;

    // declared → source: the claim must hold.
    if (!targeted) {
      problems.push({ rel, msg: `declares '${name}' but has no ${cap.targets.join('/')} slot` });
    }
    for (const call of cap.sourceCalls) {
      if (!tsx.includes(call)) {
        problems.push({ rel, msg: `declares '${name}' but never calls ${call}` });
      }
    }
    if (cap.attribute && !tsx.includes(cap.attribute)) {
      problems.push({ rel, msg: `declares '${name}' but never sets ${cap.attribute}` });
    }
    if (cap.cssDeclaration) {
      const slots = [...kinds].filter(([, k]) => cap.targets.includes(k)).map(([n]) => n);
      for (const slot of slots) {
        const rule = new RegExp(`\\.${slot}[^{,]*${cap.cssDeclaration}`);
        const alt = cap.cssAlternative && new RegExp(cap.cssAlternative);
        if (!rule.test(css) && !(alt && alt.test(css))) {
          problems.push({
            rel,
            msg: `declares '${name}' but .${slot} has no ${cap.cssDeclaration} rule`,
          });
        }
      }
    }
  }
}

if (problems.length === 0) {
  console.log(
    `✓ capabilities: ${Object.keys(CAPS).length} contract(s) hold, and nothing exhibits one undeclared.`,
  );
  process.exit(0);
}

console.log(`✗ capabilities: ${problems.length} unmet or undeclared contract(s).`);
for (const p of problems) console.log(`\n  [spec-10] ${p.rel} — ${p.msg}`);
process.exit(1);
