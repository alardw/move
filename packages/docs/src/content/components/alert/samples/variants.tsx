import { Alert, Stack } from 'move';

const variants = [
  {
    variant: 'info' as const,
    title: 'Scheduled maintenance',
    body: 'The dashboard will be read-only on Sunday from 02:00 to 02:30 UTC for a database migration. Existing sessions stay signed in.',
  },
  {
    variant: 'success' as const,
    title: 'Invitations sent',
    body: 'All 12 teammates received an invite to your workspace. Pending invites expire in 7 days — easy to resend from the team page.',
  },
  {
    variant: 'warning' as const,
    title: 'Storage almost full',
    body: 'You’re using 92% of the 50 GB plan. Files larger than 100 MB are skipped from backups until you upgrade or clear space.',
  },
  {
    variant: 'danger' as const,
    title: 'Payment failed',
    body: 'We couldn’t charge the card on file. Update billing in the next 7 days to avoid a service interruption.',
  },
];

export default function VariantsSample() {
  return (
    <Stack gap="md">
      {variants.map((v) => (
        <Alert key={v.variant} variant={v.variant} title={v.title}>
          {v.body}
        </Alert>
      ))}
    </Stack>
  );
}
