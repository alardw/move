/**
 * The consumer-facing CLI — `move hooks` and `move check`.
 *
 * This is the one shipped surface with no other gate on it: the library has
 * thousands of tests and the thing consumers actually type had none. What makes
 * that worth covering is the DIRECTION its bugs fail in. A scoping mistake in
 * `--staged` makes checks pass, and a hook that wrongly passes is
 * indistinguishable from a clean commit — nobody reports it, because from the
 * outside nothing happened.
 *
 * So these drive the real binary in real git repositories rather than importing
 * the modules: what is being asserted is the behaviour a consumer gets, down to
 * the exit code a hook reads.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

// Resolved from the working directory rather than import.meta.url, which vitest
// rewrites to a non-file scheme. Both entry points — the workspace script and a
// --root run — put the cwd at the package, with the repo root as the fallback.
const CLI = [
  resolve(process.cwd(), 'bin/cli.mjs'),
  resolve(process.cwd(), 'packages/move/bin/cli.mjs'),
].find((p) => existsSync(p))!;

let dir: string;

/** Run the CLI, returning its exit status and combined output rather than throwing. */
function run(args: string[], cwd = dir) {
  try {
    const out = execFileSync('node', [CLI, ...args], { cwd, encoding: 'utf8', stdio: 'pipe' });
    return { status: 0, out };
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    return { status: err.status ?? 1, out: (err.stdout ?? '') + (err.stderr ?? '') };
  }
}

const git = (...args: string[]) => execFileSync('git', args, { cwd: dir, stdio: 'pipe' });

/** A component whose props extend Record — what strict-props exists to reject. */
const VIOLATION = `export interface BadProps extends Record<string, unknown> {
  title: string;
}
`;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'move-cli-'));
  git('init', '-q', '.');
  git('config', 'user.email', 'test@example.com');
  git('config', 'user.name', 'test');
  mkdirSync(join(dir, 'src', 'components'), { recursive: true });
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe('move hooks', () => {
  it('installs both hooks and points git at them', () => {
    const { status, out } = run(['hooks']);
    expect(status).toBe(0);
    expect(existsSync(join(dir, '.githooks', 'pre-commit'))).toBe(true);
    expect(existsSync(join(dir, '.githooks', 'pre-push'))).toBe(true);
    expect(out).toContain('core.hooksPath');
    expect(
      execFileSync('git', ['config', '--get', 'core.hooksPath'], {
        cwd: dir,
        encoding: 'utf8',
      }).trim(),
    ).toBe('.githooks');
  });

  it('keeps a hook that is already there', () => {
    run(['hooks']);
    writeFileSync(join(dir, '.githooks', 'pre-commit'), '#!/usr/bin/env sh\n# mine\n');
    const { status, out } = run(['hooks']);
    expect(status).toBe(0);
    expect(out).toContain('already exists');
    // The project's own work survives a re-run — overwriting it silently is how
    // you delete something nobody remembers writing.
    expect(readFileSync(join(dir, '.githooks', 'pre-commit'), 'utf8')).toContain('# mine');
  });

  it('replaces it when asked to', () => {
    run(['hooks']);
    writeFileSync(join(dir, '.githooks', 'pre-commit'), '# mine\n');
    run(['hooks', '--force']);
    expect(readFileSync(join(dir, '.githooks', 'pre-commit'), 'utf8')).toContain('move check');
  });

  it('refuses to repoint a hooks path that belongs to another runner', () => {
    git('config', 'core.hooksPath', '.husky');
    const { status, out } = run(['hooks']);
    expect(status).toBe(1);
    expect(out).toContain('.husky');
    // Repointing would silently disable whatever is installed there.
    expect(
      execFileSync('git', ['config', '--get', 'core.hooksPath'], {
        cwd: dir,
        encoding: 'utf8',
      }).trim(),
    ).toBe('.husky');
  });

  it('--print installs nothing', () => {
    const { status, out } = run(['hooks', '--print']);
    expect(status).toBe(0);
    expect(out).toContain('move check --staged');
    expect(existsSync(join(dir, '.githooks'))).toBe(false);
  });

  it('says so outside a git repository', () => {
    const loose = mkdtempSync(join(tmpdir(), 'move-nogit-'));
    try {
      const { status, out } = run(['hooks'], loose);
      expect(status).toBe(1);
      expect(out).toContain('git repository');
    } finally {
      rmSync(loose, { recursive: true, force: true });
    }
  });
});

describe('move check --staged', () => {
  beforeEach(() => {
    writeFileSync(join(dir, 'src', 'components', 'Bad.tsx'), VIOLATION);
  });

  it('passes when the violation is not staged', () => {
    // The commit does not touch it, so the commit is not what introduced it.
    // A commit hook that fails here would block work on unrelated files.
    const { status } = run(['check', '--staged']);
    expect(status).toBe(0);
  });

  it('fails when the violation is staged', () => {
    git('add', 'src/components/Bad.tsx');
    const { status, out } = run(['check', '--staged']);
    expect(status).not.toBe(0);
    expect(out).toContain('strict-props');
  });

  it('fails on a whole-project run either way', () => {
    const { status } = run(['check']);
    expect(status).not.toBe(0);
  });

  it('judges a spec against its source when only the source is staged', () => {
    // The case a per-file filter gets wrong, and the common one: you edit a
    // composite and leave its spec alone, which IS the drift. Filtering on the
    // staged spec would find nothing to check and pass.
    mkdirSync(join(dir, 'src', 'composites'), { recursive: true });
    writeFileSync(
      join(dir, 'src', 'composites', 'Thing.spec.ts'),
      `export const spec = { name: 'Thing', composition: ['Button'] };\n`,
    );
    writeFileSync(
      join(dir, 'src', 'composites', 'Thing.tsx'),
      `import { Stack } from 'move';\nexport function Thing() { return <Stack />; }\n`,
    );
    git('add', 'src/composites/Thing.tsx');

    const { status, out } = run(['check', '--staged']);
    expect(status).not.toBe(0);
    expect(out).toContain('drift');
  });
});

describe('choosing what runs', () => {
  const config = (o: unknown) =>
    writeFileSync(join(dir, 'move.config.json'), JSON.stringify({ check: o }));

  it('runs the three defaults with no config', () => {
    const { out } = run(['check']);
    for (const name of ['strict-props', 'purity', 'composite-spec-drift']) {
      expect(out).toContain(name);
    }
  });

  it('drops a disabled check', () => {
    config({ disable: ['purity'] });
    const { out } = run(['check']);
    expect(out).toContain('strict-props');
    expect(out).not.toContain('purity');
  });

  it('adds an enabled one', () => {
    config({ enable: ['creation'] });
    const { out } = run(['check']);
    expect(out).toContain('creation');
  });

  it('runs a named check even where the project disabled it', () => {
    config({ disable: ['purity'] });
    const { out } = run(['check', 'purity']);
    expect(out).toContain('purity');
  });

  it('names an unknown check rather than ignoring it', () => {
    // The quiet failure this prevents: a misspelled entry reads as nothing, the
    // check keeps running, and the project believes it was turned off.
    config({ disable: ['purty'] });
    const { status, out } = run(['check']);
    expect(status).toBe(1);
    expect(out).toContain('unknown check');
  });

  it('says when everything is disabled', () => {
    config({ disable: ['strict-props', 'purity', 'composite-spec-drift'] });
    const { status, out } = run(['check']);
    expect(status).toBe(0);
    expect(out).toContain('nothing to run');
  });
});
