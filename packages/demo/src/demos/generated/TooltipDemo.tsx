// Generated from Tooltip.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Tooltip, Button } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'core:Tooltip',
  name: 'Tooltip',
  category: 'core',
  description: 'Floating label that appears on hover/focus to describe an element, with spring entrance and direction-aware positioning',
  controls: [
    {
      name: 'label',
      kind: 'text',
      defaultValue: 'Tooltip text',
    },
    {
      name: 'side',
      kind: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      defaultValue: 'top',
    },
    {
      name: 'sideOffset',
      kind: 'text',
      defaultValue: '6',
    },
    {
      name: 'align',
      kind: 'select',
      options: ['start', 'center', 'end'],
      defaultValue: 'center',
    },
    {
      name: 'arrow',
      kind: 'boolean',
      defaultValue: true,
    },
    {
      name: 'delayDuration',
      kind: 'text',
      defaultValue: '700',
    },
  ],
  initialProps: {
    label: 'Tooltip text',
    side: 'top',
    sideOffset: '6',
    align: 'center',
    arrow: true,
    delayDuration: '700',
  },
  sections: [
    {
      id: 'simple',
      label: 'Simple API',
      code: `<Tooltip label="Add to favorites">
  <Button variant="secondary">Hover me</Button>
</Tooltip>`,
      render: (props) => (
        <Tooltip.Provider>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', padding: 40 }}>
            <Tooltip
              label={props.label as string}
              side={props.side as 'top' | 'right' | 'bottom' | 'left'}
              sideOffset={Number(props.sideOffset) || 6}
              align={props.align as 'start' | 'center' | 'end'}
              arrow={props.arrow as boolean}
              delayDuration={Number(props.delayDuration) || 700}
            >
              <Button variant="secondary">Hover me</Button>
            </Tooltip>
          </div>
        </Tooltip.Provider>
      ),
    },
    {
      id: 'sides',
      label: 'All Sides',
      code: `<Tooltip label="Top" side="top"><Button>Top</Button></Tooltip>
<Tooltip label="Right" side="right"><Button>Right</Button></Tooltip>
<Tooltip label="Bottom" side="bottom"><Button>Bottom</Button></Tooltip>
<Tooltip label="Left" side="left"><Button>Left</Button></Tooltip>`,
      render: () => (
        <Tooltip.Provider delayDuration={200}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', padding: 40 }}>
            <Tooltip label="Top tooltip" side="top">
              <Button variant="secondary">Top</Button>
            </Tooltip>
            <Tooltip label="Right tooltip" side="right">
              <Button variant="secondary">Right</Button>
            </Tooltip>
            <Tooltip label="Bottom tooltip" side="bottom">
              <Button variant="secondary">Bottom</Button>
            </Tooltip>
            <Tooltip label="Left tooltip" side="left">
              <Button variant="secondary">Left</Button>
            </Tooltip>
          </div>
        </Tooltip.Provider>
      ),
    },
    {
      id: 'compound',
      label: 'Compound API',
      code: `<Tooltip.Root>
  <Tooltip.Trigger asChild>
    <Button>Hover me</Button>
  </Tooltip.Trigger>
  <Tooltip.Content side="top" sideOffset={6}>
    <Tooltip.Arrow />
    Custom tooltip content
  </Tooltip.Content>
</Tooltip.Root>`,
      render: () => (
        <Tooltip.Provider delayDuration={200}>
          <div style={{ padding: 40 }}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Button variant="secondary">Compound API</Button>
              </Tooltip.Trigger>
              <Tooltip.Content side="top" sideOffset={6}>
                <Tooltip.Arrow />
                Custom tooltip with compound API
              </Tooltip.Content>
            </Tooltip.Root>
          </div>
        </Tooltip.Provider>
      ),
    },
  ],
  render: (props) => (
    <Tooltip.Provider>
      <div style={{ padding: 40 }}>
        <Tooltip
          label={props.label as string}
          side={props.side as 'top' | 'right' | 'bottom' | 'left'}
          sideOffset={Number(props.sideOffset) || 6}
          align={props.align as 'start' | 'center' | 'end'}
          arrow={props.arrow as boolean}
          delayDuration={Number(props.delayDuration) || 700}
        >
          <Button variant="secondary">Hover me</Button>
        </Tooltip>
      </div>
    </Tooltip.Provider>
  ),
};
