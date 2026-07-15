// Generated from FileUpload.spec.ts
import { useCallback, useRef, useReducer } from 'react';
import type {
  FileUploadEntry,
  FileUploadStatus,
  UploadProgress,
  UploadAggregateState,
  UseUploadManagerOptions,
} from './types';

// =============================================================================
// Internal tracking state (per-file, stored in Map ref)
// =============================================================================

interface UploadTrackingState {
  id: string;
  status: FileUploadStatus;
  progress: UploadProgress;
  result: import('./types').FileUploadAdapterResult | null;
  error: Error | null;
  abortController: AbortController | null;
}

// =============================================================================
// Helpers
// =============================================================================

let entryIdCounter = 0;

function generateEntryId(): string {
  return `upload-${++entryIdCounter}-${Date.now()}`;
}

function createTracking(file: File): UploadTrackingState {
  return {
    id: generateEntryId(),
    status: 'pending',
    progress: { loaded: 0, total: file.size, percent: 0 },
    result: null,
    error: null,
    abortController: null,
  };
}

function buildEntry(file: File, state: UploadTrackingState): FileUploadEntry {
  return {
    id: state.id,
    file,
    status: state.status,
    progress: state.progress,
    result: state.result,
    error: state.error,
    abortController: state.abortController,
  };
}

function computeAggregate(entries: FileUploadEntry[]): UploadAggregateState {
  const counts: Record<FileUploadStatus, number> = {
    pending: 0,
    uploading: 0,
    complete: 0,
    error: 0,
  };
  let totalLoaded = 0;
  let totalSize = 0;

  for (const entry of entries) {
    counts[entry.status]++;
    totalSize += entry.file.size;
    if (entry.status === 'complete') {
      totalLoaded += entry.file.size;
    } else if (entry.status === 'uploading') {
      totalLoaded += entry.progress.loaded;
    }
  }

  return {
    totalProgress: totalSize > 0 ? Math.round((totalLoaded / totalSize) * 100) : 0,
    isUploading: counts.uploading > 0,
    isComplete: entries.length > 0 && counts.pending === 0 && counts.uploading === 0,
    counts,
  };
}

// =============================================================================
// Return type
// =============================================================================

export interface UseUploadManagerReturn {
  entries: FileUploadEntry[];
  aggregate: UploadAggregateState;
  trackFiles: (files: File[]) => void;
  untrackFile: (file: File) => void;
  untrackAll: () => void;
  isTracked: (file: File) => boolean;
  uploadAll: () => void;
  uploadFile: (file: File) => void;
  retryFile: (file: File) => void;
  abortFile: (file: File) => void;
  abortAll: () => void;
  getEntryByFile: (file: File) => FileUploadEntry | undefined;
}

const INERT_AGGREGATE: UploadAggregateState = {
  totalProgress: 0,
  isUploading: false,
  isComplete: false,
  counts: { pending: 0, uploading: 0, complete: 0, error: 0 },
};

const noop = () => {};

const INERT_RETURN: UseUploadManagerReturn = {
  entries: [],
  aggregate: INERT_AGGREGATE,
  trackFiles: noop,
  untrackFile: noop,
  untrackAll: noop,
  isTracked: () => false,
  uploadAll: noop,
  uploadFile: noop,
  retryFile: noop,
  abortFile: noop,
  abortAll: noop,
  getEntryByFile: () => undefined,
};

// =============================================================================
// Hook
// =============================================================================

export function useUploadManager(options: UseUploadManagerOptions | null): UseUploadManagerReturn {
  // Version counter — bumped on status/progress changes to trigger re-render
  const [, bump] = useReducer((c: number) => c + 1, 0);

  // Single source of truth: Map<File, TrackingState>
  const mapRef = useRef(new Map<File, UploadTrackingState>());

  // Imperative queue + active count
  const queueRef = useRef<File[]>([]);
  const activeCountRef = useRef(0);

  // Stable refs for options/callbacks
  const adapterRef = useRef(options?.adapter ?? null);
  adapterRef.current = options?.adapter ?? null;
  const concurrencyRef = useRef(options?.concurrency ?? 3);
  concurrencyRef.current = options?.concurrency ?? 3;
  const autoUploadRef = useRef(options?.autoUpload ?? false);
  autoUploadRef.current = options?.autoUpload ?? false;

  const onUploadCompleteRef = useRef(options?.onUploadComplete);
  const onUploadErrorRef = useRef(options?.onUploadError);
  const onAllCompleteRef = useRef(options?.onAllComplete);
  onUploadCompleteRef.current = options?.onUploadComplete;
  onUploadErrorRef.current = options?.onUploadError;
  onAllCompleteRef.current = options?.onAllComplete;

  // Ref to break circular dependency between startUpload and drainQueue
  const drainQueueRef = useRef<() => void>(noop);

  // --- startUpload: upload a single file ---
  const startUpload = useCallback(
    async (file: File) => {
      const adapter = adapterRef.current;
      if (!adapter) return;

      const state = mapRef.current.get(file);
      if (!state || state.status === 'uploading' || state.status === 'complete') return;

      const abortController = new AbortController();
      state.status = 'uploading';
      state.progress = { loaded: 0, total: file.size, percent: 0 };
      state.error = null;
      state.abortController = abortController;
      activeCountRef.current++;
      bump();

      try {
        let lastProgressUpdate = 0;
        const PROGRESS_THROTTLE = 200;

        const result = await adapter({
          file,
          onProgress: (progress: UploadProgress) => {
            const now = Date.now();
            if (progress.percent >= 100 || now - lastProgressUpdate >= PROGRESS_THROTTLE) {
              lastProgressUpdate = now;
              const s = mapRef.current.get(file);
              if (s) {
                s.progress = progress;
                bump();
              }
            }
          },
          signal: abortController.signal,
        });

        const s = mapRef.current.get(file);
        if (s) {
          s.status = 'complete';
          s.progress = { loaded: file.size, total: file.size, percent: 100 };
          s.result = result;
          s.error = null;
          s.abortController = null;
          bump();
          onUploadCompleteRef.current?.(buildEntry(file, s));
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        const isAbort = error.name === 'AbortError';
        const s = mapRef.current.get(file);

        if (isAbort) {
          // On abort the caller handles cleanup (untrackFile / untrackAll).
          // If the entry still exists, reset to pending.
          if (s) {
            s.status = 'pending';
            s.abortController = null;
          }
        } else if (s) {
          s.status = 'error';
          s.error = error;
          s.abortController = null;
          bump();
          onUploadErrorRef.current?.(buildEntry(file, s), error);
        }
      } finally {
        activeCountRef.current--;
        drainQueueRef.current();

        // Check if all tracked files are complete
        setTimeout(() => {
          const allEntries: FileUploadEntry[] = [];
          for (const [f, s] of mapRef.current) {
            allEntries.push(buildEntry(f, s));
          }
          const agg = computeAggregate(allEntries);
          if (agg.isComplete && allEntries.length > 0) {
            onAllCompleteRef.current?.(allEntries);
          }
        }, 0);
      }
    },
    [bump],
  );

  // --- drainQueue: process queued files up to concurrency limit ---
  const drainQueue = useCallback(() => {
    const adapter = adapterRef.current;
    if (!adapter) return;

    while (activeCountRef.current < concurrencyRef.current && queueRef.current.length > 0) {
      const file = queueRef.current.shift()!;
      const state = mapRef.current.get(file);
      if (state && state.status !== 'uploading' && state.status !== 'complete') {
        startUpload(file);
      }
    }
  }, [startUpload]);

  drainQueueRef.current = drainQueue;

  // =========================================================================
  // Event-driven tracking methods (called imperatively by Root)
  // =========================================================================

  const trackFiles = useCallback(
    (files: File[]) => {
      let added = false;
      for (const file of files) {
        if (!mapRef.current.has(file)) {
          mapRef.current.set(file, createTracking(file));
          added = true;
        }
      }
      if (!added) return;

      bump();

      if (autoUploadRef.current) {
        const toQueue = files.filter((f) => {
          const s = mapRef.current.get(f);
          return s && s.status === 'pending' && !queueRef.current.includes(f);
        });
        if (toQueue.length > 0) {
          queueRef.current.push(...toQueue);
          drainQueueRef.current();
        }
      }
    },
    [bump],
  );

  const untrackFile = useCallback(
    (file: File) => {
      const state = mapRef.current.get(file);
      if (!state) return;
      state.abortController?.abort();
      mapRef.current.delete(file);
      queueRef.current = queueRef.current.filter((f) => f !== file);
      bump();
    },
    [bump],
  );

  const untrackAll = useCallback(() => {
    for (const [, state] of mapRef.current) {
      state.abortController?.abort();
    }
    mapRef.current.clear();
    queueRef.current = [];
    bump();
  }, [bump]);

  const isTracked = useCallback((file: File): boolean => {
    return mapRef.current.has(file);
  }, []);

  // =========================================================================
  // Public methods
  // =========================================================================

  const uploadAll = useCallback(() => {
    const toQueue: File[] = [];
    for (const [file, state] of mapRef.current) {
      if (state.status === 'pending' && !queueRef.current.includes(file)) {
        toQueue.push(file);
      }
    }
    if (toQueue.length > 0) {
      queueRef.current.push(...toQueue);
      drainQueueRef.current();
    }
  }, []);

  const uploadFile = useCallback((file: File) => {
    const state = mapRef.current.get(file);
    if (!state || state.status !== 'pending' || queueRef.current.includes(file)) return;
    queueRef.current.push(file);
    drainQueueRef.current();
  }, []);

  const retryFile = useCallback(
    (file: File) => {
      const state = mapRef.current.get(file);
      if (!state || state.status !== 'error') return;

      state.status = 'pending';
      state.error = null;
      state.progress = { loaded: 0, total: file.size, percent: 0 };
      queueRef.current.push(file);
      bump();
      drainQueueRef.current();
    },
    [bump],
  );

  const abortFile = useCallback((file: File) => {
    const state = mapRef.current.get(file);
    if (state?.abortController) {
      state.abortController.abort();
    }
    queueRef.current = queueRef.current.filter((f) => f !== file);
  }, []);

  const abortAll = useCallback(() => {
    for (const [, state] of mapRef.current) {
      state.abortController?.abort();
    }
    queueRef.current = [];
  }, []);

  const getEntryByFile = useCallback((file: File): FileUploadEntry | undefined => {
    const state = mapRef.current.get(file);
    if (!state) return undefined;
    return buildEntry(file, state);
  }, []);

  // =========================================================================
  // Derive entries + aggregate from Map
  // =========================================================================

  if (!options) return INERT_RETURN;

  const entries: FileUploadEntry[] = [];
  for (const [file, state] of mapRef.current) {
    entries.push(buildEntry(file, state));
  }
  const aggregate = computeAggregate(entries);

  return {
    entries,
    aggregate,
    trackFiles,
    untrackFile,
    untrackAll,
    isTracked,
    uploadAll,
    uploadFile,
    retryFile,
    abortFile,
    abortAll,
    getEntryByFile,
  };
}
