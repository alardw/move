import { describe, it, expect, vi } from 'vitest';
import { composeHandlers } from './composeHandlers';

const event = (defaultPrevented = false) => ({ defaultPrevented });

describe('composeHandlers', () => {
  it('runs the caller first, then the component', () => {
    const order: string[] = [];
    const composed = composeHandlers(
      () => order.push('theirs'),
      () => order.push('ours'),
    );
    composed!(event());
    expect(order).toEqual(['theirs', 'ours']);
  });

  /**
   * The point of caller-first ordering: somewhere to stand for a caller who
   * wants the click without the sort.
   */
  it('skips the component when the caller prevents default', () => {
    const ours = vi.fn();
    const composed = composeHandlers(() => {}, ours);
    composed!(event(true));
    expect(ours).not.toHaveBeenCalled();
  });

  it('returns the surviving handler when only one exists', () => {
    const ours = vi.fn();
    composeHandlers(undefined, ours)!(event());
    expect(ours).toHaveBeenCalledTimes(1);

    const theirs = vi.fn();
    composeHandlers(theirs, undefined)!(event());
    expect(theirs).toHaveBeenCalledTimes(1);
  });

  it('is undefined when neither exists, so no empty handler is attached', () => {
    expect(composeHandlers(undefined, undefined)).toBeUndefined();
  });

  /** `attrs` is a Record<string, unknown>, so anything can arrive here. */
  it('ignores a non-function where the caller value should be', () => {
    const ours = vi.fn();
    composeHandlers('not a handler', ours)!(event());
    expect(ours).toHaveBeenCalledTimes(1);
  });
});
