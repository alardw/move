import type { MediaTransport } from './types';

/**
 * Seconds as a clock. Non-finite input reads `0:00` rather than `NaN:NaN` —
 * an unbounded source's duration reaches here before anyone checks it.
 */
export function formatTime(seconds: number): string {
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

/** What the bar and the readout show, derived from the transport alone. */
export interface TransportView {
  /** The source has a known length, so a position can be a fraction of it. */
  bounded: boolean;
  progressPct: number;
  bufferedPct: number;
  /** Position against total, or position alone when there is no total. */
  timeLabel: string;
  /** Spread onto the bar. Present only when the source refuses to be moved. */
  seekAttrs: { 'data-seekable': 'false'; 'aria-disabled': true } | undefined;
}

/**
 * Both players show the same four things and were deriving them inline, where
 * `duration > 0` quietly accepted Infinity and pinned every live stream's bar
 * at zero. One place to be right, and one place to fix when it is not.
 */
export function transportView(player: MediaTransport): TransportView {
  const bounded = Number.isFinite(player.duration) && player.duration > 0;
  return {
    bounded,
    progressPct: bounded ? (player.currentTime / player.duration) * 100 : 0,
    bufferedPct: bounded ? (player.buffered / player.duration) * 100 : 0,
    timeLabel: bounded
      ? `${formatTime(player.currentTime)} / ${formatTime(player.duration)}`
      : formatTime(player.currentTime),
    seekAttrs: player.seekable ? undefined : { 'data-seekable': 'false', 'aria-disabled': true },
  };
}
