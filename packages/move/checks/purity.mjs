#!/usr/bin/env node
/**
 * Purity (consumer-facing; shipped, config-driven).
 *
 * Any Move-composed code — recipes, docs samples, and app sources — must be
 * built ENTIRELY from Move components: no raw HTML elements
 * (`<div>`/`<span>`/`<p>`/…), no inline `style=` props. This parses each source
 * with the TypeScript compiler and flags both.
 *
 * Escape hatch: a `composite-purity-ignore: <reason>` comment on a line (or the
 * line above) skips it — for the rare sizing no Move primitive expresses yet — so
 * the exception stays visible and justified. Any comment containing the substring
 * `purity-ignore` is honoured.
 *
 * Scans `config.recipes` + `config.composites` + `config.samples` (and any app
 * roots you configure) — an inline `<svg>` is raw HTML, so this also enforces the
 * svg half of the icons rule (icons-1) on composed code.
 *
 * It also enforces the RENDERING-LIBRARY BOUNDARY (purity-6). A drawing library
 * — Recharts, Chart.js, D3, three.js — may be imported by a component that
 * wraps it (a `withMoveComponent` component, or a renderer adapter beside one),
 * and nowhere else. Composed code must reach it through that component's typed
 * seam instead. Without this, `<AreaChart>` passes every other rule: it is a
 * capitalised tag, so the raw-HTML check waves it through, and it lands in a
 * composite where its DOM, theming and accessibility are outside Move's reach.
 *
 * The scan roots are what makes this checkable: purity only ever walks composed
 * code, never components, so any hit here is by definition on the wrong side of
 * the boundary.
 *
 * @enforces icons-1 purity-1 purity-2 purity-4 purity-6
 * @instead compose from Move components; use Stack/Align/Grid for layout, the `sp` slot-prop
 *   for a slot the component exposes, and a component token for anything visual.
 *   NOTE: there is currently NO sanctioned way to set an arbitrary width or
 *   height — no Frame/Box primitive exists — so this rule is INCOMPLETE. Three
 *   consumer teams each built their own Frame and each one failed this check.
 *   Tracked as the Tier-2 sizing gap in STEVE-FINDINGS.md; until it lands, this
 *   is a wall rather than a design, and that is a known defect in the rule.
 */
import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';
import { loadConfig } from './_config.mjs';

const IGNORE_MARKER = 'purity-ignore';

/**
 * Libraries that draw their own DOM or canvas.
 *
 * A denylist rather than a heuristic, because "does this package render?" is
 * not decidable from a module name. Matches the package root or any subpath, so
 * `@nivo/bar` and `d3-shape` are caught alongside `d3`.
 */
const RENDER_LIBRARIES = [
  'recharts',
  'chart.js',
  'react-chartjs-2',
  'd3',
  'victory',
  '@nivo',
  '@visx',
  'plotly.js',
  'react-plotly.js',
  'echarts',
  'echarts-for-react',
  'apexcharts',
  'react-apexcharts',
  'highcharts',
  'highcharts-react-official',
  'three',
  '@react-three/fiber',
  'konva',
  'react-konva',
  'pixi.js',
  'fabric',
];

/** True when a module specifier names a rendering library, or a subpath of one. */
function isRenderLibrary(specifier) {
  if (specifier.startsWith('.') || specifier.startsWith('/')) return false;
  return RENDER_LIBRARIES.some(
    (lib) => specifier === lib || specifier.startsWith(`${lib}/`) || specifier.startsWith(`${lib}-`),
  );
}

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
  const roots = [...config.recipes, ...config.composites, ...config.samples];
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
      // purity-6: a drawing library belongs behind a component's renderer seam,
      // never in composed code.
      if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        const from = node.moduleSpecifier.text;
        if (isRenderLibrary(from)) {
          record(
            node,
            'render-library',
            `imports '${from}' — a rendering library may only be imported by the component that wraps it (withMoveComponent, or a renderer adapter beside it). Reach it through that component's seam.`,
          );
        }
      }
      // purity-4: manual responsive — read layout off Move's responsive props
      // (collapseBelow, …), not viewport math. Only width/height media queries
      // count; feature queries (prefers-reduced-motion, prefers-color-scheme) are fine.
      if (ts.isCallExpression(node) && /(?:^|\.)matchMedia$/.test(node.expression.getText(sf))) {
        const arg = node.arguments[0];
        const q = arg && (ts.isStringLiteral(arg) || ts.isNoSubstitutionTemplateLiteral(arg)) ? arg.text : '';
        if (/width|height/i.test(q)) record(node, 'manual-responsive', `matchMedia(${q})`);
      }
      if (
        ts.isPropertyAccessExpression(node) &&
        node.expression.getText(sf) === 'window' &&
        /^(inner|outer)(Width|Height)$/.test(node.name.getText(sf))
      ) {
        record(node, 'manual-responsive', node.getText(sf));
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }

  return {
    name: 'purity',
    ok: violations.length === 0,
    summary: violations.length === 0
      ? `${files.length} composed files are 100% Move components`
      : `${violations.length} violation(s) — raw HTML, inline styles, or manual responsive (use Move components + props; mark unavoidable sizing with {/* ${IGNORE_MARKER}: … */})`,
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
