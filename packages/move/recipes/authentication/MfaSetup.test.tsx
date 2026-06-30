import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MoveRoot } from 'move';
import MfaSetup from './MfaSetup';

const renderRecipe = () => render(<MoveRoot><MfaSetup /></MoveRoot>);

describe('MfaSetup (recipe)', () => {
  it('verifying a valid code shows success — does NOT return to the scan step', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.click(screen.getByRole('button', { name: 'Continue' })); // scan → verify

    const slots = screen.getAllByRole('textbox');
    await user.click(slots[0]);
    await user.keyboard('123456'); // any non-sentinel 6-digit code = valid
    await user.click(screen.getByRole('button', { name: 'Verify & activate' }));

    expect(screen.getByText('Two-factor authentication enabled')).toBeInTheDocument();
    // regression: success used to navigate BACK to the scan step
    expect(screen.queryByText(/Scan the QR code/)).not.toBeInTheDocument();
  });

  it('the sentinel invalid code (000000) shows the error', async () => {
    const user = userEvent.setup();
    renderRecipe();
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    const slots = screen.getAllByRole('textbox');
    await user.click(slots[0]);
    await user.keyboard('000000');
    await user.click(screen.getByRole('button', { name: 'Verify & activate' }));
    expect(screen.getByText('Invalid code. Please try again.')).toBeInTheDocument();
  });
});
