// Generated from TableOfContents.spec.ts (schemaVersion: 7, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const tableOfContentsMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'TableOfContents',
  kind: 'compound',
  anatomy: ['Root', 'Item'],
  slots: ['root', 'item'],
  controlled: { pattern: null },
  variants: {},
  constraints: {
    supportsAnimation: false,
  },
  intent: ['interactive'],
} satisfies ComponentMeta;
