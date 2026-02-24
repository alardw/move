import { Tabs, Icon, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';


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
];

export function TabsDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Tabs"
        description="Organize content into switchable sections."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="Tabs.Root"
        properties={[
          { name: 'defaultValue', type: 'string', description: 'The value of the tab to select by default.' },
          { name: 'value', type: 'string', description: 'Controlled active tab value.' },
          { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the active tab changes.' },
          { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Orientation of the tab list.' },
          { name: 'dir', type: "'ltr' | 'rtl'", description: 'Reading direction for keyboard navigation.' },
          { name: 'activationMode', type: "'automatic' | 'manual'", default: "'automatic'", description: 'Whether tabs activate on focus or require a click.' },
        ]}
      />

      <DocPage.ApiSection
        title="Tabs.List"
        properties={[
          { name: 'loop', type: 'boolean', description: 'Whether keyboard navigation loops from last to first trigger.' },
          { name: 'animate', type: 'Animation | false', description: 'Animates the active tab indicator (translateX and width spring).' },
        ]}
      />

      <DocPage.ApiSection
        title="Tabs.Trigger"
        properties={[
          { name: 'value', type: 'string', description: 'Value that associates the trigger with a content panel.' },
          { name: 'disabled', type: 'boolean', description: 'Prevents the tab from being activated.' },
        ]}
      />

      <DocPage.ApiSection
        title="Tabs.Content"
        properties={[
          { name: 'value', type: 'string', description: 'Value that associates the content with a trigger.' },
          { name: 'forceMount', type: 'true', description: 'Force mount the content even when the tab is inactive.' },
        ]}
      />
    </DocPage.Root>
  );
}
