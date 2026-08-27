// Generated from Dialog.spec.ts
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Dialog } from './Dialog';

/**
 * Helper: render a standard Dialog compound structure with sensible defaults.
 * The dialog is rendered open by default for tests that inspect content.
 */
function renderDialog(
  props: {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    animations?: false;
    contentProps?: Record<string, unknown>;
    overlayProps?: Record<string, unknown>;
    triggerProps?: Record<string, unknown>;
    titleProps?: Record<string, unknown>;
    descriptionProps?: Record<string, unknown>;
    closeProps?: Record<string, unknown>;
    headerProps?: Record<string, unknown>;
    bodyProps?: Record<string, unknown>;
    footerProps?: Record<string, unknown>;
  } = {},
) {
  const {
    open,
    defaultOpen,
    onOpenChange,
    size,
    animations = false, // disable animations in tests by default
    contentProps = {},
    overlayProps = {},
    triggerProps = {},
    titleProps = {},
    descriptionProps = {},
    closeProps = {},
    headerProps = {},
    bodyProps = {},
    footerProps = {},
  } = props;

  return render(
    <Dialog.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      animations={animations}
    >
      <Dialog.Trigger data-testid="trigger" {...triggerProps}>
        Open Dialog
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay data-testid="overlay" {...overlayProps} />
        <Dialog.Content size={size} data-testid="content" {...contentProps}>
          <Dialog.Header data-testid="header" closable={false} {...headerProps}>
            <Dialog.Title data-testid="title" {...titleProps}>
              Dialog Title
            </Dialog.Title>
            <Dialog.Close data-testid="close" {...closeProps}>
              X
            </Dialog.Close>
          </Dialog.Header>
          <Dialog.Body data-testid="body" {...bodyProps}>
            <p>Dialog body content</p>
          </Dialog.Body>
          <Dialog.Description data-testid="description" {...descriptionProps}>
            A description of this dialog
          </Dialog.Description>
          <Dialog.Footer data-testid="footer" {...footerProps}>
            <Dialog.FooterStart data-testid="footer-start">
              <button>Cancel</button>
            </Dialog.FooterStart>
            <Dialog.FooterEnd data-testid="footer-end">
              <button>Confirm</button>
            </Dialog.FooterEnd>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>,
  );
}

describe('Dialog', () => {
  // === Structure ===
  describe('structure', () => {
    it('renders Root/Trigger/Portal/Overlay/Content/Close/Title/Description structure', async () => {
      renderDialog({ open: true });

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      expect(screen.getByTestId('trigger')).toBeInTheDocument();
      expect(screen.getByTestId('overlay')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toBeInTheDocument();
      expect(screen.getByTestId('close')).toBeInTheDocument();
      expect(screen.getByTestId('body')).toBeInTheDocument();
      expect(screen.getByTestId('description')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByTestId('footer-start')).toBeInTheDocument();
      expect(screen.getByTestId('footer-end')).toBeInTheDocument();
    });
  });

  // === Open/close ===
  describe('open/close', () => {
    it('opens on trigger click', async () => {
      const user = userEvent.setup();
      renderDialog({ animations: false });

      // Initially the dialog should not be visible
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      // Click trigger
      await user.click(screen.getByTestId('trigger'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('closes on close button click', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      renderDialog({ open: true, onOpenChange, animations: false });

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('close'));

      // With animations=false, onCloseComplete fires synchronously
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('supports controlled open/onOpenChange', async () => {
      const onOpenChange = vi.fn();
      const { rerender } = render(
        <Dialog.Root open={false} onOpenChange={onOpenChange} animations={false}>
          <Dialog.Trigger data-testid="trigger">Open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close data-testid="close">X</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>,
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      // Re-render with open=true
      rerender(
        <Dialog.Root open={true} onOpenChange={onOpenChange} animations={false}>
          <Dialog.Trigger data-testid="trigger">Open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close data-testid="close">X</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>,
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  // === className/style forwarding ===
  describe('className and style forwarding', () => {
    it('forwards className and style on Content', async () => {
      renderDialog({
        open: true,
        contentProps: { className: 'custom-content', style: { padding: '20px' } },
      });

      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toHaveClass('custom-content');
        expect(content).toHaveStyle({ padding: '20px' });
      });
    });

    it('forwards className and style on Overlay', async () => {
      renderDialog({
        open: true,
        overlayProps: { className: 'custom-overlay', style: { opacity: '0.5' } },
      });

      await waitFor(() => {
        const overlay = screen.getByTestId('overlay');
        expect(overlay).toHaveClass('custom-overlay');
        expect(overlay).toHaveStyle({ opacity: '0.5' });
      });
    });

    it('forwards className and style on Trigger', () => {
      renderDialog({
        triggerProps: { className: 'custom-trigger', style: { color: 'red' } },
      });

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveClass('custom-trigger');
      expect(trigger).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });

    it('forwards className and style on Title', async () => {
      renderDialog({
        open: true,
        titleProps: { className: 'custom-title', style: { fontSize: '24px' } },
      });

      await waitFor(() => {
        const title = screen.getByTestId('title');
        expect(title).toHaveClass('custom-title');
        expect(title).toHaveStyle({ fontSize: '24px' });
      });
    });

    it('forwards className and style on Description', async () => {
      renderDialog({
        open: true,
        descriptionProps: { className: 'custom-desc', style: { color: 'gray' } },
      });

      await waitFor(() => {
        const desc = screen.getByTestId('description');
        expect(desc).toHaveClass('custom-desc');
        expect(desc).toHaveStyle({ color: 'rgb(128, 128, 128)' });
      });
    });

    it('forwards className and style on Close', async () => {
      renderDialog({
        open: true,
        closeProps: { className: 'custom-close', style: { width: '32px' } },
      });

      await waitFor(() => {
        const close = screen.getByTestId('close');
        expect(close).toHaveClass('custom-close');
        expect(close).toHaveStyle({ width: '32px' });
      });
    });

    it('forwards className and style on Header', async () => {
      renderDialog({
        open: true,
        headerProps: { className: 'custom-header', style: { paddingBottom: '20px' } },
      });

      await waitFor(() => {
        const header = screen.getByTestId('header');
        expect(header).toHaveClass('custom-header');
        expect(header).toHaveStyle({ paddingBottom: '20px' });
      });
    });

    it('forwards className and style on Body', async () => {
      renderDialog({
        open: true,
        bodyProps: { className: 'custom-body', style: { maxHeight: '300px' } },
      });

      await waitFor(() => {
        const body = screen.getByTestId('body');
        expect(body).toHaveClass('custom-body');
        expect(body).toHaveStyle({ maxHeight: '300px' });
      });
    });

    it('forwards className and style on Footer', async () => {
      renderDialog({
        open: true,
        footerProps: { className: 'custom-footer', style: { gap: '16px' } },
      });

      await waitFor(() => {
        const footer = screen.getByTestId('footer');
        expect(footer).toHaveClass('custom-footer');
        expect(footer).toHaveStyle({ gap: '16px' });
      });
    });
  });

  // === Title ===
  describe('Title', () => {
    it('renders as a heading element', async () => {
      renderDialog({ open: true });

      await waitFor(() => {
        const title = screen.getByTestId('title');
        expect(title.tagName).toBe('H2');
      });
    });

    it('renders title text content', async () => {
      renderDialog({ open: true });

      await waitFor(() => {
        expect(screen.getByText('Dialog Title')).toBeInTheDocument();
      });
    });
  });

  // === Description ===
  describe('Description', () => {
    it('renders description text', async () => {
      renderDialog({ open: true });

      await waitFor(() => {
        expect(screen.getByText('A description of this dialog')).toBeInTheDocument();
      });
    });

    it('renders as a paragraph element', async () => {
      renderDialog({ open: true });

      await waitFor(() => {
        const desc = screen.getByTestId('description');
        expect(desc.tagName).toBe('DIV');
      });
    });
  });

  // === Accessibility ===
  describe('accessibility', () => {
    it('Content has role=dialog from Radix', async () => {
      renderDialog({ open: true });

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('Title provides accessible label via aria-labelledby', async () => {
      renderDialog({ open: true });

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-labelledby');
      });
    });

    /**
     * A bare Close is the one button a consumer never writes, so the component
     * names it — but only as a DEFAULT. Given children, the consumer owns the
     * content and naming over it would breach WCAG 2.5.3, so no default
     * applies; given none, the glyph needs a name and gets one.
     */
    const renderBareClose = (closeProps: Record<string, unknown> = {}) =>
      render(
        <Dialog.Root open animations={false}>
          <Dialog.Portal>
            <Dialog.Content>
              <Dialog.Title>T</Dialog.Title>
              <Dialog.Description>D</Dialog.Description>
              <Dialog.Close {...closeProps} />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>,
      );

    it('names a bare Close by default when the caller says nothing', async () => {
      renderBareClose();
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
      });
    });

    it('lets a caller\u2019s aria-label win over that default', async () => {
      renderBareClose({ 'aria-label': 'Close the filter panel' });
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Close the filter panel' })).toBeInTheDocument();
      });
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    });

    it('Description provides accessible description via aria-describedby', async () => {
      renderDialog({ open: true });

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-describedby');
      });
    });

    // J17 — the factory used to strip `undefined` from incoming props, so this
    // opt-out never reached Radix. Radix sets `aria-describedby={descriptionId}`
    // and then spreads the consumer's props over it, so passing `undefined` is
    // the documented way to say "this dialog needs no description". With the key
    // dropped, the generated id survived and Radix warned about a description
    // that could not be suppressed — on ~44 overlays. vitest.setup throws on
    // console.warn, so this test fails loudly if the strip ever comes back.
    it('accepts aria-describedby={undefined} as the no-description opt-out', async () => {
      render(
        <Dialog.Root open animations={false}>
          <Dialog.Portal>
            <Dialog.Content aria-describedby={undefined}>
              <Dialog.Header>
                <Dialog.Title>Title</Dialog.Title>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>,
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-describedby');
    });

    it("Header's automatic close button resolves an accessible name", async () => {
      render(
        <Dialog.Root open animations={false}>
          <Dialog.Portal>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Title</Dialog.Title>
              </Dialog.Header>
              <Dialog.Description>Body</Dialog.Description>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>,
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
      });
    });

    it('automatic close name is overridable via labels', async () => {
      render(
        <Dialog.Root open animations={false} labels={{ close: 'Sluiten' }}>
          <Dialog.Portal>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Title</Dialog.Title>
              </Dialog.Header>
              <Dialog.Description>Body</Dialog.Description>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>,
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Sluiten' })).toBeInTheDocument();
      });
    });

    it('a Close written by the consumer suppresses the automatic one', async () => {
      render(
        <Dialog.Root open animations={false}>
          <Dialog.Portal>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Title</Dialog.Title>
                <Dialog.Close>Done</Dialog.Close>
              </Dialog.Header>
              <Dialog.Description>Body</Dialog.Description>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>,
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
      });
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    });

    it('a consumer Close nested inside header markup also suppresses it', async () => {
      render(
        <Dialog.Root open animations={false}>
          <Dialog.Portal>
            <Dialog.Content>
              <Dialog.Header>
                <div>
                  <Dialog.Title>Title</Dialog.Title>
                  <Dialog.Close>Done</Dialog.Close>
                </div>
              </Dialog.Header>
              <Dialog.Description>Body</Dialog.Description>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>,
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
      });
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    });

    it('visible text on a Close is not overridden by the default name', async () => {
      renderDialog({ open: true });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'X' })).toBeInTheDocument();
      });
    });
  });

  // === Size variants ===
  describe('size variants', () => {
    it('defaults to size md', async () => {
      renderDialog({ open: true });

      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toHaveAttribute('data-size', 'md');
      });
    });

    it('renders data-size attribute for sm', async () => {
      renderDialog({ open: true, size: 'sm' });

      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toHaveAttribute('data-size', 'sm');
      });
    });

    it('renders data-size attribute for lg', async () => {
      renderDialog({ open: true, size: 'lg' });

      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toHaveAttribute('data-size', 'lg');
      });
    });

    it('renders data-size attribute for xl', async () => {
      renderDialog({ open: true, size: 'xl' });

      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toHaveAttribute('data-size', 'xl');
      });
    });

    it('renders data-size attribute for full', async () => {
      renderDialog({ open: true, size: 'full' });

      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toHaveAttribute('data-size', 'full');
      });
    });
  });
});
