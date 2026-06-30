import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useControlledState } from '../../../engine';
import { parseVTT, type VTTCue } from '../_shared/parseVTT';
import type { SubtitleTrack, QualityOption, AudioTrack } from '../_shared/types';
import type { VideoPlayerProvider } from './VideoPlayer';

export interface UseVideoPlayerOptions {
  src?: string;
  provider?: VideoPlayerProvider;
  subtitles?: SubtitleTrack[];
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

  qualities?: QualityOption[];
  audioTracks?: AudioTrack[];
  onQualityChange?: (quality: QualityOption) => void;
  onAudioTrackChange?: (track: AudioTrack) => void;
}

export interface UseVideoPlayerReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;

  // State
  playing: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  buffered: number;
  muted: boolean;
  isFullscreen: boolean;
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
  toggleFullscreen: () => void;
  setPlaybackRate: (rate: number) => void;
}

export function useVideoPlayer(options: UseVideoPlayerOptions): UseVideoPlayerReturn {
  const {
    src,
    provider,
    subtitles,
    autoPlay = false,
    muted: mutedProp = false,
    loop = false,
    onEnded,
    onError,
    onReady,
    qualities,
    audioTracks,
    onQualityChange,
    onAudioTrackChange,
  } = options;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [ready, setReady] = useState(false);

  // Subtitles
  const [parsedCues, setParsedCues] = useState<VTTCue[]>([]);
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState(-1);

  // Quality & audio tracks
  const [activeQualityIndex, setActiveQualityIndexState] = useState(0);
  const [activeAudioTrackIndex, setActiveAudioTrackIndexState] = useState(0);

  // Track whether user is seeking to avoid timeupdate conflicts
  const isSeeking = useRef(false);

  // Stable refs for callbacks used in event listeners — prevents effect churn
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

  // Keep stable refs for provider
  const providerRef = useRef(provider);
  providerRef.current = provider;

  // Provider setup/teardown
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (provider) {
      provider.setup(video, src);
      return () => provider.destroy();
    } else {
      video.src = src;
    }
  }, [src, provider]);

  // Sync muted prop
  useEffect(() => {
    setMuted(mutedProp);
  }, [mutedProp]);

  // Apply muted to video
  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = muted;
  }, [muted]);

  // Apply volume to video
  useEffect(() => {
    const video = videoRef.current;
    if (video) video.volume = volume;
  }, [volume]);

  // Apply loop to video
  useEffect(() => {
    const video = videoRef.current;
    if (video) video.loop = loop;
  }, [loop]);

  // Apply playback rate
  useEffect(() => {
    const video = videoRef.current;
    if (video) video.playbackRate = playbackRate;
  }, [playbackRate]);

  // Play/pause sync
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !ready) return;

    if (playing) {
      video.play().catch(() => {
        setPlayingRef.current(false);
      });
    } else {
      video.pause();
    }
  }, [playing, ready]);

  // Video event listeners — stable effect, no churn
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setReady(true);
      onReadyRef.current?.();
    };

    const handleTimeUpdate = () => {
      if (!isSeeking.current) {
        setCurrentTimeRef.current(video.currentTime);
      }
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };

    const handleEnded = () => {
      setPlayingRef.current(false);
      onEndedRef.current?.();
    };

    const handleError = () => {
      onErrorRef.current?.(video.error);
    };

    const handlePlay = () => setPlayingRef.current(true);
    const handlePause = () => setPlayingRef.current(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // If metadata already loaded (cached), fire immediately
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []); // Stable — all callbacks via refs

  // Fullscreen change listener
  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, []);

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

  // Derive active cue synchronously — no useEffect lag
  const activeCue = useMemo(() => {
    if (parsedCues.length === 0) return null;
    return parsedCues.find((c) => currentTime >= c.startTime && currentTime <= c.endTime) ?? null;
  }, [currentTime, parsedCues]);

  // ---- Source switching ----

  const switchSource = useCallback((newSrc: string) => {
    const video = videoRef.current;
    if (!video) return;

    const savedTime = video.currentTime;
    const wasPlaying = !video.paused;

    // If a provider is active, destroy + re-setup
    if (providerRef.current) {
      providerRef.current.destroy();
      providerRef.current.setup(video, newSrc);
    } else {
      video.src = newSrc;
    }

    const handleLoaded = () => {
      video.removeEventListener('loadedmetadata', handleLoaded);
      video.currentTime = savedTime;
      if (wasPlaying) {
        video.play().catch(() => {});
      }
    };
    video.addEventListener('loadedmetadata', handleLoaded);
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
      const video = videoRef.current;
      if (video) {
        isSeeking.current = true;
        video.currentTime = time;
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

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  }, []);

  const setPlaybackRate = useCallback(
    (rate: number) => {
      setPlaybackRateState(rate);
    },
    [setPlaybackRateState],
  );

  return {
    videoRef,
    containerRef,
    playing,
    volume,
    currentTime,
    duration,
    buffered,
    muted,
    isFullscreen,
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
    toggleFullscreen,
    setPlaybackRate,
  };
}
