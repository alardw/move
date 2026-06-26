import { useState, type ChangeEvent } from 'react';
import { Stack, Card, Heading, FormField, InputText, Password, Checkbox, Button, Link } from 'move';

const defaultLabels = {
  title: 'Sign in',
  emailLabel: 'Email',
  emailPlaceholder: 'you@example.com',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Enter your password',
  rememberMe: 'Remember me',
  forgotPassword: 'Forgot password?',
  submit: 'Sign in',
};

type Labels = typeof defaultLabels;

export default function SignIn({ labels }: { labels?: Partial<Labels> }) {
  const t = { ...defaultLabels, ...labels };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  return (
    <Card.Root maxWidth={400}>
      <Card.Header>
        <Heading level={2}>{t.title}</Heading>
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

          <FormField.Root>
            <FormField.Label>{t.passwordLabel}</FormField.Label>
            <FormField.Field>
              <Password
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
            </FormField.Field>
          </FormField.Root>

          <Stack direction="row" justify="between" align="center">
            <Checkbox checked={remember} onCheckedChange={setRemember}>
              {t.rememberMe}
            </Checkbox>
            <Link href="#">{t.forgotPassword}</Link>
          </Stack>

          <Button>{t.submit}</Button>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
