#!/usr/bin/env node
/**
 * Creation gate (consumer-facing; opt-in).
 *
 * Validates that a project is a well-formed Move app — the required files exist
 * with their invariants, package.json resolves to the exact deps + scripts the
 * options imply, and move.config.json points the conformance gates at the
 * composites root. This is the VERIFY half of the creation contract that
 * `create-move` GENERATES from; both read the single source
 * (`scaffold/creation-spec.mjs`) through `scaffold/validate.mjs`, so a scaffold
 * that drifts from the contract fails here.
 *
 * Opt-in (`move check creation`), not part of the default `move check` run: it
 * asserts a whole-app shape, which only makes sense for a scaffolded Move app,
 * not for every project that runs the component/composite checks.
 */
import { validateProject } from '../scaffold/validate.mjs';
import { loadConfig } from './_config.mjs';

export function run(config) {
  // Options aren't recorded in the project; validateProject infers the two that
  // matter (router + icons) from the installed dependencies.
  const res = validateProject(config.cwd);
  return {
    name: 'creation',
    ok: res.ok,
    summary: res.ok
      ? `valid Move app — ${res.checked} required files, deps + scripts + move.config match the creation spec`
      : `${res.errors.length} issue(s) — project drifts from the creation spec`,
    messages: res.errors,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const res = run(loadConfig());
  if (!res.ok) {
    console.error(`✗ creation: ${res.summary}\n`);
    console.error(res.messages.map((m) => `  ${m}`).join('\n'));
    process.exit(1);
  }
  console.log(`✓ creation: ${res.summary}.`);
}
