// Generated from AppSidebar.spec.ts (schemaVersion: 1)
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MoveRoot } from 'move';
import AppSidebar from './AppSidebar';

const renderRecipe = (props = {}) =>
  render(
    <MoveRoot>
      <AppSidebar {...props} />
    </MoveRoot>,
  );

describe('AppSidebar (recipe)', () => {
  it('renders the sidebar with the app name and nav items', () => {
    renderRecipe();
    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Projects' })).toBeInTheDocument();
  });

  it('i18n: default labels show and a labels override replaces them', () => {
    const { unmount } = renderRecipe();
    expect(screen.getByText('Acme')).toBeInTheDocument();
    unmount();

    renderRecipe({ labels: { appName: 'CUSTOM TEXT' } });
    expect(screen.getByText('CUSTOM TEXT')).toBeInTheDocument();
    expect(screen.queryByText('Acme')).not.toBeInTheDocument();
  });

  it('collapses via the header toggle, exposing an expand control', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
    expect(screen.getAllByRole('button', { name: 'Expand sidebar' }).length).toBeGreaterThan(0);
  });

  it('marks the active nav item and updates it on click', async () => {
    const user = userEvent.setup();
    renderRecipe();
    // Home is active by default.
    expect(screen.getByRole('button', { name: 'Home' })).toHaveAttribute('data-active');

    await user.click(screen.getByRole('button', { name: 'Projects' }));
    expect(screen.getByRole('button', { name: 'Projects' })).toHaveAttribute('data-active');
    expect(screen.getByRole('button', { name: 'Home' })).not.toHaveAttribute('data-active');
  });

  it('a nav item can carry a count badge (chat = 3)', () => {
    renderRecipe();
    const chat = screen.getByRole('button', { name: /Chat/ });
    expect(within(chat).getByText('3')).toBeInTheDocument();
  });

  it('the footer hosts the account dropdown trigger', async () => {
    const user = userEvent.setup();
    renderRecipe();
    const account = screen.getByText('Jane Cooper');
    expect(account).toBeInTheDocument();
    expect(screen.getByText('Pro plan')).toBeInTheDocument();

    await user.click(account);
    expect(await screen.findByText('Sign out')).toBeInTheDocument();
  });

  it('accessibility: nav items and the collapse control are reachable by role/name', () => {
    // Note: the mobile overlay trigger (visibility="mobile") renders null in
    // jsdom's desktop viewport, so the responsive overlay behavior is asserted
    // here only via the controls available in the expanded (desktop) state.
    renderRecipe();
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Collapse sidebar' })).toBeInTheDocument();
  });
});
