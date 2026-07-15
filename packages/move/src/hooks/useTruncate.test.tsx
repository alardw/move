import { render, act, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useTruncate, type UseTruncateOptions } from './useTruncate';

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

// jsdom reports 0 for all layout metrics; stub them so measureTruncated has
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

function Probe({
  bump = 0,
  middle,
  ...opts
}: UseTruncateOptions & { bump?: number; middle?: boolean }) {
  const { ref, isTruncated } = useTruncate<HTMLDivElement>(opts);
  return (
    <div ref={ref} data-testid="el" data-trunc={isTruncated} data-bump={bump}>
      {middle ? <span data-truncate-head="" data-testid="head" /> : 'text'}
    </div>
  );
}

describe('useTruncate', () => {
  it('reports isTruncated when the element overflows horizontally', () => {
    const { rerender } = render(<Probe bump={0} />);
    const el = screen.getByTestId('el');
    setDims(el, { scrollWidth: 200, clientWidth: 100, scrollHeight: 20, clientHeight: 20 });
    rerender(<Probe bump={1} />); // re-render → useLayoutEffect re-measures
    expect(el).toHaveAttribute('data-trunc', 'true');
  });

  it('reports false when the element fits', () => {
    const { rerender } = render(<Probe bump={0} />);
    const el = screen.getByTestId('el');
    setDims(el, { scrollWidth: 100, clientWidth: 100, scrollHeight: 20, clientHeight: 20 });
    rerender(<Probe bump={1} />);
    expect(el).toHaveAttribute('data-trunc', 'false');
  });

  it('detects vertical overflow (clamp)', () => {
    const { rerender } = render(<Probe bump={0} />);
    const el = screen.getByTestId('el');
    setDims(el, { scrollWidth: 100, clientWidth: 100, scrollHeight: 80, clientHeight: 40 });
    rerender(<Probe bump={1} />);
    expect(el).toHaveAttribute('data-trunc', 'true');
  });

  it('detects a clipped head span (middle truncation) even when the element fits', () => {
    const { rerender } = render(<Probe bump={0} middle />);
    const el = screen.getByTestId('el');
    const head = screen.getByTestId('head');
    setDims(el, { scrollWidth: 100, clientWidth: 100, scrollHeight: 20, clientHeight: 20 });
    setDims(head, { scrollWidth: 200, clientWidth: 80 });
    rerender(<Probe bump={1} middle />);
    expect(el).toHaveAttribute('data-trunc', 'true');
  });

  it('re-measures when the ResizeObserver fires', () => {
    render(<Probe />);
    const el = screen.getByTestId('el');
    expect(el).toHaveAttribute('data-trunc', 'false');
    setDims(el, { scrollWidth: 300, clientWidth: 100 });
    act(() => observers[observers.length - 1].cb());
    expect(el).toHaveAttribute('data-trunc', 'true');
  });

  it('stays false and observes nothing when enabled=false', () => {
    const { rerender } = render(<Probe bump={0} enabled={false} />);
    const el = screen.getByTestId('el');
    setDims(el, { scrollWidth: 300, clientWidth: 100 });
    rerender(<Probe bump={1} enabled={false} />);
    expect(el).toHaveAttribute('data-trunc', 'false');
    expect(observers).toHaveLength(0);
  });

  it('does not throw when ResizeObserver is unavailable', () => {
    globalThis.ResizeObserver = undefined as unknown as typeof ResizeObserver;
    expect(() => render(<Probe />)).not.toThrow();
  });
});
