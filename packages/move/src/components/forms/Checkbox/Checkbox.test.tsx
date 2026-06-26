// Generated from Checkbox.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  const renderCheckbox = (props: Record<string, unknown> = {}) =>
    render(<Checkbox {...props}>Label</Checkbox>);

  // === Rendering ===
  describe('rendering', () => {
    it('renders as a button with role="checkbox"', () => {
      renderCheckbox();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders children as label text beside the checkbox', () => {
      renderCheckbox();
      expect(screen.getByText('Label')).toBeInTheDocument();
    });

    it('wrapper label element wraps the checkbox and children', () => {
      const { container } = renderCheckbox();
      const label = container.querySelector('label');
      expect(label).toBeInTheDocument();
      expect(label!.querySelector('button[role="checkbox"]')).toBeInTheDocument();
      expect(label!.textContent).toContain('Label');
    });

    it('forwards ref to the button element', () => {
      const ref = { current: null } as React.RefObject<HTMLButtonElement | null>;
      render(<Checkbox ref={ref as any}>Label</Checkbox>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('forwards className and style on root', () => {
      renderCheckbox({ className: 'custom', style: { margin: 8 } });
      const el = screen.getByRole('checkbox');
      expect(el.className).toContain('custom');
      expect(el.style.margin).toBe('8px');
    });
  });

  // === Toggle behavior ===
  describe('toggle behavior', () => {
    it('defaults to unchecked state', () => {
      renderCheckbox();
      expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'unchecked');
    });

    it('toggles checked state on click', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderCheckbox({ onCheckedChange: onChange });
      // Click the label wrapper (which triggers the checkbox)
      await user.click(screen.getByRole('checkbox'));
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('data-state is "checked" when checked', () => {
      renderCheckbox({ checked: true, onCheckedChange: () => {} });
      expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'checked');
    });

    it('data-state is "unchecked" when not checked', () => {
      renderCheckbox();
      expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'unchecked');
    });

    it('data-state is "indeterminate" when indeterminate=true', () => {
      renderCheckbox({ indeterminate: true });
      expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'indeterminate');
    });
  });

  // === Sizes ===
  describe('sizes', () => {
    it('applies size via data-size for sm', () => {
      renderCheckbox({ size: 'sm' });
      expect(screen.getByRole('checkbox')).toHaveAttribute('data-size', 'sm');
    });

    it('applies size via data-size for lg', () => {
      renderCheckbox({ size: 'lg' });
      expect(screen.getByRole('checkbox')).toHaveAttribute('data-size', 'lg');
    });

    it('omits data-size for default md', () => {
      renderCheckbox({ size: 'md' });
      expect(screen.getByRole('checkbox')).not.toHaveAttribute('data-size');
    });
  });

  // === States ===
  describe('states', () => {
    it('sets data-invalid when invalid=true', () => {
      renderCheckbox({ invalid: true });
      expect(screen.getByRole('checkbox')).toHaveAttribute('data-invalid');
    });

    it('disabled checkbox cannot be toggled', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderCheckbox({ disabled: true, onCheckedChange: onChange });
      await user.click(screen.getByRole('checkbox'));
      expect(onChange).not.toHaveBeenCalled();
    });

    it('disabled wrapper has data-disabled', () => {
      const { container } = renderCheckbox({ disabled: true });
      const label = container.querySelector('label');
      expect(label).toHaveAttribute('data-disabled');
    });
  });

  // === Accessibility ===
  describe('accessibility', () => {
    it('aria-checked reflects boolean checked state', () => {
      renderCheckbox({ checked: true, onCheckedChange: () => {} });
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
    });

    it('aria-checked is false when unchecked', () => {
      renderCheckbox();
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
    });

    it('aria-checked is "mixed" when indeterminate', () => {
      renderCheckbox({ indeterminate: true });
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
    });
  });

  // === Keyboard ===
  describe('keyboard', () => {
    it('Space key toggles checked state', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderCheckbox({ onCheckedChange: onChange });
      screen.getByRole('checkbox').focus();
      await user.keyboard(' ');
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('Enter key toggles checked state', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderCheckbox({ onCheckedChange: onChange });
      screen.getByRole('checkbox').focus();
      await user.keyboard('{Enter}');
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  // === Form ===
  describe('form', () => {
    it('renders hidden input when name prop is provided', () => {
      const { container } = render(
        <form>
          <Checkbox name="agree" value="yes">Accept</Checkbox>
        </form>
      );
      const hiddenInput = container.querySelector('input[name="agree"]');
      expect(hiddenInput).toBeInTheDocument();
      expect(hiddenInput).toHaveAttribute('type', 'hidden');
    });

    it('hidden input value is empty when unchecked', () => {
      const { container } = render(
        <form>
          <Checkbox name="agree" value="yes">Accept</Checkbox>
        </form>
      );
      const hiddenInput = container.querySelector('input[name="agree"]') as HTMLInputElement;
      expect(hiddenInput.value).toBe('');
    });

    it('hidden input value reflects checked state', () => {
      const { container } = render(
        <form>
          <Checkbox name="agree" value="yes" checked onCheckedChange={() => {}}>Accept</Checkbox>
        </form>
      );
      const hiddenInput = container.querySelector('input[name="agree"]') as HTMLInputElement;
      expect(hiddenInput.value).toBe('yes');
    });
  });

  // === Icon ===
  describe('icon', () => {
    it('falls back to built-in SVG checkmark', () => {
      const { container } = renderCheckbox();
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  // === Group ===
  describe('Group', () => {
    it('renders with role="group"', () => {
      render(
        <Checkbox.Group>
          <Checkbox>A</Checkbox>
          <Checkbox>B</Checkbox>
        </Checkbox.Group>
      );
      expect(screen.getByRole('group')).toBeInTheDocument();
    });
  });
});
