#!/usr/bin/env node

/**
 * Stamps migrations/unreleased.json → migrations/{version}.json
 * Runs during `npm run pack` after the version bump.
 *
 * Workflow:
 *   1. As you work, run /generate-migrations — writes migrations/unreleased.json
 *   2. Run `npm run pack` — version bumps, this script renames the file, then packs
 */

import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf-8'));
const version = pkg.version;

const unreleasedPath = resolve(root, 'migrations', 'unreleased.json');
const versionPath = resolve(root, 'migrations', `${version}.json`);

if (!existsSync(unreleasedPath)) {
  console.error(`\n✗  migrations/unreleased.json not found.`);
  console.error(`   Run /generate-migrations before packing.\n`);
  process.exit(1);
}

const entry = JSON.parse(readFileSync(unreleasedPath, 'utf-8'));
entry.version = version;
entry.date = new Date().toISOString().slice(0, 10);

writeFileSync(versionPath, JSON.stringify(entry, null, 2) + '\n');
unlinkSync(unreleasedPath);

const count = entry.changes?.length ?? 0;
console.log(`✓  migrations/unreleased.json → migrations/${version}.json (${count} change(s))`);
