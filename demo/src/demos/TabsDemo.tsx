import { Tabs } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function DefaultExample() {
  return (
    <Tabs.Root className="tabs-root" defaultValue="account">
      <Tabs.List className="tabs-list">
        <Tabs.Trigger className="tabs-trigger" value="account">Account</Tabs.Trigger>
        <Tabs.Trigger className="tabs-trigger" value="password">Password</Tabs.Trigger>
        <Tabs.Trigger className="tabs-trigger" value="settings">Settings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content className="tabs-content" value="account">
        <p style={{ margin: 0 }}>
          Make changes to your account here. Click save when you're done.
        </p>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Name</label>
            <input className="demo-input" defaultValue="John Doe" style={{ width: 300 }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Username</label>
            <input className="demo-input" defaultValue="@johndoe" style={{ width: 300 }} />
          </div>
        </div>
      </Tabs.Content>
      <Tabs.Content className="tabs-content" value="password">
        <p style={{ margin: 0 }}>
          Change your password here. After saving, you'll be logged out.
        </p>
      </Tabs.Content>
      <Tabs.Content className="tabs-content" value="settings">
        <p style={{ margin: 0 }}>
          Manage your account settings and preferences.
        </p>
      </Tabs.Content>
    </Tabs.Root>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Tabbed interface with content panels.',
    component: <DefaultExample />,
    code: `<Tabs.Root defaultValue="account">
  <Tabs.List>
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="password">Password</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">
    Make changes to your account here.
  </Tabs.Content>
  <Tabs.Content value="password">
    Change your password here.
  </Tabs.Content>
</Tabs.Root>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function TabsDemo() {
  return (
    <DocPage.Root defaultExample="default">
      <DocPage.Header
        title="Tabs"
        description="Organizes content into multiple sections with tab navigation."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
