#!/usr/bin/env node
/**
 * Every font-size comes from the type scale.
 *
 * The scale is `--move-text-xs … --move-text-4xl`, aliased as `--move-size-*`.
 * A size that does not resolve into it is off the scale by definition, and the
 * component carrying it will not follow a consumer's typography.
 *
 * Two ways that happens, and the second is the one that actually bit:
 *
 *   A literal — `font-size: 13px`, `0.8rem`, `90%`. Visible in review, rare.
 *
 *   `inherit` on a token whose whole job is to NAME a size. A `*-font-size`
 *   token set to `inherit` looks like "follow the context" and behaves that way
 *   on a <div>, but a replaced element — <input>, <textarea>, <select>, <button>
 *   — does not inherit type from the document. It takes the UA's own default,
 *   which in Chrome is 13.333px. So InputText, NumberInput, Password, Textarea
 *   and ColorInput each shipped a default size that appears nowhere in the
 *   scale, while their `sm` and `lg` variants named a step correctly. The one
 *   size nobody wrote down was the one that left the system.
 *
 * `inherit` stays legal on a plain `font-size` declaration — a span that should
 * follow its heading is a real thing. It is only rejected as the VALUE OF A
 * TOKEN, where naming a size is the entire point of the declaration.
 *
 * Third: a slot's DECLARED typography role must match the size it actually
 * renders at default. Without this the spec field is descriptive — it records
 * whatever the CSS happened to do, which is worth nothing the moment the CSS
 * changes. The first codemod that filled it was wrong for 45 of 642 slots, all
 * because it read the last declaration in the file rather than the one in
 * default scope; nothing would have caught that.
 *
 * @enforces styles-16
 * @instead name a step: `var(--move-size-sm)` for controls, `var(--move-size-base)`
 *   for body copy. A token that means "follow the context" should not exist; delete
 *   it and let the element inherit, or name the size.
 *
 * Exit: 0 = clean, 1 = at least one size off the scale.
 */
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOVE_ROOT = join(HERE, '..', '..');
const COMPONENTS = join(MOVE_ROOT, 'src', 'components');
const TYPOGRAPHY = join(MOVE_ROOT, 'src', 'styles', 'tokens', 'primitives', 'typography.css');
const SEMANTIC = join(MOVE_ROOT, 'src', 'styles', 'tokens', 'semantic.css');

/** The scale itself: --move-text-* plus the --move-size-* aliases onto it. */
function loadScale() {
  const scale = new Set();
  for (const m of readFileSync(TYPOGRAPHY, 'utf8').matchAll(/(--move-text-[a-z0-9]+):/g)) {
    scale.add(m[1]);
  }
  const semantic = readFileSync(SEMANTIC, 'utf8');
  // --move-size-* aliases, and the --move-type-* ROLES layered on top of them.
  // A role is the preferred way to name a size — it says what the text is — so
  // it has to count as being on the scale, not as leaving it.
  for (const m of semantic.matchAll(
    /(--move-(?:size|type)-[a-z0-9]+):\s*var\((--move-text-[a-z0-9]+)\)/g,
  )) {
    if (scale.has(m[2])) scale.add(m[1]);
  }
  return scale;
}

const SCALE = loadScale();

function cssFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...cssFiles(full));
    else if (entry.endsWith('.module.css')) out.push(full);
  }
  return out;
}

const problems = [];

for (const file of cssFiles(COMPONENTS)) {
  const rel = relative(MOVE_ROOT, file);
  const lines = readFileSync(file, 'utf8').split('\n');

  // Component tokens as declared AT DEFAULT — outside any [data-size] block.
  //
  // Taking the last declaration in the file instead let two components through:
  // Autocomplete declared its trigger size only under `sm` and `lg`, so the md
  // default fell through to a `var(…, inherit)` fallback while the resolver
  // happily read the lg value and called it a step. A token that only a variant
  // sets has no default, and the fallback is what actually ships.
  const local = new Map();
  let inVariant = false;
  lines.forEach((line) => {
    // A block naming a specific size is a variant — UNLESS it also carries
    // `:not([data-size])`, which is how the md default is written throughout
    // this library: `.root[data-size='md'], .root:not([data-size])`. Reading
    // that as a variant hid Pagination's perfectly good default.
    if (/\{\s*$/.test(line)) {
      inVariant = /data-size=/.test(line) && !/:not\(\[data-size\]\)/.test(line);
    }
    const m = /^\s*(--move-[a-zA-Z0-9-]+):\s*([^;]+);/.exec(line);
    if (m && !inVariant) local.set(m[1], m[2].trim());
  });

  const resolveOne = (v) => {
    const m = /^var\((--move-[a-zA-Z0-9-]+)\)$/.exec(v.trim());
    return m ? m[1] : v.trim();
  };

  const resolve = (value, depth = 0) => {
    const v = value.trim();
    const m = /^var\((--move-[a-zA-Z0-9-]+)(?:\s*,.*)?\)$/.exec(v);
    if (m && depth < 6) return local.has(m[1]) ? resolve(local.get(m[1]), depth + 1) : m[1];
    return v;
  };

  lines.forEach((line, i) => {
    if (/^\s*(\/\/|\/\*|\*)/.test(line)) return;
    if (/type-exempt/.test(line)) return;

    // 1. A *-font-size TOKEN must name a step. `inherit` here is the trap above.
    const token = /^\s*(--move-[a-zA-Z0-9-]*font-size):\s*([^;]+);/.exec(line);
    if (token) {
      const resolved = resolve(token[2]);
      if (!SCALE.has(resolved)) {
        problems.push({
          rel,
          line: i + 1,
          msg: `${token[1]} is \`${token[2].trim()}\` — not a step on the type scale`,
        });
      }
      return;
    }

    // 2. A direct font-size must resolve to a step, or be a plain keyword.
    const decl = /^\s*font-size:\s*([^;]+);/.exec(line);
    if (!decl) return;
    const raw = decl[1].trim();
    if (raw === 'inherit' || raw === 'unset' || raw === '1em' || raw === 'inherit !important') return;
    // `var(--x, inherit)` ships the fallback whenever --x has no default.
    // A fallback that itself names a step is fine — that IS a default, written
    // at the point of use. Only a fallback OFF the scale is the bug.
    const fallback = /^var\((--move-[a-zA-Z0-9-]+),\s*(.+)\)$/.exec(raw);
    if (fallback) {
      if (local.has(fallback[1]) || SCALE.has(resolveOne(fallback[2]))) return;
      problems.push({
        rel,
        line: i + 1,
        msg: `font-size falls back to \`${fallback[2].trim()}\` — ${fallback[1]} has no default`,
      });
      return;
    }
    const resolved = resolve(raw);
    if (!SCALE.has(resolved)) {
      problems.push({ rel, line: i + 1, msg: `font-size: ${raw} — not a step on the type scale` });
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Slot typography ↔ rendered size
// ─────────────────────────────────────────────────────────────────────────────

const ROLE_OF = {
  '--move-text-lg': 'title', '--move-size-lg': 'title', '--move-type-title': 'title',
  '--move-text-base': 'body', '--move-size-base': 'body', '--move-type-body': 'body',
  '--move-text-sm': 'ui', '--move-size-sm': 'ui', '--move-type-ui': 'ui',
  '--move-text-xs': 'meta', '--move-size-xs': 'meta', '--move-type-meta': 'meta',
};

for (const file of cssFiles(COMPONENTS)) {
  const specPath = file.replace(/\.module\.css$/, '.spec.ts');
  if (!existsSync(specPath)) continue;
  const rel = relative(MOVE_ROOT, specPath);
  const lines = readFileSync(file, 'utf8').split('\n');

  const local = new Map();
  let inVariant = false;
  for (const line of lines) {
    if (/\{\s*$/.test(line)) {
      inVariant = /data-size=/.test(line) && !/:not\(\[data-size\]\)/.test(line);
    }
    const m = /^\s*(--move-[a-zA-Z0-9-]+):\s*([^;]+);/.exec(line);
    if (m && !inVariant) local.set(m[1], m[2].trim());
  }
  const resolve = (v, d = 0) => {
    const t = v.trim();
    const m = /^var\((--move-[a-zA-Z0-9-]+)(?:\s*,[^)]*)?\)$/.exec(t);
    if (m && d < 6) return local.has(m[1]) ? resolve(local.get(m[1]), d + 1) : m[1];
    return t;
  };

  const rendered = new Map();
  const css = lines.join('\n');
  for (const m of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const sel = m[1].trim().split('\n').pop();
    if (/data-size=/.test(sel) && !/:not\(\[data-size\]\)/.test(sel)) continue;
    const fs = /font-size:\s*([^;]+);/.exec(m[2]);
    if (!fs) continue;
    const role = ROLE_OF[resolve(fs[1])];
    if (!role) continue;
    for (const c of sel.matchAll(/\.([a-zA-Z][\w-]*)/g)) {
      if (!rendered.has(c[1])) rendered.set(c[1], role);
    }
  }

  const spec = readFileSync(specPath, 'utf8');
  for (const m of spec.matchAll(
    /name: '([^']+)',\s*element: '[^']*',\s*typography: '(\w+)'/g,
  )) {
    const [, slot, declared] = m;
    const actual = rendered.get(slot) ?? 'none';
    if (declared !== actual) {
      problems.push({
        rel,
        line: 0,
        msg: `slot '${slot}' declares typography '${declared}' but renders '${actual}'`,
      });
    }
  }
}

if (problems.length === 0) {
  console.log(`✓ type-scale: every font-size resolves to the scale (${SCALE.size} steps).`);
  process.exit(0);
}

console.log(`✗ type-scale: ${problems.length} size(s) off the scale.`);
for (const p of problems) console.log(`\n  [styles-16] ${p.rel}:${p.line} — ${p.msg}`);
console.log(`\n  → name a step (var(--move-size-sm) for controls, var(--move-size-base) for copy),`);
console.log(`    or mark a deliberate exception with a /* type-exempt: reason */ comment.`);
process.exit(1);
