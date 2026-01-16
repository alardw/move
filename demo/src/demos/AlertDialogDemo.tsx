import { AlertDialog, Button } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Playground, usePlayground, toAnimateProp } from '../components/Playground';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button variant="danger">Delete Account</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay />
        <AlertDialog.Content>
          <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
          <AlertDialog.Description>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </AlertDialog.Description>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <AlertDialog.Cancel asChild>
              <Button variant="secondary">Cancel</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant="danger">Yes, delete account</Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

function BouncyExample() {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button variant="primary">Show Bouncy Dialog</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          animate={{
            enter: { opacity: { value: [0, 1], easing: 'outCubic' }, duration: 250 },
            exit: { opacity: { value: [1, 0], easing: 'outCubic' }, duration: 150 },
          }}
        />
        <AlertDialog.Content
          animate={{
            enter: {
              opacity: { value: [0, 1], easing: 'outCubic' },
              scale: { value: [0.85, 1], easing: 'poppy' },
            },
            exit: {
              opacity: { value: [1, 0], easing: 'outQuart' },
              scale: { value: [1, 0.9], easing: 'outQuart' },
              duration: 150,
            },
          }}
        >
          <AlertDialog.Title>Poppy Animation</AlertDialog.Title>
          <AlertDialog.Description>
            This dialog uses a poppy spring for scale - playful but controlled.
            Great for popovers and notifications.
          </AlertDialog.Description>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <AlertDialog.Cancel asChild>
              <Button variant="secondary">Close</Button>
            </AlertDialog.Cancel>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

function SlideUpExample() {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button variant="primary">Show Slide Dialog</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay />
        <AlertDialog.Content
          animate={{
            enter: {
              opacity: { value: [0, 1], easing: 'outQuart' },
              y: { value: [200, 0], easing: 'outQuart' },
              scale: { value: [0.9, 1], easing: 'snappy' },
            },
            exit: {
              opacity: { value: [1, 0], easing: 'outQuart' },
              y: { value: [0, 100], easing: 'outQuart' },
              scale: { value: [1, 0.9], easing: 'outQuart' },
              duration: 150,
            },
          }}
        >
          <AlertDialog.Title>Slide Animation</AlertDialog.Title>
          <AlertDialog.Description>
            This dialog slides up with a smooth spring - professional feel.
            Good for modals and important dialogs.
          </AlertDialog.Description>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <AlertDialog.Cancel asChild>
              <Button variant="secondary">Close</Button>
            </AlertDialog.Cancel>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

// =============================================================================
// Playground Preview Component
// =============================================================================

function PlaygroundPreview() {
  const { targets } = usePlayground();
  const overlayAnimate = toAnimateProp(targets.overlay);
  const contentAnimate = toAnimateProp(targets.content);

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button variant="primary">Open Dialog</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay animate={overlayAnimate} />
        <AlertDialog.Content animate={contentAnimate}>
          <AlertDialog.Title>Playground Dialog</AlertDialog.Title>
          <AlertDialog.Description>
            Adjust the Overlay and Content animation settings below, then reopen this dialog to see the changes.
          </AlertDialog.Description>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <AlertDialog.Cancel asChild>
              <Button variant="secondary">Close</Button>
            </AlertDialog.Cancel>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Overlay fades in/out. Content scales and fades with spring easing.',
    component: <DefaultExample />,
    code: `<AlertDialog.Root>
  <AlertDialog.Trigger asChild>
    <Button variant="danger">Delete Account</Button>
  </AlertDialog.Trigger>
  <AlertDialog.Portal>
    <AlertDialog.Overlay />
    <AlertDialog.Content>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone.
      </AlertDialog.Description>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <AlertDialog.Cancel asChild>
          <Button variant="secondary">Cancel</Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action asChild>
          <Button variant="danger">Yes, delete account</Button>
        </AlertDialog.Action>
      </div>
    </AlertDialog.Content>
  </AlertDialog.Portal>
</AlertDialog.Root>`,
  },
  {
    id: 'poppy',
    name: 'Poppy',
    description: 'Playful poppy spring for scale - great for popovers.',
    component: <BouncyExample />,
    code: `<AlertDialog.Overlay
  animate={{
    enter: { opacity: { value: [0, 1], easing: 'outCubic' }, duration: 250 },
    exit: { opacity: { value: [1, 0], easing: 'outCubic' }, duration: 150 },
  }}
/>
<AlertDialog.Content
  animate={{
    enter: {
      opacity: { value: [0, 1], easing: 'outCubic' },
      scale: { value: [0.85, 1], easing: 'poppy' },
    },
    exit: {
      opacity: { value: [1, 0], easing: 'outQuart' },
      scale: { value: [1, 0.9], easing: 'outQuart' },
      duration: 150,
    },
  }}
>`,
  },
  {
    id: 'slide',
    name: 'Slide Up',
    description: 'Slide up with snappy scale - professional modal feel.',
    component: <SlideUpExample />,
    code: `<AlertDialog.Overlay />
<AlertDialog.Content
  animate={{
    enter: {
      opacity: { value: [0, 1], easing: 'outQuart' },
      y: { value: [200, 0], easing: 'outQuart' },
      scale: { value: [0.9, 1], easing: 'snappy' },
    },
    exit: {
      opacity: { value: [1, 0], easing: 'outQuart' },
      y: { value: [0, 100], easing: 'outQuart' },
      scale: { value: [1, 0.9], easing: 'outQuart' },
      duration: 150,
    },
  }}
>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function AlertDialogDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="AlertDialog"
        description="A modal dialog that interrupts the user with important content and expects a response."
      />

      <DocPage.Examples
        examples={[
          ...examples,
          {
            id: 'playground',
            name: 'Playground',
            description: 'Customize animation settings interactively.',
            component: (
              <Playground.Root>
                <PlaygroundPreview />
                <Playground.Controls>
                  <Playground.TargetSection target="overlay" title="Overlay (Backdrop)" />
                  <Playground.TargetSection target="content" title="Content (Modal)" />
                </Playground.Controls>
              </Playground.Root>
            ),
            code: '',
          },
        ]}
      />
    </DocPage.Root>
  );
}
