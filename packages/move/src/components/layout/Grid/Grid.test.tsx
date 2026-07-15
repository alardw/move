// Generated from Grid.spec.ts
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Grid } from './Grid';

// Mock ResizeObserver
class MockResizeObserver {
  callback: ResizeObserverCallback;
  static instances: MockResizeObserver[] = [];
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    MockResizeObserver.instances.push(this);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  trigger(width: number) {
    this.callback(
      [{ contentRect: { width } } as ResizeObserverEntry],
      this as unknown as ResizeObserver,
    );
  }
}

beforeEach(() => {
  MockResizeObserver.instances = [];
  vi.stubGlobal('ResizeObserver', MockResizeObserver);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Grid', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders as div with CSS grid display', () => {
      render(<Grid data-testid="grid">Content</Grid>);
      const el = screen.getByTestId('grid');
      expect(el.tagName).toBe('DIV');
    });

    it('renders without crashing', () => {
      render(<Grid data-testid="grid">Content</Grid>);
      expect(screen.getByTestId('grid')).toBeInTheDocument();
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <Grid ref={ref} data-testid="grid">
          Content
        </Grid>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toBe(screen.getByTestId('grid'));
    });

    it('passes className to root', () => {
      render(
        <Grid data-testid="grid" className="custom">
          Content
        </Grid>,
      );
      expect(screen.getByTestId('grid')).toHaveClass('custom');
    });

    it('passes style to root', () => {
      render(
        <Grid data-testid="grid" style={{ marginTop: '10px' }}>
          Content
        </Grid>,
      );
      expect(screen.getByTestId('grid')).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <Grid data-testid="my-grid" aria-label="grid">
          Content
        </Grid>,
      );
      expect(screen.getByTestId('my-grid')).toHaveAttribute('aria-label', 'grid');
    });
  });

  // === Grid Template Resolution ===
  describe('grid template resolution', () => {
    it('defaults to 12-column grid when no cols/columns/minChildWidth provided', () => {
      render(<Grid data-testid="grid">Content</Grid>);
      const el = screen.getByTestId('grid');
      expect(el.style.getPropertyValue('--_grid-template')).toBe('repeat(12, 1fr)');
    });

    it('sets --_grid-template via inline style for cols mode', () => {
      render(
        <Grid data-testid="grid" cols={4}>
          Content
        </Grid>,
      );
      const el = screen.getByTestId('grid');
      expect(el.style.getPropertyValue('--_grid-template')).toBe('repeat(4, 1fr)');
    });

    it('sets --_grid-template for columns mode', () => {
      render(
        <Grid data-testid="grid" columns={6}>
          Content
        </Grid>,
      );
      const el = screen.getByTestId('grid');
      expect(el.style.getPropertyValue('--_grid-template')).toBe('repeat(6, 1fr)');
    });

    it('sets --_grid-template via inline style for minChildWidth auto-fit mode', () => {
      render(
        <Grid data-testid="grid" minChildWidth="200px">
          Content
        </Grid>,
      );
      const el = screen.getByTestId('grid');
      expect(el.style.getPropertyValue('--_grid-template')).toBe(
        'repeat(auto-fill, minmax(200px, 1fr))',
      );
    });

    it('minChildWidth takes priority over cols', () => {
      render(
        <Grid data-testid="grid" minChildWidth="150px" cols={3}>
          Content
        </Grid>,
      );
      const el = screen.getByTestId('grid');
      expect(el.style.getPropertyValue('--_grid-template')).toBe(
        'repeat(auto-fill, minmax(150px, 1fr))',
      );
    });

    it('cols takes priority over columns', () => {
      render(
        <Grid data-testid="grid" cols={3} columns={6}>
          Content
        </Grid>,
      );
      const el = screen.getByTestId('grid');
      expect(el.style.getPropertyValue('--_grid-template')).toBe('repeat(3, 1fr)');
    });

    it('sets --_grid-rows via inline style when rows is provided', () => {
      render(
        <Grid data-testid="grid" rows={3}>
          Content
        </Grid>,
      );
      const el = screen.getByTestId('grid');
      expect(el.style.getPropertyValue('--_grid-rows')).toBe('repeat(3, 1fr)');
    });
  });

  // === Gap ===
  describe('gap', () => {
    it('defaults to data-gap=md', () => {
      render(<Grid data-testid="grid">Content</Grid>);
      const el = screen.getByTestId('grid');
      expect(el).toHaveAttribute('data-gap', 'md');
    });

    it('sets data-gap attribute for each gap value', () => {
      const { rerender } = render(
        <Grid data-testid="grid" gap="xs">
          Content
        </Grid>,
      );
      expect(screen.getByTestId('grid')).toHaveAttribute('data-gap', 'xs');

      rerender(
        <Grid data-testid="grid" gap="sm">
          Content
        </Grid>,
      );
      expect(screen.getByTestId('grid')).toHaveAttribute('data-gap', 'sm');

      rerender(
        <Grid data-testid="grid" gap="lg">
          Content
        </Grid>,
      );
      expect(screen.getByTestId('grid')).toHaveAttribute('data-gap', 'lg');

      rerender(
        <Grid data-testid="grid" gap="xl">
          Content
        </Grid>,
      );
      expect(screen.getByTestId('grid')).toHaveAttribute('data-gap', 'xl');

      rerender(
        <Grid data-testid="grid" gap="none">
          Content
        </Grid>,
      );
      expect(screen.getByTestId('grid')).toHaveAttribute('data-gap', 'none');
    });

    it('supports rowGap and columnGap overrides via data attributes', () => {
      render(
        <Grid data-testid="grid" rowGap="lg" columnGap="xs">
          Content
        </Grid>,
      );
      const el = screen.getByTestId('grid');
      expect(el).toHaveAttribute('data-row-gap', 'lg');
      expect(el).toHaveAttribute('data-column-gap', 'xs');
    });
  });

  // === Collapse ===
  describe('collapse', () => {
    it('sets data-collapsed attribute when container width falls below collapseBelow threshold', () => {
      render(
        <Grid data-testid="grid" collapseBelow="600">
          Content
        </Grid>,
      );
      const el = screen.getByTestId('grid');

      // Trigger resize observer with width below threshold
      const observer = MockResizeObserver.instances[0];
      expect(observer).toBeDefined();
      observer.trigger(500);

      expect(el).toHaveAttribute('data-collapsed');
    });

    it('removes data-collapsed attribute when container width exceeds threshold', () => {
      render(
        <Grid data-testid="grid" collapseBelow="600">
          Content
        </Grid>,
      );
      const el = screen.getByTestId('grid');

      const observer = MockResizeObserver.instances[0];
      observer.trigger(500);
      expect(el).toHaveAttribute('data-collapsed');

      observer.trigger(700);
      expect(el).not.toHaveAttribute('data-collapsed');
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(
        <Grid data-testid="grid" sp={{ root: { className: 'sp-root' } }}>
          Content
        </Grid>,
      );
      expect(screen.getByTestId('grid')).toHaveClass('sp-root');
    });

    it('merges sp style on root', () => {
      render(
        <Grid data-testid="grid" sp={{ root: { style: { marginTop: '5px' } } }}>
          Content
        </Grid>,
      );
      expect(screen.getByTestId('grid')).toHaveStyle({ marginTop: '5px' });
    });
  });
});

describe('Grid.Cell', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders as div', () => {
      render(<Grid.Cell data-testid="cell">Content</Grid.Cell>);
      const el = screen.getByTestId('cell');
      expect(el.tagName).toBe('DIV');
    });

    it('forwards ref', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <Grid.Cell ref={ref} data-testid="cell">
          Content
        </Grid.Cell>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toBe(screen.getByTestId('cell'));
    });

    it('forwards className and style', () => {
      render(
        <Grid.Cell data-testid="cell" className="custom" style={{ color: 'red' }}>
          Content
        </Grid.Cell>,
      );
      const el = screen.getByTestId('cell');
      expect(el).toHaveClass('custom');
      expect(el).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });
  });

  // === Placement ===
  describe('placement', () => {
    it('sets gridColumn for span', () => {
      render(
        <Grid.Cell data-testid="cell" span={3}>
          Content
        </Grid.Cell>,
      );
      const el = screen.getByTestId('cell');
      expect(el.style.gridColumn).toBe('span 3');
    });

    it('combines offset and span into gridColumn: "offset+1 / span N"', () => {
      render(
        <Grid.Cell data-testid="cell" span={3} offset={2}>
          Content
        </Grid.Cell>,
      );
      const el = screen.getByTestId('cell');
      expect(el.style.gridColumn).toBe('3 / span 3');
    });

    it('sets gridColumn for offset only', () => {
      render(
        <Grid.Cell data-testid="cell" offset={2}>
          Content
        </Grid.Cell>,
      );
      const el = screen.getByTestId('cell');
      expect(el.style.gridColumn).toBe('3');
    });

    it('sets gridRow for rowSpan', () => {
      render(
        <Grid.Cell data-testid="cell" rowSpan={2}>
          Content
        </Grid.Cell>,
      );
      const el = screen.getByTestId('cell');
      expect(el.style.gridRow).toBe('span 2');
    });

    it('sets order via inline style', () => {
      render(
        <Grid.Cell data-testid="cell" order={5}>
          Content
        </Grid.Cell>,
      );
      const el = screen.getByTestId('cell');
      expect(el.style.order).toBe('5');
    });

    it('sets alignSelf for align prop', () => {
      const { rerender } = render(
        <Grid.Cell data-testid="cell" align="start">
          Content
        </Grid.Cell>,
      );
      expect(screen.getByTestId('cell').style.alignSelf).toBe('start');

      rerender(
        <Grid.Cell data-testid="cell" align="center">
          Content
        </Grid.Cell>,
      );
      expect(screen.getByTestId('cell').style.alignSelf).toBe('center');

      rerender(
        <Grid.Cell data-testid="cell" align="end">
          Content
        </Grid.Cell>,
      );
      expect(screen.getByTestId('cell').style.alignSelf).toBe('end');

      rerender(
        <Grid.Cell data-testid="cell" align="stretch">
          Content
        </Grid.Cell>,
      );
      expect(screen.getByTestId('cell').style.alignSelf).toBe('stretch');
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on cell', () => {
      render(
        <Grid.Cell data-testid="cell" sp={{ cell: { className: 'sp-cell' } }}>
          Content
        </Grid.Cell>,
      );
      expect(screen.getByTestId('cell')).toHaveClass('sp-cell');
    });

    it('merges sp style on cell', () => {
      render(
        <Grid.Cell data-testid="cell" sp={{ cell: { style: { marginTop: '5px' } } }}>
          Content
        </Grid.Cell>,
      );
      expect(screen.getByTestId('cell')).toHaveStyle({ marginTop: '5px' });
    });
  });
});
