import { EmptyState, Button, MoveProvider } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

function UsageExample() {
  return (
    <EmptyState
      icon="inbox"
      title="No messages"
      description="You're all caught up. New messages will appear here."
    />
  );
}

function WithActionExample() {
  return (
    <EmptyState
      icon="file-plus"
      title="No documents yet"
      description="Create your first document to get started."
      action={<Button variant="primary" size="sm">Create Document</Button>}
    />
  );
}

function SizesExample() {
  return (
    <Stack direction="column" gap="lg">
      <div style={{ border: '1px dashed var(--move-border-base)', borderRadius: 'var(--move-rounded-md)' }}>
        <EmptyState
          size="sm"
          icon="search"
          title="No results"
          description="Try a different search term."
        />
      </div>
      <div style={{ border: '1px dashed var(--move-border-base)', borderRadius: 'var(--move-rounded-md)' }}>
        <EmptyState
          size="md"
          icon="search"
          title="No results"
          description="Try a different search term."
        />
      </div>
      <div style={{ border: '1px dashed var(--move-border-base)', borderRadius: 'var(--move-rounded-md)' }}>
        <EmptyState
          size="lg"
          icon="search"
          title="No results"
          description="Try a different search term."
        />
      </div>
    </Stack>
  );
}

function VariousIconsExample() {
  return (
    <Stack direction="column" gap="lg">
      <EmptyState
        icon="users"
        title="No team members"
        description="Invite people to collaborate on this project."
        action={<Button variant="primary" size="sm">Invite People</Button>}
      />
      <EmptyState
        icon="image"
        title="No photos"
        description="Upload images to build your gallery."
        action={<Button variant="secondary" size="sm">Upload Photos</Button>}
      />
      <EmptyState
        icon="bell-off"
        title="No notifications"
        description="You're all caught up. Check back later."
      />
    </Stack>
  );
}

function CustomStylingExample() {
  return (
    <MoveProvider slotProps={{ EmptyState: { root: { style: { backgroundColor: 'var(--move-bg-subtle)', borderRadius: 'var(--move-rounded-lg)' } } } }}>
      <Stack gap="md" direction="column">
        <EmptyState
          icon="package"
          title="No orders"
          description="Your order history will show up here."
        />
        <EmptyState
          icon="folder-open"
          title="Folder is empty"
          description="Drop files here or create new ones."
          sp={{ root: { style: { backgroundColor: 'var(--move-primary-subtle)' } } }}
        />
      </Stack>
    </MoveProvider>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Import and basic usage',
    component: <UsageExample />,
    code: `import { EmptyState } from 'move';

<EmptyState
  icon="inbox"
  title="No messages"
  description="You're all caught up. New messages will appear here."
/>`,
  },
  {
    id: 'with-action',
    name: 'With Action',
    description: 'Guide users to the next step',
    component: <WithActionExample />,
    code: `<EmptyState
  icon="file-plus"
  title="No documents yet"
  description="Create your first document to get started."
  action={<Button variant="primary" size="sm">Create Document</Button>}
/>`,
  },
  {
    id: 'sizes',
    name: 'Sizes',
    description: 'From compact to spacious',
    component: <SizesExample />,
    code: `<EmptyState size="sm" icon="search" title="No results" description="Try a different search term." />
<EmptyState size="md" icon="search" title="No results" description="Try a different search term." />
<EmptyState size="lg" icon="search" title="No results" description="Try a different search term." />`,
  },
  {
    id: 'various-icons',
    name: 'Various Icons',
    description: 'An icon for every scenario',
    component: <VariousIconsExample />,
    code: `<EmptyState
  icon="users"
  title="No team members"
  description="Invite people to collaborate on this project."
  action={<Button variant="primary" size="sm">Invite People</Button>}
/>
<EmptyState
  icon="image"
  title="No photos"
  description="Upload images to build your gallery."
  action={<Button variant="secondary" size="sm">Upload Photos</Button>}
/>
<EmptyState
  icon="bell-off"
  title="No notifications"
  description="You're all caught up. Check back later."
/>`,
  },
  {
    id: 'custom-styling',
    name: 'Custom Styling',
    description: 'Tweak styles globally or per instance',
    component: <CustomStylingExample />,
    code: `<MoveProvider slotProps={{ EmptyState: { root: { style: { backgroundColor: 'var(--move-bg-subtle)', borderRadius: 'var(--move-rounded-lg)' } } } }}>
  <EmptyState icon="package" title="No orders" description="Your order history will show up here." />
  <EmptyState
    icon="folder-open"
    title="Folder is empty"
    description="Drop files here or create new ones."
    sp={{ root: { style: { backgroundColor: 'var(--move-primary-subtle)' } } }}
  />
</MoveProvider>`,
  },
];

export function EmptyStateDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="EmptyState"
        description="A friendly placeholder for when there's nothing to show yet."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
