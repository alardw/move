// Generated from Splitter.spec.ts
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Splitter } from './Splitter';
import { createRef } from 'react';

describe('Splitter', () => {
  // === Splitter.Root ===
  describe('Splitter.Root', () => {
    it('renders a flex container with data-layout', () => {
      render(
        <Splitter.Root data-testid="root">
          <Splitter.Panel>A</Splitter.Panel>
          <Splitter.Panel>B</Splitter.Panel>
        </Splitter.Root>,
      );
      const el = screen.getByTestId('root');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('DIV');
      expect(el).toHaveAttribute('data-layout');
    });

    it('defaults layout to horizontal', () => {
      render(
        <Splitter.Root data-testid="root">
          <Splitter.Panel>A</Splitter.Panel>
          <Splitter.Panel>B</Splitter.Panel>
        </Splitter.Root>,
      );
      expect(screen.getByTestId('root')).toHaveAttribute('data-layout', 'horizontal');
    });

    it('supports vertical layout', () => {
      render(
        <Splitter.Root data-testid="root" layout="vertical">
          <Splitter.Panel>A</Splitter.Panel>
          <Splitter.Panel>B</Splitter.Panel>
        </Splitter.Root>,
      );
      expect(screen.getByTestId('root')).toHaveAttribute('data-layout', 'vertical');
    });

    it('auto-injects gutters between Panel children', () => {
      render(
        <Splitter.Root data-testid="root">
          <Splitter.Panel>A</Splitter.Panel>
          <Splitter.Panel>B</Splitter.Panel>
          <Splitter.Panel>C</Splitter.Panel>
        </Splitter.Root>,
      );
      const separators = screen.getAllByRole('separator');
      expect(separators).toHaveLength(2);
    });

    it('forwards className and style', () => {
      render(
        <Splitter.Root data-testid="root" className="custom" style={{ marginTop: '10px' }}>
          <Splitter.Panel>A</Splitter.Panel>
        </Splitter.Root>,
      );
      const el = screen.getByTestId('root');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ marginTop: '10px' });
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Splitter.Root ref={ref}>
          <Splitter.Panel>A</Splitter.Panel>
        </Splitter.Root>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('spreads HTML attributes', () => {
      render(
        <Splitter.Root data-testid="root" aria-label="Splitter">
          <Splitter.Panel>A</Splitter.Panel>
        </Splitter.Root>,
      );
      expect(screen.getByTestId('root')).toHaveAttribute('aria-label', 'Splitter');
    });
  });

  // === Splitter.Panel ===
  describe('Splitter.Panel', () => {
    // An unsized panel used to take 100/panelCount regardless of what its
    // siblings had claimed, so `size={38}` + one unsized came to 88% and left
    // 12% of the Splitter empty. The remainder is only knowable in the Root.
    it('gives an unsized panel the space its sized siblings leave', () => {
      render(
        <Splitter.Root>
          <Splitter.Panel defaultSize="38%">A</Splitter.Panel>
          <Splitter.Panel data-testid="rest">B</Splitter.Panel>
        </Splitter.Root>,
      );
      expect(screen.getByTestId('rest')).toHaveStyle({ width: '62%' });
    });

    it('splits evenly across several unsized panels', () => {
      render(
        <Splitter.Root>
          <Splitter.Panel defaultSize="40%">A</Splitter.Panel>
          <Splitter.Panel data-testid="b">B</Splitter.Panel>
          <Splitter.Panel data-testid="c">C</Splitter.Panel>
        </Splitter.Root>,
      );
      // 60 left over, two takers.
      expect(screen.getByTestId('b')).toHaveStyle({ width: '30%' });
      expect(screen.getByTestId('c')).toHaveStyle({ width: '30%' });
    });

    // minSize was registered and then never read by the drag handler, which
    // clamped every panel at a hardcoded 5% — so the prop had no effect at all.
    it("honours each panel's own minSize, not a shared floor", () => {
      render(
        <Splitter.Root>
          <Splitter.Panel data-testid="a" defaultSize="50%" minSize="40%">
            A
          </Splitter.Panel>
          <Splitter.Panel data-testid="b" defaultSize="50%" minSize="10%">
            B
          </Splitter.Panel>
        </Splitter.Root>,
      );
      const gutter = screen.getByRole('separator');
      // Push well past the 40% floor — 2% a press, so 10 presses would reach 30%.
      for (let i = 0; i < 10; i += 1) fireEvent.keyDown(gutter, { key: 'ArrowLeft' });
      const a = parseFloat((screen.getByTestId('a') as HTMLElement).style.width);
      expect(a).toBeGreaterThanOrEqual(40);
    });

    it('renders with percentage width in horizontal layout', () => {
      render(
        <Splitter.Root>
          <Splitter.Panel data-testid="panel" defaultSize="30%">
            A
          </Splitter.Panel>
          <Splitter.Panel defaultSize="70%">B</Splitter.Panel>
        </Splitter.Root>,
      );
      const panel = screen.getByTestId('panel');
      expect(panel).toHaveStyle({ width: '30%' });
    });

    it('renders with percentage height in vertical layout', () => {
      render(
        <Splitter.Root layout="vertical">
          <Splitter.Panel data-testid="panel" defaultSize="40%">
            A
          </Splitter.Panel>
          <Splitter.Panel defaultSize="60%">B</Splitter.Panel>
        </Splitter.Root>,
      );
      const panel = screen.getByTestId('panel');
      expect(panel).toHaveStyle({ height: '40%' });
    });

    it('auto-distributes size when size prop not specified', () => {
      render(
        <Splitter.Root>
          <Splitter.Panel data-testid="panel-a">A</Splitter.Panel>
          <Splitter.Panel data-testid="panel-b">B</Splitter.Panel>
        </Splitter.Root>,
      );
      const panelA = screen.getByTestId('panel-a');
      expect(panelA).toHaveStyle({ width: '50%' });
    });

    it('renders children', () => {
      render(
        <Splitter.Root>
          <Splitter.Panel>Panel Content</Splitter.Panel>
        </Splitter.Root>,
      );
      expect(screen.getByText('Panel Content')).toBeInTheDocument();
    });

    it('forwards className and style', () => {
      render(
        <Splitter.Root>
          <Splitter.Panel
            data-testid="panel"
            className="custom-panel"
            style={{ background: 'rgb(0, 0, 255)' }}
          >
            A
          </Splitter.Panel>
        </Splitter.Root>,
      );
      const panel = screen.getByTestId('panel');
      expect(panel.className).toContain('custom-panel');
      expect(panel).toHaveStyle({ background: 'rgb(0, 0, 255)' });
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Splitter.Root>
          <Splitter.Panel ref={ref}>A</Splitter.Panel>
        </Splitter.Root>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('sets data-layout attribute', () => {
      render(
        <Splitter.Root layout="vertical">
          <Splitter.Panel data-testid="panel">A</Splitter.Panel>
        </Splitter.Root>,
      );
      expect(screen.getByTestId('panel')).toHaveAttribute('data-layout', 'vertical');
    });
  });

  // === Gutter ===
  describe('Gutter', () => {
    it('renders with role=separator', () => {
      render(
        <Splitter.Root>
          <Splitter.Panel>A</Splitter.Panel>
          <Splitter.Panel>B</Splitter.Panel>
        </Splitter.Root>,
      );
      const gutter = screen.getByRole('separator');
      expect(gutter).toBeInTheDocument();
    });

    it('aria-orientation is vertical for horizontal layout', () => {
      render(
        <Splitter.Root layout="horizontal">
          <Splitter.Panel>A</Splitter.Panel>
          <Splitter.Panel>B</Splitter.Panel>
        </Splitter.Root>,
      );
      const gutter = screen.getByRole('separator');
      expect(gutter).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('aria-orientation is horizontal for vertical layout', () => {
      render(
        <Splitter.Root layout="vertical">
          <Splitter.Panel>A</Splitter.Panel>
          <Splitter.Panel>B</Splitter.Panel>
        </Splitter.Root>,
      );
      const gutter = screen.getByRole('separator');
      expect(gutter).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('has aria-valuenow attribute', () => {
      render(
        <Splitter.Root>
          <Splitter.Panel defaultSize="30%">A</Splitter.Panel>
          <Splitter.Panel defaultSize="70%">B</Splitter.Panel>
        </Splitter.Root>,
      );
      const gutter = screen.getByRole('separator');
      expect(gutter).toHaveAttribute('aria-valuenow');
    });

    it('is focusable (tabIndex=0)', () => {
      render(
        <Splitter.Root>
          <Splitter.Panel>A</Splitter.Panel>
          <Splitter.Panel>B</Splitter.Panel>
        </Splitter.Root>,
      );
      const gutter = screen.getByRole('separator');
      expect(gutter).toHaveAttribute('tabindex', '0');
    });
  });

  // === Keyboard ===
  describe('Keyboard', () => {
    it('ArrowRight increases panel before gutter in horizontal layout', () => {
      render(
        <Splitter.Root>
          <Splitter.Panel data-testid="panel-a" defaultSize="50%" minSize="5%">
            A
          </Splitter.Panel>
          <Splitter.Panel data-testid="panel-b" defaultSize="50%" minSize="5%">
            B
          </Splitter.Panel>
        </Splitter.Root>,
      );
      const gutter = screen.getByRole('separator');
      fireEvent.keyDown(gutter, { key: 'ArrowRight' });
      // Panel A should grow (50 + 2 = 52), Panel B should shrink (50 - 2 = 48)
      expect(screen.getByTestId('panel-a')).toHaveStyle({ width: '52%' });
    });

    it('ArrowLeft decreases panel before gutter in horizontal layout', () => {
      render(
        <Splitter.Root>
          <Splitter.Panel data-testid="panel-a" defaultSize="50%" minSize="5%">
            A
          </Splitter.Panel>
          <Splitter.Panel data-testid="panel-b" defaultSize="50%" minSize="5%">
            B
          </Splitter.Panel>
        </Splitter.Root>,
      );
      const gutter = screen.getByRole('separator');
      fireEvent.keyDown(gutter, { key: 'ArrowLeft' });
      // Panel A should shrink (50 - 2 = 48), Panel B should grow (50 + 2 = 52)
      expect(screen.getByTestId('panel-a')).toHaveStyle({ width: '48%' });
    });

    it('ArrowDown increases panel before gutter in vertical layout', () => {
      render(
        <Splitter.Root layout="vertical">
          <Splitter.Panel data-testid="panel-a" defaultSize="50%" minSize="5%">
            A
          </Splitter.Panel>
          <Splitter.Panel data-testid="panel-b" defaultSize="50%" minSize="5%">
            B
          </Splitter.Panel>
        </Splitter.Root>,
      );
      const gutter = screen.getByRole('separator');
      fireEvent.keyDown(gutter, { key: 'ArrowDown' });
      expect(screen.getByTestId('panel-a')).toHaveStyle({ height: '52%' });
    });

    it('ArrowUp decreases panel before gutter in vertical layout', () => {
      render(
        <Splitter.Root layout="vertical">
          <Splitter.Panel data-testid="panel-a" defaultSize="50%" minSize="5%">
            A
          </Splitter.Panel>
          <Splitter.Panel data-testid="panel-b" defaultSize="50%" minSize="5%">
            B
          </Splitter.Panel>
        </Splitter.Root>,
      );
      const gutter = screen.getByRole('separator');
      fireEvent.keyDown(gutter, { key: 'ArrowUp' });
      expect(screen.getByTestId('panel-a')).toHaveStyle({ height: '48%' });
    });

    it('Home minimizes the panel before the gutter', () => {
      render(
        <Splitter.Root>
          <Splitter.Panel data-testid="panel-a" defaultSize="50%" minSize="5%">
            A
          </Splitter.Panel>
          <Splitter.Panel data-testid="panel-b" defaultSize="50%" minSize="5%">
            B
          </Splitter.Panel>
        </Splitter.Root>,
      );
      const gutter = screen.getByRole('separator');
      fireEvent.keyDown(gutter, { key: 'Home' });
      expect(screen.getByTestId('panel-a')).toHaveStyle({ width: '5%' });
    });

    it('End maximizes the panel before the gutter', () => {
      render(
        <Splitter.Root>
          <Splitter.Panel data-testid="panel-a" defaultSize="50%" minSize="5%">
            A
          </Splitter.Panel>
          <Splitter.Panel data-testid="panel-b" defaultSize="50%" minSize="5%">
            B
          </Splitter.Panel>
        </Splitter.Root>,
      );
      const gutter = screen.getByRole('separator');
      fireEvent.keyDown(gutter, { key: 'End' });
      expect(screen.getByTestId('panel-a')).toHaveStyle({ width: '95%' });
    });

    it('onResizeEnd called after keyboard resize', () => {
      const onResizeEnd = vi.fn();
      render(
        <Splitter.Root onResizeEnd={onResizeEnd}>
          <Splitter.Panel defaultSize="50%">A</Splitter.Panel>
          <Splitter.Panel defaultSize="50%">B</Splitter.Panel>
        </Splitter.Root>,
      );
      const gutter = screen.getByRole('separator');
      fireEvent.keyDown(gutter, { key: 'ArrowRight' });
      expect(onResizeEnd).toHaveBeenCalled();
    });

    it('keyboard resize respects minSize constraint', () => {
      render(
        <Splitter.Root>
          <Splitter.Panel data-testid="panel-a" defaultSize="6%" minSize="5%">
            A
          </Splitter.Panel>
          <Splitter.Panel data-testid="panel-b" defaultSize="94%" minSize="5%">
            B
          </Splitter.Panel>
        </Splitter.Root>,
      );
      const gutter = screen.getByRole('separator');
      // ArrowLeft would take panel A to 4%, under its declared 5% floor — refused.
      fireEvent.keyDown(gutter, { key: 'ArrowLeft' });
      expect(screen.getByTestId('panel-a')).toHaveStyle({ width: '5%' });
    });
  });

  // === Composition ===
  describe('Composition', () => {
    it('renders a complete splitter layout', () => {
      render(
        <Splitter.Root data-testid="root">
          <Splitter.Panel data-testid="left">Left</Splitter.Panel>
          <Splitter.Panel data-testid="right">Right</Splitter.Panel>
        </Splitter.Root>,
      );

      expect(screen.getByTestId('root')).toBeInTheDocument();
      expect(screen.getByTestId('left')).toBeInTheDocument();
      expect(screen.getByTestId('right')).toBeInTheDocument();
      expect(screen.getByRole('separator')).toBeInTheDocument();
      expect(screen.getByText('Left')).toBeInTheDocument();
      expect(screen.getByText('Right')).toBeInTheDocument();
    });

    it('supports three-panel layout', () => {
      render(
        <Splitter.Root>
          <Splitter.Panel>A</Splitter.Panel>
          <Splitter.Panel>B</Splitter.Panel>
          <Splitter.Panel>C</Splitter.Panel>
        </Splitter.Root>,
      );
      const separators = screen.getAllByRole('separator');
      expect(separators).toHaveLength(2);
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.getByText('C')).toBeInTheDocument();
    });
  });
});
