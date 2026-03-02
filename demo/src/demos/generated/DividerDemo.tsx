// Generated from Divider.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Divider } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'panel:Divider',
  name: 'Divider',
  category: 'panel',
  description: 'Visual separator for content sections with optional inline label, orientation, line style, and alignment',
  controls: [
    {
      name: 'orientation',
      kind: 'select',
      options: ['horizontal', 'vertical'],
      defaultValue: 'horizontal',
    },
    {
      name: 'type',
      kind: 'select',
      options: ['solid', 'dashed', 'dotted'],
      defaultValue: 'solid',
    },
    {
      name: 'align',
      kind: 'select',
      options: ['left', 'center', 'right', 'top', 'bottom'],
      defaultValue: 'center',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'sm',
    },
    {
      name: 'children',
      kind: 'text',
      defaultValue: '',
    },
  ],
  initialProps: {
    orientation: 'horizontal',
    type: 'solid',
    align: 'center',
    size: 'sm',
    children: '',
  },
  render: (props) => (
    <div style={props.orientation === 'vertical' ? { display: 'flex', height: 200 } : undefined}>
      <Divider
        orientation={props.orientation as 'horizontal' | 'vertical'}
        type={props.type as 'solid' | 'dashed' | 'dotted'}
        align={props.align as 'left' | 'center' | 'right' | 'top' | 'bottom'}
        size={props.size as 'sm' | 'md' | 'lg'}
      >
        {(props.children as string) || undefined}
      </Divider>
    </div>
  ),
};
