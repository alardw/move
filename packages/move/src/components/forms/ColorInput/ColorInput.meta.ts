// Generated from ColorInput.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const colorInputMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'ColorInput',
  kind: 'primitive',
  anatomy: ['Root'],
  slots: ['root', 'swatch', 'input', 'content', 'contentInner'],
  controlled: {
    pattern: 'value',
  },
  variants: {
    variant: ['outlined', 'filled'],
  },
  constraints: {
    supportsAnimation: true,
  },
  intent: ['input'],
} satisfies ComponentMeta;
