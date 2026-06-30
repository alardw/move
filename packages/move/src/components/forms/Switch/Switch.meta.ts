// Generated from Switch.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const switchMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'Switch',
  kind: 'compound',
  anatomy: ['Root', 'Thumb'],
  slots: ['root', 'thumb'],
  controlled: {
    pattern: 'checked',
  },
  variants: {
    size: ['sm', 'md', 'lg'],
  },
  constraints: {
    supportsAnimation: true,
  },
  intent: ['input'],
} satisfies ComponentMeta;
