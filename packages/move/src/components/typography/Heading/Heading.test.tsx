// Generated from Heading.spec.ts
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Heading } from './Heading';

describe('Heading', () => {
  // === readableWidth ===
  describe('readableWidth', () => {
    it('applies data-readable-width when set', () => {
      render(
        <Heading data-testid="heading" readableWidth>
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading')).toHaveAttribute('data-readable-width');
    });

    it('omits data-readable-width by default', () => {
      render(<Heading data-testid="heading">Title</Heading>);
      expect(screen.getByTestId('heading')).not.toHaveAttribute('data-readable-width');
    });
  });

  // === Rendering ===
  describe('rendering', () => {
    it('renders as h2 element by default', () => {
      render(<Heading data-testid="heading">Title</Heading>);
      const el = screen.getByTestId('heading');
      expect(el.tagName).toBe('H2');
    });

    it('renders as h1 when level=1', () => {
      render(
        <Heading level={1} data-testid="heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading').tagName).toBe('H1');
    });

    it('renders as h3 when level=3', () => {
      render(
        <Heading level={3} data-testid="heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading').tagName).toBe('H3');
    });

    it('renders as h4 when level=4', () => {
      render(
        <Heading level={4} data-testid="heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading').tagName).toBe('H4');
    });

    it('renders as h5 when level=5', () => {
      render(
        <Heading level={5} data-testid="heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading').tagName).toBe('H5');
    });

    it('renders as h6 when level=6', () => {
      render(
        <Heading level={6} data-testid="heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading').tagName).toBe('H6');
    });

    it('renders children as text content', () => {
      render(<Heading>Hello World</Heading>);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLHeadingElement>;
      render(<Heading ref={ref}>Title</Heading>);
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });

    it('forwards className and style', () => {
      render(
        <Heading className="custom" style={{ marginTop: '10px' }} data-testid="heading">
          Title
        </Heading>,
      );
      const el = screen.getByTestId('heading');
      expect(el).toHaveClass('custom');
      expect(el).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <Heading data-testid="heading" aria-label="main heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading')).toHaveAttribute('aria-label', 'main heading');
    });
  });

  // === Size ===
  describe('size', () => {
    it('derives size from level when size prop is not provided (level 1 -> 4xl)', () => {
      render(
        <Heading level={1} data-testid="heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading')).toHaveAttribute('data-size', '4xl');
    });

    it('derives size from level when size prop is not provided (level 2 -> 3xl)', () => {
      render(
        <Heading level={2} data-testid="heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading')).toHaveAttribute('data-size', '3xl');
    });

    it('derives size from level when size prop is not provided (level 3 -> 2xl)', () => {
      render(
        <Heading level={3} data-testid="heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading')).toHaveAttribute('data-size', '2xl');
    });

    it('derives size from level when size prop is not provided (level 4 -> xl)', () => {
      render(
        <Heading level={4} data-testid="heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading')).toHaveAttribute('data-size', 'xl');
    });

    it('derives size from level when size prop is not provided (level 5 -> lg)', () => {
      render(
        <Heading level={5} data-testid="heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading')).toHaveAttribute('data-size', 'lg');
    });

    it('derives size from level when size prop is not provided (level 6 -> base)', () => {
      render(
        <Heading level={6} data-testid="heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading')).toHaveAttribute('data-size', 'base');
    });

    it('defaults to 3xl size for default level=2', () => {
      render(<Heading data-testid="heading">Title</Heading>);
      expect(screen.getByTestId('heading')).toHaveAttribute('data-size', '3xl');
    });
  });

  // === Weight ===
  describe('weight', () => {
    it('has no explicit weight by default (inherits the heading-weight token)', () => {
      render(<Heading data-testid="heading">Title</Heading>);
      expect(screen.getByTestId('heading')).not.toHaveAttribute('data-weight');
    });

    it('applies weight via data-weight attribute', () => {
      render(
        <Heading weight="semibold" data-testid="heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading')).toHaveAttribute('data-weight', 'semibold');
    });

    it.each(['medium', 'semibold', 'bold'] as const)('supports weight=%s', (weight) => {
      render(
        <Heading weight={weight} data-testid="heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading')).toHaveAttribute('data-weight', weight);
    });
  });

  // === Color ===
  describe('color', () => {
    it('defaults to color=base', () => {
      render(<Heading data-testid="heading">Title</Heading>);
      expect(screen.getByTestId('heading')).toHaveAttribute('data-color', 'base');
    });

    it('applies color via data-color attribute', () => {
      render(
        <Heading color="muted" data-testid="heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading')).toHaveAttribute('data-color', 'muted');
    });

    it.each(['base', 'muted', 'subtle'] as const)('supports color=%s', (color) => {
      render(
        <Heading color={color} data-testid="heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading')).toHaveAttribute('data-color', color);
    });
  });

  // === Tracking ===
  describe('tracking', () => {
    it('defaults to tracking=tight', () => {
      render(<Heading data-testid="heading">Title</Heading>);
      expect(screen.getByTestId('heading')).toHaveAttribute('data-tracking', 'tight');
    });

    it('applies tracking via data-tracking attribute', () => {
      render(
        <Heading tracking="normal" data-testid="heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading')).toHaveAttribute('data-tracking', 'normal');
    });
  });

  // === Align ===
  describe('align', () => {
    it('sets data-align only when align prop is provided', () => {
      render(<Heading data-testid="heading">Title</Heading>);
      expect(screen.getByTestId('heading')).not.toHaveAttribute('data-align');
    });

    it('applies data-align when align is provided', () => {
      render(
        <Heading align="center" data-testid="heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading')).toHaveAttribute('data-align', 'center');
    });

    it.each(['left', 'center', 'right'] as const)('supports align=%s', (align) => {
      render(
        <Heading align={align} data-testid="heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading')).toHaveAttribute('data-align', align);
    });
  });

  // === Truncate ===
  describe('truncate', () => {
    it('sets data-truncate when truncate=true', () => {
      render(
        <Heading truncate data-testid="heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading')).toHaveAttribute('data-truncate');
    });

    it('omits data-truncate when truncate is false', () => {
      render(
        <Heading truncate={false} data-testid="heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading')).not.toHaveAttribute('data-truncate');
    });

    it('omits data-truncate when truncate is undefined', () => {
      render(<Heading data-testid="heading">Title</Heading>);
      expect(screen.getByTestId('heading')).not.toHaveAttribute('data-truncate');
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(
        <Heading sp={{ root: { className: 'sp-root' } }} data-testid="heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading')).toHaveClass('sp-root');
    });

    it('merges sp style on root', () => {
      render(
        <Heading sp={{ root: { style: { color: 'red' } } }} data-testid="heading">
          Title
        </Heading>,
      );
      expect(screen.getByTestId('heading')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });
  });
});
