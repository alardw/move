// Generated from Select.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Select } from './Select';

const renderSelect = (props: {
  rootProps?: Record<string, unknown>;
  triggerProps?: Record<string, unknown>;
  items?: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
} = {}) => {
  const {
    rootProps = {},
    triggerProps = {},
    items = [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
    ],
    placeholder = 'Select...',
  } = props;
  return render(
    <Select.Root {...rootProps}>
      <Select.Trigger {...triggerProps}>
        <Select.Value placeholder={placeholder} />
        <Select.Icon />
      </Select.Trigger>
      <Select.Content>
          <Select.Viewport>
            {items.map((item) => (
              <Select.Item key={item.value} value={item.value} disabled={item.disabled}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
    </Select.Root>
  );
};

describe('Select', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders trigger button', () => {
      renderSelect();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('shows placeholder when no value', () => {
      renderSelect({ placeholder: 'Pick one' });
      expect(screen.getByText('Pick one')).toBeInTheDocument();
    });

    it('placeholder has data-placeholder attribute', () => {
      renderSelect({ placeholder: 'Pick one' });
      // The placeholder text is wrapped in an inner .valueText span by
      // wrapTextChildren; data-placeholder lives on the outer .value
      // span (the semantic anchor for the placeholder state).
      const valueEl = screen.getByText('Pick one').closest('[data-placeholder]');
      expect(valueEl).not.toBeNull();
    });

    it('icon has aria-hidden', () => {
      const { container } = renderSelect();
      const icon = container.querySelector('[class*="icon"]');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // === Trigger attributes ===
  describe('trigger attributes', () => {
    it('defaults to data-size=md', () => {
      renderSelect();
      expect(screen.getByRole('button')).toHaveAttribute('data-size', 'md');
    });

    it('defaults to data-variant=outlined', () => {
      renderSelect();
      expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'outlined');
    });

    it('applies custom size', () => {
      renderSelect({ triggerProps: { size: 'lg' } });
      expect(screen.getByRole('button')).toHaveAttribute('data-size', 'lg');
    });

    it('applies custom variant', () => {
      renderSelect({ triggerProps: { variant: 'filled' } });
      expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'filled');
    });

    it('sets data-disabled when disabled', () => {
      renderSelect({ triggerProps: { disabled: true } });
      expect(screen.getByRole('button')).toHaveAttribute('data-disabled');
    });

    it('sets data-invalid when invalid', () => {
      renderSelect({ triggerProps: { invalid: true } });
      expect(screen.getByRole('button')).toHaveAttribute('data-invalid');
    });

    it('forwards className on trigger', () => {
      renderSelect({ triggerProps: { className: 'custom-trigger' } });
      expect(screen.getByRole('button').className).toContain('custom-trigger');
    });
  });

  // === Open/close ===
  describe('open/close', () => {
    it('opens on trigger click', async () => {
      const user = userEvent.setup();
      renderSelect();
      await user.click(screen.getByRole('button'));
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('renders items when open', async () => {
      const user = userEvent.setup();
      renderSelect();
      await user.click(screen.getByRole('button'));
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Banana')).toBeInTheDocument();
      expect(screen.getByText('Cherry')).toBeInTheDocument();
    });

    it('trigger has aria-expanded from Radix', async () => {
      const user = userEvent.setup();
      renderSelect();
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  // === Value selection ===
  describe('value selection', () => {
    it('calls onValueChange when item selected', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderSelect({ rootProps: { onValueChange: onChange } });
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Banana'));
      expect(onChange).toHaveBeenCalledWith('banana');
    });

    it('displays selected value label after selection', async () => {
      const user = userEvent.setup();
      renderSelect();
      await user.click(screen.getByRole('button'));
      await user.click(screen.getByText('Apple'));
      // Value span displays the selected label
      const valueSpan = document.querySelector('[class*="value"]');
      expect(valueSpan?.textContent).toBe('Apple');
    });

    it('controlled value displays label without opening', () => {
      renderSelect({ rootProps: { value: 'banana', onValueChange: () => {} } });
      // extractItemLabels walks the React tree to pre-populate labels
      const valueSpan = document.querySelector('[class*="value"]');
      expect(valueSpan?.textContent).toBe('Banana');
    });
  });

  // === Items ===
  describe('items', () => {
    it('items have role=menuitem', async () => {
      const user = userEvent.setup();
      renderSelect();
      await user.click(screen.getByRole('button'));
      const items = screen.getAllByRole('menuitem');
      expect(items.length).toBe(3);
    });

    it('disabled item has data-disabled', async () => {
      const user = userEvent.setup();
      renderSelect({
        items: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
        ],
      });
      await user.click(screen.getByRole('button'));
      const items = screen.getAllByRole('menuitem');
      expect(items[1]).toHaveAttribute('data-disabled');
    });

    it('selected item has data-selected', async () => {
      const user = userEvent.setup();
      renderSelect({ rootProps: { value: 'apple', onValueChange: () => {} } });
      await user.click(screen.getByRole('button'));
      const items = screen.getAllByRole('menuitem');
      const appleItem = items.find(el => el.textContent === 'Apple');
      expect(appleItem).toHaveAttribute('data-selected');
    });
  });

  // === Groups and labels ===
  describe('groups', () => {
    it('renders group and label', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select.Root>
          <Select.Trigger>
            <Select.Value placeholder="Select..." />
            <Select.Icon />
          </Select.Trigger>
            <Select.Content>
              <Select.Viewport>
                <Select.Group>
                  <Select.Label>Fruits</Select.Label>
                  <Select.Item value="apple">Apple</Select.Item>
                </Select.Group>
              </Select.Viewport>
            </Select.Content>
        </Select.Root>
      );
      await user.click(screen.getByRole('button'));
      expect(screen.getByText('Fruits')).toBeInTheDocument();
    });

    it('renders separator', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select.Root>
          <Select.Trigger>
            <Select.Value placeholder="Select..." />
            <Select.Icon />
          </Select.Trigger>
            <Select.Content>
              <Select.Viewport>
                <Select.Item value="a">A</Select.Item>
                <Select.Separator />
                <Select.Item value="b">B</Select.Item>
              </Select.Viewport>
            </Select.Content>
        </Select.Root>
      );
      await user.click(screen.getByRole('button'));
      // Separator is in the portal (document.body), not in container
      expect(document.body.querySelector('[class*="separator"]')).toBeInTheDocument();
    });
  });

  // === onOpenChange ===
  describe('onOpenChange', () => {
    it('calls onOpenChange when opening', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      renderSelect({ rootProps: { onOpenChange } });
      await user.click(screen.getByRole('button'));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  // === Layer context (z-index in overlays) ===
  describe('layer context', () => {
    it('applies elevated z-index when inside a LayerProvider', async () => {
      const { LayerProvider } = await import('../../../infrastructure/Layer');
      const user = userEvent.setup();
      render(
        <LayerProvider value={400}>
          <Select.Root>
            <Select.Trigger>
              <Select.Value placeholder="Pick" />
              <Select.Icon />
            </Select.Trigger>
              <Select.Content>
                <Select.Viewport>
                  <Select.Item value="a">A</Select.Item>
                </Select.Viewport>
              </Select.Content>
          </Select.Root>
        </LayerProvider>
      );
      await user.click(screen.getByRole('button'));
      const content = document.body.querySelector('[class*="content"]') as HTMLElement;
      expect(content).toBeInTheDocument();
      expect(content.style.zIndex).toBe('401');
    });

    it('does not override z-index without LayerProvider', async () => {
      const user = userEvent.setup();
      renderSelect();
      await user.click(screen.getByRole('button'));
      const content = document.body.querySelector('[class*="content"]') as HTMLElement;
      expect(content).toBeInTheDocument();
      expect(content.style.zIndex).toBe('');
    });
  });
});
