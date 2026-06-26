import { useState } from 'react';
import { Card, Stack, Heading, Text, PinInput, Button, Link } from 'move';

const defaultLabels = {
  title: 'Two-factor authentication',
  description: 'Enter the 6-digit code from your authenticator app to continue.',
  invalidCode: 'Invalid verification code. Please try again.',
  backupLink: 'Use a backup code instead',
  back: 'Back to sign in',
  submit: 'Verify',
};

type Labels = typeof defaultLabels;

export default function MfaVerify({ labels }: { labels?: Partial<Labels> }) {
  const t = { ...defaultLabels, ...labels };
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleComplete = (value: string) => {
    setError('');
    if (value === '000000') {
      setCode('');
    } else {
      setError(t.invalidCode);
      setCode('');
    }
  };

  return (
    <Card.Root maxWidth={400}>
      <Card.Header>
        <Heading level={2}>{t.title}</Heading>
        <Text color="muted">{t.description}</Text>
      </Card.Header>
      <Card.Body>
        <Stack gap="md" align="center">
          {error && <Text color="error" size="sm">{error}</Text>}
          <PinInput
            length={6}
            grouping={[3, 3]}
            value={code}
            onChange={setCode}
            onComplete={handleComplete}
          />
          <Link href="#" size="sm">{t.backupLink}</Link>
        </Stack>
      </Card.Body>
      <Card.Footer>
        <Card.FooterStart>
          <Button variant="ghost">{t.back}</Button>
        </Card.FooterStart>
        <Card.FooterEnd>
          <Button disabled={code.length < 6} onClick={() => handleComplete(code)}>
            {t.submit}
          </Button>
        </Card.FooterEnd>
      </Card.Footer>
    </Card.Root>
  );
}
