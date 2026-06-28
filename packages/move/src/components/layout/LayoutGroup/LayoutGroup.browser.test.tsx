import { render, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import { LayoutGroup } from './LayoutGroup';

// Real-browser invariant tests for the FLIP engine (useAutoLayout). These assert
// PARAMETER-INDEPENDENT properties that must hold for any correct FLIP — not a
// specific curve/duration/easing — so they stay reliable across configs.

afterEach(cleanup);

const microtasks = async () => { await Promise.resolve(); await Promise.resolve(); };
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const near = (a: number, b: number, eps = 3) => Math.abs(a - b) <= eps;

function List({ order }: { order: string[] }) {
  return (
    <LayoutGroup duration={300}>
      {order.map((id) => (
        <div key={id} data-id={id} style={{ height: '40px', background: '#ddd', marginBottom: '8px' }}>
          {id}
        </div>
      ))}
    </LayoutGroup>
  );
}

const top = (root: Element, id: string) =>
  (root.querySelector(`[data-id="${id}"]`) as HTMLElement).getBoundingClientRect().top;
const el = (root: Element, id: string) => root.querySelector(`[data-id="${id}"]`) as HTMLElement;

describe('useAutoLayout — FLIP invariants (real browser)', () => {
  it('INVARIANT: the first frame after a move shows the OLD position (no flash / bounce-to-previous)', async () => {
    const { rerender, container } = render(<List order={['a', 'b', 'c']} />);
    const root = container.firstElementChild!;
    const oldTop = top(root, 'a');

    // Reorder: "a" moves to the bottom (a real layout change).
    rerender(<List order={['b', 'c', 'a']} />);
    // Flush the MutationObserver microtask (which applies the synchronous invert)
    // but stop BEFORE anime's first rAF tick.
    await microtasks();

    const afterCommit = top(root, 'a');
    // Correct FLIP: "a" is visually still at (near) its OLD spot — the invert.
    // The flash bug would leave it at its NEW spot for a frame first.
    expect(near(afterCommit, oldTop)).toBe(true);
  });

  it('INVARIANT: settles at the new layout position with no leftover inline transform', async () => {
    const { rerender, container } = render(<List order={['a', 'b', 'c']} />);
    const root = container.firstElementChild!;
    const cOldTop = top(root, 'c'); // c is last; after reorder it should move up

    rerender(<List order={['c', 'a', 'b']} />);
    await sleep(600); // well past duration (300ms)

    expect(el(root, 'c').style.transform).toBe(''); // cleaned up
    expect(top(root, 'c')).toBeLessThan(cOldTop);    // c actually moved up to the top
  });

  it('INVARIANT: a reorder keeps every child (none mistaken for an exit) at its new position', async () => {
    const { rerender, container } = render(<List order={['a', 'b', 'c', 'd']} />);
    const root = container.firstElementChild!;

    rerender(<List order={['d', 'c', 'b', 'a']} />);
    await sleep(600);

    // All four survive — a moved node must not be re-homed/removed via the exit path.
    for (const id of ['a', 'b', 'c', 'd']) {
      expect(root.querySelector(`[data-id="${id}"]`), `${id} missing`).toBeTruthy();
    }
    const ids = [...root.querySelectorAll('[data-id]')].map((e) => e.getAttribute('data-id'));
    expect(ids).toEqual(['d', 'c', 'b', 'a']);
    // a (was first) ends below d (was last).
    expect(top(root, 'a')).toBeGreaterThan(top(root, 'd'));
  });
});
