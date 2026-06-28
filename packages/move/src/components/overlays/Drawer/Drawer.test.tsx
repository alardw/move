// Generated from Drawer.spec.ts (schemaVersion: 7)
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Drawer } from './Drawer';

// animations={false} → open/close is instant (no exit-animation hang in jsdom).
function renderDrawer(rootProps: Record<string, unknown> = {}, contentProps: Record<string, unknown> = {}) {
  return render(
    <Drawer.Root animations={false} {...rootProps}>
      <Drawer.Trigger asChild>
        <button>Open</button>
      </Drawer.Trigger>
      <Drawer.Content {...contentProps}>
        <Drawer.Header>
          <Drawer.Title>Settings</Drawer.Title>
          <Drawer.Description>Tweak your preferences.</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>Body content</Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close>Done</Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>,
  );
}

describe('Drawer', () => {
  describe('rendering', () => {
    it('renders the trigger and is closed by default', () => {
      renderDrawer();
      expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
      expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('opens on trigger click (uncontrolled)', async () => {
      const user = userEvent.setup({ delay: null });
      renderDrawer();
      await user.click(screen.getByRole('button', { name: 'Open' }));
      expect(await screen.findByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('renders open with defaultOpen', () => {
      renderDrawer({ defaultOpen: true });
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('controlled state', () => {
    it('renders open when controlled open is true', () => {
      renderDrawer({ open: true });
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('opening fires onOpenChange(true)', async () => {
      const user = userEvent.setup({ delay: null });
      const onOpenChange = vi.fn();
      renderDrawer({ onOpenChange });
      await user.click(screen.getByRole('button', { name: 'Open' }));
      await screen.findByRole('dialog');
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('position', () => {
    it('defaults to data-position="right"', () => {
      renderDrawer({ defaultOpen: true, responsive: false });
      expect(screen.getByRole('dialog')).toHaveAttribute('data-position', 'right');
    });

    it('honours each position', () => {
      for (const position of ['left', 'right', 'top', 'bottom'] as const) {
        const { unmount } = renderDrawer({ defaultOpen: true, responsive: false, position });
        expect(screen.getByRole('dialog')).toHaveAttribute('data-position', position);
        unmount();
      }
    });
  });

  describe('accessibility', () => {
    it('is a labelled, described dialog', () => {
      renderDrawer({ defaultOpen: true });
      const dialog = screen.getByRole('dialog');
      const title = screen.getByText('Settings');
      const desc = screen.getByText('Tweak your preferences.');
      expect(dialog).toHaveAttribute('aria-labelledby', title.id);
      expect(dialog).toHaveAttribute('aria-describedby', desc.id);
    });
  });

  describe('dismiss', () => {
    it('closes via the Close button (unmounts after exit)', async () => {
      const user = userEvent.setup({ delay: null });
      renderDrawer({ defaultOpen: true });
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: 'Done' }));
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });

    it('closes on Escape', async () => {
      const user = userEvent.setup({ delay: null });
      renderDrawer({ defaultOpen: true });
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });
  });

  describe('passthrough', () => {
    it('forwards className and style to Content', () => {
      renderDrawer({ defaultOpen: true }, { className: 'custom', style: { zIndex: 99 } });
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('custom');
      expect(dialog).toHaveStyle({ zIndex: 99 });
    });

    it('accepts animations={false} without error', () => {
      expect(() => renderDrawer({ defaultOpen: true })).not.toThrow();
    });
  });
});
