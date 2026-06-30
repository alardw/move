#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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

  Both get the full set: the component spec pipeline (component-*) and the app
  builders (app-*). Your AI assistant can now drive Move's spec-driven workflow
  and scaffold apps, pages, and composites.
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
  if (existsSync(source)) resolvedSource = source; // group dir, or exact path
  else if (existsSync(source + '.tsx')) resolvedSource = source + '.tsx'; // single recipe by name
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

if (command === 'check') {
  // Consumer-facing validation gates. Each check module exports run(config) →
  // { name, ok, summary, messages }. Run all, or one named check.
  const { loadConfig } = await import('../checks/_config.mjs');
  const config = loadConfig(process.cwd());

  const registry = {
    'strict-props': () => import('../checks/strict-props.mjs'),
    'purity': () => import('../checks/purity.mjs'),
    'composition-spec-drift': () => import('../checks/composition-spec-drift.mjs'),
  };

  const only = process.argv[3];
  if (only && only !== '--help' && !registry[only]) {
    console.error(`  Unknown check: ${only}\n  Available: ${Object.keys(registry).join(', ')}`);
    process.exit(1);
  }
  if (only === '--help') {
    console.log(`
  move check [name]

  Validates the components & recipes in your project against Move's quality
  gates. Roots come from move.config.json (defaults: src/components, src/recipes).

  Available checks: ${Object.keys(registry).join(', ')}
`);
    process.exit(0);
  }

  const names = only ? [only] : Object.keys(registry);
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
