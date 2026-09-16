'use client';
// Generated from AudioPlayer.spec.ts
import * as React from 'react';
import { composeHandlers, withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { PlayerButton } from '../_shared/PlayerButton';
import { useIcon } from '../../../infrastructure/Icon';
import { PlayerSettingsMenu, type SettingsCategory } from '../_shared/PlayerSettingsMenu';
import type { SubtitleTrack, QualityOption, AudioTrack, MediaTransport } from '../_shared/types';
import { transportView } from '../_shared/transportView';
import { useAudioPlayer } from './useAudioPlayer';
import type { Radius, Size } from '../../../shared/types';
import styles from './AudioPlayer.module.css';

// =============================================================================
// Types
// =============================================================================

/** Re-exported for backwards-compatible imports. Prefer `Radius`
 *  from `'move'` directly going forward. */
export type AudioPlayerRadius = Radius;
/** Re-exported for backwards-compatible imports. Prefer `Size` from
 *  `'move'` directly going forward. */
export type AudioPlayerSize = Size;

export interface AudioPlayerLabels {
  /** Aria label for the play button. */
  play: string;
  /** Aria label for the pause button. */
  pause: string;
  /** Aria label for the mute button. */
  mute: string;
  /** Aria label for the unmute button. */
  unmute: string;
  /** Aria label for the settings button. */
  settings: string;
  /** Aria label for the subtitles button. */
  subtitles: string;
  /** Heading for the playback-speed category in the settings menu. */
  speed: string;
  /** Heading for the quality category in the settings menu. */
  quality: string;
  /** Heading for the audio-track category in the settings menu. */
  audio: string;
}

const DEFAULT_LABELS: AudioPlayerLabels = {
  play: 'Play',
  pause: 'Pause',
  mute: 'Mute',
  unmute: 'Unmute',
  settings: 'Settings',
  subtitles: 'Subtitles',
  speed: 'Speed',
  quality: 'Quality',
  audio: 'Audio',
};

type AudioPlayerSlots =
  | 'root'
  | 'playButton'
  | 'progress'
  | 'time'
  | 'volumeButton'
  | 'volumeSlider'
  | 'settingsButton'
  | 'subtitleButton'
  | 'subtitleOverlay';

export interface AudioPlayerProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'onError' | 'onVolumeChange'
> {
  src?: string;

  /**
   * Drive the chrome from your own source instead of a media element. Supply
   * this and `src` is not consulted, no `<audio>` is rendered, and every
   * control reads and writes through the transport you pass — a Web Audio
   * graph, an AudioWorklet synthesising live, a WebRTC stream.
   *
   * Leave it out and the built-in media-element transport plays `src`, which
   * is what it has always done.
   */
  transport?: MediaTransport;

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

  subtitles?: SubtitleTrack[];
  qualities?: QualityOption[];
  audioTracks?: AudioTrack[];
  onQualityChange?: (quality: QualityOption) => void;
  onAudioTrackChange?: (track: AudioTrack) => void;

  showSettings?: boolean;
  showSubtitles?: boolean;
  showVolume?: boolean;
  showTime?: boolean;

  /** i18n labels for the player's controls. */
  labels?: Partial<AudioPlayerLabels>;

  radius?: AudioPlayerRadius;
  size?: AudioPlayerSize;

  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<AudioPlayerSlots>;
}

// =============================================================================
// Helpers
// =============================================================================

const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

// =============================================================================
// AudioPlayer
// =============================================================================

export const AudioPlayer = withMoveComponent<AudioPlayerSlots, AudioPlayerProps, HTMLDivElement>({
  name: 'AudioPlayer',
  styles,
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
  ] as const,
  defaults: {
    radius: 'none',
    size: 'md',
    showSettings: true,
    showSubtitles: true,
    showVolume: true,
    showTime: true,
  },
  moveProps: [
    'src',
    'transport',
    'autoPlay',
    'muted',
    'loop',
    'playbackRate',
    'onPlaybackRateChange',
    'playing',
    'onPlayingChange',
    'volume',
    'onVolumeChange',
    'currentTime',
    'onTimeChange',
    'onEnded',
    'onError',
    'onReady',
    'subtitles',
    'qualities',
    'audioTracks',
    'onQualityChange',
    'onAudioTrackChange',
    'showSettings',
    'showSubtitles',
    'showVolume',
    'showTime',
    'labels',
    'radius',
    'size',
  ],

  setup({ props, ref, cx, sp, slot, attrs }) {
    const labels = { ...DEFAULT_LABELS, ...(props.labels as Partial<AudioPlayerLabels>) };

    const internalPlayer = useAudioPlayer({
      src: props.src as string | undefined,
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
      subtitles: props.subtitles as SubtitleTrack[] | undefined,
      qualities: props.qualities as QualityOption[] | undefined,
      audioTracks: props.audioTracks as AudioTrack[] | undefined,
      onQualityChange: props.onQualityChange as ((q: QualityOption) => void) | undefined,
      onAudioTrackChange: props.onAudioTrackChange as ((t: AudioTrack) => void) | undefined,
    });

    /**
     * A supplied transport replaces the media element's half of the hook and
     * nothing else: cues, quality and track state stay where they are, because
     * those are read off props rather than off the element. The hook still runs
     * (it must — hooks are not conditional) but with no `src` it attaches to
     * nothing and costs nothing.
     */
    const suppliedTransport = props.transport as MediaTransport | undefined;
    const player = React.useMemo(
      () => (suppliedTransport ? { ...internalPlayer, ...suppliedTransport } : internalPlayer),
      [internalPlayer, suppliedTransport],
    );

    const showSettings = props.showSettings as boolean;
    const showSubtitles = props.showSubtitles as boolean;
    const showVolume = props.showVolume as boolean;
    const showTime = props.showTime as boolean;
    const subtitles = props.subtitles as SubtitleTrack[] | undefined;
    const qualitiesProp = props.qualities as QualityOption[] | undefined;
    const audioTracksProp = props.audioTracks as AudioTrack[] | undefined;

    // Resolved icons
    const playIcon = useIcon('play', 18);
    const pauseIcon = useIcon('pause', 18);
    const volume2Icon = useIcon('unmute', 18);
    const volumeXIcon = useIcon('mute', 18);
    const captionsIcon = useIcon('captions', 18);
    const settingsIcon = useIcon('settings', 18);

    // Settings menu
    const [settingsMenuOpen, setSettingsMenuOpen] = React.useState(false);

    // Build settings categories
    const settingsCategories = React.useMemo(() => {
      const cats: SettingsCategory[] = [];

      // Speed — always present
      cats.push({
        id: 'speed',
        label: labels.speed,
        options: SPEED_OPTIONS.map((r) => ({ value: String(r), label: `${r}x` })),
        activeValue: String(player.playbackRate),
        onChange: (val) => player.setPlaybackRate(Number(val)),
      });

      // Quality
      if (qualitiesProp && qualitiesProp.length > 0) {
        cats.push({
          id: 'quality',
          label: labels.quality,
          options: qualitiesProp.map((q, i) => ({ value: String(i), label: q.label })),
          activeValue: String(player.activeQualityIndex),
          onChange: (val) => player.setActiveQualityIndex(Number(val)),
        });
      }

      // Audio tracks
      if (audioTracksProp && audioTracksProp.length > 0) {
        cats.push({
          id: 'audio',
          label: labels.audio,
          options: audioTracksProp.map((t, i) => ({ value: String(i), label: t.label })),
          activeValue: String(player.activeAudioTrackIndex),
          onChange: (val) => player.setActiveAudioTrackIndex(Number(val)),
        });
      }

      return cats;
      // `player` deliberately absent: the player object changes identity on every media tick, so depending on it
      // would rebuild this menu constantly; the fields actually read are listed.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      player.playbackRate,
      player.activeQualityIndex,
      player.activeAudioTrackIndex,
      player.setPlaybackRate,
      player.setActiveQualityIndex,
      player.setActiveAudioTrackIndex,
      qualitiesProp,
      audioTracksProp,
      labels.speed,
      labels.quality,
      labels.audio,
    ]);

    const hasSubtitles = subtitles && subtitles.length > 0;
    const showSubtitlesControl = showSubtitles && hasSubtitles;

    // Progress bar drag
    const handleProgressInteraction = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!player.seekable) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        player.seek(fraction * player.duration);
      },
      [player],
    );

    const handleProgressMouseDown = React.useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!player.seekable) return;
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
        if (
          (e.target as HTMLElement).tagName === 'INPUT' ||
          (e.target as HTMLElement).tagName === 'TEXTAREA'
        )
          return;

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
          case 'ArrowLeft':
            if (!player.seekable) break;
            e.preventDefault();
            player.seek(Math.max(0, player.currentTime - 5));
            break;
          case 'ArrowRight':
            if (!player.seekable) break;
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
      },
      [player],
    );

    // Subtitle toggle
    const handleSubtitleToggle = React.useCallback(() => {
      if (player.activeSubtitleIndex >= 0) {
        player.setActiveSubtitleIndex(-1);
      } else if (subtitles && subtitles.length > 0) {
        // Enable first (or default) subtitle track
        const defaultIdx = subtitles.findIndex((t) => t.default);
        player.setActiveSubtitleIndex(defaultIdx >= 0 ? defaultIdx : 0);
      }
    }, [player, subtitles]);

    return {
      render() {
        const rootSp = sp('root');
        const {
          className: rootSpClass,
          style: rootSpStyle,
          ...rootSpRest
        } = rootSp as Record<string, unknown>;

        const progressSp = sp('progress');
        const {
          className: progressSpClass,
          onMouseDown,
          ...progressSpRest
        } = progressSp as Record<string, unknown>;

        const { progressPct, bufferedPct, timeLabel, seekAttrs } = transportView(player);
        const volumePct = player.muted ? 0 : player.volume * 100;

        return (
          <div
            {...attrs}
            {...rootSpRest}
            ref={ref}
            tabIndex={0}
            data-radius={props.radius}
            data-size={props.size}
            className={cx('root', props.className, rootSpClass as string | undefined)}
            style={{ ...props.style, ...(rootSpStyle as React.CSSProperties) }}
            onKeyDown={composeHandlers(attrs.onKeyDown, handleKeyDown)}
          >
            {/* Hidden audio element — the built-in transport's source. A
                supplied transport owns playback itself, so there is nothing
                here for it to point at. */}
            {!suppliedTransport && (
              <audio
                ref={player.audioRef as React.RefObject<HTMLAudioElement>}
                className={styles.audio}
                preload="metadata"
              />
            )}

            {/* Subtitle overlay */}
            {player.activeCue && <div {...slot('subtitleOverlay')}>{player.activeCue.text}</div>}

            {/* Play button */}
            <PlayerButton
              {...slot('playButton')}
              onClick={player.togglePlay}
              label={player.playing ? labels.pause : labels.play}
            >
              {player.playing ? pauseIcon : playIcon}
            </PlayerButton>

            {/* Progress bar */}
            <div
              {...progressSpRest}
              className={cx('progress', progressSpClass as string | undefined)}
              {...seekAttrs}
              onMouseDown={composeHandlers(
                onMouseDown as React.MouseEventHandler<HTMLDivElement> | undefined,
                handleProgressMouseDown,
              )}
            >
              <div className={styles.progressTrack}>
                <div className={styles.progressBuffered} style={{ width: `${bufferedPct}%` }} />
                <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
                <div className={styles.progressThumb} style={{ left: `${progressPct}%` }} />
              </div>
            </div>

            {/* Time */}
            {showTime && <span {...slot('time')}>{timeLabel}</span>}

            {/* Subtitles toggle */}
            {showSubtitlesControl && (
              <PlayerButton
                {...slot('subtitleButton')}
                data-active={player.activeSubtitleIndex >= 0}
                onClick={handleSubtitleToggle}
                label={labels.subtitles}
              >
                {captionsIcon}
              </PlayerButton>
            )}

            {/* Settings */}
            {showSettings && (
              <PlayerSettingsMenu
                triggerLabel={labels.settings}
                categories={settingsCategories}
                open={settingsMenuOpen}
                onOpenChange={setSettingsMenuOpen}
                side="top"
                align="center"
                sideOffset={4}
                trigger={
                  <PlayerButton
                    {...slot('settingsButton')}
                    label={labels.settings}
                    withTooltip={false}
                  >
                    {settingsIcon}
                  </PlayerButton>
                }
              />
            )}

            {/* Volume */}
            {showVolume && (
              <>
                <PlayerButton
                  {...slot('volumeButton')}
                  onClick={player.toggleMute}
                  label={player.muted ? labels.unmute : labels.mute}
                >
                  {player.muted || player.volume === 0 ? volumeXIcon : volume2Icon}
                </PlayerButton>
                <div {...slot('volumeSlider')} onMouseDown={handleVolumeMouseDown}>
                  <div className={styles.volumeTrack}>
                    <div className={styles.volumeFill} style={{ width: `${volumePct}%` }} />
                  </div>
                </div>
              </>
            )}

            {props.children as React.ReactNode}
          </div>
        );
      },
    };
  },
});
