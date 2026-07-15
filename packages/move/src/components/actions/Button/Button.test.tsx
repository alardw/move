// Generated from Button.spec.ts
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders as button element', () => {
      render(<Button data-testid="btn">Click</Button>);
      const el = screen.getByTestId('btn');
      expect(el.tagName).toBe('BUTTON');
    });

    it('renders children content', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLButtonElement>;
      render(<Button ref={ref}>Btn</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('forwards className and style', () => {
      render(
        <Button className="custom" style={{ marginTop: '10px' }} data-testid="btn">
          Btn
        </Button>,
      );
      const el = screen.getByTestId('btn');
      expect(el).toHaveClass('custom');
      expect(el).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <Button data-testid="btn" aria-label="action">
          Btn
        </Button>,
      );
      expect(screen.getByTestId('btn')).toHaveAttribute('aria-label', 'action');
    });
  });

  // === Defaults ===
  describe('defaults', () => {
    it('defaults to variant=primary', () => {
      render(<Button data-testid="btn">Btn</Button>);
      expect(screen.getByTestId('btn')).toHaveAttribute('data-variant', 'primary');
    });

    it('defaults to size=md', () => {
      render(<Button data-testid="btn">Btn</Button>);
      expect(screen.getByTestId('btn')).toHaveAttribute('data-size', 'md');
    });

    it('defaults to type=button', () => {
      render(<Button data-testid="btn">Btn</Button>);
      expect(screen.getByTestId('btn')).toHaveAttribute('type', 'button');
    });
  });

  // === Variants ===
  describe('variants', () => {
    it.each(['primary', 'secondary', 'ghost', 'danger'] as const)(
      'supports variant=%s',
      (variant) => {
        render(
          <Button variant={variant} data-testid="btn">
            Btn
          </Button>,
        );
        expect(screen.getByTestId('btn')).toHaveAttribute('data-variant', variant);
      },
    );
  });

  // === Sizes ===
  describe('sizes', () => {
    it.each(['sm', 'md', 'lg'] as const)('supports size=%s', (size) => {
      render(
        <Button size={size} data-testid="btn">
          Btn
        </Button>,
      );
      expect(screen.getByTestId('btn')).toHaveAttribute('data-size', size);
    });
  });

  // === Disabled ===
  describe('disabled', () => {
    it('supports disabled state', () => {
      render(
        <Button disabled data-testid="btn">
          Btn
        </Button>,
      );
      expect(screen.getByTestId('btn')).toBeDisabled();
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(
        <Button sp={{ root: { className: 'sp-root' } }} data-testid="btn">
          Btn
        </Button>,
      );
      expect(screen.getByTestId('btn')).toHaveClass('sp-root');
    });
  });

  // === Button.Group ===
  describe('Button.Group', () => {
    it('renders group container', () => {
      render(
        <Button.Group data-testid="group">
          <Button>A</Button>
          <Button>B</Button>
        </Button.Group>,
      );
      expect(screen.getByTestId('group')).toHaveAttribute('role', 'group');
    });
  });
});
