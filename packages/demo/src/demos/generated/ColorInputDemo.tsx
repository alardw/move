// Generated from ColorInput.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import React from 'react';
import { ColorInput } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'form:ColorInput',
  name: 'ColorInput',
  category: 'form',
  description: 'Form input with color preview swatch that opens a ColorPicker popover.',
  controls: [
    { name: 'variant', kind: 'select', options: ['outlined', 'filled'], defaultValue: 'outlined' },
    { name: 'size', kind: 'select', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
    { name: 'format', kind: 'select', options: ['hex', 'hexa', 'rgb', 'rgba', 'hsl', 'hsla'], defaultValue: 'hex' },
    { name: 'withPicker', kind: 'boolean', defaultValue: true },
    { name: 'disabled', kind: 'boolean', defaultValue: false },
    { name: 'readOnly', kind: 'boolean', defaultValue: false },
    { name: 'invalid', kind: 'boolean', defaultValue: false },
    { name: 'defaultValue', kind: 'text', defaultValue: '#3b82f6' },
    { name: 'placeholder', kind: 'text', defaultValue: 'Pick a color' },
  ],
  initialProps: {
    variant: 'outlined',
    size: 'md',
    format: 'hex',
    withPicker: true,
    disabled: false,
    readOnly: false,
    invalid: false,
    defaultValue: '#3b82f6',
    placeholder: 'Pick a color',
  },
  sections: [
    {
      id: 'consumer',
      label: 'Usage',
      render: () => (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'start' }}>
          <ColorInput defaultValue="#3b82f6" placeholder="Hex color" />
          <ColorInput defaultValue="#ef4444" format="rgb" placeholder="RGB color" />
          <ColorInput defaultValue="#10b981" variant="filled" placeholder="Filled" />
        </div>
      ),
      code: `<ColorInput defaultValue="#3b82f6" placeholder="Hex color" />
<ColorInput defaultValue="#ef4444" format="rgb" placeholder="RGB color" />
<ColorInput defaultValue="#10b981" variant="filled" placeholder="Filled" />`,
    },
    {
      id: 'playground',
      label: 'Playground',
      render: (props) => (
        <ColorInput
          variant={props.variant as 'outlined' | 'filled'}
          size={props.size as 'sm' | 'md' | 'lg'}
          format={props.format as 'hex'}
          withPicker={props.withPicker as boolean}
          disabled={props.disabled as boolean}
          readOnly={props.readOnly as boolean}
          invalid={props.invalid as boolean}
          defaultValue={props.defaultValue as string}
          placeholder={props.placeholder as string}
        />
      ),
      code: (props) => `<ColorInput
  variant="${props.variant}"
  size="${props.size}"
  format="${props.format}"${props.disabled ? '\n  disabled' : ''}${props.readOnly ? '\n  readOnly' : ''}${props.invalid ? '\n  invalid' : ''}
  defaultValue="${props.defaultValue}"
  placeholder="${props.placeholder}"
/>`,
    },
  ],
  render: (props) => (
    <ColorInput
      variant={props.variant as 'outlined' | 'filled'}
      size={props.size as 'sm' | 'md' | 'lg'}
      format={props.format as 'hex'}
      withPicker={props.withPicker as boolean}
      disabled={props.disabled as boolean}
      readOnly={props.readOnly as boolean}
      invalid={props.invalid as boolean}
      defaultValue={props.defaultValue as string}
      placeholder={props.placeholder as string}
    />
  ),
};
