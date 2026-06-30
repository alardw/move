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
    expect(step.stagger).toEqual({ delay: 60, from: 'first' });
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
    expect(step.stagger).toEqual({ delay: 25, from: 'center' });
    expect(step.children).toBe('.item');
  });
});
