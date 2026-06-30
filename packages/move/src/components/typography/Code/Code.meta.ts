// Generated from Code.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const codeMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'Code',
  kind: 'primitive',
  anatomy: ['Root'],
  slots: ['root'],
  controlled: {
    pattern: null,
  },
  variants: {
    variant: ['subtle', 'outline', 'ghost'],
    size: ['xs', 'sm', 'base', 'lg'],
  },
  intent: ['display'],
} satisfies ComponentMeta;
