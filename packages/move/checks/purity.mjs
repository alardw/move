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
 * SVG shapes are the one SCOPED exemption: legal as descendants of
 * `<Illustration>`, flagged everywhere else. See SVG_ELEMENTS below for what
 * that covers and what it deliberately does not.
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
 *   For a drawing, wrap the shapes in `<Illustration>` — it is the sanctioned
 *   seam, and inside it the shapes are legal.
 *   NOTE: there is currently NO sanctioned way to set an arbitrary width or
 *   height — no Frame/Box primitive exists — so this rule is INCOMPLETE. Three
 *   consumer teams each built their own Frame and each one failed this check.
 *   Tracked as the Tier-2 sizing gap in STEVE-FINDINGS.md; until it lands, this
 *   is a wall rather than a design, and that is a known defect in the rule.
 */
import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';
import { loadConfig, inScope } from './_config.mjs';

const IGNORE_MARKER = 'purity-ignore';

/**
 * SVG elements, legal ONLY inside an `<Illustration>`.
 *
 * The rule against raw elements has always had a hole in it: a one-off diagram
 * had nowhere to go. Icons resolve through `iconResolver`, but a drawing is not
 * an icon, and composed code that needed one simply violated the rule — a
 * consumer's animated logo carries raw `<svg>`, `<g>`, `<path>`, `<rect>` and
 * `<filter>` in a single file. They did not ignore the rule; there was nothing
 * to follow.
 *
 * `Illustration` is the seam, and this is what makes being inside it mean
 * something: shapes are legal there and nowhere else, so the accessible name,
 * the token palette and the sizing come with them rather than being remembered.
 *
 * `svg` is included because Illustration is the FRAME: the consumer writes the
 * element, so an export pastes in whole and an SVGR import drops straight in.
 *
 * Deliberately absent from the list:
 *   • `foreignObject` — embeds arbitrary HTML, which would reopen the hole.
 *   • `animate` / `animateTransform` / `set` — SMIL bypasses the animation
 *     system. Illustration takes an `animations` prop for this.
 */
export const SVG_ELEMENTS = new Set([
  'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon',
  'text', 'tspan', 'textPath', 'defs', 'use', 'symbol', 'marker', 'mask',
  'clipPath', 'pattern', 'linearGradient', 'radialGradient', 'stop', 'image',
  'filter', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight',
  'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence',
]);

/** The component whose children those elements are allowed to be. */
const SVG_SEAM = 'Illustration';

/**
 * Naming a drawing is the FRAME's job, never the artwork's.
 *
 * Illustration carries `role="img"` and the accessible name on a wrapper, and
 * the ARIA spec makes that wrapper's children presentational — so anything the
 * artwork says about itself is either ignored or, worse, wins. An export
 * arrives stamped with whatever its tool wrote: unDraw ships `role="img"`,
 * Figma ships a `<title>` of the frame name. The nameless variant is caught by
 * axe; a drawing carrying `aria-label="Illustration"` produces a WRONG
 * accessible name that no tool flags and nobody sees.
 *
 * (`<title>` and `<desc>` need no rule here — they are not in SVG_ELEMENTS, so
 * they are already refused as raw elements.)
 */
const SVG_NAMING_ATTRS = ['role', 'aria-label', 'aria-labelledby'];

/**
 * Is this node somewhere inside an `<Illustration>`?
 *
 * Walks the JSX ancestor chain rather than tracking depth, because the shapes
 * are usually nested a group or two down. `createSourceFile` is called with
 * parent pointers, so the chain is there to walk.
 */
export function insideSeam(node, sf) {
  for (let p = node.parent; p; p = p.parent) {
    if (ts.isJsxElement(p)) {
      const tag = p.openingElement.tagName.getText(sf);
      if (tag === SVG_SEAM || tag.endsWith(`.${SVG_SEAM}`)) return true;
    }
  }
  return false;
}

/**
 * Is this shape part of a DRAWING COMPONENT — a function whose whole output is
 * an `<svg>`?
 *
 * Factoring a drawing out under a name is the natural thing to do, and it is
 * what SVGR produces from a file. Requiring lexical nesting would forbid the
 * local version of something the check already permits when imported: `<Logo/>`
 * is a capitalised tag, so nothing here can judge it either way. Penalising
 * only the hand-written twin is a rule about where you typed the shapes rather
 * than about what they are.
 *
 * So a drawing component is legal, and the question of whether it gets framed
 * moves to its call site — where `<Chip/>` and `<Logo/>` are the same kind of
 * thing. What stays illegal is what the rule was always for: shapes loose in a
 * page, alongside prose and layout.
 */
export function isDrawingComponent(node, sf) {
  for (let p = node.parent; p; p = p.parent) {
    const isFn =
      ts.isFunctionDeclaration(p) || ts.isArrowFunction(p) || ts.isFunctionExpression(p);
    if (!isFn) continue;
    // The outermost JSX this function returns. An svg there means everything
    // below it is that drawing.
    let root = null;
    const findRoot = (n) => {
      if (root) return;
      if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) {
        root = n;
        return;
      }
      ts.forEachChild(n, findRoot);
    };
    ts.forEachChild(p, findRoot);
    if (!root) return false;
    const tag = ts.isJsxElement(root)
      ? root.openingElement.tagName.getText(sf)
      : root.tagName.getText(sf);
    return tag === 'svg';
  }
  return false;
}

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

/**
 * Is this lowercase tag a legal SVG shape?
 *
 * Exported because two checks enforce the raw-element rule — this one over
 * composed code, and app-conformance over the docs app — and a rule with two
 * implementations is a rule that drifts. The Illustration seam was taught here
 * first and app-conformance kept flagging what this had just blessed.
 */
export function isLegalSvg(tag, node, sf) {
  return SVG_ELEMENTS.has(tag) && (insideSeam(node, sf) || isDrawingComponent(node, sf));
}

export function run(config) {
  const roots = [...config.recipes, ...config.composites, ...config.samples];
  const files = [...new Set(roots.flatMap((r) => collectTsx(r)))].sort().filter((f) => inScope(config, f));
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
    const ids = new Map();
    const visit = (node) => {
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const tag = node.tagName.getText(sf);
        if (/^[a-z]/.test(tag)) {
          if (tag === 'svg' && (insideSeam(node, sf) || isDrawingComponent(node, sf))) {
            for (const attr of node.attributes.properties) {
              if (!ts.isJsxAttribute(attr)) continue;
              const name = attr.name.getText(sf);
              if (SVG_NAMING_ATTRS.includes(name)) {
                record(
                  attr,
                  'svg-naming',
                  `${name} on the drawing — <${SVG_SEAM}> names it, and its children are presentational, so this is ignored at best and wrong at worst`,
                );
              }
            }
          }
          if (SVG_ELEMENTS.has(tag)) {
            // A shape is legal inside the seam and nowhere else. Outside it, say
            // so by name — the answer is a component, not the ignore marker.
            if (!insideSeam(node, sf) && !isDrawingComponent(node, sf)) {
              record(
                node,
                'raw-svg',
                `<${tag}> outside <${SVG_SEAM}> — SVG shapes are legal only inside it, where the accessible name, the token palette and the sizing come with them`,
              );
            }
          } else {
            record(node, 'raw-html', `<${tag}>`);
          }
        }
      }
      // An id is only unique within a document, and two drawings on one page
      // share that document. Collected here, reported once per file below.
      if (ts.isJsxAttribute(node) && node.name.getText(sf) === 'id') {
        const owner = node.parent?.parent;
        const ownerTag =
          owner && (ts.isJsxOpeningElement(owner) || ts.isJsxSelfClosingElement(owner))
            ? owner.tagName.getText(sf)
            : '';
        const init = node.initializer;
        if ((ownerTag === 'svg' || SVG_ELEMENTS.has(ownerTag)) && init && ts.isStringLiteral(init)) {
          const seen = ids.get(init.text) ?? [];
          seen.push(node);
          ids.set(init.text, seen);
        }
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

    for (const [id, nodes] of ids) {
      if (nodes.length > 1) {
        record(nodes[1], 'duplicate-id', `id="${id}" used ${nodes.length} times — an id is unique per DOCUMENT, so two drawings sharing one make every url(#${id}) resolve to the first`);
      }
    }
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
