// Generated from Breadcrumb.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { Breadcrumb } from './Breadcrumb';

describe('Breadcrumb', () => {
  // === Breadcrumb Root ===
  describe('Root', () => {
    it('renders as nav element with aria-label="Breadcrumb"', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
      expect(nav).toBeInTheDocument();
      expect(nav.tagName).toBe('NAV');
    });

    it('renders list as ol element', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
      const ol = nav.querySelector('ol');
      expect(ol).toBeInTheDocument();
    });

    it('defaults to size=md', () => {
      render(
        <Breadcrumb data-testid="bc">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      expect(screen.getByTestId('bc')).toHaveAttribute('data-size', 'md');
    });

    it('applies data-size attribute', () => {
      const { rerender } = render(
        <Breadcrumb data-testid="bc" size="sm">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      expect(screen.getByTestId('bc')).toHaveAttribute('data-size', 'sm');

      rerender(
        <Breadcrumb data-testid="bc" size="lg">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      expect(screen.getByTestId('bc')).toHaveAttribute('data-size', 'lg');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLElement>();
      render(
        <Breadcrumb ref={ref}>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe('NAV');
    });

    it('forwards className', () => {
      render(
        <Breadcrumb data-testid="bc" className="custom">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      expect(screen.getByTestId('bc').className).toContain('custom');
    });

    it('forwards style', () => {
      render(
        <Breadcrumb data-testid="bc" style={{ marginTop: '10px' }}>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      expect(screen.getByTestId('bc')).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <Breadcrumb data-testid="bc" id="my-bc">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      expect(screen.getByTestId('bc')).toHaveAttribute('id', 'my-bc');
    });

    it('auto-injects separators between Item children', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/about">About</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Current</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
      const separators = nav.querySelectorAll('li[aria-hidden="true"]');
      // 3 items = 2 separators
      expect(separators.length).toBe(2);
    });

    it('collapses items with Ellipsis when maxItems is exceeded', () => {
      render(
        <Breadcrumb maxItems={3} itemsBeforeCollapse={1} itemsAfterCollapse={1}>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/a">A</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/b">B</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/c">C</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>D</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      // Should show A, ellipsis, D
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('D')).toBeInTheDocument();
      expect(screen.getByText('\u2026')).toBeInTheDocument();
      // B and C should not be visible
      expect(screen.queryByText('B')).not.toBeInTheDocument();
      expect(screen.queryByText('C')).not.toBeInTheDocument();
    });

    it('defaults to itemsBeforeCollapse=1 and itemsAfterCollapse=1', () => {
      render(
        <Breadcrumb maxItems={2}>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/a">First</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/b">Second</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Third</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      // Default: 1 before, ellipsis, 1 after
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
      expect(screen.getByText('\u2026')).toBeInTheDocument();
      expect(screen.queryByText('Second')).not.toBeInTheDocument();
    });

    it('uses custom separator prop', () => {
      render(
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Current</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
      const separators = nav.querySelectorAll('li[aria-hidden="true"]');
      expect(separators.length).toBe(1);
      expect(separators[0].textContent).toBe('/');
    });

    it('merges sp className on root', () => {
      render(
        <Breadcrumb data-testid="bc" sp={{ root: { className: 'sp-root' } }}>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      expect(screen.getByTestId('bc').className).toContain('sp-root');
    });

    it('merges sp style on root', () => {
      render(
        <Breadcrumb data-testid="bc" sp={{ root: { style: { marginTop: '5px' } } }}>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      expect(screen.getByTestId('bc')).toHaveStyle({ marginTop: '5px' });
    });
  });

  // === Breadcrumb.Item ===
  describe('Item', () => {
    it('renders as li element', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item data-testid="item">
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      const item = screen.getByTestId('item');
      expect(item).toBeInTheDocument();
      expect(item.tagName).toBe('LI');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLLIElement>();
      render(
        <Breadcrumb>
          <Breadcrumb.Item ref={ref}>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      expect(ref.current).toBeInstanceOf(HTMLLIElement);
    });

    it('forwards className and style', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item data-testid="item" className="custom" style={{ padding: '4px' }}>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      const item = screen.getByTestId('item');
      expect(item.className).toContain('custom');
      expect(item).toHaveStyle({ padding: '4px' });
    });
  });

  // === Breadcrumb.Link ===
  describe('Link', () => {
    it('renders as anchor element by default', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link data-testid="link" href="/home">
              Home
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      const link = screen.getByTestId('link');
      expect(link.tagName).toBe('A');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLAnchorElement>();
      render(
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link ref={ref} href="/home">
              Home
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    });

    it('forwards className and style', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link
              data-testid="link"
              className="custom"
              style={{ color: 'rgb(255, 0, 0)' }}
              href="/"
            >
              Home
            </Breadcrumb.Link>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      const link = screen.getByTestId('link');
      expect(link.className).toContain('custom');
      expect(link).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });
  });

  // === Breadcrumb.Page ===
  describe('Page', () => {
    it('renders as span with aria-current="page"', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Page data-testid="page">Current</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      const page = screen.getByTestId('page');
      expect(page.tagName).toBe('SPAN');
      expect(page).toHaveAttribute('aria-current', 'page');
    });

    it('renders aria-disabled="true"', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Page data-testid="page">Current</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      expect(screen.getByTestId('page')).toHaveAttribute('aria-disabled', 'true');
    });

    it('renders role="link"', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Page data-testid="page">Current</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      expect(screen.getByTestId('page')).toHaveAttribute('role', 'link');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLSpanElement>();
      render(
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Page ref={ref}>Current</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it('forwards className and style', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Page data-testid="page" className="custom" style={{ fontWeight: 'bold' }}>
              Current
            </Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      const page = screen.getByTestId('page');
      expect(page.className).toContain('custom');
      expect(page).toHaveStyle({ fontWeight: 'bold' });
    });
  });

  // === Breadcrumb.Separator ===
  describe('Separator', () => {
    it('renders separators as aria-hidden li', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Current</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
      const sep = nav.querySelector('li[aria-hidden="true"]');
      expect(sep).toBeInTheDocument();
      expect(sep?.tagName).toBe('LI');
    });

    it('uses context separator when no children provided', () => {
      render(
        <Breadcrumb separator="/">
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Current</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
      const sep = nav.querySelector('li[aria-hidden="true"]');
      expect(sep?.textContent).toBe('/');
    });
  });

  // === Breadcrumb.Ellipsis ===
  describe('Ellipsis', () => {
    it('renders horizontal ellipsis character by default', () => {
      render(
        <Breadcrumb maxItems={2}>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/a">A</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/b">B</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>C</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      expect(screen.getByText('\u2026')).toBeInTheDocument();
    });

    it('is aria-hidden (decorative)', () => {
      render(
        <Breadcrumb maxItems={2}>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/a">A</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/b">B</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>C</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );
      const ellipsis = screen.getByText('\u2026');
      expect(ellipsis).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // === Composition ===
  describe('composition', () => {
    it('renders full breadcrumb composition', () => {
      render(
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Current Page</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>,
      );

      expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Docs')).toBeInTheDocument();
      expect(screen.getByText('Current Page')).toBeInTheDocument();
    });
  });
});
