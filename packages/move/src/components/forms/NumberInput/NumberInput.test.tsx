// Generated from NumberInput.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { NumberInput } from './NumberInput';

describe('NumberInput', () => {
  const renderInput = (props: Record<string, unknown> = {}) =>
    render(<NumberInput placeholder="Enter number" {...props} />);

  // === Rendering ===
  describe('rendering', () => {
    it('renders input with type=text', () => {
      renderInput();
      expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'text');
    });

    it('input has inputMode=decimal', () => {
      renderInput();
      expect(screen.getByRole('spinbutton')).toHaveAttribute('inputmode', 'decimal');
    });

    it('input has role=spinbutton', () => {
      renderInput();
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('renders increment and decrement buttons', () => {
      renderInput();
      expect(screen.getByLabelText('Increment')).toBeInTheDocument();
      expect(screen.getByLabelText('Decrement')).toBeInTheDocument();
    });

    it('forwards className and style on root', () => {
      const { container } = renderInput({ className: 'custom', style: { margin: 8 } });
      const root = container.firstChild as HTMLElement;
      expect(root.className).toContain('custom');
      expect(root.style.margin).toBe('8px');
    });
  });

  // === Value ===
  describe('value', () => {
    it('defaultValue sets initial display', () => {
      renderInput({ defaultValue: 42 });
      expect(screen.getByRole('spinbutton')).toHaveValue('42');
    });

    it('controlled value works', () => {
      renderInput({ value: 100, onValueChange: () => {} });
      expect(screen.getByRole('spinbutton')).toHaveValue('100');
    });

    it('onValueChange fires when value changes', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderInput({ defaultValue: 0, onValueChange: onChange });
      await user.click(screen.getByLabelText('Increment'));
      expect(onChange).toHaveBeenCalledWith(1, '1');
    });
  });

  // === Stepper buttons ===
  describe('stepper buttons', () => {
    it('increment increases value by step', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderInput({ defaultValue: 5, step: 2, onValueChange: onChange });
      await user.click(screen.getByLabelText('Increment'));
      expect(onChange).toHaveBeenCalledWith(7, '7');
    });

    it('decrement decreases value by step', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderInput({ defaultValue: 10, step: 3, onValueChange: onChange });
      await user.click(screen.getByLabelText('Decrement'));
      expect(onChange).toHaveBeenCalledWith(7, '7');
    });

    it('stepper buttons have tabIndex=-1', () => {
      renderInput();
      expect(screen.getByLabelText('Increment')).toHaveAttribute('tabindex', '-1');
      expect(screen.getByLabelText('Decrement')).toHaveAttribute('tabindex', '-1');
    });

    it('hideControls=true hides stepper buttons', () => {
      renderInput({ hideControls: true });
      expect(screen.queryByLabelText('Increment')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Decrement')).not.toBeInTheDocument();
    });
  });

  // === Min/Max ===
  describe('min/max', () => {
    it('increment clamps to max', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderInput({ defaultValue: 9, max: 10, onValueChange: onChange });
      await user.click(screen.getByLabelText('Increment'));
      expect(onChange).toHaveBeenCalledWith(10, '10');
      await user.click(screen.getByLabelText('Increment'));
      // Should stay at 10
      expect(onChange).toHaveBeenLastCalledWith(10, '10');
    });

    it('decrement clamps to min', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderInput({ defaultValue: 1, min: 0, onValueChange: onChange });
      await user.click(screen.getByLabelText('Decrement'));
      expect(onChange).toHaveBeenCalledWith(0, '0');
    });

    it('aria-valuemin and aria-valuemax set', () => {
      renderInput({ min: 0, max: 100 });
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('aria-valuemin', '0');
      expect(input).toHaveAttribute('aria-valuemax', '100');
    });
  });

  // === Keyboard ===
  describe('keyboard', () => {
    it('ArrowUp increments value', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderInput({ defaultValue: 5, onValueChange: onChange });
      screen.getByRole('spinbutton').focus();
      await user.keyboard('{ArrowUp}');
      expect(onChange).toHaveBeenCalledWith(6, '6');
    });

    it('ArrowDown decrements value', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderInput({ defaultValue: 5, onValueChange: onChange });
      screen.getByRole('spinbutton').focus();
      await user.keyboard('{ArrowDown}');
      expect(onChange).toHaveBeenCalledWith(4, '4');
    });
  });

  // === Variants ===
  describe('variants', () => {
    it('applies data-variant', () => {
      const { container } = renderInput({ variant: 'filled' });
      expect(container.firstChild as HTMLElement).toHaveAttribute('data-variant', 'filled');
    });
  });

  // === States ===
  describe('states', () => {
    it('sets data-invalid', () => {
      const { container } = renderInput({ invalid: true });
      expect(container.firstChild as HTMLElement).toHaveAttribute('data-invalid');
    });

    it('sets data-disabled', () => {
      const { container } = renderInput({ disabled: true });
      expect(container.firstChild as HTMLElement).toHaveAttribute('data-disabled');
    });

    it('sets data-readonly', () => {
      const { container } = renderInput({ readOnly: true });
      expect(container.firstChild as HTMLElement).toHaveAttribute('data-readonly');
    });
  });

  // === Form ===
  describe('form', () => {
    it('name prop on input for form submission', () => {
      renderInput({ name: 'qty' });
      expect(screen.getByRole('spinbutton')).toHaveAttribute('name', 'qty');
    });
  });

  // === Root click ===
  describe('root click', () => {
    it('root click focuses input', async () => {
      const user = userEvent.setup();
      const { container } = renderInput();
      await user.click(container.firstChild as HTMLElement);
      expect(screen.getByRole('spinbutton')).toHaveFocus();
    });
  });

  describe('press-and-hold', () => {
    it('keeps incrementing past the first step (no stale-value freeze)', () => {
      vi.useFakeTimers();
      try {
        render(<NumberInput defaultValue={5} />);
        const inc = screen.getByLabelText('Increment');
        fireEvent.pointerDown(inc); // immediate: 5 -> 6
        act(() => vi.advanceTimersByTime(300)); // hold delay → repeat interval starts
        // Separate acts so React re-renders between ticks (as real 50ms-apart
        // intervals do) — the held action must read the freshly-incremented value.
        act(() => vi.advanceTimersByTime(50)); // 6 -> 7
        act(() => vi.advanceTimersByTime(50)); // 7 -> 8
        act(() => vi.advanceTimersByTime(50)); // 8 -> 9
        fireEvent.pointerUp(inc);
        // Held repeat must advance, not re-apply 5+1 forever.
        expect(screen.getByRole('spinbutton')).toHaveValue('9');
      } finally {
        vi.useRealTimers();
      }
    });
  });
});
