// Generated from Loader.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const loaderMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'Loader',
  kind: 'primitive',
  anatomy: ['Root'],
  slots: ['root', 'svg', 'circle', 'dot'],
  controlled: {
    pattern: null,
  },
  variants: {
    variant: ['spinner', 'dots'],
    color: ['primary', 'secondary', 'current'],
    size: ['sm', 'md', 'lg'],
  },
  intent: ['feedback'],
} satisfies ComponentMeta;
