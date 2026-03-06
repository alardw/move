// Generated from Badge.spec.ts (schemaVersion: 6, specHash: ddc033c4)
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders as span element', () => {
      render(<Badge data-testid="badge">Label</Badge>);
      const el = screen.getByTestId('badge');
      expect(el.tagName).toBe('SPAN');
    });

    it('renders children content', () => {
      render(<Badge>Status</Badge>);
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLSpanElement>;
      render(<Badge ref={ref}>Badge</Badge>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it('forwards className and style', () => {
      render(
        <Badge className="custom" style={{ marginTop: '10px' }} data-testid="badge">
          Badge
        </Badge>
      );
      const el = screen.getByTestId('badge');
      expect(el).toHaveClass('custom');
      expect(el).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <Badge data-testid="badge" aria-label="status">
          Badge
        </Badge>
      );
      expect(screen.getByTestId('badge')).toHaveAttribute('aria-label', 'status');
    });
  });

  // === Variants ===
  describe('variants', () => {
    it('defaults to variant=primary', () => {
      render(<Badge data-testid="badge">Badge</Badge>);
      expect(screen.getByTestId('badge')).toHaveAttribute('data-variant', 'primary');
    });

    it('applies variant via data-variant attribute', () => {
      render(
        <Badge variant="danger" data-testid="badge">
          Badge
        </Badge>
      );
      expect(screen.getByTestId('badge')).toHaveAttribute('data-variant', 'danger');
    });

    it.each(['primary', 'secondary', 'outline', 'success', 'warning', 'danger'] as const)(
      'supports variant=%s',
      (variant) => {
        render(
          <Badge variant={variant} data-testid="badge">
            Badge
          </Badge>
        );
        expect(screen.getByTestId('badge')).toHaveAttribute('data-variant', variant);
      }
    );
  });

  // === Sizes ===
  describe('sizes', () => {
    it('defaults to size=md', () => {
      render(<Badge data-testid="badge">Badge</Badge>);
      expect(screen.getByTestId('badge')).toHaveAttribute('data-size', 'md');
    });

    it('applies size via data-size attribute', () => {
      render(
        <Badge size="lg" data-testid="badge">
          Badge
        </Badge>
      );
      expect(screen.getByTestId('badge')).toHaveAttribute('data-size', 'lg');
    });

    it.each(['sm', 'md', 'lg'] as const)('supports size=%s', (size) => {
      render(
        <Badge size={size} data-testid="badge">
          Badge
        </Badge>
      );
      expect(screen.getByTestId('badge')).toHaveAttribute('data-size', size);
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(
        <Badge sp={{ root: { className: 'sp-root' } }} data-testid="badge">
          Badge
        </Badge>
      );
      expect(screen.getByTestId('badge')).toHaveClass('sp-root');
    });
  });
});
