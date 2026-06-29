#!/usr/bin/env node
/**
 * Strict-props check (consumer-facing; shipped, config-driven).
 *
 * Component `Props` interfaces must be strictly typed so `tsc` rejects invalid
 * prop values and unknown props. They must NOT use `extends Record<string,
 * unknown>` — that index signature silently accepts anything and disables
 * literal-union checking. `tsc` can't catch this (a loose interface compiles),
 * so this guard does.
 *
 * Scans `config.components` (+ `config.infrastructure` if set) for any `*.tsx`
 * interface that `extends Record<string, unknown>`.
 *
 * Fix: extend `React.HTMLAttributes<HTMLElement>` (or element-specific attrs),
 * using `Omit<…, 'key'>` for intentionally-redefined native props.
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { loadConfig } from './_config.mjs';

const OFFENDER = /\bextends\s+Record<\s*string\s*,\s*unknown\s*>/;

function collect(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) collect(p, out);
    else if (entry.endsWith('.tsx') && !entry.endsWith('.test.tsx')) out.push(p);
  }
  return out;
}

export function run(config) {
  const roots = [...config.components, ...config.infrastructure];
  const messages = [];
  for (const base of roots) {
    for (const file of collect(base).sort()) {
      readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
        if (OFFENDER.test(line)) {
          messages.push(`${relative(config.cwd, file)}:${i + 1}  ${line.trim()}`);
        }
      });
    }
  }
  return {
    name: 'strict-props',
    ok: messages.length === 0,
    summary: messages.length === 0
      ? 'no component Props extends Record<string, unknown>'
      : `${messages.length} interface(s) extend Record<string, unknown> — use React HTML attrs`,
    messages,
  };
}

// Standalone: `node checks/strict-props.mjs`
if (import.meta.url === `file://${process.argv[1]}`) {
  const res = run(loadConfig());
  if (!res.ok) {
    console.error(`✗ strict-props: ${res.summary}\n`);
    console.error(res.messages.map((m) => `  ${m}`).join('\n'));
    process.exit(1);
  }
  console.log(`✓ strict-props: ${res.summary}.`);
}
