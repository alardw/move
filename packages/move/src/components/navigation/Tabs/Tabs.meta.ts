// Generated from Tabs.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const tabsMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'Tabs',
  kind: 'compound',
  anatomy: ['Root', 'List', 'Trigger', 'Content'],
  slots: ['root', 'list', 'indicator', 'trigger', 'content'],
  controlled: {
    pattern: 'value',
  },
  variants: {
    variant: ['underline', 'pills', 'outline'],
    size: ['sm', 'md', 'lg'],
  },
  constraints: {
    supportsAnimation: true,
  },
  intent: ['disclosure'],
} satisfies ComponentMeta;
