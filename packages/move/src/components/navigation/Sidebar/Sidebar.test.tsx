// Generated from Sidebar.spec.ts
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Sidebar } from './Sidebar';

// Helper to wrap sub-components in Provider (all except Provider itself require context)
function renderWithProvider(ui: React.ReactNode, providerProps: Record<string, unknown> = {}) {
  return render(<Sidebar.Provider {...providerProps}>{ui}</Sidebar.Provider>);
}

describe('Sidebar', () => {
  // === Provider ===
  describe('Provider', () => {
    it('renders children', () => {
      render(
        <Sidebar.Provider>
          <div data-testid="child">Hello</div>
        </Sidebar.Provider>,
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });

  // === Root ===
  describe('Root', () => {
    it('renders as aside element', () => {
      renderWithProvider(<Sidebar.Root data-testid="root">Content</Sidebar.Root>);
      const el = screen.getByTestId('root');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('ASIDE');
    });

    it('has data-collapsed attribute', () => {
      renderWithProvider(<Sidebar.Root data-testid="root">Content</Sidebar.Root>);
      expect(screen.getByTestId('root')).toHaveAttribute('data-collapsed', 'false');
    });

    it('has data-collapsed=true when defaultCollapsed is true', () => {
      renderWithProvider(<Sidebar.Root data-testid="root">Content</Sidebar.Root>, {
        defaultCollapsed: true,
      });
      expect(screen.getByTestId('root')).toHaveAttribute('data-collapsed', 'true');
    });

    it('has data-side defaulting to left', () => {
      renderWithProvider(<Sidebar.Root data-testid="root">Content</Sidebar.Root>);
      expect(screen.getByTestId('root')).toHaveAttribute('data-side', 'left');
    });

    it('has data-side=right when side=right', () => {
      renderWithProvider(
        <Sidebar.Root data-testid="root" side="right">
          Content
        </Sidebar.Root>,
      );
      expect(screen.getByTestId('root')).toHaveAttribute('data-side', 'right');
    });

    it('forwards className', () => {
      renderWithProvider(
        <Sidebar.Root data-testid="root" className="custom">
          Content
        </Sidebar.Root>,
      );
      expect(screen.getByTestId('root').className).toContain('custom');
    });

    it('forwards style', () => {
      renderWithProvider(
        <Sidebar.Root data-testid="root" style={{ marginTop: '10px' }}>
          Content
        </Sidebar.Root>,
      );
      expect(screen.getByTestId('root')).toHaveStyle({ marginTop: '10px' });
    });

    it('renders children', () => {
      renderWithProvider(<Sidebar.Root>Hello Sidebar</Sidebar.Root>);
      expect(screen.getByText('Hello Sidebar')).toBeInTheDocument();
    });
  });

  // === Header ===
  describe('Header', () => {
    it('renders as div element', () => {
      renderWithProvider(<Sidebar.Header data-testid="header">Header</Sidebar.Header>);
      const el = screen.getByTestId('header');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('DIV');
    });

    it('renders children', () => {
      renderWithProvider(<Sidebar.Header>My Header</Sidebar.Header>);
      expect(screen.getByText('My Header')).toBeInTheDocument();
    });

    it('shows collapsedChildren when collapsed on desktop', () => {
      renderWithProvider(
        <Sidebar.Header data-testid="header" collapsedChildren={<span>Collapsed</span>}>
          <span>Expanded</span>
        </Sidebar.Header>,
        { defaultCollapsed: true },
      );
      expect(screen.getByText('Collapsed')).toBeInTheDocument();
      expect(screen.queryByText('Expanded')).not.toBeInTheDocument();
    });

    it('shows children when not collapsed', () => {
      renderWithProvider(
        <Sidebar.Header data-testid="header" collapsedChildren={<span>Collapsed</span>}>
          <span>Expanded</span>
        </Sidebar.Header>,
        { defaultCollapsed: false },
      );
      expect(screen.getByText('Expanded')).toBeInTheDocument();
      expect(screen.queryByText('Collapsed')).not.toBeInTheDocument();
    });

    it('forwards className and style', () => {
      renderWithProvider(
        <Sidebar.Header data-testid="header" className="custom" style={{ padding: '8px' }}>
          Header
        </Sidebar.Header>,
      );
      const el = screen.getByTestId('header');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ padding: '8px' });
    });
  });

  // === Content ===
  describe('Content', () => {
    it('renders as div element', () => {
      renderWithProvider(<Sidebar.Content data-testid="content">Content area</Sidebar.Content>);
      const el = screen.getByTestId('content');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('DIV');
    });

    it('renders children', () => {
      renderWithProvider(<Sidebar.Content>My Content</Sidebar.Content>);
      expect(screen.getByText('My Content')).toBeInTheDocument();
    });

    it('forwards className and style', () => {
      renderWithProvider(
        <Sidebar.Content data-testid="content" className="custom" style={{ padding: '16px' }}>
          Content
        </Sidebar.Content>,
      );
      const el = screen.getByTestId('content');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ padding: '16px' });
    });
  });

  // === Footer ===
  describe('Footer', () => {
    it('renders as div element', () => {
      renderWithProvider(<Sidebar.Footer data-testid="footer">Footer</Sidebar.Footer>);
      const el = screen.getByTestId('footer');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('DIV');
    });

    it('renders children', () => {
      renderWithProvider(<Sidebar.Footer>My Footer</Sidebar.Footer>);
      expect(screen.getByText('My Footer')).toBeInTheDocument();
    });

    it('forwards className and style', () => {
      renderWithProvider(
        <Sidebar.Footer data-testid="footer" className="custom" style={{ padding: '12px' }}>
          Footer
        </Sidebar.Footer>,
      );
      const el = screen.getByTestId('footer');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ padding: '12px' });
    });
  });

  // === Group ===
  describe('Group', () => {
    it('renders with role=group', () => {
      renderWithProvider(<Sidebar.Group>Items</Sidebar.Group>);
      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('renders as div element', () => {
      renderWithProvider(<Sidebar.Group data-testid="group">Items</Sidebar.Group>);
      const el = screen.getByTestId('group');
      expect(el.tagName).toBe('DIV');
    });

    it('renders children', () => {
      renderWithProvider(<Sidebar.Group>Group Content</Sidebar.Group>);
      expect(screen.getByText('Group Content')).toBeInTheDocument();
    });

    it('forwards className and style', () => {
      renderWithProvider(
        <Sidebar.Group data-testid="group" className="custom" style={{ gap: '4px' }}>
          Items
        </Sidebar.Group>,
      );
      const el = screen.getByTestId('group');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ gap: '4px' });
    });
  });

  // === Item ===
  describe('Item', () => {
    it('renders as button by default', () => {
      renderWithProvider(<Sidebar.Item data-testid="item">Dashboard</Sidebar.Item>);
      const el = screen.getByTestId('item');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('BUTTON');
    });

    it('renders children as label text', () => {
      renderWithProvider(<Sidebar.Item>Dashboard</Sidebar.Item>);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('renders icon when provided', () => {
      renderWithProvider(
        <Sidebar.Item icon={<span data-testid="icon">IC</span>}>Dashboard</Sidebar.Item>,
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('renders badge when provided', () => {
      renderWithProvider(
        <Sidebar.Item badge={<span data-testid="badge">3</span>}>Messages</Sidebar.Item>,
      );
      expect(screen.getByTestId('badge')).toBeInTheDocument();
    });

    it('sets data-active when active=true', () => {
      renderWithProvider(
        <Sidebar.Item data-testid="item" active>
          Dashboard
        </Sidebar.Item>,
      );
      expect(screen.getByTestId('item')).toHaveAttribute('data-active', 'true');
    });

    it('does not set data-active when active is falsy', () => {
      renderWithProvider(<Sidebar.Item data-testid="item">Dashboard</Sidebar.Item>);
      expect(screen.getByTestId('item')).not.toHaveAttribute('data-active');
    });

    it('sets data-disabled when disabled=true', () => {
      renderWithProvider(
        <Sidebar.Item data-testid="item" disabled>
          Dashboard
        </Sidebar.Item>,
      );
      expect(screen.getByTestId('item')).toHaveAttribute('data-disabled', 'true');
    });

    it('forwards className and style', () => {
      renderWithProvider(
        <Sidebar.Item data-testid="item" className="custom" style={{ color: 'rgb(255, 0, 0)' }}>
          Dashboard
        </Sidebar.Item>,
      );
      const el = screen.getByTestId('item');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });
  });

  // === Trigger ===
  describe('Trigger', () => {
    it('renders as button by default', () => {
      renderWithProvider(<Sidebar.Trigger data-testid="trigger">Toggle</Sidebar.Trigger>);
      const el = screen.getByTestId('trigger');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('BUTTON');
    });

    it('toggles collapsed state on click (desktop)', () => {
      const onCollapsedChange = vi.fn();
      render(
        <Sidebar.Provider defaultCollapsed={false} onCollapsedChange={onCollapsedChange}>
          <Sidebar.Root data-testid="root">
            <Sidebar.Trigger data-testid="trigger">Toggle</Sidebar.Trigger>
          </Sidebar.Root>
        </Sidebar.Provider>,
      );

      expect(screen.getByTestId('root')).toHaveAttribute('data-collapsed', 'false');

      fireEvent.click(screen.getByTestId('trigger'));
      expect(onCollapsedChange).toHaveBeenCalledWith(true);
    });

    it('forwards className and style', () => {
      renderWithProvider(
        <Sidebar.Trigger data-testid="trigger" className="custom" style={{ padding: '4px' }}>
          Toggle
        </Sidebar.Trigger>,
      );
      const el = screen.getByTestId('trigger');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ padding: '4px' });
    });
  });

  // === GroupLabel ===
  describe('GroupLabel', () => {
    it('renders as div element', () => {
      renderWithProvider(<Sidebar.GroupLabel data-testid="label">Navigation</Sidebar.GroupLabel>);
      const el = screen.getByTestId('label');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('DIV');
    });

    it('renders children', () => {
      renderWithProvider(<Sidebar.GroupLabel>Navigation</Sidebar.GroupLabel>);
      expect(screen.getByText('Navigation')).toBeInTheDocument();
    });

    it('forwards className and style', () => {
      renderWithProvider(
        <Sidebar.GroupLabel data-testid="label" className="custom" style={{ fontSize: '10px' }}>
          Navigation
        </Sidebar.GroupLabel>,
      );
      const el = screen.getByTestId('label');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ fontSize: '10px' });
    });
  });

  // === Composition ===
  describe('composition', () => {
    it('renders full sidebar composition', () => {
      render(
        <Sidebar.Provider>
          <Sidebar.Root data-testid="root">
            <Sidebar.Header data-testid="header">
              <span>Logo</span>
            </Sidebar.Header>
            <Sidebar.Content data-testid="content">
              <Sidebar.Group data-testid="group">
                <Sidebar.GroupLabel>Navigation</Sidebar.GroupLabel>
                <Sidebar.Item icon={<span>H</span>}>Home</Sidebar.Item>
                <Sidebar.Item icon={<span>S</span>} active>
                  Settings
                </Sidebar.Item>
              </Sidebar.Group>
            </Sidebar.Content>
            <Sidebar.Footer data-testid="footer">
              <Sidebar.Item icon={<span>U</span>}>User</Sidebar.Item>
            </Sidebar.Footer>
          </Sidebar.Root>
          <Sidebar.Trigger data-testid="trigger">Toggle</Sidebar.Trigger>
        </Sidebar.Provider>,
      );

      expect(screen.getByTestId('root')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByTestId('trigger')).toBeInTheDocument();
      expect(screen.getByRole('group')).toBeInTheDocument();
      expect(screen.getByText('Navigation')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('User')).toBeInTheDocument();
    });
  });

  // === Mobile modal sheet (Radix Dialog) ===
  describe('mobile modal sheet', () => {
    it('renders as a Radix Dialog (role=dialog, aria-modal) with an accessible name', () => {
      const origWidth = window.innerWidth;
      const origMatchMedia = window.matchMedia;
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: 500 });
      window.matchMedia = ((query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      })) as unknown as typeof window.matchMedia;

      try {
        renderWithProvider(
          <Sidebar.Root>
            <Sidebar.Content>
              <Sidebar.Item>Home</Sidebar.Item>
            </Sidebar.Content>
          </Sidebar.Root>,
          { defaultMobileOpen: true },
        );

        // Radix Dialog renders the sheet with role="dialog"; the focus
        // trap / aria-modal / scroll-lock are the primitive's guarantees.
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        // Accessible name comes from the visually-hidden Dialog.Title.
        expect(screen.getByText('Navigation')).toBeInTheDocument();
      } finally {
        Object.defineProperty(window, 'innerWidth', { configurable: true, value: origWidth });
        window.matchMedia = origMatchMedia;
      }
    });
  });
});
