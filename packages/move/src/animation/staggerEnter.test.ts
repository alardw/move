import { describe, it, expect } from 'vitest';
import { staggerEnter } from './staggerEnter';

// `staggerAnimate` only seeds an initial (`from`) state for `opacity` and
// `scale`. Animating any other property through the child-stagger path leaves
// the first frame unseeded and renders incorrectly. This test pins the helper
// to that supported set so the recurring "stagger wired with translateY/etc."
// regression can't come back.
const SEEDABLE = new Set(['opacity', 'scale']);

describe('staggerEnter', () => {
  it('builds a Root.enter child-stagger trigger', () => {
    const trigger = staggerEnter();
    expect(trigger.trigger).toBe('Root.enter');
    const step = (trigger.sequence as any[])[0];
    expect(step.target).toBe('Root');
    expect(step.children).toBe(':scope > *');
    expect(step.stagger).toEqual({ delay: 60, from: 'first', maxTotal: 436 });
  });

  it('animates ONLY runtime-seedable properties (opacity + scale)', () => {
    const step = (staggerEnter().sequence as any[])[0];
    const animatedProps = Object.keys(step.animation).filter(
      (k) => k !== 'delay' && k !== 'loop' && k !== 'alternate' && k !== 'duration' && k !== 'ease',
    );
    expect(animatedProps.length).toBeGreaterThan(0);
    for (const prop of animatedProps) {
      expect(SEEDABLE.has(prop)).toBe(true);
    }
  });

  it('honours delay, from, and children options', () => {
    const step = (
      staggerEnter({ delay: 25, from: 'center', children: '.item' }).sequence as any[]
    )[0];
    expect(step.stagger).toEqual({ delay: 25, from: 'center', maxTotal: 436 });
    expect(step.children).toBe('.item');
  });

  it('carries a caller-supplied budget through to the step', () => {
    // The defect this guards: `maxTotal` was documented on StaggerConfig and
    // unit-tested, yet nothing could set it — the sequence step's `stagger`
    // field was an inline copy of the first two properties, so the value was
    // dropped by the type in the middle of the path. Reachability is the
    // assertion; the arithmetic is staggerOffset's own test.
    const step = (staggerEnter({ delay: 60, maxTotal: 900 }).sequence as any[])[0];
    expect(step.stagger.maxTotal).toBe(900);
  });

  it('derives the budget from duration when the caller names neither', () => {
    const slow = (staggerEnter({ duration: 440 }).sequence as any[])[0];
    const fast = (staggerEnter({ duration: 110 }).sequence as any[])[0];
    expect(slow.stagger.maxTotal).toBeGreaterThan(fast.stagger.maxTotal);
  });
});
