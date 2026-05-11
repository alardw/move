#!/usr/bin/env node
// Spec-diff CLI.
//
// Usage:
//   # Diff two directories or snapshots:
//   node scripts/spec-diff/cli.mjs diff \
//       --from version-snapshots/v2.3.0.json \
//       --to packages/move/src/components
//
//   # Snapshot the current specs at release time:
//   node scripts/spec-diff/cli.mjs snapshot \
//       --from packages/move/src/components \
//       --out version-snapshots/v2.4.0.json
//
// JSON to stdout by default; pass --out to write to a file. Exit code
// is non-zero only on usage errors, not on findings.

import { promises as fs } from 'node:fs';
import { loadSpecs, serialiseSnapshot } from './load.mjs';
import { normaliseAll } from './normalise.mjs';
import { diffSpecs } from './diff.mjs';

function parseArgs(argv) {
  const command = argv[0];
  if (command !== 'diff' && command !== 'snapshot') {
    throw new Error('Usage: spec-diff <diff|snapshot> [--from PATH] [--to PATH] [--out FILE]');
  }
  const result = { command };
  for (let i = 1; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--from') result.from = argv[++i];
    else if (arg === '--to') result.to = argv[++i];
    else if (arg === '--out') result.out = argv[++i];
  }
  return result;
}

async function writeOutput(out, payload) {
  if (!out) {
    process.stdout.write(payload + '\n');
    return;
  }
  await fs.writeFile(out, payload + '\n', 'utf8');
}

async function runDiff(args) {
  if (!args.from || !args.to) {
    throw new Error('spec-diff diff requires both --from and --to');
  }
  const [oldSpecs, newSpecs] = await Promise.all([
    loadSpecs(args.from),
    loadSpecs(args.to),
  ]);
  const oldNorm = normaliseAll(oldSpecs);
  const newNorm = normaliseAll(newSpecs);
  const result = diffSpecs(oldNorm, newNorm);
  await writeOutput(args.out, JSON.stringify(result, null, 2));
}

async function runSnapshot(args) {
  if (!args.from) throw new Error('spec-diff snapshot requires --from');
  const specs = await loadSpecs(args.from);
  await writeOutput(args.out, serialiseSnapshot(specs));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.command === 'diff') await runDiff(args);
  else if (args.command === 'snapshot') await runSnapshot(args);
}

main().catch((err) => {
  process.stderr.write(`[spec-diff] ${err.message}\n`);
  process.exitCode = 1;
});
