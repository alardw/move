import { Dialog, Button, Heading, type DialogSize } from 'move';
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
          <Dialog.Header>
            <Dialog.Title>Edit Profile</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="sm" style={{ padding: 0, width: 'var(--move-control-height-sm)' }}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                </svg>
              </Button>
            </Dialog.Close>
          </Dialog.Header>
          <Dialog.Body>
            <Dialog.Description>
              Make changes to your profile here. Click save when you're done.
            </Dialog.Description>
            <Stack direction="column" gap="md">
              <DemoLabel direction="column">
                Name
                <DemoInput defaultValue="John Doe" onFocus={(e) => { const el = e.target; requestAnimationFrame(() => el.setSelectionRange(el.value.length, el.value.length)); }} />
              </DemoLabel>
            </Stack>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.FooterEnd>
              <Dialog.Close asChild>
                <Button variant="secondary">Cancel</Button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Button variant="primary">Save</Button>
              </Dialog.Close>
            </Dialog.FooterEnd>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const sizeDescriptions: Record<DialogSize, string> = {
  sm: 'Compact dialogs for simple confirmations or short messages that don\'t need much space.',
  md: 'The default size, suitable for forms, alerts, and most general-purpose dialogs.',
  lg: 'A wider dialog for content that benefits from extra breathing room — multi-column forms, previews, or detailed information.',
  xl: 'Extra-wide for data-heavy content like tables, comparison views, or complex editing interfaces.',
  full: 'Near-fullscreen width for immersive experiences — document editors, media galleries, or detailed dashboards.',
};

function SizeExample({ size, label }: { size: DialogSize; label: string }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="secondary">{label}</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content size={size}>
          <Dialog.Header>
            <Dialog.Title>Size: {size}</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="sm" style={{ padding: 0, width: 'var(--move-control-height-sm)' }}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                </svg>
              </Button>
            </Dialog.Close>
          </Dialog.Header>
          <Dialog.Body>
            <Dialog.Description>
              {sizeDescriptions[size]}
            </Dialog.Description>
            <Stack direction="column" gap="md">
              <DemoLabel direction="column">
                Full Name
                <DemoInput defaultValue="Jane Doe" />
              </DemoLabel>
              <DemoLabel direction="column">
                Email Address
                <DemoInput defaultValue="jane@example.com" />
              </DemoLabel>
              <DemoLabel direction="column">
                Bio
                <DemoInput defaultValue="Designer & developer" />
              </DemoLabel>
            </Stack>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.FooterEnd>
              <Dialog.Close asChild>
                <Button variant="secondary">Cancel</Button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Button variant="primary">Save</Button>
              </Dialog.Close>
            </Dialog.FooterEnd>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SizesExample() {
  return (
    <Stack direction="row" gap="sm" style={{ flexWrap: 'wrap' }}>
      <SizeExample size="sm" label="Small" />
      <SizeExample size="md" label="Medium (default)" />
      <SizeExample size="lg" label="Large" />
      <SizeExample size="xl" label="Extra Large" />
      <SizeExample size="full" label="Full" />
    </Stack>
  );
}

function FooterSectionsExample() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>Footer Sections</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Confirm Action</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="sm" style={{ padding: 0, width: 'var(--move-control-height-sm)' }}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                </svg>
              </Button>
            </Dialog.Close>
          </Dialog.Header>
          <Dialog.Body>
            <Dialog.Description>
              This dialog shows split footer sections — actions on the left and right.
            </Dialog.Description>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.FooterStart>
              <Button variant="secondary">Help</Button>
            </Dialog.FooterStart>
            <Dialog.FooterEnd>
              <Dialog.Close asChild>
                <Button variant="secondary">Cancel</Button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Button variant="primary">Confirm</Button>
              </Dialog.Close>
            </Dialog.FooterEnd>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
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
      <Dialog.Header>
        <Dialog.Title>Edit Profile</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Dialog.Description>
          Make changes to your profile here.
        </Dialog.Description>
        <label>
          Name
          <input defaultValue="John Doe" />
        </label>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.Close asChild>
          <Button variant="secondary">Cancel</Button>
        </Dialog.Close>
        <Dialog.Close asChild>
          <Button variant="primary">Save</Button>
        </Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'Dialog content width variants',
    component: <SizesExample />,
    code: `import { Dialog, Button } from 'move';

<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button>Open Large Dialog</Button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content size="lg">
      <Dialog.Header>
        <Dialog.Title>Large Dialog</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>...</Dialog.Body>
      <Dialog.Footer>
        <Dialog.FooterEnd>
          <Dialog.Close asChild>
            <Button>Close</Button>
          </Dialog.Close>
        </Dialog.FooterEnd>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>`,
  },
  {
    id: 'footer-sections',
    name: 'Footer Sections',
    description: 'Split footer with start and end sections',
    component: <FooterSectionsExample />,
    code: `import { Dialog, Button } from 'move';

<Dialog.Footer>
  <Dialog.FooterStart>
    <Button variant="secondary">Help</Button>
  </Dialog.FooterStart>
  <Dialog.FooterEnd>
    <Dialog.Close asChild>
      <Button variant="secondary">Cancel</Button>
    </Dialog.Close>
    <Dialog.Close asChild>
      <Button variant="primary">Confirm</Button>
    </Dialog.Close>
  </Dialog.FooterEnd>
</Dialog.Footer>`,
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

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Dialog.Root"
        properties={[
          { name: 'open', type: 'boolean', description: 'Controlled open state.' },
          { name: 'defaultOpen', type: 'boolean', description: 'Whether the dialog is open by default.' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the open state changes.' },
          { name: 'modal', type: 'boolean', description: 'Whether the dialog blocks interaction with the rest of the page.' },
        ]}
      />

      <DocPage.ApiSection
        title="Dialog.Trigger"
        properties={[
          { name: 'asChild', type: 'boolean', description: 'Render as the child element instead of a button.' },
        ]}
      />

      <DocPage.ApiSection
        title="Dialog.Portal"
        properties={[
          { name: 'container', type: 'HTMLElement', description: 'The DOM element to portal the dialog into.' },
        ]}
      />

      <DocPage.ApiSection
        title="Dialog.Content"
        properties={[
          { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", default: "'md'", description: 'Width preset for the dialog.' },
          { name: 'onOpenAutoFocus', type: '(event: Event) => void', description: 'Called when focus moves into the content after opening.' },
        ]}
      />

      <DocPage.ApiSection
        title="Dialog.Close"
        properties={[
          { name: 'asChild', type: 'boolean', description: 'Render as the child element instead of a button.' },
        ]}
      />
    </DocPage.Root>
  );
}
