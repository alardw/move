// Generated from PinInput.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PinInput } from './PinInput';

describe('PinInput', () => {
  const renderPin = (props: Record<string, unknown> = {}) =>
    render(<PinInput {...props} />);

  // === Rendering ===
  describe('rendering', () => {
    it('renders root with slot elements', () => {
      const { container } = renderPin();
      const slots = container.querySelectorAll('[class*="slot"]');
      expect(slots.length).toBe(4); // default length
    });

    it('renders hidden input', () => {
      const { container } = renderPin();
      const input = container.querySelector('input');
      expect(input).toBeInTheDocument();
    });

    it('hidden input has opacity:0 via hiddenInput class', () => {
      const { container } = renderPin();
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.className).toContain('hiddenInput');
    });

    it('defaults to 4 slots', () => {
      const { container } = renderPin();
      const slots = container.querySelectorAll('[class*="slot"]');
      expect(slots.length).toBe(4);
    });

    it('renders correct number of slots for custom length', () => {
      const { container } = renderPin({ length: 6 });
      const slots = container.querySelectorAll('[class*="slot"]');
      expect(slots.length).toBe(6);
    });

    it('forwards className and style on root', () => {
      const { container } = renderPin({ className: 'custom', style: { margin: 8 } });
      const root = container.firstChild as HTMLElement;
      expect(root.className).toContain('custom');
      expect(root.style.margin).toBe('8px');
    });
  });

  // === Value ===
  describe('value', () => {
    it('controlled value displays in slots', () => {
      const { container } = renderPin({ value: '1234', onChange: () => {} });
      const slots = container.querySelectorAll('[class*="slot"]');
      expect(slots[0].textContent).toBe('1');
      expect(slots[1].textContent).toBe('2');
      expect(slots[2].textContent).toBe('3');
      expect(slots[3].textContent).toBe('4');
    });

    it('defaultValue displays in slots', () => {
      const { container } = renderPin({ defaultValue: '56' });
      const slots = container.querySelectorAll('[class*="slot"]');
      expect(slots[0].textContent).toBe('5');
      expect(slots[1].textContent).toBe('6');
    });

    it('onChange fires when typing', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const { container } = renderPin({ onChange });
      const input = container.querySelector('input') as HTMLInputElement;
      await user.click(input);
      await user.keyboard('1');
      expect(onChange).toHaveBeenCalledWith('1');
    });

    it('onComplete fires when all slots filled', async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      const { container } = renderPin({ length: 4, onComplete });
      const input = container.querySelector('input') as HTMLInputElement;
      await user.click(input);
      await user.keyboard('1234');
      expect(onComplete).toHaveBeenCalledWith('1234');
    });
  });

  // === Type validation ===
  describe('type validation', () => {
    it('type=number blocks non-digit characters', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const { container } = renderPin({ type: 'number', onChange });
      const input = container.querySelector('input') as HTMLInputElement;
      await user.click(input);
      await user.keyboard('a');
      expect(onChange).not.toHaveBeenCalled();
    });

    it('type=number allows digits', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const { container } = renderPin({ type: 'number', onChange });
      const input = container.querySelector('input') as HTMLInputElement;
      await user.click(input);
      await user.keyboard('5');
      expect(onChange).toHaveBeenCalledWith('5');
    });

    it('type=alphanumeric allows letters and digits', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const { container } = renderPin({ type: 'alphanumeric', onChange });
      const input = container.querySelector('input') as HTMLInputElement;
      await user.click(input);
      await user.keyboard('a');
      expect(onChange).toHaveBeenCalledWith('a');
    });
  });

  // === Mask ===
  describe('mask', () => {
    it('mask=true shows bullet characters', () => {
      const { container } = renderPin({ mask: true, value: '12', onChange: () => {} });
      const slots = container.querySelectorAll('[class*="slot"]');
      expect(slots[0].textContent).toBe('\u2022');
      expect(slots[1].textContent).toBe('\u2022');
    });
  });

  // === Grouping ===
  describe('grouping', () => {
    it('splits slots into groups with separators', () => {
      const { container } = renderPin({ length: 6, grouping: [3, 3] });
      const groups = container.querySelectorAll('[class*="group"]');
      const separators = container.querySelectorAll('[class*="separator"]');
      expect(groups.length).toBe(2);
      expect(separators.length).toBe(1);
    });

    it('separator has aria-hidden', () => {
      const { container } = renderPin({ length: 6, grouping: [3, 3] });
      const separator = container.querySelector('[class*="separator"]');
      expect(separator).toHaveAttribute('aria-hidden', 'true');
    });

    it('falls back to single group when sum != length', () => {
      const { container } = renderPin({ length: 4, grouping: [2, 3] });
      const groups = container.querySelectorAll('[class*="group"]');
      expect(groups.length).toBe(1); // fallback
    });
  });

  // === OneTimeCode ===
  describe('oneTimeCode', () => {
    it('sets autocomplete="one-time-code" by default', () => {
      const { container } = renderPin();
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input).toHaveAttribute('autocomplete', 'one-time-code');
    });

    it('oneTimeCode=false sets autocomplete="off"', () => {
      const { container } = renderPin({ oneTimeCode: false });
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input).toHaveAttribute('autocomplete', 'off');
    });
  });

  // === Sizes ===
  describe('sizes', () => {
    it('defaults to data-size=md', () => {
      const { container } = renderPin();
      expect(container.firstChild).toHaveAttribute('data-size', 'md');
    });

    it('applies data-size=sm', () => {
      const { container } = renderPin({ size: 'sm' });
      expect(container.firstChild).toHaveAttribute('data-size', 'sm');
    });
  });

  // === States ===
  describe('states', () => {
    it('sets data-invalid', () => {
      const { container } = renderPin({ invalid: true });
      expect(container.firstChild).toHaveAttribute('data-invalid');
    });

    it('sets data-disabled', () => {
      const { container } = renderPin({ disabled: true });
      expect(container.firstChild).toHaveAttribute('data-disabled');
    });

    it('disabled input has disabled attribute', () => {
      const { container } = renderPin({ disabled: true });
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input).toBeDisabled();
    });
  });

  // === Hidden input ===
  describe('hidden input', () => {
    it('has maxLength equal to length', () => {
      const { container } = renderPin({ length: 6 });
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input).toHaveAttribute('maxlength', '6');
    });

    it('has aria-label', () => {
      const { container } = renderPin({ ariaLabel: 'Verification code' });
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input).toHaveAttribute('aria-label', 'Verification code');
    });

    it('has inputMode=numeric for type=number', () => {
      const { container } = renderPin({ type: 'number' });
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input).toHaveAttribute('inputmode', 'numeric');
    });

    it('has inputMode=text for type=alphanumeric', () => {
      const { container } = renderPin({ type: 'alphanumeric' });
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input).toHaveAttribute('inputmode', 'text');
    });
  });

  // === Form ===
  describe('form', () => {
    it('name prop set on hidden input', () => {
      const { container } = renderPin({ name: 'otp' });
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input).toHaveAttribute('name', 'otp');
    });
  });

  // === Root click ===
  describe('root click', () => {
    it('clicking root focuses hidden input', async () => {
      const user = userEvent.setup();
      const { container } = renderPin();
      await user.click(container.firstChild as HTMLElement);
      expect(container.querySelector('input')).toHaveFocus();
    });
  });
});
