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
 *
 * WHICH checks run is mostly answered by WHERE the code is: a project with no
 * composites root gives purity nothing to read, so it passes without being
 * configured off. What the roots cannot say is that a project wants a check it
 * does not get by default, or does not want one it does:
 *
 *   { "check": { "enable": ["creation"], "disable": ["purity"] } }
 *
 * Stated as exceptions rather than as an exhaustive list on purpose. A list
 * freezes the set — a check added to Move later would silently never run for
 * that project, which is the opposite of what a ratchet is for.
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
    /**
     * When set, the run is narrowed to these absolute paths — a commit hook
     * checking only what is staged, so the gate is fast enough to survive
     * being run on every commit.
     *
     * `null` means the whole project, which is what a push or CI wants. A
     * check that cannot answer honestly from a subset must say so rather than
     * filter: see composite-spec-drift, which takes the pair when EITHER side
     * is listed, because a spec judged against an unstaged source is a verdict
     * about a file the commit is not changing.
     */
    only: null,
    /** Checks this project wants beyond the defaults (e.g. `creation`). */
    enable: toArray(user.enable),
    /** Checks this project has opted out of, with the rest still arriving. */
    disable: toArray(user.disable),
  };
}

/** Narrow a check's file list to the run's scope. */
export function inScope(config, file) {
  return !config.only || config.only.has(file);
}
