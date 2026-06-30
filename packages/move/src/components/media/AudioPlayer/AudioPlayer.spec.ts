// AudioPlayer.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'AudioPlayer',
  componentClass: 'interactive' as const,
  category: 'media',
  description:
    'Horizontal bar-style audio player with play/pause, progress scrubbing, volume control, subtitle overlay, playback speed, and settings menu',

  synonyms: ['audio', 'sound', 'mp3', 'podcast', 'audio control', 'media', 'player'],
  families: {
    behavior: ['media'],
    state: ['controlled-value'],
    a11y: ['none'],
  },

  compound: false,
  rootElement: 'div',
  slots: [
    {
      name: 'root',
      element: 'div',
      description: 'Outer container with flex layout, background, and keyboard event handling',
    },
    {
      name: 'playButton',
      element: 'button',
      description: 'Play/pause toggle button rendered via Button component',
    },
    {
      name: 'progress',
      element: 'div',
      description: 'Progress bar container with track, buffered, fill, and draggable thumb',
    },
    { name: 'time', element: 'span', description: 'Time display showing current time / duration' },
    {
      name: 'volumeButton',
      element: 'button',
      description: 'Mute/unmute toggle button rendered via Button component',
    },
    { name: 'volumeSlider', element: 'div', description: 'Volume slider with track and fill' },
    {
      name: 'settingsButton',
      element: 'button',
      description: 'Settings menu trigger button rendered via Button component',
    },
    {
      name: 'subtitleButton',
      element: 'button',
      description: 'Subtitle toggle button rendered via Button component',
    },
    {
      name: 'subtitleOverlay',
      element: 'div',
      description: 'Subtitle cue text overlay positioned above the player bar',
    },
  ],

  props: [
    { name: 'src', type: 'string', moveSpecific: true, description: 'Audio source URL' },
    {
      name: 'autoPlay',
      type: 'boolean',
      moveSpecific: true,
      description: 'Start playback automatically',
    },
    { name: 'muted', type: 'boolean', moveSpecific: true, description: 'Start muted' },
    { name: 'loop', type: 'boolean', moveSpecific: true, description: 'Loop playback' },
    {
      name: 'playbackRate',
      type: 'number',
      moveSpecific: true,
      description: 'Controlled playback speed',
    },
    {
      name: 'onPlaybackRateChange',
      type: '(rate: number) => void',
      moveSpecific: true,
      description: 'Called when playback rate changes',
    },
    {
      name: 'playing',
      type: 'boolean',
      moveSpecific: true,
      description: 'Controlled playing state',
    },
    {
      name: 'onPlayingChange',
      type: '(playing: boolean) => void',
      moveSpecific: true,
      description: 'Called when playing state changes',
    },
    { name: 'volume', type: 'number', moveSpecific: true, description: 'Controlled volume (0-1)' },
    {
      name: 'onVolumeChange',
      type: '(volume: number) => void',
      moveSpecific: true,
      description: 'Called when volume changes',
    },
    {
      name: 'currentTime',
      type: 'number',
      moveSpecific: true,
      description: 'Controlled current playback time in seconds',
    },
    {
      name: 'onTimeChange',
      type: '(time: number) => void',
      moveSpecific: true,
      description: 'Called when current time changes',
    },
    {
      name: 'onEnded',
      type: '() => void',
      moveSpecific: true,
      description: 'Called when playback ends',
    },
    {
      name: 'onError',
      type: '(error: MediaError | null) => void',
      moveSpecific: true,
      description: 'Called on playback error',
    },
    {
      name: 'onReady',
      type: '() => void',
      moveSpecific: true,
      description: 'Called when audio metadata is loaded and ready',
    },
    {
      name: 'subtitles',
      type: 'SubtitleTrack[]',
      moveSpecific: true,
      description: 'Array of subtitle/caption tracks (VTT files)',
    },
    {
      name: 'qualities',
      type: 'QualityOption[]',
      moveSpecific: true,
      description: 'Array of quality options for source switching',
    },
    {
      name: 'audioTracks',
      type: 'AudioTrack[]',
      moveSpecific: true,
      description: 'Array of audio track options for source switching',
    },
    {
      name: 'onQualityChange',
      type: '(quality: QualityOption) => void',
      moveSpecific: true,
      description: 'Called when quality is changed',
    },
    {
      name: 'onAudioTrackChange',
      type: '(track: AudioTrack) => void',
      moveSpecific: true,
      description: 'Called when audio track is changed',
    },
    {
      name: 'showSettings',
      type: 'boolean',
      default: 'true',
      moveSpecific: true,
      description: 'Show the settings menu button',
    },
    {
      name: 'showSubtitles',
      type: 'boolean',
      default: 'true',
      moveSpecific: true,
      description: 'Show the subtitles toggle button (only if subtitles are provided)',
    },
    {
      name: 'showVolume',
      type: 'boolean',
      default: 'true',
      moveSpecific: true,
      description: 'Show volume button and slider',
    },
    {
      name: 'showTime',
      type: 'boolean',
      default: 'true',
      moveSpecific: true,
      description: 'Show the time display',
    },
    {
      name: 'labels',
      type: 'Partial<AudioPlayerLabels>',
      moveSpecific: true,
      description: 'i18n labels for the player controls',
    },
    {
      name: 'radius',
      typeRef: 'Radius',
      default: "'none'",
      moveSpecific: true,
      description: 'Border radius of the player container',
    },
    {
      name: 'size',
      typeRef: 'Size',
      default: "'md'",
      moveSpecific: true,
      description: 'Size variant controlling padding, gap, and control button dimensions',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description: 'Additional content rendered inside the player container',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-radius', 'data-size'],
    ariaAttributes: ['tabIndex'],
    children: [
      { slot: 'subtitleOverlay' },
      { slot: 'playButton' },
      { slot: 'progress' },
      { slot: 'time' },
      { slot: 'subtitleButton', dataAttributes: ['data-active'] },
      { slot: 'settingsButton' },
      { slot: 'volumeButton' },
      { slot: 'volumeSlider' },
    ],
  },

  controlled: null,
  controlledProps: {
    valueProp: 'playing',
    defaultValueProp: undefined,
    onChangeProp: 'onPlayingChange',
  },
  keyboard: 'linear' as const,
  focus: 'self' as const,
  formType: null,
  asChild: false,

  animations: [],

  tokens: [
    {
      name: '--move-audioplayer-bg',
      value: 'var(--move-gray-800)',
      description: 'Player background color',
    },
    {
      name: '--move-audioplayer-fg',
      value: 'var(--move-white)',
      description: 'Player foreground/icon color',
    },
    {
      name: '--move-audioplayer-fg-muted',
      value: 'rgba(255, 255, 255, 0.6)',
      description: 'Muted foreground color for time display',
    },
    {
      name: '--move-audioplayer-progress-track',
      value: 'rgba(255, 255, 255, 0.2)',
      description: 'Progress bar track background',
    },
    {
      name: '--move-audioplayer-progress-buffered',
      value: 'rgba(255, 255, 255, 0.3)',
      description: 'Buffered progress indicator color',
    },
    {
      name: '--move-audioplayer-progress-fill',
      value: 'var(--move-white)',
      description: 'Progress bar fill color',
    },
    {
      name: '--move-audioplayer-progress-thumb',
      value: 'var(--move-white)',
      description: 'Progress bar thumb color',
    },
    {
      name: '--move-audioplayer-hover',
      value: 'rgba(255, 255, 255, 0.1)',
      description: 'Button hover background',
    },
    {
      name: '--move-audioplayer-active-bg',
      value: 'var(--move-primary, #3b82f6)',
      description: 'Active subtitle button background',
    },
    {
      name: '--move-audioplayer-active-fg',
      value: 'var(--move-white)',
      description: 'Active subtitle button foreground',
    },
  ],

  variants: {
    radius: ['none', 'sm', 'md', 'lg', 'full'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [
    { key: 'play', default: 'Play', description: 'Aria label for the play button' },
    { key: 'pause', default: 'Pause', description: 'Aria label for the pause button' },
    { key: 'mute', default: 'Mute', description: 'Aria label for the mute button' },
    { key: 'unmute', default: 'Unmute', description: 'Aria label for the unmute button' },
    { key: 'settings', default: 'Settings', description: 'Aria label for the settings button' },
    { key: 'subtitles', default: 'Subtitles', description: 'Aria label for the subtitles button' },
  ],

  renderContracts: [
    {
      id: 'hidden-audio-element',
      description:
        'A hidden <audio> element is rendered inside root with preload="metadata"; all playback is controlled programmatically via useAudioPlayer hook',
    },
    {
      id: 'progress-drag',
      description:
        'Progress bar supports click-to-seek and drag-to-scrub via mousedown + document mousemove/mouseup pattern',
    },
    {
      id: 'volume-drag',
      description:
        'Volume slider supports click-to-set and drag-to-adjust via same mousedown pattern',
    },
    {
      id: 'subtitle-overlay-conditional',
      description:
        'Subtitle overlay only renders when there is an active cue (player.activeCue is non-null)',
    },
    {
      id: 'subtitle-toggle',
      description:
        'Subtitle button toggles between enabling first/default track and disabling all subtitles',
    },
    {
      id: 'settings-menu-composition',
      description:
        'Settings button opens a PlayerSettingsMenu with speed, quality, and audio track categories',
    },
    {
      id: 'show-controls-conditional',
      description:
        'showSettings, showSubtitles (requires subtitles prop), showVolume, and showTime conditionally render their respective controls',
    },
    {
      id: 'keyboard-shortcuts',
      description:
        'Space/k toggles play, m toggles mute, ArrowLeft/Right seeks +/-5s, ArrowUp/Down adjusts volume +/-5%',
    },
    {
      id: 'button-composition',
      description:
        'Play, volume, subtitle, and settings buttons are rendered using the Button component with variant="ghost" size="sm"',
    },
  ],

  hasHook: true,
  engineImports: ['withMoveComponent', 'useControlledState'] as string[],

  componentDeps: ['Button', 'PlayerSettingsMenu'] as string[],

  testing: {
    behaviors: [
      'Renders a hidden audio element inside the player',
      'Renders play button that toggles playback',
      'Renders progress bar showing current time / duration',
      'Progress bar supports click-to-seek',
      'Progress bar supports drag-to-scrub',
      'Renders time display showing formatted current time / duration',
      'Renders volume button that toggles mute',
      'Renders volume slider that adjusts volume on click/drag',
      'Renders settings button that opens PlayerSettingsMenu',
      'Renders subtitle button when subtitles are provided and showSubtitles is true',
      'Subtitle button toggles between active and inactive states',
      'Subtitle overlay displays active cue text above the player',
      'Hides time display when showTime is false',
      'Hides volume controls when showVolume is false',
      'Hides settings button when showSettings is false',
      'Hides subtitle button when showSubtitles is false',
      'Applies data-radius attribute on root (defaults to none)',
      'Applies data-size attribute on root (defaults to md)',
      'Supports controlled playing, volume, currentTime, and playbackRate',
      'Calls onPlayingChange when playing state changes',
      'Calls onVolumeChange when volume changes',
      'Calls onTimeChange when current time changes',
      'Calls onEnded when playback ends',
      'Calls onError on playback error',
      'Calls onReady when audio metadata is loaded',
      'Forwards className and style to root',
      'Forwards ref to root element',
    ],
    keyboard: [
      'Space or k key toggles play/pause',
      'm key toggles mute/unmute',
      'ArrowLeft seeks back 5 seconds',
      'ArrowRight seeks forward 5 seconds',
      'ArrowUp increases volume by 5%',
      'ArrowDown decreases volume by 5%',
    ],
    aria: [
      'Play button has aria-label (Play/Pause)',
      'Volume button has aria-label (Mute/Unmute)',
      'Settings button has aria-label (Settings)',
      'Subtitle button has aria-label (Subtitles)',
      'Root has tabIndex=0 for keyboard focus',
    ],
  },

  iconsUsed: ['captions', 'pause', 'play', 'settings', 'volume-2', 'volume-x'],
} satisfies ComponentSpec;
