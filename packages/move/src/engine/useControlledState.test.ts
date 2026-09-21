import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useControlledState } from './useControlledState';

/**
 * Two updates in one tick must chain, not race.
 *
 * The setter used to close over the value of the render that made it, so a
 * second call before the next render resolved its `prev` from the SAME starting
 * point as the first — and silently undid it.
 *
 * FileUpload is where this surfaced. With `removeOnComplete`, several uploads
 * finish together and each removes its own row; the second removal computed
 * "everything except me" from the list that still contained the first, so the
 * first file came back. Back in the list and already untracked, it was tracked
 * again and uploaded a second time — and the tail never cleared, because the
 * removals kept overwriting each other.
 */
describe('useControlledState', () => {
  it('chains two functional updates made in the same tick (uncontrolled)', () => {
    const { result } = renderHook(() =>
      useControlledState<string[]>({ defaultValue: ['a', 'b', 'c'] }),
    );

    act(() => {
      const [, setValue] = result.current;
      setValue((prev) => prev.filter((x) => x !== 'a'));
      setValue((prev) => prev.filter((x) => x !== 'b'));
    });

    expect(result.current[0]).toEqual(['c']);
  });

  it('chains two functional updates made in the same tick (controlled)', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControlledState<string[]>({ value: ['a', 'b', 'c'], onChange }),
    );

    act(() => {
      const [, setValue] = result.current;
      setValue((prev) => prev.filter((x) => x !== 'a'));
      setValue((prev) => prev.filter((x) => x !== 'b'));
    });

    // The consumer owns the value, so what matters is what they were told.
    expect(onChange).toHaveBeenNthCalledWith(1, ['b', 'c']);
    expect(onChange).toHaveBeenNthCalledWith(2, ['c']);
  });

  it('resyncs to the controlled value the parent actually applied', () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) => useControlledState<string[]>({ value, onChange }),
      { initialProps: { value: ['a', 'b'] } },
    );

    act(() => {
      result.current[1]((prev) => prev.filter((x) => x !== 'a'));
    });
    expect(onChange).toHaveBeenLastCalledWith(['b']);

    // The parent declines the change and keeps its own value; the next update
    // must resolve from THAT, not from what we last proposed.
    rerender({ value: ['a', 'b'] });
    act(() => {
      result.current[1]((prev) => [...prev, 'c']);
    });
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b', 'c']);
  });

  it('keeps a stable setter, so callers can hold it across renders', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useControlledState<number>({ value, onChange: () => {} }),
      { initialProps: { value: 1 } },
    );
    const first = result.current[1];
    rerender({ value: 2 });
    expect(result.current[1]).toBe(first);
  });
});
