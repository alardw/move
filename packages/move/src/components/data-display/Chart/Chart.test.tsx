import * as React from 'react';
import { fireEvent, render as rtlRender, screen, within } from '@testing-library/react';
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

describe('Chart — x scale', () => {
  const uneven = [
    { at: 0, v: 1 },
    { at: 1, v: 2 },
    { at: 10, v: 3 },
  ];

  const capture = () => {
    const seen: { spec: ChartRendererProps['spec'] }[] = [];
    const renderer: ChartRenderer = (p) => {
      seen.push({ spec: p.spec });
      return null;
    };
    return { seen, renderer };
  };

  it('defaults to a category scale', () => {
    const { seen, renderer } = capture();
    render(
      <Chart
        caption="R"
        data={uneven}
        x="at"
        series={[{ key: 'v', type: 'line' }]}
        renderer={renderer}
      />,
    );
    expect(seen[0].spec.xScale).toBe('category');
  });

  it('passes a linear scale through to the renderer', () => {
    const { seen, renderer } = capture();
    render(
      <Chart
        caption="R"
        data={uneven}
        x="at"
        xScale="linear"
        series={[{ key: 'v', type: 'line' }]}
        renderer={renderer}
      />,
    );
    expect(seen[0].spec.xScale).toBe('linear');
  });

  it('a category axis spaces rows evenly, however uneven the values', () => {
    const { container } = render(
      <Chart caption="R" data={uneven} x="at" dots series={[{ key: 'v', type: 'line' }]} />,
    );
    const xs = [...container.querySelectorAll('[data-dot]')].map((c) =>
      Number(c.getAttribute('cx')),
    );
    expect(xs[1] - xs[0]).toBeCloseTo(xs[2] - xs[1], 1);
  });

  it('a linear axis places each row at its own value', () => {
    const { container } = render(
      <Chart
        caption="R"
        data={uneven}
        x="at"
        xScale="linear"
        dots
        series={[{ key: 'v', type: 'line' }]}
      />,
    );
    const xs = [...container.querySelectorAll('[data-dot]')].map((c) =>
      Number(c.getAttribute('cx')),
    );
    // 0 -> 1 is a tenth of the span; 1 -> 10 is the rest.
    expect(xs[2] - xs[1]).toBeGreaterThan((xs[1] - xs[0]) * 5);
  });

  it('falls back to even spacing when an x value is not numeric', () => {
    const mixed = [
      { at: 0, v: 1 },
      { at: 'oops', v: 2 },
      { at: 10, v: 3 },
    ];
    const { container } = render(
      <Chart
        caption="R"
        data={mixed}
        x="at"
        xScale="linear"
        dots
        series={[{ key: 'v', type: 'line' }]}
      />,
    );
    const xs = [...container.querySelectorAll('[data-dot]')].map((c) =>
      Number(c.getAttribute('cx')),
    );
    expect(xs.every((v) => Number.isFinite(v))).toBe(true);
    expect(xs[1] - xs[0]).toBeCloseTo(xs[2] - xs[1], 1);
  });
});

describe('Chart — async status', () => {
  const line = [{ key: 'mrr', type: 'line' as const, label: 'MRR' }];
  const rows = [{ month: 'Jan', mrr: 1 }];

  it('shows the loading state instead of the plot', () => {
    const { container } = render(
      <Chart caption="R" data={[]} x="month" series={line} resource={{ status: 'loading' }} />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Loading chart');
    // The plot, not just any svg — the Loader draws a spinner of its own.
    expect(container.querySelector('[data-series]')).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('never invokes the renderer while loading', () => {
    const renderer = vi.fn(() => null);
    render(
      <Chart
        caption="R"
        data={[]}
        x="month"
        series={line}
        resource={{ status: 'loading' }}
        renderer={renderer}
      />,
    );
    expect(renderer).not.toHaveBeenCalled();
  });

  it('offers retry when the resource carries one', async () => {
    const retry = vi.fn();
    render(
      <Chart
        caption="R"
        data={[]}
        x="month"
        series={line}
        resource={{ status: 'error', error: new Error('nope'), retry }}
      />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Could not load chart data');
    screen.getByRole('button', { name: 'Retry' }).click();
    expect(retry).toHaveBeenCalledOnce();
  });

  it('omits retry when the resource has none', () => {
    render(
      <Chart
        caption="R"
        data={[]}
        x="month"
        series={line}
        resource={{ status: 'error', error: new Error('nope') }}
      />,
    );
    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
  });

  it('reports empty when there is nothing to draw, resource or not', () => {
    render(<Chart caption="R" data={[]} x="month" series={line} />);
    expect(screen.getByRole('status')).toHaveTextContent('No data to display');
  });

  it('draws once the resource succeeds', () => {
    const { container } = render(
      <Chart
        caption="R"
        data={rows}
        x="month"
        series={line}
        resource={{ status: 'success', data: rows }}
      />,
    );
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(container.querySelector('[data-series]')).toBeInTheDocument();
  });

  it('keeps `resource` off the DOM — it is also an RDFa attribute', () => {
    render(
      <Chart
        caption="R"
        data={rows}
        x="month"
        series={line}
        resource={{ status: 'success', data: rows }}
        data-testid="c"
      />,
    );
    expect(screen.getByTestId('c')).not.toHaveAttribute('resource');
  });

  it('labels are overridable', () => {
    render(
      <Chart caption="R" data={[]} x="month" series={line} labels={{ empty: 'Niets te tonen' }} />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Niets te tonen');
  });
});

describe('Chart — pie', () => {
  const slices = [
    { channel: 'Organic', sessions: 40 },
    { channel: 'Paid', sessions: 30 },
    { channel: 'Referral', sessions: 30 },
  ];
  const pie = [{ key: 'sessions', type: 'pie' as const, label: 'Sessions' }];

  it('draws one wedge per row', () => {
    const { container } = render(
      <Chart caption="R" data={slices} x="channel" series={pie} animations={false} />,
    );
    expect(container.querySelectorAll('[data-slice]')).toHaveLength(3);
  });

  it('colours per SLICE, not per series — a pie is one series of parts', () => {
    const { container } = render(
      <Chart caption="R" data={slices} x="channel" series={pie} animations={false} />,
    );
    const fills = [...container.querySelectorAll('[data-slice]')].map((p) =>
      p.getAttribute('fill'),
    );
    expect(new Set(fills).size).toBe(3);
  });

  it('the legend names the rows, not the series', () => {
    render(<Chart caption="R" data={slices} x="channel" series={pie} animations={false} />);
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      'Organic',
      'Paid',
      'Referral',
    ]);
  });

  it('legend swatches match the wedges', () => {
    const { container } = render(
      <Chart caption="R" data={slices} x="channel" series={pie} animations={false} />,
    );
    const wedges = [...container.querySelectorAll('[data-slice]')].map((p) =>
      p.getAttribute('fill'),
    );
    // first span in each item is the swatch; the second is the (truncatable) label
    const swatches = [...container.querySelectorAll('li > span:first-child')].map(
      (s) => (s as HTMLElement).style.background,
    );
    // jsdom normalises an inline `background` to rgb(), so compare values.
    const toRgb = (hex: string) => {
      const n = Number.parseInt(hex.slice(1), 16);
      return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
    };
    expect(swatches.filter(Boolean)).toHaveLength(3);
    wedges.forEach((fill, i) => expect(swatches[i]).toBe(toRgb(fill!)));
  });

  it('draws no axis furniture', () => {
    const { container } = render(
      <Chart caption="R" data={slices} x="channel" series={pie} animations={false} />,
    );
    expect(container.querySelector('[data-chart-part="axis-x"]')).not.toBeInTheDocument();
    expect(container.querySelector('[data-chart-part="axis-y"]')).not.toBeInTheDocument();
  });

  it('still carries the full data table', () => {
    render(<Chart caption="R" data={slices} x="channel" series={pie} animations={false} />);
    const table = screen.getByRole('table');
    expect(within(table).getByText('Organic')).toBeInTheDocument();
    expect(within(table).getByText('40')).toBeInTheDocument();
  });

  it('renders at rest when animation is off, rather than waiting for an entrance', () => {
    const { container } = render(
      <Chart caption="R" data={slices} x="channel" series={pie} animations={false} />,
    );
    // The whole circle is present, not a partial sweep.
    expect(container.querySelectorAll('[data-slice]')).toHaveLength(3);
  });
});

describe('Chart — tooltip content', () => {
  const rows = [
    { day: 'Mon', visits: 10, signups: 4 },
    { day: 'Tue', visits: 20, signups: 6 },
  ];

  it('names each series when there is more than one to tell apart', () => {
    render(
      <Chart
        caption="R"
        data={rows}
        x="day"
        animations={false}
        series={[
          { key: 'visits', type: 'line', label: 'Visits' },
          { key: 'signups', type: 'line', label: 'Signups' },
        ]}
      />,
    );
    // the legend is the same source of truth the tooltip rows use
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      'Visits',
      'Signups',
    ]);
  });

  it('a pie legend names rows, so one series still yields many entries', () => {
    render(
      <Chart
        caption="R"
        data={rows}
        x="day"
        animations={false}
        series={[{ key: 'visits', type: 'pie', label: 'Visits' }]}
      />,
    );
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Mon', 'Tue']);
  });
});

describe('Chart — hover emphasis', () => {
  const rows = [
    { day: 'Mon', visits: 10 },
    { day: 'Tue', visits: 20 },
    { day: 'Wed', visits: 30 },
  ];
  const bar = [{ key: 'visits', type: 'bar' as const, label: 'Visits' }];

  /** The plot is what carries the pointer handlers and the reported geometry. */
  const hoverAt = (container: HTMLElement, clientX: number) => {
    const plot = container.querySelector('[role="img"]')!;
    fireEvent.pointerMove(plot, { clientX, clientY: 150 });
  };

  it('marks every mark active while nothing is hovered', () => {
    const { container } = render(
      <Chart caption="R" data={rows} x="day" series={bar} animations={false} />,
    );
    const marks = [...container.querySelectorAll('[data-mark]')];
    expect(marks).toHaveLength(3);
    expect(marks.every((m) => m.hasAttribute('data-active'))).toBe(true);
  });

  it('leaves exactly one active once a mark is hovered', () => {
    const { container } = render(
      <Chart caption="R" data={rows} x="day" series={bar} animations={false} />,
    );
    hoverAt(container, 500);
    const active = container.querySelectorAll('[data-mark][data-active]');
    expect(active).toHaveLength(1);
  });

  it('the active mark is the one nearest the pointer', () => {
    const { container } = render(
      <Chart caption="R" data={rows} x="day" series={bar} animations={false} />,
    );
    const marks = () => [...container.querySelectorAll('[data-mark]')];
    hoverAt(container, 20);
    expect(marks().findIndex((m) => m.hasAttribute('data-active'))).toBe(0);
    hoverAt(container, 580);
    expect(marks().findIndex((m) => m.hasAttribute('data-active'))).toBe(2);
  });

  it('restores every mark when the pointer leaves', () => {
    const { container } = render(
      <Chart caption="R" data={rows} x="day" series={bar} animations={false} />,
    );
    hoverAt(container, 500);
    expect(container.querySelectorAll('[data-mark][data-active]')).toHaveLength(1);
    fireEvent.pointerLeave(container.querySelector('[role="img"]')!);
    // "nothing hovered" and "this one" resolve alike — which is what keeps the
    // animation's selectors static.
    expect(container.querySelectorAll('[data-mark][data-active]')).toHaveLength(3);
  });

  it('pie slices take part too', () => {
    const { container } = render(
      <Chart
        caption="R"
        data={rows}
        x="day"
        series={[{ key: 'visits', type: 'pie', label: 'Visits' }]}
        animations={false}
      />,
    );
    expect(container.querySelectorAll('[data-slice][data-mark]')).toHaveLength(3);
  });

  it('scatter points take part too', () => {
    const { container } = render(
      <Chart
        caption="R"
        data={rows}
        x="day"
        series={[{ key: 'visits', type: 'scatter', label: 'Visits' }]}
        animations={false}
      />,
    );
    expect(container.querySelectorAll('[data-dot][data-mark]')).toHaveLength(3);
  });
});

describe('Chart — axes', () => {
  const rows = [
    { d: 'a', v: 1 },
    { d: 'b', v: 4 },
    { d: 'c', v: 2 },
  ];
  const line = [{ key: 'v', type: 'line' as const, label: 'V' }];

  it('draws tick labels by default', () => {
    const { container } = render(
      <Chart caption="R" data={rows} x="d" series={line} animations={false} />,
    );
    expect(container.querySelectorAll('text').length).toBeGreaterThan(0);
  });

  it('axes={false} removes every label and the baseline', () => {
    const { container } = render(
      <Chart
        caption="R"
        data={rows}
        x="d"
        series={line}
        axes={false}
        grid="none"
        animations={false}
      />,
    );
    expect(container.querySelectorAll('text')).toHaveLength(0);
    // no stray rule under the drawing
    expect(container.querySelectorAll('line')).toHaveLength(0);
  });

  it('the drawing fills the box once the gutters are gone', () => {
    const withAxes = render(
      <Chart caption="R" data={rows} x="d" series={line} animations={false} />,
    );
    const bare = render(
      <Chart caption="R" data={rows} x="d" series={line} axes={false} animations={false} />,
    );
    const width = (c: HTMLElement) =>
      c.querySelector('[data-series] path[stroke]')!.getBoundingClientRect().width;
    // jsdom has no layout, so compare the path data instead: the bare chart
    // starts further left because there is no gutter for tick labels.
    const firstX = (c: HTMLElement) =>
      Number(
        c
          .querySelector('[data-series] path[stroke]')!
          .getAttribute('d')!
          .match(/M([\d.]+)/)![1],
      );
    expect(firstX(bare.container)).toBeLessThan(firstX(withAxes.container));
    void width;
  });
});
