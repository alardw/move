// Generated from OverviewBasic.spec.ts (schemaVersion: 1)
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MoveRoot } from 'move';
import OverviewBasic from './OverviewBasic';

const renderRecipe = (props = {}) =>
  render(
    <MoveRoot>
      <OverviewBasic {...props} />
    </MoveRoot>,
  );

describe('OverviewBasic (recipe)', () => {
  it('renders the overview title', () => {
    renderRecipe();
    expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument();
  });

  it('renders KPI stat cards with label, value, and change badge', () => {
    renderRecipe();
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$45,231.89')).toBeInTheDocument();
    expect(screen.getByText('+20.1% from last month')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
  });

  it('pairs a recent-activity table with a top-performers list', () => {
    renderRecipe();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Top Performers')).toBeInTheDocument();
    // activity table headers
    expect(screen.getByRole('columnheader', { name: 'User' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Action' })).toBeInTheDocument();
    // a top performer row
    expect(screen.getByText('Frank Miller')).toBeInTheDocument();
  });

  it('renders all user-facing copy through the labels prop (i18n)', () => {
    renderRecipe({ labels: { recentActivity: 'CUSTOM TEXT' } });
    expect(screen.getByText('CUSTOM TEXT')).toBeInTheDocument();
    expect(screen.queryByText('Recent Activity')).not.toBeInTheDocument();
  });

  it('exposes the view-all control by accessible name', () => {
    renderRecipe();
    expect(screen.getByRole('button', { name: 'View all' })).toBeInTheDocument();
  });
});
