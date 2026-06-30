// Generated from Label.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const labelMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'Label',
  kind: 'primitive',
  anatomy: ['Root'],
  slots: ['root', 'asterisk'],
  controlled: {
    pattern: null,
  },
  variants: {
    size: ['sm', 'md', 'lg'],
  },
  intent: ['display'],
} satisfies ComponentMeta;
