// Generated from Popover.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Popover, Button } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'overlay:Popover',
  name: 'Popover',
  category: 'overlay',
  description: 'Floating popup panel anchored to a trigger with close button, arrow, and optional close-on-scroll behavior',
  controls: [
    {
      name: 'side',
      kind: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      defaultValue: 'bottom',
    },
    {
      name: 'sideOffset',
      kind: 'text',
      defaultValue: '8',
    },
    {
      name: 'align',
      kind: 'select',
      options: ['start', 'center', 'end'],
      defaultValue: 'center',
    },
    {
      name: 'modal',
      kind: 'boolean',
      defaultValue: false,
    },
    {
      name: 'closeOnScroll',
      kind: 'boolean',
      defaultValue: false,
    },
  ],
  initialProps: {
    side: 'bottom',
    sideOffset: '8',
    align: 'center',
    modal: false,
    closeOnScroll: false,
  },
  sections: [
    {
      id: 'basic',
      label: 'Basic Popover',
      code: `<Popover.Root>
  <Popover.Trigger asChild>
    <Button variant="secondary">Open Popover</Button>
  </Popover.Trigger>
  <Popover.Portal>
    <Popover.Content side="bottom" sideOffset={8}>
      <Popover.Arrow />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <strong>Popover Title</strong>
        <Popover.Close />
      </div>
      <p>This is the popover content panel.</p>
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>`,
      render: (props) => (
        <div style={{ padding: 60, display: 'flex', justifyContent: 'center' }}>
          <Popover.Root closeOnScroll={props.closeOnScroll as boolean} modal={props.modal as boolean}>
            <Popover.Trigger asChild>
              <Button variant="secondary">Open Popover</Button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                side={props.side as 'top' | 'right' | 'bottom' | 'left'}
                sideOffset={Number(props.sideOffset) || 8}
                align={props.align as 'start' | 'center' | 'end'}
              >
                <Popover.Arrow />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <strong>Popover Title</strong>
                  <Popover.Close />
                </div>
                <p style={{ margin: 0 }}>This is the popover content panel.</p>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      ),
    },
    {
      id: 'sides',
      label: 'All Sides',
      code: `<Popover.Root>
  <Popover.Trigger asChild><Button>Top</Button></Popover.Trigger>
  <Popover.Portal><Popover.Content side="top">Top popover</Popover.Content></Popover.Portal>
</Popover.Root>`,
      render: () => (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: 60, justifyContent: 'center' }}>
          {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
            <Popover.Root key={side}>
              <Popover.Trigger asChild>
                <Button variant="secondary">{side}</Button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content side={side} sideOffset={8}>
                  <Popover.Arrow />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <strong>{side} popover</strong>
                    <Popover.Close />
                  </div>
                  <p style={{ margin: 0 }}>Content positioned on the {side}.</p>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          ))}
        </div>
      ),
    },
    {
      id: 'no-animation',
      label: 'No Animation',
      code: `<Popover.Root animations={false}>
  <Popover.Trigger asChild><Button>No Animation</Button></Popover.Trigger>
  <Popover.Portal>
    <Popover.Content>
      <Popover.Close />
      Instant open/close
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>`,
      render: () => (
        <div style={{ padding: 60, display: 'flex', justifyContent: 'center' }}>
          <Popover.Root animations={false}>
            <Popover.Trigger asChild>
              <Button variant="secondary">No Animation</Button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content sideOffset={8}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <strong>Instant</strong>
                  <Popover.Close />
                </div>
                <p style={{ margin: 0 }}>This popover opens and closes instantly.</p>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      ),
    },
  ],
  render: (props) => (
    <div style={{ padding: 60, display: 'flex', justifyContent: 'center' }}>
      <Popover.Root closeOnScroll={props.closeOnScroll as boolean} modal={props.modal as boolean}>
        <Popover.Trigger asChild>
          <Button variant="secondary">Open Popover</Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            side={props.side as 'top' | 'right' | 'bottom' | 'left'}
            sideOffset={Number(props.sideOffset) || 8}
            align={props.align as 'start' | 'center' | 'end'}
          >
            <Popover.Arrow />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <strong>Popover Title</strong>
              <Popover.Close />
            </div>
            <p style={{ margin: 0 }}>This is the popover content panel with configurable positioning.</p>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  ),
};
