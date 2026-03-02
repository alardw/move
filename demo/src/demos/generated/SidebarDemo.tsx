// Generated from Sidebar.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Sidebar } from 'move';
import type { DemoDefinition } from '../types';

const Component = Sidebar as any;

export const demo: DemoDefinition = {
  id: 'panel:Sidebar',
  name: 'Sidebar',
  category: 'panel',
  description: 'Collapsible navigation sidebar with icon-only mode, mobile portal overlay, item tooltips, and staggered entrance animations',
  controls: [
    {
      name: 'sample',
      kind: 'select',
      options: ['default', 'collapsed', 'withBadges', 'rightSide'],
      defaultValue: 'default',
    },
  ],
  initialProps: {
    sample: 'default',
  },
  subComponents: [
    {
      name: 'Provider',
      controls: [
        {
          name: 'defaultCollapsed',
          kind: 'select',
          options: ['false', 'true'],
          defaultValue: 'false',
        },
      ],
      initialProps: {
        defaultCollapsed: 'false',
      },
      children: [
        {
          name: 'Root',
          controls: [
            {
              name: 'side',
              kind: 'select',
              options: ['left', 'right'],
              defaultValue: 'left',
            },
          ],
          initialProps: {
            side: 'left',
          },
          children: [
            {
              name: 'Header',
              optional: true,
              defaultEnabled: true,
              controls: [
                { name: 'text', kind: 'text', defaultValue: 'My App' },
              ],
              initialProps: { text: 'My App' },
            },
            {
              name: 'Content',
              optional: true,
              defaultEnabled: true,
              controls: [],
              initialProps: {},
              children: [
                {
                  name: 'Group',
                  optional: true,
                  defaultEnabled: true,
                  controls: [],
                  initialProps: {},
                  children: [
                    {
                      name: 'GroupLabel',
                      optional: true,
                      defaultEnabled: true,
                      controls: [
                        { name: 'text', kind: 'text', defaultValue: 'Navigation' },
                      ],
                      initialProps: { text: 'Navigation' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'Footer',
              optional: true,
              defaultEnabled: true,
              controls: [
                { name: 'text', kind: 'text', defaultValue: 'User' },
              ],
              initialProps: { text: 'User' },
            },
          ],
        },
      ],
    },
  ],
  render: (props) => {
    const sample = String(props.sample ?? 'default');
    const isCollapsed = sample === 'collapsed';
    const isRight = sample === 'rightSide';
    const showBadges = sample === 'withBadges';

    return (
      <div style={{ display: 'flex', height: 400, border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
        <Component.Provider defaultCollapsed={isCollapsed}>
          <Component.Root side={isRight ? 'right' : 'left'}>
            <Component.Header>
              <span style={{ fontWeight: 'bold' }}>My App</span>
            </Component.Header>
            <Component.Content>
              <Component.Group>
                <Component.GroupLabel>Navigation</Component.GroupLabel>
                <Component.Item icon={<span>H</span>} active tooltip="Home">
                  Home
                </Component.Item>
                <Component.Item
                  icon={<span>D</span>}
                  tooltip="Dashboard"
                  badge={showBadges ? <span style={{ background: '#ef4444', color: '#fff', borderRadius: 9999, padding: '0 6px', fontSize: 11 }}>5</span> : undefined}
                >
                  Dashboard
                </Component.Item>
                <Component.Item icon={<span>S</span>} tooltip="Settings">
                  Settings
                </Component.Item>
              </Component.Group>
              <Component.Group>
                <Component.GroupLabel>Account</Component.GroupLabel>
                <Component.Item icon={<span>P</span>} tooltip="Profile">
                  Profile
                </Component.Item>
                <Component.Item icon={<span>B</span>} disabled tooltip="Billing">
                  Billing
                </Component.Item>
              </Component.Group>
            </Component.Content>
            <Component.Footer>
              <Component.Item icon={<span>U</span>} tooltip="User">
                User
              </Component.Item>
            </Component.Footer>
            <Component.Rail />
          </Component.Root>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <Component.Trigger style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: 6, cursor: 'pointer', background: 'transparent' }}>
              Toggle Sidebar
            </Component.Trigger>
          </div>
        </Component.Provider>
      </div>
    );
  },
};
