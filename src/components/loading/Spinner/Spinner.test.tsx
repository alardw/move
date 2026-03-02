// Generated from Spinner.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders as div element with role="progressbar"', () => {
      render(<Spinner />);
      const el = screen.getByRole('progressbar');
      expect(el.tagName).toBe('DIV');
    });

    it('has aria-busy attribute', () => {
      render(<Spinner />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-busy');
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(<Spinner ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.getAttribute('role')).toBe('progressbar');
    });

    it('forwards className and style', () => {
      render(<Spinner className="custom" style={{ marginTop: '10px' }} />);
      const el = screen.getByRole('progressbar');
      expect(el).toHaveClass('custom');
      expect(el).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(<Spinner data-testid="spinner" aria-label="loading" />);
      expect(screen.getByTestId('spinner')).toHaveAttribute('aria-label', 'loading');
    });
  });

  // === SVG anatomy ===
  describe('svg anatomy', () => {
    it('renders SVG with viewBox="25 25 50 50"', () => {
      render(<Spinner />);
      const svg = screen.getByRole('progressbar').querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '25 25 50 50');
    });

    it('renders circle with cx=50, cy=50, r=20, fill=none', () => {
      render(<Spinner />);
      const circle = screen.getByRole('progressbar').querySelector('circle');
      expect(circle).toBeInTheDocument();
      expect(circle).toHaveAttribute('cx', '50');
      expect(circle).toHaveAttribute('cy', '50');
      expect(circle).toHaveAttribute('r', '20');
      expect(circle).toHaveAttribute('fill', 'none');
    });

    it('circle has strokeMiterlimit=10', () => {
      render(<Spinner />);
      const circle = screen.getByRole('progressbar').querySelector('circle');
      expect(circle).toHaveAttribute('stroke-miterlimit', '10');
    });

    it('strokeWidth prop is passed to circle element', () => {
      render(<Spinner strokeWidth={5} />);
      const circle = screen.getByRole('progressbar').querySelector('circle');
      expect(circle).toHaveAttribute('stroke-width', '5');
    });

    it('defaults to strokeWidth=3', () => {
      render(<Spinner />);
      const circle = screen.getByRole('progressbar').querySelector('circle');
      expect(circle).toHaveAttribute('stroke-width', '3');
    });
  });

  // === Sizes ===
  describe('sizes', () => {
    it('defaults to size=md', () => {
      render(<Spinner />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('data-size', 'md');
    });

    it('applies size via data-size attribute', () => {
      render(<Spinner size="lg" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('data-size', 'lg');
    });

    it.each(['sm', 'md', 'lg'] as const)('supports size=%s', (size) => {
      render(<Spinner size={size} />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('data-size', size);
    });
  });

  // === Variants ===
  describe('variants', () => {
    it('defaults to variant=default', () => {
      render(<Spinner />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('data-variant', 'default');
    });

    it('applies variant via data-variant attribute', () => {
      render(<Spinner variant="secondary" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('data-variant', 'secondary');
    });

    it.each(['default', 'secondary', 'current'] as const)('supports variant=%s', (variant) => {
      render(<Spinner variant={variant} />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('data-variant', variant);
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(<Spinner sp={{ root: { className: 'sp-root' } }} />);
      expect(screen.getByRole('progressbar')).toHaveClass('sp-root');
    });

    it('merges sp style on root', () => {
      render(<Spinner sp={{ root: { style: { marginTop: '5px' } } }} />);
      expect(screen.getByRole('progressbar')).toHaveStyle({ marginTop: '5px' });
    });
  });
});
