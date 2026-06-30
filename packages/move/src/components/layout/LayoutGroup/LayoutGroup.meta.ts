// Generated from LayoutGroup.spec.ts (schemaVersion: 7, specHash: ca963d3b)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const layoutGroupMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'LayoutGroup',
  kind: 'primitive',
  anatomy: ['Root'],
  slots: ['root'],
  controlled: {
    pattern: null,
  },
  variants: {
    enter: ['fade', 'scale', 'fade-scale', 'none'],
    exit: ['fade', 'scale', 'fade-scale', 'none'],
  },
  intent: ['layout'],
} satisfies ComponentMeta;
