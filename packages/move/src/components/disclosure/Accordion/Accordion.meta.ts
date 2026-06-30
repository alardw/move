// Generated from Accordion.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const accordionMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'Accordion',
  kind: 'compound',
  anatomy: ['Root', 'Item', 'Header', 'Trigger', 'Content'],
  slots: ['root', 'item', 'header', 'trigger', 'icon', 'content', 'contentInner'],
  controlled: {
    pattern: 'value',
  },
  variants: {
    variant: ['default', 'contained', 'ghost'],
    size: ['sm', 'md', 'lg'],
  },
  constraints: {
    supportsAnimation: true,
  },
  intent: ['disclosure'],
} satisfies ComponentMeta;
