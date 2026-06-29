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
  Usage: move recipes <path>

  Examples:
    move recipes authentication/LoginForm   Copy a specific recipe
    move recipes authentication             Copy all recipes in a group
    move recipes composite/authentication   Also works with type prefix

  Recipes are copied to src/recipes/ in your project.
`);
    process.exit(0);
  }

  // Normalize: strip leading type prefix if present (composite/auth → auth)
  const normalized = pattern.replace(/^(composite|component)\//, '');
  const source = join(recipesRoot, normalized);
  const sourceWithType = join(recipesRoot, 'composite', normalized);

  let resolvedSource;
  // Try exact path first, then nested under composite/
  if (existsSync(source)) resolvedSource = source;
  else if (existsSync(sourceWithType)) resolvedSource = sourceWithType;
  else if (existsSync(source + '.tsx')) resolvedSource = source + '.tsx';
  else if (existsSync(sourceWithType + '.tsx')) resolvedSource = sourceWithType + '.tsx';
  else {
    console.error(`  Recipe not found: ${pattern}`);
    process.exit(1);
  }

  const target = join(process.cwd(), 'src', 'recipes', normalized);

  if (resolvedSource.endsWith('.tsx')) {
    // Single file
    mkdirSync(dirname(target), { recursive: true });
    cpSync(resolvedSource, target + '.tsx');
    console.log(`\n  Copied to src/recipes/${normalized}.tsx\n`);
  } else {
    // Directory
    mkdirSync(target, { recursive: true });
    cpSync(resolvedSource, target, { recursive: true });
    console.log(`\n  Copied to src/recipes/${normalized}/\n`);
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
    'recipe-purity': () => import('../checks/recipe-purity.mjs'),
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
