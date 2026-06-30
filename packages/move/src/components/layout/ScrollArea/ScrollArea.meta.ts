// Generated from ScrollArea.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const scrollAreaMeta = {
  schemaVersion: META_SCHEMA_VERSION,

  name: 'ScrollArea',

  kind: 'compound',

  anatomy: ['Root', 'Header', 'Content', 'Footer'],

  slots: ['root', 'header', 'content', 'footer'],

  controlled: {
    pattern: null,
  },

  variants: {},

  intent: ['display'],
} satisfies ComponentMeta;
