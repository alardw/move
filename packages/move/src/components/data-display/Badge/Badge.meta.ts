// Generated from Badge.spec.ts (schemaVersion: 6, specHash: ddc033c4)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const badgeMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'Badge',
  kind: 'primitive',
  anatomy: ['Root'],
  slots: ['root'],
  controlled: {
    pattern: null,
  },
  variants: {
    variant: ['primary', 'secondary', 'outline', 'success', 'warning', 'danger'],
    size: ['sm', 'md', 'lg'],
  },
  intent: ['display'],
} satisfies ComponentMeta;
