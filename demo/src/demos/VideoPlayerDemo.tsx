import { useState, useMemo } from 'react';
import { VideoPlayer, Heading, Button } from 'move';
import type { VideoPlayerProvider } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';

// Public domain sample videos
const SAMPLE_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const SAMPLE_POSTER = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg';
const SHORT_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';

// Public test streams
const HLS_STREAM = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
const DASH_STREAM = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';

// =============================================================================
// Lazy-loaded providers
// =============================================================================

function createHlsProvider(): VideoPlayerProvider {
  let hlsInstance: any = null;
  let HlsModule: any = null;

  return {
    setup(video, src) {
      import('hls.js').then((mod) => {
        const Hls = mod.default;
        HlsModule = Hls;
        if (Hls.isSupported()) {
          hlsInstance = new Hls();
          hlsInstance.loadSource(src);
          hlsInstance.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
        }
      });
    },
    destroy() {
      hlsInstance?.destroy();
      hlsInstance = null;
      HlsModule = null;
    },
  };
}

function createShakaProvider(): VideoPlayerProvider {
  let player: any = null;

  return {
    setup(video, src) {
      import('shaka-player').then((mod) => {
        const shaka = mod.default;
        shaka.polyfill.installAll();
        player = new shaka.Player(video);
        player.load(src);
      });
    },
    destroy() {
      player?.destroy();
      player = null;
    },
  };
}

// =============================================================================
// Examples
// =============================================================================

function UsageExample() {
  return (
    <div style={{ maxWidth: 640 }}>
      <VideoPlayer src={SAMPLE_VIDEO} radius="md" />
    </div>
  );
}

function PosterExample() {
  return (
    <div style={{ maxWidth: 640 }}>
      <VideoPlayer
        src={SAMPLE_VIDEO}
        poster={SAMPLE_POSTER}
        radius="md"
      />
    </div>
  );
}

function SubtitlesExample() {
  return (
    <div style={{ maxWidth: 640 }}>
      <VideoPlayer
        src={SAMPLE_VIDEO}
        poster={SAMPLE_POSTER}
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
      <div style={{ maxWidth: 640 }}>
        <VideoPlayer
          src={SAMPLE_VIDEO}
          poster={SAMPLE_POSTER}
          radius="md"
          qualities={[
            { src: SAMPLE_VIDEO, label: '1080p' },
            { src: SHORT_VIDEO, label: '720p' },
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
      <div style={{ maxWidth: 640 }}>
        <VideoPlayer
          src={SAMPLE_VIDEO}
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

function CustomStylingExample() {
  return (
    <div style={{ maxWidth: 640 }}>
      <VideoPlayer
        src={SHORT_VIDEO}
        radius="lg"
        sp={{
          root: { style: { border: '2px solid var(--move-border-base)' } },
          controls: { style: { background: 'rgba(0, 0, 0, 0.8)' } },
        }}
      />
    </div>
  );
}

function HlsExample() {
  const provider = useMemo(() => createHlsProvider(), []);

  return (
    <Stack gap="sm">
      <div style={{ maxWidth: 640 }}>
        <VideoPlayer src={HLS_STREAM} provider={provider} radius="md" />
      </div>
      <p style={{ color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>
        HLS adaptive stream via hls.js (lazy-loaded). Falls back to native HLS on Safari.
      </p>
    </Stack>
  );
}

function ShakaExample() {
  const provider = useMemo(() => createShakaProvider(), []);

  return (
    <Stack gap="sm">
      <div style={{ maxWidth: 640 }}>
        <VideoPlayer src={DASH_STREAM} provider={provider} radius="md" />
      </div>
      <p style={{ color: 'var(--move-fg-muted)', fontSize: 'var(--move-size-xs)' }}>
        DASH stream via Shaka Player (lazy-loaded). For Widevine DRM, add a license server config — see code tab.
      </p>
    </Stack>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Basic HTML5 video playback',
    component: <UsageExample />,
    code: `import { VideoPlayer } from 'move';

<VideoPlayer src="/video.mp4" radius="md" />`,
  },
  {
    id: 'poster',
    name: 'Poster',
    description: 'Display a poster image before playback starts',
    component: <PosterExample />,
    code: `<VideoPlayer
  src="/video.mp4"
  poster="/poster.jpg"
  radius="md"
/>`,
  },
  {
    id: 'subtitles',
    name: 'Subtitles',
    description: 'VTT subtitle tracks with language selection',
    component: <SubtitlesExample />,
    code: `<VideoPlayer
  src="/video.mp4"
  poster="/poster.jpg"
  radius="md"
  subtitles={[
    { src: '/subs-en.vtt', label: 'English', language: 'en', default: true },
    { src: '/subs-nl.vtt', label: 'Nederlands', language: 'nl' },
  ]}
/>`,
  },
  {
    id: 'quality',
    name: 'Quality Selection',
    description: 'Settings menu with speed and quality selection',
    component: <QualityExample />,
    code: `<VideoPlayer
  src="/video-1080p.mp4"
  radius="md"
  qualities={[
    { src: '/video-1080p.mp4', label: '1080p' },
    { src: '/video-720p.mp4', label: '720p' },
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

<VideoPlayer
  src="/video.mp4"
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
    id: 'hls',
    name: 'HLS Stream',
    description: 'Adaptive HLS playback via lazy-loaded hls.js',
    component: <HlsExample />,
    code: `import type { VideoPlayerProvider } from 'move';

function createHlsProvider(): VideoPlayerProvider {
  let hls: any = null;
  return {
    setup(video, src) {
      import('hls.js').then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src; // Safari native HLS
        }
      });
    },
    destroy() {
      hls?.destroy();
      hls = null;
    },
  };
}

const provider = useMemo(() => createHlsProvider(), []);

<VideoPlayer
  src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  provider={provider}
  radius="md"
/>`,
  },
  {
    id: 'shaka',
    name: 'DASH / Widevine',
    description: 'DASH playback via lazy-loaded Shaka Player, with Widevine DRM recipe',
    component: <ShakaExample />,
    code: [
      {
        label: 'DASH (live)',
        code: `import type { VideoPlayerProvider } from 'move';

function createShakaProvider(): VideoPlayerProvider {
  let player: any = null;
  return {
    setup(video, src) {
      import('shaka-player').then(({ default: shaka }) => {
        shaka.polyfill.installAll();
        player = new shaka.Player(video);
        player.load(src);
      });
    },
    destroy() {
      player?.destroy();
      player = null;
    },
  };
}

const provider = useMemo(() => createShakaProvider(), []);

<VideoPlayer
  src="https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd"
  provider={provider}
  radius="md"
/>`,
      },
      {
        label: 'Widevine DRM',
        code: `import type { VideoPlayerProvider } from 'move';

interface WidevineConfig {
  licenseServer: string;
  headers?: Record<string, string>;
}

function createWidevineProvider(config: WidevineConfig): VideoPlayerProvider {
  let player: any = null;
  return {
    setup(video, src) {
      import('shaka-player').then(({ default: shaka }) => {
        shaka.polyfill.installAll();
        player = new shaka.Player(video);

        player.configure({
          drm: {
            servers: {
              'com.widevine.alpha': config.licenseServer,
            },
          },
        });

        if (config.headers) {
          player.getNetworkingEngine()?.registerRequestFilter(
            (_type: number, request: any) => {
              Object.assign(request.headers, config.headers);
            }
          );
        }

        player.load(src);
      });
    },
    destroy() {
      player?.destroy();
      player = null;
    },
  };
}

// Usage
const provider = useMemo(() => createWidevineProvider({
  licenseServer: 'https://license-server.com/widevine',
  headers: { Authorization: 'Bearer <token>' },
}), []);

<VideoPlayer
  src="https://stream.example.com/protected.mpd"
  provider={provider}
  radius="md"
/>`,
      },
    ],
  },
  {
    id: 'custom-styling',
    name: 'Custom Styling',
    description: 'Customize via slot props',
    component: <CustomStylingExample />,
    code: `<VideoPlayer
  src="/video.mp4"
  radius="lg"
  sp={{
    root: { style: { border: '2px solid var(--move-border-base)' } },
    controls: { style: { background: 'rgba(0, 0, 0, 0.8)' } },
  }}
/>`,
  },
];

export function VideoPlayerDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="VideoPlayer"
        description="HTML5 video player with custom controls, subtitle support, settings menu, and provider abstraction for HLS/DRM."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="VideoPlayer"
        properties={[
          { name: 'src', type: 'string', description: 'Video source URL.' },
          { name: 'poster', type: 'string', description: 'Poster image URL shown before playback.' },
          { name: 'provider', type: 'VideoPlayerProvider', description: 'Custom video provider (HLS, Shaka, etc.). Uses native HTML5 by default.' },
          { name: 'subtitles', type: 'SubtitleTrack[]', description: 'VTT subtitle tracks with label, language, and src.' },
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
          { name: 'onReady', type: '() => void', description: 'Called when video metadata is loaded.' },
          { name: 'showSettings', type: 'boolean', default: 'true', description: 'Show settings gear menu (speed, quality, audio).' },
          { name: 'showVolume', type: 'boolean', default: 'true', description: 'Show volume controls.' },
          { name: 'showSubtitles', type: 'boolean', default: 'true', description: 'Show subtitle toggle (when subtitles provided).' },
          { name: 'showFullscreen', type: 'boolean', default: 'true', description: 'Show fullscreen button.' },
          { name: 'showTime', type: 'boolean', default: 'true', description: 'Show time display.' },
          { name: 'radius', type: "'none' | 'sm' | 'md' | 'lg'", default: "'none'", description: 'Border radius.' },
          { name: 'aspectRatio', type: 'string', description: 'CSS aspect ratio (e.g. "16/9", "4/3").' },
          { name: 'width', type: 'string | number', description: 'Width of the player container.' },
          { name: 'height', type: 'string | number', description: 'Height of the player container.' },
          { name: 'sp', type: 'SlotPropsMap', description: 'Slot props for root, video, controls, playButton, progress, time, volumeButton, volumeSlider, settingsButton, subtitleButton, fullscreenButton, subtitleOverlay.' },
        ]}
      />
    </DocPage.Root>
  );
}
