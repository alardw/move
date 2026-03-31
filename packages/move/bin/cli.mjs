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
`);
  process.exit(0);
}

if (command === 'skills') {
  const sourceDir = join(packageRoot, 'skills', 'app');

  if (!existsSync(sourceDir)) {
    console.error('  Could not find Move skills. Is the move package installed correctly?');
    process.exit(1);
  }

  const targets = [
    join(process.cwd(), '.agents', 'skills'),
    join(process.cwd(), '.claude', 'skills'),
  ];

  for (const target of targets) {
    mkdirSync(target, { recursive: true });
    cpSync(sourceDir, target, { recursive: true });
  }

  console.log(`
  Move skills installed:
    .agents/skills/   (Codex, open standard)
    .claude/skills/   (Claude Code)

  Your AI assistant can now generate composites, pages, features, and app setup.
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

console.error(`  Unknown command: ${command}\n  Run "move --help" for available commands.`);
process.exit(1);
