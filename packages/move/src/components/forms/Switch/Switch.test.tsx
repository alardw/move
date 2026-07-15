// Generated from Switch.spec.ts
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  const renderSwitch = (props: Record<string, unknown> = {}) =>
    render(
      <Switch.Root {...props}>
        <Switch.Thumb />
      </Switch.Root>,
    );

  // === Rendering ===
  describe('rendering', () => {
    it('renders as Radix Switch.Root with role="switch"', () => {
      renderSwitch();
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('renders Thumb as Radix Switch.Thumb', () => {
      const { container } = renderSwitch();
      const thumb = container.querySelector('span');
      expect(thumb).toBeInTheDocument();
    });

    it('forwards className and style on Root', () => {
      renderSwitch({ className: 'custom', style: { margin: 8 } });
      const el = screen.getByRole('switch');
      expect(el.className).toContain('custom');
      expect(el.style.margin).toBe('8px');
    });

    it('forwards ref on Root', () => {
      const ref = { current: null } as React.RefObject<HTMLButtonElement | null>;
      render(
        <Switch.Root ref={ref as any}>
          <Switch.Thumb />
        </Switch.Root>,
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  // === Toggle behavior ===
  describe('toggle behavior', () => {
    it('toggles checked state on click', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderSwitch({ onCheckedChange: onChange });
      await user.click(screen.getByRole('switch'));
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('data-state is "unchecked" when not checked', () => {
      renderSwitch();
      expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'unchecked');
    });

    it('data-state is "checked" when checked', () => {
      renderSwitch({ checked: true, onCheckedChange: () => {} });
      expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'checked');
    });
  });

  // === Sizes ===
  describe('sizes', () => {
    it('applies size via data-size attribute', () => {
      renderSwitch({ size: 'sm' });
      expect(screen.getByRole('switch')).toHaveAttribute('data-size', 'sm');
    });
  });

  // === States ===
  describe('states', () => {
    it('sets data-invalid when invalid=true', () => {
      renderSwitch({ invalid: true });
      expect(screen.getByRole('switch')).toHaveAttribute('data-invalid');
    });

    it('disabled switch cannot be toggled', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderSwitch({ disabled: true, onCheckedChange: onChange });
      await user.click(screen.getByRole('switch'));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  // === Label ===
  describe('label', () => {
    it('renders label wrapper when label prop is provided', () => {
      renderSwitch({ label: 'Enable' });
      expect(screen.getByText('Enable')).toBeInTheDocument();
      // Label wrapper is a <label> element
      const labelEl = screen.getByText('Enable').closest('label');
      expect(labelEl).toBeInTheDocument();
    });

    it('label wrapper has data-disabled when switch is disabled', () => {
      renderSwitch({ label: 'Enable', disabled: true });
      const labelEl = screen.getByText('Enable').closest('label');
      expect(labelEl).toHaveAttribute('data-disabled');
    });

    it('no label wrapper when label prop is not provided', () => {
      const { container } = renderSwitch();
      expect(container.querySelector('label')).not.toBeInTheDocument();
    });
  });

  // === Accessibility ===
  describe('accessibility', () => {
    it('aria-checked reflects checked state via Radix', () => {
      renderSwitch({ checked: true, onCheckedChange: () => {} });
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    });
  });

  // === Keyboard ===
  describe('keyboard', () => {
    it('Space key toggles checked state', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderSwitch({ onCheckedChange: onChange });
      screen.getByRole('switch').focus();
      await user.keyboard(' ');
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  // === Form ===
  describe('form', () => {
    it('form submission via Radix hidden input when name prop is provided', () => {
      const { container } = render(
        <form>
          <Switch.Root name="notifications" value="on">
            <Switch.Thumb />
          </Switch.Root>
        </form>,
      );
      const hiddenInput = container.querySelector('input[name="notifications"]');
      expect(hiddenInput).toBeInTheDocument();
    });
  });
});
