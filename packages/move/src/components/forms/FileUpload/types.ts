// Generated from FileUpload.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)

// =============================================================================
// Upload Status
// =============================================================================

export type FileUploadStatus = 'pending' | 'uploading' | 'complete' | 'error';

// =============================================================================
// Progress
// =============================================================================

export interface UploadProgress {
  /** Bytes uploaded so far */
  loaded: number;
  /** Total bytes (0 if unknown) */
  total: number;
  /** Percentage 0–100 */
  percent: number;
}

// =============================================================================
// Upload Result
// =============================================================================

export interface FileUploadAdapterResult {
  /** Server-assigned URL or identifier */
  url?: string;
  /** Full server response body */
  response?: unknown;
}

// =============================================================================
// File Entry — per-file upload tracking
// =============================================================================

export interface FileUploadEntry {
  /** Stable unique ID for this entry */
  id: string;
  /** The original File object */
  file: File;
  /** Current upload status */
  status: FileUploadStatus;
  /** Upload progress */
  progress: UploadProgress;
  /** Result on successful upload */
  result: FileUploadAdapterResult | null;
  /** Error on failed upload */
  error: Error | null;
  /** AbortController for this upload (null when not uploading) */
  abortController: AbortController | null;
}

// =============================================================================
// Adapter Interface
// =============================================================================

export interface FileUploadAdapterOptions {
  /** The file to upload */
  file: File;
  /** Progress callback — call repeatedly during upload */
  onProgress: (progress: UploadProgress) => void;
  /** Abort signal — adapter MUST respect this for cancellation */
  signal: AbortSignal;
}

/**
 * An adapter is an async function that uploads a single file.
 * It receives the file, a progress callback, and an AbortSignal.
 * It returns a result object on success, or throws on failure.
 */
export type FileUploadAdapter = (
  options: FileUploadAdapterOptions,
) => Promise<FileUploadAdapterResult>;

// =============================================================================
// HTTP Adapter Options
// =============================================================================

export interface HttpAdapterOptions {
  /** Upload endpoint URL */
  url: string;
  /** HTTP method (default: 'POST') */
  method?: string;
  /** FormData field name for the file (default: 'file') */
  fieldName?: string;
  /** Additional headers to send */
  headers?: Record<string, string>;
  /** Additional FormData fields */
  data?: Record<string, string | Blob>;
  /** Whether to send credentials (default: false) */
  withCredentials?: boolean;
  /** Transform the response before returning */
  responseTransform?: (response: unknown) => FileUploadAdapterResult;
}

// =============================================================================
// Upload Manager Options
// =============================================================================

export interface UseUploadManagerOptions {
  /** The adapter function */
  adapter: FileUploadAdapter;
  /** Maximum concurrent uploads (default: 3) */
  concurrency?: number;
  /** Automatically start uploading when files are added (default: false) */
  autoUpload?: boolean;
  /** Called when a single file upload completes */
  onUploadComplete?: (entry: FileUploadEntry) => void;
  /** Called when a single file upload fails */
  onUploadError?: (entry: FileUploadEntry, error: Error) => void;
  /** Called when all files have finished uploading */
  onAllComplete?: (entries: FileUploadEntry[]) => void;
}

// =============================================================================
// Aggregate Upload State
// =============================================================================

export interface UploadAggregateState {
  /** Total progress across all files (0–100) */
  totalProgress: number;
  /** Whether any file is currently uploading */
  isUploading: boolean;
  /** Whether all files have completed (including errors) */
  isComplete: boolean;
  /** Count of files in each status */
  counts: Record<FileUploadStatus, number>;
}
