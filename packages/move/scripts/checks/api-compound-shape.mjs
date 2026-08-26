#!/usr/bin/env node
/**
 * Generated-API shape guard — the documented API must be JSX that compiles.
 *
 * 27 of this library's components export a plain object, not a component:
 *
 *     export const Switch = { Root, Thumb };   // NOT callable
 *
 * so `<Switch checked />` is a type error. The generator emitted a flat `Props:`
 * block and an `Example: <Switch …>` for every one of them anyway, because it
 * read the spec and never asked what the source actually exports.
 *
 * That is worse than documenting nothing. `llms.txt` exists to be read by a
 * model, and a model writes what it can find — so the one artifact built to make
 * the API discoverable was teaching 27 components' worth of code that cannot
 * build. The consumer who reported it found the truth by reading `dist/**\/*.d.ts`.
 *
 * Asserts on the generated files, so it fails whether the generator regressed or
 * llms.txt was hand-edited.
 *
 * @enforces apiSurface-2
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE = join(HERE, '..', '..');
const COMPONENTS = join(MOVE, 'src', 'components');
const llms = readFileSync(join(MOVE, 'llms.txt'), 'utf8');

/** Components whose exported value is a bare object literal — not callable. */
const nonCallable = new Set();
let total = 0;
for (const cat of readdirSync(COMPONENTS)) {
  const catDir = join(COMPONENTS, cat);
  if (!statSync(catDir).isDirectory()) continue;
  for (const name of readdirSync(catDir)) {
    const src = join(catDir, name, `${name}.tsx`);
    if (!existsSync(src)) continue;
    total++;
    const m = new RegExp(`export const ${name}(?::[^=]+)? = (Object\\.assign|withMoveComponent|\\{)`).exec(
      readFileSync(src, 'utf8'),
    );
    if (m && m[1] === '{') nonCallable.add(name);
  }
}

const errors = [];
for (const name of nonCallable) {
  const start = llms.indexOf(`\n## ${name} (`);
  if (start === -1) continue;
  const end = llms.indexOf('\n## ', start + 1);
  const section = llms.slice(start, end === -1 ? undefined : end);

  if (/\nProps:\n/.test(section)) {
    errors.push(
      `${name}: llms.txt lists a flat \`Props:\` block, but \`${name}\` is an object ` +
        `({ Root, … }), so those props belong to \`${name}.Root\`.`,
    );
  }
  const ex = /\nExample: <([A-Za-z.]+)/.exec(section);
  if (ex && ex[1] === name) {
    errors.push(
      `${name}: llms.txt shows \`<${name}>\`, which does not typecheck. Enter through \`${name}.Root\`.`,
    );
  }
}

if (errors.length) {
  console.error(`\n✗ api-compound-shape: ${errors.length} documented API(s) that cannot compile.\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error(
    `\n  Run \`npm run gen:api\` and commit. A compound that exports a bare object is\n` +
      `  entered through .Root — documenting it flat teaches code that does not build.\n`,
  );
  process.exit(1);
}

console.log(
  `✓ api-compound-shape: ${nonCallable.size} object-shaped compound(s) of ${total} components ` +
    `documented through .Root, never flat.`,
);
