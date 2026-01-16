import { useState, useRef } from 'react';
import { Toast, Button } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(0);

  return (
    <Toast.Provider swipeDirection="right">
      <Button
        onClick={() => {
          setOpen(false);
          window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => {
            setOpen(true);
          }, 100);
        }}
      >
        Add to calendar
      </Button>
      <Toast.Root className="toast-root" open={open} onOpenChange={setOpen}>
        <Toast.Title className="toast-title">Scheduled: Catch up</Toast.Title>
        <Toast.Description className="toast-description">
          Friday, February 10, 2024 at 5:57 PM
        </Toast.Description>
        <Toast.Action className="toast-action" asChild altText="Undo">
          <Button variant="secondary" size="sm">Undo</Button>
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport className="toast-viewport" />
    </Toast.Provider>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Toast notification with action button.',
    component: <DefaultExample />,
    code: `<Toast.Provider swipeDirection="right">
  <Button onClick={() => setOpen(true)}>Show Toast</Button>
  <Toast.Root open={open} onOpenChange={setOpen}>
    <Toast.Title>Scheduled: Catch up</Toast.Title>
    <Toast.Description>
      Friday, February 10, 2024 at 5:57 PM
    </Toast.Description>
    <Toast.Action asChild altText="Undo">
      <Button variant="secondary" size="sm">Undo</Button>
    </Toast.Action>
  </Toast.Root>
  <Toast.Viewport />
</Toast.Provider>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function ToastDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="Toast"
        description="A brief notification that appears temporarily."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
