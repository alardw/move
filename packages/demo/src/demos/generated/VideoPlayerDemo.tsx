// Generated from VideoPlayer.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { VideoPlayer } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'media:VideoPlayer',
  name: 'VideoPlayer',
  category: 'media',
  description: 'Custom HTML5 video player with glassmorphism controls bar, progress scrubbing, volume, subtitles, playback speed, quality switching, fullscreen, and auto-hiding controls',
  controls: [
    {
      name: 'radius',
      kind: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      defaultValue: 'none',
    },
    {
      name: 'showSettings',
      kind: 'toggle',
      defaultValue: true,
    },
    {
      name: 'showVolume',
      kind: 'toggle',
      defaultValue: true,
    },
    {
      name: 'showFullscreen',
      kind: 'toggle',
      defaultValue: true,
    },
    {
      name: 'showTime',
      kind: 'toggle',
      defaultValue: true,
    },
  ],
  initialProps: {
    radius: 'none',
    showSettings: true,
    showVolume: true,
    showFullscreen: true,
    showTime: true,
  },
  render: (props) => (
    <VideoPlayer
      src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      poster="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
      radius={props.radius as 'none' | 'sm' | 'md' | 'lg'}
      showSettings={props.showSettings as boolean}
      showVolume={props.showVolume as boolean}
      showFullscreen={props.showFullscreen as boolean}
      showTime={props.showTime as boolean}
      width="100%"
      aspectRatio="16/9"
    />
  ),
};
