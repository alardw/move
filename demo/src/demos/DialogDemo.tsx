import { Dialog, Button, Icon } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>Edit Profile</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <Dialog.Title className="dialog-title">Edit profile</Dialog.Title>
          <Dialog.Description className="dialog-description">
            Make changes to your profile here. Click save when you're done.
          </Dialog.Description>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Name</label>
              <input className="demo-input" defaultValue="John Doe" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Username</label>
              <input className="demo-input" defaultValue="@johndoe" style={{ width: '100%' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <Dialog.Close asChild>
              <Button>Save changes</Button>
            </Dialog.Close>
          </div>
          <Dialog.Close className="dialog-close">
            <Icon name="x" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Modal dialog with form inputs.',
    component: <DefaultExample />,
    code: `<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button>Edit Profile</Button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title>Edit profile</Dialog.Title>
      <Dialog.Description>
        Make changes to your profile here.
      </Dialog.Description>
      <Dialog.Close asChild>
        <Button>Save changes</Button>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function DialogDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="Dialog"
        description="A modal window that appears on top of the main content."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
