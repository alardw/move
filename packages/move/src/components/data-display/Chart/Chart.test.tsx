import * as React from 'react';
import { render as rtlRender, screen, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { Chart } from './Chart';
import { ThemeProvider } from '../../../infrastructure/Theme';
import type { ChartRenderer, ChartRendererProps } from './types';

/**
 * Chart REQUIRES a ThemeProvider — unlike most Move components it resolves
 * tokens in JS (so a canvas renderer can use them) rather than leaving them to
 * CSS, and there is nothing to resolve without a theme. `MoveRoot` always
 * supplies one; a bare `<Chart>` throws.
 */
const render = (ui: React.ReactElement) => rtlRender(<ThemeProvider>{ui}</ThemeProvider>);

const data = [
  { month: 'Jan', mrr: 10, costs: 4 },
  { month: 'Feb', mrr: 20, costs: 6 },
  { month: 'Mar', mrr: 15, costs: 5 },
];

/** jsdom has no layout, so the shell would never measure a width. */
beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(private cb: ResizeObserverCallback) {}
      observe() {
        this.cb([{ contentRect: { width: 600, height: 300 } } as never], this as never);
      }
      unobserve() {}
      disconnect() {}
    },
  );
  Element.prototype.getBoundingClientRect = function () {
    return {
      width: 600,
      height: 300,
      top: 0,
      left: 0,
      right: 600,
      bottom: 300,
      x: 0,
      y: 0,
    } as DOMRect;
  };
});

const line = [{ key: 'mrr', type: 'line' as const, label: 'MRR' }];

describe('Chart', () => {
  describe('rendering', () => {
    it('renders as a figure captioned by its title', () => {
      render(<Chart caption="Revenue" data={data} x="month" series={line} data-testid="chart" />);
      const fig = screen.getByTestId('chart');
      expect(fig.tagName).toBe('FIGURE');
      expect(fig).toHaveAttribute('aria-labelledby', screen.getByText('Revenue').id);
    });

    it('hideCaption keeps the caption in the accessibility tree', () => {
      render(<Chart caption="Revenue" hideCaption data={data} x="month" series={line} />);
      expect(screen.getByText('Revenue')).toBeInTheDocument();
    });

    it('applies data-size and data-grid to the root', () => {
      render(
        <Chart
          caption="R"
          size="lg"
          grid="both"
          data={data}
          x="month"
          series={line}
          data-testid="c"
        />,
      );
      const el = screen.getByTestId('c');
      expect(el).toHaveAttribute('data-size', 'lg');
      expect(el).toHaveAttribute('data-grid', 'both');
    });

    it('forwards className, style and ref', () => {
      const ref = { current: null } as React.RefObject<HTMLElement>;
      render(
        <Chart
          ref={ref}
          className="mine"
          style={{ opacity: 0.5 }}
          caption="R"
          data={data}
          x="month"
          series={line}
          data-testid="c"
        />,
      );
      const el = screen.getByTestId('c');
      expect(el.className).toContain('mine');
      expect(el.style.opacity).toBe('0.5');
      expect(ref.current).toBe(el);
    });
  });

  describe('the renderer seam', () => {
    it('uses the built-in renderer when none is given', () => {
      const { container } = render(<Chart caption="R" data={data} x="month" series={line} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('invokes a supplied renderer instead', () => {
      const custom = vi.fn(() => <div data-testid="custom">drawn</div>) as ChartRenderer;
      render(<Chart caption="R" data={data} x="month" series={line} renderer={custom} />);
      expect(screen.getByTestId('custom')).toBeInTheDocument();
      expect(custom).toHaveBeenCalled();
    });

    it('hands the renderer resolved colour VALUES, never css variables', () => {
      let seen: ChartRendererProps | null = null;
      const capture: ChartRenderer = (p) => {
        seen = p;
        return null;
      };
      render(<Chart caption="R" data={data} x="month" series={line} renderer={capture} />);
      // A canvas renderer cannot resolve var(); the shell must have done it.
      for (const colour of seen!.theme.series) {
        expect(colour.startsWith('var(')).toBe(false);
      }
      expect(seen!.spec.series[0].color.startsWith('var(')).toBe(false);
    });

    it('passes the measured size and the normalised spec', () => {
      let seen: ChartRendererProps | null = null;
      const capture: ChartRenderer = (p) => {
        seen = p;
        return null;
      };
      render(
        <Chart
          caption="R"
          data={data}
          x="month"
          stacked
          dots
          curve="monotone"
          series={line}
          renderer={capture}
        />,
      );
      expect(seen!.width).toBeGreaterThan(0);
      expect(seen!.height).toBeGreaterThan(0);
      expect(seen!.spec.x).toBe('month');
      expect(seen!.spec.stacked).toBe(true);
      expect(seen!.spec.dots).toBe(true);
      expect(seen!.spec.curve).toBe('monotone');
      expect(seen!.spec.series.map((s) => s.label)).toEqual(['MRR']);
    });

    it('defaults a series label to its key', () => {
      let seen: ChartRendererProps | null = null;
      const capture: ChartRenderer = (p) => {
        seen = p;
        return null;
      };
      render(
        <Chart
          caption="R"
          data={data}
          x="month"
          series={[{ key: 'mrr', type: 'bar' }]}
          renderer={capture}
        />,
      );
      expect(seen!.spec.series[0].label).toBe('mrr');
    });
  });

  describe('accessibility', () => {
    it('marks the plot as an image with a generated summary', () => {
      render(<Chart caption="R" data={data} x="month" series={line} />);
      const plot = screen.getByRole('img');
      expect(plot.getAttribute('aria-label')).toMatch(/MRR/);
      expect(plot).toHaveAttribute('aria-describedby');
    });

    it('an explicit summary wins over the derived one', () => {
      render(
        <Chart caption="R" summary="Up and to the right" data={data} x="month" series={line} />,
      );
      expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Up and to the right');
    });

    it('renders a data table carrying every value', () => {
      render(<Chart caption="R" data={data} x="month" series={line} />);
      const table = screen.getByRole('table');
      expect(within(table).getByText('Jan')).toBeInTheDocument();
      expect(within(table).getByText('20')).toBeInTheDocument();
      // the described-by target is the wrapper the table sits in
      expect(table.closest('div')!.id).toBe(
        screen.getByRole('img').getAttribute('aria-describedby'),
      );
    });

    it('the table is built from data, so it survives any renderer', () => {
      render(<Chart caption="R" data={data} x="month" series={line} renderer={() => null} />);
      expect(within(screen.getByRole('table')).getByText('15')).toBeInTheDocument();
    });

    it('dataTable={false} omits it', () => {
      render(<Chart caption="R" dataTable={false} data={data} x="month" series={line} />);
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
      expect(screen.getByRole('img')).not.toHaveAttribute('aria-describedby');
    });

    it('applies formatters to the table as well as the axis', () => {
      render(<Chart caption="R" data={data} x="month" series={line} formatY={(v) => `$${v}k`} />);
      expect(within(screen.getByRole('table')).getByText('$20k')).toBeInTheDocument();
    });
  });

  describe('legend', () => {
    it('renders one entry per series', () => {
      render(
        <Chart
          caption="R"
          data={data}
          x="month"
          series={[
            { key: 'mrr', type: 'line', label: 'MRR' },
            { key: 'costs', type: 'line', label: 'Costs' },
          ]}
        />,
      );
      const items = screen.getAllByRole('listitem');
      expect(items.map((i) => i.textContent)).toEqual(['MRR', 'Costs']);
    });

    it('legend={false} omits it', () => {
      render(<Chart caption="R" legend={false} data={data} x="month" series={line} />);
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('is DOM, not renderer output, so it survives a null renderer', () => {
      render(<Chart caption="R" data={data} x="month" series={line} renderer={() => null} />);
      expect(screen.getByRole('listitem')).toHaveTextContent('MRR');
    });
  });

  describe('entrance state', () => {
    it('never hides the marks when animations are disabled', () => {
      render(<Chart caption="R" animations={false} data={data} x="month" series={line} />);
      // data-enter="pending" is what applies the hidden pre-entrance CSS.
      expect(screen.getByRole('img')).not.toHaveAttribute('data-enter');
    });
  });
});
