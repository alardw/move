import { useState, type ChangeEvent } from 'react';
import { Card, Stack, Heading, Text, FormField, Password, Button, Link } from 'move';

const defaultLabels = {
  title: 'Reset password',
  description: 'Enter your new password below.',
  newPasswordLabel: 'New password',
  newPasswordPlaceholder: 'At least 8 characters',
  newPasswordHint: 'Must be at least 8 characters',
  confirmLabel: 'Confirm password',
  confirmPlaceholder: 'Repeat your password',
  mismatchError: 'Passwords do not match',
  submit: 'Reset password',
  backToSignIn: 'Back to sign in',
  successTitle: 'Password reset',
  successDescription: 'Your password has been successfully reset. You can now sign in with your new password.',
  successAction: 'Back to sign in',
};

type Labels = typeof defaultLabels;

export default function ResetPassword({ labels }: { labels?: Partial<Labels> }) {
  const t = { ...defaultLabels, ...labels };
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const mismatch = confirm.length > 0 && password !== confirm;
  const valid = password.length >= 8 && password === confirm;

  if (submitted) {
    return (
      <Card.Root maxWidth={400}>
        <Card.Header>
          <Heading level={2}>{t.successTitle}</Heading>
          <Text color="muted">{t.successDescription}</Text>
        </Card.Header>
        <Card.Body>
          <Button fullWidth>{t.successAction}</Button>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root maxWidth={400}>
      <Card.Header>
        <Heading level={2}>{t.title}</Heading>
        <Text color="muted">{t.description}</Text>
      </Card.Header>
      <Card.Body>
        <Stack gap="md">
          <FormField.Root>
            <FormField.Label>{t.newPasswordLabel}</FormField.Label>
            <FormField.Field>
              <Password
                placeholder={t.newPasswordPlaceholder}
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
            </FormField.Field>
            <FormField.Description>{t.newPasswordHint}</FormField.Description>
          </FormField.Root>

          <FormField.Root>
            <FormField.Label>{t.confirmLabel}</FormField.Label>
            <FormField.Field>
              <Password
                invalid={mismatch}
                placeholder={t.confirmPlaceholder}
                value={confirm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirm(e.target.value)}
              />
            </FormField.Field>
            {mismatch && <FormField.Description error>{t.mismatchError}</FormField.Description>}
          </FormField.Root>

          <Button disabled={!valid} onClick={() => setSubmitted(true)}>{t.submit}</Button>
        </Stack>
      </Card.Body>
      <Card.Footer>
        <Card.FooterStart>
          <Link href="#">{t.backToSignIn}</Link>
        </Card.FooterStart>
      </Card.Footer>
    </Card.Root>
  );
}
