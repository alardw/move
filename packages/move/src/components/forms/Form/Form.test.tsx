// Generated from Form.spec.ts
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Form } from './Form';
import { FormField } from '../FormField';
import { InputText } from '../InputText';

describe('Form', () => {
  describe('submission', () => {
    it('hands over the values without being told what its fields are', async () => {
      // The browser collects them by name. The form never enumerates anything.
      const onSubmit = vi.fn();
      render(
        <Form onSubmit={onSubmit}>
          <InputText name="email" defaultValue="a@b.com" aria-label="Email" />
          <InputText name="team" defaultValue="Platform" aria-label="Team" />
          <button type="submit">Save</button>
        </Form>,
      );

      await userEvent.click(screen.getByRole('button', { name: 'Save' }));

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit.mock.calls[0][0]).toEqual({ email: 'a@b.com', team: 'Platform' });
    });

    it('does not navigate — preventDefault is already applied', async () => {
      const onSubmit = vi.fn();
      render(
        <Form onSubmit={onSubmit}>
          <button type="submit">Save</button>
        </Form>,
      );

      await userEvent.click(screen.getByRole('button', { name: 'Save' }));

      expect(onSubmit.mock.calls[0][1].defaultPrevented).toBe(true);
    });

    it('sets noValidate by default', () => {
      render(
        <Form data-testid="form">
          <button type="submit">Save</button>
        </Form>,
      );
      expect(screen.getByTestId('form')).toHaveAttribute('novalidate');
    });

    it('keeps native constraints working despite noValidate', async () => {
      // noValidate suppresses the browser's BUBBLES, not its validation — so
      // `required` still has to stop the submit.
      const onSubmit = vi.fn();
      render(
        <Form onSubmit={onSubmit}>
          <InputText name="email" required aria-label="Email" />
          <button type="submit">Save</button>
        </Form>,
      );

      await userEvent.click(screen.getByRole('button', { name: 'Save' }));
      expect(onSubmit).not.toHaveBeenCalled();

      await userEvent.type(screen.getByLabelText('Email'), 'a@b.com');
      await userEvent.click(screen.getByRole('button', { name: 'Save' }));
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('errors', () => {
    it('reaches the field whose name matches', () => {
      render(
        <Form errors={{ email: 'Already taken' }}>
          <FormField.Root name="email" data-testid="field">
            <FormField.Field>
              <InputText name="email" aria-label="Email" />
            </FormField.Field>
          </FormField.Root>
        </Form>,
      );

      expect(screen.getByTestId('field')).toHaveAttribute('data-invalid');
      expect(screen.getByText('Already taken')).toBeInTheDocument();
    });

    it('holds no state — the same props render the same thing', () => {
      // A submit must not make the form remember anything. Errors arrive as a
      // prop and leave as a prop.
      const { rerender } = render(
        <Form errors={{ email: 'Already taken' }}>
          <FormField.Root name="email" data-testid="field">
            <FormField.Field>control</FormField.Field>
          </FormField.Root>
        </Form>,
      );
      expect(screen.getByTestId('field')).toHaveAttribute('data-invalid');

      rerender(
        <Form errors={{}}>
          <FormField.Root name="email" data-testid="field">
            <FormField.Field>control</FormField.Field>
          </FormField.Root>
        </Form>,
      );
      expect(screen.getByTestId('field')).not.toHaveAttribute('data-invalid');
    });
  });

  describe('Actions', () => {
    it('disables everything inside while pending', () => {
      render(
        <Form pending>
          <Form.Actions>
            <button type="submit">Save</button>
            <button type="button">Cancel</button>
          </Form.Actions>
        </Form>,
      );
      // The fieldset does this, by the platform's rules — no child was inspected.
      expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    });

    it('leaves them alone when not pending', () => {
      render(
        <Form>
          <Form.Actions>
            <button type="submit">Save</button>
          </Form.Actions>
        </Form>,
      );
      expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
    });

    it('carries data-align, defaulting to end', () => {
      const { rerender } = render(
        <Form>
          <Form.Actions data-testid="actions">
            <button type="submit">Save</button>
          </Form.Actions>
        </Form>,
      );
      expect(screen.getByTestId('actions')).toHaveAttribute('data-align', 'end');

      rerender(
        <Form>
          <Form.Actions align="between" data-testid="actions">
            <button type="submit">Save</button>
          </Form.Actions>
        </Form>,
      );
      expect(screen.getByTestId('actions')).toHaveAttribute('data-align', 'between');
    });

    it('works outside a Form', () => {
      // Every part of this must degrade to nothing useful rather than throwing.
      render(
        <Form.Actions data-testid="actions">
          <button type="button">Alone</button>
        </Form.Actions>,
      );
      expect(screen.getByRole('button', { name: 'Alone' })).toBeEnabled();
    });
  });

  it('forwards className and style', () => {
    render(
      <Form className="custom" style={{ opacity: 0.5 }} data-testid="form">
        <button type="submit">Save</button>
      </Form>,
    );
    const form = screen.getByTestId('form');
    expect(form).toHaveClass('custom');
    expect(form).toHaveStyle({ opacity: '0.5' });
  });
});
