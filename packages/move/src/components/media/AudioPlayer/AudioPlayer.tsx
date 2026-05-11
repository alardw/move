'use client';
// Generated from AudioPlayer.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import * as React from 'react';
import { withMoveComponent } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { Button } from '../../core/Button';
import { useResolvedIcon } from '../../../infrastructure/Icon';
import { PlayerSettingsMenu, type SettingsCategory } from '../_shared/PlayerSettingsMenu';
import type { SubtitleTrack, QualityOption, AudioTrack } from '../_shared/types';
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

export interface AudioPlayerProps extends Record<string, unknown> {
  src?: string;

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

  /** i18n label for play button. */
  playLabel?: string;
  /** i18n label for pause button. */
  pauseLabel?: string;
  /** i18n label for mute button. */
  muteLabel?: string;
  /** i18n label for unmute button. */
  unmuteLabel?: string;
  /** i18n label for settings button. */
  settingsLabel?: string;
  /** i18n label for subtitles button. */
  subtitlesLabel?: string;

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
// AudioPlayer
// =============================================================================

export const AudioPlayer = withMoveComponent<AudioPlayerSlots, AudioPlayerProps, HTMLDivElement>({
  name: 'AudioPlayer',
  styles,
  slots: [
    'root', 'playButton', 'progress', 'time',
    'volumeButton', 'volumeSlider', 'settingsButton',
    'subtitleButton', 'subtitleOverlay',
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
    'autoPlay', 'muted', 'loop', 'playbackRate', 'onPlaybackRateChange',
    'playing', 'onPlayingChange', 'volume', 'onVolumeChange',
    'currentTime', 'onTimeChange',
    'onEnded', 'onError', 'onReady',
    'subtitles', 'qualities', 'audioTracks', 'onQualityChange', 'onAudioTrackChange',
    'showSettings', 'showSubtitles', 'showVolume', 'showTime',
    'playLabel', 'pauseLabel', 'muteLabel', 'unmuteLabel', 'settingsLabel', 'subtitlesLabel',
    'radius', 'size',
  ],

  setup({ props, ref, cx, sp, attrs }) {
    const player = useAudioPlayer({
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

    const showSettings = props.showSettings as boolean;
    const showSubtitles = props.showSubtitles as boolean;
    const showVolume = props.showVolume as boolean;
    const showTime = props.showTime as boolean;
    const subtitles = props.subtitles as SubtitleTrack[] | undefined;
    const qualitiesProp = props.qualities as QualityOption[] | undefined;
    const audioTracksProp = props.audioTracks as AudioTrack[] | undefined;

    // i18n labels
    const playLabel = (props.playLabel as string) || 'Play';
    const pauseLabel = (props.pauseLabel as string) || 'Pause';
    const muteLabel = (props.muteLabel as string) || 'Mute';
    const unmuteLabel = (props.unmuteLabel as string) || 'Unmute';
    const settingsLabel = (props.settingsLabel as string) || 'Settings';
    const subtitlesLabel = (props.subtitlesLabel as string) || 'Subtitles';

    // Resolved icons
    const playIcon = useResolvedIcon('play', 18);
    const pauseIcon = useResolvedIcon('pause', 18);
    const volume2Icon = useResolvedIcon('volume-2', 18);
    const volumeXIcon = useResolvedIcon('volume-x', 18);
    const captionsIcon = useResolvedIcon('captions', 18);
    const settingsIcon = useResolvedIcon('settings', 18);

    // Settings menu
    const [settingsMenuOpen, setSettingsMenuOpen] = React.useState(false);

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

    const hasSubtitles = subtitles && subtitles.length > 0;
    const showSubtitlesControl = showSubtitles && hasSubtitles;

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
        const { className: rootSpClass, style: rootSpStyle, ...rootSpRest } = rootSp as Record<string, unknown>;

        const progressSp = sp('progress');
        const { className: progressSpClass, ...progressSpRest } = progressSp as Record<string, unknown>;

        const progressPct = player.duration > 0 ? (player.currentTime / player.duration) * 100 : 0;
        const bufferedPct = player.duration > 0 ? (player.buffered / player.duration) * 100 : 0;
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
            onKeyDown={handleKeyDown}
          >
            {/* Hidden audio element */}
            <audio
              ref={player.audioRef as React.RefObject<HTMLAudioElement>}
              className={styles.audio}
              preload="metadata"
            />

            {/* Subtitle overlay */}
            {player.activeCue && (
              <div className={cx('subtitleOverlay')}>
                {player.activeCue.text}
              </div>
            )}

            {/* Play button */}
            <Button
              variant="ghost"
              size="sm"
              className={cx('playButton')}
              onClick={player.togglePlay}
              aria-label={player.playing ? pauseLabel : playLabel}

            >
              {player.playing ? pauseIcon : playIcon}
            </Button>

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

            {/* Time */}
            {showTime && (
              <span className={cx('time')}>
                {formatTime(player.currentTime)} / {formatTime(player.duration)}
              </span>
            )}

            {/* Subtitles toggle */}
            {showSubtitlesControl && (
              <Button
                variant="ghost"
                size="sm"
                className={cx('subtitleButton')}
                data-active={player.activeSubtitleIndex >= 0}
                onClick={handleSubtitleToggle}
                aria-label={subtitlesLabel}
              >
                {captionsIcon}
              </Button>
            )}

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
                    aria-label={settingsLabel}
                  >
                    {settingsIcon}
                  </Button>
                }
              />
            )}

            {/* Volume */}
            {showVolume && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cx('volumeButton')}
                  onClick={player.toggleMute}
                  aria-label={player.muted ? unmuteLabel : muteLabel}

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

            {props.children as React.ReactNode}
          </div>
        );
      },
    };
  },
});
