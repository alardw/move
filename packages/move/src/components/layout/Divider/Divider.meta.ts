// Generated from Divider.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const dividerMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'Divider',
  kind: 'primitive',
  anatomy: ['Root'],
  slots: ['root', 'content'],
  controlled: {
    pattern: null,
  },
  variants: {
    type: ['solid', 'dashed', 'dotted'],
    align: ['left', 'center', 'right', 'top', 'bottom'],
    size: ['sm', 'md', 'lg'],
  },
  intent: ['layout'],
} satisfies ComponentMeta;
