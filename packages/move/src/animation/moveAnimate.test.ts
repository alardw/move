import { describe, it, expect, vi } from 'vitest';
import { moveAnimate } from './moveAnimate';

describe('moveAnimate — hands properties back', () => {
  /**
   * The whole point of the handover: anime WRITES an inline style while it
   * runs — it is interpolating numerically, not switching classes — and gives
   * that property up when it lands, so the stylesheet holds the end state.
   */
  it('writes the property while running and removes it when it lands', async () => {
    const el = document.createElement('div');
    document.body.appendChild(el);

    expect(el.style.transform).toBe('');

    const anim = moveAnimate(el, { scale: { from: 0.5, to: 1, duration: 120 } });
    expect(anim).toBeDefined();

    // mid-flight: the inline declaration is there and is NOT the end value
    await new Promise((r) => setTimeout(r, 40));
    const midway = el.style.transform;
    expect(midway).not.toBe('');

    await new Promise((r) => setTimeout(r, 200));
    expect(el.style.transform).toBe('');
    el.remove();
  });

  it('leaves a looping animation alone — it has no end to hand back at', async () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    moveAnimate(el, { scale: { from: 0.5, to: 1, duration: 60 }, loop: true });
    await new Promise((r) => setTimeout(r, 150));
    expect(el.style.transform).not.toBe('');
    el.remove();
  });

  it('still calls a caller-supplied onComplete', async () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const done = vi.fn();
    moveAnimate(el, { opacity: { from: 0, to: 1, duration: 60 }, onComplete: done });
    await new Promise((r) => setTimeout(r, 200));
    expect(done).toHaveBeenCalledTimes(1);
    expect(el.style.opacity).toBe('');
    el.remove();
  });
});
