// Spec ingestion. Two input shapes:
//
//   1. A directory tree containing `*.spec.ts` files (typically a
//      checked-out commit or a `git worktree add`'d snapshot of a tag).
//
//   2. A JSON snapshot file produced by the `snapshot` subcommand. The
//      snapshot is a flat record of `{ [componentName]: spec }` and is
//      what you'd commit to `version-snapshots/<tag>.json` at release
//      time so future diffs don't depend on git archeology.

import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';

/** @typedef {Record<string, unknown>} SpecObject */
/** @typedef {Record<string, SpecObject>} SpecMap */

async function isFile(p) {
  try { return (await fs.stat(p)).isFile(); } catch { return false; }
}

async function isDir(p) {
  try { return (await fs.stat(p)).isDirectory(); } catch { return false; }
}

async function walkSpecFiles(root) {
  /** @type {string[]} */ const out = [];
  async function recurse(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue;
        await recurse(full);
      } else if (
        ent.isFile()
        && ent.name.endsWith('.spec.ts')
        && !ent.name.endsWith('.demo.spec.ts')
      ) {
        out.push(full);
      }
    }
  }
  await recurse(root);
  return out;
}

// Spec files are TS but contain no syntax that strip-types can't
// handle (no JSX, no decorators). We let Node's `--experimental-strip-types`
// (Node 22.6+) do the work via a dynamic import. For older Nodes the
// caller must pre-compile or use a snapshot JSON instead.
async function loadSpecFromTsFile(file) {
  const url = pathToFileURL(file).href;
  try {
    const mod = await import(url);
    if (!mod.spec || typeof mod.spec !== 'object') return null;
    return mod.spec;
  } catch (err) {
    console.warn(`[spec-diff] failed to load ${file}: ${err.message}`);
    return null;
  }
}

async function loadFromDirectory(dir) {
  const files = await walkSpecFiles(dir);
  /** @type {SpecMap} */ const out = {};
  for (const file of files) {
    const spec = await loadSpecFromTsFile(file);
    if (!spec) continue;
    const name = typeof spec.name === 'string' ? spec.name : path.basename(file, '.spec.ts');
    out[name] = spec;
  }
  return out;
}

async function loadFromJsonSnapshot(file) {
  const raw = await fs.readFile(file, 'utf8');
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error(`[spec-diff] ${file} is not a valid snapshot (expected object)`);
  }
  return parsed;
}

/**
 * Load a spec map from either a directory of `*.spec.ts` files or a
 * JSON snapshot. Decision is made by looking at the path: directory →
 * walk; file ending in `.json` → parse as snapshot.
 *
 * @param {string} target
 * @returns {Promise<SpecMap>}
 */
export async function loadSpecs(target) {
  if (await isFile(target)) {
    if (target.endsWith('.json')) return loadFromJsonSnapshot(target);
    throw new Error(`[spec-diff] ${target} is a file but not a .json snapshot`);
  }
  if (await isDir(target)) return loadFromDirectory(target);
  throw new Error(`[spec-diff] ${target} is neither a directory nor a file`);
}

/**
 * Serialise a spec map to JSON for storage as a release snapshot.
 * Functions are stripped so the output round-trips cleanly.
 *
 * @param {SpecMap} specs
 * @returns {string}
 */
export function serialiseSnapshot(specs) {
  return JSON.stringify(specs, (_, value) => {
    if (typeof value === 'function') return undefined;
    return value;
  }, 2);
}
