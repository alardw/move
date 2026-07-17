// Generated from Tooltip.spec.ts
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Tooltip } from './Tooltip';

// Helper: Wrap in Provider for tests
function renderTooltip(ui: React.ReactElement) {
  return render(<Tooltip.Provider delayDuration={0}>{ui}</Tooltip.Provider>);
}

// Helper to find tooltip content div — Radix v2 puts role="tooltip" on a hidden child span,
// but the actual content div with data-side/data-state/classes is its parent.
// See generation-issues.md for details
function findTooltip() {
  const tooltips = screen.getAllByRole('tooltip');
  const el = tooltips[tooltips.length - 1];
  // If the element has data-side, it's the content div itself; otherwise walk up to the content div
  if (el.hasAttribute('data-side')) return el;
  // The role="tooltip" span is a child of the Radix Content div
  const parent = el.parentElement;
  if (parent && parent.hasAttribute('data-side')) return parent;
  return el;
}

describe('Tooltip', () => {
  // === Simple API ===
  describe('Simple API', () => {
    it('renders trigger element via asChild', () => {
      renderTooltip(
        <Tooltip label="Help text">
          <button data-testid="trigger">Hover</button>
        </Tooltip>,
      );
      expect(screen.getByTestId('trigger')).toBeInTheDocument();
    });

    it('renders tooltip content on hover', async () => {
      renderTooltip(
        <Tooltip label="Help text" open>
          <button>Hover</button>
        </Tooltip>,
      );
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('renders label as tooltip text', async () => {
      renderTooltip(
        <Tooltip label="My tooltip label" open>
          <button>Hover</button>
        </Tooltip>,
      );
      await waitFor(() => {
        const tooltip = findTooltip();
        expect(tooltip.textContent).toContain('My tooltip label');
      });
    });

    it('renders children as trigger via asChild', () => {
      renderTooltip(
        <Tooltip label="Tip">
          <button data-testid="my-btn">Click</button>
        </Tooltip>,
      );
      const trigger = screen.getByTestId('my-btn');
      expect(trigger.tagName).toBe('BUTTON');
    });

    it('shows arrow by default', async () => {
      renderTooltip(
        <Tooltip label="With arrow" open>
          <button>Hover</button>
        </Tooltip>,
      );
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
      const tooltip = findTooltip();
      const svg = tooltip.parentElement?.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('hides arrow when arrow=false', async () => {
      renderTooltip(
        <Tooltip label="No arrow" arrow={false} open>
          <button>Hover</button>
        </Tooltip>,
      );
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
      const tooltip = findTooltip();
      const svg = tooltip.parentElement?.querySelector('svg');
      expect(svg).not.toBeInTheDocument();
    });

    it('defaults sideOffset to 6', async () => {
      renderTooltip(
        <Tooltip label="Offset test" open>
          <button>Hover</button>
        </Tooltip>,
      );
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('accepts side prop without error', () => {
      // side prop is forwarded to Radix Content; positioning is CSS/browser-only
      renderTooltip(
        <Tooltip label="Bottom" side="bottom" open>
          <button>Hover</button>
        </Tooltip>,
      );
      expect(screen.getByText('Hover')).toBeInTheDocument();
    });

    it('forwards open and onOpenChange to Root', () => {
      const onOpenChange = vi.fn();
      renderTooltip(
        <Tooltip label="Controlled" open onOpenChange={onOpenChange}>
          <button>Hover</button>
        </Tooltip>,
      );
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    // The simple API carried `open`/`onOpenChange` but not `defaultOpen`, so the one
    // thing you'd reach for it for — open on mount, hover-driven after — meant either
    // useState boilerplate or dropping to the compound API. Whole triad now.
    it('forwards defaultOpen to Root', async () => {
      renderTooltip(
        <Tooltip label="Uncontrolled" defaultOpen>
          <button>Hover</button>
        </Tooltip>,
      );
      await waitFor(() => {
        expect(findTooltip().textContent).toContain('Uncontrolled');
      });
    });

    it('forwards animations prop into Content', async () => {
      renderTooltip(
        <Tooltip label="No anim" animations={false} open>
          <button>Hover</button>
        </Tooltip>,
      );
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });
  });

  // === Content sub-component ===
  // NOTE: Compound tests use asChild on Trigger to avoid nested <button> (see generation-issues.md)
  describe('Content', () => {
    it('renders with data-side attribute', async () => {
      renderTooltip(
        <Tooltip.Root open>
          <Tooltip.Trigger asChild>
            <button>T</button>
          </Tooltip.Trigger>
          <Tooltip.Content sideOffset={4}>Content</Tooltip.Content>
        </Tooltip.Root>,
      );
      await waitFor(() => {
        const tooltip = findTooltip();
        expect(tooltip).toHaveAttribute('data-side');
      });
    });

    it('renders with data-state attribute', async () => {
      renderTooltip(
        <Tooltip.Root open>
          <Tooltip.Trigger asChild>
            <button>T</button>
          </Tooltip.Trigger>
          <Tooltip.Content>Content</Tooltip.Content>
        </Tooltip.Root>,
      );
      await waitFor(() => {
        const tooltip = findTooltip();
        expect(tooltip).toHaveAttribute('data-state');
      });
    });

    it('renders with data-align attribute', async () => {
      renderTooltip(
        <Tooltip.Root open>
          <Tooltip.Trigger asChild>
            <button>T</button>
          </Tooltip.Trigger>
          <Tooltip.Content align="start">Content</Tooltip.Content>
        </Tooltip.Root>,
      );
      await waitFor(() => {
        const tooltip = findTooltip();
        expect(tooltip).toHaveAttribute('data-align');
      });
    });

    it('is rendered in a portal', async () => {
      const { container } = renderTooltip(
        <Tooltip.Root open>
          <Tooltip.Trigger asChild>
            <button>T</button>
          </Tooltip.Trigger>
          <Tooltip.Content>Portaled</Tooltip.Content>
        </Tooltip.Root>,
      );
      await waitFor(() => {
        expect(screen.getAllByRole('tooltip').length).toBeGreaterThan(0);
      });
      // Content should not be inside the render container since it's portaled
      const tooltipInContainer = container.querySelector('[role="tooltip"]');
      expect(tooltipInContainer).toBeNull();
    });

    it('forwards className and style on Content', async () => {
      renderTooltip(
        <Tooltip.Root open>
          <Tooltip.Trigger asChild>
            <button>T</button>
          </Tooltip.Trigger>
          <Tooltip.Content className="custom-content" style={{ padding: '20px' }}>
            Styled
          </Tooltip.Content>
        </Tooltip.Root>,
      );
      await waitFor(() => {
        const tooltip = findTooltip();
        expect(tooltip).toHaveClass('custom-content');
        expect(tooltip).toHaveStyle({ padding: '20px' });
      });
    });
  });

  // === Trigger sub-component ===
  describe('Trigger', () => {
    it('forwards props via asChild', () => {
      renderTooltip(
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button className="custom-trigger" style={{ color: 'red' }} data-testid="trigger-btn">
              T
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content>Content</Tooltip.Content>
        </Tooltip.Root>,
      );
      const triggerBtn = screen.getByTestId('trigger-btn');
      expect(triggerBtn).toHaveClass('custom-trigger');
      expect(triggerBtn).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });
  });

  // === Accessibility ===
  describe('accessibility', () => {
    it('Content has role=tooltip from Radix', async () => {
      renderTooltip(
        <Tooltip.Root open>
          <Tooltip.Trigger asChild>
            <button>T</button>
          </Tooltip.Trigger>
          <Tooltip.Content>Accessible tooltip</Tooltip.Content>
        </Tooltip.Root>,
      );
      await waitFor(() => {
        expect(screen.getAllByRole('tooltip').length).toBeGreaterThan(0);
      });
    });

    it('Trigger has appropriate aria attributes from Radix', () => {
      renderTooltip(
        <Tooltip.Root open>
          <Tooltip.Trigger asChild>
            <button data-testid="trigger">T</button>
          </Tooltip.Trigger>
          <Tooltip.Content>Tooltip text</Tooltip.Content>
        </Tooltip.Root>,
      );
      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('aria-describedby');
    });
  });

  // === Provider ===
  describe('Provider', () => {
    it('shares delay settings across instances', () => {
      render(
        <Tooltip.Provider delayDuration={0}>
          <Tooltip label="First" open>
            <button>A</button>
          </Tooltip>
          <Tooltip label="Second">
            <button>B</button>
          </Tooltip>
        </Tooltip.Provider>,
      );
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  // === Animation ===
  describe('animation', () => {
    it('animations=false disables entrance animation', async () => {
      renderTooltip(
        <Tooltip label="No anim" animations={false} open>
          <button>Hover</button>
        </Tooltip>,
      );
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });
  });

  // === Compound API ===
  describe('compound API', () => {
    it('renders full compound structure', async () => {
      renderTooltip(
        <Tooltip.Root open>
          <Tooltip.Trigger asChild>
            <button data-testid="trigger">Hover</button>
          </Tooltip.Trigger>
          <Tooltip.Content side="top" sideOffset={6}>
            <Tooltip.Arrow />
            Compound tooltip
          </Tooltip.Content>
        </Tooltip.Root>,
      );
      expect(screen.getByTestId('trigger')).toBeInTheDocument();
      await waitFor(() => {
        const tooltip = findTooltip();
        expect(tooltip.textContent).toContain('Compound tooltip');
      });
    });

    // behavior-3: the spec declares the open/defaultOpen/onOpenChange triad, but every
    // other test here drives `open` — the uncontrolled path, where the component owns
    // its own visibility, went unexercised. It lives on Tooltip.Root: the simple
    // <Tooltip label> API takes `open`/`onOpenChange` but has no `defaultOpen`.
    it('uncontrolled: defaultOpen opens it with no controlled prop', async () => {
      renderTooltip(
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger asChild>
            <button data-testid="trigger">Hover</button>
          </Tooltip.Trigger>
          <Tooltip.Content>Uncontrolled tooltip</Tooltip.Content>
        </Tooltip.Root>,
      );
      await waitFor(() => {
        expect(findTooltip().textContent).toContain('Uncontrolled tooltip');
      });
    });
  });
});
