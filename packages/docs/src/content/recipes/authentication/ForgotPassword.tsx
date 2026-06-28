import { useState, type ChangeEvent } from 'react';
import { Card, Stack, Heading, Text, FormField, InputText, Button, Link } from 'move';

const defaultLabels = {
  title: 'Forgot password?',
  description: "Enter your email and we'll send you a link to reset your password.",
  emailLabel: 'Email',
  emailPlaceholder: 'you@example.com',
  submit: 'Send reset link',
  backToSignIn: 'Back to sign in',
  confirmTitle: 'Check your email',
  confirmSentTo: 'We sent a password reset link to',
  confirmHint: "Didn't receive the email? Check your spam folder or try another email address.",
  tryAnother: 'Try another email',
};

type Labels = typeof defaultLabels;

export default function ForgotPassword({ labels }: { labels?: Partial<Labels> }) {
  const t = { ...defaultLabels, ...labels };
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <Card.Root maxWidth={400}>
        <Card.Header>
          <Heading level={2}>{t.confirmTitle}</Heading>
          <Text color="muted">
            {t.confirmSentTo} <Text weight="semibold">{email}</Text>.
          </Text>
        </Card.Header>
        <Card.Body>
          <Stack gap="md">
            <Text size="sm" color="muted">{t.confirmHint}</Text>
            <Button variant="secondary" onClick={() => setSubmitted(false)}>{t.tryAnother}</Button>
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

  return (
    <Card.Root maxWidth={400}>
      <Card.Header>
        <Heading level={2}>{t.title}</Heading>
        <Text color="muted">{t.description}</Text>
      </Card.Header>
      <Card.Body>
        <Stack gap="md">
          <FormField.Root>
            <FormField.Label>{t.emailLabel}</FormField.Label>
            <FormField.Field>
              <InputText
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </FormField.Field>
          </FormField.Root>
          <Button disabled={!email} onClick={() => setSubmitted(true)}>{t.submit}</Button>
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
