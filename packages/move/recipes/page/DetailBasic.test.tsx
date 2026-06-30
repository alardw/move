// Generated from DetailBasic.spec.ts (schemaVersion: 1)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MoveRoot } from 'move';
import DetailBasic from './DetailBasic';

const renderRecipe = (props = {}) => render(<MoveRoot><DetailBasic {...props} /></MoveRoot>);

describe('DetailBasic (recipe)', () => {
  it('renders inside MoveRoot with the entity name heading', () => {
    renderRecipe();
    expect(screen.getByRole('heading', { name: 'Alice Johnson' })).toBeInTheDocument();
  });

  it('i18n: default labels show; labels prop overrides them', () => {
    renderRecipe();
    expect(screen.getByRole('heading', { name: 'Alice Johnson' })).toBeInTheDocument();

    renderRecipe({ labels: { name: 'CUSTOM NAME' } });
    expect(screen.getByRole('heading', { name: 'CUSTOM NAME' })).toBeInTheDocument();
  });

  it('behavior: shows a breadcrumb trail to the entity', () => {
    renderRecipe();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Users' })).toBeInTheDocument();
  });

  it('behavior: header has avatar name, status badge, and an edit action', () => {
    renderRecipe();
    expect(screen.getByRole('heading', { name: 'Alice Johnson' })).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('behavior: a description list renders the entity fields', () => {
    renderRecipe();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
  });

  it('behavior: the settings accordion (team / integrations / activity) is open by default', () => {
    renderRecipe();
    // type="multiple" defaultValue opens all three — their content is visible without interaction
    expect(screen.getByText('Bob Smith')).toBeInTheDocument(); // team list
    expect(screen.getByText('GitHub')).toBeInTheDocument(); // integrations list
    expect(screen.getByText('Updated profile settings')).toBeInTheDocument(); // activity table
  });

  it('behavior: activity renders as a table with column headers', () => {
    renderRecipe();
    expect(screen.getByRole('columnheader', { name: 'Action' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'User' })).toBeInTheDocument();
  });

  it('accessibility: key controls reachable by role/name', () => {
    renderRecipe();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  });
});
