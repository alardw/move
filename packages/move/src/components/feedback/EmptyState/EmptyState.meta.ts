// Generated from EmptyState.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const emptyStateMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'EmptyState',
  kind: 'primitive',
  anatomy: ['Root'],
  slots: ['root', 'icon', 'title', 'description', 'action'],
  controlled: {
    pattern: null,
  },
  variants: {
    size: ['sm', 'md', 'lg'],
  },
  intent: ['display'],
} satisfies ComponentMeta;
