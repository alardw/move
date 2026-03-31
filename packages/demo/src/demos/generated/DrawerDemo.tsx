// Generated from Drawer.spec.ts (schemaVersion: 7, specHash: PLACEHOLDER)
import React from 'react';
import { Drawer, Button } from 'move';
import type { DemoDefinition } from '../types';

function DrawerPlayground(props: Record<string, unknown>) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer.Root open={open} onOpenChange={setOpen} position={props.position as 'left' | 'right' | 'top' | 'bottom'} responsive={props.responsive as boolean}>
        <Drawer.Portal>
          <Drawer.Overlay />
          <Drawer.Content size={props.size as 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'}>
            <Drawer.Header>
              <Drawer.Title>Drawer Title</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <p>Drawer body content goes here. Resize the viewport to see responsive behavior.</p>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close asChild>
                <Button variant="secondary">Cancel</Button>
              </Drawer.Close>
              <Button>Save</Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}

export const demo: DemoDefinition = {
  id: 'overlay:Drawer',
  name: 'Drawer',
  category: 'overlay',
  description: 'Slide-in panel from any edge with overlay backdrop, responsive auto-switching to bottom sheet on mobile',
  controls: [
    {
      name: 'position',
      kind: 'select',
      options: ['left', 'right', 'top', 'bottom'],
      defaultValue: 'right',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'full'],
      defaultValue: 'md',
    },
    {
      name: 'responsive',
      kind: 'boolean',
      defaultValue: true,
    },
  ],
  initialProps: {
    position: 'right',
    size: 'md',
    responsive: true,
  },
  render: (props) => <DrawerPlayground {...props} />,
};
