// Generated from Popover.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const popoverMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'Popover',
  kind: 'compound',
  anatomy: ['Root', 'Trigger', 'Anchor', 'Portal', 'Content', 'Arrow', 'Close'],
  slots: ['trigger', 'anchor', 'content', 'arrow', 'close'],
  controlled: {
    pattern: 'open',
  },
  variants: {},
  constraints: {
    supportsAnimation: true,
  },
  intent: ['disclosure'],
} satisfies ComponentMeta;
