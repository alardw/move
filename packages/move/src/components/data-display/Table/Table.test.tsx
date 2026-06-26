import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Table } from './Table';
import { createRef } from 'react';

describe('Table', () => {
  // === Table Root ===
  describe('Table (Root)', () => {
    it('renders as a table element inside a scroll wrapper', () => {
      render(<Table data-testid="table"><tbody><tr><td>Cell</td></tr></tbody></Table>);
      const el = screen.getByTestId('table');
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe('TABLE');
      expect(el.parentElement?.tagName).toBe('DIV');
    });

    it('defaults to variant=lines and size=md', () => {
      render(<Table data-testid="table"><tbody><tr><td>Cell</td></tr></tbody></Table>);
      const el = screen.getByTestId('table');
      expect(el).toHaveAttribute('data-variant', 'lines');
      expect(el).toHaveAttribute('data-size', 'md');
    });

    it('applies data-variant for surface and bordered', () => {
      const { rerender } = render(<Table data-testid="table" variant="surface"><tbody><tr><td>Cell</td></tr></tbody></Table>);
      expect(screen.getByTestId('table')).toHaveAttribute('data-variant', 'surface');

      rerender(<Table data-testid="table" variant="bordered"><tbody><tr><td>Cell</td></tr></tbody></Table>);
      expect(screen.getByTestId('table')).toHaveAttribute('data-variant', 'bordered');
    });

    it('applies data-size attribute', () => {
      const { rerender } = render(<Table data-testid="table" size="sm"><tbody><tr><td>Cell</td></tr></tbody></Table>);
      expect(screen.getByTestId('table')).toHaveAttribute('data-size', 'sm');

      rerender(<Table data-testid="table" size="lg"><tbody><tr><td>Cell</td></tr></tbody></Table>);
      expect(screen.getByTestId('table')).toHaveAttribute('data-size', 'lg');
    });

    it('applies data-striped modifier attribute', () => {
      render(<Table data-testid="table" striped><tbody><tr><td>Cell</td></tr></tbody></Table>);
      expect(screen.getByTestId('table')).toHaveAttribute('data-striped');
    });

    it('applies data-hoverable when hoverable=true', () => {
      render(<Table data-testid="table" hoverable><tbody><tr><td>Cell</td></tr></tbody></Table>);
      expect(screen.getByTestId('table')).toHaveAttribute('data-hoverable');
    });

    it('applies data-sticky-header when stickyHeader=true', () => {
      render(<Table data-testid="table" stickyHeader><tbody><tr><td>Cell</td></tr></tbody></Table>);
      expect(screen.getByTestId('table')).toHaveAttribute('data-sticky-header');
    });

    it('renders a scroll wrapper with data-responsive', () => {
      const { container } = render(<Table><tbody><tr><td>Cell</td></tr></tbody></Table>);
      const wrapper = container.querySelector('[data-responsive]');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveAttribute('data-responsive', 'scroll');
    });

    it('forwards ref to the table element', () => {
      const ref = createRef<HTMLTableElement>();
      render(<Table ref={ref}><tbody><tr><td>Cell</td></tr></tbody></Table>);
      expect(ref.current).toBeInstanceOf(HTMLTableElement);
    });

    it('forwards className', () => {
      render(<Table data-testid="table" className="custom"><tbody><tr><td>Cell</td></tr></tbody></Table>);
      expect(screen.getByTestId('table').className).toContain('custom');
    });

    it('forwards style', () => {
      render(<Table data-testid="table" animations={false} style={{ marginTop: '10px' }}><tbody><tr><td>Cell</td></tr></tbody></Table>);
      expect(screen.getByTestId('table')).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes on the table', () => {
      render(<Table data-testid="my-table" aria-label="Users"><tbody><tr><td>Cell</td></tr></tbody></Table>);
      expect(screen.getByTestId('my-table')).toHaveAttribute('aria-label', 'Users');
    });
  });

  // === Table.Header ===
  describe('Table.Header', () => {
    it('renders as thead element', () => {
      render(
        <table><Table.Header data-testid="header"><tr><th>Col</th></tr></Table.Header></table>,
      );
      const el = screen.getByTestId('header');
      expect(el.tagName).toBe('THEAD');
    });

    it('forwards ref, className, style, and spreads attrs', () => {
      const ref = createRef<HTMLTableSectionElement>();
      render(
        <table>
          <Table.Header
            ref={ref}
            data-testid="header"
            className="custom"
            style={{ background: 'rgb(255, 0, 0)' }}
            aria-label="Header"
          >
            <tr><th>Col</th></tr>
          </Table.Header>
        </table>,
      );
      const el = screen.getByTestId('header');
      expect(ref.current).toBeInstanceOf(HTMLTableSectionElement);
      expect(el.className).toContain('custom');
      expect(el).toHaveStyle({ background: 'rgb(255, 0, 0)' });
      expect(el).toHaveAttribute('aria-label', 'Header');
    });
  });

  // === Table.Body ===
  describe('Table.Body', () => {
    it('renders as tbody element', () => {
      render(
        <table><Table.Body data-testid="body"><tr><td>Cell</td></tr></Table.Body></table>,
      );
      expect(screen.getByTestId('body').tagName).toBe('TBODY');
    });

    it('forwards ref', () => {
      const ref = createRef<HTMLTableSectionElement>();
      render(<table><Table.Body ref={ref}><tr><td>Cell</td></tr></Table.Body></table>);
      expect(ref.current).toBeInstanceOf(HTMLTableSectionElement);
    });
  });

  // === Table.Footer ===
  describe('Table.Footer', () => {
    it('renders as tfoot element', () => {
      render(
        <table><Table.Footer data-testid="footer"><tr><td>Footer</td></tr></Table.Footer></table>,
      );
      expect(screen.getByTestId('footer').tagName).toBe('TFOOT');
    });
  });

  // === Table.Row ===
  describe('Table.Row', () => {
    it('renders as tr element', () => {
      render(
        <table><tbody><Table.Row data-testid="row"><td>Cell</td></Table.Row></tbody></table>,
      );
      expect(screen.getByTestId('row').tagName).toBe('TR');
    });

    it('renders data-state="selected" when selected=true', () => {
      render(
        <table><tbody><Table.Row data-testid="row" selected><td>Cell</td></Table.Row></tbody></table>,
      );
      expect(screen.getByTestId('row')).toHaveAttribute('data-state', 'selected');
    });

    it('omits data-state when not selected', () => {
      render(
        <table><tbody><Table.Row data-testid="row"><td>Cell</td></Table.Row></tbody></table>,
      );
      expect(screen.getByTestId('row')).not.toHaveAttribute('data-state');
    });
  });

  // === Table.Head ===
  describe('Table.Head', () => {
    it('renders as th element', () => {
      render(
        <table><thead><tr><Table.Head data-testid="head">Col</Table.Head></tr></thead></table>,
      );
      expect(screen.getByTestId('head').tagName).toBe('TH');
    });

    it('renders sort icon and aria-sort when sortable/sorted', () => {
      const { rerender } = render(
        <table><thead><tr><Table.Head data-testid="head" sortable sorted="asc">Col</Table.Head></tr></thead></table>,
      );
      expect(screen.getByTestId('head')).toHaveAttribute('aria-sort', 'ascending');
      expect(screen.getByTestId('head').querySelector('[aria-hidden="true"]')).toBeInTheDocument();

      rerender(
        <table><thead><tr><Table.Head data-testid="head" sortable sorted="desc">Col</Table.Head></tr></thead></table>,
      );
      expect(screen.getByTestId('head')).toHaveAttribute('aria-sort', 'descending');
    });

    it('is focusable and has role=columnheader when sortable', () => {
      render(
        <table><thead><tr><Table.Head data-testid="head" sortable>Col</Table.Head></tr></thead></table>,
      );
      const el = screen.getByTestId('head');
      expect(el).toHaveAttribute('tabindex', '0');
      expect(el).toHaveAttribute('role', 'columnheader');
    });
  });

  describe('Table.Head keyboard', () => {
    it('triggers onSort on Enter, Space, and click', () => {
      const onSort = vi.fn();
      render(
        <table><thead><tr><Table.Head data-testid="head" sortable onSort={onSort}>Col</Table.Head></tr></thead></table>,
      );
      const el = screen.getByTestId('head');
      fireEvent.keyDown(el, { key: 'Enter' });
      fireEvent.keyDown(el, { key: ' ' });
      fireEvent.click(el);
      expect(onSort).toHaveBeenCalledTimes(3);
    });
  });

  // === Table.Cell ===
  describe('Table.Cell', () => {
    it('renders as td element', () => {
      render(
        <table><tbody><tr><Table.Cell data-testid="cell">Value</Table.Cell></tr></tbody></table>,
      );
      expect(screen.getByTestId('cell').tagName).toBe('TD');
    });
  });

  // === Table.Caption ===
  describe('Table.Caption', () => {
    it('renders as caption element', () => {
      render(
        <table><Table.Caption data-testid="caption">Description</Table.Caption><tbody><tr><td>Cell</td></tr></tbody></table>,
      );
      expect(screen.getByTestId('caption').tagName).toBe('CAPTION');
    });
  });

  // === Column-label inference (stack mode) ===
  describe('column label inference', () => {
    it('injects data-label onto body cells based on header text', async () => {
      render(
        <Table animations={false}>
          <Table.Header>
            <Table.Row>
              <Table.Head>Name</Table.Head>
              <Table.Head>Email</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell data-testid="c-name">Alice</Table.Cell>
              <Table.Cell data-testid="c-email">a@example.com</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      );

      // Header labels register in a useEffect, so allow the effect to flush.
      await Promise.resolve();
      expect(screen.getByTestId('c-name')).toHaveAttribute('data-label', 'Name');
      expect(screen.getByTestId('c-email')).toHaveAttribute('data-label', 'Email');
    });

    it('does not inject data-label onto footer cells', async () => {
      render(
        <Table animations={false}>
          <Table.Header>
            <Table.Row>
              <Table.Head>Name</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Footer>
            <Table.Row>
              <Table.Cell data-testid="foot">Total</Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table>,
      );
      await Promise.resolve();
      expect(screen.getByTestId('foot')).not.toHaveAttribute('data-label');
    });
  });

  // === Table.Group + GroupHeader ===
  describe('Table.Group', () => {
    it('renders as its own tbody with data-open', () => {
      render(
        <Table animations={false}>
          <Table.Group data-testid="group">
            <Table.GroupHeader>Group 1</Table.GroupHeader>
            <Table.Row><Table.Cell>A</Table.Cell></Table.Row>
          </Table.Group>
        </Table>,
      );
      const el = screen.getByTestId('group');
      expect(el.tagName).toBe('TBODY');
      expect(el).toHaveAttribute('data-open', 'true');
    });

    it('GroupHeader toggles the group on click and Enter/Space', () => {
      render(
        <Table animations={false}>
          <Table.Group data-testid="group">
            <Table.GroupHeader data-testid="gh">Group 1</Table.GroupHeader>
            <Table.Row><Table.Cell>A</Table.Cell></Table.Row>
          </Table.Group>
        </Table>,
      );
      const header = screen.getByTestId('gh');
      const group = screen.getByTestId('group');

      fireEvent.click(header);
      expect(group).toHaveAttribute('data-open', 'false');
      expect(header).toHaveAttribute('aria-expanded', 'false');

      fireEvent.keyDown(header, { key: 'Enter' });
      expect(group).toHaveAttribute('data-open', 'true');
      expect(header).toHaveAttribute('aria-expanded', 'true');

      fireEvent.keyDown(header, { key: ' ' });
      expect(group).toHaveAttribute('data-open', 'false');
    });

    it('fires onOpenChange when controlled', () => {
      const onOpenChange = vi.fn();
      render(
        <Table animations={false}>
          <Table.Group open={true} onOpenChange={onOpenChange}>
            <Table.GroupHeader data-testid="gh">Group 1</Table.GroupHeader>
            <Table.Row><Table.Cell>A</Table.Cell></Table.Row>
          </Table.Group>
        </Table>,
      );
      fireEvent.click(screen.getByTestId('gh'));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  // === Composition ===
  describe('composition', () => {
    it('renders full table composition', () => {
      render(
        <Table data-testid="table" animations={false}>
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
        </Table>,
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

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(
        <Table data-testid="table" sp={{ root: { className: 'sp-root' } }}>
          <tbody><tr><td>Cell</td></tr></tbody>
        </Table>,
      );
      expect(screen.getByTestId('table').className).toContain('sp-root');
    });
  });
});
