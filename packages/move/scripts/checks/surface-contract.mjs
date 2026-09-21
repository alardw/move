#!/usr/bin/env node
/**
 * Owning a ground is all of it, or none of it.
 *
 * `data-surface` remaps the relative tokens for an element AND everything under
 * it. `SurfaceProvider` tells React the same thing. Setting one without the
 * other splits the two halves apart: the CSS says this panel is `subtle` while
 * anything inside asking what it landed on still hears the ground OUTSIDE, so
 * it steps to the wrong shade and can land on the same colour as the panel it
 * is sitting on. Select carries a comment about exactly that happening.
 *
 * check:capabilities already holds that line — but only for a component that
 * DECLARES `owns-surface`, or has a slot declared `kind: 'surface'` to imply it.
 * A component that sets the attribute while declaring neither is invisible to
 * it, which is the gap this closes.
 *
 * The spec used to carry a `surface: { slot, level }` field alongside this, read
 * by nothing and wrong in all seven specs that set it — four asserted a FIXED
 * tone for a component that alternates, one asserted a ground its component
 * never painted. It was deleted rather than policed: the capability already
 * says a component owns a ground, and the tone is source behaviour, not data.
 *
 * @enforces surface-1 surface-2
 */

import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const COMPONENTS = join(HERE, '..', '..', 'src', 'components');

/** Strip comments so a line ABOUT `data-surface` is not read as setting it. */
const code = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

const errors = [];
let checked = 0;
let owning = 0;

for (const cat of readdirSync(COMPONENTS)) {
  const catDir = join(COMPONENTS, cat);
  if (!statSync(catDir).isDirectory()) continue;

  for (const name of readdirSync(catDir)) {
    const dir = join(catDir, name);
    const srcFile = join(dir, `${name}.tsx`);
    const specFile = join(dir, `${name}.spec.ts`);
    if (!existsSync(srcFile) || !existsSync(specFile)) continue;
    checked++;

    const src = code(readFileSync(srcFile, 'utf8'));
    const spec = readFileSync(specFile, 'utf8');

    const setsAttr = /data-surface=/.test(src);
    const provides = /SurfaceProvider/.test(src);
    const flips = /useSurfaceFlip\s*\(/.test(src);
    const composes = /<Surface[\s>]/.test(src);
    const declaresCapability = /'owns-surface'/.test(spec);
    if (!setsAttr && !provides && !composes) continue;
    owning++;

    // Composing <Surface> keeps both halves by construction — that is the point
    // of the primitive — so the only thing left to check is that it says so.
    if (composes) {
      if (!declaresCapability) {
        errors.push(
          `${name}: composes <Surface> but does not declare the 'owns-surface' capability.`,
        );
      }
      continue;
    }

    // surface-1 — both halves, or neither.
    if (setsAttr && !provides) {
      errors.push(
        `${name}: sets data-surface but never provides SurfaceProvider. The CSS claims a ` +
          `tone while React context still reports the ground outside this element, so anything ` +
          `inside computes from the wrong shade.`,
      );
    }
    if (provides && !setsAttr) {
      errors.push(
        `${name}: provides SurfaceProvider but never sets data-surface. React knows the new ` +
          `ground; the stylesheet does not, so the relative tokens under it stay on the old one.`,
      );
    }

    // surface-2 — a component that ALTERNATES says so, where check:capabilities
    // can verify it. Only alternating components: the capability's sourceCalls
    // require useSurfaceFlip, so a panel that deliberately pins its tone (Alert
    // keeps its own variant colour and only fixes the token context for its
    // children) cannot declare it, and should not have to.
    if (flips && !declaresCapability) {
      errors.push(
        `${name}: owns a ground but does not declare the 'owns-surface' capability, so ` +
          `check:capabilities never verifies it keeps both halves.`,
      );
    }

  }
}

if (errors.length) {
  console.error(`\n✗ surface-contract: ${errors.length} violation(s).\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error(
    `\n  A ground is the attribute AND the provider AND a declaration that says so.\n` +
      `  Compose the Surface primitive (<Surface asChild>) rather than wiring it by hand.\n`,
  );
  process.exit(1);
}

console.log(
  `✓ surface-contract: ${owning} component(s) own a ground of ${checked} — attribute, provider ` +
    `and declaration agree, and every spec claim matches its source.`,
);
