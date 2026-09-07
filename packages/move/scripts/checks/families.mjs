#!/usr/bin/env node
/**
 * Family contracts.
 *
 * A family is a named bundle of promises, and this asserts every member keeps
 * all of them. The definitions live in src/families.ts as data; this reads them,
 * so the check knows nothing about any particular family.
 *
 * Families compose: `includes` names a family whose contract also applies, and
 * the chain is walked before anything is asserted. That is why the shared core
 * of the two popup families is written once — a core written twice drifts, which
 * is what happened to the old `families.state` axis, restated in 71 specs until
 * 11 of them disagreed with the `controlled` field they were restating.
 *
 * Replaces family-popup, family-modal and family-disclosure: three scripts that
 * each hardcoded their own membership predicate and their own assertions.
 *
 * @enforces spec-11
 * @instead keep the family's contract, or leave the family. A component that
 *   cannot keep it is telling you it is a different kind of thing.
 *
 * Exit: 0 = clean, 1 = at least one member breaking its family's contract.
 */
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const COMPONENTS = join(MOVE_ROOT, 'src', 'components');

/** Parse the family definitions out of the TS source — no build step. */
function loadFamilies() {
  const src = readFileSync(join(MOVE_ROOT, 'src', 'families.ts'), 'utf8');
  const body = src.slice(src.indexOf('export const FAMILIES'));
  const out = {};
  for (const m of body.matchAll(/\n  '([a-z-]+)': \{\n([\s\S]*?)\n  \},/g)) {
    const [, name, block] = m;
    const list = (key) => {
      const l = new RegExp(`${key}: \\[([^\\]]*)\\]`).exec(block);
      return l ? [...l[1].matchAll(/'([^']+)'/g)].map((x) => x[1]) : null;
    };
    const fieldsBlock = /fields: \{([^}]*)\}/.exec(block);
    const fields = {};
    if (fieldsBlock) {
      for (const f of fieldsBlock[1].matchAll(/(\w+): '([^']+)'/g)) fields[f[1]] = f[2];
    }
    out[name] = {
      includes: (/includes: '([a-z-]+)'/.exec(block) ?? [])[1] ?? null,
      capabilities: list('capabilities'),
      choreography: list('choreography'),
      ariaPattern: list('ariaPattern'),
      slots: list('slots'),
      triggers: list('triggers'),
      composes: list('composes'),
      propTriads: list('propTriads'),
      behaviorBlocks: list('behaviorBlocks'),
      behaviorFlags: list('behaviorFlags'),
      subComponents: list('subComponents'),
      fields: Object.keys(fields).length ? fields : null,
      why: (/why:\s*\n?\s*'([^']*)'/.exec(block) ?? [])[1] ?? '',
    };
  }
  return out;
}

/** Flatten a family with everything it includes, nearest wins on scalars. */
function resolve(families, name, seen = new Set()) {
  const f = families[name];
  if (!f || seen.has(name)) return null;
  seen.add(name);
  const base = f.includes ? resolve(families, f.includes, seen) : null;
  if (!base) return f;
  return {
    ...f,
    capabilities: [...(base.capabilities ?? []), ...(f.capabilities ?? [])],
    slots: [...(base.slots ?? []), ...(f.slots ?? [])],
    triggers: [...(base.triggers ?? []), ...(f.triggers ?? [])],
    composes: [...(base.composes ?? []), ...(f.composes ?? [])],
    propTriads: [...(base.propTriads ?? []), ...(f.propTriads ?? [])],
    behaviorBlocks: [...(base.behaviorBlocks ?? []), ...(f.behaviorBlocks ?? [])],
    behaviorFlags: [...(base.behaviorFlags ?? []), ...(f.behaviorFlags ?? [])],
    subComponents: [...(base.subComponents ?? []), ...(f.subComponents ?? [])],
    fields: { ...(base.fields ?? {}), ...(f.fields ?? {}) },
    // A narrowing family may only narrow: its permitted set has to be a subset.
    choreography: f.choreography ?? base.choreography,
    ariaPattern: f.ariaPattern ?? base.ariaPattern,
  };
}

function specFiles(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) specFiles(full, out);
    else if (e.endsWith('.spec.ts')) out.push(full);
  }
  return out;
}

const list = (src, field) => {
  const m = new RegExp(`^  ${field}: \\[([^\\]]*)\\]`, 'm').exec(src);
  return m ? [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]) : [];
};
const scalar = (src, field) => {
  const m = new RegExp(`^  ${field}: '?([\\w-]+)'?`, 'm').exec(src);
  return m ? m[1] : null;
};

const FAMILIES = loadFamilies();
const problems = [];
const pending = new Set();
const members = Object.fromEntries(Object.keys(FAMILIES).map((f) => [f, []]));

for (const specPath of specFiles(COMPONENTS)) {
  const src = readFileSync(specPath, 'utf8');
  const name = basename(specPath, '.spec.ts');
  const rel = relative(MOVE_ROOT, specPath);
  for (const family of list(src, 'families')) {
    if (!FAMILIES[family]) {
      // Not yet migrated to the registry. The old family-* checks still cover
      // these; this becomes an error once every family has a contract here.
      pending.add(family);
      continue;
    }
    members[family].push(name);
    const c = resolve(FAMILIES, family);
    const fail = (msg) => problems.push({ rel, name, msg: `[${family}] ${msg}`, why: c.why });

    for (const cap of c.capabilities ?? []) {
      if (!list(src, 'capabilities').includes(cap)) fail(`must declare capability '${cap}'`);
    }
    for (const slot of c.slots ?? []) {
      if (!new RegExp(`name: '${slot}'`).test(src)) fail(`must own a '${slot}' slot`);
    }
    for (const trig of c.triggers ?? []) {
      if (!src.includes(`trigger: '${trig}'`)) fail(`must animate '${trig}'`);
    }
    for (const comp of c.composes ?? []) {
      const tsx = specPath.replace(/\.spec\.ts$/, '.tsx');
      const source = existsSync(tsx) ? readFileSync(tsx, 'utf8') : '';
      if (!source.includes(comp)) fail(`must build from ${comp}`);
    }
    // Two exemptions, both structural rather than convenient.
    //
    // A `pointer-panel` mirrors a field that is already fully keyboard-operable
    // — nothing triggers it and focus never enters it, so it has no trigger to
    // expose and no open state to control. TimeField is the case.
    //
    // A component that is not compound exports no sub-components to require.
    const pointerPanel = /mechanism: 'pointer-panel'/.test(src);
    const compound = /^  compound: true/m.test(src);

    for (const base of pointerPanel ? [] : (c.propTriads ?? [])) {
      const cap = base[0].toUpperCase() + base.slice(1);
      // The handler's NAME is not the family's business: a native input reports
      // through `onChange`, a custom control through `onValueChange`, and both
      // are complete triads. What the family requires is that all three parts
      // exist — so where the spec declares them in `controlledProps`, those
      // names are used, and only otherwise is the convention assumed.
      const declared = new RegExp(`onChangeProp: '(\\w+)'`).exec(src);
      const handler = base === 'value' && declared ? declared[1] : `on${cap}Change`;
      const missing = [base, `default${cap}`, handler].filter(
        (prop) => !new RegExp(`name: '${prop}'`).test(src),
      );
      if (missing.length) fail(`must expose a complete ${base} triad — missing ${missing.join(', ')}`);
    }
    for (const block of c.behaviorBlocks ?? []) {
      if (!new RegExp(`\\n    ${block}: \\{`).test(src)) fail(`must declare a behavior.${block} block`);
    }
    for (const flag of c.behaviorFlags ?? []) {
      const where = (c.behaviorBlocks ?? ['behavior'])[0];
      if (!new RegExp(`${flag}: (true|false)`).test(src)) fail(`must state behavior.${where}.${flag}`);
    }
    for (const sub of compound && !pointerPanel ? (c.subComponents ?? []) : []) {
      if (!new RegExp(`name: '${sub}'`).test(src)) fail(`must export a ${sub} sub-component`);
    }
    for (const [field, want] of Object.entries(c.fields ?? {})) {
      const got = scalar(src, field);
      if (got !== want) fail(`${field} should be '${want}', is '${got ?? 'unset'}'`);
    }
    for (const [field, allowed] of [
      ['choreographies', c.choreography],
      ['ariaPattern', c.ariaPattern],
    ]) {
      if (!allowed) continue;
      for (const v of list(src, field)) {
        if (!allowed.includes(v)) fail(`${field} '${v}' is not one of ${allowed.join(', ')}`);
      }
    }
  }
}

// ── The registry's own references ────────────────────────────────────────────
//
// A family naming a capability or choreography that does not exist still fails,
// but it fails on its MEMBERS — every one of them reported for not declaring
// something undeclarable. The fault is in the family, and the message should say
// so rather than sending someone to edit innocent specs.
const CAPABILITY_NAMES = new Set(
  [
    ...readFileSync(join(MOVE_ROOT, 'src', 'capabilities.ts'), 'utf8')
      .slice(readFileSync(join(MOVE_ROOT, 'src', 'capabilities.ts'), 'utf8').indexOf('export const CAPABILITIES'))
      .matchAll(/\n  '([a-z-]+)': \{/g),
  ].map((m) => m[1]),
);
const CHOREOGRAPHIES = new Set(
  [
    ...(/export const CHOREOGRAPHIES = \[([\s\S]*?)\]/.exec(
      readFileSync(join(MOVE_ROOT, 'src', 'spec-type.ts'), 'utf8'),
    )?.[1] ?? '').matchAll(/'(\w+)'/g),
  ].map((m) => m[1]),
);

for (const [family, def] of Object.entries(FAMILIES)) {
  for (const cap of def.capabilities ?? []) {
    if (!CAPABILITY_NAMES.has(cap)) {
      problems.push({
        rel: 'src/families.ts',
        name: family,
        msg: `bundles '${cap}', which is not a capability`,
        why: '',
      });
    }
  }
  for (const ch of def.choreography ?? []) {
    if (!CHOREOGRAPHIES.has(ch)) {
      problems.push({
        rel: 'src/families.ts',
        name: family,
        msg: `permits choreography '${ch}', which is not one`,
        why: '',
      });
    }
  }
  if (def.includes && !FAMILIES[def.includes]) {
    problems.push({
      rel: 'src/families.ts',
      name: family,
      msg: `includes '${def.includes}', which is not a family`,
      why: '',
    });
  }
}

// A family needs more than one member — otherwise it is a component.
//
// Counted through composition: an abstract family like `anchored-popup` has no
// direct members, because components join the leaf that includes it. Its members
// are the members of everything that includes it.
const reach = (family) => {
  const own = [...members[family]];
  for (const [name, def] of Object.entries(FAMILIES)) {
    if (def.includes === family) own.push(...reach(name));
  }
  return own;
};

for (const family of Object.keys(members)) {
  const ms = reach(family);
  if (ms.length < 2) {
    problems.push({
      rel: 'src/families.ts',
      name: family,
      msg: `has ${ms.length} member(s) — a family needs at least two`,
      why: '',
    });
  }
}

const note = pending.size
  ? `\n  ${pending.size} family name(s) not yet in the registry: ${[...pending].sort().join(', ')}`
  : '';

if (problems.length === 0) {
  const total = Object.values(members).reduce((n, m) => n + m.length, 0);
  console.log(
    `✓ families: ${Object.keys(FAMILIES).length} contract(s), ${total} membership(s) — all kept.${note}`,
  );
  process.exit(0);
}

// Registry faults first. A family naming something that does not exist also
// fails on every one of its members, and those are downstream noise — five
// findings where the cause is one line.
const ordered = [
  ...problems.filter((p) => p.rel === 'src/families.ts'),
  ...problems.filter((p) => p.rel !== 'src/families.ts'),
];

console.log(`✗ families: ${problems.length} broken contract(s).`);
for (const p of ordered) {
  console.log(`\n  [spec-11] ${p.name} — ${p.msg}`);
  if (p.why) console.log(`    ${p.why}`);
}
process.exit(1);
