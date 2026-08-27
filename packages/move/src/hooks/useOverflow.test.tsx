import { render, act, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useOverflow, type UseOverflowOptions } from './useOverflow';

// Controllable ResizeObserver: capture each instance's callback so a test can
// drive a resize on demand (the global setup mock never fires).
let observers: MockRO[] = [];
class MockRO {
  cb: () => void;
  disconnected = false;
  constructor(cb: () => void) {
    this.cb = cb;
    observers.push(this);
  }
  observe() {}
  unobserve() {}
  disconnect() {
    this.disconnected = true;
  }
}
const realRO = globalThis.ResizeObserver;

beforeEach(() => {
  observers = [];
  globalThis.ResizeObserver = MockRO as unknown as typeof ResizeObserver;
});
afterEach(() => {
  globalThis.ResizeObserver = realRO;
});

// jsdom reports 0 for all layout metrics; stub them so measureOverflow has
// something to read.
function setDims(
  el: Element,
  dims: {
    scrollWidth?: number;
    clientWidth?: number;
    scrollHeight?: number;
    clientHeight?: number;
  },
) {
  for (const [k, v] of Object.entries(dims)) {
    Object.defineProperty(el, k, { configurable: true, value: v });
  }
}

function Probe({ bump = 0, ...opts }: UseOverflowOptions & { bump?: number }) {
  const { ref, isOverflowing } = useOverflow<HTMLDivElement>(opts);
  return <div ref={ref} data-testid="el" data-over={isOverflowing} data-bump={bump} />;
}

const el = () => screen.getByTestId('el');
const isOver = () => el().getAttribute('data-over');

describe('useOverflow', () => {
  it('is false when the content fits', () => {
    const { rerender } = render(<Probe />);
    setDims(el(), { scrollHeight: 100, clientHeight: 100 });
    rerender(<Probe bump={1} />);
    expect(isOver()).toBe('false');
  });

  it('is true when content is taller than the box', () => {
    const { rerender } = render(<Probe />);
    setDims(el(), { scrollHeight: 400, clientHeight: 100 });
    rerender(<Probe bump={1} />);
    expect(isOver()).toBe('true');
  });

  it('ignores horizontal overflow on the default vertical axis', () => {
    const { rerender } = render(<Probe />);
    setDims(el(), { scrollHeight: 100, clientHeight: 100, scrollWidth: 400, clientWidth: 100 });
    rerender(<Probe bump={1} />);
    expect(isOver()).toBe('false');
  });

  it('reads the horizontal axis when asked', () => {
    const { rerender } = render(<Probe axis="horizontal" />);
    setDims(el(), { scrollHeight: 100, clientHeight: 100, scrollWidth: 400, clientWidth: 100 });
    rerender(<Probe axis="horizontal" bump={1} />);
    expect(isOver()).toBe('true');
  });

  it("reports either axis for 'both'", () => {
    const { rerender } = render(<Probe axis="both" />);
    setDims(el(), { scrollHeight: 100, clientHeight: 100, scrollWidth: 400, clientWidth: 100 });
    rerender(<Probe axis="both" bump={1} />);
    expect(isOver()).toBe('true');
  });

  // Content growth is the case a ResizeObserver alone misses: a height-bounded
  // box does not change size when rows are added to it.
  it('picks up content growth without a resize', () => {
    const { rerender } = render(<Probe />);
    setDims(el(), { scrollHeight: 50, clientHeight: 100 });
    rerender(<Probe bump={1} />);
    expect(isOver()).toBe('false');

    setDims(el(), { scrollHeight: 900, clientHeight: 100 });
    rerender(<Probe bump={2} />);
    expect(isOver()).toBe('true');
  });

  it('re-measures when the available space changes', () => {
    render(<Probe />);
    setDims(el(), { scrollHeight: 300, clientHeight: 300 });
    act(() => observers.forEach((o) => o.cb()));
    expect(isOver()).toBe('false');

    setDims(el(), { scrollHeight: 300, clientHeight: 80 });
    act(() => observers.forEach((o) => o.cb()));
    expect(isOver()).toBe('true');
  });

  it('stays false and skips measuring when disabled', () => {
    const { rerender } = render(<Probe enabled={false} />);
    setDims(el(), { scrollHeight: 900, clientHeight: 100 });
    rerender(<Probe enabled={false} bump={1} />);
    expect(isOver()).toBe('false');
  });

  it('disconnects the observer on unmount', () => {
    const { unmount } = render(<Probe />);
    unmount();
    expect(observers.every((o) => o.disconnected)).toBe(true);
  });

  it('measures without a ResizeObserver', () => {
    globalThis.ResizeObserver = undefined as unknown as typeof ResizeObserver;
    const { rerender } = render(<Probe />);
    setDims(el(), { scrollHeight: 900, clientHeight: 100 });
    rerender(<Probe bump={1} />);
    expect(isOver()).toBe('true');
  });
});
