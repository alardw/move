// Generated from Password.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const passwordMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'Password',
  kind: 'primitive',
  anatomy: ['Root'],
  slots: ['root', 'input', 'iconLeft', 'toggle', 'toggleIcon'],
  controlled: {
    pattern: 'value',
  },
  variants: {
    variant: ['outlined', 'filled'],
  },
} satisfies ComponentMeta;
