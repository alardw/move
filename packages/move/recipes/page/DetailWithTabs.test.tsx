// Generated from DetailWithTabs.spec.ts (schemaVersion: 1)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MoveRoot } from 'move';
import DetailWithTabs from './DetailWithTabs';

const renderRecipe = (props = {}) => render(<MoveRoot><DetailWithTabs {...props} /></MoveRoot>);

describe('DetailWithTabs (recipe)', () => {
  it('renders inside MoveRoot with the entity name heading', () => {
    renderRecipe();
    expect(screen.getByRole('heading', { name: 'Website Redesign' })).toBeInTheDocument();
  });

  it('i18n: default labels show; labels prop overrides them', () => {
    renderRecipe();
    expect(screen.getByRole('heading', { name: 'Website Redesign' })).toBeInTheDocument();

    renderRecipe({ labels: { name: 'CUSTOM PROJECT' } });
    expect(screen.getByRole('heading', { name: 'CUSTOM PROJECT' })).toBeInTheDocument();
  });

  it('behavior: shows a breadcrumb trail to the entity', () => {
    renderRecipe();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument();
  });

  it('behavior: header has title, status badge, description, and an edit action', () => {
    renderRecipe();
    expect(screen.getByRole('heading', { name: 'Website Redesign' })).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(
      screen.getByText('Complete redesign of the marketing website with new brand guidelines.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('behavior: Details tab is active by default and shows the description list', () => {
    renderRecipe();
    expect(screen.getByText('Owner')).toBeInTheDocument(); // Details panel content
    expect(screen.getByText('Priority')).toBeInTheDocument();
  });

  it('behavior: clicking the Activity tab switches to the timeline panel', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.click(screen.getByRole('tab', { name: 'Activity' }));
    expect(await screen.findByText('Design review completed')).toBeInTheDocument();
  });

  it('behavior: clicking the Related tab switches to the related table', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.click(screen.getByRole('tab', { name: 'Related' }));
    expect(await screen.findByText('Brand Guidelines v2')).toBeInTheDocument();
  });

  it('accessibility: all three tabs are reachable by role/name', () => {
    renderRecipe();
    expect(screen.getByRole('tab', { name: 'Details' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Activity' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Related' })).toBeInTheDocument();
  });
});
