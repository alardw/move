// Generated from Button.spec.ts (schemaVersion: 6, specHash: e263843a)
import { Button, Icon } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'core:Button',
  name: 'Button',
  category: 'core',
  description: 'Clickable interactive element with variant, size, and animation support',
  controls: [
    {
      name: 'variant',
      kind: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      defaultValue: 'primary',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
    {
      name: 'disabled',
      kind: 'boolean',
      defaultValue: false,
    },
    {
      name: 'text',
      kind: 'text',
      defaultValue: 'Button',
    },
    {
      name: 'withIcon',
      kind: 'boolean',
      defaultValue: true,
    },
    {
      name: 'icon',
      kind: 'text',
      defaultValue: 'sparkles',
    },
    {
      name: 'iconPosition',
      kind: 'select',
      options: ['left', 'right'],
      defaultValue: 'left',
    },
  ],
  initialProps: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    text: 'Button',
    withIcon: true,
    icon: 'sparkles',
    iconPosition: 'left',
  },
  render: (props) => (
    <Button
      variant={props.variant as string}
      size={props.size as string}
      disabled={props.disabled as boolean}
    >
      {props.withIcon ? (
        props.iconPosition === 'right' ? (
          <>
            <span>{String(props.text ?? 'Button')}</span>
            <Icon name={String(props.icon || 'sparkles')} />
          </>
        ) : (
          <>
            <Icon name={String(props.icon || 'sparkles')} />
            <span>{String(props.text ?? 'Button')}</span>
          </>
        )
      ) : (
        <span>{String(props.text ?? 'Button')}</span>
      )}
    </Button>
  ),
};
