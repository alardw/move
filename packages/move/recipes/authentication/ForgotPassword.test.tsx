// Generated from ForgotPassword.spec.ts (schemaVersion: 1)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MoveRoot } from 'move';
import ForgotPassword from './ForgotPassword';

const renderRecipe = (props = {}) => render(<MoveRoot><ForgotPassword {...props} /></MoveRoot>);

describe('ForgotPassword (recipe)', () => {
  it('renders inside MoveRoot with the title heading', () => {
    renderRecipe();
    expect(screen.getByRole('heading', { name: 'Forgot password?' })).toBeInTheDocument();
  });

  it('shows the default labels', () => {
    renderRecipe();
    expect(screen.getByRole('heading', { name: 'Forgot password?' })).toBeInTheDocument();
    expect(
      screen.getByText("Enter your email and we'll send you a link to reset your password."),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send reset link' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to sign in' })).toBeInTheDocument();
  });

  it('renders a custom title label (i18n override)', () => {
    renderRecipe({ labels: { title: 'CUSTOM TEXT' } });
    expect(screen.getByRole('heading', { name: 'CUSTOM TEXT' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Forgot password?' })).not.toBeInTheDocument();
  });

  it('submit is disabled until an email is entered', async () => {
    const user = userEvent.setup();
    renderRecipe();
    const submit = screen.getByRole('button', { name: 'Send reset link' });
    expect(submit).toBeDisabled();
    await user.type(screen.getByPlaceholderText('you@example.com'), 'user@test.com');
    expect(submit).toBeEnabled();
  });

  it('on submit, shows a confirmation view that echoes the entered email', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.type(screen.getByPlaceholderText('you@example.com'), 'user@test.com');
    await user.click(screen.getByRole('button', { name: 'Send reset link' }));
    expect(screen.getByRole('heading', { name: 'Check your email' })).toBeInTheDocument();
    expect(screen.getByText('user@test.com')).toBeInTheDocument();
    expect(screen.getByText(/We sent a password reset link to/)).toBeInTheDocument();
  });

  it('the confirmation view offers a "try another email" action that returns to the form', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.type(screen.getByPlaceholderText('you@example.com'), 'user@test.com');
    await user.click(screen.getByRole('button', { name: 'Send reset link' }));
    expect(screen.getByRole('heading', { name: 'Check your email' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Try another email' }));
    expect(screen.getByRole('heading', { name: 'Forgot password?' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
  });

  it('key controls are reachable by role/name', () => {
    renderRecipe();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send reset link' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to sign in' })).toBeInTheDocument();
  });
});
