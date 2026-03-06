// Generated from Dropdown.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Dropdown } from './Dropdown';

// Helper: render a basic dropdown in open state
function renderDropdown(
  ui?: React.ReactElement,
  { open = true }: { open?: boolean } = {}
) {
  return render(
    ui ?? (
      <Dropdown.Root open={open} animations={false}>
        <Dropdown.Trigger>
          <button data-testid="trigger">Open</button>
        </Dropdown.Trigger>
        <Dropdown.Portal>
          <Dropdown.Content>
            <Dropdown.Item data-testid="item-1">Item 1</Dropdown.Item>
            <Dropdown.Item data-testid="item-2">Item 2</Dropdown.Item>
            <Dropdown.Item data-testid="item-3">Item 3</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Portal>
      </Dropdown.Root>
    )
  );
}

describe('Dropdown', () => {
  // === Root ===
  describe('Root', () => {
    it('renders children', () => {
      renderDropdown();
      expect(screen.getByTestId('trigger')).toBeInTheDocument();
    });

    it('supports controlled open state', async () => {
      renderDropdown(
        <Dropdown.Root open={true} animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item>Item</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });

    it('supports uncontrolled open state with defaultOpen', async () => {
      renderDropdown(
        <Dropdown.Root defaultOpen animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item>Item</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });

    it('calls onOpenChange when opening', async () => {
      const onOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Dropdown.Root onOpenChange={onOpenChange} animations={false}>
          <Dropdown.Trigger data-testid="trigger">
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item>Item</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await user.click(screen.getByTestId('trigger'));
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(true);
      });
    });
  });

  // === Trigger ===
  describe('Trigger', () => {
    it('renders trigger element', () => {
      renderDropdown();
      expect(screen.getByTestId('trigger')).toBeInTheDocument();
    });

    it('forwards className and style', () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger className="custom-trigger" style={{ marginLeft: '12px' }}>
            <span>Open</span>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item>Item</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      // Radix Trigger renders a <button> with the className/style from factory
      // The trigger container is aria-hidden when open, so use hidden: true
      const triggerButton = screen.getByRole('button', { name: 'Open', hidden: true });
      expect(triggerButton).toHaveClass('custom-trigger');
      expect(triggerButton).toHaveStyle({ marginLeft: '12px' });
    });
  });

  // === Content ===
  describe('Content', () => {
    it('renders with role=menu', async () => {
      renderDropdown();
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });

    it('renders in a portal (not inside render container)', async () => {
      const { container } = renderDropdown();
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
      const menuInContainer = container.querySelector('[role="menu"]');
      expect(menuInContainer).toBeNull();
    });

    it('forwards className and style on Content', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content className="custom-content" style={{ padding: '20px' }}>
              <Dropdown.Item>Item</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        const menu = screen.getByRole('menu');
        expect(menu).toHaveClass('custom-content');
        expect(menu).toHaveStyle({ padding: '20px' });
      });
    });

    it('has data-side attribute', async () => {
      renderDropdown();
      await waitFor(() => {
        const menu = screen.getByRole('menu');
        expect(menu).toHaveAttribute('data-side');
      });
    });
  });

  // === Item ===
  describe('Item', () => {
    it('renders with role=menuitem', async () => {
      renderDropdown();
      await waitFor(() => {
        const items = screen.getAllByRole('menuitem');
        expect(items.length).toBe(3);
      });
    });

    it('forwards className and style', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item className="custom-item" style={{ fontWeight: 'bold' }}>
                Styled Item
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        const item = screen.getByRole('menuitem');
        expect(item).toHaveClass('custom-item');
        expect(item).toHaveStyle({ fontWeight: 'bold' });
      });
    });

    it('disabled items have data-disabled attribute', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item disabled>Disabled</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        const item = screen.getByRole('menuitem');
        expect(item).toHaveAttribute('data-disabled');
      });
    });
  });

  // === Group ===
  describe('Group', () => {
    it('renders group with role=group', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Group>
                <Dropdown.Item>Grouped Item</Dropdown.Item>
              </Dropdown.Group>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        expect(screen.getByRole('group')).toBeInTheDocument();
      });
    });

    it('forwards className and style on Group', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Group className="custom-group" style={{ margin: '4px' }}>
                <Dropdown.Item>Item</Dropdown.Item>
              </Dropdown.Group>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        const group = screen.getByRole('group');
        expect(group).toHaveClass('custom-group');
        expect(group).toHaveStyle({ margin: '4px' });
      });
    });
  });

  // === Label ===
  describe('Label', () => {
    it('renders label text', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Label>Actions</Dropdown.Label>
              <Dropdown.Item>Item</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        expect(screen.getByText('Actions')).toBeInTheDocument();
      });
    });

    it('forwards className and style on Label', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Label className="custom-label" style={{ marginTop: '10px' }}>
                Section
              </Dropdown.Label>
              <Dropdown.Item>Item</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        const label = screen.getByText('Section');
        expect(label).toHaveClass('custom-label');
        expect(label).toHaveStyle({ marginTop: '10px' });
      });
    });
  });

  // === CheckboxItem ===
  describe('CheckboxItem', () => {
    it('renders with role=menuitemcheckbox', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.CheckboxItem checked={false} onCheckedChange={() => {}}>
                Toggle
              </Dropdown.CheckboxItem>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        expect(screen.getByRole('menuitemcheckbox')).toBeInTheDocument();
      });
    });

    it('has aria-checked from Radix', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.CheckboxItem checked={true} onCheckedChange={() => {}}>
                Checked
              </Dropdown.CheckboxItem>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        const checkbox = screen.getByRole('menuitemcheckbox');
        expect(checkbox).toHaveAttribute('aria-checked', 'true');
      });
    });

    it('calls onCheckedChange when toggled', async () => {
      const onCheckedChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.CheckboxItem checked={false} onCheckedChange={onCheckedChange}>
                Toggle
              </Dropdown.CheckboxItem>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        expect(screen.getByRole('menuitemcheckbox')).toBeInTheDocument();
      });
      await user.click(screen.getByRole('menuitemcheckbox'));
      expect(onCheckedChange).toHaveBeenCalled();
    });

    it('forwards className and style', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.CheckboxItem
                checked={false}
                onCheckedChange={() => {}}
                className="custom-checkbox"
                style={{ fontStyle: 'italic' }}
              >
                Item
              </Dropdown.CheckboxItem>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        const checkbox = screen.getByRole('menuitemcheckbox');
        expect(checkbox).toHaveClass('custom-checkbox');
        expect(checkbox).toHaveStyle({ fontStyle: 'italic' });
      });
    });
  });

  // === RadioGroup + RadioItem ===
  describe('RadioGroup', () => {
    it('renders RadioGroup and RadioItem with correct roles', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.RadioGroup value="a" onValueChange={() => {}}>
                <Dropdown.RadioItem value="a">Option A</Dropdown.RadioItem>
                <Dropdown.RadioItem value="b">Option B</Dropdown.RadioItem>
              </Dropdown.RadioGroup>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        expect(screen.getByRole('group')).toBeInTheDocument();
        const items = screen.getAllByRole('menuitemradio');
        expect(items.length).toBe(2);
      });
    });

    it('forwards className and style on RadioGroup', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.RadioGroup
                value="a"
                onValueChange={() => {}}
                className="custom-radio-group"
                style={{ padding: '8px' }}
              >
                <Dropdown.RadioItem value="a">A</Dropdown.RadioItem>
              </Dropdown.RadioGroup>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        const group = screen.getByRole('group');
        expect(group).toHaveClass('custom-radio-group');
        expect(group).toHaveStyle({ padding: '8px' });
      });
    });

    it('forwards className and style on RadioItem', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.RadioGroup value="a" onValueChange={() => {}}>
                <Dropdown.RadioItem
                  value="a"
                  className="custom-radio-item"
                  style={{ fontWeight: 'bold' }}
                >
                  A
                </Dropdown.RadioItem>
              </Dropdown.RadioGroup>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        const item = screen.getByRole('menuitemradio');
        expect(item).toHaveClass('custom-radio-item');
        expect(item).toHaveStyle({ fontWeight: 'bold' });
      });
    });
  });

  // === Separator ===
  describe('Separator', () => {
    it('renders separator element', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item>Above</Dropdown.Item>
              <Dropdown.Separator data-testid="sep" />
              <Dropdown.Item>Below</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        expect(screen.getByRole('separator')).toBeInTheDocument();
      });
    });

    it('forwards className and style on Separator', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item>Above</Dropdown.Item>
              <Dropdown.Separator className="custom-sep" style={{ height: '2px' }} />
              <Dropdown.Item>Below</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        const sep = screen.getByRole('separator');
        expect(sep).toHaveClass('custom-sep');
        expect(sep).toHaveStyle({ height: '2px' });
      });
    });
  });

  // === Accessibility ===
  describe('accessibility', () => {
    it('Content has role=menu from Radix', async () => {
      renderDropdown();
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });

    it('Items have role=menuitem from Radix', async () => {
      renderDropdown();
      await waitFor(() => {
        expect(screen.getAllByRole('menuitem').length).toBe(3);
      });
    });

    it('Trigger has aria-expanded from Radix', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <span>Open</span>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item>Item</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      // Radix sets aria-expanded on the trigger button; container is aria-hidden when open
      const trigger = screen.getByRole('button', { name: 'Open', hidden: true });
      expect(trigger).toHaveAttribute('aria-expanded');
    });

    it('Trigger has aria-haspopup from Radix', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <span>Open</span>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item>Item</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      const trigger = screen.getByRole('button', { name: 'Open', hidden: true });
      expect(trigger).toHaveAttribute('aria-haspopup');
    });

    it('CheckboxItem has role=menuitemcheckbox with aria-checked from Radix', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.CheckboxItem checked={true} onCheckedChange={() => {}}>
                Check
              </Dropdown.CheckboxItem>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        const checkbox = screen.getByRole('menuitemcheckbox');
        expect(checkbox).toHaveAttribute('aria-checked', 'true');
      });
    });

    it('RadioItem has role=menuitemradio from Radix', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.RadioGroup value="a" onValueChange={() => {}}>
                <Dropdown.RadioItem value="a">A</Dropdown.RadioItem>
              </Dropdown.RadioGroup>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        expect(screen.getByRole('menuitemradio')).toBeInTheDocument();
      });
    });

    it('Disabled items have data-disabled attribute', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item disabled>Disabled</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        const item = screen.getByRole('menuitem');
        expect(item).toHaveAttribute('data-disabled');
      });
    });
  });

  // === Animation ===
  describe('animation', () => {
    it('animations=false disables animations (dropdown still renders)', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item>Item</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });
  });

  // === Compound API ===
  describe('compound API', () => {
    it('renders full compound structure with groups, labels, and separators', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger asChild>
            <button data-testid="trigger">Actions</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content sideOffset={4}>
              <Dropdown.Label>File</Dropdown.Label>
              <Dropdown.Group>
                <Dropdown.Item>New</Dropdown.Item>
                <Dropdown.Item>Open</Dropdown.Item>
              </Dropdown.Group>
              <Dropdown.Separator />
              <Dropdown.Item disabled>Disabled Action</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      expect(screen.getByTestId('trigger')).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
        expect(screen.getByText('File')).toBeInTheDocument();
        expect(screen.getByText('New')).toBeInTheDocument();
        expect(screen.getByText('Open')).toBeInTheDocument();
        expect(screen.getByRole('separator')).toBeInTheDocument();
        expect(screen.getByText('Disabled Action')).toHaveAttribute('data-disabled');
      });
    });

    it('renders checkbox items within compound structure', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.CheckboxItem checked={true} onCheckedChange={() => {}}>
                Show Toolbar
              </Dropdown.CheckboxItem>
              <Dropdown.CheckboxItem checked={false} onCheckedChange={() => {}}>
                Show Statusbar
              </Dropdown.CheckboxItem>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        const checkboxes = screen.getAllByRole('menuitemcheckbox');
        expect(checkboxes.length).toBe(2);
        expect(checkboxes[0]).toHaveAttribute('aria-checked', 'true');
        expect(checkboxes[1]).toHaveAttribute('aria-checked', 'false');
      });
    });

    it('renders radio items within compound structure', async () => {
      render(
        <Dropdown.Root open animations={false}>
          <Dropdown.Trigger>
            <button>Open</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.RadioGroup value="light" onValueChange={() => {}}>
                <Dropdown.RadioItem value="light">Light</Dropdown.RadioItem>
                <Dropdown.RadioItem value="dark">Dark</Dropdown.RadioItem>
                <Dropdown.RadioItem value="system">System</Dropdown.RadioItem>
              </Dropdown.RadioGroup>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      );
      await waitFor(() => {
        const radios = screen.getAllByRole('menuitemradio');
        expect(radios.length).toBe(3);
      });
    });
  });
});
