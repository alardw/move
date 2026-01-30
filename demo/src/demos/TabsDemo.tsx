import { Tabs, Icon, MoveProvider } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

function UsageExample() {
  return (
    <Tabs.Root defaultValue="account">
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="password">Password</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">
        Manage your account settings and preferences.
      </Tabs.Content>
      <Tabs.Content value="password">
        Change your password and security options.
      </Tabs.Content>
    </Tabs.Root>
  );
}

function MultipleTabsExample() {
  return (
    <Tabs.Root defaultValue="overview">
      <Tabs.List>
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
        <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
        <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">
        A summary of your project activity.
      </Tabs.Content>
      <Tabs.Content value="analytics">
        Detailed analytics and metrics.
      </Tabs.Content>
      <Tabs.Content value="reports">
        Generated reports and exports.
      </Tabs.Content>
      <Tabs.Content value="notifications">
        Notification preferences and history.
      </Tabs.Content>
    </Tabs.Root>
  );
}

function WithIconsExample() {
  return (
    <Tabs.Root defaultValue="music">
      <Tabs.List>
        <Tabs.Trigger value="music">
          <Stack gap="xs" align="center">
            <Icon name="music" size="sm" />
            Music
          </Stack>
        </Tabs.Trigger>
        <Tabs.Trigger value="photos">
          <Stack gap="xs" align="center">
            <Icon name="image" size="sm" />
            Photos
          </Stack>
        </Tabs.Trigger>
        <Tabs.Trigger value="videos">
          <Stack gap="xs" align="center">
            <Icon name="video" size="sm" />
            Videos
          </Stack>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="music">
        Your music library and playlists.
      </Tabs.Content>
      <Tabs.Content value="photos">
        Your photo albums and collections.
      </Tabs.Content>
      <Tabs.Content value="videos">
        Your video library and recordings.
      </Tabs.Content>
    </Tabs.Root>
  );
}

function DisabledExample() {
  return (
    <Tabs.Root defaultValue="active">
      <Tabs.List>
        <Tabs.Trigger value="active">Active</Tabs.Trigger>
        <Tabs.Trigger value="disabled" disabled>Disabled</Tabs.Trigger>
        <Tabs.Trigger value="archived">Archived</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="active">
        Active items are shown here.
      </Tabs.Content>
      <Tabs.Content value="disabled">
        This tab is disabled.
      </Tabs.Content>
      <Tabs.Content value="archived">
        Archived items are shown here.
      </Tabs.Content>
    </Tabs.Root>
  );
}

function CustomStylingExample() {
  return (
    <MoveProvider pt={{
      TabsList: { list: { style: { borderBottom: '2px solid var(--move-primary-subtle)', gap: '0.5rem' } } },
      TabsTrigger: { trigger: { style: { borderRadius: '6px 6px 0 0', padding: '0.5rem 1rem' } } },
    }}>
      <Tabs.Root defaultValue="design">
        <Tabs.List>
          <Tabs.Trigger value="design">Design</Tabs.Trigger>
          <Tabs.Trigger value="code">Code</Tabs.Trigger>
          <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="design">
          Visual design tools and assets.
        </Tabs.Content>
        <Tabs.Content value="code">
          Source code and implementation.
        </Tabs.Content>
        <Tabs.Content value="preview">
          Live preview of your work.
        </Tabs.Content>
      </Tabs.Root>
    </MoveProvider>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Import and basic usage',
    component: <UsageExample />,
    code: `import { Tabs } from 'move';

<Tabs.Root defaultValue="account">
  <Tabs.List>
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="password">Password</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">
    Manage your account settings and preferences.
  </Tabs.Content>
  <Tabs.Content value="password">
    Change your password and security options.
  </Tabs.Content>
</Tabs.Root>`,
  },
  {
    id: 'multiple',
    name: 'Multiple Tabs',
    description: 'As many tabs as you need',
    component: <MultipleTabsExample />,
    code: `<Tabs.Root defaultValue="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
    <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
    <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="overview">
    A summary of your project activity.
  </Tabs.Content>
  <Tabs.Content value="analytics">
    Detailed analytics and metrics.
  </Tabs.Content>
  <Tabs.Content value="reports">
    Generated reports and exports.
  </Tabs.Content>
  <Tabs.Content value="notifications">
    Notification preferences and history.
  </Tabs.Content>
</Tabs.Root>`,
  },
  {
    id: 'with-icons',
    name: 'With Icons',
    description: 'Pair icons with labels for clarity',
    component: <WithIconsExample />,
    code: `<Tabs.Root defaultValue="music">
  <Tabs.List>
    <Tabs.Trigger value="music">
      <Icon name="music" size="sm" /> Music
    </Tabs.Trigger>
    <Tabs.Trigger value="photos">
      <Icon name="image" size="sm" /> Photos
    </Tabs.Trigger>
    <Tabs.Trigger value="videos">
      <Icon name="video" size="sm" /> Videos
    </Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="music">
    Your music library and playlists.
  </Tabs.Content>
  <Tabs.Content value="photos">
    Your photo albums and collections.
  </Tabs.Content>
  <Tabs.Content value="videos">
    Your video library and recordings.
  </Tabs.Content>
</Tabs.Root>`,
  },
  {
    id: 'disabled',
    name: 'Disabled',
    description: 'Lock tabs that aren\'t ready yet',
    component: <DisabledExample />,
    code: `<Tabs.Root defaultValue="active">
  <Tabs.List>
    <Tabs.Trigger value="active">Active</Tabs.Trigger>
    <Tabs.Trigger value="disabled" disabled>Disabled</Tabs.Trigger>
    <Tabs.Trigger value="archived">Archived</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="active">
    Active items are shown here.
  </Tabs.Content>
  <Tabs.Content value="archived">
    Archived items are shown here.
  </Tabs.Content>
</Tabs.Root>`,
  },
  {
    id: 'custom-styling',
    name: 'Custom Styling',
    description: 'Restyle tabs globally or per instance',
    component: <CustomStylingExample />,
    code: `<MoveProvider pt={{
  TabsList: { list: { style: { borderBottom: '2px solid var(--move-primary-subtle)', gap: '0.5rem' } } },
  TabsTrigger: { trigger: { style: { borderRadius: '6px 6px 0 0', padding: '0.5rem 1rem' } } },
}}>
  <Tabs.Root defaultValue="design">
    <Tabs.List>
      <Tabs.Trigger value="design">Design</Tabs.Trigger>
      <Tabs.Trigger value="code">Code</Tabs.Trigger>
      <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="design">
      Visual design tools and assets.
    </Tabs.Content>
    <Tabs.Content value="code">
      Source code and implementation.
    </Tabs.Content>
    <Tabs.Content value="preview">
      Live preview of your work.
    </Tabs.Content>
  </Tabs.Root>
</MoveProvider>`,
  },
];

export function TabsDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Tabs"
        description="Organize content into switchable sections."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
