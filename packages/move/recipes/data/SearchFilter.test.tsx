// Generated from SearchFilter.spec.ts (schemaVersion: 1)
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MoveRoot } from 'move';
import SearchFilter from './SearchFilter';

const renderRecipe = (props = {}) =>
  render(
    <MoveRoot>
      <SearchFilter {...props} />
    </MoveRoot>,
  );

describe('SearchFilter (recipe)', () => {
  it('renders the search input and the list of records', () => {
    renderRecipe();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByText('Leslie Alexander')).toBeInTheDocument();
  });

  it('i18n: default labels show and a labels override replaces them', () => {
    const { unmount } = renderRecipe();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    unmount();

    renderRecipe({ labels: { searchPlaceholder: 'CUSTOM TEXT' } });
    expect(screen.getByPlaceholderText('CUSTOM TEXT')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
  });

  it('search filters the list live by name', async () => {
    const user = userEvent.setup();
    renderRecipe();
    expect(screen.getByText('Michael Foster')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Search...'), 'Leslie');
    expect(screen.getByText('Leslie Alexander')).toBeInTheDocument();
    expect(screen.queryByText('Michael Foster')).not.toBeInTheDocument();
  });

  it('search filters the list live by email', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.type(screen.getByPlaceholderText('Search...'), 'tom@example.com');
    expect(screen.getByText('Tom Cook')).toBeInTheDocument();
    expect(screen.queryByText('Leslie Alexander')).not.toBeInTheDocument();
  });

  it('the Filters dialog applies grouped selections only on Apply', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.click(screen.getByRole('button', { name: /Filters/ }));

    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('checkbox', { name: 'Inactive' }));
    await user.click(within(dialog).getByRole('button', { name: /Apply/ }));

    // Inactive records remain; an active record is filtered out.
    expect(screen.getByText('Dries Vincent')).toBeInTheDocument();
    expect(screen.queryByText('Leslie Alexander')).not.toBeInTheDocument();
  });

  it('cancelling the dialog discards pending selections', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.click(screen.getByRole('button', { name: /Filters/ }));

    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('checkbox', { name: 'Inactive' }));
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));

    // No filter applied — all records still visible.
    expect(screen.getByText('Leslie Alexander')).toBeInTheDocument();
    expect(screen.getByText('Dries Vincent')).toBeInTheDocument();
  });

  it('applied filters render as removable chips with a clear-all action', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.click(screen.getByRole('button', { name: /Filters/ }));
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('checkbox', { name: 'Inactive' }));
    await user.click(within(dialog).getByRole('button', { name: /Apply/ }));

    expect(screen.getByRole('button', { name: /Inactive/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear all' }));

    expect(screen.getByText('Leslie Alexander')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Clear all' })).not.toBeInTheDocument();
  });

  it('the Filters button shows a count badge of active filters', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.click(screen.getByRole('button', { name: /Filters/ }));
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('checkbox', { name: 'Inactive' }));
    await user.click(within(dialog).getByRole('checkbox', { name: 'Pending' }));
    await user.click(within(dialog).getByRole('button', { name: /Apply/ }));

    const filtersButton = screen.getByRole('button', { name: /Filters/ });
    expect(within(filtersButton).getByText('2')).toBeInTheDocument();
  });

  it('shows the empty state when no items match', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.type(screen.getByPlaceholderText('Search...'), 'zzzzzzzz');
    expect(screen.getByText('No results')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search or filters.')).toBeInTheDocument();
  });

  it('accessibility: search box and filters button are reachable by role/name', () => {
    renderRecipe();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Filters/ })).toBeInTheDocument();
  });
});
