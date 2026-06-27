import { useState } from 'react';
import {
  Sidebar,
  useSidebarContext,
  Avatar,
  Icon,
  Text,
  Stack,
  Tooltip,
  Dropdown,
  Button,
  Badge,
} from 'move';

const defaultLabels = {
  appName: 'Acme',
  collapse: 'Collapse sidebar',
  expand: 'Expand sidebar',
  home: 'Home',
  chat: 'Chat',
  explore: 'Explore',
  projects: 'Projects',
  settings: 'Settings',
  help: 'Help & FAQ',
  userName: 'Jane Cooper',
  userRole: 'Pro plan',
  profile: 'Profile',
  billing: 'Billing',
  signOut: 'Sign out',
  menu: 'Open menu',
};

type Labels = typeof defaultLabels;

const menuItems = [
  { key: 'home', icon: 'home', labelKey: 'home' as const },
  { key: 'chat', icon: 'message-circle', labelKey: 'chat' as const, badge: '3' },
  { key: 'explore', icon: 'compass', labelKey: 'explore' as const },
  { key: 'projects', icon: 'folder', labelKey: 'projects' as const },
  { key: 'settings', icon: 'settings', labelKey: 'settings' as const },
  { key: 'help', icon: 'help-circle', labelKey: 'help' as const },
];

function SidebarContent({ labels }: { labels: Labels }) {
  const t = labels;
  const { collapsed, toggleCollapsed, isMobile } = useSidebarContext();
  const [active, setActive] = useState('home');

  return (
    <Sidebar.Root>
      <Sidebar.Header
        collapsedChildren={
          <Tooltip label={t.expand} side="right">
            <Button variant="ghost" size="sm" onClick={() => toggleCollapsed()} aria-label={t.expand}>
              <Icon name="hexagon" />
            </Button>
          </Tooltip>
        }
      >
        <Icon name="hexagon" />
        <Text weight="semibold">{t.appName}</Text>
        {!isMobile && (
          <Tooltip label={t.collapse}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleCollapsed()}
              aria-label={collapsed ? t.expand : t.collapse}
              /* recipe-purity-ignore: align the collapse control to the row end — Button/Sidebar.Header expose no end-align prop */
              style={{ marginLeft: 'auto' }}
            >
              <Icon name="panel-left-close" />
            </Button>
          </Tooltip>
        )}
      </Sidebar.Header>

      <Sidebar.Content>
        <Sidebar.Group>
          {menuItems.map((item) => (
            <Sidebar.Item
              key={item.key}
              icon={<Icon name={item.icon} />}
              active={active === item.key}
              onClick={() => setActive(item.key)}
              tooltip={t[item.labelKey]}
              badge={item.badge ? <Badge size="sm" variant="soft" color="red">{item.badge}</Badge> : undefined}
            >
              {t[item.labelKey]}
            </Sidebar.Item>
          ))}
        </Sidebar.Group>
      </Sidebar.Content>

      <Sidebar.Footer>
        <AccountIndicator labels={t} collapsed={collapsed && !isMobile} />
      </Sidebar.Footer>
    </Sidebar.Root>
  );
}

function AccountIndicator({
  labels,
  collapsed,
}: {
  labels: Labels;
  collapsed: boolean;
}) {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        {collapsed ? (
          <Tooltip label={labels.userName} side="right">
            <Button variant="ghost" size="sm" aria-label={labels.userName}>
              <Avatar.Root size="sm" color="indigo">
                <Avatar.Fallback>JC</Avatar.Fallback>
              </Avatar.Root>
            </Button>
          </Tooltip>
        ) : (
          <Button variant="ghost" fullWidth>
            <Stack direction="row" gap="sm" align="center">
              <Avatar.Root size="sm" color="indigo">
                <Avatar.Fallback>JC</Avatar.Fallback>
              </Avatar.Root>
              <Stack gap="none" align="start">
                <Text size="sm" weight="medium">{labels.userName}</Text>
                <Text size="xs" color="muted">{labels.userRole}</Text>
              </Stack>
            </Stack>
          </Button>
        )}
      </Dropdown.Trigger>
      <Dropdown.Content side="top" align="start" sideOffset={8}>
        <Dropdown.Item>
          <Icon name="user" />
          {labels.profile}
        </Dropdown.Item>
        <Dropdown.Item>
          <Icon name="credit-card" />
          {labels.billing}
        </Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item>
          <Icon name="log-out" />
          {labels.signOut}
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

export default function AppSidebar({ labels }: { labels?: Partial<Labels> }) {
  const t = { ...defaultLabels, ...labels };

  return (
    <Sidebar.Provider>
      <Stack direction="row" fill="screen">
        <SidebarContent labels={t} />
        <Stack flex={1} padding="lg">
          <MobileTrigger label={t.menu} />
          <Text color="muted">Main content area</Text>
        </Stack>
      </Stack>
    </Sidebar.Provider>
  );
}

function MobileTrigger({ label }: { label: string }) {
  return (
    <Sidebar.Trigger visibility="mobile" icon={<Icon name="menu" />} aria-label={label} />
  );
}
