// Generated from Stepper.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Stepper } from 'move';
import type { DemoDefinition } from '../types';

const Component = Stepper as any;

export const demo: DemoDefinition = {
  id: 'navigation:Stepper',
  name: 'Stepper',
  category: 'navigation',
  description: 'Multi-step progress indicator with numbered/icon indicators, horizontal/vertical orientation, clickable steps, and status-driven styling',
  controls: [
    {
      name: 'active',
      kind: 'select',
      options: ['0', '1', '2', '3'],
      defaultValue: '1',
    },
    {
      name: 'orientation',
      kind: 'select',
      options: ['horizontal', 'vertical'],
      defaultValue: 'horizontal',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'color',
      kind: 'select',
      options: ['gray', 'red', 'pink', 'grape', 'violet', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange'],
      defaultValue: 'indigo',
    },
  ],
  initialProps: {
    active: '1',
    orientation: 'horizontal',
    size: 'md',
    color: 'indigo',
  },
  render: (props) => {
    const active = Number(props.active) || 0;
    const orientation = (props.orientation as string) || 'horizontal';
    const size = (props.size as string) || 'md';
    const color = (props.color as string) || 'indigo';

    return (
      <Component active={active} orientation={orientation} size={size} color={color}>
        <Component.Step>
          <Component.Indicator />
          <Component.Title>Personal Info</Component.Title>
          <Component.Description>Enter your details</Component.Description>
        </Component.Step>
        <Component.Step>
          <Component.Indicator />
          <Component.Title>Address</Component.Title>
          <Component.Description>Where you live</Component.Description>
        </Component.Step>
        <Component.Step>
          <Component.Indicator />
          <Component.Title>Review</Component.Title>
          <Component.Description>Confirm everything</Component.Description>
        </Component.Step>
        <Component.Step>
          <Component.Indicator />
          <Component.Title>Complete</Component.Title>
          <Component.Description>All done</Component.Description>
        </Component.Step>
      </Component>
    );
  },
};
