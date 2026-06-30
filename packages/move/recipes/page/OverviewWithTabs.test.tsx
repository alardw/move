// Generated from OverviewWithTabs.spec.ts (schemaVersion: 1)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MoveRoot } from 'move';
import OverviewWithTabs from './OverviewWithTabs';

const renderRecipe = (props = {}) =>
  render(
    <MoveRoot>
      <OverviewWithTabs {...props} />
    </MoveRoot>,
  );

describe('OverviewWithTabs (recipe)', () => {
  it('renders the dashboard title and the overview tab by default', () => {
    renderRecipe();
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    // overview is the default active tab → KPI stats are visible
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$45,231.89')).toBeInTheDocument();
  });

  it('shows 4 KPI stat cards in the overview tab', () => {
    renderRecipe();
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('Subscriptions')).toBeInTheDocument();
    expect(screen.getByText('Sales')).toBeInTheDocument();
    expect(screen.getByText('Active Now')).toBeInTheDocument();
  });

  it('switches to the Analytics tab to reveal its placeholder content', async () => {
    const user = userEvent.setup();
    renderRecipe();
    // analytics content is not visible while Overview is active
    expect(screen.queryByText('Charts and analytics content')).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Analytics' }));
    expect(await screen.findByText('Charts and analytics content')).toBeInTheDocument();
  });

  it('switches to the Reports tab to reveal its placeholder content', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.click(screen.getByRole('tab', { name: 'Reports' }));
    expect(await screen.findByText('Reports and exports content')).toBeInTheDocument();
  });

  it('renders all user-facing copy through the labels prop (i18n)', () => {
    renderRecipe({ labels: { title: 'CUSTOM TEXT' } });
    expect(screen.getByRole('heading', { name: 'CUSTOM TEXT' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Dashboard' })).not.toBeInTheDocument();
  });

  it('exposes the tabs by role and accessible name', () => {
    renderRecipe();
    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Analytics' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Reports' })).toBeInTheDocument();
  });
});
