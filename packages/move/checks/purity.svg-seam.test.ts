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

  it('allows a drawing component — a function whose whole output is an svg', () => {
    // The local twin of an SVGR import. `<Logo />` is a capitalised tag the
    // check cannot judge either way, so forbidding the hand-written version
    // would be a rule about where the shapes were typed, not what they are.
    const messages = check(`
      function Chip() {
        return (
          <svg viewBox="0 0 10 10">
            <rect className="illustration-panel" />
          </svg>
        );
      }
      export default Chip;
    `);
    expect(messages).toEqual([]);
  });

  it('still flags shapes loose in a page', () => {
    // What the rule was always for: a shape sitting next to prose and layout,
    // with no frame and no name.
    const messages = check(`
      import { Stack, Text } from 'move';
      export function Page() {
        return (
          <Stack>
            <Text>Hello</Text>
            <circle cx="5" cy="5" r="4" />
          </Stack>
        );
      }
    `);
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain('<circle>');
  });

  it('refuses a name on the drawing, because the frame owns it', () => {
    // Illustration puts role="img" and the name on a wrapper, and ARIA makes
    // that wrapper's children presentational. An export stamped with its own
    // aria-label produces a WRONG accessible name that axe cannot flag, because
    // a name does exist.
    const messages = check(`
      import { Illustration } from 'move';
      export function Bad() {
        return (
          <Illustration title="t">
            <svg viewBox="0 0 10 10" role="img" aria-label="Illustration">
              <rect className="illustration-panel" />
            </svg>
          </Illustration>
        );
      }
    `);
    expect(messages).toHaveLength(2);
    expect(messages.join(' ')).toContain('svg-naming');
    expect(messages.join(' ')).toContain('role');
    expect(messages.join(' ')).toContain('aria-label');
  });

  it('allows a drawing that says nothing about itself', () => {
    const messages = check(`
      import { Illustration } from 'move';
      export function Good() {
        return (
          <Illustration title="t">
            <svg viewBox="0 0 10 10" width="10" height="10">
              <rect className="illustration-panel" />
            </svg>
          </Illustration>
        );
      }
    `);
    expect(messages).toEqual([]);
  });

  it('catches an id used twice, which is one document away from breaking', () => {
    // Harmless until a drawing uses url(#clip0) and a second drawing on the
    // same page reuses the id — then every reference resolves to the first.
    const messages = check(`
      import { Illustration } from 'move';
      export function Bad() {
        return (
          <Illustration title="t">
            <svg viewBox="0 0 10 10">
              <clipPath id="clip0"><rect /></clipPath>
              <clipPath id="clip0"><rect /></clipPath>
            </svg>
          </Illustration>
        );
      }
    `);
    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain('duplicate-id');
    expect(messages[0]).toContain('clip0');
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
