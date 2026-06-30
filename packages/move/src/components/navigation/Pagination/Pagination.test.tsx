// Generated from Pagination.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  // === Pagination.Root ===
  describe('Root', () => {
    it('renders as nav with aria-label="Pagination"', () => {
      render(
        <Pagination.Root total={10}>
          <Pagination.Items />
        </Pagination.Root>,
      );
      const nav = screen.getByRole('navigation', { name: 'Pagination' });
      expect(nav).toBeInTheDocument();
      expect(nav.tagName).toBe('NAV');
    });

    it('defaults to size=md and variant=default', () => {
      render(
        <Pagination.Root total={10} data-testid="pg">
          <Pagination.Items />
        </Pagination.Root>,
      );
      const nav = screen.getByTestId('pg');
      expect(nav).toHaveAttribute('data-size', 'md');
      expect(nav).toHaveAttribute('data-variant', 'default');
    });

    it('applies data-size and data-variant attributes', () => {
      render(
        <Pagination.Root total={10} size="lg" variant="outline" data-testid="pg">
          <Pagination.Items />
        </Pagination.Root>,
      );
      const nav = screen.getByTestId('pg');
      expect(nav).toHaveAttribute('data-size', 'lg');
      expect(nav).toHaveAttribute('data-variant', 'outline');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLElement>();
      render(
        <Pagination.Root total={10} ref={ref}>
          <Pagination.Items />
        </Pagination.Root>,
      );
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe('NAV');
    });

    it('forwards className', () => {
      render(
        <Pagination.Root total={10} data-testid="pg" className="custom">
          <Pagination.Items />
        </Pagination.Root>,
      );
      expect(screen.getByTestId('pg').className).toContain('custom');
    });

    it('forwards style', () => {
      render(
        <Pagination.Root total={10} data-testid="pg" style={{ marginTop: '10px' }}>
          <Pagination.Items />
        </Pagination.Root>,
      );
      expect(screen.getByTestId('pg')).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <Pagination.Root total={10} data-testid="pg" id="my-pagination">
          <Pagination.Items />
        </Pagination.Root>,
      );
      expect(screen.getByTestId('pg')).toHaveAttribute('id', 'my-pagination');
    });
  });

  // === Pagination.Items ===
  describe('Items', () => {
    it('renders correct page range based on total', () => {
      render(
        <Pagination.Root total={5} defaultPage={1}>
          <Pagination.Items />
        </Pagination.Root>,
      );
      // With total=5, all pages should be shown
      for (let i = 1; i <= 5; i++) {
        expect(screen.getByRole('button', { name: `Go to page ${i}` })).toBeInTheDocument();
      }
    });

    it('renders ellipsis for collapsed page ranges', () => {
      render(
        <Pagination.Root total={20} defaultPage={10}>
          <Pagination.Items />
        </Pagination.Root>,
      );
      // With total=20 and page=10, there should be dots
      const nav = screen.getByRole('navigation', { name: 'Pagination' });
      const hiddenLis = nav.querySelectorAll('li[aria-hidden="true"]');
      expect(hiddenLis.length).toBeGreaterThan(0);
    });

    it('active page button has data-state="active" and aria-current="page"', () => {
      render(
        <Pagination.Root total={5} defaultPage={3}>
          <Pagination.Items />
        </Pagination.Root>,
      );
      const activeBtn = screen.getByRole('button', { name: 'Go to page 3' });
      expect(activeBtn).toHaveAttribute('data-state', 'active');
      expect(activeBtn).toHaveAttribute('aria-current', 'page');
    });

    it('page buttons have aria-label="Go to page {n}"', () => {
      render(
        <Pagination.Root total={3} defaultPage={1}>
          <Pagination.Items />
        </Pagination.Root>,
      );
      expect(screen.getByRole('button', { name: 'Go to page 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Go to page 2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Go to page 3' })).toBeInTheDocument();
    });

    it('clicking a page button calls onChange with that page number', () => {
      const onChange = vi.fn();
      render(
        <Pagination.Root total={5} defaultPage={1} onChange={onChange}>
          <Pagination.Items />
        </Pagination.Root>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Go to page 3' }));
      expect(onChange).toHaveBeenCalledWith(3);
    });

    it('indicator has aria-hidden="true"', () => {
      render(
        <Pagination.Root total={5} defaultPage={1}>
          <Pagination.Items />
        </Pagination.Root>,
      );
      const nav = screen.getByRole('navigation', { name: 'Pagination' });
      const indicator = nav.querySelector('[aria-hidden="true"]:not(li):not(svg)');
      expect(indicator).toBeInTheDocument();
    });
  });

  // === Pagination.PrevTrigger ===
  describe('PrevTrigger', () => {
    it('has aria-label="Go to previous page"', () => {
      render(
        <Pagination.Root total={5} defaultPage={3}>
          <Pagination.PrevTrigger />
          <Pagination.Items />
        </Pagination.Root>,
      );
      expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeInTheDocument();
    });

    it('is disabled when on page 1', () => {
      render(
        <Pagination.Root total={5} defaultPage={1}>
          <Pagination.PrevTrigger />
          <Pagination.Items />
        </Pagination.Root>,
      );
      expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeDisabled();
    });

    it('is not disabled when not on page 1', () => {
      render(
        <Pagination.Root total={5} defaultPage={3}>
          <Pagination.PrevTrigger />
          <Pagination.Items />
        </Pagination.Root>,
      );
      expect(screen.getByRole('button', { name: 'Go to previous page' })).not.toBeDisabled();
    });

    it('calls previous navigation when clicked', () => {
      const onChange = vi.fn();
      render(
        <Pagination.Root total={5} defaultPage={3} onChange={onChange}>
          <Pagination.PrevTrigger />
          <Pagination.Items />
        </Pagination.Root>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Go to previous page' }));
      expect(onChange).toHaveBeenCalledWith(2);
    });

    it('renders default left chevron SVG', () => {
      render(
        <Pagination.Root total={5} defaultPage={3}>
          <Pagination.PrevTrigger />
          <Pagination.Items />
        </Pagination.Root>,
      );
      const btn = screen.getByRole('button', { name: 'Go to previous page' });
      const svg = btn.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <Pagination.Root total={5} defaultPage={3}>
          <Pagination.PrevTrigger ref={ref} />
          <Pagination.Items />
        </Pagination.Root>,
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('forwards className and style', () => {
      render(
        <Pagination.Root total={5} defaultPage={3}>
          <Pagination.PrevTrigger
            data-testid="prev"
            className="custom"
            style={{ padding: '4px' }}
          />
          <Pagination.Items />
        </Pagination.Root>,
      );
      const el = screen.getByTestId('prev');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ padding: '4px' });
    });
  });

  // === Pagination.NextTrigger ===
  describe('NextTrigger', () => {
    it('has aria-label="Go to next page"', () => {
      render(
        <Pagination.Root total={5} defaultPage={3}>
          <Pagination.Items />
          <Pagination.NextTrigger />
        </Pagination.Root>,
      );
      expect(screen.getByRole('button', { name: 'Go to next page' })).toBeInTheDocument();
    });

    it('is disabled when on last page', () => {
      render(
        <Pagination.Root total={5} defaultPage={5}>
          <Pagination.Items />
          <Pagination.NextTrigger />
        </Pagination.Root>,
      );
      expect(screen.getByRole('button', { name: 'Go to next page' })).toBeDisabled();
    });

    it('is not disabled when not on last page', () => {
      render(
        <Pagination.Root total={5} defaultPage={3}>
          <Pagination.Items />
          <Pagination.NextTrigger />
        </Pagination.Root>,
      );
      expect(screen.getByRole('button', { name: 'Go to next page' })).not.toBeDisabled();
    });

    it('calls next navigation when clicked', () => {
      const onChange = vi.fn();
      render(
        <Pagination.Root total={5} defaultPage={3} onChange={onChange}>
          <Pagination.Items />
          <Pagination.NextTrigger />
        </Pagination.Root>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Go to next page' }));
      expect(onChange).toHaveBeenCalledWith(4);
    });

    it('renders default right chevron SVG', () => {
      render(
        <Pagination.Root total={5} defaultPage={3}>
          <Pagination.Items />
          <Pagination.NextTrigger />
        </Pagination.Root>,
      );
      const btn = screen.getByRole('button', { name: 'Go to next page' });
      const svg = btn.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLButtonElement>();
      render(
        <Pagination.Root total={5} defaultPage={3}>
          <Pagination.Items />
          <Pagination.NextTrigger ref={ref} />
        </Pagination.Root>,
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('forwards className and style', () => {
      render(
        <Pagination.Root total={5} defaultPage={3}>
          <Pagination.Items />
          <Pagination.NextTrigger
            data-testid="next"
            className="custom"
            style={{ padding: '4px' }}
          />
        </Pagination.Root>,
      );
      const el = screen.getByTestId('next');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ padding: '4px' });
    });
  });

  // === Controlled mode ===
  describe('controlled mode', () => {
    it('supports controlled mode via page prop', () => {
      const { rerender } = render(
        <Pagination.Root total={5} page={2}>
          <Pagination.Items />
        </Pagination.Root>,
      );
      expect(screen.getByRole('button', { name: 'Go to page 2' })).toHaveAttribute(
        'data-state',
        'active',
      );

      rerender(
        <Pagination.Root total={5} page={4}>
          <Pagination.Items />
        </Pagination.Root>,
      );
      expect(screen.getByRole('button', { name: 'Go to page 4' })).toHaveAttribute(
        'data-state',
        'active',
      );
    });
  });

  // === Labels ===
  describe('labels', () => {
    it('overrides nav, prev, next, and page aria-labels via labels prop', () => {
      render(
        <Pagination.Root
          total={5}
          defaultPage={3}
          labels={{
            label: 'Pages',
            previous: 'Previous',
            next: 'Next',
            page: 'Page {page}',
          }}
        >
          <Pagination.PrevTrigger />
          <Pagination.Items />
          <Pagination.NextTrigger />
        </Pagination.Root>,
      );
      expect(screen.getByRole('navigation', { name: 'Pages' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Page 3' })).toBeInTheDocument();
    });
  });

  // === Composition ===
  describe('composition', () => {
    it('renders full pagination composition', () => {
      render(
        <Pagination.Root total={10} defaultPage={1}>
          <Pagination.PrevTrigger />
          <Pagination.Items />
          <Pagination.NextTrigger />
        </Pagination.Root>,
      );

      expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Go to next page' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Go to page 1' })).toBeInTheDocument();
    });
  });
});
