// Generated from InputText.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const inputTextMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'InputText',
  kind: 'primitive',
  anatomy: ['Root'],
  slots: ['root', 'input', 'iconLeft', 'iconRight'],
  controlled: {
    pattern: null,
  },
  variants: {
    variant: ['outlined', 'filled'],
    size: ['sm', 'md', 'lg'],
  },
  intent: ['input'],
} satisfies ComponentMeta;
