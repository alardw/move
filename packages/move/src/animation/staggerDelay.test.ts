import { describe, it, expect } from 'vitest';
import { resolveDelay } from './staggerAnimate';

// The delay a stagger asks for is right in the middle of the range and wrong at
// both ends of it, so the runtime resolves one rather than using it as given.
describe('resolveDelay', () => {
  it('moves a short menu as one thing', () => {
    // A stagger conveys arrival ORDER, and order needs a sequence to be read as
    // one. Two or three items are taken in at a glance, so revealing them one
    // after another reads as the menu lagging rather than as motion.
    expect(resolveDelay(30, 1)).toBe(0);
    expect(resolveDelay(30, 2)).toBe(0);
    expect(resolveDelay(30, 4)).toBe(0);
  });

  it('staggers once there is a sequence to perceive', () => {
    expect(resolveDelay(30, 5)).toBe(30);
    expect(resolveDelay(30, 9)).toBe(30);
  });

  it('holds a long menu to the same reveal as a short one', () => {
    // At the asked-for 30ms, twenty items would put the last one 570ms after
    // the first — a queue, not a stagger. The gap closes up instead.
    for (const count of [13, 21, 40]) {
      const delay = resolveDelay(30, count);
      expect(delay).toBeLessThan(30);
      expect((count - 1) * delay).toBeCloseTo(240, 5);
    }
  });

  it('never stretches past what was asked for', () => {
    // The budget shrinks the gap; it must not widen one that already fits.
    expect(resolveDelay(10, 6)).toBe(10);
  });

  it('lets a component set its own threshold and budget', () => {
    expect(resolveDelay(30, 3, { threshold: 2 })).toBe(30);
    expect(resolveDelay(30, 5, { threshold: 9 })).toBe(0);
    expect(resolveDelay(30, 5, { maxTotal: 80 })).toBe(20);
  });
});
