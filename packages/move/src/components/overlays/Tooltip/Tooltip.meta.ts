// Generated from Tooltip.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const tooltipMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'Tooltip',
  kind: 'compound',
  anatomy: ['Provider', 'Root', 'Trigger', 'Portal', 'Content', 'Arrow'],
  slots: ['trigger', 'content', 'arrow'],
  controlled: {
    pattern: 'open',
  },
  variants: {},
  constraints: {
    supportsAnimation: true,
  },
  intent: ['feedback'],
} satisfies ComponentMeta;
