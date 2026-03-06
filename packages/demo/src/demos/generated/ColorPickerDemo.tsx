// Generated from ColorPicker.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import React from 'react';
import { ColorPicker } from 'move';
import type { DemoDefinition } from '../types';

const SAMPLE_SWATCHES = [
  '#ff0000', '#ff8800', '#ffff00', '#00ff00',
  '#00ffff', '#0000ff', '#8800ff', '#ff00ff',
  '#ffffff', '#cccccc', '#888888', '#444444',
  '#000000', '#ff6b6b',
];

export const demo: DemoDefinition = {
  id: 'form:ColorPicker',
  name: 'ColorPicker',
  category: 'form',
  description: 'Standalone color picker with saturation/brightness area, hue and alpha sliders, color swatches, format selector, and per-channel inputs.',
  controls: [
    { name: 'size', kind: 'select', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
    { name: 'format', kind: 'select', options: ['hex', 'hexa', 'rgb', 'rgba', 'hsl', 'hsla'], defaultValue: 'hex' },
    { name: 'withPicker', kind: 'boolean', defaultValue: true },
    { name: 'fullWidth', kind: 'boolean', defaultValue: false },
    { name: 'disabled', kind: 'boolean', defaultValue: false },
    { name: 'readOnly', kind: 'boolean', defaultValue: false },
    { name: 'defaultValue', kind: 'text', defaultValue: '#3b82f6' },
    { name: 'swatchesPerRow', kind: 'number', defaultValue: 7 },
    { name: 'showSwatches', kind: 'boolean', defaultValue: true },
  ],
  initialProps: {
    size: 'md',
    format: 'hex',
    withPicker: true,
    fullWidth: false,
    disabled: false,
    readOnly: false,
    defaultValue: '#3b82f6',
    swatchesPerRow: 7,
    showSwatches: true,
  },
  sections: [
    {
      id: 'consumer',
      label: 'Usage',
      render: () => (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ marginBottom: '0.5rem', fontWeight: 500 }}>Basic</p>
            <ColorPicker defaultValue="#3b82f6" />
          </div>
          <div>
            <p style={{ marginBottom: '0.5rem', fontWeight: 500 }}>With Swatches</p>
            <ColorPicker
              defaultValue="#ff6b6b"
              swatches={SAMPLE_SWATCHES}
              swatchesPerRow={7}
            />
          </div>
          <div>
            <p style={{ marginBottom: '0.5rem', fontWeight: 500 }}>RGBA Format</p>
            <ColorPicker defaultValue="#3b82f6" format="rgba" />
          </div>
        </div>
      ),
      code: `<ColorPicker defaultValue="#3b82f6" />

<ColorPicker
  defaultValue="#ff6b6b"
  swatches={['#ff0000', '#00ff00', '#0000ff', '#ffff00']}
  swatchesPerRow={7}
/>

<ColorPicker defaultValue="#3b82f6" format="rgba" />`,
    },
    {
      id: 'playground',
      label: 'Playground',
      render: (props) => (
        <ColorPicker
          size={props.size as 'sm' | 'md' | 'lg'}
          format={props.format as 'hex'}
          withPicker={props.withPicker as boolean}
          fullWidth={props.fullWidth as boolean}
          disabled={props.disabled as boolean}
          readOnly={props.readOnly as boolean}
          defaultValue={props.defaultValue as string}
          swatches={props.showSwatches ? SAMPLE_SWATCHES : undefined}
          swatchesPerRow={props.swatchesPerRow as number}
        />
      ),
      code: (props) => `<ColorPicker
  size="${props.size}"
  format="${props.format}"${props.withPicker === false ? '\n  withPicker={false}' : ''}${props.fullWidth ? '\n  fullWidth' : ''}${props.disabled ? '\n  disabled' : ''}${props.readOnly ? '\n  readOnly' : ''}
  defaultValue="${props.defaultValue}"${props.showSwatches ? `\n  swatches={[...]}
  swatchesPerRow={${props.swatchesPerRow}}` : ''}
/>`,
    },
  ],
  render: (props) => (
    <ColorPicker
      size={props.size as 'sm' | 'md' | 'lg'}
      format={props.format as 'hex'}
      withPicker={props.withPicker as boolean}
      fullWidth={props.fullWidth as boolean}
      disabled={props.disabled as boolean}
      readOnly={props.readOnly as boolean}
      defaultValue={props.defaultValue as string}
      swatches={props.showSwatches ? SAMPLE_SWATCHES : undefined}
      swatchesPerRow={props.swatchesPerRow as number}
    />
  ),
};
