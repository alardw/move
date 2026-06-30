// Generated from SignIn.spec.ts (schemaVersion: 1)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MoveRoot } from 'move';
import SignIn from './SignIn';

const renderRecipe = (props = {}) => render(<MoveRoot><SignIn {...props} /></MoveRoot>);

describe('SignIn (recipe)', () => {
  it('renders inside MoveRoot with the title heading', () => {
    renderRecipe();
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('shows the default labels', () => {
    renderRecipe();
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Forgot password?' })).toBeInTheDocument();
  });

  it('renders a custom title label (i18n override)', () => {
    renderRecipe({ labels: { title: 'CUSTOM TEXT' } });
    expect(screen.getByRole('heading', { name: 'CUSTOM TEXT' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Sign in' })).not.toBeInTheDocument();
  });

  it('email and password are controlled inputs that accept typing', async () => {
    const user = userEvent.setup();
    renderRecipe();
    const email = screen.getByPlaceholderText('you@example.com');
    const password = screen.getByPlaceholderText('Enter your password');
    await user.type(email, 'user@test.com');
    await user.type(password, 'hunter2');
    expect(email).toHaveValue('user@test.com');
    expect(password).toHaveValue('hunter2');
  });

  it('the remember-me checkbox toggles its checked state', async () => {
    const user = userEvent.setup();
    renderRecipe();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('exposes a forgot-password link', () => {
    renderRecipe();
    expect(screen.getByRole('link', { name: 'Forgot password?' })).toBeInTheDocument();
  });

  it('key controls are reachable by role/name', () => {
    renderRecipe();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });
});
