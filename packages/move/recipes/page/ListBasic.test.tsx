// Generated from ListBasic.spec.ts (schemaVersion: 1)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MoveRoot } from 'move';
import ListBasic from './ListBasic';

const renderRecipe = (props = {}) => render(<MoveRoot><ListBasic {...props} /></MoveRoot>);

describe('ListBasic (recipe)', () => {
  it('renders inside MoveRoot with the page title heading', () => {
    renderRecipe();
    expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument();
  });

  it('i18n: default labels show; labels prop overrides them', () => {
    renderRecipe();
    expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument();

    renderRecipe({ labels: { title: 'TEAM ROSTER' } });
    expect(screen.getByRole('heading', { name: 'TEAM ROSTER' })).toBeInTheDocument();
  });

  it('behavior: page header has title, description, and an add action', () => {
    renderRecipe();
    expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument();
    expect(screen.getByText('Manage your team members and their roles.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add User' })).toBeInTheDocument();
  });

  it('behavior: table renders users with role, project, and status', () => {
    renderRecipe();
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Role' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Project' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
  });

  it('behavior: search filters rows by name', async () => {
    const user = userEvent.setup();
    renderRecipe();
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('Search users...'), 'alice');

    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.queryByText('Bob Smith')).not.toBeInTheDocument();
  });

  it('behavior: an EmptyState is shown when no rows match', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.type(screen.getByPlaceholderText('Search users...'), 'zzzzzz');
    expect(await screen.findByText('No users found')).toBeInTheDocument();
    expect(
      screen.getByText('Try adjusting your search or add a new user.'),
    ).toBeInTheDocument();
  });

  it('behavior: pagination appears with a total count when results exceed one page', () => {
    renderRecipe();
    // 12 sample users / 5 per page → pagination + total shown
    expect(screen.getByText('12 total')).toBeInTheDocument();
  });

  it('accessibility: search field and add button reachable by role/name', () => {
    renderRecipe();
    expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add User' })).toBeInTheDocument();
  });
});
