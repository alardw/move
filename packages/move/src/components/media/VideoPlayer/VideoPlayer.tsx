'use client';

import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { Button } from '../../actions/Button';
import { Popover } from '../../overlays/Popover';
import { useResolvedIcon } from '../../../infrastructure/Icon';
import { PlayerSettingsMenu, type SettingsCategory } from '../_shared/PlayerSettingsMenu';
import type { SubtitleTrack, QualityOption, AudioTrack } from '../_shared/types';
import { useVideoPlayer } from './useVideoPlayer';
import styles from './VideoPlayer.module.css';

// =============================================================================
// Types
// =============================================================================

export interface VideoPlayerProvider {
  setup(video: HTMLVideoElement, src: string): void;
  destroy(): void;
}

// Re-export SubtitleTrack from shared for backwards compatibility
export type { SubtitleTrack } from '../_shared/types';

export type VideoPlayerRadius = 'none' | 'sm' | 'md' | 'lg';

export interface VideoPlayerLabels {
  /** Aria label for the play button. */
  play: string;
  /** Aria label for the pause button. */
  pause: string;
  /** Aria label for the mute button. */
  mute: string;
  /** Aria label for the unmute button. */
  unmute: string;
  /** Aria label for the fullscreen button. */
  fullscreen: string;
  /** Aria label for the exit-fullscreen button. */
  exitFullscreen: string;
  /** Aria label for the settings button. */
  settings: string;
  /** Aria label for the subtitles button. */
  subtitles: string;
  /** Label for the "Off" option in the subtitle menu. */
  subtitlesOff: string;
}

const DEFAULT_LABELS: VideoPlayerLabels = {
  play: 'Play',
  pause: 'Pause',
  mute: 'Mute',
  unmute: 'Unmute',
  fullscreen: 'Fullscreen',
  exitFullscreen: 'Exit fullscreen',
  settings: 'Settings',
  subtitles: 'Subtitles',
  subtitlesOff: 'Off',
};

type VideoPlayerSlots =
  | 'root'
  | 'video'
  | 'controls'
  | 'playButton'
  | 'progress'
  | 'time'
  | 'volumeButton'
  | 'volumeSlider'
  | 'settingsButton'
  | 'subtitleButton'
  | 'fullscreenButton'
  | 'subtitleOverlay';

export interface VideoPlayerProps extends Record<string, unknown> {
  src?: string;
  poster?: string;
  provider?: VideoPlayerProvider;
  subtitles?: SubtitleTrack[];

  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playbackRate?: number;
  onPlaybackRateChange?: (rate: number) => void;

  playing?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  currentTime?: number;
  onTimeChange?: (time: number) => void;

  onEnded?: () => void;
  onError?: (error: MediaError | null) => void;
  onReady?: () => void;

  qualities?: QualityOption[];
  audioTracks?: AudioTrack[];
  onQualityChange?: (quality: QualityOption) => void;
  onAudioTrackChange?: (track: AudioTrack) => void;

  showSettings?: boolean;
  showVolume?: boolean;
  showSubtitles?: boolean;
  showFullscreen?: boolean;
  showTime?: boolean;

  /** i18n labels for the player's controls. */
  labels?: Partial<VideoPlayerLabels>;

  radius?: VideoPlayerRadius;
  aspectRatio?: string;
  width?: string | number;
  height?: string | number;

  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<VideoPlayerSlots>;
}

// =============================================================================
// Helpers
// =============================================================================

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const sPad = s < 10 ? `0${s}` : `${s}`;
  if (h > 0) {
    const mPad = m < 10 ? `0${m}` : `${m}`;
    return `${h}:${mPad}:${sPad}`;
  }
  return `${m}:${sPad}`;
}

const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

// =============================================================================
// VideoPlayer
// =============================================================================

export const VideoPlayer = withMoveComponent<VideoPlayerSlots, VideoPlayerProps, HTMLDivElement>({
  name: 'VideoPlayer',
  styles,
  slots: [
    'root', 'video', 'controls', 'playButton', 'progress', 'time',
    'volumeButton', 'volumeSlider', 'settingsButton', 'subtitleButton',
    'fullscreenButton', 'subtitleOverlay',
  ] as const,
  defaults: {
    radius: 'none',
    showSettings: true,
    showVolume: true,
    showSubtitles: true,
    showFullscreen: true,
    showTime: true,
  },
  moveProps: [
    'src', 'poster', 'provider', 'subtitles',
    'autoPlay', 'muted', 'loop', 'playbackRate', 'onPlaybackRateChange',
    'playing', 'onPlayingChange', 'volume', 'onVolumeChange',
    'currentTime', 'onTimeChange',
    'onEnded', 'onError', 'onReady',
    'qualities', 'audioTracks', 'onQualityChange', 'onAudioTrackChange',
    'showSettings', 'showVolume', 'showSubtitles', 'showFullscreen', 'showTime',
    'labels',
    'radius', 'aspectRatio', 'width', 'height',
  ],

  setup({ props, ref, cx, sp, attrs }) {
    const labels = { ...DEFAULT_LABELS, ...(props.labels as Partial<VideoPlayerLabels>) };

    const player = useVideoPlayer({
      src: props.src as string | undefined,
      provider: props.provider as VideoPlayerProvider | undefined,
      subtitles: props.subtitles as SubtitleTrack[] | undefined,
      autoPlay: props.autoPlay as boolean | undefined,
      muted: props.muted as boolean | undefined,
      loop: props.loop as boolean | undefined,
      playing: props.playing as boolean | undefined,
      onPlayingChange: props.onPlayingChange as ((p: boolean) => void) | undefined,
      volume: props.volume as number | undefined,
      onVolumeChange: props.onVolumeChange as ((v: number) => void) | undefined,
      currentTime: props.currentTime as number | undefined,
      onTimeChange: props.onTimeChange as ((t: number) => void) | undefined,
      playbackRate: props.playbackRate as number | undefined,
      onPlaybackRateChange: props.onPlaybackRateChange as ((r: number) => void) | undefined,
      onEnded: props.onEnded as (() => void) | undefined,
      onError: props.onError as ((e: MediaError | null) => void) | undefined,
      onReady: props.onReady as (() => void) | undefined,
      qualities: props.qualities as QualityOption[] | undefined,
      audioTracks: props.audioTracks as AudioTrack[] | undefined,
      onQualityChange: props.onQualityChange as ((q: QualityOption) => void) | undefined,
      onAudioTrackChange: props.onAudioTrackChange as ((t: AudioTrack) => void) | undefined,
    });

    const showSettings = props.showSettings as boolean;
    const showVolume = props.showVolume as boolean;
    const showSubtitles = props.showSubtitles as boolean;
    const showFullscreen = props.showFullscreen as boolean;
    const showTime = props.showTime as boolean;
    const subtitles = props.subtitles as SubtitleTrack[] | undefined;
    const qualitiesProp = props.qualities as QualityOption[] | undefined;
    const audioTracksProp = props.audioTracks as AudioTrack[] | undefined;
    const poster = props.poster as string | undefined;

    // Resolved icons
    const playIcon = useResolvedIcon('play', 18);
    const pauseIcon = useResolvedIcon('pause', 18);
    const volume2Icon = useResolvedIcon('volume-2', 18);
    const volumeXIcon = useResolvedIcon('volume-x', 18);
    const captionsIcon = useResolvedIcon('captions', 18);
    const maximizeIcon = useResolvedIcon('maximize', 18);
    const minimizeIcon = useResolvedIcon('minimize', 18);
    const settingsIcon = useResolvedIcon('settings', 18);

    // Controls auto-hide
    const [controlsVisible, setControlsVisible] = React.useState(true);
    const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const showControls = React.useCallback(() => {
      setControlsVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        if (player.playing) setControlsVisible(false);
      }, 3000);
    }, [player.playing]);

    React.useEffect(() => {
      if (!player.playing) {
        setControlsVisible(true);
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      } else {
        showControls();
      }
      return () => {
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      };
    }, [player.playing, showControls]);

    // Settings menu
    const [settingsMenuOpen, setSettingsMenuOpen] = React.useState(false);

    // Subtitle menu
    const [subtitleMenuOpen, setSubtitleMenuOpen] = React.useState(false);

    // Close menus when controls hide
    React.useEffect(() => {
      if (!controlsVisible) {
        setSettingsMenuOpen(false);
        setSubtitleMenuOpen(false);
      }
    }, [controlsVisible]);

    // Build settings categories
    const settingsCategories = React.useMemo(() => {
      const cats: SettingsCategory[] = [];

      // Speed — always present
      cats.push({
        id: 'speed',
        label: 'Speed',
        options: SPEED_OPTIONS.map((r) => ({ value: String(r), label: `${r}x` })),
        activeValue: String(player.playbackRate),
        onChange: (val) => player.setPlaybackRate(Number(val)),
      });

      // Quality
      if (qualitiesProp && qualitiesProp.length > 0) {
        cats.push({
          id: 'quality',
          label: 'Quality',
          options: qualitiesProp.map((q, i) => ({ value: String(i), label: q.label })),
          activeValue: String(player.activeQualityIndex),
          onChange: (val) => player.setActiveQualityIndex(Number(val)),
        });
      }

      // Audio tracks
      if (audioTracksProp && audioTracksProp.length > 0) {
        cats.push({
          id: 'audio',
          label: 'Audio',
          options: audioTracksProp.map((t, i) => ({ value: String(i), label: t.label })),
          activeValue: String(player.activeAudioTrackIndex),
          onChange: (val) => player.setActiveAudioTrackIndex(Number(val)),
        });
      }

      return cats;
    }, [player.playbackRate, player.activeQualityIndex, player.activeAudioTrackIndex, player.setPlaybackRate, player.setActiveQualityIndex, player.setActiveAudioTrackIndex, qualitiesProp, audioTracksProp]);

    // Progress bar drag
    const handleProgressInteraction = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        player.seek(fraction * player.duration);
      },
      [player],
    );

    const handleProgressMouseDown = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        handleProgressInteraction(e);

        const handleMove = (me: MouseEvent) => {
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          const fraction = Math.max(0, Math.min(1, (me.clientX - rect.left) / rect.width));
          player.seek(fraction * player.duration);
        };
        const handleUp = () => {
          document.removeEventListener('mousemove', handleMove);
          document.removeEventListener('mouseup', handleUp);
        };
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleUp);
      },
      [handleProgressInteraction, player],
    );

    // Volume slider drag
    const handleVolumeInteraction = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        player.setVolume(fraction);
      },
      [player],
    );

    const handleVolumeMouseDown = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        handleVolumeInteraction(e);

        const handleMove = (me: MouseEvent) => {
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          const fraction = Math.max(0, Math.min(1, (me.clientX - rect.left) / rect.width));
          player.setVolume(fraction);
        };
        const handleUp = () => {
          document.removeEventListener('mousemove', handleMove);
          document.removeEventListener('mouseup', handleUp);
        };
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleUp);
      },
      [handleVolumeInteraction, player],
    );

    // Keyboard shortcuts
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

        switch (e.key) {
          case ' ':
          case 'k':
            e.preventDefault();
            player.togglePlay();
            break;
          case 'm':
            e.preventDefault();
            player.toggleMute();
            break;
          case 'f':
            e.preventDefault();
            player.toggleFullscreen();
            break;
          case 'ArrowLeft':
            e.preventDefault();
            player.seek(Math.max(0, player.currentTime - 5));
            break;
          case 'ArrowRight':
            e.preventDefault();
            player.seek(Math.min(player.duration, player.currentTime + 5));
            break;
          case 'ArrowUp':
            e.preventDefault();
            player.setVolume(Math.min(1, player.volume + 0.05));
            break;
          case 'ArrowDown':
            e.preventDefault();
            player.setVolume(Math.max(0, player.volume - 0.05));
            break;
        }

        showControls();
      },
      [player, showControls],
    );

    // Video click = toggle play, double click = fullscreen
    const clickTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleVideoClick = React.useCallback(() => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
        player.toggleFullscreen();
      } else {
        clickTimerRef.current = setTimeout(() => {
          clickTimerRef.current = null;
          player.togglePlay();
        }, 250);
      }
    }, [player]);

    // Merge refs: forward ref + containerRef
    const rootElRef = React.useRef<HTMLDivElement | null>(null);
    const mergedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootElRef.current = node;
        (player.containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref && typeof ref === 'object') (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref, player.containerRef],
    );

    // Scale subtitle font-size relative to player width
    React.useEffect(() => {
      const el = rootElRef.current;
      if (!el) return;
      const ro = new ResizeObserver(([entry]) => {
        const w = entry.contentRect.width;
        el.style.setProperty('--_subtitle-size', `${Math.min(28, Math.max(14, w * 0.035))}px`);
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    return {
      render() {
        const rootSp = sp('root');
        const { className: rootSpClass, style: rootSpStyle, ...rootSpRest } = rootSp as Record<string, unknown>;

        const videoSp = sp('video');
        const { className: videoSpClass, ...videoSpRest } = videoSp as Record<string, unknown>;

        const controlsSp = sp('controls');
        const { className: controlsSpClass, ...controlsSpRest } = controlsSp as Record<string, unknown>;

        const progressSp = sp('progress');
        const { className: progressSpClass, ...progressSpRest } = progressSp as Record<string, unknown>;

        const progressPct = player.duration > 0 ? (player.currentTime / player.duration) * 100 : 0;
        const bufferedPct = player.duration > 0 ? (player.buffered / player.duration) * 100 : 0;
        const volumePct = player.muted ? 0 : player.volume * 100;

        const hasSubtitles = subtitles && subtitles.length > 0;
        const showSubtitlesControl = showSubtitles && hasSubtitles;

        const width = props.width as string | number | undefined;
        const height = props.height as string | number | undefined;
        const aspectRatio = props.aspectRatio as string | undefined;

        const rootStyle: React.CSSProperties = {
          ...(width != null ? { width: typeof width === 'number' ? `${width}px` : width } : undefined),
          ...(height != null ? { height: typeof height === 'number' ? `${height}px` : height } : undefined),
          ...(aspectRatio ? { aspectRatio } : undefined),
          ...props.style,
          ...(rootSpStyle as React.CSSProperties),
        };

        return (
          <div
            {...attrs}
            {...rootSpRest}
            ref={mergedRef}
            tabIndex={0}
            data-radius={props.radius}
            data-fullscreen={player.isFullscreen}
            data-controls-hidden={!controlsVisible}
            className={cx('root', props.className, rootSpClass as string | undefined)}
            style={rootStyle}
            onMouseMove={showControls}
            onKeyDown={handleKeyDown}
          >
            {/* Video */}
            <div
              {...videoSpRest}
              className={cx('video', videoSpClass as string | undefined)}
              onClick={handleVideoClick}
            >
              <video
                ref={player.videoRef as React.RefObject<HTMLVideoElement>}
                poster={poster}
                playsInline
                preload="metadata"
              />
            </div>

            {/* Subtitle overlay */}
            {player.activeCue && (
              <div className={cx('subtitleOverlay')}>
                {player.activeCue.text}
              </div>
            )}

            {/* Controls */}
            <div
              {...controlsSpRest}
              className={cx('controls', controlsSpClass as string | undefined)}
            >
              {/* Progress bar */}
              <div
                {...progressSpRest}
                className={cx('progress', progressSpClass as string | undefined)}
                onMouseDown={handleProgressMouseDown}
              >
                <div className={styles.progressTrack}>
                  <div className={styles.progressBuffered} style={{ width: `${bufferedPct}%` }} />
                  <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
                  <div className={styles.progressThumb} style={{ left: `${progressPct}%` }} />
                </div>
              </div>

              {/* Controls row */}
              <div className={styles.controlsRow}>
                {/* Play button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={cx('playButton')}
                  onClick={player.togglePlay}
                  aria-label={player.playing ? labels.pause : labels.play}

                >
                  {player.playing ? pauseIcon : playIcon}
                </Button>

                {/* Time */}
                {showTime && (
                  <span className={cx('time')}>
                    {formatTime(player.currentTime)} / {formatTime(player.duration)}
                  </span>
                )}

                {/* Spacer */}
                <div className={styles.spacer} />

                {/* Settings */}
                {showSettings && (
                  <PlayerSettingsMenu
                    categories={settingsCategories}
                    open={settingsMenuOpen}
                    onOpenChange={setSettingsMenuOpen}
                    side="top"
                    align="center"
                    sideOffset={4}
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cx('settingsButton')}
                        aria-label={labels.settings}
                      >
                        {settingsIcon}
                      </Button>
                    }
                  />
                )}

                {/* Subtitles */}
                {showSubtitlesControl && (
                  <Popover.Root open={subtitleMenuOpen} onOpenChange={setSubtitleMenuOpen}>
                    <Popover.Trigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cx('subtitleButton')}
                        data-active={player.activeSubtitleIndex >= 0}
                        aria-label={labels.subtitles}

                      >
                        {captionsIcon}
                      </Button>
                    </Popover.Trigger>
                    <Popover.Content
                      side="top"
                      align="center"
                      sideOffset={4}
                      className={styles.subtitleMenu}
                      onOpenAutoFocus={(e: Event) => e.preventDefault()}
                    >
                      <button
                        className={styles.subtitleOption}
                        data-active={player.activeSubtitleIndex === -1}
                        onClick={() => {
                          player.setActiveSubtitleIndex(-1);
                          setSubtitleMenuOpen(false);
                        }}
                        type="button"
                      >
                        {labels.subtitlesOff}
                      </button>
                      {subtitles!.map((track, i) => (
                        <button
                          key={track.language}
                          className={styles.subtitleOption}
                          data-active={player.activeSubtitleIndex === i}
                          onClick={() => {
                            player.setActiveSubtitleIndex(i);
                            setSubtitleMenuOpen(false);
                          }}
                          type="button"
                        >
                          {track.label}
                        </button>
                      ))}
                    </Popover.Content>
                  </Popover.Root>
                )}

                {/* Volume */}
                {showVolume && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cx('volumeButton')}
                      onClick={player.toggleMute}
                      aria-label={player.muted ? labels.unmute : labels.mute}

                    >
                      {player.muted || player.volume === 0 ? volumeXIcon : volume2Icon}
                    </Button>
                    <div
                      className={cx('volumeSlider')}
                      onMouseDown={handleVolumeMouseDown}
                    >
                      <div className={styles.volumeTrack}>
                        <div className={styles.volumeFill} style={{ width: `${volumePct}%` }} />
                      </div>
                    </div>
                  </>
                )}

                {/* Fullscreen */}
                {showFullscreen && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cx('fullscreenButton')}
                    onClick={player.toggleFullscreen}
                    aria-label={player.isFullscreen ? labels.exitFullscreen : labels.fullscreen}

                  >
                    {player.isFullscreen ? minimizeIcon : maximizeIcon}
                  </Button>
                )}
              </div>
            </div>

            {props.children as React.ReactNode}
          </div>
        );
      },
    };
  },
});
