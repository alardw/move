// Generated from Carousel.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const carouselMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'Carousel',
  kind: 'compound',
  anatomy: [
    'Root',
    'Viewport',
    'Slide',
    'PrevTrigger',
    'NextTrigger',
    'IndicatorGroup',
    'Indicator',
  ],
  slots: ['root', 'viewport', 'slide', 'prevTrigger', 'nextTrigger', 'indicatorGroup', 'indicator'],
  controlled: {
    pattern: 'value',
    valueProp: 'page',
    defaultValueProp: 'defaultPage',
    onChangeProp: 'onPageChange',
  },
  variants: {
    orientation: ['horizontal', 'vertical'],
    align: ['start', 'center', 'end'],
    triggerVariant: ['surface', 'ghost', 'solid'],
    triggerSize: ['sm', 'md', 'lg'],
    triggerPlacement: ['none', 'top', 'bottom', 'overlay', 'indicator-sides'],
    indicatorPlacement: ['inside-bottom', 'below'],
  },
} satisfies ComponentMeta;
