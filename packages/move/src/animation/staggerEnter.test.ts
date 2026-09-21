import { describe, it, expect } from 'vitest';
import { staggerEnter } from './staggerEnter';

// What the child-stagger path actually requires. This used to pin the helper to
// {opacity, scale}, back when those were the only two properties `seedFromState`
// wrote a `from` for — but seeding is generic now, so that set was guarding a
// limit that no longer exists and would have failed `revealItems` for rising on
// the block axis. The real invariant is the one underneath it: a property
// animated through this path must declare a `from`, or nothing writes its first
// frame and it flashes from whatever the previous value was.

describe('staggerEnter', () => {
  it('builds a Root.enter child-stagger trigger', () => {
    const trigger = staggerEnter();
    expect(trigger.trigger).toBe('Root.enter');
    const step = (trigger.sequence as any[])[0];
    expect(step.target).toBe('Root');
    expect(step.children).toBe(':scope > *');
    expect(step.stagger).toEqual({ delay: 60, from: 'first', maxTotal: 436 });
  });

  it('declares a `from` for every property it animates', () => {
    const step = (staggerEnter().sequence as any[])[0];
    const animatedProps = Object.keys(step.animation).filter(
      (k) => k !== 'delay' && k !== 'loop' && k !== 'alternate' && k !== 'duration' && k !== 'ease',
    );
    expect(animatedProps.length).toBeGreaterThan(0);
    for (const prop of animatedProps) {
      expect(step.animation[prop]).toHaveProperty('from');
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
