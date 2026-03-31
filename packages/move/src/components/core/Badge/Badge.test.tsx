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
    it('defaults to variant=solid', () => {
      render(<Badge data-testid="badge">Badge</Badge>);
      expect(screen.getByTestId('badge')).toHaveAttribute('data-variant', 'solid');
    });

    it('applies variant via data-variant attribute', () => {
      render(
        <Badge variant="outline" data-testid="badge">
          Badge
        </Badge>
      );
      expect(screen.getByTestId('badge')).toHaveAttribute('data-variant', 'outline');
    });

    it.each(['solid', 'soft', 'surface', 'outline', 'dot'] as const)(
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

  // === Colors ===
  describe('colors', () => {
    it('defaults to color=gray (resolved from default)', () => {
      render(<Badge data-testid="badge">Badge</Badge>);
      expect(screen.getByTestId('badge')).toHaveAttribute('data-color', 'gray');
    });

    it('resolves semantic color names to palettes', () => {
      render(<Badge color="primary" data-testid="badge">Badge</Badge>);
      expect(screen.getByTestId('badge')).toHaveAttribute('data-color', 'indigo');
    });

    it('passes palette colors through directly', () => {
      render(<Badge color="violet" data-testid="badge">Badge</Badge>);
      expect(screen.getByTestId('badge')).toHaveAttribute('data-color', 'violet');
    });

    it.each(['default', 'primary', 'success', 'warning', 'danger', 'info'] as const)(
      'supports semantic color=%s',
      (color) => {
        render(
          <Badge color={color} data-testid="badge">
            Badge
          </Badge>
        );
        expect(screen.getByTestId('badge')).toHaveAttribute('data-color');
      }
    );

    it.each(['red', 'pink', 'grape', 'violet', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange'] as const)(
      'supports palette color=%s',
      (color) => {
        render(
          <Badge color={color} data-testid="badge">
            Badge
          </Badge>
        );
        expect(screen.getByTestId('badge')).toHaveAttribute('data-color', color);
      }
    );
  });

  // === Dot variant ===
  describe('dot variant', () => {
    it('renders a dot indicator element', () => {
      const { container } = render(<Badge variant="dot" color="success" data-testid="badge">Active</Badge>);
      const dot = container.querySelector('[class*="dot"]');
      expect(dot).toBeInTheDocument();
      expect(dot).toHaveAttribute('data-color', 'green');
    });

    it('does not render dot for other variants', () => {
      const { container } = render(<Badge variant="solid" data-testid="badge">Badge</Badge>);
      const dot = container.querySelector('[class*="dot"]');
      expect(dot).not.toBeInTheDocument();
    });
  });

  // === Sizes ===
  describe('sizes', () => {
    it('defaults to size=md', () => {
      render(<Badge data-testid="badge">Badge</Badge>);
      expect(screen.getByTestId('badge')).toHaveAttribute('data-size', 'md');
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

  // === Variant × Color combinations ===
  describe('variant × color', () => {
    it('supports solid + palette color', () => {
      render(<Badge variant="solid" color="teal" data-testid="badge">Badge</Badge>);
      const el = screen.getByTestId('badge');
      expect(el).toHaveAttribute('data-variant', 'solid');
      expect(el).toHaveAttribute('data-color', 'teal');
    });

    it('supports soft + semantic color', () => {
      render(<Badge variant="soft" color="danger" data-testid="badge">Badge</Badge>);
      const el = screen.getByTestId('badge');
      expect(el).toHaveAttribute('data-variant', 'soft');
      expect(el).toHaveAttribute('data-color', 'red');
    });

    it('supports outline + palette color', () => {
      render(<Badge variant="outline" color="grape" data-testid="badge">Badge</Badge>);
      const el = screen.getByTestId('badge');
      expect(el).toHaveAttribute('data-variant', 'outline');
      expect(el).toHaveAttribute('data-color', 'grape');
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
