// Generated from Skeleton.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  // === Root ===
  describe('Skeleton.Root', () => {
    it('renders children when loading=true', () => {
      render(
        <Skeleton.Root loading={true} data-testid="root">
          <Skeleton.Circle />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('root')).toBeInTheDocument();
    });

    it('returns null when loading=false', () => {
      render(
        <Skeleton.Root loading={false} data-testid="root">
          <Skeleton.Circle />
        </Skeleton.Root>
      );
      expect(screen.queryByTestId('root')).not.toBeInTheDocument();
    });

    it('defaults to loading=true', () => {
      render(
        <Skeleton.Root data-testid="root">
          <Skeleton.Circle />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('root')).toBeInTheDocument();
    });

    it('has aria-busy attribute', () => {
      render(
        <Skeleton.Root data-testid="root">
          <Skeleton.Circle />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('root')).toHaveAttribute('aria-busy', 'true');
    });

    it('has aria-live="polite" attribute', () => {
      render(
        <Skeleton.Root data-testid="root">
          <Skeleton.Circle />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('root')).toHaveAttribute('aria-live', 'polite');
    });

    it('sets data-animation attribute to animation value', () => {
      render(
        <Skeleton.Root animation="wave" data-testid="root">
          <Skeleton.Circle />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('root')).toHaveAttribute('data-animation', 'wave');
    });

    it('defaults to data-animation="pulse"', () => {
      render(
        <Skeleton.Root data-testid="root">
          <Skeleton.Circle />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('root')).toHaveAttribute('data-animation', 'pulse');
    });

    it('omits data-animation when animation is false', () => {
      render(
        <Skeleton.Root animation={false} data-testid="root">
          <Skeleton.Circle />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('root')).not.toHaveAttribute('data-animation');
    });

    it('forwards ref to root element', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Skeleton.Root ref={ref}>
          <Skeleton.Circle />
        </Skeleton.Root>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('passes className to root', () => {
      render(
        <Skeleton.Root className="custom" data-testid="root">
          <Skeleton.Circle />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('root').className).toContain('custom');
    });

    it('passes style to root', () => {
      render(
        <Skeleton.Root style={{ marginTop: '10px' }} data-testid="root">
          <Skeleton.Circle />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('root')).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <Skeleton.Root data-testid="root" data-custom="yes">
          <Skeleton.Circle />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('root')).toHaveAttribute('data-custom', 'yes');
    });
  });

  // === Circle ===
  describe('Skeleton.Circle', () => {
    it('renders a circle', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Circle data-testid="circle" />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('circle')).toBeInTheDocument();
    });

    it('defaults to size=40', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Circle data-testid="circle" />
        </Skeleton.Root>
      );
      const el = screen.getByTestId('circle');
      expect(el).toHaveStyle({ width: '40px', height: '40px' });
    });

    it('size prop sets width and height (number converts to px)', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Circle size={60} data-testid="circle" />
        </Skeleton.Root>
      );
      const el = screen.getByTestId('circle');
      expect(el).toHaveStyle({ width: '60px', height: '60px' });
    });

    it('size prop accepts string values', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Circle size="3rem" data-testid="circle" />
        </Skeleton.Root>
      );
      const el = screen.getByTestId('circle');
      expect(el).toHaveStyle({ width: '3rem', height: '3rem' });
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Skeleton.Root>
          <Skeleton.Circle ref={ref} />
        </Skeleton.Root>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Circle className="custom" data-testid="circle" />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('circle').className).toContain('custom');
    });

    it('forwards style', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Circle style={{ marginLeft: '8px' }} data-testid="circle" />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('circle')).toHaveStyle({ marginLeft: '8px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Circle data-testid="circle" data-custom="yes" />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('circle')).toHaveAttribute('data-custom', 'yes');
    });
  });

  // === Rectangle ===
  describe('Skeleton.Rectangle', () => {
    it('renders a rectangle', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Rectangle data-testid="rect" />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('rect')).toBeInTheDocument();
    });

    it('defaults to width=100% and height=1rem', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Rectangle data-testid="rect" />
        </Skeleton.Root>
      );
      const el = screen.getByTestId('rect');
      expect(el).toHaveStyle({ width: '100%', height: '1rem' });
    });

    it('accepts custom width and height', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Rectangle width={200} height={50} data-testid="rect" />
        </Skeleton.Root>
      );
      const el = screen.getByTestId('rect');
      expect(el).toHaveStyle({ width: '200px', height: '50px' });
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Skeleton.Root>
          <Skeleton.Rectangle ref={ref} />
        </Skeleton.Root>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Rectangle className="custom" data-testid="rect" />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('rect').className).toContain('custom');
    });

    it('spreads HTML attributes', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Rectangle data-testid="rect" data-custom="yes" />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('rect')).toHaveAttribute('data-custom', 'yes');
    });
  });

  // === Rounded ===
  describe('Skeleton.Rounded', () => {
    it('renders a rounded shape', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Rounded data-testid="rounded" />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('rounded')).toBeInTheDocument();
    });

    it('defaults to width=100% and height=1rem', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Rounded data-testid="rounded" />
        </Skeleton.Root>
      );
      const el = screen.getByTestId('rounded');
      expect(el).toHaveStyle({ width: '100%', height: '1rem' });
    });

    it('defaults to radius=var(--move-skeleton-radius)', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Rounded data-testid="rounded" />
        </Skeleton.Root>
      );
      const el = screen.getByTestId('rounded');
      expect(el).toHaveStyle({ borderRadius: 'var(--move-skeleton-radius)' });
    });

    it('accepts custom radius', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Rounded radius="12px" data-testid="rounded" />
        </Skeleton.Root>
      );
      const el = screen.getByTestId('rounded');
      expect(el).toHaveStyle({ borderRadius: '12px' });
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Skeleton.Root>
          <Skeleton.Rounded ref={ref} />
        </Skeleton.Root>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Rounded className="custom" data-testid="rounded" />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('rounded').className).toContain('custom');
    });

    it('spreads HTML attributes', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Rounded data-testid="rounded" data-custom="yes" />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('rounded')).toHaveAttribute('data-custom', 'yes');
    });
  });

  // === Text ===
  describe('Skeleton.Text', () => {
    it('renders text lines', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Text data-testid="text" />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('text')).toBeInTheDocument();
    });

    it('defaults to lines=3', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Text data-testid="text" />
        </Skeleton.Root>
      );
      const el = screen.getByTestId('text');
      expect(el.children).toHaveLength(3);
    });

    it('renders correct number of lines', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Text lines={5} data-testid="text" />
        </Skeleton.Root>
      );
      const el = screen.getByTestId('text');
      expect(el.children).toHaveLength(5);
    });

    it('last line has width=60% when lines > 1', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Text lines={3} data-testid="text" />
        </Skeleton.Root>
      );
      const el = screen.getByTestId('text');
      const lastLine = el.children[2] as HTMLElement;
      expect(lastLine).toHaveStyle({ width: '60%' });
    });

    it('single line renders at 100% width', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Text lines={1} data-testid="text" />
        </Skeleton.Root>
      );
      const el = screen.getByTestId('text');
      const firstLine = el.children[0] as HTMLElement;
      expect(firstLine).toHaveStyle({ width: '100%' });
    });

    it('custom lastLineWidth', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Text lines={2} lastLineWidth="40%" data-testid="text" />
        </Skeleton.Root>
      );
      const el = screen.getByTestId('text');
      const lastLine = el.children[1] as HTMLElement;
      expect(lastLine).toHaveStyle({ width: '40%' });
    });

    it('spacing sets gap on text container', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Text spacing="1rem" data-testid="text" />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('text')).toHaveStyle({ gap: '1rem' });
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <Skeleton.Root>
          <Skeleton.Text ref={ref} />
        </Skeleton.Root>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Text className="custom" data-testid="text" />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('text').className).toContain('custom');
    });

    it('spreads HTML attributes', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Text data-testid="text" data-custom="yes" />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('text')).toHaveAttribute('data-custom', 'yes');
    });
  });

  // === Slot Props ===
  describe('slot props', () => {
    it('merges sp className on Root', () => {
      render(
        <Skeleton.Root sp={{ root: { className: 'sp-root' } }} data-testid="root">
          <Skeleton.Circle />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('root').className).toContain('sp-root');
    });

    it('merges sp style on Root', () => {
      render(
        <Skeleton.Root sp={{ root: { style: { marginTop: '5px' } } }} data-testid="root">
          <Skeleton.Circle />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('root')).toHaveStyle({ marginTop: '5px' });
    });

    it('merges sp className on Circle', () => {
      render(
        <Skeleton.Root>
          <Skeleton.Circle sp={{ circle: { className: 'sp-circle' } }} data-testid="circle" />
        </Skeleton.Root>
      );
      expect(screen.getByTestId('circle').className).toContain('sp-circle');
    });
  });
});
