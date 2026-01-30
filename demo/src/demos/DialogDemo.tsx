import { Dialog, Button, MoveProvider } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoLabel, DemoInput } from '../components';

function BasicExample() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>Open Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Edit Profile</Dialog.Title>
          <Dialog.Description>
            Make changes to your profile here. Click save when you're done.
          </Dialog.Description>
          <Stack direction="column" gap="md" className="mt-md">
            <DemoLabel direction="column">
              Name
              <DemoInput defaultValue="John Doe" onFocus={(e) => { const el = e.target; requestAnimationFrame(() => el.setSelectionRange(el.value.length, el.value.length)); }} />
            </DemoLabel>
          </Stack>
          <Stack justify="end" gap="md" className="mt-lg">
            <Dialog.Close asChild>
              <Button variant="secondary">Cancel</Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button variant="primary">Save</Button>
            </Dialog.Close>
          </Stack>
          <Dialog.Close className="dialog-close">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
            </svg>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function PassThroughExample() {
  return (
    <MoveProvider pt={{
      DialogContent: { content: { style: { borderColor: 'var(--move-primary)' } } },
      DialogTitle: { title: { style: { color: 'var(--move-primary)' } } },
    }}>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant="secondary">Dialog with Custom Style</Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Title>Custom Styling Demo</Dialog.Title>
            <Dialog.Description>
              The content border and title color are styled via global custom styles.
              This proves the factory is renderer-agnostic — Radix Dialog runs inside the factory render().
            </Dialog.Description>
            <Stack justify="end" className="mt-lg">
              <Dialog.Close asChild>
                <Button>Close</Button>
              </Dialog.Close>
            </Stack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </MoveProvider>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Import and basic usage',
    component: <BasicExample />,
    code: `import { Dialog, Button } from 'move';\n\n<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button>Open Dialog</Button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title>Edit Profile</Dialog.Title>
      <Dialog.Description>
        Make changes to your profile here. Click save when you're done.
      </Dialog.Description>
      <label>
        Name
        <input defaultValue="John Doe" />
      </label>
      <Dialog.Close asChild>
        <Button variant="secondary">Cancel</Button>
      </Dialog.Close>
      <Dialog.Close asChild>
        <Button variant="primary">Save</Button>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>`,
  },
  {
    id: 'passthrough',
    name: 'Custom Styling',
    description: 'Restyle the dialog from the outside',
    component: <PassThroughExample />,
    code: `<MoveProvider pt={{
  DialogContent: { content: { style: { borderColor: 'var(--move-primary)' } } },
  DialogTitle: { title: { style: { color: 'var(--move-primary)' } } },
}}>
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <Button variant="secondary">Dialog with Custom Style</Button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content>
        <Dialog.Title>Custom Styling Demo</Dialog.Title>
        <Dialog.Description>
          The content border and title color are styled via global custom styles.
        </Dialog.Description>
        <Dialog.Close asChild>
          <Button>Close</Button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
</MoveProvider>`,
  },
];

export function DialogDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Dialog"
        description="A focused overlay for confirmations, forms, and important moments."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
