// Generated from ProgressBar.spec.ts
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders with role="progressbar"', () => {
      render(<ProgressBar data-testid="pb" value={50} />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('marks the indeterminate state aria-busy, but not the determinate one (WCAG 4.1.3)', () => {
      const { rerender } = render(<ProgressBar aria-label="Loading" />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-busy', 'true');
      rerender(<ProgressBar aria-label="Loading" value={50} />);
      expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-busy');
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(<ProgressBar ref={ref} value={50} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className and style', () => {
      render(
        <ProgressBar
          className="custom"
          style={{ marginTop: '10px' }}
          data-testid="pb"
          value={50}
        />,
      );
      const el = screen.getByRole('progressbar');
      expect(el).toHaveClass('custom');
      expect(el).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(<ProgressBar data-testid="pb" aria-label="progress" value={50} />);
      expect(screen.getByTestId('pb')).toHaveAttribute('aria-label', 'progress');
    });

    it('renders indicator element', () => {
      const { container } = render(<ProgressBar value={50} />);
      const indicator = container.querySelector('[class*="indicator"]');
      expect(indicator).toBeInTheDocument();
    });
  });

  // === Defaults ===
  describe('defaults', () => {
    it('defaults to max=100', () => {
      render(<ProgressBar value={50} />);
      const el = screen.getByRole('progressbar');
      expect(el).toHaveAttribute('aria-valuemax', '100');
    });

    it('defaults to size=md', () => {
      render(<ProgressBar value={50} />);
      const el = screen.getByRole('progressbar');
      expect(el).toHaveAttribute('data-size', 'md');
    });

    it('defaults to variant=default', () => {
      render(<ProgressBar value={50} />);
      const el = screen.getByRole('progressbar');
      expect(el).toHaveAttribute('data-variant', 'default');
    });
  });

  // === Props ===
  describe('props', () => {
    it('passes value to Radix Progress.Root', () => {
      render(<ProgressBar value={75} />);
      const el = screen.getByRole('progressbar');
      expect(el).toHaveAttribute('aria-valuenow', '75');
    });

    it('passes max to Radix Progress.Root', () => {
      render(<ProgressBar value={50} max={200} />);
      const el = screen.getByRole('progressbar');
      expect(el).toHaveAttribute('aria-valuemax', '200');
    });

    it('passes getValueLabel to Radix Progress.Root', () => {
      render(
        <ProgressBar
          value={50}
          max={100}
          getValueLabel={(value: number, max: number) => `${value} of ${max} items`}
        />,
      );
      const el = screen.getByRole('progressbar');
      expect(el).toHaveAttribute('aria-valuetext', '50 of 100 items');
    });
  });

  // === Sizes ===
  describe('sizes', () => {
    it.each(['sm', 'md', 'lg'] as const)('supports size=%s', (size) => {
      render(<ProgressBar size={size} value={50} />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('data-size', size);
    });
  });

  // === Variants ===
  describe('variants', () => {
    it.each(['default', 'success', 'warning', 'error'] as const)(
      'supports variant=%s',
      (variant) => {
        render(<ProgressBar variant={variant} value={50} />);
        expect(screen.getByRole('progressbar')).toHaveAttribute('data-variant', variant);
      },
    );
  });

  // === Indicator transform ===
  describe('indicator transform', () => {
    it('sets translateX based on percentage', () => {
      const { container } = render(<ProgressBar value={75} max={100} />);
      const indicator = container.querySelector('[class*="indicator"]') as HTMLElement;
      // useEffect sets transform imperatively
      expect(indicator.style.transform).toBe('translateX(-25%)');
    });

    it('clamps percentage between 0 and 100', () => {
      const { container } = render(<ProgressBar value={150} max={100} />);
      const indicator = container.querySelector('[class*="indicator"]') as HTMLElement;
      expect(indicator.style.transform).toBe('translateX(-0%)');
      // The clamp must reach the accessibility tree too, not just the transform: an
      // out-of-range value handed to Radix falls back to indeterminate and drops
      // aria-valuenow, leaving a full-looking bar that announces no value.
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    });

    it('handles value=0', () => {
      const { container } = render(<ProgressBar value={0} max={100} />);
      const indicator = container.querySelector('[class*="indicator"]') as HTMLElement;
      expect(indicator.style.transform).toBe('translateX(-100%)');
    });
  });

  // === Indeterminate ===
  describe('indeterminate', () => {
    it('sets data-state="indeterminate" when value is null', () => {
      render(<ProgressBar value={null} />);
      const el = screen.getByRole('progressbar');
      expect(el).toHaveAttribute('data-state', 'indeterminate');
    });

    it('clears indicator transform when value is null', () => {
      const { container } = render(<ProgressBar value={null} />);
      const indicator = container.querySelector('[class*="indicator"]') as HTMLElement;
      expect(indicator.style.transform).toBe('');
    });

    it('omits aria-valuenow when indeterminate', () => {
      render(<ProgressBar value={null} />);
      const el = screen.getByRole('progressbar');
      expect(el).not.toHaveAttribute('aria-valuenow');
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(<ProgressBar sp={{ root: { className: 'sp-root' } }} value={50} />);
      expect(screen.getByRole('progressbar')).toHaveClass('sp-root');
    });
  });
});
