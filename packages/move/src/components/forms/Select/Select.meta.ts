// Generated from Select.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const selectMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'Select',
  kind: 'compound',
  anatomy: [
    'Root',
    'Trigger',
    'Value',
    'Icon',
    'Portal',
    'Content',
    'Viewport',
    'Item',
    'Group',
    'Label',
    'Separator',
  ],
  slots: [
    'trigger',
    'value',
    'icon',
    'content',
    'contentInner',
    'viewport',
    'item',
    'group',
    'label',
    'separator',
  ],
  controlled: {
    pattern: 'value',
  },
  variants: {
    variant: ['outlined', 'filled'],
    size: ['sm', 'md', 'lg'],
  },
  constraints: {
    supportsAnimation: true,
  },
  intent: ['input', 'selection'],
} satisfies ComponentMeta;
