// Generated from ColorPicker.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const colorPickerMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'ColorPicker',
  kind: 'primitive',
  anatomy: ['Root'],
  slots: [
    'root',
    'saturation',
    'hue',
    'alpha',
    'swatches',
    'inputRow',
    'formatSelect',
    'channelInput',
    'alphaInput',
  ],
  controlled: {
    pattern: 'value',
  },
  variants: {},
  constraints: {},
  intent: ['input'],
} satisfies ComponentMeta;
