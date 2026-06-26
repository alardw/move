// Generated from Loader.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Loader } from './Loader';

// Mock animejs to avoid real animations in tests
vi.mock('animejs', () => ({
  animate: vi.fn(() => ({ pause: vi.fn() })),
}));

// Mock prefersReducedMotion
vi.mock('../../../animation', () => ({
  prefersReducedMotion: vi.fn(() => false),
}));

describe('Loader', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders as div element with role="progressbar"', () => {
      render(<Loader data-testid="loader" />);
      const el = screen.getByRole('progressbar');
      expect(el.tagName).toBe('DIV');
    });

    it('has aria-busy attribute', () => {
      render(<Loader />);
      const el = screen.getByRole('progressbar');
      expect(el).toHaveAttribute('aria-busy');
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(<Loader ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className and style', () => {
      render(<Loader className="custom" style={{ marginTop: '10px' }} />);
      const el = screen.getByRole('progressbar');
      expect(el).toHaveClass('custom');
      expect(el).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(<Loader data-testid="loader" aria-label="test" />);
      expect(screen.getByTestId('loader')).toHaveAttribute('aria-label', 'test');
    });
  });

  // === Defaults ===
  describe('defaults', () => {
    it('defaults to variant=spinner', () => {
      render(<Loader />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('data-variant', 'spinner');
    });

    it('defaults to color=primary', () => {
      render(<Loader />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('data-color', 'primary');
    });

    it('defaults to size=md', () => {
      render(<Loader />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('data-size', 'md');
    });
  });

  // === Data attributes ===
  describe('data attributes', () => {
    it('applies variant via data-variant attribute', () => {
      render(<Loader variant="dots" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('data-variant', 'dots');
    });

    it('applies color via data-color attribute', () => {
      render(<Loader color="secondary" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('data-color', 'secondary');
    });

    it('applies size via data-size attribute', () => {
      render(<Loader size="lg" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('data-size', 'lg');
    });
  });

  // === Spinner variant ===
  describe('spinner variant', () => {
    it('renders svg and circle elements', () => {
      const { container } = render(<Loader variant="spinner" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
      expect(container.querySelector('circle')).toBeInTheDocument();
    });

    it('does not render dot elements', () => {
      const { container } = render(<Loader variant="spinner" />);
      expect(container.querySelector('[class*="dot"]')).not.toBeInTheDocument();
    });

    it('SVG has viewBox="25 25 50 50"', () => {
      const { container } = render(<Loader variant="spinner" />);
      expect(container.querySelector('svg')).toHaveAttribute('viewBox', '25 25 50 50');
    });

    it('circle has correct cx, cy, r, fill, strokeMiterlimit attributes', () => {
      const { container } = render(<Loader variant="spinner" />);
      const circle = container.querySelector('circle')!;
      expect(circle).toHaveAttribute('cx', '50');
      expect(circle).toHaveAttribute('cy', '50');
      expect(circle).toHaveAttribute('r', '20');
      expect(circle).toHaveAttribute('fill', 'none');
      expect(circle).toHaveAttribute('stroke-miterlimit', '10');
    });

    it('strokeWidth prop is passed to circle element', () => {
      const { container } = render(<Loader variant="spinner" strokeWidth={5} />);
      const circle = container.querySelector('circle')!;
      expect(circle).toHaveAttribute('stroke-width', '5');
    });

    it('defaults strokeWidth to 3', () => {
      const { container } = render(<Loader variant="spinner" />);
      const circle = container.querySelector('circle')!;
      expect(circle).toHaveAttribute('stroke-width', '3');
    });
  });

  // === Dots variant ===
  describe('dots variant', () => {
    it('renders 3 span dot elements', () => {
      const { container } = render(<Loader variant="dots" />);
      const dots = container.querySelectorAll('[class*="dot"]');
      expect(dots).toHaveLength(3);
      dots.forEach((dot) => {
        expect(dot.tagName).toBe('SPAN');
      });
    });

    it('does not render svg element', () => {
      const { container } = render(<Loader variant="dots" />);
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });

    it('has aria-label="Loading"', () => {
      render(<Loader variant="dots" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Loading');
    });

    it('overrides aria-label via labels prop', () => {
      render(<Loader variant="dots" labels={{ loading: 'Bezig met laden' }} />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Bezig met laden');
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(<Loader sp={{ root: { className: 'sp-root' } }} />);
      expect(screen.getByRole('progressbar')).toHaveClass('sp-root');
    });
  });
});
