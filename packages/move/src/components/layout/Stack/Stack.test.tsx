// Generated from Stack.spec.ts
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Stack } from './Stack';

// Mock ResizeObserver
class MockResizeObserver {
  callback: ResizeObserverCallback;
  observed: Element[] = [];

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    MockResizeObserver.instances.push(this);
  }

  observe(target: Element) {
    this.observed.push(target);
  }

  unobserve(_target: Element) {
    this.observed = this.observed.filter((el) => el !== _target);
  }

  disconnect() {
    this.observed = [];
  }

  // Trigger a resize with a given width
  trigger(width: number) {
    this.callback(
      [{ contentRect: { width } } as ResizeObserverEntry],
      this as unknown as ResizeObserver,
    );
  }

  static instances: MockResizeObserver[] = [];
  static reset() {
    MockResizeObserver.instances = [];
  }
}

describe('Stack', () => {
  beforeEach(() => {
    MockResizeObserver.reset();
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // === Rendering ===
  describe('rendering', () => {
    it('renders as div element', () => {
      render(<Stack data-testid="stack">Content</Stack>);
      const el = screen.getByTestId('stack');
      expect(el.tagName).toBe('DIV');
    });

    it('renders children content', () => {
      render(<Stack>Child content</Stack>);
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <Stack ref={ref} data-testid="stack">
          Content
        </Stack>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toBe(screen.getByTestId('stack'));
    });

    it('forwards className and style', () => {
      render(
        <Stack className="custom" style={{ marginTop: '10px' }} data-testid="stack">
          Content
        </Stack>,
      );
      const el = screen.getByTestId('stack');
      expect(el).toHaveClass('custom');
      expect(el).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <Stack data-testid="stack" aria-label="layout">
          Content
        </Stack>,
      );
      expect(screen.getByTestId('stack')).toHaveAttribute('aria-label', 'layout');
    });
  });

  // === Direction ===
  describe('direction', () => {
    it('defaults to direction=column', () => {
      render(<Stack data-testid="stack">Content</Stack>);
      expect(screen.getByTestId('stack')).toHaveAttribute('data-direction', 'column');
    });

    it('applies direction via data-direction attribute', () => {
      const { rerender } = render(
        <Stack direction="row" data-testid="stack">
          Content
        </Stack>,
      );
      expect(screen.getByTestId('stack')).toHaveAttribute('data-direction', 'row');

      rerender(
        <Stack direction="column" data-testid="stack">
          Content
        </Stack>,
      );
      expect(screen.getByTestId('stack')).toHaveAttribute('data-direction', 'column');
    });
  });

  // === Gap ===
  describe('gap', () => {
    it('defaults to gap=md', () => {
      render(<Stack data-testid="stack">Content</Stack>);
      expect(screen.getByTestId('stack')).toHaveAttribute('data-gap', 'md');
    });

    it('applies gap via data-gap attribute', () => {
      const { rerender } = render(
        <Stack gap="xs" data-testid="stack">
          Content
        </Stack>,
      );
      expect(screen.getByTestId('stack')).toHaveAttribute('data-gap', 'xs');

      rerender(
        <Stack gap="lg" data-testid="stack">
          Content
        </Stack>,
      );
      expect(screen.getByTestId('stack')).toHaveAttribute('data-gap', 'lg');

      rerender(
        <Stack gap="none" data-testid="stack">
          Content
        </Stack>,
      );
      expect(screen.getByTestId('stack')).toHaveAttribute('data-gap', 'none');
    });
  });

  // === Align ===
  describe('align', () => {
    it('defaults to align=stretch', () => {
      render(<Stack data-testid="stack">Content</Stack>);
      expect(screen.getByTestId('stack')).toHaveAttribute('data-align', 'stretch');
    });

    it('applies align via data-align attribute', () => {
      const { rerender } = render(
        <Stack align="center" data-testid="stack">
          Content
        </Stack>,
      );
      expect(screen.getByTestId('stack')).toHaveAttribute('data-align', 'center');

      rerender(
        <Stack align="start" data-testid="stack">
          Content
        </Stack>,
      );
      expect(screen.getByTestId('stack')).toHaveAttribute('data-align', 'start');

      rerender(
        <Stack align="end" data-testid="stack">
          Content
        </Stack>,
      );
      expect(screen.getByTestId('stack')).toHaveAttribute('data-align', 'end');

      rerender(
        <Stack align="baseline" data-testid="stack">
          Content
        </Stack>,
      );
      expect(screen.getByTestId('stack')).toHaveAttribute('data-align', 'baseline');
    });
  });

  // === Justify ===
  describe('justify', () => {
    it('defaults to justify=start', () => {
      render(<Stack data-testid="stack">Content</Stack>);
      expect(screen.getByTestId('stack')).toHaveAttribute('data-justify', 'start');
    });

    it('applies justify via data-justify attribute', () => {
      const { rerender } = render(
        <Stack justify="center" data-testid="stack">
          Content
        </Stack>,
      );
      expect(screen.getByTestId('stack')).toHaveAttribute('data-justify', 'center');

      rerender(
        <Stack justify="end" data-testid="stack">
          Content
        </Stack>,
      );
      expect(screen.getByTestId('stack')).toHaveAttribute('data-justify', 'end');

      rerender(
        <Stack justify="between" data-testid="stack">
          Content
        </Stack>,
      );
      expect(screen.getByTestId('stack')).toHaveAttribute('data-justify', 'between');

      rerender(
        <Stack justify="evenly" data-testid="stack">
          Content
        </Stack>,
      );
      expect(screen.getByTestId('stack')).toHaveAttribute('data-justify', 'evenly');
    });
  });

  // === Wrap ===
  describe('wrap', () => {
    it('defaults to wrap=false (no data-wrap attribute)', () => {
      render(<Stack data-testid="stack">Content</Stack>);
      expect(screen.getByTestId('stack')).not.toHaveAttribute('data-wrap');
    });

    it('applies data-wrap attribute when wrap=true', () => {
      render(
        <Stack wrap data-testid="stack">
          Content
        </Stack>,
      );
      expect(screen.getByTestId('stack')).toHaveAttribute('data-wrap');
    });

    it('omits data-wrap when wrap is false', () => {
      render(
        <Stack wrap={false} data-testid="stack">
          Content
        </Stack>,
      );
      expect(screen.getByTestId('stack')).not.toHaveAttribute('data-wrap');
    });
  });

  // === Collapse ===
  describe('collapse', () => {
    it('sets data-collapsed when container width is below collapseBelow threshold', () => {
      render(
        <Stack collapseBelow="600" data-testid="stack">
          Content
        </Stack>,
      );
      const el = screen.getByTestId('stack');
      expect(MockResizeObserver.instances).toHaveLength(1);

      // Trigger resize below threshold
      MockResizeObserver.instances[0].trigger(500);
      expect(el).toHaveAttribute('data-collapsed');
    });

    it('removes data-collapsed when container width is at or above collapseBelow threshold', () => {
      render(
        <Stack collapseBelow="600" data-testid="stack">
          Content
        </Stack>,
      );
      const el = screen.getByTestId('stack');

      // Trigger resize below threshold first
      MockResizeObserver.instances[0].trigger(500);
      expect(el).toHaveAttribute('data-collapsed');

      // Trigger resize at threshold
      MockResizeObserver.instances[0].trigger(600);
      expect(el).not.toHaveAttribute('data-collapsed');
    });

    it('omits collapse behavior when collapseBelow is not provided', () => {
      render(<Stack data-testid="stack">Content</Stack>);
      expect(MockResizeObserver.instances).toHaveLength(0);
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(
        <Stack sp={{ root: { className: 'sp-root' } }} data-testid="stack">
          Content
        </Stack>,
      );
      expect(screen.getByTestId('stack')).toHaveClass('sp-root');
    });

    it('merges sp style on root', () => {
      render(
        <Stack sp={{ root: { style: { marginTop: '5px' } } }} data-testid="stack">
          Content
        </Stack>,
      );
      expect(screen.getByTestId('stack')).toHaveStyle({ marginTop: '5px' });
    });
  });
});
