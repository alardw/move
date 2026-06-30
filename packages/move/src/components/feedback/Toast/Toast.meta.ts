// Generated from Toast.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const toastMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'Toast',
  kind: 'compound',
  anatomy: ['Viewport'],
  slots: [
    'viewport',
    'positionContainer',
    'itemWrapper',
    'item',
    'icon',
    'content',
    'message',
    'description',
    'closeButton',
    'progressBar',
  ],
  controlled: {
    pattern: null,
  },
  variants: {
    variant: ['default', 'info', 'success', 'warning', 'error'],
  },
  constraints: {
    supportsAnimation: true,
  },
  intent: ['feedback'],
} satisfies ComponentMeta;
