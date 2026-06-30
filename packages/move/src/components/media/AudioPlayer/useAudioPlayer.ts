import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useControlledState } from '../../../engine';
import { parseVTT, type VTTCue } from '../_shared/parseVTT';
import type { SubtitleTrack, QualityOption, AudioTrack } from '../_shared/types';

export interface UseAudioPlayerOptions {
  src?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;

  playing?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  currentTime?: number;
  onTimeChange?: (time: number) => void;
  playbackRate?: number;
  onPlaybackRateChange?: (rate: number) => void;

  onEnded?: () => void;
  onError?: (error: MediaError | null) => void;
  onReady?: () => void;

  subtitles?: SubtitleTrack[];
  qualities?: QualityOption[];
  audioTracks?: AudioTrack[];
  onQualityChange?: (quality: QualityOption) => void;
  onAudioTrackChange?: (track: AudioTrack) => void;
}

export interface UseAudioPlayerReturn {
  audioRef: React.RefObject<HTMLAudioElement | null>;

  // State
  playing: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  buffered: number;
  muted: boolean;
  playbackRate: number;
  ready: boolean;

  // Subtitles
  parsedCues: VTTCue[];
  activeCue: VTTCue | null;
  activeSubtitleIndex: number;
  setActiveSubtitleIndex: (index: number) => void;

  // Quality
  activeQualityIndex: number;
  setActiveQualityIndex: (index: number) => void;

  // Audio tracks
  activeAudioTrackIndex: number;
  setActiveAudioTrackIndex: (index: number) => void;

  // Actions
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
}

export function useAudioPlayer(options: UseAudioPlayerOptions): UseAudioPlayerReturn {
  const {
    src,
    autoPlay = false,
    muted: mutedProp = false,
    loop = false,
    onEnded,
    onError,
    onReady,
    subtitles,
    qualities,
    audioTracks,
    onQualityChange,
    onAudioTrackChange,
  } = options;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Controlled state
  const [playing, setPlaying] = useControlledState<boolean>({
    value: options.playing,
    defaultValue: autoPlay,
    onChange: options.onPlayingChange,
  });

  const [volume, setVolumeState] = useControlledState<number>({
    value: options.volume,
    defaultValue: 1,
    onChange: options.onVolumeChange,
  });

  const [currentTime, setCurrentTime] = useControlledState<number>({
    value: options.currentTime,
    defaultValue: 0,
    onChange: options.onTimeChange,
  });

  const [playbackRate, setPlaybackRateState] = useControlledState<number>({
    value: options.playbackRate,
    defaultValue: 1,
    onChange: options.onPlaybackRateChange,
  });

  // Internal state
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [muted, setMuted] = useState(mutedProp);
  const [ready, setReady] = useState(false);

  // Subtitles
  const [parsedCues, setParsedCues] = useState<VTTCue[]>([]);
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState(-1);

  // Quality & audio tracks
  const [activeQualityIndex, setActiveQualityIndexState] = useState(0);
  const [activeAudioTrackIndex, setActiveAudioTrackIndexState] = useState(0);

  // Track whether user is seeking to avoid timeupdate conflicts
  const isSeeking = useRef(false);

  // Stable refs for callbacks used in event listeners
  const setPlayingRef = useRef(setPlaying);
  setPlayingRef.current = setPlaying;
  const setCurrentTimeRef = useRef(setCurrentTime);
  setCurrentTimeRef.current = setCurrentTime;
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const onQualityChangeRef = useRef(onQualityChange);
  onQualityChangeRef.current = onQualityChange;
  const onAudioTrackChangeRef = useRef(onAudioTrackChange);
  onAudioTrackChangeRef.current = onAudioTrackChange;

  // Set src
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;
    audio.src = src;
  }, [src]);

  // Sync muted prop
  useEffect(() => {
    setMuted(mutedProp);
  }, [mutedProp]);

  // Apply muted to audio
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.muted = muted;
  }, [muted]);

  // Apply volume to audio
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  // Apply loop to audio
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.loop = loop;
  }, [loop]);

  // Apply playback rate
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.playbackRate = playbackRate;
  }, [playbackRate]);

  // Play/pause sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !ready) return;

    if (playing) {
      audio.play().catch(() => {
        setPlayingRef.current(false);
      });
    } else {
      audio.pause();
    }
  }, [playing, ready]);

  // Audio event listeners — stable effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setReady(true);
      onReadyRef.current?.();
    };

    const handleTimeUpdate = () => {
      if (!isSeeking.current) {
        setCurrentTimeRef.current(audio.currentTime);
      }
    };

    const handleProgress = () => {
      if (audio.buffered.length > 0) {
        setBuffered(audio.buffered.end(audio.buffered.length - 1));
      }
    };

    const handleEnded = () => {
      setPlayingRef.current(false);
      onEndedRef.current?.();
    };

    const handleError = () => {
      onErrorRef.current?.(audio.error);
    };

    const handlePlay = () => setPlayingRef.current(true);
    const handlePause = () => setPlayingRef.current(false);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('progress', handleProgress);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // If metadata already loaded (cached), fire immediately
    if (audio.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('progress', handleProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []); // Stable — all callbacks via refs

  // ---- Subtitles ----

  // Stabilize subtitles array reference
  const subtitlesSerialized = subtitles?.map((t) => t.src).join('\n') ?? '';
  const stableSubtitles = useMemo(
    () => subtitles,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subtitlesSerialized],
  );

  // Set default subtitle track
  useEffect(() => {
    if (!stableSubtitles || stableSubtitles.length === 0) {
      setParsedCues([]);
      setActiveSubtitleIndex(-1);
      return;
    }

    const defaultIdx = stableSubtitles.findIndex((t) => t.default);
    if (defaultIdx !== -1) {
      setActiveSubtitleIndex((prev) => (prev === -1 ? defaultIdx : prev));
    }
  }, [stableSubtitles]);

  // Fetch and parse active subtitle track
  useEffect(() => {
    if (
      !stableSubtitles ||
      activeSubtitleIndex < 0 ||
      activeSubtitleIndex >= stableSubtitles.length
    ) {
      setParsedCues([]);
      return;
    }

    let cancelled = false;
    const track = stableSubtitles[activeSubtitleIndex];

    fetch(track.src)
      .then((res) => res.text())
      .then((text) => {
        if (!cancelled) {
          setParsedCues(parseVTT(text));
        }
      })
      .catch(() => {
        if (!cancelled) setParsedCues([]);
      });

    return () => {
      cancelled = true;
    };
  }, [stableSubtitles, activeSubtitleIndex]);

  // Derive active cue synchronously
  const activeCue = useMemo(() => {
    if (parsedCues.length === 0) return null;
    return parsedCues.find((c) => currentTime >= c.startTime && currentTime <= c.endTime) ?? null;
  }, [currentTime, parsedCues]);

  // ---- Source switching helper ----

  const switchSource = useCallback((newSrc: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    const savedTime = audio.currentTime;
    const wasPlaying = !audio.paused;

    audio.src = newSrc;

    const handleLoaded = () => {
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.currentTime = savedTime;
      if (wasPlaying) {
        audio.play().catch(() => {});
      }
    };
    audio.addEventListener('loadedmetadata', handleLoaded);
  }, []);

  // Quality switching
  const setActiveQualityIndex = useCallback(
    (index: number) => {
      if (!qualities || index < 0 || index >= qualities.length) return;
      setActiveQualityIndexState(index);
      switchSource(qualities[index].src);
      onQualityChangeRef.current?.(qualities[index]);
    },
    [qualities, switchSource],
  );

  // Audio track switching
  const setActiveAudioTrackIndex = useCallback(
    (index: number) => {
      if (!audioTracks || index < 0 || index >= audioTracks.length) return;
      setActiveAudioTrackIndexState(index);
      switchSource(audioTracks[index].src);
      onAudioTrackChangeRef.current?.(audioTracks[index]);
    },
    [audioTracks, switchSource],
  );

  // Actions
  const togglePlay = useCallback(() => {
    setPlaying(!playing);
  }, [playing, setPlaying]);

  const seek = useCallback(
    (time: number) => {
      const audio = audioRef.current;
      if (audio) {
        isSeeking.current = true;
        audio.currentTime = time;
        setCurrentTime(time);
        requestAnimationFrame(() => {
          isSeeking.current = false;
        });
      }
    },
    [setCurrentTime],
  );

  const setVolume = useCallback(
    (vol: number) => {
      const clamped = Math.max(0, Math.min(1, vol));
      setVolumeState(clamped);
      if (clamped > 0 && muted) setMuted(false);
    },
    [setVolumeState, muted],
  );

  const toggleMute = useCallback(() => {
    setMuted((prev) => !prev);
  }, []);

  const setPlaybackRate = useCallback(
    (rate: number) => {
      setPlaybackRateState(rate);
    },
    [setPlaybackRateState],
  );

  return {
    audioRef,
    playing,
    volume,
    currentTime,
    duration,
    buffered,
    muted,
    playbackRate,
    ready,
    parsedCues,
    activeCue,
    activeSubtitleIndex,
    setActiveSubtitleIndex,
    activeQualityIndex,
    setActiveQualityIndex,
    activeAudioTrackIndex,
    setActiveAudioTrackIndex,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
  };
}
