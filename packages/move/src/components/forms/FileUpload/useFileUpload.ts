// Generated from FileUpload.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { useCallback, useRef, useState } from 'react';
import { useControlledState } from '../../../engine';

// =============================================================================
// Types
// =============================================================================

export interface FileError {
  code: 'file-too-large' | 'file-invalid-type' | 'too-many-files' | 'custom';
  message: string;
}

export interface FileRejection {
  file: File;
  errors: FileError[];
}

export interface UseFileUploadOptions {
  /** Accepted file types — MIME types (e.g. 'image/*'), extensions (e.g. '.pdf'), or exact types */
  accept?: string | string[];
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Maximum number of files */
  maxFiles?: number;
  /** Allow multiple files (default: true) */
  multiple?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Controlled file list */
  value?: File[];
  /** Default files for uncontrolled mode */
  defaultValue?: File[];
  /** Called when the file list changes */
  onFilesChange?: (files: File[]) => void;
  /** Called when files are rejected */
  onFileReject?: (rejections: FileRejection[]) => void;
  /** Custom validation — return an error message or null */
  validate?: (file: File) => string | null;
}

export interface UseFileUploadReturn {
  files: File[];
  isDragActive: boolean;
  isDragReject: boolean;
  addFiles: (newFiles: File[]) => void;
  removeFile: (file: File) => void;
  clearFiles: () => void;
  openFileDialog: () => void;
  getDropzoneProps: () => DropzoneProps;
  getInputProps: () => InputProps;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

interface DropzoneProps {
  onDragEnter: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

interface InputProps {
  type: 'file';
  ref: React.RefObject<HTMLInputElement | null>;
  accept: string | undefined;
  multiple: boolean;
  style: React.CSSProperties;
  tabIndex: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// =============================================================================
// Utilities
// =============================================================================

function normalizeAccept(accept?: string | string[]): string[] {
  if (!accept) return [];
  const list = Array.isArray(accept) ? accept : accept.split(',');
  return list.map(s => s.trim().toLowerCase()).filter(Boolean);
}

function isFileAccepted(file: File, acceptList: string[]): boolean {
  if (acceptList.length === 0) return true;

  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();

  return acceptList.some(entry => {
    // Extension match: .pdf, .jpg, etc.
    if (entry.startsWith('.')) {
      return fileName.endsWith(entry);
    }
    // MIME wildcard: image/*, video/*, etc.
    if (entry.endsWith('/*')) {
      const prefix = entry.slice(0, -1); // 'image/'
      return mimeType.startsWith(prefix);
    }
    // Exact MIME match
    return mimeType === entry;
  });
}

/** Check if a DataTransferItem type is accepted (best-effort during drag) */
function isItemTypeAccepted(type: string, acceptList: string[]): boolean {
  if (acceptList.length === 0) return true;

  // During drag we only have MIME types, not file names — skip extension checks
  const mimeOnly = acceptList.filter(e => !e.startsWith('.'));
  if (mimeOnly.length === 0) return true; // can't validate extensions during drag

  const lower = type.toLowerCase();
  return mimeOnly.some(entry => {
    if (entry.endsWith('/*')) {
      return lower.startsWith(entry.slice(0, -1));
    }
    return lower === entry;
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// =============================================================================
// Hook
// =============================================================================

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const {
    accept,
    maxSize,
    maxFiles,
    multiple = true,
    disabled = false,
    onFileReject,
    validate,
  } = options;

  const [files, setFiles] = useControlledState<File[]>({
    value: options.value,
    defaultValue: options.defaultValue ?? [],
    onChange: options.onFilesChange,
  });

  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);
  const dragCounterRef = useRef(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const acceptList = normalizeAccept(accept);
  const acceptString = acceptList.length > 0 ? acceptList.join(',') : undefined;

  const validateFile = useCallback(
    (file: File): FileError[] => {
      const errors: FileError[] = [];

      if (!isFileAccepted(file, acceptList)) {
        errors.push({ code: 'file-invalid-type', message: `File type "${file.type || 'unknown'}" is not accepted` });
      }

      if (maxSize && file.size > maxSize) {
        errors.push({ code: 'file-too-large', message: `File is ${formatFileSize(file.size)}, max is ${formatFileSize(maxSize)}` });
      }

      if (validate) {
        const customError = validate(file);
        if (customError) {
          errors.push({ code: 'custom', message: customError });
        }
      }

      return errors;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [acceptList.join(','), maxSize, validate]
  );

  const addFiles = useCallback(
    (incoming: File[]) => {
      if (disabled) return;

      const toProcess = multiple ? incoming : incoming.slice(0, 1);
      const accepted: File[] = [];
      const rejected: FileRejection[] = [];

      for (const file of toProcess) {
        const errors = validateFile(file);
        if (errors.length > 0) {
          rejected.push({ file, errors });
        } else {
          accepted.push(file);
        }
      }

      // Check maxFiles at the batch level
      if (maxFiles) {
        // max(0, …): when already at/over the cap, available is <= 0 — splice
        // from 0 so EVERY new file is rejected. A negative arg would count from
        // the end and silently keep some past the limit.
        const available = Math.max(0, maxFiles - files.length);
        const overLimit = accepted.splice(available);
        for (const file of overLimit) {
          rejected.push({
            file,
            errors: [{ code: 'too-many-files', message: `Maximum ${maxFiles} files allowed` }],
          });
        }
      }

      if (accepted.length > 0) {
        if (multiple) {
          setFiles((prev) => [...prev, ...accepted]);
        } else {
          setFiles(accepted);
        }
      }

      if (rejected.length > 0) {
        onFileReject?.(rejected);
      }
    },
    [disabled, multiple, validateFile, maxFiles, files.length, setFiles, onFileReject]
  );

  const removeFile = useCallback(
    (file: File) => {
      setFiles((prev) => prev.filter((f) => f !== file));
    },
    [setFiles]
  );

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, [setFiles]);

  const openFileDialog = useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  const getDropzoneProps = useCallback(
    (): DropzoneProps => ({
      onDragEnter(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;

        dragCounterRef.current++;
        if (dragCounterRef.current === 1) {
          setIsDragActive(true);

          // Best-effort type checking during drag
          const items = Array.from(e.dataTransfer.items);
          const hasRejected = items.some(
            (item) => item.kind === 'file' && !isItemTypeAccepted(item.type, acceptList)
          );
          setIsDragReject(hasRejected);
        }
      },

      onDragOver(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
          e.dataTransfer.dropEffect = isDragReject ? 'none' : 'copy';
        }
      },

      onDragLeave(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();

        dragCounterRef.current--;
        if (dragCounterRef.current === 0) {
          setIsDragActive(false);
          setIsDragReject(false);
        }
      },

      onDrop(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        dragCounterRef.current = 0;
        setIsDragActive(false);
        setIsDragReject(false);

        if (disabled) return;

        const droppedFiles = Array.from(e.dataTransfer.files);
        addFiles(droppedFiles);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disabled, isDragReject, acceptList.join(','), addFiles]
  );

  const getInputProps = useCallback(
    (): InputProps => ({
      type: 'file',
      ref: inputRef,
      accept: acceptString,
      multiple,
      style: { display: 'none' },
      tabIndex: -1,
      onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const fileList = e.target.files;
        if (fileList) {
          addFiles(Array.from(fileList));
        }
        // Reset so same file can be re-selected
        e.target.value = '';
      },
    }),
    [acceptString, multiple, addFiles]
  );

  return {
    files,
    isDragActive,
    isDragReject,
    addFiles,
    removeFile,
    clearFiles,
    openFileDialog,
    getDropzoneProps,
    getInputProps,
    inputRef,
  };
}
