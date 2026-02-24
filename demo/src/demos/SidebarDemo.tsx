import { useState } from 'react';
import { Sidebar, Badge, Tooltip, Heading } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import {
  Home, Settings, Users, Mail, Bell, BarChart3,
  FileText, HelpCircle, LogOut, PanelLeftClose, PanelLeftOpen,
  CreditCard, Shield, Hexagon,
} from 'lucide-react';

// Shared container style for demo sandboxing
const containerStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: 400,
  overflow: 'hidden',
  border: '1px solid var(--move-border-base)',
  borderRadius: 'var(--move-rounded-lg)',
  display: 'flex',
};

// ============================================================================
// Usage
// ============================================================================

function UsageExample() {
  return (
    <div style={containerStyle}>
      <Sidebar.Provider defaultCollapsed={false}>
        <Sidebar.Root>
          <Sidebar.Header collapsedChildren={<Tooltip label="App" side="right" sideOffset={8}><Hexagon size={20} /></Tooltip>}>
            <span style={{ fontWeight: 600, fontSize: 'var(--move-size-lg)' }}>App</span>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Main</Sidebar.GroupLabel>
              <Sidebar.Item icon={<Home size={18} />} tooltip="Home" active>Home</Sidebar.Item>
              <Sidebar.Item icon={<BarChart3 size={18} />} tooltip="Analytics">Analytics Dashboard</Sidebar.Item>
              <Sidebar.Item icon={<Users size={18} />} tooltip="Users">User Management</Sidebar.Item>
              <Sidebar.Item icon={<Mail size={18} />} tooltip="Messages">Messages & Notifications</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Settings</Sidebar.GroupLabel>
              <Sidebar.Item icon={<Settings size={18} />} tooltip="Settings">Application Settings</Sidebar.Item>
              <Sidebar.Item icon={<HelpCircle size={18} />} tooltip="Help">Help & Documentation</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>
            <Sidebar.Item icon={<PanelLeftClose size={18} />} tooltip="Show" asChild>
              <Sidebar.Trigger>Hide</Sidebar.Trigger>
            </Sidebar.Item>
          </Sidebar.Footer>
        </Sidebar.Root>
        <div style={{ flex: 1, padding: 'var(--move-spacing-lg)', overflow: 'auto' }}>
          <p style={{ color: 'var(--move-fg-muted)' }}>Main content area</p>
        </div>
      </Sidebar.Provider>
    </div>
  );
}

// ============================================================================
// Collapsed
// ============================================================================

function CollapsedExample() {
  return (
    <div style={containerStyle}>
      <Sidebar.Provider defaultCollapsed={true}>
        <Sidebar.Root>
          <Sidebar.Header collapsedChildren={<Tooltip label="App" side="right" sideOffset={8}><Hexagon size={20} /></Tooltip>}>
            <span style={{ fontWeight: 600, fontSize: 'var(--move-size-lg)' }}>App</span>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.Item icon={<Home size={18} />} tooltip="Home" active>Home</Sidebar.Item>
              <Sidebar.Item icon={<BarChart3 size={18} />} tooltip="Analytics">Analytics</Sidebar.Item>
              <Sidebar.Item icon={<Users size={18} />} tooltip="Users">Users</Sidebar.Item>
              <Sidebar.Item icon={<Mail size={18} />} tooltip="Messages">Messages</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>
            <Sidebar.Item icon={<PanelLeftOpen size={18} />} tooltip="Show" asChild>
              <Sidebar.Trigger>Show</Sidebar.Trigger>
            </Sidebar.Item>
          </Sidebar.Footer>
          <Sidebar.Rail />
        </Sidebar.Root>
        <div style={{ flex: 1, padding: 'var(--move-spacing-lg)', overflow: 'auto' }}>
          <p style={{ color: 'var(--move-fg-muted)' }}>Hover over items to see tooltips. Click the rail or trigger to expand.</p>
        </div>
      </Sidebar.Provider>
    </div>
  );
}

// ============================================================================
// Groups
// ============================================================================

function GroupsExample() {
  return (
    <div style={containerStyle}>
      <Sidebar.Provider>
        <Sidebar.Root>
          <Sidebar.Header collapsedChildren={<Tooltip label="Dashboard" side="right" sideOffset={8}><Hexagon size={20} /></Tooltip>}>
            <span style={{ fontWeight: 600, fontSize: 'var(--move-size-lg)' }}>Dashboard</span>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Overview</Sidebar.GroupLabel>
              <Sidebar.Item icon={<Home size={18} />} tooltip="Home" active>Home</Sidebar.Item>
              <Sidebar.Item icon={<BarChart3 size={18} />} tooltip="Analytics">Analytics</Sidebar.Item>
              <Sidebar.Item icon={<FileText size={18} />} tooltip="Reports">Reports</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Management</Sidebar.GroupLabel>
              <Sidebar.Item icon={<Users size={18} />} tooltip="Team">Team</Sidebar.Item>
              <Sidebar.Item icon={<CreditCard size={18} />} tooltip="Billing">Billing</Sidebar.Item>
              <Sidebar.Item icon={<Shield size={18} />} tooltip="Security">Security</Sidebar.Item>
            </Sidebar.Group>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Support</Sidebar.GroupLabel>
              <Sidebar.Item icon={<HelpCircle size={18} />} tooltip="Help Center">Help Center</Sidebar.Item>
              <Sidebar.Item icon={<Bell size={18} />} tooltip="Notifications" badge={<Badge size="sm">3</Badge>}>
                Notifications
              </Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>
            <Sidebar.Item icon={<LogOut size={18} />} tooltip="Log out">Log out</Sidebar.Item>
          </Sidebar.Footer>
        </Sidebar.Root>
        <div style={{ flex: 1, padding: 'var(--move-spacing-lg)', overflow: 'auto' }}>
          <p style={{ color: 'var(--move-fg-muted)' }}>Grouped navigation with badges</p>
        </div>
      </Sidebar.Provider>
    </div>
  );
}

// ============================================================================
// Router Composition (asChild)
// ============================================================================

function RouterExample() {
  const [active, setActive] = useState('home');

  return (
    <div style={containerStyle}>
      <Sidebar.Provider>
        <Sidebar.Root>
          <Sidebar.Header collapsedChildren={<Tooltip label="App" side="right" sideOffset={8}><Hexagon size={20} /></Tooltip>}>
            <span style={{ fontWeight: 600 }}>App</span>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.Item
                icon={<Home size={18} />}
                tooltip="Home"
                active={active === 'home'}
                asChild
              >
                <a href="#home" onClick={(e) => { e.preventDefault(); setActive('home'); }}>
                  Home
                </a>
              </Sidebar.Item>
              <Sidebar.Item
                icon={<BarChart3 size={18} />}
                tooltip="Analytics"
                active={active === 'analytics'}
                asChild
              >
                <a href="#analytics" onClick={(e) => { e.preventDefault(); setActive('analytics'); }}>
                  Analytics
                </a>
              </Sidebar.Item>
              <Sidebar.Item
                icon={<Settings size={18} />}
                tooltip="Settings"
                active={active === 'settings'}
                asChild
              >
                <a href="#settings" onClick={(e) => { e.preventDefault(); setActive('settings'); }}>
                  Settings
                </a>
              </Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar.Root>
        <div style={{ flex: 1, padding: 'var(--move-spacing-lg)', overflow: 'auto' }}>
          <p style={{ color: 'var(--move-fg-muted)' }}>
            Active route: <strong>{active}</strong>
          </p>
          <p style={{ color: 'var(--move-fg-subtle)', fontSize: 'var(--move-size-sm)', marginTop: 'var(--move-spacing-sm)' }}>
            Items use <code>asChild</code> to compose with anchor tags for router links.
          </p>
        </div>
      </Sidebar.Provider>
    </div>
  );
}

// ============================================================================
// Examples
// ============================================================================

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Basic sidebar with header, content groups, and footer',
    component: <UsageExample />,
    code: `import { Sidebar } from 'move';

<Sidebar.Provider>
  <Sidebar.Root>
    <Sidebar.Header>
      <span>App</span>
    </Sidebar.Header>
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupLabel>Main</Sidebar.GroupLabel>
        <Sidebar.Item icon={<Home />} tooltip="Home" active>
          Home
        </Sidebar.Item>
        <Sidebar.Item icon={<Users />} tooltip="Users">
          Users
        </Sidebar.Item>
      </Sidebar.Group>
    </Sidebar.Content>
    <Sidebar.Footer>
      <Sidebar.Trigger>
        <PanelLeftClose />
      </Sidebar.Trigger>
    </Sidebar.Footer>
  </Sidebar.Root>
  <main>{/* content */}</main>
</Sidebar.Provider>`,
  },
  {
    id: 'collapsed',
    name: 'Collapsed',
    description: 'Icons only with auto-tooltips; rail for re-expanding',
    component: <CollapsedExample />,
    code: `<Sidebar.Provider defaultCollapsed={true}>
  <Sidebar.Root>
    <Sidebar.Content>
      <Sidebar.Item icon={<Home />} tooltip="Home" active>
        Home
      </Sidebar.Item>
    </Sidebar.Content>
    <Sidebar.Footer>
      <Sidebar.Trigger>
        <PanelLeftOpen />
      </Sidebar.Trigger>
    </Sidebar.Footer>
    <Sidebar.Rail />
  </Sidebar.Root>
</Sidebar.Provider>`,
  },
  {
    id: 'groups',
    name: 'Groups',
    description: 'Multiple groups with labels and badges',
    component: <GroupsExample />,
    code: `<Sidebar.Group>
  <Sidebar.GroupLabel>Management</Sidebar.GroupLabel>
  <Sidebar.Item icon={<Users />}>Team</Sidebar.Item>
  <Sidebar.Item icon={<Bell />} badge={<Badge size="sm">3</Badge>}>
    Notifications
  </Sidebar.Item>
</Sidebar.Group>`,
  },
  {
    id: 'router',
    name: 'Router Composition',
    description: 'Use asChild to compose with anchor tags or router links',
    component: <RouterExample />,
    code: `<Sidebar.Item icon={<Home />} tooltip="Home" active asChild>
  <a href="/home">Home</a>
</Sidebar.Item>

<Sidebar.Item icon={<Settings />} tooltip="Settings" asChild>
  <Link to="/settings">Settings</Link>
</Sidebar.Item>`,
  },
];

export function SidebarDemo() {
  return (
    <Tooltip.Provider delayDuration={0}>
      <DocPage.Root defaultExample="usage">
        <DocPage.Header
          title="Sidebar"
          description="Collapsible navigation sidebar with groups, badges, tooltips, and mobile support."
        />
        <DocPage.Examples examples={examples} />

        <Heading level={3}>Parameters</Heading>

        <DocPage.ApiSection
          title="Sidebar.Provider"
          properties={[
            { name: 'collapsed', type: 'boolean', description: 'Controlled collapsed state.' },
            { name: 'defaultCollapsed', type: 'boolean', default: 'false', description: 'Whether the sidebar starts collapsed.' },
            { name: 'onCollapsedChange', type: '(collapsed: boolean) => void', description: 'Called when the collapsed state changes.' },
            { name: 'mobileOpen', type: 'boolean', description: 'Controlled mobile sheet open state.' },
            { name: 'defaultMobileOpen', type: 'boolean', default: 'false', description: 'Whether the mobile sheet is open by default.' },
            { name: 'onMobileOpenChange', type: '(open: boolean) => void', description: 'Called when the mobile sheet open state changes.' },
            { name: 'breakpoint', type: 'number', default: '768', description: 'Viewport width in pixels below which mobile mode activates.' },
            { name: 'animate', type: 'LayerAnimate | false', description: 'Animates Sidebar.Overlay (backdrop opacity fade on mobile).' },
          ]}
        />

        <DocPage.ApiSection
          title="Sidebar.Root"
          properties={[
            { name: 'side', type: "'left' | 'right'", default: "'left'", description: 'Which side of the layout the sidebar appears on.' },
          ]}
        />

        <DocPage.ApiSection
          title="Sidebar.Header"
          properties={[
            { name: 'collapsedChildren', type: 'ReactNode', description: 'Content shown when the sidebar is collapsed.' },
          ]}
        />

        <DocPage.ApiSection
          title="Sidebar.Item"
          properties={[
            { name: 'icon', type: 'ReactNode', description: 'Icon displayed before the label.' },
            { name: 'badge', type: 'ReactNode', description: 'Badge displayed after the label.' },
            { name: 'active', type: 'boolean', description: 'Whether the item is visually active.' },
            { name: 'disabled', type: 'boolean', description: 'Prevents interaction with the item.' },
            { name: 'asChild', type: 'boolean', description: 'Merge props onto the child element instead of rendering a button.' },
            { name: 'tooltip', type: 'ReactNode', description: 'Tooltip shown when the sidebar is collapsed.' },
          ]}
        />

        <DocPage.ApiSection
          title="Sidebar.Trigger"
          properties={[
            { name: 'asChild', type: 'boolean', description: 'Merge props onto the child element instead of rendering a button.' },
          ]}
        />
      </DocPage.Root>
    </Tooltip.Provider>
  );
}
