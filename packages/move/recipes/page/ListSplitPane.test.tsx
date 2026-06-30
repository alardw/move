// Generated from ListSplitPane.spec.ts (schemaVersion: 1)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MoveRoot } from 'move';
import ListSplitPane from './ListSplitPane';

const renderRecipe = (props = {}) =>
  render(
    <MoveRoot>
      <ListSplitPane {...props} />
    </MoveRoot>,
  );

describe('ListSplitPane (recipe)', () => {
  it('renders the inbox title and the empty-detail prompt', () => {
    renderRecipe();
    expect(screen.getByRole('heading', { name: 'Inbox' })).toBeInTheDocument();
    expect(screen.getByText('Select a message')).toBeInTheDocument();
  });

  it('lists messages with sender, subject, and unread badge', () => {
    renderRecipe();
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    // unread messages carry a "new" badge
    expect(screen.getAllByText('new').length).toBeGreaterThan(0);
  });

  it('selecting a message shows its detail and replaces the empty prompt', async () => {
    const user = userEvent.setup();
    renderRecipe();
    expect(screen.getByText('Select a message')).toBeInTheDocument();

    await user.click(screen.getByText('Alice Johnson'));

    // detail pane shows the subject as a heading
    expect(screen.getByRole('heading', { name: 'Design review feedback' })).toBeInTheDocument();
    expect(screen.getByText(/From: Alice Johnson/)).toBeInTheDocument();
    expect(screen.queryByText('Select a message')).not.toBeInTheDocument();
  });

  it('a selected message offers reply, forward, and archive actions', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.click(screen.getByText('Bob Smith'));

    expect(screen.getByRole('button', { name: 'Reply' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Forward' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Archive' })).toBeInTheDocument();
  });

  it('renders all user-facing copy through the labels prop (i18n)', () => {
    renderRecipe({ labels: { title: 'CUSTOM TEXT' } });
    expect(screen.getByRole('heading', { name: 'CUSTOM TEXT' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Inbox' })).not.toBeInTheDocument();
  });

  it('exposes the compose control by accessible name', () => {
    renderRecipe();
    expect(screen.getByRole('button', { name: /Compose/ })).toBeInTheDocument();
  });
});
