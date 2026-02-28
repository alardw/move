import { useState } from 'react';
import { AudioPlayer, Heading, Button } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

// Public domain sample audio
const SAMPLE_AUDIO = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
const SHORT_AUDIO = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3';

// =============================================================================
// Examples
// =============================================================================

function UsageExample() {
  return (
    <div style={{ maxWidth: 600 }}>
      <AudioPlayer src={SAMPLE_AUDIO} radius="md" />
    </div>
  );
}

function RadiusExample() {
  return (
    <Stack gap="md" style={{ maxWidth: 600 }}>
      <AudioPlayer src={SAMPLE_AUDIO} radius="none" />
      <AudioPlayer src={SAMPLE_AUDIO} radius="sm" />
      <AudioPlayer src={SAMPLE_AUDIO} radius="md" />
      <AudioPlayer src={SAMPLE_AUDIO} radius="lg" />
      <AudioPlayer src={SAMPLE_AUDIO} radius="full" />
    </Stack>
  );
}

function SizeExample() {
  return (
    <Stack gap="md" style={{ maxWidth: 600 }}>
      <AudioPlayer src={SAMPLE_AUDIO} radius="md" size="sm" />
      <AudioPlayer src={SAMPLE_AUDIO} radius="md" size="md" />
      <AudioPlayer src={SAMPLE_AUDIO} radius="md" size="lg" />
    </Stack>
  );
}

function SubtitlesExample() {
  return (
    <div style={{ maxWidth: 600, position: 'relative', paddingTop: 32 }}>
      <AudioPlayer
        src={SAMPLE_AUDIO}
        radius="md"
        subtitles={[
          { src: '/subs-en.vtt', label: 'English', language: 'en', default: true },
          { src: '/subs-nl.vtt', label: 'Nederlands', language: 'nl' },
        ]}
      />
    </div>
  );
}

function QualityExample() {
  return (
    <Stack gap="sm">
      <div style={{ maxWidth: 600 }}>
        <AudioPlayer
          src={SAMPLE_AUDIO}
          radius="md"
          qualities={[
            { src: SAMPLE_AUDIO, label: '320kbps' },
            { src: SHORT_AUDIO, label: '128kbps' },
          ]}
          onQualityChange={(q: any) => console.log('Quality changed:', q.label)}
        />
      </div>
      <p style={{ color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>
        Click the gear icon to access Speed and Quality settings.
      </p>
    </Stack>
  );
}

function ControlledExample() {
  const [isPlaying, setPlaying] = useState(false);
  const [vol, setVol] = useState(0.8);

  return (
    <Stack gap="md">
      <div style={{ maxWidth: 600 }}>
        <AudioPlayer
          src={SAMPLE_AUDIO}
          playing={isPlaying}
          onPlayingChange={setPlaying}
          volume={vol}
          onVolumeChange={setVol}
          radius="md"
        />
      </div>
      <Stack gap="sm" direction="row">
        <Button size="sm" onClick={() => setPlaying(!isPlaying)}>
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <span style={{ color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-sm)' }}>
          Volume: {Math.round(vol * 100)}%
        </span>
      </Stack>
    </Stack>
  );
}

function MinimalExample() {
  return (
    <div style={{ maxWidth: 400 }}>
      <AudioPlayer
        src={SHORT_AUDIO}
        radius="full"
        showSettings={false}
        showVolume={false}
      />
    </div>
  );
}

function CustomStylingExample() {
  return (
    <div style={{ maxWidth: 600 }}>
      <AudioPlayer
        src={SHORT_AUDIO}
        radius="lg"
        sp={{
          root: { style: { background: 'var(--move-gray-800)', border: '1px solid var(--move-border-base)' } },
        }}
      />
    </div>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Basic audio playback with all controls',
    component: <UsageExample />,
    code: `import { AudioPlayer } from 'move';

<AudioPlayer src="/audio.mp3" radius="md" />`,
  },
  {
    id: 'radius',
    name: 'Radius',
    description: 'Border radius variants',
    component: <RadiusExample />,
    code: `<AudioPlayer src="/audio.mp3" radius="none" />
<AudioPlayer src="/audio.mp3" radius="sm" />
<AudioPlayer src="/audio.mp3" radius="md" />
<AudioPlayer src="/audio.mp3" radius="lg" />
<AudioPlayer src="/audio.mp3" radius="full" />`,
  },
  {
    id: 'size',
    name: 'Size',
    description: 'Small, medium, and large sizes',
    component: <SizeExample />,
    code: `<AudioPlayer src="/audio.mp3" radius="md" size="sm" />
<AudioPlayer src="/audio.mp3" radius="md" size="md" />
<AudioPlayer src="/audio.mp3" radius="md" size="lg" />`,
  },
  {
    id: 'subtitles',
    name: 'Subtitles',
    description: 'Inline subtitle/lyric overlay above the player',
    component: <SubtitlesExample />,
    code: `<AudioPlayer
  src="/audio.mp3"
  radius="md"
  subtitles={[
    { src: '/lyrics-en.vtt', label: 'English', language: 'en', default: true },
    { src: '/lyrics-nl.vtt', label: 'Nederlands', language: 'nl' },
  ]}
/>`,
  },
  {
    id: 'quality',
    name: 'Quality Selection',
    description: 'Settings menu with speed and quality selection',
    component: <QualityExample />,
    code: `<AudioPlayer
  src="/audio-hq.mp3"
  radius="md"
  qualities={[
    { src: '/audio-hq.mp3', label: '320kbps' },
    { src: '/audio-lq.mp3', label: '128kbps' },
  ]}
  onQualityChange={(q) => console.log('Quality:', q.label)}
/>`,
  },
  {
    id: 'controlled',
    name: 'Controlled',
    description: 'Control playback state externally',
    component: <ControlledExample />,
    code: `const [isPlaying, setPlaying] = useState(false);
const [vol, setVol] = useState(0.8);

<AudioPlayer
  src="/audio.mp3"
  playing={isPlaying}
  onPlayingChange={setPlaying}
  volume={vol}
  onVolumeChange={setVol}
  radius="md"
/>

<Button onClick={() => setPlaying(!isPlaying)}>
  {isPlaying ? 'Pause' : 'Play'}
</Button>`,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Compact player with only play, progress, and time',
    component: <MinimalExample />,
    code: `<AudioPlayer
  src="/audio.mp3"
  radius="full"
  showSettings={false}
  showVolume={false}
/>`,
  },
  {
    id: 'custom-styling',
    name: 'Custom Styling',
    description: 'Customize via slot props',
    component: <CustomStylingExample />,
    code: `<AudioPlayer
  src="/audio.mp3"
  radius="lg"
  sp={{
    root: {
      style: {
        background: 'var(--move-gray-800)',
        border: '1px solid var(--move-border-base)',
      },
    },
  }}
/>`,
  },
];

export function AudioPlayerDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="AudioPlayer"
        description="Horizontal audio player with play/pause, progress, time, volume, subtitles, and settings menu."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="AudioPlayer"
        properties={[
          { name: 'src', type: 'string', description: 'Audio source URL.' },
          { name: 'subtitles', type: 'SubtitleTrack[]', description: 'VTT subtitle/lyric tracks with label, language, and src.' },
          { name: 'qualities', type: 'QualityOption[]', description: 'Quality variants with src and label. Shown in settings menu.' },
          { name: 'audioTracks', type: 'AudioTrack[]', description: 'Audio track variants with src and label. Shown in settings menu.' },
          { name: 'onQualityChange', type: '(quality: QualityOption) => void', description: 'Called when quality changes.' },
          { name: 'onAudioTrackChange', type: '(track: AudioTrack) => void', description: 'Called when audio track changes.' },
          { name: 'autoPlay', type: 'boolean', default: 'false', description: 'Start playing automatically.' },
          { name: 'muted', type: 'boolean', default: 'false', description: 'Start muted.' },
          { name: 'loop', type: 'boolean', default: 'false', description: 'Loop playback.' },
          { name: 'playing', type: 'boolean', description: 'Controlled playing state.' },
          { name: 'onPlayingChange', type: '(playing: boolean) => void', description: 'Called when playing state changes.' },
          { name: 'volume', type: 'number', description: 'Controlled volume (0\u20131).' },
          { name: 'onVolumeChange', type: '(volume: number) => void', description: 'Called when volume changes.' },
          { name: 'currentTime', type: 'number', description: 'Controlled current time in seconds.' },
          { name: 'onTimeChange', type: '(time: number) => void', description: 'Called on time updates.' },
          { name: 'playbackRate', type: 'number', default: '1', description: 'Controlled playback speed.' },
          { name: 'onPlaybackRateChange', type: '(rate: number) => void', description: 'Called when speed changes.' },
          { name: 'onEnded', type: '() => void', description: 'Called when playback ends.' },
          { name: 'onError', type: '(error: MediaError | null) => void', description: 'Called on playback error.' },
          { name: 'onReady', type: '() => void', description: 'Called when audio metadata is loaded.' },
          { name: 'showSettings', type: 'boolean', default: 'true', description: 'Show settings gear menu (speed, quality, audio).' },
          { name: 'showSubtitles', type: 'boolean', default: 'true', description: 'Show subtitle toggle (when subtitles provided).' },
          { name: 'showVolume', type: 'boolean', default: 'true', description: 'Show volume controls.' },
          { name: 'showTime', type: 'boolean', default: 'true', description: 'Show time display.' },
          { name: 'radius', type: "'none' | 'sm' | 'md' | 'lg' | 'full'", default: "'none'", description: 'Border radius.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Player size.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for root, playButton, progress, time, volumeButton, volumeSlider, settingsButton, subtitleButton, subtitleOverlay.' },
        ]}
      />
    </DocPage.Root>
  );
}
