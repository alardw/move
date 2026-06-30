import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'play',
    text: 'Play, scrub, mute, set volume, full-screen — plus quality switching, audio track switching, subtitle tracks, and a playback-speed menu.',
  },
  {
    icon: 'keyboard',
    text: 'Full keyboard contract — Space to play, F for fullscreen, M to mute, arrows to scrub or adjust volume — same shortcuts as YouTube.',
  },
  {
    icon: 'sliders-horizontal',
    text: 'Every interesting bit is controllable — `playing`, `volume`, `currentTime`, `playbackRate`. Drive the player from app state, sync two players, or build a remote-control UI.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/audio-player',
    name: 'AudioPlayer',
    reason: 'Same control language and keyboard contract, audio-only.',
  },
];

export const meta: ComponentMeta = {
  slug: 'video-player',
  synonyms: ['video', 'media player', 'mp4', 'film', 'stream'],
  name: 'VideoPlayer',
  tagline: 'A video player with the controls you’d expect — play, scrub, fullscreen, quality switching, subtitles, speed — and a real keyboard contract.',
  categories: ['media'],
  badges: [
    { icon: 'mouse-pointer-click', label: 'Interactive' },
  ],
  highlights,
  related,
  importCode: `import { VideoPlayer } from 'move';`,
  keyboard: [
    { key: 'Space / k', action: 'Toggles play and pause.' },
    { key: 'f', action: 'Toggles fullscreen.' },
    { key: 'm', action: 'Toggles mute.' },
    { key: 'Arrow Left / Right', action: 'Seeks back or forward 5 seconds.' },
    { key: 'Arrow Up / Down', action: 'Adjusts volume by 5%.' },
  ],
  accessibilityLede:
    'Each control button carries an `aria-label` you can override per locale via the `labels` object (`labels={{ play, pause, ... }}`). The video element keeps native captions support — pass `subtitles` for VTT tracks.',
};
