// Generated from AudioPlayer.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { META_SCHEMA_VERSION } from '@/meta-schema';
import type { ComponentMeta } from '@/meta-schema';

export const audioPlayerMeta = {
  schemaVersion: META_SCHEMA_VERSION,
  name: 'AudioPlayer',
  kind: 'primitive',
  anatomy: ['Root'],
  slots: [
    'root',
    'playButton',
    'progress',
    'time',
    'volumeButton',
    'volumeSlider',
    'settingsButton',
    'subtitleButton',
    'subtitleOverlay',
  ],
  controlled: {
    pattern: null,
  },
  variants: {
    radius: ['none', 'sm', 'md', 'lg', 'full'],
    size: ['sm', 'md', 'lg'],
  },
} satisfies ComponentMeta;
