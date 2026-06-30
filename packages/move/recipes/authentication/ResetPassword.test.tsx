// Generated from ResetPassword.spec.ts (schemaVersion: 1)
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MoveRoot } from 'move';
import ResetPassword from './ResetPassword';

const renderRecipe = (props = {}) => render(<MoveRoot><ResetPassword {...props} /></MoveRoot>);

describe('ResetPassword (recipe)', () => {
  it('renders inside MoveRoot with the title heading', () => {
    renderRecipe();
    expect(screen.getByRole('heading', { name: 'Reset password' })).toBeInTheDocument();
  });

  it('shows the default labels', () => {
    renderRecipe();
    expect(screen.getByRole('heading', { name: 'Reset password' })).toBeInTheDocument();
    expect(screen.getByText('Enter your new password below.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('At least 8 characters')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Repeat your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset password' })).toBeInTheDocument();
  });

  it('renders a custom title label (i18n override)', () => {
    renderRecipe({ labels: { title: 'CUSTOM TEXT' } });
    expect(screen.getByRole('heading', { name: 'CUSTOM TEXT' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Reset password' })).not.toBeInTheDocument();
  });

  it('shows a mismatch error on the confirm field when it differs from the new password', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.type(screen.getByPlaceholderText('At least 8 characters'), 'password123');
    await user.type(screen.getByPlaceholderText('Repeat your password'), 'different');
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('submit is disabled until the password is >= 8 chars and both fields match', async () => {
    const user = userEvent.setup();
    renderRecipe();
    const submit = screen.getByRole('button', { name: 'Reset password' });
    expect(submit).toBeDisabled();

    // too short + matching → still disabled
    await user.type(screen.getByPlaceholderText('At least 8 characters'), 'short');
    await user.type(screen.getByPlaceholderText('Repeat your password'), 'short');
    expect(submit).toBeDisabled();

    // make both valid and matching (8+ chars)
    await user.type(screen.getByPlaceholderText('At least 8 characters'), 'enough!');
    await user.type(screen.getByPlaceholderText('Repeat your password'), 'enough!');
    expect(submit).toBeEnabled();
  });

  it('on submit, shows the success view', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.type(screen.getByPlaceholderText('At least 8 characters'), 'password123');
    await user.type(screen.getByPlaceholderText('Repeat your password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Reset password' }));

    expect(screen.getByRole('heading', { name: 'Password reset' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'Your password has been successfully reset. You can now sign in with your new password.',
      ),
    ).toBeInTheDocument();
  });

  it('key controls are reachable by role/name', () => {
    renderRecipe();
    expect(screen.getByPlaceholderText('At least 8 characters')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Repeat your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset password' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to sign in' })).toBeInTheDocument();
  });
});
