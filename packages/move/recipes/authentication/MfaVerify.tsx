import { useState } from 'react';
import { Card, Stack, Heading, Text, PinInput, Button, Link, Badge } from 'move';

const defaultLabels = {
  title: 'Two-factor authentication',
  description: 'Enter the 6-digit code from your authenticator app to continue.',
  invalidCode: 'Invalid verification code. Please try again.',
  backupLink: 'Use a backup code instead',
  back: 'Back to sign in',
  submit: 'Verify',
  successTitle: 'Verified',
  successDescription: 'Taking you to your account…',
};

type Labels = typeof defaultLabels;

export default function MfaVerify({ labels }: { labels?: Partial<Labels> }) {
  const t = { ...defaultLabels, ...labels };
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    setError('');
    // Integration point: verify `code` against your auth backend. The demo
    // treats '000000' as the valid code; anything else shows the error state.
    if (code === '000000') {
      setVerified(true);
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
        {verified ? (
          <Stack gap="sm" align="center">
            <Badge size="md" color="success" variant="soft">{t.successTitle}</Badge>
            <Text align="center" color="muted" size="sm">{t.successDescription}</Text>
          </Stack>
        ) : (
          <Stack gap="md" align="center">
            {error && <Text color="error" size="sm">{error}</Text>}
            <PinInput
              length={6}
              grouping={[3, 3]}
              value={code}
              onChange={setCode}
            />
            <Link href="#" size="sm">{t.backupLink}</Link>
          </Stack>
        )}
      </Card.Body>
      <Card.Footer>
        <Card.FooterStart>
          <Button variant="ghost">{t.back}</Button>
        </Card.FooterStart>
        <Card.FooterEnd>
          {!verified && (
            <Button disabled={code.length < 6} onClick={handleVerify}>
              {t.submit}
            </Button>
          )}
        </Card.FooterEnd>
      </Card.Footer>
    </Card.Root>
  );
}
