import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MoveRoot } from 'move';
import MfaVerify from './MfaVerify';

const renderRecipe = () => render(<MoveRoot><MfaVerify /></MoveRoot>);

describe('MfaVerify (recipe)', () => {
  it('the Verify button enables at 6 digits and a valid code shows success', async () => {
    const user = userEvent.setup();
    renderRecipe();
    const verify = screen.getByRole('button', { name: 'Verify' });
    expect(verify).toBeDisabled();

    const slots = screen.getAllByRole('textbox');
    await user.click(slots[0]);
    await user.keyboard('000000'); // the demo's valid code

    expect(verify).toBeEnabled(); // regression: button was permanently disabled
    await user.click(verify);
    expect(screen.getByText('Verified')).toBeInTheDocument();
  });

  it('an invalid code shows the error and keeps the form', async () => {
    const user = userEvent.setup();
    renderRecipe();
    const slots = screen.getAllByRole('textbox');
    await user.click(slots[0]);
    await user.keyboard('123456');
    await user.click(screen.getByRole('button', { name: 'Verify' }));
    expect(screen.getByText('Invalid verification code. Please try again.')).toBeInTheDocument();
    expect(screen.queryByText('Verified')).not.toBeInTheDocument();
  });
});
