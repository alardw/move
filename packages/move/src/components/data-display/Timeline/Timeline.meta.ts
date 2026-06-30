// Generated from Timeline.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const timelineMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'Timeline',
  kind: 'compound',
  anatomy: ['Root', 'Item'],
  slots: ['root', 'item', 'bullet', 'line', 'content', 'title'],
  controlled: {
    pattern: null,
  },
  variants: {
    color: ['primary', 'gray', 'success', 'warning', 'danger'],
    lineVariant: ['solid', 'dashed', 'dotted'],
    align: ['left', 'right', 'alternate'],
    size: ['sm', 'md', 'lg'],
  },
  constraints: {
    supportsAnimation: true,
  },
  intent: ['display'],
} satisfies ComponentMeta;
