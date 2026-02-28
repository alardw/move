import { useState } from 'react';
import { Alert, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

function UsageExample() {
  return (
    <Stack direction="column" gap="md">
      <Alert variant="info" title="New update available">
        A new software update is available for download.
      </Alert>
      <Alert variant="success" title="Payment complete">
        Your payment has been processed successfully.
      </Alert>
      <Alert variant="warning" title="Storage almost full">
        You have used 90% of your storage quota.
      </Alert>
      <Alert variant="danger" title="Connection lost">
        Unable to reach the server. Check your internet connection.
      </Alert>
    </Stack>
  );
}

function ClosableExample() {
  const [alerts, setAlerts] = useState([
    { id: 1, variant: 'info' as const, title: 'Tip', text: 'You can close these alerts.' },
    { id: 2, variant: 'success' as const, title: 'Saved', text: 'Your changes have been saved.' },
    { id: 3, variant: 'warning' as const, title: 'Careful', text: 'This action cannot be undone.' },
  ]);

  return (
    <Stack direction="column" gap="md">
      {alerts.map((a) => (
        <Alert
          key={a.id}
          variant={a.variant}
          title={a.title}
          closable
          onClose={() => setAlerts((prev) => prev.filter((x) => x.id !== a.id))}
        >
          {a.text}
        </Alert>
      ))}
      {alerts.length === 0 && (
        <p style={{ color: 'var(--move-fg-muted)', fontSize: 'var(--move-text-sm)' }}>
          All dismissed.{' '}
          <button
            onClick={() => setAlerts([
              { id: 1, variant: 'info', title: 'Tip', text: 'You can close these alerts.' },
              { id: 2, variant: 'success', title: 'Saved', text: 'Your changes have been saved.' },
              { id: 3, variant: 'warning', title: 'Careful', text: 'This action cannot be undone.' },
            ])}
            style={{ color: 'var(--move-primary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0, font: 'inherit' }}
          >
            Reset
          </button>
        </p>
      )}
    </Stack>
  );
}

function TitleOnlyExample() {
  return (
    <Stack direction="column" gap="md">
      <Alert variant="info" title="Your trial expires in 3 days." />
      <Alert variant="success" title="Account verified." />
    </Stack>
  );
}

function DescriptionOnlyExample() {
  return (
    <Stack direction="column" gap="md">
      <Alert variant="info">Files are being processed. This may take a moment.</Alert>
      <Alert variant="danger">Something went wrong. Please try again later.</Alert>
    </Stack>
  );
}

function CustomIconExample() {
  return (
    <Stack direction="column" gap="md">
      <Alert variant="info" icon="sparkles" title="AI-powered">
        This feature uses machine learning to improve results.
      </Alert>
      <Alert variant="success" icon="rocket" title="Deployed">
        Your application is now live.
      </Alert>
      <Alert variant="info" icon={false} title="No icon">
        You can hide the icon entirely.
      </Alert>
    </Stack>
  );
}

function SizesExample() {
  return (
    <Stack gap="md" style={{ width: '100%' }}>
      <Alert size="sm" variant="info" title="Small alert">
        Compact size for less prominent messages.
      </Alert>
      <Alert size="md" variant="info" title="Medium alert">
        Default size for most use cases.
      </Alert>
      <Alert size="lg" variant="info" title="Large alert">
        Spacious size for important messages.
      </Alert>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'A tone for every message',
    component: <UsageExample />,
    code: `import { Alert } from 'move';

<Alert variant="info" title="New update available">
  A new software update is available for download.
</Alert>
<Alert variant="success" title="Payment complete">
  Your payment has been processed successfully.
</Alert>
<Alert variant="warning" title="Storage almost full">
  You have used 90% of your storage quota.
</Alert>
<Alert variant="danger" title="Connection lost">
  Unable to reach the server. Check your internet connection.
</Alert>`,
  },
  {
    id: 'closable',
    name: 'Closable',
    description: 'Dismiss with a smooth exit',
    component: <ClosableExample />,
    code: `const [visible, setVisible] = useState(true);

{visible && (
  <Alert
    variant="success"
    title="Saved"
    closable
    onClose={() => setVisible(false)}
  >
    Your changes have been saved.
  </Alert>
)}`,
  },
  {
    id: 'title-only',
    name: 'Title Only',
    description: 'Short and to the point',
    component: <TitleOnlyExample />,
    code: `<Alert variant="info" title="Your trial expires in 3 days." />
<Alert variant="success" title="Account verified." />`,
  },
  {
    id: 'description-only',
    name: 'Description Only',
    description: 'When a title feels like too much',
    component: <DescriptionOnlyExample />,
    code: `<Alert variant="info">Files are being processed. This may take a moment.</Alert>
<Alert variant="danger">Something went wrong. Please try again later.</Alert>`,
  },
  {
    id: 'custom-icon',
    name: 'Custom Icons',
    description: 'Pick the perfect icon for the message',
    component: <CustomIconExample />,
    code: `<Alert variant="info" icon="sparkles" title="AI-powered">
  This feature uses machine learning to improve results.
</Alert>
<Alert variant="success" icon="rocket" title="Deployed">
  Your application is now live.
</Alert>
<Alert variant="info" icon={false} title="No icon">
  You can hide the icon entirely.
</Alert>`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'Control the alert density',
    component: <SizesExample />,
    code: `<Alert size="sm" variant="info" title="Small alert">
  Compact size for less prominent messages.
</Alert>
<Alert size="md" variant="info" title="Medium alert">
  Default size for most use cases.
</Alert>
<Alert size="lg" variant="info" title="Large alert">
  Spacious size for important messages.
</Alert>`,
  },
];

export function AlertDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Alert"
        description="Inline feedback messages for important information."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Alert"
        properties={[
          { name: 'variant', type: "'info' | 'success' | 'warning' | 'danger'", default: "'info'", description: 'Visual style indicating the message type.' },
          { name: 'icon', type: 'string | boolean', default: '(auto)', description: 'Icon name, or false to hide. Defaults to a variant-appropriate icon.' },
          { name: 'title', type: 'ReactNode', description: 'Bold heading text for the alert.' },
          { name: 'children', type: 'ReactNode', description: 'Description text displayed below the title.' },
          { name: 'closable', type: 'boolean', default: 'false', description: 'Show a close button to dismiss the alert.' },
          { name: 'onClose', type: '() => void', description: 'Called when the close button is clicked.' },
          { name: 'className', type: 'string', description: 'Additional CSS class.' },
          { name: 'style', type: 'CSSProperties', description: 'Inline styles.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for inner elements: root, icon, content, title, description, close.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Padding and font size density.' },
        ]}
      />
    </DocPage.Root>
  );
}
