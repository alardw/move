/**
 * Move validation config resolver — shared by the shipped consumer-facing
 * checks (run via `move check`) AND by Move's own `check:*` scripts, so there is
 * one implementation, not two.
 *
 * A project may declare roots in `move.config.json` at its root:
 *
 *   { "check": { "components": "src/components", "recipes": "src/recipes",
 *                "samples": "src/samples", "theme": "src/theme.css" } }
 *
 * (the `check` wrapper is optional — top-level keys also work). Each root may be
 * a string or an array of strings. Anything omitted falls back to Move-app
 * defaults; a path that doesn't exist on disk is dropped, so a project without
 * recipes simply skips recipe checks.
 *
 * Returns each root resolved to an array of absolute, existing dirs (`theme` is
 * a single file path or null).
 */
import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';

const DEFAULTS = {
  components: 'src/components',
  infrastructure: null,
  recipes: 'src/recipes',
  composites: 'src/composites',
  samples: null,
  theme: null,
};

const toArray = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

export function loadConfig(cwd = process.cwd()) {
  const file = join(cwd, 'move.config.json');
  let user = {};
  if (existsSync(file)) {
    try {
      const parsed = JSON.parse(readFileSync(file, 'utf8'));
      user = parsed.check ?? parsed;
    } catch (e) {
      console.error(`move: could not parse ${file}: ${e.message}`);
      process.exit(1);
    }
  }
  const merged = { ...DEFAULTS, ...user };
  const abs = (p) => (isAbsolute(p) ? p : join(cwd, p));
  const dirs = (v) => toArray(v).map(abs).filter(existsSync);
  const themePath = merged.theme ? abs(merged.theme) : null;
  return {
    cwd,
    components: dirs(merged.components),
    infrastructure: dirs(merged.infrastructure),
    recipes: dirs(merged.recipes),
    composites: dirs(merged.composites),
    samples: dirs(merged.samples),
    theme: themePath && existsSync(themePath) ? themePath : null,
  };
}
