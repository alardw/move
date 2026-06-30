// Generated from Accordion.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Accordion } from './Accordion';

const renderAccordion = (props: Record<string, any> = {}) => {
  return render(
    <Accordion.Root {...props}>
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger>Item 1</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Content 1</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Header>
          <Accordion.Trigger>Item 2</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Content 2</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Header>
          <Accordion.Trigger>Item 3</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>Content 3</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>,
  );
};

describe('Accordion', () => {
  // === Root ===
  describe('Root', () => {
    it('renders with data-move-accordion-root', () => {
      const { container } = renderAccordion();
      expect(container.querySelector('[data-move-accordion-root]')).toBeInTheDocument();
    });

    it('defaults to data-variant=default', () => {
      const { container } = renderAccordion();
      expect(container.firstElementChild).toHaveAttribute('data-variant', 'default');
    });

    it('defaults to data-size=md', () => {
      const { container } = renderAccordion();
      expect(container.firstElementChild).toHaveAttribute('data-size', 'md');
    });

    it('applies custom variant', () => {
      const { container } = renderAccordion({ variant: 'contained' });
      expect(container.firstElementChild).toHaveAttribute('data-variant', 'contained');
    });

    it('applies custom size', () => {
      const { container } = renderAccordion({ size: 'lg' });
      expect(container.firstElementChild).toHaveAttribute('data-size', 'lg');
    });

    it('forwards className', () => {
      const { container } = renderAccordion({ className: 'custom' });
      expect(container.firstElementChild?.className).toContain('custom');
    });

    it('forwards style', () => {
      const { container } = renderAccordion({ style: { margin: '10px' } });
      expect(container.firstElementChild).toHaveStyle({ margin: '10px' });
    });
  });

  // === Item ===
  describe('Item', () => {
    it('renders with data-state=closed by default', () => {
      const { container } = renderAccordion();
      const items = container.querySelectorAll('[data-state]');
      // Items should be closed initially (triggers + items)
      const itemDivs = Array.from(items).filter(
        (el) => el.tagName === 'DIV' && el.hasAttribute('data-state'),
      );
      expect(itemDivs.length).toBeGreaterThan(0);
      expect(itemDivs[0]).toHaveAttribute('data-state', 'closed');
    });

    it('renders with data-state=open when default value matches', () => {
      const { container } = renderAccordion({ defaultValue: 'item-1' });
      const firstItem = container.querySelector('[data-state="open"]');
      expect(firstItem).toBeInTheDocument();
    });
  });

  // === Trigger ===
  describe('Trigger', () => {
    it('renders as button with type=button', () => {
      renderAccordion();
      const triggers = screen.getAllByRole('button');
      expect(triggers[0]).toHaveAttribute('type', 'button');
    });

    it('has aria-expanded=false when closed', () => {
      renderAccordion();
      const triggers = screen.getAllByRole('button');
      expect(triggers[0]).toHaveAttribute('aria-expanded', 'false');
    });

    it('has aria-expanded=true when open', () => {
      renderAccordion({ defaultValue: 'item-1' });
      const trigger = screen.getByRole('button', { name: 'Item 1' });
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('has data-value attribute', () => {
      renderAccordion();
      const trigger = screen.getByRole('button', { name: 'Item 1' });
      expect(trigger).toHaveAttribute('data-value', 'item-1');
    });

    it('has data-move-accordion-trigger attribute', () => {
      renderAccordion();
      const trigger = screen.getByRole('button', { name: 'Item 1' });
      expect(trigger).toHaveAttribute('data-move-accordion-trigger');
    });

    it('toggles item on click', async () => {
      const user = userEvent.setup();
      renderAccordion({ animations: false });
      const trigger = screen.getByRole('button', { name: 'Item 1' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await user.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('fires onValueChange on click', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderAccordion({ onValueChange: onChange, animations: false });
      await user.click(screen.getByRole('button', { name: 'Item 1' }));
      expect(onChange).toHaveBeenCalledWith('item-1');
    });
  });

  // === Single mode ===
  describe('single mode', () => {
    it('only one item open at a time', async () => {
      const user = userEvent.setup();
      renderAccordion({ animations: false });
      const trigger1 = screen.getByRole('button', { name: 'Item 1' });
      const trigger2 = screen.getByRole('button', { name: 'Item 2' });

      await user.click(trigger1);
      expect(trigger1).toHaveAttribute('aria-expanded', 'true');

      await user.click(trigger2);
      expect(trigger2).toHaveAttribute('aria-expanded', 'true');
      expect(trigger1).toHaveAttribute('aria-expanded', 'false');
    });

    it('collapses open item when collapsible=true', async () => {
      const user = userEvent.setup();
      renderAccordion({ animations: false, collapsible: true });
      const trigger1 = screen.getByRole('button', { name: 'Item 1' });

      await user.click(trigger1);
      expect(trigger1).toHaveAttribute('aria-expanded', 'true');

      await user.click(trigger1);
      expect(trigger1).toHaveAttribute('aria-expanded', 'false');
    });

    it('does not collapse last item when collapsible=false', async () => {
      const user = userEvent.setup();
      renderAccordion({ animations: false, collapsible: false, defaultValue: 'item-1' });
      const trigger1 = screen.getByRole('button', { name: 'Item 1' });

      expect(trigger1).toHaveAttribute('aria-expanded', 'true');
      await user.click(trigger1);
      expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    });
  });

  // === Multiple mode ===
  describe('multiple mode', () => {
    it('allows multiple items open simultaneously', async () => {
      const user = userEvent.setup();
      renderAccordion({ type: 'multiple', animations: false });
      const trigger1 = screen.getByRole('button', { name: 'Item 1' });
      const trigger2 = screen.getByRole('button', { name: 'Item 2' });

      await user.click(trigger1);
      await user.click(trigger2);

      expect(trigger1).toHaveAttribute('aria-expanded', 'true');
      expect(trigger2).toHaveAttribute('aria-expanded', 'true');
    });
  });

  // === Content ===
  describe('Content', () => {
    it('renders with role=region when open', () => {
      renderAccordion({ defaultValue: 'item-1', animations: false });
      const region = screen.getByRole('region');
      expect(region).toBeInTheDocument();
    });

    it('does not render when closed', () => {
      renderAccordion({ animations: false });
      const regions = screen.queryAllByRole('region');
      expect(regions).toHaveLength(0);
    });
  });

  // === Controlled ===
  describe('controlled value', () => {
    it('opens item matching controlled value', () => {
      renderAccordion({ value: 'item-2', onValueChange: () => {}, animations: false });
      const trigger = screen.getByRole('button', { name: 'Item 2' });
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  // === Keyboard ===
  describe('keyboard', () => {
    it('Enter toggles the focused item', async () => {
      const user = userEvent.setup();
      renderAccordion({ animations: false });
      const trigger = screen.getByRole('button', { name: 'Item 1' });
      trigger.focus();
      await user.keyboard('{Enter}');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('Space toggles the focused item', async () => {
      const user = userEvent.setup();
      renderAccordion({ animations: false });
      const trigger = screen.getByRole('button', { name: 'Item 1' });
      trigger.focus();
      await user.keyboard(' ');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
