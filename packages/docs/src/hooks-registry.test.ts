import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, it, expect } from "vitest";
import { HOOKS_REGISTRY } from "./content/hooks";

// Enforces "document all hooks": every general-purpose (cross-cutting) hook the
// `move` barrel exports must have a registry entry, and every registry entry
// must still be a real `move` export. Component-headless hooks (exported from
// components/*) are documented on their component pages and excluded here.

const here = dirname(fileURLToPath(import.meta.url));
const barrelSrc = readFileSync(
  resolve(here, "../../move/src/index.ts"),
  "utf8",
);

// Cross-cutting layers whose exported hooks are general-purpose. Hooks from
// components/* are component-headless (excluded), except EXTRA_GENERAL.
const GENERAL_LAYER_PREFIXES = [
  "./engine",
  "./hooks",
  "./animation",
  "./infrastructure",
];
const EXTRA_GENERAL = new Set(["useSidebarContext"]);

/** Map every barrel-exported `use*` value name → its source module specifier. */
function parseBarrelHooks(raw: string): Map<string, string> {
  // Strip comments first — export blocks are multi-line and interleave `//`
  // group headers between names, which would otherwise fuse into a name token.
  const src = raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  const out = new Map<string, string>();
  const re = /export\s+(?:type\s+)?\{([^}]*)\}\s*from\s*['"]([^'"]+)['"]/gs;
  for (const m of src.matchAll(re)) {
    const block = m[1];
    const specifier = m[2];
    for (const raw of block.split(",")) {
      const name = raw
        .trim()
        .split(/\s+as\s+/)[0]
        .trim();
      if (/^use[A-Z]/.test(name)) out.set(name, specifier);
    }
  }
  return out;
}

const barrelHooks = parseBarrelHooks(barrelSrc);

const generalHooks = [...barrelHooks.entries()]
  .filter(
    ([name, spec]) =>
      EXTRA_GENERAL.has(name) ||
      GENERAL_LAYER_PREFIXES.some((p) => spec.startsWith(p)),
  )
  .map(([name]) => name);

const documented = new Set(HOOKS_REGISTRY.map((h) => h.name));

describe("hooks registry", () => {
  it("parses at least the known general hooks from the move barrel", () => {
    // Guards against the regex silently matching nothing (which would make the
    // coverage assertion vacuously pass).
    expect(barrelHooks.has("useInView")).toBe(true);
    expect(generalHooks.length).toBeGreaterThan(10);
  });

  it("documents every general-purpose hook exported from move", () => {
    const undocumented = generalHooks.filter((n) => !documented.has(n)).sort();
    expect(
      undocumented,
      `these cross-cutting hooks are exported from 'move' but missing from src/content/hooks.ts`,
    ).toEqual([]);
  });

  it("has no stale entries (every registry hook is still a move export)", () => {
    const stale = [...documented].filter((n) => !barrelHooks.has(n)).sort();
    expect(
      stale,
      `these registry entries are no longer exported from 'move'`,
    ).toEqual([]);
  });

  it("has no duplicate entries", () => {
    const names = HOOKS_REGISTRY.map((h) => h.name);
    expect(names.length).toBe(new Set(names).size);
  });
});
