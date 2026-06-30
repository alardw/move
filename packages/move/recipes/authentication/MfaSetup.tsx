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
  successTitle: 'Two-factor authentication enabled',
  successDescription: 'You will be asked for a code from your authenticator app the next time you sign in.',
};

type Labels = typeof defaultLabels;

const DEMO_BACKUP_CODES = ['a8f2-k9m3', 'b4n7-p2x5', 'c6q1-r8w4', 'd3y9-s5v7', 'e1t6-u4z2'];

export default function MfaSetup({ labels }: { labels?: Partial<Labels> }) {
  const t = { ...defaultLabels, ...labels };
  const [step, setStep] = useState<'scan' | 'verify'>('scan');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  const handleVerify = (value: string) => {
    setError('');
    // Integration point: onVerify — validate `value` against your MFA backend
    // and activate two-factor auth. The demo accepts any 6-digit code except the
    // sentinel '000000', which it rejects to demonstrate the invalid-code state.
    if (value.length === 6 && value !== '000000') {
      setVerified(true); // success — confirm enrolment (NOT back to the scan step)
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
          <Heading level={2}>{t.title}</Heading>
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
        ) : verified ? (
          <Stack gap="sm" align="center">
            <Badge size="md" color="success" variant="soft">{t.successTitle}</Badge>
            <Text align="center" color="muted" size="sm">{t.successDescription}</Text>
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
            />
          </Stack>
        )}
      </Card.Body>
      <Card.Footer>
        <Card.FooterStart>
          {step === 'scan' ? (
            <Button variant="ghost">{t.cancel}</Button>
          ) : verified ? null : (
            <Button variant="ghost" onClick={() => setStep('scan')}>{t.back}</Button>
          )}
        </Card.FooterStart>
        <Card.FooterEnd>
          {step === 'scan' ? (
            <Button onClick={() => setStep('verify')}>{t.continue}</Button>
          ) : verified ? null : (
            <Button disabled={code.length < 6} onClick={() => handleVerify(code)}>
              {t.submit}
            </Button>
          )}
        </Card.FooterEnd>
      </Card.Footer>
    </Card.Root>
  );
}
