import { describe, it, expect } from 'vitest';
import { staggerOffset, defaultMaxTotal, withStaggerDelay } from './staggerAnimate';

// The delay a stagger asks for is right at the head of the list and wrong at the
// tail, so the runtime spends a fixed budget unevenly rather than dividing it.
describe('staggerOffset', () => {
  it('starts the first item immediately', () => {
    expect(staggerOffset(0, 30)).toBe(0);
  });

  it('spaces the first items by very nearly the delay asked for', () => {
    // The gap the eye actually reads. It must survive the list getting longer,
    // which is exactly what dividing the budget by the count failed to do.
    expect(staggerOffset(1, 60, 480)).toBeCloseTo(56.4, 1);
    expect(staggerOffset(2, 60, 480) - staggerOffset(1, 60, 480)).toBeCloseTo(49.8, 1);
  });

  it('holds the same head spacing however many children there are', () => {
    // 6 items or 600, the first gap is the same — the count does not enter.
    const gap = staggerOffset(1, 60, 480);
    for (const i of [6, 20, 60, 600]) {
      expect(staggerOffset(1, 60, 480)).toBe(gap);
      expect(staggerOffset(i, 60, 480)).toBeLessThanOrEqual(480);
    }
  });

  it('never reaches the budget, so the reveal is bounded for any count', () => {
    for (const count of [13, 21, 40, 200, 10_000]) {
      expect(staggerOffset(count - 1, 30, 240)).toBeLessThanOrEqual(240);
    }
  });

  it('lets a component set its own budget', () => {
    expect(staggerOffset(50, 30, 80)).toBeLessThan(80);
    expect(staggerOffset(50, 30, 800)).toBeGreaterThan(80);
  });

  it('moves every item later than the one before it', () => {
    for (let i = 1; i < 40; i++) {
      expect(staggerOffset(i, 30, 240)).toBeGreaterThan(staggerOffset(i - 1, 30, 240));
    }
  });

  it('has nothing to space out with no delay', () => {
    expect(staggerOffset(5, 0, 240)).toBe(0);
  });
});

// The budget is a consequence of the per-item duration, not a second free
// number that can silently contradict it.
describe('defaultMaxTotal', () => {
  it('scales with the duration it has to accommodate', () => {
    expect(defaultMaxTotal(220)).toBe(436);
    expect(defaultMaxTotal(440)).toBe(871);
    expect(defaultMaxTotal(440)).toBeCloseTo(defaultMaxTotal(220) * 2, -1);
  });
});

// How a step's own `delay` meets the stagger's.
//
// anime resolves a per-property delay as `setValue(key.delay, globalDelay)` —
// the property's value wins and the global is only a fallback. So a step that
// wrote `opacity: { …, delay: 80 }` next to a stagger discarded the stagger for
// that property and animated every item at a flat 80ms. Tabs and Sidebar both
// did, and neither reveal staggered at all.
describe('withStaggerDelay', () => {
  const offset = (i: number) => i * 10;

  it('drops a blanket delay — the stagger is the delay', () => {
    const out = withStaggerDelay({ delay: 80, opacity: { from: 0, to: 1 } } as never, offset);
    expect(out).not.toHaveProperty('delay');
    expect(out.opacity).toEqual({ from: 0, to: 1 });
  });

  it('keeps a per-property delay as a lead-in and adds the stagger to it', () => {
    const out = withStaggerDelay({ opacity: { from: 0, to: 1, delay: 80 } } as never, offset) as {
      opacity: { delay: (el: unknown, i: number) => number };
    };
    // item 0 waits only the lead; later items wait the lead plus their offset,
    // so the hold is shared and the sweep still happens after it.
    expect(out.opacity.delay(null, 0)).toBe(80);
    expect(out.opacity.delay(null, 3)).toBe(110);
  });

  it('leaves a property with no delay to the global stagger', () => {
    const out = withStaggerDelay({ scale: { from: 0.9, to: 1 } } as never, offset);
    expect(out.scale).toEqual({ from: 0.9, to: 1 });
  });
});
