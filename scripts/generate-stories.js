#!/usr/bin/env node

/**
 * Auto-generate Storybook stories from demo/src/demos/*.tsx files.
 *
 * Each demo file follows a consistent pattern:
 *   - Import from 'move' and '../components'
 *   - Define XxxExample() functions
 *   - Define a `const examples: Example[]` array mapping names → components
 *
 * This script extracts those functions and generates story files that
 * export each example as a named Storybook story with source code.
 *
 * Usage:
 *   node scripts/generate-stories.js            # skip existing
 *   node scripts/generate-stories.js --force     # overwrite all
 *   node scripts/generate-stories.js --dry-run   # preview without writing
 */

import { readdirSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const force = process.argv.includes('--force');
const dryRun = process.argv.includes('--dry-run');

const DEMOS_DIR = join(import.meta.dirname, '..', 'demo', 'src', 'demos');
const COMPONENTS_DIR = join(import.meta.dirname, '..', 'src', 'components');

// Map component names to their directory path (category/Component)
function buildComponentMap() {
  const map = new Map();
  const CATEGORY_MAP = {
    core: 'Core', form: 'Form', panel: 'Panel', overlay: 'Overlay',
    data: 'Data', loading: 'Loading', media: 'Media', misc: 'Misc',
    nav: 'Navigation', navigation: 'Navigation', toolbar: 'Toolbar',
    calendar: 'Calendar',
  };

  for (const category of readdirSync(COMPONENTS_DIR)) {
    const categoryDir = join(COMPONENTS_DIR, category);
    const categoryName = CATEGORY_MAP[category];
    if (!categoryName) continue;

    for (const component of readdirSync(categoryDir)) {
      if (component.startsWith('_')) continue;
      const componentDir = join(categoryDir, component);
      if (!existsSync(join(componentDir, `${component}.tsx`))) continue;
      map.set(component, { dir: componentDir, category: categoryName });
    }
  }
  return map;
}

/**
 * Find the main export name from a component file.
 */
function findMainExport(componentDir, componentName) {
  const filePath = join(componentDir, `${componentName}.tsx`);
  if (!existsSync(filePath)) return componentName;
  const source = readFileSync(filePath, 'utf-8');
  const match = source.match(new RegExp(`export const (${componentName}\\w*)\\b`));
  return match ? match[1] : componentName;
}

/**
 * Parse a demo file and extract imports, function bodies, stories with code.
 */
function parseDemoFile(filePath) {
  const source = readFileSync(filePath, 'utf-8');

  // 1. Find where the examples array starts
  const examplesIdx = source.indexOf('const examples');
  if (examplesIdx === -1) return null;

  const preamble = source.slice(0, examplesIdx);

  // 2. Extract imports (handle multi-line imports)
  const importLines = [];
  const importRegex = /^import\s[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm;
  let importMatch;
  while ((importMatch = importRegex.exec(preamble)) !== null) {
    const stmt = importMatch[0];
    if (stmt.includes('DocPage')) continue;
    if (stmt.includes("'../components'") || stmt.includes("'../components/")) {
      importLines.push(
        stmt
          .replace(/from\s+['"]\.\.\/components['"]/, "from '../../../../.storybook/helpers'")
          .replace(/from\s+['"]\.\.\/components\/\w+['"]/, "from '../../../../.storybook/helpers'")
      );
      continue;
    }
    importLines.push(stmt);
  }

  // 3. Extract function bodies (everything after imports, before examples array)
  let afterImports = 0;
  const allImportRegex = /^import\s[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm;
  let m;
  while ((m = allImportRegex.exec(preamble)) !== null) {
    afterImports = m.index + m[0].length;
  }
  const functionBodies = preamble.slice(afterImports).trim();

  // 4. Parse examples array — split into blocks by brace depth, then extract fields
  const examplesSection = source.slice(examplesIdx);
  const stories = [];

  // Find the array content after "= ["
  const arrayStart = examplesSection.indexOf('= [');
  if (arrayStart === -1) return null;
  const actualStart = arrayStart + 2; // position of the [

  // Split into example blocks by tracking brace depth
  // After [, we're at bracket depth 1. Top-level objects start with { at brace depth 0→1.
  let braceDepth = 0;
  let blockStart = -1;
  const blocks = [];
  for (let i = actualStart + 1; i < examplesSection.length; i++) {
    const ch = examplesSection[i];
    if (ch === '`') {
      // Skip template literal content
      i++;
      while (i < examplesSection.length && examplesSection[i] !== '`') i++;
      continue;
    }
    if (ch === ']' && braceDepth === 0) break; // end of array
    if (ch === '{') {
      if (braceDepth === 0) blockStart = i;
      braceDepth++;
    } else if (ch === '}') {
      braceDepth--;
      if (braceDepth === 0 && blockStart !== -1) {
        blocks.push(examplesSection.slice(blockStart, i + 1));
        blockStart = -1;
      }
    }
  }

  for (const block of blocks) {
    const idMatch = block.match(/id:\s*'([^']+)'/);
    const nameMatch = block.match(/name:\s*'([^']+)'/);
    const compMatch = block.match(/component:\s*<(\w+)/);
    // Extract code from template literal
    const codeMatch = block.match(/code:\s*`([\s\S]*?)`/);

    if (!idMatch || !nameMatch || !compMatch) continue;

    const [, id] = idMatch;
    const [, name] = nameMatch;
    const [, componentName] = compMatch;
    const code = codeMatch ? codeMatch[1] : null;

    const storyName = name.replace(/[^a-zA-Z0-9]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join('');
    stories.push({ id, name, storyName, componentName, code });
  }

  if (stories.length === 0) return null;

  return { importLines, functionBodies, stories };
}

// ── Main ──

const componentMap = buildComponentMap();
let created = 0;
let skipped = 0;
let noDemo = 0;

for (const demoFile of readdirSync(DEMOS_DIR)) {
  if (!demoFile.endsWith('Demo.tsx')) continue;

  const componentName = demoFile.replace('Demo.tsx', '');
  const target = componentMap.get(componentName);
  if (!target) continue;

  const storiesFile = join(target.dir, `${componentName}.stories.tsx`);
  if (existsSync(storiesFile) && !force) {
    skipped++;
    continue;
  }

  const parsed = parseDemoFile(join(DEMOS_DIR, demoFile));
  if (!parsed) {
    noDemo++;
    continue;
  }

  const { importLines, functionBodies, stories } = parsed;
  const mainExport = findMainExport(target.dir, componentName);

  // Merge all react named imports into a single line
  const reactNamedImports = new Set();
  for (const line of importLines) {
    if (!line.includes("from 'react'")) continue;
    const match = line.match(/import\s+\{([^}]+)\}/);
    if (match) {
      match[1].split(',').map(s => s.trim()).filter(Boolean).forEach(n => reactNamedImports.add(n));
    }
  }
  const reactImport = reactNamedImports.size > 0
    ? `import React, { ${[...reactNamedImports].join(', ')} } from 'react';`
    : `import React from 'react';`;

  // Check if main export is already in a 'move' import
  const moveImports = importLines.filter(l => l.includes("from 'move'"));
  const alreadyImported = moveImports.some(l => {
    const m = l.match(/import\s+\{([^}]+)\}/);
    return m && m[1].split(',').map(s => s.trim().replace(/\s+as\s+.*/, '')).includes(mainExport);
  });

  // Build story exports with source code
  const storyExports = stories.map(s => {
    const lines = [`export const ${s.storyName}: Story = {`];
    lines.push(`  name: '${s.name}',`);
    lines.push(`  render: () => <${s.componentName} />,`);
    if (s.code) {
      // Escape backticks and ${} in the code string
      const escaped = s.code.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
      lines.push(`  parameters: { docs: { source: { code: \`${escaped}\` } } },`);
    }
    lines.push(`};`);
    return lines.join('\n');
  });

  // Build the story file
  const storyLines = [
    reactImport,
    `import type { Meta, StoryObj } from '@storybook/react-vite';`,
    ...importLines.filter(l => !l.includes("from 'react'")),
    // Add component import if not already present
    ...(!alreadyImported ? [`import { ${mainExport} } from './${componentName}';`] : []),
    '',
    `const meta: Meta<typeof ${mainExport}> = {`,
    `  title: '${target.category}/${componentName}',`,
    `  component: ${mainExport},`,
    `};`,
    `export default meta;`,
    '',
    `type Story = StoryObj<typeof ${mainExport}>;`,
    '',
    functionBodies,
    '',
    ...storyExports,
    '',
  ];

  const content = storyLines.join('\n');

  if (dryRun) {
    console.log(`\n── ${target.category}/${componentName} (${stories.length} stories) ──`);
    console.log(stories.map(s => `  ${s.storyName} → <${s.componentName} />${s.code ? ' [has code]' : ''}`).join('\n'));
  } else {
    writeFileSync(storiesFile, content);
    console.log(`  ${target.category}/${componentName} → ${stories.length} stories`);
  }
  created++;
}

console.log(`\n${dryRun ? '[DRY RUN] ' : ''}Done! Generated ${created}, skipped ${skipped} existing, ${noDemo} had no parseable examples.`);
