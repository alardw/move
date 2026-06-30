// Generated from Pagination.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const paginationMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'Pagination',
  kind: 'compound',
  anatomy: ['Root', 'PrevTrigger', 'NextTrigger', 'Items'],
  slots: ['root', 'prev', 'next', 'items', 'item', 'ellipsis', 'indicator'],
  controlled: {
    pattern: null,
  },
  variants: {
    size: ['sm', 'md', 'lg'],
    variant: ['default', 'outline'],
  },
  constraints: {
    requiresParent: 'Pagination.Root',
  },
} satisfies ComponentMeta;
