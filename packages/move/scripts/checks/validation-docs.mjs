// Validation-docs sync.
//
// The Validation page's catalog (packages/docs/src/pages/ai/checks.ts) must list
// exactly the `check:*` scripts in package.json, and every `check:*` must be wired
// into `check:all`. Add a check → document it here, or the build fails. This is
// the guardrail that keeps /ai/validation from going stale the way the old
// .report.md files did.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(here, '../../package.json'), 'utf8'));
const docsSrc = readFileSync(join(here, '../../../docs/src/pages/ai/checks.ts'), 'utf8');

// The real checks: every `check:*` script except the `check:all` aggregate.
const actual = new Set(
  Object.keys(pkg.scripts)
    .filter((k) => k.startsWith('check:') && k !== 'check:all')
    .map((k) => k.slice('check:'.length)),
);

// The documented checks: each CHECKS[].name in checks.ts (quoted `name:` lines —
// the interface's `name: string` has no quote, so it's skipped).
const documented = new Set(
  [...docsSrc.matchAll(/^\s*name:\s*'([^']+)'/gm)].map((m) => m[1]),
);

const allScript = pkg.scripts['check:all'] ?? '';
const errors = [];

for (const name of actual) {
  if (!documented.has(name)) {
    errors.push(`check:${name} exists but is not documented in packages/docs/src/pages/ai/checks.ts`);
  }
  if (!allScript.includes(`check:${name}`)) {
    errors.push(`check:${name} exists but is not wired into check:all`);
  }
}
for (const name of documented) {
  if (!actual.has(name)) {
    errors.push(`checks.ts documents "${name}" but there is no check:${name} script`);
  }
}

if (errors.length) {
  console.error('✗ validation-docs: docs and checks are out of sync');
  for (const e of errors) console.error(`  - ${e}`);
  console.error('  → reconcile packages/docs/src/pages/ai/checks.ts with the check:* scripts in package.json (and check:all)');
  process.exit(1);
}

console.log(`✓ validation-docs: ${documented.size} checks documented + wired into check:all`);
