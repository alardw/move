#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, writeFileSync, chmodSync, readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, '..');
const command = process.argv[2];

if (!command || command === '--help' || command === '-h') {
  console.log(`
  move <command>

  Commands:
    skills    Copy Move AI skills into your project
    recipes   Copy Move recipe examples into your project
    check     Validate your components & recipes (strict props, recipe purity, …)
    hooks     Install git hooks that run those checks on commit and push
`);
  process.exit(0);
}

if (command === 'skills') {
  const sourceDir = join(packageRoot, 'skills');

  if (!existsSync(sourceDir)) {
    console.error('  Could not find Move skills. Is the move package installed correctly?');
    process.exit(1);
  }

  // Claude Code reads .claude/skills only; Codex reads .agents/skills only —
  // neither reads the other, so write real (flat) skill folders to both.
  // Skip the top-level README; everything else (skill folders + references/)
  // is copied so the skills' relative `references/...` paths resolve.
  const targets = [
    join(process.cwd(), '.agents', 'skills'),
    join(process.cwd(), '.claude', 'skills'),
  ];

  const skipReadme = (src) => src !== join(sourceDir, 'README.md');

  for (const target of targets) {
    mkdirSync(target, { recursive: true });
    cpSync(sourceDir, target, { recursive: true, filter: skipReadme });
  }

  console.log(`
  Move skills installed:
    .agents/skills/   (Codex)
    .claude/skills/   (Claude Code)

  Both get the full set — the spec-driven pipelines (component-*, design-pattern-*,
  composite-*, api-*, adapter-*), the app builders (app-*), and hook-create. Your
  AI assistant can now drive Move's spec-driven workflow and scaffold apps, pages,
  composites, data sources, and hooks.
`);
  process.exit(0);
}

if (command === 'recipes') {
  const recipesRoot = join(packageRoot, 'recipes');

  if (!existsSync(recipesRoot)) {
    console.error('  Could not find Move recipes. Is the move package installed correctly?');
    process.exit(1);
  }

  const pattern = process.argv[3];
  if (!pattern) {
    console.log(`
  Usage: move recipes <group>/<Name> | <group>

  Examples:
    move recipes authentication/SignIn   Copy one recipe (+ its .spec.ts)
    move recipes authentication          Copy every recipe in a group

  Groups: authentication, data, navigation, page

  Recipes are copied to src/recipes/ in your project. Each recipe's .spec.ts
  travels with it so an AI can re-derive or upgrade it later. Once copied it's
  your own component — edit it freely.
`);
    process.exit(0);
  }

  const source = join(recipesRoot, pattern);

  let resolvedSource;
  if (existsSync(source))
    resolvedSource = source; // group dir, or exact path
  else if (existsSync(source + '.tsx'))
    resolvedSource = source + '.tsx'; // single recipe by name
  else {
    console.error(`  Recipe not found: ${pattern}`);
    process.exit(1);
  }

  const target = join(process.cwd(), 'src', 'recipes', pattern);

  if (resolvedSource.endsWith('.tsx')) {
    // Single recipe — copy the component AND its spec breadcrumb.
    mkdirSync(dirname(target), { recursive: true });
    cpSync(resolvedSource, target + '.tsx');
    const specSrc = resolvedSource.replace(/\.tsx$/, '.spec.ts');
    const hasSpec = existsSync(specSrc);
    if (hasSpec) cpSync(specSrc, target + '.spec.ts');
    console.log(`\n  Copied to src/recipes/${pattern}.tsx${hasSpec ? ' (+ .spec.ts)' : ''}\n`);
  } else {
    // Group directory — recipes + their specs (registry.ts/spec-type.ts live at
    // the recipes root, not inside a group, so they aren't dragged along).
    mkdirSync(target, { recursive: true });
    cpSync(resolvedSource, target, { recursive: true });
    console.log(`\n  Copied to src/recipes/${pattern}/\n`);
  }

  process.exit(0);
}

if (command === 'hooks') {
  // Files, not a framework. The hooks are POSIX sh copied into the project and
  // committed with it, so the team shares them, anyone can read what runs, and
  // editing one is editing a file rather than learning a config format. Move
  // adds no hook-runner dependency to a consumer's project for the same reason
  // it ships skills as files: the thing you install should be inspectable.
  //
  // The logic lives in `move check`, and these only call it — so a project
  // already on husky, lefthook or simple-git-hooks wires the SAME command into
  // whatever it already has, and Move never competes with the runner.
  const args = process.argv.slice(3);
  const has = (f) => args.includes(f);

  if (has('--help')) {
    console.log(`
  move hooks [--print] [--force]

  Installs pre-commit and pre-push hooks into .githooks/ and points git at them.

    pre-commit   move check --staged   (fast: only what you staged)
    pre-push     move check + typecheck + test:a11y   (whole project)

  --print   show the commands to paste into an existing runner, install nothing
  --force   overwrite hook files that are already there

  Both hooks are skippable with --no-verify, and are yours to edit afterwards.
`);
    process.exit(0);
  }

  if (has('--print')) {
    console.log(`
  Wire these into your existing hook runner:

    pre-commit:  npx move check --staged
    pre-push:    npx move check
`);
    process.exit(0);
  }

  const cwd = process.cwd();
  if (!existsSync(join(cwd, '.git'))) {
    console.error('  move hooks: no .git here — run this from the root of a git repository.');
    process.exit(1);
  }

  // Someone else's hooks path is someone else's decision. Repointing it would
  // silently disable whatever is already installed there, so say what to do
  // instead of doing it.
  let current = '';
  try {
    current = execFileSync('git', ['config', '--get', 'core.hooksPath'], {
      cwd,
      encoding: 'utf8',
    }).trim();
  } catch {
    current = '';
  }
  if (current && current !== '.githooks') {
    console.error(`  move hooks: core.hooksPath is already set to '${current}'.`);
    console.error('  Move will not repoint it. Add the commands to those hooks instead:');
    console.error('      pre-commit:  npx move check --staged');
    console.error('      pre-push:    npx move check');
    process.exit(1);
  }

  const dest = join(cwd, '.githooks');
  mkdirSync(dest, { recursive: true });
  const written = [];
  const kept = [];
  for (const name of ['pre-commit', 'pre-push']) {
    const target = join(dest, name);
    // A hook already there is the project's own work. Overwriting it silently
    // is how you delete something nobody remembers writing.
    if (existsSync(target) && !has('--force')) {
      kept.push(name);
      continue;
    }
    writeFileSync(target, readFileSync(join(packageRoot, 'hooks', name), 'utf8'));
    chmodSync(target, 0o755);
    written.push(name);
  }

  execFileSync('git', ['config', 'core.hooksPath', '.githooks'], { cwd });

  for (const n of written) console.log(`  ✓ .githooks/${n}`);
  for (const n of kept)
    console.log(`  • .githooks/${n} already exists — kept (use --force to replace)`);
  console.log('  ✓ core.hooksPath → .githooks');
  console.log('\n  Commit .githooks/ so your team gets them. Each developer runs');
  console.log('  `npx move hooks` once, because core.hooksPath is local to a clone.');
  process.exit(0);
}

if (command === 'check') {
  // Consumer-facing validation gates. Each check module exports run(config) →
  // { name, ok, summary, messages }. Run all, or one named check.
  const { loadConfig } = await import('../checks/_config.mjs');
  const config = loadConfig(process.cwd());

  // `--staged` narrows the run to what is about to be committed, which is what
  // makes a commit hook fast enough to leave switched on. Everything else — a
  // push, CI, a manual run — sees the whole project.
  if (process.argv.includes('--staged')) {
    let staged = [];
    try {
      staged = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR'], {
        encoding: 'utf8',
      })
        .split('\n')
        .filter(Boolean);
    } catch {
      console.error('  move check --staged: not a git repository (or git is unavailable).');
      process.exit(1);
    }
    // Nothing staged that these checks read is a pass, not a no-op to report:
    // a commit touching only docs or config has nothing for them to say.
    config.only = new Set(staged.map((f) => resolve(process.cwd(), f)));
  }

  const registry = {
    'strict-props': () => import('../checks/strict-props.mjs'),
    'purity': () => import('../checks/purity.mjs'),
    'composite-spec-drift': () => import('../checks/composite-spec-drift.mjs'),
    'creation': () => import('../checks/creation.mjs'),
  };

  // `creation` asserts a whole-app shape (a scaffolded Move app), so it's opt-in
  // (`move check creation`) rather than part of the default component/composite run.
  const DEFAULT_CHECKS = ['strict-props', 'purity', 'composite-spec-drift'];

  const only = process.argv.slice(3).find((a) => !a.startsWith('--'));
  if (only && !registry[only]) {
    console.error(`  Unknown check: ${only}\n  Available: ${Object.keys(registry).join(', ')}`);
    process.exit(1);
  }
  if (process.argv.includes('--help')) {
    console.log(`
  move check [name]

  Validates the components & recipes in your project against Move's quality
  gates. Roots come from move.config.json (defaults: src/components, src/recipes).

  Default checks: ${DEFAULT_CHECKS.join(', ')}
  Opt-in:         creation (validate a scaffolded app against the creation spec)
`);
    process.exit(0);
  }

  const names = only ? [only] : DEFAULT_CHECKS;
  let failed = 0;
  for (const name of names) {
    const mod = await registry[name]();
    const res = mod.run(config);
    if (res.ok) {
      console.log(`✓ ${res.name}: ${res.summary}`);
    } else {
      failed++;
      console.error(`✗ ${res.name}: ${res.summary}`);
      for (const m of res.messages) console.error(`    ${m}`);
    }
  }
  if (failed > 0) {
    console.error(`\n  move check: ${failed} of ${names.length} check(s) failed.`);
    process.exit(1);
  }
  console.log(`\n  move check: all ${names.length} check(s) passed.`);
  process.exit(0);
}

console.error(`  Unknown command: ${command}\n  Run "move --help" for available commands.`);
process.exit(1);
