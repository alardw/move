import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'play',
    text: 'Play, scrub, mute, set volume, switch quality, pick a subtitle track — all the controls a podcast or audio sample actually needs, in a single horizontal bar.',
  },
  {
    icon: 'keyboard',
    text: 'Space and `k` toggle play; `m` mutes; arrows scrub and adjust volume — full keyboard contract out of the box, no extra wiring.',
  },
  {
    icon: 'sliders-horizontal',
    text: 'Every interesting bit is controllable — `playing`, `volume`, `currentTime`, `playbackRate` — so you can drive the player from app state, or sync two players together for an A/B comparison.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/video-player',
    name: 'VideoPlayer',
    reason: 'Same control language and keyboard contract, with a video surface and full-screen support.',
  },
  {
    to: '/components/slider',
    name: 'Slider',
    reason: 'For generic value-on-a-track controls — volume bars, brightness, opacity. AudioPlayer’s scrubber is purpose-built and not exposed standalone.',
  },
];

export const meta: ComponentMeta = {
  slug: 'audio-player',
  name: 'AudioPlayer',
  tagline: 'A horizontal audio bar with everything you’d expect — play, scrub, volume, speed, subtitles, source switching. Keyboard works the way you’d hope.',
  categories: ['media'],
  badges: [
    { icon: 'mouse-pointer-click', label: 'Interactive' },
  ],
  highlights,
  related,
  importCode: `import { AudioPlayer } from 'move';`,
  keyboard: [
    { key: 'Space / k', action: 'Toggles play and pause.' },
    { key: 'm', action: 'Toggles mute.' },
    { key: 'Arrow Left / Right', action: 'Seeks back or forward 5 seconds.' },
    { key: 'Arrow Up / Down', action: 'Adjusts volume by 5%.' },
    { key: 'Tab', action: 'Moves focus through the controls (play, scrubber, volume, settings, subtitles).' },
  ],
  accessibilityLede:
    'Each control button carries an `aria-label` you can override per-locale via the `labels` object (`labels={{ play, pause, mute, ... }}`). The root takes focus so the keyboard shortcuts work without clicking a control first.',
};
