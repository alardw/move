import { Accordion } from 'move';

const sections = [
  {
    value: 'profile',
    label: 'Profile',
    body:
      'Your name, handle, and photo — the things your teammates see when they’re trying to figure out who owns the ticket that’s been open for three weeks. Keep the photo recent; a decade-old headshot makes onboarding meetings awkward for everyone.',
  },
  {
    value: 'notifications',
    label: 'Notifications',
    body:
      'Pick what lands in your inbox and what gets rolled into the daily digest. The defaults are opinionated but reasonable — you probably don’t need an email every time someone reacts to your message with a fire emoji.',
  },
  {
    value: 'security',
    label: 'Security',
    body:
      'Two-factor authentication, backup codes, and a tidy log of every active session — including that one still signed in on a laptop you sold last summer. Rotate things, revoke things, sleep better.',
  },
  {
    value: 'billing',
    label: 'Billing',
    body:
      'Plan, invoices, and payment method. Downgrading is one click and we don’t hide the button — we’d rather you stay because you want to, not because we buried the escape hatch behind a seven-step customer-success flow.',
  },
];

export default function MultipleSample() {
  return (
    <Accordion.Root type="multiple" defaultValue={['profile', 'notifications']}>
      {sections.map((s) => (
        <Accordion.Item key={s.value} value={s.value}>
          <Accordion.Header>
            <Accordion.Trigger>{s.label}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>{s.body}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
