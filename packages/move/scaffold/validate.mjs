/**
 * Creation-spec validator — the VERIFY half of the creation contract.
 *
 * Given a project directory, checks it against `creation-spec.mjs`: the required
 * files exist, each carries its declared invariants, package.json resolves to the
 * exact dependency + script set the options imply, and move.config.json points the
 * gates at the composites root. Pure node fs — no build step — so it's shared by:
 *   • `create-move` (self-checks the project it just generated), and
 *   • `move check creation` (validates any project on disk).
 *
 * Options drive the expected deps. When they aren't supplied (the `move check`
 * path, where all we have is a directory), router + icons are inferred from the
 * installed dependencies — the only two options that change the dependency set.
 * shell + theme affect neither deps nor the required-file set, so they don't need
 * to be recovered.
 *
 * The one deliberate exception: the `move` dependency's version string is not
 * asserted. A published app pins `latest`; a monorepo/dogfood app points at a
 * local `file:`/workspace build. Both are valid — only its presence is required.
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  DEFAULT_OPTIONS,
  MOVE_CONFIG,
  REQUIRED_SCRIPTS,
  requiredFiles,
  resolveDeps,
} from './creation-spec.mjs';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));

/**
 * Recover the option set that determines a project's shape from what's on disk.
 * router + icons come from installed deps (they change the dependency set); ci
 * comes from whether the GitHub workflow is present (it changes the required-file
 * set). shell + theme affect neither, so they stay at defaults.
 * @param {Record<string, string>} deps
 * @param {string} dir
 */
function inferOptions(deps, dir) {
  const has = (name) => Object.prototype.hasOwnProperty.call(deps, name);
  const router = has('react-router-dom')
    ? 'react-router'
    : has('@tanstack/react-router')
      ? 'tanstack'
      : 'none';
  const icons = has('lucide-react') ? 'lucide' : 'none';
  const ci = existsSync(join(dir, '.github', 'workflows', 'checks.yml')) ? 'github' : 'none';
  return { ...DEFAULT_OPTIONS, router, icons, ci };
}

/**
 * Validate a scaffolded project against the creation spec.
 * @param {string} dir Absolute path to the project root.
 * @param {import('./creation-spec.mjs').CreationOptions} [options] Known options
 *   (the generate path). Omit to infer from package.json (the check path).
 * @returns {{ ok: boolean, options: object, errors: string[], checked: number }}
 */
export function validateProject(dir, options) {
  const errors = [];
  let checked = 0;

  // package.json is the anchor — read it first so we can infer options if needed.
  const pkgPath = join(dir, 'package.json');
  let pkg = null;
  if (!existsSync(pkgPath)) {
    errors.push('package.json — missing');
  } else {
    try {
      pkg = readJson(pkgPath);
    } catch (e) {
      errors.push(`package.json — invalid JSON: ${e.message}`);
    }
  }

  const opts = options ?? (pkg ? inferOptions({ ...pkg.dependencies, ...pkg.devDependencies }, dir) : DEFAULT_OPTIONS);

  // --- File manifest: existence + per-file invariants --------------------------
  for (const file of requiredFiles(opts)) {
    checked++;
    const full = join(dir, file.path);
    if (!existsSync(full)) {
      errors.push(`${file.path} — missing (${file.role})`);
      continue;
    }
    if (file.dir) {
      if (!statSync(full).isDirectory()) errors.push(`${file.path} — expected a directory`);
      continue;
    }
    if (file.mustContain?.length) {
      const body = readFileSync(full, 'utf8');
      for (const needle of file.mustContain) {
        if (!body.includes(needle)) errors.push(`${file.path} — must contain ${JSON.stringify(needle)}`);
      }
    }
  }

  // --- package.json: deps, devDeps, scripts ------------------------------------
  if (pkg) {
    const { deps, devDeps } = resolveDeps(opts);
    const actualDeps = pkg.dependencies ?? {};
    const actualDev = pkg.devDependencies ?? {};

    for (const [name, version] of Object.entries(deps)) {
      if (!(name in actualDeps)) errors.push(`package.json — missing dependency ${name}`);
      // `move` version varies by install context (see file header); only assert others.
      else if (name !== 'move' && actualDeps[name] !== version)
        errors.push(`package.json — ${name}@${actualDeps[name]} (expected ${version})`);
    }
    for (const [name, version] of Object.entries(devDeps)) {
      if (!(name in actualDev)) errors.push(`package.json — missing devDependency ${name}`);
      else if (actualDev[name] !== version)
        errors.push(`package.json — ${name}@${actualDev[name]} (expected ${version})`);
    }

    const scripts = pkg.scripts ?? {};
    for (const [name, cmd] of Object.entries(REQUIRED_SCRIPTS)) {
      if (scripts[name] !== cmd)
        errors.push(`package.json — script ${JSON.stringify(name)} is ${JSON.stringify(scripts[name] ?? '(missing)')} (expected ${JSON.stringify(cmd)})`);
    }
  }

  // --- move.config.json: gates point at the composites root --------------------
  const cfgPath = join(dir, 'move.config.json');
  if (existsSync(cfgPath)) {
    try {
      const cfg = readJson(cfgPath);
      const composites = cfg.check?.composites ?? cfg.composites;
      if (composites !== MOVE_CONFIG.check.composites)
        errors.push(`move.config.json — check.composites is ${JSON.stringify(composites)} (expected ${JSON.stringify(MOVE_CONFIG.check.composites)})`);
    } catch (e) {
      errors.push(`move.config.json — invalid JSON: ${e.message}`);
    }
  }

  return { ok: errors.length === 0, options: opts, errors, checked };
}
