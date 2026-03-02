// Generated from AudioPlayer.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { AudioPlayer } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'media:AudioPlayer',
  name: 'AudioPlayer',
  category: 'media',
  description: 'Horizontal bar-style audio player with play/pause, progress, volume, and settings controls',
  controls: [
    {
      name: 'radius',
      kind: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
      defaultValue: 'md',
    },
    {
      name: 'size',
      kind: 'select',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'md',
    },
  ],
  initialProps: {
    radius: 'md',
    size: 'md',
  },
  render: (props) => (
    <AudioPlayer
      src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      radius={props.radius as 'none' | 'sm' | 'md' | 'lg' | 'full'}
      size={props.size as 'sm' | 'md' | 'lg'}
    />
  ),
};
