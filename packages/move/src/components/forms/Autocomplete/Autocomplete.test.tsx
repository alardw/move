// Generated from Autocomplete.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Autocomplete } from './Autocomplete';

const defaultItems: { value: string; label: string; disabled?: boolean }[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

const renderAutocomplete = (props: {
  rootProps?: Record<string, unknown>;
  triggerProps?: Record<string, unknown>;
  items?: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
  showClear?: boolean;
  showEmpty?: boolean;
} = {}) => {
  const {
    rootProps = {},
    triggerProps = {},
    items = defaultItems,
    placeholder = 'Search...',
    showClear = false,
    showEmpty = false,
  } = props;
  return render(
    <Autocomplete.Root {...rootProps}>
      <Autocomplete.Trigger {...triggerProps}>
        <Autocomplete.TagList />
        <Autocomplete.Input placeholder={placeholder} />
        {showClear && <Autocomplete.ClearTrigger />}
        <Autocomplete.Icon />
      </Autocomplete.Trigger>
      <Autocomplete.Content>
          {items.map((item) => (
            <Autocomplete.Item key={item.value} value={item.value} disabled={item.disabled}>
              {item.label}
            </Autocomplete.Item>
          ))}
          {showEmpty && <Autocomplete.Empty>No results</Autocomplete.Empty>}
        </Autocomplete.Content>
    </Autocomplete.Root>
  );
};

describe('Autocomplete', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders trigger and input', () => {
      renderAutocomplete();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('shows placeholder on input', () => {
      renderAutocomplete({ placeholder: 'Type here' });
      expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
    });

    it('icon has aria-hidden', () => {
      const { container } = renderAutocomplete();
      const icon = container.querySelector('[class*="icon"]');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // === Trigger attributes ===
  describe('trigger attributes', () => {
    it('defaults to data-size=md', () => {
      const { container } = renderAutocomplete();
      const trigger = container.querySelector('[class*="trigger"]');
      expect(trigger).toHaveAttribute('data-size', 'md');
    });

    it('defaults to data-variant=outlined', () => {
      const { container } = renderAutocomplete();
      const trigger = container.querySelector('[class*="trigger"]');
      expect(trigger).toHaveAttribute('data-variant', 'outlined');
    });

    it('applies custom size', () => {
      const { container } = renderAutocomplete({ triggerProps: { size: 'lg' } });
      const trigger = container.querySelector('[class*="trigger"]');
      expect(trigger).toHaveAttribute('data-size', 'lg');
    });

    it('applies custom variant', () => {
      const { container } = renderAutocomplete({ triggerProps: { variant: 'filled' } });
      const trigger = container.querySelector('[class*="trigger"]');
      expect(trigger).toHaveAttribute('data-variant', 'filled');
    });

    it('sets data-disabled when disabled', () => {
      const { container } = renderAutocomplete({ triggerProps: { disabled: true } });
      const trigger = container.querySelector('[class*="trigger"]');
      expect(trigger).toHaveAttribute('data-disabled');
    });

    it('sets data-invalid when invalid', () => {
      const { container } = renderAutocomplete({ triggerProps: { invalid: true } });
      const trigger = container.querySelector('[class*="trigger"]');
      expect(trigger).toHaveAttribute('data-invalid');
    });

    it('forwards className on trigger', () => {
      const { container } = renderAutocomplete({ triggerProps: { className: 'custom-trigger' } });
      const trigger = container.querySelector('[class*="trigger"]');
      expect(trigger?.className).toContain('custom-trigger');
    });
  });

  // === ARIA combobox ===
  describe('aria combobox', () => {
    it('input has role="combobox"', () => {
      renderAutocomplete();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('input has aria-autocomplete="list"', () => {
      renderAutocomplete();
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'list');
    });

    it('input has aria-haspopup="listbox"', () => {
      renderAutocomplete();
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('input has aria-expanded=false initially', () => {
      renderAutocomplete();
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    });

    it('input has aria-expanded=true when open', async () => {
      const user = userEvent.setup();
      renderAutocomplete();
      const input = screen.getByRole('combobox');
      await user.click(input);
      expect(input).toHaveAttribute('aria-expanded', 'true');
    });
  });

  // === Open/close ===
  describe('open/close', () => {
    it('opens on input focus (openOnFocus default)', async () => {
      const user = userEvent.setup();
      renderAutocomplete();
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('renders items when open', async () => {
      const user = userEvent.setup();
      renderAutocomplete();
      await user.click(screen.getByRole('combobox'));
      expect(screen.getAllByRole('option')).toHaveLength(3);
    });

    it('calls onOpenChange when opening', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      renderAutocomplete({ rootProps: { onOpenChange } });
      await user.click(screen.getByRole('combobox'));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  // === Value selection (single mode) ===
  describe('value selection (single)', () => {
    it('calls onValueChange when item selected', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderAutocomplete({ rootProps: { onValueChange: onChange } });
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Banana'));
      expect(onChange).toHaveBeenCalledWith('banana');
    });

    it('sets input text to selected label after selection', async () => {
      const user = userEvent.setup();
      renderAutocomplete();
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.click(screen.getByText('Apple'));
      expect(input).toHaveValue('Apple');
    });

    it('closes popup after selection in single mode', async () => {
      const user = userEvent.setup();
      renderAutocomplete();
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Apple'));
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  // === Value selection (multi mode) ===
  describe('value selection (multi)', () => {
    it('toggles selection in multi mode', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderAutocomplete({ rootProps: { multiple: true, onValueChange: onChange } });
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Apple'));
      expect(onChange).toHaveBeenCalledWith(['apple']);
    });

    it('clears input text after multi selection', async () => {
      const user = userEvent.setup();
      renderAutocomplete({ rootProps: { multiple: true } });
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.click(screen.getByText('Apple'));
      expect(input).toHaveValue('');
    });

    it('keeps popup open after multi selection', async () => {
      const user = userEvent.setup();
      renderAutocomplete({ rootProps: { multiple: true } });
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Apple'));
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  // === Items ===
  describe('items', () => {
    it('items have role=option', async () => {
      const user = userEvent.setup();
      renderAutocomplete();
      await user.click(screen.getByRole('combobox'));
      expect(screen.getAllByRole('option')).toHaveLength(3);
    });

    it('disabled item has data-disabled', async () => {
      const user = userEvent.setup();
      renderAutocomplete({
        items: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
        ],
      });
      await user.click(screen.getByRole('combobox'));
      const items = screen.getAllByRole('option');
      expect(items[1]).toHaveAttribute('data-disabled');
    });

    it('disabled item has aria-disabled', async () => {
      const user = userEvent.setup();
      renderAutocomplete({
        items: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
        ],
      });
      await user.click(screen.getByRole('combobox'));
      const items = screen.getAllByRole('option');
      expect(items[1]).toHaveAttribute('aria-disabled', 'true');
    });

    it('selected item has aria-selected=true', async () => {
      const user = userEvent.setup();
      renderAutocomplete({ rootProps: { value: 'apple', onValueChange: () => {} } });
      await user.click(screen.getByRole('combobox'));
      const items = screen.getAllByRole('option');
      const apple = items.find(el => el.textContent?.includes('Apple'));
      expect(apple).toHaveAttribute('aria-selected', 'true');
    });

    it('selected item has data-selected', async () => {
      const user = userEvent.setup();
      renderAutocomplete({ rootProps: { value: 'apple', onValueChange: () => {} } });
      await user.click(screen.getByRole('combobox'));
      const items = screen.getAllByRole('option');
      const apple = items.find(el => el.textContent?.includes('Apple'));
      expect(apple).toHaveAttribute('data-selected');
    });
  });

  // === Filtering ===
  describe('filtering', () => {
    it('filters items based on input text', async () => {
      // delay: null → no real-timer wait between keystrokes, so typing isn't
      // slowed by a saturated machine under full-suite parallel load (the flake).
      const user = userEvent.setup({ delay: null });
      renderAutocomplete();
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'ban');
      // Filtering re-renders (state + Radix popover) can settle a tick after the
      // keystroke resolves — wait for the list to converge instead of snapshotting.
      await waitFor(() => {
        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(1);
        expect(options[0].textContent).toBe('Banana');
      });
    });

    it('shows all items when input is empty', async () => {
      const user = userEvent.setup();
      renderAutocomplete();
      await user.click(screen.getByRole('combobox'));
      expect(screen.getAllByRole('option')).toHaveLength(3);
    });
  });

  // === Listbox attributes ===
  describe('listbox', () => {
    it('contentInner has role="listbox"', async () => {
      const user = userEvent.setup();
      renderAutocomplete();
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('listbox has aria-multiselectable in multi mode', async () => {
      const user = userEvent.setup();
      renderAutocomplete({ rootProps: { multiple: true } });
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('listbox does not have aria-multiselectable in single mode', async () => {
      const user = userEvent.setup();
      renderAutocomplete();
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByRole('listbox')).not.toHaveAttribute('aria-multiselectable');
    });
  });

  // === Groups ===
  describe('groups', () => {
    it('renders group with role="group"', async () => {
      const user = userEvent.setup();
      render(
        <Autocomplete.Root>
          <Autocomplete.Trigger>
            <Autocomplete.Input placeholder="Search..." />
            <Autocomplete.Icon />
          </Autocomplete.Trigger>
            <Autocomplete.Content>
              <Autocomplete.Group>
                <Autocomplete.GroupLabel>Fruits</Autocomplete.GroupLabel>
                <Autocomplete.Item value="apple">Apple</Autocomplete.Item>
              </Autocomplete.Group>
            </Autocomplete.Content>
        </Autocomplete.Root>
      );
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByRole('group')).toBeInTheDocument();
      expect(screen.getByText('Fruits')).toBeInTheDocument();
    });

    it('renders separator with role="separator"', async () => {
      const user = userEvent.setup();
      render(
        <Autocomplete.Root>
          <Autocomplete.Trigger>
            <Autocomplete.Input placeholder="Search..." />
            <Autocomplete.Icon />
          </Autocomplete.Trigger>
            <Autocomplete.Content>
              <Autocomplete.Item value="a">A</Autocomplete.Item>
              <Autocomplete.Separator />
              <Autocomplete.Item value="b">B</Autocomplete.Item>
            </Autocomplete.Content>
        </Autocomplete.Root>
      );
      await user.click(screen.getByRole('combobox'));
      expect(document.body.querySelector('[role="separator"]')).toBeInTheDocument();
    });
  });

  // === Loading and Empty ===
  describe('loading and empty', () => {
    it('shows loading when loading=true', async () => {
      const user = userEvent.setup();
      render(
        <Autocomplete.Root loading>
          <Autocomplete.Trigger>
            <Autocomplete.Input placeholder="Search..." />
            <Autocomplete.Icon />
          </Autocomplete.Trigger>
            <Autocomplete.Content>
              <Autocomplete.Loading>Loading...</Autocomplete.Loading>
              <Autocomplete.Empty>No results</Autocomplete.Empty>
            </Autocomplete.Content>
        </Autocomplete.Root>
      );
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('No results')).not.toBeInTheDocument();
    });

    it('loading has role="status" and aria-busy', async () => {
      const user = userEvent.setup();
      render(
        <Autocomplete.Root loading>
          <Autocomplete.Trigger>
            <Autocomplete.Input placeholder="Search..." />
            <Autocomplete.Icon />
          </Autocomplete.Trigger>
            <Autocomplete.Content>
              <Autocomplete.Loading>Loading...</Autocomplete.Loading>
            </Autocomplete.Content>
        </Autocomplete.Root>
      );
      await user.click(screen.getByRole('combobox'));
      const loading = screen.getByText('Loading...');
      expect(loading).toHaveAttribute('role', 'status');
      expect(loading).toHaveAttribute('aria-busy', 'true');
    });
  });

  // === ClearTrigger ===
  describe('clear trigger', () => {
    it('is hidden when no values and no input text', async () => {
      const user = userEvent.setup();
      renderAutocomplete({ showClear: true });
      // ClearTrigger returns null when no values and empty input
      expect(screen.queryByLabelText('Clear all')).not.toBeInTheDocument();
    });

    it('is visible when input has text', async () => {
      const user = userEvent.setup();
      renderAutocomplete({ showClear: true });
      const input = screen.getByRole('combobox');
      await user.type(input, 'test');
      expect(document.body.querySelector('[aria-label="Clear all"]')).toBeInTheDocument();
    });

    it('has aria-label "Clear all"', async () => {
      const user = userEvent.setup();
      renderAutocomplete({ showClear: true });
      const input = screen.getByRole('combobox');
      await user.type(input, 'x');
      const clearBtn = document.body.querySelector('[aria-label="Clear all"]');
      expect(clearBtn).toBeInTheDocument();
    });

    it('uses labels.clearAll override for aria-label', async () => {
      const user = userEvent.setup();
      renderAutocomplete({ showClear: true, rootProps: { labels: { clearAll: 'Reset' } } });
      const input = screen.getByRole('combobox');
      await user.type(input, 'x');
      expect(document.body.querySelector('[aria-label="Reset"]')).toBeInTheDocument();
    });
  });

  // === Labels (i18n) ===
  describe('labels', () => {
    it('tag remove button uses default removeTag label with value substitution', async () => {
      const user = userEvent.setup();
      renderAutocomplete({ rootProps: { multiple: true } });
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Apple'));
      expect(document.body.querySelector('[aria-label="Remove apple"]')).toBeInTheDocument();
    });

    it('tag remove button uses labels.removeTag override with value substitution', async () => {
      const user = userEvent.setup();
      renderAutocomplete({ rootProps: { multiple: true, labels: { removeTag: 'Delete {value}' } } });
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('Apple'));
      expect(document.body.querySelector('[aria-label="Delete apple"]')).toBeInTheDocument();
    });
  });
});
