import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDismissable } from './useDismissable';

describe('useDismissable', () => {
  it('opens', () => {
    const { result } = renderHook(() => useDismissable());
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
    expect(result.current.isClosing).toBe(false);
  });

  it('closing an open one plays the exit before it is gone', () => {
    const { result } = renderHook(() => useDismissable({ defaultOpen: true }));
    act(() => result.current.close());
    // Still mounted, now animating out.
    expect(result.current.isClosing).toBe(true);
    act(() => result.current.onExitDone(result.current.epoch));
    expect(result.current.isOpen).toBe(false);
    expect(result.current.isClosing).toBe(false);
  });

  it('closing one that is already closed does nothing at all', () => {
    // It used to raise `isClosing`, and a popup is mounted while open OR
    // closing — so this MOUNTED the popup to animate out something that was
    // never in. It appeared for the length of one exit and vanished. In a
    // DatePicker, where focus enters the calendar on open, the flash also took
    // the caret out of the text field and put it on a day cell, so the next
    // keystrokes went to the grid and the typed date was lost.
    const onOpenChange = vi.fn();
    const { result } = renderHook(() => useDismissable({ onOpenChange }));
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.isClosing).toBe(false);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('closing one that is already closing does not restart the exit', () => {
    const { result } = renderHook(() => useDismissable({ defaultOpen: true }));
    act(() => result.current.close());
    const epoch = result.current.epoch;
    act(() => result.current.close());
    expect(result.current.epoch).toBe(epoch);
    expect(result.current.isClosing).toBe(true);
  });

  it('a stray open does not cancel a close in flight', () => {
    const { result } = renderHook(() => useDismissable({ defaultOpen: true }));
    act(() => result.current.close());
    act(() => result.current.open());
    expect(result.current.isClosing).toBe(true);
  });

  it('a deliberate reopen wins over a close in flight', () => {
    const { result } = renderHook(() => useDismissable({ defaultOpen: true }));
    act(() => result.current.close());
    const superseded = result.current.epoch;
    act(() => result.current.reopen());
    expect(result.current.isClosing).toBe(false);
    expect(result.current.isOpen).toBe(true);
    // The exit that was already in flight must not close what the user reopened.
    act(() => result.current.onExitDone(superseded));
    expect(result.current.isOpen).toBe(true);
  });
});
