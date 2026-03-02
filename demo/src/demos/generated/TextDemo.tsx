// Generated from Text.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { Text } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'core:Text',
  name: 'Text',
  category: 'core',
  description: 'Typography primitive with configurable element, size, weight, color, alignment, and truncation',
  controls: [
    {
      name: 'as',
      kind: 'select',
      options: ['p', 'span', 'div', 'em', 'strong', 'small', 'del'],
      defaultValue: 'p',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['xs', 'sm', 'base', 'lg', 'xl'],
      defaultValue: 'base',
    },
    {
      name: 'weight',
      kind: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
      defaultValue: 'normal',
    },
    {
      name: 'color',
      kind: 'select',
      options: ['base', 'muted', 'subtle', 'primary', 'success', 'warning', 'error'],
      defaultValue: 'base',
    },
    {
      name: 'align',
      kind: 'select',
      options: ['left', 'center', 'right'],
      defaultValue: 'left',
    },
    {
      name: 'truncate',
      kind: 'boolean',
      defaultValue: false,
    },
    {
      name: 'children',
      kind: 'text',
      defaultValue: 'The quick brown fox jumps over the lazy dog.',
    },
  ],
  initialProps: {
    as: 'p',
    size: 'base',
    weight: 'normal',
    color: 'base',
    align: 'left',
    truncate: false,
    children: 'The quick brown fox jumps over the lazy dog.',
  },
  sections: [
    {
      id: 'consumer',
      label: 'Consumer Samples',
      code: `// sizes
<Text size="xs">Extra small text</Text>
<Text size="sm">Small text</Text>
<Text size="base">Base text</Text>
<Text size="lg">Large text</Text>
<Text size="xl">Extra large text</Text>

// colors
<Text color="muted">Muted text</Text>
<Text color="primary">Primary text</Text>
<Text color="error">Error text</Text>

// truncation
<Text truncate>This text will be truncated if it overflows...</Text>`,
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Text size="xs">Extra small text</Text>
          <Text size="sm">Small text</Text>
          <Text size="base">Base text (default)</Text>
          <Text size="lg">Large text</Text>
          <Text size="xl">Extra large text</Text>
          <div style={{ borderTop: '1px solid #eee', paddingTop: 12 }} />
          <Text color="muted">Muted text</Text>
          <Text color="subtle">Subtle text</Text>
          <Text color="primary">Primary text</Text>
          <Text color="success">Success text</Text>
          <Text color="warning">Warning text</Text>
          <Text color="error">Error text</Text>
          <div style={{ borderTop: '1px solid #eee', paddingTop: 12 }} />
          <Text weight="normal">Normal weight</Text>
          <Text weight="medium">Medium weight</Text>
          <Text weight="semibold">Semibold weight</Text>
          <Text weight="bold">Bold weight</Text>
          <div style={{ borderTop: '1px solid #eee', paddingTop: 12 }} />
          <div style={{ maxWidth: 200 }}>
            <Text truncate>This text will be truncated because it is too long for the container</Text>
          </div>
        </div>
      ),
    },
    {
      id: 'playground',
      label: 'Props Playground',
      code: (props) => {
        const as = String(props.as ?? 'p');
        const size = String(props.size ?? 'base');
        const weight = String(props.weight ?? 'normal');
        const color = String(props.color ?? 'base');
        const align = String(props.align ?? 'left');
        const truncate = Boolean(props.truncate);
        const children = String(props.children ?? 'The quick brown fox jumps over the lazy dog.');

        const propsStr = [
          as !== 'p' ? `as="${as}"` : '',
          size !== 'base' ? `size="${size}"` : '',
          weight !== 'normal' ? `weight="${weight}"` : '',
          color !== 'base' ? `color="${color}"` : '',
          align ? `align="${align}"` : '',
          truncate ? 'truncate' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return `<Text${propsStr ? ` ${propsStr}` : ''}>
  ${children}
</Text>`;
      },
      render: (props) => (
        <Text
          as={props.as as string}
          size={props.size as string}
          weight={props.weight as string}
          color={props.color as string}
          align={props.align as string}
          truncate={props.truncate as boolean}
        >
          {props.children as string}
        </Text>
      ),
    },
  ],
  render: (props) => (
    <Text
      as={props.as as string}
      size={props.size as string}
      weight={props.weight as string}
      color={props.color as string}
      align={props.align as string}
      truncate={props.truncate as boolean}
    >
      {props.children as string}
    </Text>
  ),
};
