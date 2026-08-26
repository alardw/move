// Generated from ToggleButton.spec.ts
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ToggleButton } from './ToggleButton';
import { createRef } from 'react';

describe('ToggleButton', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders as button element via Radix Toggle.Root', () => {
      render(<ToggleButton data-testid="tb">Toggle</ToggleButton>);
      const el = screen.getByTestId('tb');
      expect(el.tagName).toBe('BUTTON');
    });

    it('renders children content', () => {
      render(<ToggleButton>Bold</ToggleButton>);
      expect(screen.getByText('Bold')).toBeInTheDocument();
    });

    it('forwards ref to root element', () => {
      const ref = createRef<HTMLButtonElement>();
      render(<ToggleButton ref={ref}>Toggle</ToggleButton>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('forwards className and style', () => {
      render(
        <ToggleButton className="custom" style={{ marginTop: '10px' }} data-testid="tb">
          Toggle
        </ToggleButton>,
      );
      const el = screen.getByTestId('tb');
      expect(el).toHaveClass('custom');
      expect(el).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <ToggleButton data-testid="tb" aria-label="bold">
          Toggle
        </ToggleButton>,
      );
      expect(screen.getByTestId('tb')).toHaveAttribute('aria-label', 'bold');
    });
  });

  // === Defaults ===
  describe('defaults', () => {
    it('defaults to variant=secondary', () => {
      render(<ToggleButton data-testid="tb">Toggle</ToggleButton>);
      expect(screen.getByTestId('tb')).toHaveAttribute('data-variant', 'secondary');
    });

    it('defaults to size=md', () => {
      render(<ToggleButton data-testid="tb">Toggle</ToggleButton>);
      expect(screen.getByTestId('tb')).toHaveAttribute('data-size', 'md');
    });
  });

  // === Variants ===
  describe('variants', () => {
    it.each(['primary', 'secondary', 'ghost', 'danger'] as const)(
      'supports variant=%s',
      (variant) => {
        render(
          <ToggleButton variant={variant} data-testid="tb">
            Toggle
          </ToggleButton>,
        );
        expect(screen.getByTestId('tb')).toHaveAttribute('data-variant', variant);
      },
    );
  });

  // === Sizes ===
  describe('sizes', () => {
    it.each(['sm', 'md', 'lg'] as const)('supports size=%s', (size) => {
      render(
        <ToggleButton size={size} data-testid="tb">
          Toggle
        </ToggleButton>,
      );
      expect(screen.getByTestId('tb')).toHaveAttribute('data-size', size);
    });
  });

  // === Full width ===
  // ToggleButton composes Button's root class, so Button's [data-full-width]
  // rule already applies — the prop only had to be forwarded.
  describe('fullWidth', () => {
    it('sets data-full-width when fullWidth', () => {
      render(
        <ToggleButton fullWidth data-testid="tb">
          Toggle
        </ToggleButton>,
      );
      expect(screen.getByTestId('tb')).toHaveAttribute('data-full-width', '');
    });

    it('omits the attribute by default', () => {
      render(<ToggleButton data-testid="tb">Toggle</ToggleButton>);
      expect(screen.getByTestId('tb')).not.toHaveAttribute('data-full-width');
    });

    it('does not leak fullWidth to the DOM as a prop', () => {
      render(
        <ToggleButton fullWidth data-testid="tb">
          Toggle
        </ToggleButton>,
      );
      expect(screen.getByTestId('tb')).not.toHaveAttribute('fullwidth');
    });
  });

  // === Disabled ===
  describe('disabled', () => {
    it('supports disabled state via disabled prop', () => {
      render(
        <ToggleButton disabled data-testid="tb">
          Toggle
        </ToggleButton>,
      );
      expect(screen.getByTestId('tb')).toBeDisabled();
    });
  });

  // === Pressed state ===
  describe('pressed state', () => {
    it('sets data-state="on" when pressed', () => {
      render(
        <ToggleButton pressed data-testid="tb">
          Toggle
        </ToggleButton>,
      );
      expect(screen.getByTestId('tb')).toHaveAttribute('data-state', 'on');
    });

    it('sets data-state="off" when not pressed', () => {
      render(
        <ToggleButton pressed={false} data-testid="tb">
          Toggle
        </ToggleButton>,
      );
      expect(screen.getByTestId('tb')).toHaveAttribute('data-state', 'off');
    });

    it('toggles pressed state on click (uncontrolled)', () => {
      render(
        <ToggleButton defaultPressed={false} data-testid="tb">
          Toggle
        </ToggleButton>,
      );
      const el = screen.getByTestId('tb');
      expect(el).toHaveAttribute('data-state', 'off');
      fireEvent.click(el);
      expect(el).toHaveAttribute('data-state', 'on');
      fireEvent.click(el);
      expect(el).toHaveAttribute('data-state', 'off');
    });

    it('respects controlled pressed prop', () => {
      const { rerender } = render(
        <ToggleButton pressed={false} data-testid="tb">
          Toggle
        </ToggleButton>,
      );
      expect(screen.getByTestId('tb')).toHaveAttribute('data-state', 'off');

      rerender(
        <ToggleButton pressed={true} data-testid="tb">
          Toggle
        </ToggleButton>,
      );
      expect(screen.getByTestId('tb')).toHaveAttribute('data-state', 'on');
    });

    it('calls onPressedChange when toggled', () => {
      const onPressedChange = vi.fn();
      render(
        <ToggleButton onPressedChange={onPressedChange} data-testid="tb">
          Toggle
        </ToggleButton>,
      );
      fireEvent.click(screen.getByTestId('tb'));
      expect(onPressedChange).toHaveBeenCalledWith(true);
    });
  });

  // === Aria ===
  describe('aria', () => {
    it('aria-pressed reflects pressed state via Radix Toggle', () => {
      const { rerender } = render(
        <ToggleButton pressed={true} data-testid="tb">
          Toggle
        </ToggleButton>,
      );
      expect(screen.getByTestId('tb')).toHaveAttribute('aria-pressed', 'true');

      rerender(
        <ToggleButton pressed={false} data-testid="tb">
          Toggle
        </ToggleButton>,
      );
      expect(screen.getByTestId('tb')).toHaveAttribute('aria-pressed', 'false');
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(
        <ToggleButton sp={{ root: { className: 'sp-root' } }} data-testid="tb">
          Toggle
        </ToggleButton>,
      );
      expect(screen.getByTestId('tb')).toHaveClass('sp-root');
    });
  });
});
