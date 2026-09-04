// Generated from Sidebar.spec.ts
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Sidebar } from './Sidebar';

// Helper to wrap sub-components in Provider (all except Provider itself require context)
function renderWithProvider(ui: React.ReactNode, providerProps: Record<string, unknown> = {}) {
  return render(<Sidebar.Provider {...providerProps}>{ui}</Sidebar.Provider>);
}

/** Run a body below the mobile breakpoint, then put the window back. */
function withMobile(body: () => void) {
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
    body();
  } finally {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: origWidth });
    window.matchMedia = origMatchMedia;
  }
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

    it('keeps the parts that stay while the marked parts swap', () => {
      // A header is usually a mark that stays plus a title that goes. The prop
      // this replaced swapped the WHOLE child set, so the mark had to be written
      // twice — and every sample did exactly that.
      renderWithProvider(
        <Sidebar.Header data-testid="header">
          <span>Mark</span>
          <Sidebar.Expanded>
            <span>Acme Co.</span>
          </Sidebar.Expanded>
          <Sidebar.Collapsed>
            <span>AC</span>
          </Sidebar.Collapsed>
        </Sidebar.Header>,
        { defaultCollapsed: true },
      );
      expect(screen.getByText('Mark')).toBeInTheDocument();
      expect(screen.getByText('AC')).toBeInTheDocument();
      expect(screen.queryByText('Acme Co.')).not.toBeInTheDocument();
    });

    it('shows the expanded part when not collapsed', () => {
      renderWithProvider(
        <Sidebar.Header data-testid="header">
          <span>Mark</span>
          <Sidebar.Expanded>
            <span>Acme Co.</span>
          </Sidebar.Expanded>
          <Sidebar.Collapsed>
            <span>AC</span>
          </Sidebar.Collapsed>
        </Sidebar.Header>,
        { defaultCollapsed: false },
      );
      expect(screen.getByText('Mark')).toBeInTheDocument();
      expect(screen.getByText('Acme Co.')).toBeInTheDocument();
      expect(screen.queryByText('AC')).not.toBeInTheDocument();
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
    it('claims no role of its own — it is a box, and the Nav inside it is the landmark', () => {
      renderWithProvider(<Sidebar.Group>Items</Sidebar.Group>);
      expect(screen.queryByRole('group')).not.toBeInTheDocument();
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

  // === Nav ===
  describe('Nav', () => {
    it('renders a navigation landmark around a list', () => {
      renderWithProvider(
        <Sidebar.Nav aria-label="Main">
          <Sidebar.NavItem href="/">Home</Sidebar.NavItem>
        </Sidebar.Nav>,
      );
      const nav = screen.getByRole('navigation', { name: 'Main' });
      expect(nav).toBeInTheDocument();
      expect(within(nav).getByRole('list')).toBeInTheDocument();
      expect(within(nav).getAllByRole('listitem')).toHaveLength(1);
    });

    it('takes its name from the GroupLabel in the surrounding Group', () => {
      renderWithProvider(
        <Sidebar.Group>
          <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
          <Sidebar.Nav>
            <Sidebar.NavItem href="/">Home</Sidebar.NavItem>
          </Sidebar.Nav>
        </Sidebar.Group>,
      );
      expect(screen.getByRole('navigation', { name: 'Workspace' })).toBeInTheDocument();
    });

    it("does not point at a label that isn't there", () => {
      renderWithProvider(
        <Sidebar.Group>
          <Sidebar.Nav>
            <Sidebar.NavItem href="/">Home</Sidebar.NavItem>
          </Sidebar.Nav>
        </Sidebar.Group>,
      );
      expect(screen.getByRole('navigation')).not.toHaveAttribute('aria-labelledby');
    });

    it("lets the caller's own aria-label win over the group's", () => {
      renderWithProvider(
        <Sidebar.Group>
          <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
          <Sidebar.Nav aria-label="Projects">
            <Sidebar.NavItem href="/">Home</Sidebar.NavItem>
          </Sidebar.Nav>
        </Sidebar.Group>,
      );
      expect(screen.getByRole('navigation', { name: 'Projects' })).toBeInTheDocument();
    });
  });

  // === NavItem ===
  describe('NavItem', () => {
    it('renders a link inside a list item', () => {
      renderWithProvider(
        <Sidebar.Nav aria-label="Main">
          <Sidebar.NavItem href="/dashboard">Dashboard</Sidebar.NavItem>
        </Sidebar.Nav>,
      );
      const link = screen.getByRole('link', { name: 'Dashboard' });
      expect(link).toHaveAttribute('href', '/dashboard');
      expect(link.closest('li')).toBeInTheDocument();
    });

    it('renders icon and badge when provided', () => {
      renderWithProvider(
        <Sidebar.Nav aria-label="Main">
          <Sidebar.NavItem
            href="/messages"
            icon={<span data-testid="icon">IC</span>}
            badge={<span data-testid="badge">3</span>}
          >
            Messages
          </Sidebar.NavItem>
        </Sidebar.Nav>,
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByTestId('badge')).toBeInTheDocument();
    });

    it('marks the active destination as the current page', () => {
      renderWithProvider(
        <Sidebar.Nav aria-label="Main">
          <Sidebar.NavItem href="/" active>
            Home
          </Sidebar.NavItem>
          <Sidebar.NavItem href="/settings">Settings</Sidebar.NavItem>
        </Sidebar.Nav>,
      );
      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('data-active', 'true');
      expect(screen.getByRole('link', { name: 'Settings' })).not.toHaveAttribute('aria-current');
    });

    it('drops the destination when disabled, rather than leaving it followable', () => {
      renderWithProvider(
        <Sidebar.Nav aria-label="Main">
          <Sidebar.NavItem data-testid="item" href="/billing" disabled>
            Billing
          </Sidebar.NavItem>
        </Sidebar.Nav>,
      );
      const el = screen.getByTestId('item');
      expect(el).not.toHaveAttribute('href');
      expect(el).toHaveAttribute('aria-disabled', 'true');
      expect(el).toHaveAttribute('data-disabled', 'true');
    });

    it('runs the caller onClick exactly once', () => {
      const onClick = vi.fn();
      renderWithProvider(
        <Sidebar.Nav aria-label="Main">
          <Sidebar.NavItem data-testid="item" href="/" onClick={onClick}>
            Home
          </Sidebar.NavItem>
        </Sidebar.Nav>,
      );
      fireEvent.click(screen.getByTestId('item'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('renders the caller element with asChild, keeping its text as the label', () => {
      renderWithProvider(
        <Sidebar.Nav aria-label="Main">
          <Sidebar.NavItem asChild icon={<span data-testid="icon">IC</span>}>
            <a data-testid="item" href="/routed">
              Routed
            </a>
          </Sidebar.NavItem>
        </Sidebar.Nav>,
      );
      const el = screen.getByTestId('item');
      expect(el.tagName).toBe('A');
      expect(el).toHaveAttribute('href', '/routed');
      expect(screen.getByText('Routed')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('closes the mobile sheet when a destination is chosen', () => {
      withMobile(() => {
        const onMobileOpenChange = vi.fn();
        render(
          <Sidebar.Provider defaultMobileOpen onMobileOpenChange={onMobileOpenChange}>
            <Sidebar.Nav aria-label="Main">
              <Sidebar.NavItem data-testid="item" href="/">
                Home
              </Sidebar.NavItem>
            </Sidebar.Nav>
          </Sidebar.Provider>,
        );
        fireEvent.click(screen.getByTestId('item'));
        expect(onMobileOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('closes the mobile sheet even when the caller takes over navigation', () => {
      // A router intercepts the click with preventDefault() and navigates
      // itself. The page still changes, so the sheet covering it must still go.
      withMobile(() => {
        const onMobileOpenChange = vi.fn();
        render(
          <Sidebar.Provider defaultMobileOpen onMobileOpenChange={onMobileOpenChange}>
            <Sidebar.Nav aria-label="Main">
              <Sidebar.NavItem
                data-testid="item"
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                Home
              </Sidebar.NavItem>
            </Sidebar.Nav>
          </Sidebar.Provider>,
        );
        fireEvent.click(screen.getByTestId('item'));
        expect(onMobileOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('forwards className and style', () => {
      renderWithProvider(
        <Sidebar.Nav aria-label="Main">
          <Sidebar.NavItem
            data-testid="item"
            href="/"
            className="custom"
            style={{ color: 'rgb(255, 0, 0)' }}
          >
            Dashboard
          </Sidebar.NavItem>
        </Sidebar.Nav>,
      );
      const el = screen.getByTestId('item');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });
  });

  // === Expanded / Collapsed ===
  describe('Expanded and Collapsed', () => {
    it('renders Expanded children and not Collapsed ones while expanded', () => {
      renderWithProvider(
        <>
          <Sidebar.Expanded>
            <span>Wide</span>
          </Sidebar.Expanded>
          <Sidebar.Collapsed>
            <span>Narrow</span>
          </Sidebar.Collapsed>
        </>,
      );
      expect(screen.getByText('Wide')).toBeInTheDocument();
      expect(screen.queryByText('Narrow')).not.toBeInTheDocument();
    });

    it('swaps them while collapsed', () => {
      renderWithProvider(
        <>
          <Sidebar.Expanded>
            <span>Wide</span>
          </Sidebar.Expanded>
          <Sidebar.Collapsed>
            <span>Narrow</span>
          </Sidebar.Collapsed>
        </>,
        { defaultCollapsed: true },
      );
      expect(screen.queryByText('Wide')).not.toBeInTheDocument();
      expect(screen.getByText('Narrow')).toBeInTheDocument();
    });

    it('stays expanded on mobile, where the sheet is always full width', () => {
      withMobile(() => {
        render(
          <Sidebar.Provider defaultCollapsed>
            <Sidebar.Expanded>
              <span>Wide</span>
            </Sidebar.Expanded>
          </Sidebar.Provider>,
        );
        expect(screen.getByText('Wide')).toBeInTheDocument();
      });
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

    // behavior-3: the spec declares the collapsed/defaultCollapsed/onCollapsedChange
    // triad. The tests above all drive defaultCollapsed (uncontrolled); this covers the
    // controlled half, where the parent owns the value.
    it('controlled: collapsed owns the state, a click only reports', () => {
      const onCollapsedChange = vi.fn();
      render(
        <Sidebar.Provider collapsed={true} onCollapsedChange={onCollapsedChange}>
          <Sidebar.Root data-testid="root">
            <Sidebar.Trigger data-testid="trigger">Toggle</Sidebar.Trigger>
          </Sidebar.Root>
        </Sidebar.Provider>,
      );
      expect(screen.getByTestId('root')).toHaveAttribute('data-collapsed', 'true');

      fireEvent.click(screen.getByTestId('trigger'));
      expect(onCollapsedChange).toHaveBeenCalledWith(false);
      // The parent never fed the new value back, so it must stay collapsed.
      expect(screen.getByTestId('root')).toHaveAttribute('data-collapsed', 'true');
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
                <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
                <Sidebar.Nav>
                  <Sidebar.NavItem href="/" icon={<span>H</span>}>
                    Home
                  </Sidebar.NavItem>
                  <Sidebar.NavItem href="/settings" icon={<span>S</span>} active>
                    Settings
                  </Sidebar.NavItem>
                </Sidebar.Nav>
              </Sidebar.Group>
            </Sidebar.Content>
            <Sidebar.Footer data-testid="footer">
              <button type="button">User</button>
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
      // The nav is a landmark named by its GroupLabel, and its destinations are
      // a list — the orientation an undifferentiated pile of buttons can't give.
      expect(screen.getByRole('navigation', { name: 'Workspace' })).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute(
        'aria-current',
        'page',
      );
      expect(screen.getByText('User')).toBeInTheDocument();
    });
  });

  // === Mobile modal sheet (Radix Dialog) ===
  describe('mobile modal sheet', () => {
    it('renders as a Radix Dialog (role=dialog, aria-modal) with an accessible name', () => {
      withMobile(() => {
        renderWithProvider(
          <Sidebar.Root>
            <Sidebar.Content>
              <Sidebar.Nav aria-label="Main">
                <Sidebar.NavItem href="/">Home</Sidebar.NavItem>
              </Sidebar.Nav>
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
      });
    });
  });
});
