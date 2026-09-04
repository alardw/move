import { describe, it, expect } from 'vitest';
import { resolveStagger } from './staggerAnimate';

// The delay a stagger asks for is right until the list gets long, so the runtime
// resolves one rather than using it as given.
describe('resolveStagger', () => {
  it('uses the delay it was given while the reveal fits', () => {
    expect(resolveStagger(30, 2)).toBe(30);
    expect(resolveStagger(30, 3)).toBe(30);
    expect(resolveStagger(30, 9)).toBe(30);
  });

  it('holds a long menu to the same reveal as a short one', () => {
    // At the asked-for 30ms, twenty items would put the last one 570ms after
    // the first — a queue, not a stagger. The gap closes up instead.
    for (const count of [13, 21, 40]) {
      const delay = resolveStagger(30, count);
      expect(delay).toBeLessThan(30);
      expect((count - 1) * delay).toBeCloseTo(240, 5);
    }
  });

  it('never stretches past what was asked for', () => {
    // The budget shrinks the gap; it must not widen one that already fits.
    expect(resolveStagger(10, 6)).toBe(10);
  });

  it('lets a component set its own budget', () => {
    expect(resolveStagger(30, 5, { maxTotal: 80 })).toBe(20);
  });

  it('has nothing to space out with a single child', () => {
    expect(resolveStagger(30, 1)).toBe(30);
  });
});
