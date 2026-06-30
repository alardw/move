// Generated from Alert.spec.ts (schemaVersion: 6, specHash: b9fbaaa9)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const alertMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'Alert',
  kind: 'primitive',
  anatomy: ['Root'],
  slots: ['root', 'icon', 'content', 'title', 'description', 'close'],
  controlled: {
    pattern: null,
  },
  variants: {
    variant: ['info', 'success', 'warning', 'danger'],
    size: ['sm', 'md', 'lg'],
  },
  constraints: {
    supportsAnimation: true,
  },
  intent: ['feedback'],
} satisfies ComponentMeta;
