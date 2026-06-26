import { useState } from 'react';
import { Card, Stack, Heading, Text, PinInput, Button, Code, Badge, Image } from 'move';

const defaultLabels = {
  title: 'Set up two-factor authentication',
  stepLabel: (n: number, total: number) => `Step ${n} of ${total}`,
  scanDescription: 'Scan the QR code below with your authenticator app (Google Authenticator, Authy, etc.).',
  qrAlt: 'Scan this QR code with your authenticator app',
  backupTitle: 'Backup codes',
  backupDescription: 'Save these codes in a safe place. You can use them to sign in if you lose access to your authenticator app.',
  verifyDescription: 'Enter the 6-digit code shown in your authenticator app to verify setup.',
  invalidCode: 'Invalid code. Please try again.',
  cancel: 'Cancel',
  continue: 'Continue',
  back: 'Back',
  submit: 'Verify & activate',
};

type Labels = typeof defaultLabels;

const DEMO_BACKUP_CODES = ['a8f2-k9m3', 'b4n7-p2x5', 'c6q1-r8w4', 'd3y9-s5v7', 'e1t6-u4z2'];

export default function MfaSetup({ labels }: { labels?: Partial<Labels> }) {
  const t = { ...defaultLabels, ...labels };
  const [step, setStep] = useState<'scan' | 'verify'>('scan');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleVerify = (value: string) => {
    setError('');
    if (value.length === 6) {
      setStep('scan');
      setCode('');
    } else {
      setError(t.invalidCode);
      setCode('');
    }
  };

  return (
    <Card.Root maxWidth={440}>
      <Card.Header>
        <Stack direction="row" gap="sm" align="center">
          <Heading level={2} size="xl">{t.title}</Heading>
          <Badge size="sm" color="primary" variant="soft">
            {t.stepLabel(step === 'scan' ? 1 : 2, 2)}
          </Badge>
        </Stack>
      </Card.Header>
      <Card.Body>
        {step === 'scan' ? (
          <Stack gap="lg">
            <Text>{t.scanDescription}</Text>
            <Stack align="center">
              <Image src="/qr-demo.svg" alt={t.qrAlt} width={180} height={180} fit="contain" radius="md" />
            </Stack>
            <Stack gap="xs">
              <Text weight="semibold" size="sm">{t.backupTitle}</Text>
              <Text size="sm" color="muted">{t.backupDescription}</Text>
              <Code block>{DEMO_BACKUP_CODES.join('\n')}</Code>
            </Stack>
          </Stack>
        ) : (
          <Stack gap="md" align="center">
            <Text align="center">{t.verifyDescription}</Text>
            {error && <Text color="error" size="sm">{error}</Text>}
            <PinInput
              length={6}
              grouping={[3, 3]}
              value={code}
              onChange={setCode}
              onComplete={handleVerify}
            />
          </Stack>
        )}
      </Card.Body>
      <Card.Footer>
        <Card.FooterStart>
          {step === 'scan' ? (
            <Button variant="ghost">{t.cancel}</Button>
          ) : (
            <Button variant="ghost" onClick={() => setStep('scan')}>{t.back}</Button>
          )}
        </Card.FooterStart>
        <Card.FooterEnd>
          {step === 'scan' ? (
            <Button onClick={() => setStep('verify')}>{t.continue}</Button>
          ) : (
            <Button disabled={code.length < 6} onClick={() => handleVerify(code)}>
              {t.submit}
            </Button>
          )}
        </Card.FooterEnd>
      </Card.Footer>
    </Card.Root>
  );
}
