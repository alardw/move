#!/usr/bin/env node
/**
 * create-move — the deterministic Move app scaffolder.
 *
 * Non-interactive by design: options come from flags, defaults from the creation
 * spec, and the same invocation always writes the same bytes. After writing, it
 * VALIDATES its own output against the spec (`validateProject`) — if generation
 * ever drifts from the contract, the scaffold fails loudly instead of shipping a
 * subtly-wrong project.
 *
 *   npm create move@latest my-app -- --shell sidebar --router react-router
 *
 * Flags: --shell, --router, --icons, --theme (values from the spec's
 * OPTION_VALUES), --move <spec> / --local (override the `move` dependency for a
 * monorepo/dogfood build), --no-install, --force, --help.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import {
  DEFAULT_OPTIONS,
  OPTION_VALUES,
} from 'move/scaffold/creation-spec.mjs';
import { validateProject } from 'move/scaffold/validate.mjs';
import { generateProject } from './generate.mjs';

// The move package's own folder — resolved through the spec module we import, so
// it works both hoisted in the monorepo and installed in node_modules. Used to
// copy the skills into the new project.
const moveRoot = dirname(dirname(fileURLToPath(import.meta.resolve('move/scaffold/creation-spec.mjs'))));

function parseArgs(argv) {
  const flags = {};
  let name;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--local') flags.move = '*';
    else if (a === '--no-install') flags.install = false;
    else if (a === '--force') flags.force = true;
    else if (a === '--help' || a === '-h') flags.help = true;
    else if (a.startsWith('--')) flags[a.slice(2)] = argv[++i];
    else if (!name) name = a;
  }
  return { name, flags };
}

function usage() {
  console.log(`
  create-move <name> [options]

  Options:
    --shell    ${OPTION_VALUES.shell.join(' | ')}   (default: ${DEFAULT_OPTIONS.shell})
    --router   ${OPTION_VALUES.router.join(' | ')}   (default: ${DEFAULT_OPTIONS.router})
    --icons    ${OPTION_VALUES.icons.join(' | ')}   (default: ${DEFAULT_OPTIONS.icons})
    --theme    ${OPTION_VALUES.theme.join(' | ')}   (default: ${DEFAULT_OPTIONS.theme})
    --ci       ${OPTION_VALUES.ci.join(' | ')}   (default: ${DEFAULT_OPTIONS.ci}; the gates are npm scripts any CI runs)
    --move <spec>   override the "move" dependency (e.g. a local build)
    --local         shorthand for --move "*" (monorepo/workspace link)
    --no-install    skip "npm install"
    --force         write into an existing non-empty directory
`);
}

function resolveOptions(flags) {
  const options = { ...DEFAULT_OPTIONS };
  for (const key of Object.keys(OPTION_VALUES)) {
    if (flags[key] == null) continue;
    if (!OPTION_VALUES[key].includes(flags[key])) {
      console.error(`  Invalid --${key} "${flags[key]}". Expected: ${OPTION_VALUES[key].join(', ')}`);
      process.exit(1);
    }
    options[key] = flags[key];
  }
  return options;
}

function main() {
  const { name, flags } = parseArgs(process.argv.slice(2));

  if (flags.help) {
    usage();
    process.exit(0);
  }
  if (!name) {
    console.error('  A project name is required.\n');
    usage();
    process.exit(1);
  }

  const options = resolveOptions(flags);
  const dir = resolve(process.cwd(), name);
  // The npm package name is the target folder's basename — `name` may be a path
  // (`./apps/web`, or an absolute dir), and only the leaf belongs in package.json.
  const projectName = basename(dir);

  if (existsSync(dir) && readdirSync(dir).length > 0 && !flags.force) {
    console.error(`  Directory "${name}" already exists and is not empty. Use --force to write into it.`);
    process.exit(1);
  }

  console.log(`\n  Creating Move app "${name}" (shell: ${options.shell}, router: ${options.router}, icons: ${options.icons}, theme: ${options.theme})\n`);

  // --- Write text files --------------------------------------------------------
  const files = generateProject(projectName, options);

  // Optional override of the move dependency (monorepo/dogfood link).
  if (flags.move) {
    const pkg = JSON.parse(files['package.json']);
    pkg.dependencies.move = flags.move;
    files['package.json'] = JSON.stringify(pkg, null, 2) + '\n';
  }

  for (const [rel, content] of Object.entries(files)) {
    const full = join(dir, rel);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content);
  }

  // --- Copy skills into both agents' folders -----------------------------------
  const skillsSrc = join(moveRoot, 'skills');
  if (existsSync(skillsSrc)) {
    const skipReadme = (src) => src !== join(skillsSrc, 'README.md');
    for (const target of [join(dir, '.claude', 'skills'), join(dir, '.agents', 'skills')]) {
      mkdirSync(target, { recursive: true });
      cpSync(skillsSrc, target, { recursive: true, filter: skipReadme });
    }
    console.log('  Installed Move skills (.claude/skills, .agents/skills)');
  } else {
    console.error(`  ⚠ Could not find Move skills at ${skillsSrc} — skipping.`);
  }

  // --- Self-check the generated project against the creation spec ---------------
  const result = validateProject(dir, options);
  if (!result.ok) {
    console.error(`\n  ✗ Generated project fails the creation spec (${result.errors.length} issue(s)):`);
    for (const e of result.errors) console.error(`      ${e}`);
    console.error('\n  This is a create-move bug — the scaffolder drifted from creation-spec.mjs.');
    process.exit(1);
  }
  console.log(`  ✓ Conformant with the creation spec (${result.checked} files checked)`);

  // --- Install -----------------------------------------------------------------
  if (flags.install !== false) {
    console.log('\n  Installing dependencies...\n');
    try {
      execSync('npm install', { cwd: dir, stdio: 'inherit' });
    } catch {
      console.log('\n  npm install failed — run it manually in the project.');
    }
  }

  console.log(`
  Done. Next:

    cd ${name}${flags.install === false ? '\n    npm install' : ''}
    npm run dev

  Then ask your AI assistant to /app-compose your first screen into src/composites.
`);
}

main();
