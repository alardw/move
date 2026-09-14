// check:purity — the SVG seam oracle.
// @enforces purity-1 icons-1
//
// Composed code may not contain raw elements, and for a long time that rule had
// a hole: a one-off diagram had nowhere to go. Icons resolve through
// `iconResolver`; a drawing is not an icon. Code that needed one simply broke
// the rule — a consumer's animated logo carries raw <svg>, <g>, <path>, <rect>
// and <filter> in one file, because there was nothing to follow.
//
// `Illustration` is the seam, and the scoping is what makes being inside it mean
// something. Four behaviours, each of which fails SILENTLY if the AST walk is
// refactored — the check would simply stop flagging, or start flagging
// everything, and the summary line would look the same either way.
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// @ts-expect-error — plain .mjs check, no types
import { run } from './purity.mjs';

let dir: string;

const config = () => ({
  cwd: dir,
  recipes: [join(dir, 'src')],
  composites: [],
  samples: [],
  only: null,
});

/** Write one composed file and return purity's messages for it. */
function check(source: string): string[] {
  writeFileSync(join(dir, 'src', 'probe.tsx'), source);
  return run(config()).messages as string[];
}

beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), 'move-purity-'));
  mkdirSync(join(dir, 'src'));
});
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe('purity — SVG inside the Illustration seam', () => {
  it('flags a shape outside the seam, and names the seam in the message', () => {
    const messages = check(`
      export function Bad() {
        return <path d="M0 0h10v10H0z" />;
      }
    `);
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain('raw-svg');
    expect(messages[0]).toContain('<path>');
    // The fix is a component, so the message has to say which one.
    expect(messages[0]).toContain('Illustration');
  });

  it('allows shapes nested inside the seam', () => {
    const messages = check(`
      import { Illustration } from 'move';
      export function Good() {
        return (
          <Illustration title="t" viewBox="0 0 10 10">
            <g>
              <rect x="0" y="0" width="10" height="10" />
              <path d="M0 0h10v10H0z" />
            </g>
          </Illustration>
        );
      }
    `);
    expect(messages).toEqual([]);
  });

  it('does not let the seam launder raw HTML', () => {
    const messages = check(`
      import { Illustration } from 'move';
      export function Bad() {
        return (
          <Illustration title="t" viewBox="0 0 10 10">
            <div>not a shape</div>
          </Illustration>
        );
      }
    `);
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain('raw-html');
    expect(messages[0]).toContain('<div>');
  });

  it('keeps foreignObject out, which would reopen the hole', () => {
    // foreignObject embeds arbitrary HTML inside the SVG. Allowing it would make
    // the seam a way to smuggle a whole markup tree past every rule above.
    const messages = check(`
      import { Illustration } from 'move';
      export function Bad() {
        return (
          <Illustration title="t" viewBox="0 0 10 10">
            <foreignObject />
          </Illustration>
        );
      }
    `);
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain('<foreignObject>');
  });

  it('keeps SMIL out, so motion stays in the animation system', () => {
    // <animate> would bypass useAnimations entirely — and reduced-motion with
    // it. Illustration takes an `animations` prop for this.
    const messages = check(`
      import { Illustration } from 'move';
      export function Bad() {
        return (
          <Illustration title="t" viewBox="0 0 10 10">
            <animate attributeName="opacity" to="1" />
          </Illustration>
        );
      }
    `);
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain('<animate>');
  });

  it('still flags an inline style inside the seam', () => {
    // The point of being inside the seam is that colour and geometry come from
    // tokens. An inline style is the thing that bypasses them.
    const messages = check(`
      import { Illustration } from 'move';
      export function Bad() {
        return (
          <Illustration title="t" viewBox="0 0 10 10">
            <g style={{ opacity: 0 }} />
          </Illustration>
        );
      }
    `);
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain('inline-style');
  });
});
