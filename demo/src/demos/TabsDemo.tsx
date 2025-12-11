import { Tabs } from 'move';

export function TabsDemo() {
  return (
    <div className="demo-section">
      <h3>Tabs</h3>
      <div className="demo-box">
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
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Current password</label>
                <input className="demo-input" type="password" style={{ width: 300 }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>New password</label>
                <input className="demo-input" type="password" style={{ width: 300 }} />
              </div>
            </div>
          </Tabs.Content>
          <Tabs.Content className="tabs-content" value="settings">
            <p style={{ margin: 0 }}>
              Manage your account settings and preferences.
            </p>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}
