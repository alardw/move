import { useState } from 'react';
import { Button, toast, Heading } from 'move';
import type { ToastPosition } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

const positions: ToastPosition[] = [
  'top-right',
  'top-left',
  'top-center',
  'bottom-right',
  'bottom-left',
  'bottom-center',
];

function UsageExample() {
  return (
    <Stack direction="column" gap="lg">
      <Stack direction="row" gap="md" wrap>
        <Button onClick={() => toast('Default notification')}>
          Default
        </Button>
        <Button onClick={() => toast.info('Deployment started', { description: 'Your app is being built and deployed.' })}>
          Info
        </Button>
        <Button onClick={() => toast.success('Changes saved', { description: 'All changes have been saved.' })}>
          Success
        </Button>
        <Button onClick={() => toast.warning('API rate limit', { description: 'You are approaching the rate limit.' })}>
          Warning
        </Button>
        <Button onClick={() => toast.error('Connection lost', { description: 'Unable to reach the server.' })}>
          Error
        </Button>
      </Stack>
    </Stack>
  );
}

function PositionExample() {
  const [position, setPosition] = useState<ToastPosition>('bottom-right');

  return (
    <Stack direction="column" gap="md">
      <Stack direction="row" gap="sm" wrap>
        {positions.map((pos) => (
          <Button
            key={pos}
            variant={pos === position ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setPosition(pos)}
          >
            {pos}
          </Button>
        ))}
      </Stack>
      <Button onClick={() => toast.info('Position test', { position, description: `Showing at ${position}` })}>
        Show toast
      </Button>
    </Stack>
  );
}

function DismissExample() {
  const [lastId, setLastId] = useState<string | null>(null);

  return (
    <Stack direction="row" gap="md" wrap>
      <Button
        onClick={() => {
          const id = toast.success('Persistent toast', { duration: 0, description: 'This toast will not auto-dismiss.' });
          setLastId(id);
        }}
      >
        Create persistent toast
      </Button>
      <Button
        variant="secondary"
        onClick={() => { if (lastId) toast.dismiss(lastId); }}
      >
        Dismiss last
      </Button>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Trigger toasts with different variants using the imperative toast() API.',
    component: <UsageExample />,
    code: `import { toast } from 'move';

// Default
toast('Default notification');

// With variant + description
toast.info('Deployment started', {
  description: 'Your app is being built and deployed.',
});

toast.success('Changes saved');
toast.warning('API rate limit');
toast.error('Connection lost');`,
  },
  {
    id: 'positions',
    name: 'Positions',
    description: 'Toasts can appear at six different screen positions.',
    component: <PositionExample />,
    code: `import { toast } from 'move';

toast.info('Hello', {
  position: 'top-right',   // default: 'bottom-right'
});

// Available: 'top-right' | 'top-left' | 'top-center'
//          | 'bottom-right' | 'bottom-left' | 'bottom-center'`,
  },
  {
    id: 'dismiss',
    name: 'Dismiss',
    description: 'Programmatically dismiss toasts by ID. Set duration to 0 for persistent toasts.',
    component: <DismissExample />,
    code: `import { toast } from 'move';

// Create a persistent toast (no auto-dismiss)
const id = toast.success('Persistent toast', { duration: 0 });

// Dismiss it later
toast.dismiss(id);`,
  },
];

export function ToastDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Toast"
        description="Temporary notifications that appear at screen edges. Imperative API with auto-dismiss, pause on hover, and variant styling."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="toast(message, options?)"
        properties={[
          { name: 'message', type: 'string', description: 'The main text content of the toast.' },
          { name: 'variant', type: "'default' | 'info' | 'success' | 'warning' | 'error'", default: "'default'", description: 'Visual style of the toast.' },
          { name: 'description', type: 'string', description: 'Secondary text shown below the message.' },
          { name: 'duration', type: 'number', default: '5000', description: 'Auto-dismiss delay in milliseconds. Set to 0 to disable.' },
          { name: 'position', type: "'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center'", default: "'bottom-right'", description: 'Screen position where the toast appears.' },
        ]}
      />

      <DocPage.ApiSection
        title="Toast.Viewport"
        properties={[
          { name: 'animate', type: 'LayerAnimate | false', description: 'Animates each toast notification (position-dependent slide, opacity, and scale on enter/exit).' },
        ]}
      />
    </DocPage.Root>
  );
}
