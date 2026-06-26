// Generated from Collapsible.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Collapsible } from './Collapsible';

const renderCollapsible = (props: Record<string, any> = {}) => {
  return render(
    <Collapsible.Root {...props}>
      <Collapsible.Trigger>Toggle</Collapsible.Trigger>
      <Collapsible.Icon />
      <Collapsible.Content>Content here</Collapsible.Content>
    </Collapsible.Root>
  );
};

describe('Collapsible', () => {
  // === Root ===
  describe('Root', () => {
    it('renders with data-state=closed by default', () => {
      const { container } = renderCollapsible();
      expect(container.firstElementChild).toHaveAttribute('data-state', 'closed');
    });

    it('renders with data-state=open when defaultOpen=true', () => {
      const { container } = renderCollapsible({ defaultOpen: true });
      expect(container.firstElementChild).toHaveAttribute('data-state', 'open');
    });

    it('sets data-disabled when disabled=true', () => {
      const { container } = renderCollapsible({ disabled: true });
      expect(container.firstElementChild).toHaveAttribute('data-disabled');
    });

    it('forwards className', () => {
      const { container } = renderCollapsible({ className: 'custom' });
      expect(container.firstElementChild?.className).toContain('custom');
    });

    it('forwards style', () => {
      const { container } = renderCollapsible({ style: { margin: '10px' } });
      expect(container.firstElementChild).toHaveStyle({ margin: '10px' });
    });
  });

  // === Trigger ===
  describe('Trigger', () => {
    it('renders as button with type=button', () => {
      renderCollapsible();
      const trigger = screen.getByRole('button', { name: 'Toggle' });
      expect(trigger).toHaveAttribute('type', 'button');
    });

    it('has aria-expanded=false when closed', () => {
      renderCollapsible();
      const trigger = screen.getByRole('button', { name: 'Toggle' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('has aria-expanded=true when open', () => {
      renderCollapsible({ defaultOpen: true });
      const trigger = screen.getByRole('button', { name: 'Toggle' });
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('has data-state attribute', () => {
      renderCollapsible();
      const trigger = screen.getByRole('button', { name: 'Toggle' });
      expect(trigger).toHaveAttribute('data-state', 'closed');
    });

    it('toggles on click', async () => {
      const user = userEvent.setup();
      renderCollapsible({ animations: false });
      const trigger = screen.getByRole('button', { name: 'Toggle' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('fires onOpenChange on click', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderCollapsible({ onOpenChange: onChange, animations: false });
      await user.click(screen.getByRole('button', { name: 'Toggle' }));
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('does not toggle when disabled', async () => {
      const user = userEvent.setup();
      renderCollapsible({ disabled: true, animations: false });
      const trigger = screen.getByRole('button', { name: 'Toggle' });
      expect(trigger).toBeDisabled();
    });

    it('sets data-disabled when disabled', () => {
      renderCollapsible({ disabled: true });
      const trigger = screen.getByRole('button', { name: 'Toggle' });
      expect(trigger).toHaveAttribute('data-disabled');
    });
  });

  // === Icon ===
  describe('Icon', () => {
    it('has aria-hidden=true', () => {
      const { container } = renderCollapsible();
      const icon = container.querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });

    it('renders custom children', () => {
      const { container } = render(
        <Collapsible.Root>
          <Collapsible.Trigger>Toggle</Collapsible.Trigger>
          <Collapsible.Icon><span data-testid="custom-icon">X</span></Collapsible.Icon>
          <Collapsible.Content>Content</Collapsible.Content>
        </Collapsible.Root>
      );
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  // === Content ===
  describe('Content', () => {
    it('renders with role=region when open', () => {
      renderCollapsible({ defaultOpen: true, animations: false });
      const region = screen.getByRole('region');
      expect(region).toBeInTheDocument();
    });

    it('does not render when closed', () => {
      renderCollapsible({ animations: false });
      const regions = screen.queryAllByRole('region');
      expect(regions).toHaveLength(0);
    });

    it('renders content text when open', () => {
      renderCollapsible({ defaultOpen: true, animations: false });
      expect(screen.getByText('Content here')).toBeInTheDocument();
    });
  });

  // === Controlled ===
  describe('controlled', () => {
    it('opens when controlled open=true', () => {
      renderCollapsible({ open: true, onOpenChange: () => {}, animations: false });
      const trigger = screen.getByRole('button', { name: 'Toggle' });
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  // === Keyboard ===
  describe('keyboard', () => {
    it('Enter toggles the trigger', async () => {
      const user = userEvent.setup();
      renderCollapsible({ animations: false });
      const trigger = screen.getByRole('button', { name: 'Toggle' });
      trigger.focus();
      await user.keyboard('{Enter}');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('Space toggles the trigger', async () => {
      const user = userEvent.setup();
      renderCollapsible({ animations: false });
      const trigger = screen.getByRole('button', { name: 'Toggle' });
      trigger.focus();
      await user.keyboard(' ');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
