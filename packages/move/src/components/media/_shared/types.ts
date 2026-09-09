export interface SubtitleTrack {
  src: string;
  label: string;
  language: string;
  default?: boolean;
}

export interface QualityOption {
  src: string;
  label: string;
}

export interface AudioTrack {
  src: string;
  label: string;
  language?: string;
}

/**
 * The transport a player's chrome drives: where the source is, how loud, how
 * fast, and the five commands that change those. An `<audio>`/`<video>` element
 * is one implementation of this and the built-in one — but it is only one. A
 * Web Audio graph, an AudioWorklet synthesising in real time, or a WebRTC
 * stream all have a position and a volume, and none of them has a URL to load,
 * a resource to decode, or metadata to discover a duration from.
 *
 * Two fields are here because not every source can do what a file can:
 *
 * `duration` is `Infinity` when the source is unbounded — a live stream, a
 * generative patch — following `HTMLMediaElement`. The chrome then shows
 * elapsed time alone, because a fraction of an unknown whole is not a fraction.
 *
 * `seekable` is false when position cannot be set at all. A MediaStream is the
 * plain case: it plays, it reports a time, and it cannot be moved. The scrub
 * bar stops taking input rather than accepting drags that go nowhere.
 */
export interface MediaTransport {
  /** Whether the source is advancing right now. */
  playing: boolean;
  /** Seconds from the start of the source. */
  currentTime: number;
  /** Total seconds, or `Infinity` when the source is unbounded. */
  duration: number;
  /** Seconds fetched ahead of `currentTime`. Synthesised sources report 0 —
   *  there is no download to be ahead of. */
  buffered: number;
  /** Whether output is silenced, independently of `volume`. */
  muted: boolean;
  /** Output level, 0–1. */
  volume: number;
  /** Speed multiplier, where 1 is normal. */
  playbackRate: number;
  /** Whether the source can play now. */
  ready: boolean;
  /** Whether `seek` does anything. False for live sources. */
  seekable: boolean;
  togglePlay: () => void;
  /** Move to `time`, in seconds from the start. */
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
}
