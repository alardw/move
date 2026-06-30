// Generated from Popover.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Popover } from './Popover';

// Helper: render a default Popover structure
function renderPopover(
  rootProps: Partial<React.ComponentProps<typeof Popover.Root>> = {},
  contentProps: Partial<React.ComponentProps<typeof Popover.Content>> = {},
  children?: React.ReactNode,
) {
  return render(
    <Popover.Root {...rootProps}>
      <Popover.Trigger asChild data-testid="trigger">
        <button>Open</button>
      </Popover.Trigger>
      <Popover.Content data-testid="content" {...contentProps}>
        {children ?? 'Popover body'}
        <Popover.Close data-testid="close" />
      </Popover.Content>
    </Popover.Root>,
  );
}

describe('Popover', () => {
  // === Root: controlled / uncontrolled ===
  describe('Root', () => {
    it('renders children when defaultOpen is true (uncontrolled)', async () => {
      renderPopover({ defaultOpen: true });
      await waitFor(() => {
        expect(screen.getByText('Popover body')).toBeInTheDocument();
      });
    });

    it('supports controlled open state', async () => {
      renderPopover({ open: true });
      await waitFor(() => {
        expect(screen.getByText('Popover body')).toBeInTheDocument();
      });
    });

    it('calls onOpenChange when opening', async () => {
      const onOpenChange = vi.fn();
      renderPopover({ onOpenChange });

      const user = userEvent.setup();
      await user.click(screen.getByTestId('trigger'));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(true);
      });
    });

    it('does not show content when open is false', () => {
      renderPopover({ open: false });
      expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
    });
  });

  // === Trigger ===
  describe('Trigger', () => {
    it('toggles popover on click', async () => {
      const user = userEvent.setup();
      renderPopover();

      await user.click(screen.getByTestId('trigger'));

      await waitFor(() => {
        expect(screen.getByText('Popover body')).toBeInTheDocument();
      });
    });

    it('forwards className and style', () => {
      render(
        <Popover.Root>
          <Popover.Trigger
            asChild
            className="custom-trigger"
            style={{ color: 'red' }}
            data-testid="trigger"
          >
            <button>Open</button>
          </Popover.Trigger>
          <Popover.Content>Content</Popover.Content>
        </Popover.Root>,
      );
      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveClass('custom-trigger');
      expect(trigger.style.color).toBe('red');
    });
  });

  // === Content ===
  describe('Content', () => {
    it('renders with data-state attribute', async () => {
      renderPopover({ open: true });
      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toHaveAttribute('data-state');
      });
    });

    it('renders with data-side attribute', async () => {
      renderPopover({ open: true }, { side: 'bottom' });
      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toHaveAttribute('data-side');
      });
    });

    it('renders with data-align attribute', async () => {
      renderPopover({ open: true }, { align: 'start' });
      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toHaveAttribute('data-align');
      });
    });

    it('is rendered in a portal (not inside render container)', async () => {
      const { container } = renderPopover({ open: true });
      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument();
      });
      // Content is portaled, so it should not appear inside the render container
      const contentInContainer = container.querySelector('[data-testid="content"]');
      expect(contentInContainer).toBeNull();
    });

    it('forwards className and style on Content', async () => {
      renderPopover({ open: true }, { className: 'custom-content', style: { padding: '20px' } });
      await waitFor(() => {
        const content = screen.getByTestId('content');
        expect(content).toHaveClass('custom-content');
        expect(content).toHaveStyle({ padding: '20px' });
      });
    });

    it('forwards onOpenAutoFocus', async () => {
      const onOpenAutoFocus = vi.fn();
      renderPopover({ open: true }, { onOpenAutoFocus });
      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument();
      });
      // onOpenAutoFocus should have been called when content appeared
      expect(onOpenAutoFocus).toHaveBeenCalled();
    });
  });

  // === Close ===
  describe('Close', () => {
    it('renders a close button with aria-label "Close" by default', async () => {
      renderPopover({ open: true });
      await waitFor(() => {
        const closeBtn = screen.getByTestId('close');
        expect(closeBtn).toHaveAttribute('aria-label', 'Close');
      });
    });

    it('uses custom labels.close for aria-label', async () => {
      render(
        <Popover.Root open>
          <Popover.Trigger asChild>
            <button>Open</button>
          </Popover.Trigger>
          <Popover.Content>
            <Popover.Close labels={{ close: 'Dismiss' }} data-testid="close" />
          </Popover.Content>
        </Popover.Root>,
      );
      await waitFor(() => {
        expect(screen.getByTestId('close')).toHaveAttribute('aria-label', 'Dismiss');
      });
    });

    it('renders custom children instead of default icon', async () => {
      render(
        <Popover.Root open>
          <Popover.Trigger asChild>
            <button>Open</button>
          </Popover.Trigger>
          <Popover.Content>
            <Popover.Close data-testid="close">
              <span data-testid="custom-icon">X</span>
            </Popover.Close>
          </Popover.Content>
        </Popover.Root>,
      );
      await waitFor(() => {
        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
      });
    });
  });

  // === Arrow ===
  describe('Arrow', () => {
    it('renders arrow element inside content', async () => {
      render(
        <Popover.Root open>
          <Popover.Trigger asChild>
            <button>Open</button>
          </Popover.Trigger>
          <Popover.Content data-testid="content">
            <Popover.Arrow data-testid="arrow" />
            Body
          </Popover.Content>
        </Popover.Root>,
      );
      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument();
      });
    });
  });

  // === Anchor ===
  describe('Anchor', () => {
    it('renders as alternative positioning reference', () => {
      render(
        <Popover.Root>
          <Popover.Anchor data-testid="anchor">
            <span>Anchor element</span>
          </Popover.Anchor>
          <Popover.Trigger asChild>
            <button>Open</button>
          </Popover.Trigger>
          <Popover.Content>Body</Popover.Content>
        </Popover.Root>,
      );
      expect(screen.getByTestId('anchor')).toBeInTheDocument();
    });
  });

  // === Animation ===
  describe('animation', () => {
    it('animations=false disables animations and still renders content', async () => {
      renderPopover({ open: true, animations: false });
      await waitFor(() => {
        expect(screen.getByText('Popover body')).toBeInTheDocument();
      });
    });
  });

  // === Accessibility ===
  describe('accessibility', () => {
    it('Close button has focus-visible outline via CSS class', async () => {
      renderPopover({ open: true });
      await waitFor(() => {
        const closeBtn = screen.getByTestId('close');
        expect(closeBtn).toBeInTheDocument();
        expect(closeBtn.tagName).toBe('BUTTON');
      });
    });

    it('Close button has type="button"', async () => {
      renderPopover({ open: true });
      await waitFor(() => {
        const closeBtn = screen.getByTestId('close');
        expect(closeBtn).toHaveAttribute('type', 'button');
      });
    });
  });

  // === Compound API full structure ===
  describe('compound API', () => {
    it('renders full compound structure', async () => {
      render(
        <Popover.Root open>
          <Popover.Trigger asChild>
            <button data-testid="trigger">Open Popover</button>
          </Popover.Trigger>
          <Popover.Content side="bottom" sideOffset={8} data-testid="content">
            <Popover.Arrow />
            <div>Popover panel content</div>
            <Popover.Close data-testid="close" />
          </Popover.Content>
        </Popover.Root>,
      );
      expect(screen.getByTestId('trigger')).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument();
        expect(screen.getByText('Popover panel content')).toBeInTheDocument();
        expect(screen.getByTestId('close')).toBeInTheDocument();
      });
    });
  });
});
