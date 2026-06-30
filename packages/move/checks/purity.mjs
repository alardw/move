#!/usr/bin/env node
/**
 * Purity (consumer-facing; shipped, config-driven).
 *
 * Any Move-composed code — recipes, docs samples, and app sources — must be
 * built ENTIRELY from Move components: no raw HTML elements
 * (`<div>`/`<span>`/`<p>`/…), no inline `style=` props. This parses each source
 * with the TypeScript compiler and flags both.
 *
 * Escape hatch: a `purity-ignore: <reason>` comment on a line (or the line
 * above) skips it — for the rare sizing no Move primitive expresses yet — so the
 * exception stays visible and justified. The legacy `recipe-purity-ignore`
 * marker still works (it contains `purity-ignore`).
 *
 * Scans `config.recipes` + `config.samples` (and any app roots you configure).
 */
import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';
import { loadConfig } from './_config.mjs';

const IGNORE_MARKER = 'purity-ignore';

function collectTsx(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) collectTsx(full, out);
    // Test files import vitest/testing-library — they aren't subject to the
    // "only Move components" purity rule.
    else if (entry.endsWith('.tsx') && !entry.endsWith('.test.tsx')) out.push(full);
  }
  return out;
}

export function run(config) {
  const roots = [...config.recipes, ...config.samples];
  const files = [...new Set(roots.flatMap((r) => collectTsx(r)))].sort();
  const violations = [];

  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    const lines = src.split('\n');
    const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const isIgnored = (line1) =>
      (lines[line1 - 1] ?? '').includes(IGNORE_MARKER) || (lines[line1 - 2] ?? '').includes(IGNORE_MARKER);
    const record = (node, kind, detail) => {
      const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
      if (!isIgnored(line + 1)) violations.push(`${relative(config.cwd, file)}:${line + 1}  ${kind} — ${detail}`);
    };
    const visit = (node) => {
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const tag = node.tagName.getText(sf);
        if (/^[a-z]/.test(tag)) record(node, 'raw-html', `<${tag}>`);
      }
      if (ts.isJsxAttribute(node) && node.name.getText(sf) === 'style') record(node, 'inline-style', 'style=');
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }

  return {
    name: 'purity',
    ok: violations.length === 0,
    summary: violations.length === 0
      ? `${files.length} composed files are 100% Move components`
      : `${violations.length} violation(s) — raw HTML or inline styles (use Move components + props; mark unavoidable sizing with {/* ${IGNORE_MARKER}: … */})`,
    messages: violations,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const res = run(loadConfig());
  if (!res.ok) {
    console.error(`✗ purity: ${res.summary}\n`);
    console.error(res.messages.map((m) => `  ${m}`).join('\n'));
    process.exit(1);
  }
  console.log(`✓ purity: ${res.summary}.`);
}
