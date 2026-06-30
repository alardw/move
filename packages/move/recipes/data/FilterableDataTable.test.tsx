// Generated from FilterableDataTable.spec.ts (schemaVersion: 1)
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MoveRoot } from 'move';
import FilterableDataTable from './FilterableDataTable';

const renderRecipe = (props = {}) =>
  render(
    <MoveRoot>
      <FilterableDataTable {...props} />
    </MoveRoot>,
  );

describe('FilterableDataTable (recipe)', () => {
  it('renders the table with the default columns and rows', () => {
    renderRecipe();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Name/ })).toBeInTheDocument();
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
  });

  it('i18n: default labels show and a labels override replaces them', () => {
    const { unmount } = renderRecipe();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    unmount();

    renderRecipe({ labels: { searchPlaceholder: 'CUSTOM TEXT' } });
    expect(screen.getByPlaceholderText('CUSTOM TEXT')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
  });

  it('search filters rows live by name', async () => {
    const user = userEvent.setup();
    renderRecipe();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Search...'), 'Alice');
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.queryByText('Bob Smith')).not.toBeInTheDocument();
  });

  it('search filters rows live by email', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.type(screen.getByLabelText('Search...'), 'bob@example.com');
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument();
  });

  it('columns are sortable: first click sorts the column ascending', async () => {
    const user = userEvent.setup();
    renderRecipe();
    const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
    expect(nameHeader).not.toHaveAttribute('aria-sort', 'ascending');

    await user.click(nameHeader);
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

    // Sorting by role reorders the visible rows (Designers sort before Engineers).
    const roleHeader = screen.getByRole('columnheader', { name: /Role/ });
    await user.click(roleHeader);
    const rows = within(screen.getByRole('table')).getAllByRole('row');
    // rows[0] is the header row; rows[1] is the first body row.
    expect(within(rows[1]).getByText('Bob Smith')).toBeInTheDocument();
  });

  it('the Filters dialog applies grouped selections only on Apply', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.click(screen.getByRole('button', { name: /Filters/ }));

    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('checkbox', { name: 'Inactive' }));
    await user.click(within(dialog).getByRole('button', { name: /Apply/ }));

    // Inactive rows remain; an Active row is filtered out.
    expect(screen.getByText('Carol White')).toBeInTheDocument();
    expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument();
  });

  it('applied filters render as removable chips with a clear-all action', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.click(screen.getByRole('button', { name: /Filters/ }));
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('checkbox', { name: 'Inactive' }));
    await user.click(within(dialog).getByRole('button', { name: /Apply/ }));

    // Chip + clear-all are now present.
    expect(screen.getByRole('button', { name: /Inactive/ })).toBeInTheDocument();
    const clearAll = screen.getByRole('button', { name: 'Clear all' });
    await user.click(clearAll);

    // Clearing brings the Active row back.
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Clear all' })).not.toBeInTheDocument();
  });

  it('shows a paginated "showing X–Y of N" summary (5 rows per page)', () => {
    renderRecipe();
    expect(screen.getByText('Showing 1–5 of 12')).toBeInTheDocument();
  });

  it('shows the empty state when no rows match', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.type(screen.getByLabelText('Search...'), 'zzzzzzzz');
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('accessibility: search box and filters button are reachable by role/name', () => {
    renderRecipe();
    expect(screen.getByLabelText('Search...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Filters/ })).toBeInTheDocument();
  });
});
