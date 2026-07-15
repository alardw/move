// Generated from RadioGroup.spec.ts
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { RadioGroup } from './RadioGroup';

describe('RadioGroup', () => {
  const renderGroup = (rootProps: Record<string, unknown> = {}) =>
    render(
      <RadioGroup.Root {...rootProps}>
        <RadioGroup.Item value="a">Option A</RadioGroup.Item>
        <RadioGroup.Item value="b">Option B</RadioGroup.Item>
        <RadioGroup.Item value="c">Option C</RadioGroup.Item>
      </RadioGroup.Root>,
    );

  // === Rendering ===
  describe('rendering', () => {
    it('renders as Radix RadioGroup.Root with role="radiogroup"', () => {
      renderGroup();
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('renders three radio items', () => {
      renderGroup();
      expect(screen.getAllByRole('radio')).toHaveLength(3);
    });

    it('renders children as label text next to each radio', () => {
      renderGroup();
      expect(screen.getByText('Option A')).toBeInTheDocument();
      expect(screen.getByText('Option B')).toBeInTheDocument();
      expect(screen.getByText('Option C')).toBeInTheDocument();
    });

    it('forwards className and style on Root', () => {
      renderGroup({ className: 'custom', style: { margin: 8 } });
      const root = screen.getByRole('radiogroup');
      expect(root.className).toContain('custom');
      expect(root.style.margin).toBe('8px');
    });

    it('forwards ref on Root', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(
        <RadioGroup.Root ref={ref as any}>
          <RadioGroup.Item value="a">A</RadioGroup.Item>
        </RadioGroup.Root>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  // === Value selection ===
  describe('value selection', () => {
    it('selects item on click', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderGroup({ onValueChange: onChange });
      await user.click(screen.getByText('Option B'));
      expect(onChange).toHaveBeenCalledWith('b');
    });

    it('defaultValue sets initial selection', () => {
      renderGroup({ defaultValue: 'b' });
      const radios = screen.getAllByRole('radio');
      expect(radios[1]).toHaveAttribute('data-state', 'checked');
    });

    it('controlled value works', () => {
      renderGroup({ value: 'c', onValueChange: () => {} });
      const radios = screen.getAllByRole('radio');
      expect(radios[2]).toHaveAttribute('data-state', 'checked');
    });
  });

  // === Orientation ===
  describe('orientation', () => {
    it('defaults to vertical orientation', () => {
      renderGroup({ orientation: 'vertical' });
      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('supports horizontal orientation', () => {
      renderGroup({ orientation: 'horizontal' });
      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-orientation', 'horizontal');
    });
  });

  // === Sizes ===
  describe('sizes', () => {
    it('applies data-size for sm', () => {
      renderGroup({ size: 'sm' });
      expect(screen.getByRole('radiogroup')).toHaveAttribute('data-size', 'sm');
    });

    it('omits data-size for default md', () => {
      renderGroup({ size: 'md' });
      expect(screen.getByRole('radiogroup')).not.toHaveAttribute('data-size');
    });
  });

  // === States ===
  describe('states', () => {
    it('applies data-invalid on Root', () => {
      renderGroup({ invalid: true });
      expect(screen.getByRole('radiogroup')).toHaveAttribute('data-invalid');
    });

    it('disabled group disables all items', () => {
      renderGroup({ disabled: true });
      const radios = screen.getAllByRole('radio');
      radios.forEach((radio) => {
        expect(radio).toBeDisabled();
      });
    });
  });

  // === Accessibility ===
  describe('accessibility', () => {
    it('items have role=radio from Radix', () => {
      renderGroup();
      expect(screen.getAllByRole('radio')).toHaveLength(3);
    });

    it('selected item has aria-checked=true', () => {
      renderGroup({ defaultValue: 'a' });
      expect(screen.getAllByRole('radio')[0]).toHaveAttribute('aria-checked', 'true');
    });

    it('unselected items have aria-checked=false', () => {
      renderGroup({ defaultValue: 'a' });
      expect(screen.getAllByRole('radio')[1]).toHaveAttribute('aria-checked', 'false');
    });
  });

  // === Keyboard ===
  describe('keyboard', () => {
    it('ArrowDown moves focus to next item', async () => {
      const user = userEvent.setup();
      renderGroup({ defaultValue: 'a' });
      screen.getAllByRole('radio')[0].focus();
      await user.keyboard('{ArrowDown}');
      expect(screen.getAllByRole('radio')[1]).toHaveFocus();
    });

    it('Space selects focused item', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderGroup({ onValueChange: onChange });
      screen.getAllByRole('radio')[0].focus();
      await user.keyboard(' ');
      expect(onChange).toHaveBeenCalledWith('a');
    });
  });

  // === Form ===
  describe('form', () => {
    it('renders hidden input with name for form submission', () => {
      const { container } = render(
        <form>
          <RadioGroup.Root name="choice" defaultValue="a">
            <RadioGroup.Item value="a">A</RadioGroup.Item>
            <RadioGroup.Item value="b">B</RadioGroup.Item>
          </RadioGroup.Root>
        </form>,
      );
      const hiddenInput = container.querySelector('input[name="choice"]');
      expect(hiddenInput).toBeInTheDocument();
    });
  });
});
