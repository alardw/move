// Generated from Table.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Table } from './Table';
import { createRef } from 'react';

describe('Table', () => {
  // === Table Root ===
  describe('Table (Root)', () => {
    it('renders as a table element', () => {
      render(<Table data-testid="table"><tbody><tr><td>Cell</td></tr></tbody></Table>);
      const el = screen.getByTestId('table');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('TABLE');
    });

    it('defaults to variant=default and size=md', () => {
      render(<Table data-testid="table"><tbody><tr><td>Cell</td></tr></tbody></Table>);
      const el = screen.getByTestId('table');
      expect(el).toHaveAttribute('data-variant', 'default');
      expect(el).toHaveAttribute('data-size', 'md');
    });

    it('applies data-variant attribute', () => {
      render(<Table data-testid="table" variant="striped"><tbody><tr><td>Cell</td></tr></tbody></Table>);
      expect(screen.getByTestId('table')).toHaveAttribute('data-variant', 'striped');
    });

    it('applies data-size attribute', () => {
      const { rerender } = render(<Table data-testid="table" size="sm"><tbody><tr><td>Cell</td></tr></tbody></Table>);
      expect(screen.getByTestId('table')).toHaveAttribute('data-size', 'sm');

      rerender(<Table data-testid="table" size="lg"><tbody><tr><td>Cell</td></tr></tbody></Table>);
      expect(screen.getByTestId('table')).toHaveAttribute('data-size', 'lg');
    });

    it('applies data-bordered boolean attribute when bordered=true', () => {
      render(<Table data-testid="table" bordered><tbody><tr><td>Cell</td></tr></tbody></Table>);
      expect(screen.getByTestId('table')).toHaveAttribute('data-bordered');
    });

    it('applies data-hoverable boolean attribute when hoverable=true', () => {
      render(<Table data-testid="table" hoverable><tbody><tr><td>Cell</td></tr></tbody></Table>);
      expect(screen.getByTestId('table')).toHaveAttribute('data-hoverable');
    });

    it('applies data-sticky-header boolean attribute when stickyHeader=true', () => {
      render(<Table data-testid="table" stickyHeader><tbody><tr><td>Cell</td></tr></tbody></Table>);
      expect(screen.getByTestId('table')).toHaveAttribute('data-sticky-header');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLTableElement>();
      render(<Table ref={ref}><tbody><tr><td>Cell</td></tr></tbody></Table>);
      expect(ref.current).toBeInstanceOf(HTMLTableElement);
    });

    it('forwards className', () => {
      render(<Table data-testid="table" className="custom"><tbody><tr><td>Cell</td></tr></tbody></Table>);
      expect(screen.getByTestId('table').className).toContain('custom');
    });

    it('forwards style', () => {
      render(<Table data-testid="table" animate={false} style={{ marginTop: '10px' }}><tbody><tr><td>Cell</td></tr></tbody></Table>);
      expect(screen.getByTestId('table')).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(<Table data-testid="my-table" aria-label="Users"><tbody><tr><td>Cell</td></tr></tbody></Table>);
      expect(screen.getByTestId('my-table')).toHaveAttribute('aria-label', 'Users');
    });
  });

  // === Table.Header ===
  describe('Table.Header', () => {
    it('renders as thead element', () => {
      const { container } = render(
        <table><Table.Header data-testid="header"><tr><th>Col</th></tr></Table.Header></table>
      );
      const el = screen.getByTestId('header');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('THEAD');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLTableSectionElement>();
      render(<table><Table.Header ref={ref}><tr><th>Col</th></tr></Table.Header></table>);
      expect(ref.current).toBeInstanceOf(HTMLTableSectionElement);
    });

    it('forwards className and style', () => {
      render(
        <table><Table.Header data-testid="header" className="custom" style={{ background: 'rgb(255, 0, 0)' }}><tr><th>Col</th></tr></Table.Header></table>
      );
      const el = screen.getByTestId('header');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ background: 'rgb(255, 0, 0)' });
    });

    it('spreads HTML attributes', () => {
      render(
        <table><Table.Header data-testid="header" aria-label="Header"><tr><th>Col</th></tr></Table.Header></table>
      );
      expect(screen.getByTestId('header')).toHaveAttribute('aria-label', 'Header');
    });
  });

  // === Table.Body ===
  describe('Table.Body', () => {
    it('renders as tbody element', () => {
      render(
        <table><Table.Body data-testid="body"><tr><td>Cell</td></tr></Table.Body></table>
      );
      const el = screen.getByTestId('body');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('TBODY');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLTableSectionElement>();
      render(<table><Table.Body ref={ref}><tr><td>Cell</td></tr></Table.Body></table>);
      expect(ref.current).toBeInstanceOf(HTMLTableSectionElement);
    });

    it('forwards className and style', () => {
      render(
        <table><Table.Body data-testid="body" className="custom" style={{ padding: '8px' }}><tr><td>Cell</td></tr></Table.Body></table>
      );
      const el = screen.getByTestId('body');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ padding: '8px' });
    });
  });

  // === Table.Footer ===
  describe('Table.Footer', () => {
    it('renders as tfoot element', () => {
      render(
        <table><Table.Footer data-testid="footer"><tr><td>Footer</td></tr></Table.Footer></table>
      );
      const el = screen.getByTestId('footer');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('TFOOT');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLTableSectionElement>();
      render(<table><Table.Footer ref={ref}><tr><td>Footer</td></tr></Table.Footer></table>);
      expect(ref.current).toBeInstanceOf(HTMLTableSectionElement);
    });

    it('forwards className and style', () => {
      render(
        <table><Table.Footer data-testid="footer" className="custom" style={{ fontWeight: 'bold' }}><tr><td>Footer</td></tr></Table.Footer></table>
      );
      const el = screen.getByTestId('footer');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ fontWeight: 'bold' });
    });
  });

  // === Table.Row ===
  describe('Table.Row', () => {
    it('renders as tr element', () => {
      render(
        <table><tbody><Table.Row data-testid="row"><td>Cell</td></Table.Row></tbody></table>
      );
      const el = screen.getByTestId('row');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('TR');
    });

    it('renders data-state="selected" when selected=true', () => {
      render(
        <table><tbody><Table.Row data-testid="row" selected><td>Cell</td></Table.Row></tbody></table>
      );
      expect(screen.getByTestId('row')).toHaveAttribute('data-state', 'selected');
    });

    it('omits data-state when not selected', () => {
      render(
        <table><tbody><Table.Row data-testid="row"><td>Cell</td></Table.Row></tbody></table>
      );
      expect(screen.getByTestId('row')).not.toHaveAttribute('data-state');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLTableRowElement>();
      render(<table><tbody><Table.Row ref={ref}><td>Cell</td></Table.Row></tbody></table>);
      expect(ref.current).toBeInstanceOf(HTMLTableRowElement);
    });

    it('forwards className and style', () => {
      render(
        <table><tbody><Table.Row data-testid="row" className="custom" style={{ color: 'rgb(255, 0, 0)' }}><td>Cell</td></Table.Row></tbody></table>
      );
      const el = screen.getByTestId('row');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });

    it('spreads HTML attributes', () => {
      render(
        <table><tbody><Table.Row data-testid="row" aria-label="Row"><td>Cell</td></Table.Row></tbody></table>
      );
      expect(screen.getByTestId('row')).toHaveAttribute('aria-label', 'Row');
    });
  });

  // === Table.Head ===
  describe('Table.Head', () => {
    it('renders as th element', () => {
      render(
        <table><thead><tr><Table.Head data-testid="head">Col</Table.Head></tr></thead></table>
      );
      const el = screen.getByTestId('head');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('TH');
    });

    it('renders sort icon when sortable=true', () => {
      render(
        <table><thead><tr><Table.Head data-testid="head" sortable>Col</Table.Head></tr></thead></table>
      );
      const el = screen.getByTestId('head');
      const sortIcon = el.querySelector('[aria-hidden="true"]');
      expect(sortIcon).toBeInTheDocument();
    });

    it('renders aria-sort="ascending" when sorted="asc"', () => {
      render(
        <table><thead><tr><Table.Head data-testid="head" sortable sorted="asc">Col</Table.Head></tr></thead></table>
      );
      expect(screen.getByTestId('head')).toHaveAttribute('aria-sort', 'ascending');
    });

    it('renders aria-sort="descending" when sorted="desc"', () => {
      render(
        <table><thead><tr><Table.Head data-testid="head" sortable sorted="desc">Col</Table.Head></tr></thead></table>
      );
      expect(screen.getByTestId('head')).toHaveAttribute('aria-sort', 'descending');
    });

    it('omits aria-sort when not sorted', () => {
      render(
        <table><thead><tr><Table.Head data-testid="head" sortable>Col</Table.Head></tr></thead></table>
      );
      expect(screen.getByTestId('head')).not.toHaveAttribute('aria-sort');
    });

    it('is focusable (tabIndex=0) when sortable', () => {
      render(
        <table><thead><tr><Table.Head data-testid="head" sortable>Col</Table.Head></tr></thead></table>
      );
      expect(screen.getByTestId('head')).toHaveAttribute('tabindex', '0');
    });

    it('gets role="columnheader" when sortable', () => {
      render(
        <table><thead><tr><Table.Head data-testid="head" sortable>Col</Table.Head></tr></thead></table>
      );
      expect(screen.getByTestId('head')).toHaveAttribute('role', 'columnheader');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLTableCellElement>();
      render(<table><thead><tr><Table.Head ref={ref}>Col</Table.Head></tr></thead></table>);
      expect(ref.current).toBeInstanceOf(HTMLTableCellElement);
    });

    it('forwards className and style', () => {
      render(
        <table><thead><tr><Table.Head data-testid="head" className="custom" style={{ width: '100px' }}>Col</Table.Head></tr></thead></table>
      );
      const el = screen.getByTestId('head');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ width: '100px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <table><thead><tr><Table.Head data-testid="head" id="col-name">Col</Table.Head></tr></thead></table>
      );
      expect(screen.getByTestId('head')).toHaveAttribute('id', 'col-name');
    });
  });

  // === Table.Head keyboard ===
  describe('Table.Head keyboard', () => {
    it('triggers onSort on Enter key', () => {
      const onSort = vi.fn();
      render(
        <table><thead><tr><Table.Head data-testid="head" sortable onSort={onSort}>Col</Table.Head></tr></thead></table>
      );
      fireEvent.keyDown(screen.getByTestId('head'), { key: 'Enter' });
      expect(onSort).toHaveBeenCalledTimes(1);
    });

    it('triggers onSort on Space key', () => {
      const onSort = vi.fn();
      render(
        <table><thead><tr><Table.Head data-testid="head" sortable onSort={onSort}>Col</Table.Head></tr></thead></table>
      );
      fireEvent.keyDown(screen.getByTestId('head'), { key: ' ' });
      expect(onSort).toHaveBeenCalledTimes(1);
    });

    it('triggers onSort on click', () => {
      const onSort = vi.fn();
      render(
        <table><thead><tr><Table.Head data-testid="head" sortable onSort={onSort}>Col</Table.Head></tr></thead></table>
      );
      fireEvent.click(screen.getByTestId('head'));
      expect(onSort).toHaveBeenCalledTimes(1);
    });
  });

  // === Table.Cell ===
  describe('Table.Cell', () => {
    it('renders as td element', () => {
      render(
        <table><tbody><tr><Table.Cell data-testid="cell">Value</Table.Cell></tr></tbody></table>
      );
      const el = screen.getByTestId('cell');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('TD');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLTableCellElement>();
      render(<table><tbody><tr><Table.Cell ref={ref}>Value</Table.Cell></tr></tbody></table>);
      expect(ref.current).toBeInstanceOf(HTMLTableCellElement);
    });

    it('forwards className and style', () => {
      render(
        <table><tbody><tr><Table.Cell data-testid="cell" className="custom" style={{ textAlign: 'right' }}>Value</Table.Cell></tr></tbody></table>
      );
      const el = screen.getByTestId('cell');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ textAlign: 'right' });
    });

    it('spreads HTML attributes', () => {
      render(
        <table><tbody><tr><Table.Cell data-testid="cell" colSpan={2}>Value</Table.Cell></tr></tbody></table>
      );
      expect(screen.getByTestId('cell')).toHaveAttribute('colspan', '2');
    });
  });

  // === Table.Caption ===
  describe('Table.Caption', () => {
    it('renders as caption element', () => {
      render(
        <table><Table.Caption data-testid="caption">Description</Table.Caption><tbody><tr><td>Cell</td></tr></tbody></table>
      );
      const el = screen.getByTestId('caption');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('CAPTION');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLTableCaptionElement>();
      render(<table><Table.Caption ref={ref}>Description</Table.Caption><tbody><tr><td>Cell</td></tr></tbody></table>);
      expect(ref.current).toBeInstanceOf(HTMLTableCaptionElement);
    });

    it('forwards className and style', () => {
      render(
        <table><Table.Caption data-testid="caption" className="custom" style={{ fontSize: '12px' }}>Description</Table.Caption><tbody><tr><td>Cell</td></tr></tbody></table>
      );
      const el = screen.getByTestId('caption');
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ fontSize: '12px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <table><Table.Caption data-testid="caption" id="table-caption">Description</Table.Caption><tbody><tr><td>Cell</td></tr></tbody></table>
      );
      expect(screen.getByTestId('caption')).toHaveAttribute('id', 'table-caption');
    });
  });

  // === Composition ===
  describe('composition', () => {
    it('renders full table composition', () => {
      render(
        <Table data-testid="table" animate={false}>
          <Table.Caption data-testid="caption">Users</Table.Caption>
          <Table.Header data-testid="header">
            <Table.Row>
              <Table.Head>Name</Table.Head>
              <Table.Head>Email</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body data-testid="body">
            <Table.Row data-testid="row">
              <Table.Cell>Alice</Table.Cell>
              <Table.Cell>alice@example.com</Table.Cell>
            </Table.Row>
          </Table.Body>
          <Table.Footer data-testid="footer">
            <Table.Row>
              <Table.Cell colSpan={2}>Total: 1</Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table>
      );

      expect(screen.getByTestId('table')).toBeInTheDocument();
      expect(screen.getByTestId('caption')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('body')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByTestId('row')).toBeInTheDocument();
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('alice@example.com')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
    });
  });

  // === Animation ===
  describe('animation', () => {
    it('accepts animate=false on Root to disable animation', () => {
      render(
        <Table data-testid="table" animate={false}>
          <Table.Body>
            <Table.Row data-testid="row"><Table.Cell>Cell</Table.Cell></Table.Row>
          </Table.Body>
        </Table>
      );
      expect(screen.getByTestId('table')).toBeInTheDocument();
      expect(screen.getByTestId('row')).toBeInTheDocument();
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(
        <Table data-testid="table" sp={{ root: { className: 'sp-root' } }}>
          <tbody><tr><td>Cell</td></tr></tbody>
        </Table>
      );
      expect(screen.getByTestId('table').className).toContain('sp-root');
    });

    it('merges sp style on root', () => {
      render(
        <Table data-testid="table" animate={false} sp={{ root: { style: { marginTop: '5px' } } }}>
          <tbody><tr><td>Cell</td></tr></tbody>
        </Table>
      );
      expect(screen.getByTestId('table')).toHaveStyle({ marginTop: '5px' });
    });
  });
});
