// Generated from Dialog.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const dialogMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'Dialog',
  kind: 'compound',
  anatomy: [
    'Root',
    'Trigger',
    'Portal',
    'Overlay',
    'Content',
    'Header',
    'Body',
    'Footer',
    'FooterStart',
    'FooterEnd',
    'Title',
    'Description',
    'Close',
  ],
  slots: [
    'trigger',
    'overlay',
    'content',
    'header',
    'body',
    'footer',
    'footerStart',
    'footerEnd',
    'title',
    'description',
    'close',
  ],
  controlled: {
    pattern: 'open',
  },
  variants: {
    size: ['sm', 'md', 'lg', 'xl', 'full'],
  },
  constraints: {
    supportsAnimation: true,
  },
  intent: ['disclosure'],
} satisfies ComponentMeta;
