// Generated from Tabs.spec.ts
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Tabs } from './Tabs';

const renderTabs = (rootProps: Record<string, any> = {}, listProps: Record<string, any> = {}) => {
  return render(
    <Tabs.Root defaultValue="tab1" {...rootProps}>
      <Tabs.List {...listProps}>
        <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        <Tabs.Trigger value="tab3" disabled>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">Content 1</Tabs.Content>
      <Tabs.Content value="tab2">Content 2</Tabs.Content>
      <Tabs.Content value="tab3">Content 3</Tabs.Content>
    </Tabs.Root>,
  );
};

describe('Tabs', () => {
  // === Root ===
  describe('Root', () => {
    it('renders with role=tablist on List', () => {
      renderTabs();
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('forwards className', () => {
      const { container } = renderTabs({ className: 'custom-root' });
      expect(container.firstElementChild?.className).toContain('custom-root');
    });

    it('forwards style', () => {
      const { container } = renderTabs({ style: { margin: '10px' } });
      expect(container.firstElementChild).toHaveStyle({ margin: '10px' });
    });
  });

  // === List ===
  describe('List', () => {
    it('defaults to data-variant=underline', () => {
      renderTabs();
      expect(screen.getByRole('tablist')).toHaveAttribute('data-variant', 'underline');
    });

    it('defaults to data-size=md', () => {
      renderTabs();
      expect(screen.getByRole('tablist')).toHaveAttribute('data-size', 'md');
    });

    it('applies custom variant', () => {
      renderTabs({}, { variant: 'pills' });
      expect(screen.getByRole('tablist')).toHaveAttribute('data-variant', 'pills');
    });

    it('applies custom size', () => {
      renderTabs({}, { size: 'lg' });
      expect(screen.getByRole('tablist')).toHaveAttribute('data-size', 'lg');
    });
  });

  // === Trigger ===
  describe('Trigger', () => {
    it('renders with role=tab', () => {
      renderTabs();
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(3);
    });

    it('active trigger has aria-selected=true', () => {
      renderTabs();
      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      expect(tab1).toHaveAttribute('aria-selected', 'true');
    });

    it('inactive trigger has aria-selected=false', () => {
      renderTabs();
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      expect(tab2).toHaveAttribute('aria-selected', 'false');
    });

    it('clicking trigger changes active tab', async () => {
      const user = userEvent.setup();
      renderTabs();
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      await user.click(tab2);
      expect(tab2).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Content 2')).toBeVisible();
    });

    it('disabled trigger has data-disabled', () => {
      renderTabs();
      const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
      expect(tab3).toHaveAttribute('data-disabled', '');
    });

    it('forwards className', () => {
      render(
        <Tabs.Root defaultValue="t1">
          <Tabs.List>
            <Tabs.Trigger value="t1" className="custom-trigger">
              T1
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="t1">C1</Tabs.Content>
        </Tabs.Root>,
      );
      expect(screen.getByRole('tab', { name: 'T1' }).className).toContain('custom-trigger');
    });
  });

  // === Content ===
  describe('Content', () => {
    it('renders with role=tabpanel', () => {
      renderTabs();
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('sets tabIndex={-1}', () => {
      renderTabs();
      expect(screen.getByRole('tabpanel')).toHaveAttribute('tabindex', '-1');
    });

    it('active content is visible', () => {
      renderTabs();
      expect(screen.getByText('Content 1')).toBeVisible();
    });

    it('forwards className on content', () => {
      render(
        <Tabs.Root defaultValue="t1">
          <Tabs.List>
            <Tabs.Trigger value="t1">T1</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="t1" className="custom-content">
            C1
          </Tabs.Content>
        </Tabs.Root>,
      );
      expect(screen.getByRole('tabpanel').className).toContain('custom-content');
    });
  });

  // === Controlled ===
  describe('controlled', () => {
    it('controlled value works', () => {
      const onChange = vi.fn();
      render(
        <Tabs.Root value="tab2" onValueChange={onChange}>
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Content 1</Tabs.Content>
          <Tabs.Content value="tab2">Content 2</Tabs.Content>
        </Tabs.Root>,
      );
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
    });

    it('fires onValueChange', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderTabs({ onValueChange: onChange });
      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
      expect(onChange).toHaveBeenCalledWith('tab2');
    });
  });

  // === Keyboard ===
  describe('keyboard', () => {
    it('Arrow keys navigate between triggers', async () => {
      const user = userEvent.setup();
      renderTabs();
      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      tab1.focus();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();
    });
  });
});
