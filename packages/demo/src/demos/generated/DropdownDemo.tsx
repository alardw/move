// Generated from Dropdown.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import React from 'react';
import { Dropdown, Button } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'overlay:Dropdown',
  name: 'Dropdown',
  category: 'overlay',
  description: 'Context menu dropdown with animated height reveal, staggered item entrance, and sub-menu support via Radix DropdownMenu',
  controls: [
    {
      name: 'sideOffset',
      kind: 'text',
      defaultValue: '4',
    },
    {
      name: 'align',
      kind: 'select',
      options: ['start', 'center', 'end'],
      defaultValue: 'start',
    },
  ],
  initialProps: {
    sideOffset: '4',
    align: 'start',
  },
  sections: [
    {
      id: 'basic',
      label: 'Basic',
      code: `<Dropdown.Root>
  <Dropdown.Trigger asChild>
    <Button variant="secondary">Open Menu</Button>
  </Dropdown.Trigger>
    <Dropdown.Content sideOffset={4}>
      <Dropdown.Label>Actions</Dropdown.Label>
      <Dropdown.Group>
        <Dropdown.Item>New File</Dropdown.Item>
        <Dropdown.Item>Open File</Dropdown.Item>
        <Dropdown.Item>Save</Dropdown.Item>
      </Dropdown.Group>
      <Dropdown.Separator />
      <Dropdown.Item disabled>Print (unavailable)</Dropdown.Item>
    </Dropdown.Content>
</Dropdown.Root>`,
      render: (props) => (
        <div style={{ padding: 40 }}>
          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <Button variant="secondary">Open Menu</Button>
            </Dropdown.Trigger>
              <Dropdown.Content
                sideOffset={Number(props.sideOffset) || 4}
                align={props.align as 'start' | 'center' | 'end'}
              >
                <Dropdown.Label>Actions</Dropdown.Label>
                <Dropdown.Group>
                  <Dropdown.Item>New File</Dropdown.Item>
                  <Dropdown.Item>Open File</Dropdown.Item>
                  <Dropdown.Item>Save</Dropdown.Item>
                </Dropdown.Group>
                <Dropdown.Separator />
                <Dropdown.Item disabled>Print (unavailable)</Dropdown.Item>
              </Dropdown.Content>
          </Dropdown.Root>
        </div>
      ),
    },
    {
      id: 'checkbox',
      label: 'Checkbox Items',
      code: `<Dropdown.Root>
  <Dropdown.Trigger asChild>
    <Button variant="secondary">View Options</Button>
  </Dropdown.Trigger>
    <Dropdown.Content>
      <Dropdown.Label>View</Dropdown.Label>
      <Dropdown.CheckboxItem checked={showToolbar} onCheckedChange={setShowToolbar}>
        Show Toolbar
      </Dropdown.CheckboxItem>
      <Dropdown.CheckboxItem checked={showStatusbar} onCheckedChange={setShowStatusbar}>
        Show Statusbar
      </Dropdown.CheckboxItem>
    </Dropdown.Content>
</Dropdown.Root>`,
      render: () => {
        const [toolbar, setToolbar] = React.useState(true);
        const [statusbar, setStatusbar] = React.useState(false);
        return (
          <div style={{ padding: 40 }}>
            <Dropdown.Root>
              <Dropdown.Trigger asChild>
                <Button variant="secondary">View Options</Button>
              </Dropdown.Trigger>
                <Dropdown.Content sideOffset={4}>
                  <Dropdown.Label>View</Dropdown.Label>
                  <Dropdown.CheckboxItem checked={toolbar} onCheckedChange={setToolbar}>
                    Show Toolbar
                  </Dropdown.CheckboxItem>
                  <Dropdown.CheckboxItem checked={statusbar} onCheckedChange={setStatusbar}>
                    Show Statusbar
                  </Dropdown.CheckboxItem>
                </Dropdown.Content>
            </Dropdown.Root>
          </div>
        );
      },
    },
    {
      id: 'radio',
      label: 'Radio Items',
      code: `<Dropdown.Root>
  <Dropdown.Trigger asChild>
    <Button variant="secondary">Theme</Button>
  </Dropdown.Trigger>
    <Dropdown.Content>
      <Dropdown.Label>Appearance</Dropdown.Label>
      <Dropdown.RadioGroup value={theme} onValueChange={setTheme}>
        <Dropdown.RadioItem value="light">Light</Dropdown.RadioItem>
        <Dropdown.RadioItem value="dark">Dark</Dropdown.RadioItem>
        <Dropdown.RadioItem value="system">System</Dropdown.RadioItem>
      </Dropdown.RadioGroup>
    </Dropdown.Content>
</Dropdown.Root>`,
      render: () => {
        const [theme, setTheme] = React.useState('system');
        return (
          <div style={{ padding: 40 }}>
            <Dropdown.Root>
              <Dropdown.Trigger asChild>
                <Button variant="secondary">Theme: {theme}</Button>
              </Dropdown.Trigger>
                <Dropdown.Content sideOffset={4}>
                  <Dropdown.Label>Appearance</Dropdown.Label>
                  <Dropdown.RadioGroup value={theme} onValueChange={setTheme}>
                    <Dropdown.RadioItem value="light">Light</Dropdown.RadioItem>
                    <Dropdown.RadioItem value="dark">Dark</Dropdown.RadioItem>
                    <Dropdown.RadioItem value="system">System</Dropdown.RadioItem>
                  </Dropdown.RadioGroup>
                </Dropdown.Content>
            </Dropdown.Root>
          </div>
        );
      },
    },
    {
      id: 'submenu',
      label: 'Sub-menu',
      code: `<Dropdown.Root>
  <Dropdown.Trigger asChild>
    <Button variant="secondary">More</Button>
  </Dropdown.Trigger>
    <Dropdown.Content sideOffset={4}>
      <Dropdown.Item>Back</Dropdown.Item>
      <Dropdown.Item>Forward</Dropdown.Item>
      <Dropdown.Separator />
      <Dropdown.Sub>
        <Dropdown.SubTrigger>Share</Dropdown.SubTrigger>
          <Dropdown.SubContent sideOffset={2}>
            <Dropdown.Item>Email</Dropdown.Item>
            <Dropdown.Item>Slack</Dropdown.Item>
            <Dropdown.Item>Copy Link</Dropdown.Item>
          </Dropdown.SubContent>
      </Dropdown.Sub>
    </Dropdown.Content>
</Dropdown.Root>`,
      render: () => (
        <div style={{ padding: 40 }}>
          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <Button variant="secondary">More</Button>
            </Dropdown.Trigger>
              <Dropdown.Content sideOffset={4}>
                <Dropdown.Item>Back</Dropdown.Item>
                <Dropdown.Item>Forward</Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Sub>
                  <Dropdown.SubTrigger>Share &rarr;</Dropdown.SubTrigger>
                    <Dropdown.SubContent sideOffset={2}>
                      <Dropdown.Item>Email</Dropdown.Item>
                      <Dropdown.Item>Slack</Dropdown.Item>
                      <Dropdown.Item>Copy Link</Dropdown.Item>
                    </Dropdown.SubContent>
                </Dropdown.Sub>
              </Dropdown.Content>
          </Dropdown.Root>
        </div>
      ),
    },
  ],
  render: (props) => (
    <div style={{ padding: 40 }}>
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <Button variant="secondary">Open Dropdown</Button>
        </Dropdown.Trigger>
          <Dropdown.Content
            sideOffset={Number(props.sideOffset) || 4}
            align={props.align as 'start' | 'center' | 'end'}
          >
            <Dropdown.Label>Actions</Dropdown.Label>
            <Dropdown.Group>
              <Dropdown.Item>New File</Dropdown.Item>
              <Dropdown.Item>Open File</Dropdown.Item>
              <Dropdown.Item>Save</Dropdown.Item>
            </Dropdown.Group>
            <Dropdown.Separator />
            <Dropdown.Item disabled>Print (unavailable)</Dropdown.Item>
          </Dropdown.Content>
      </Dropdown.Root>
    </div>
  ),
};
