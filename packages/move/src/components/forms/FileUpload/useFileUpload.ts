// Generated from FileUpload.spec.ts
import { useCallback, useMemo, useRef } from 'react';
import { useFileDropTarget } from '../../../hooks';
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

/**
 * The text a rejection carries. Every rejection also has a stable `code`, but a
 * consumer that renders `message` straight out gets whatever these return — so
 * they are overridable, through this option or FileUpload's `messages` prop.
 */
export interface FileUploadMessages {
  /** A file whose type is outside `accept`. Receives the type, or 'unknown'. */
  fileInvalidType: (type: string) => string;
  /** A file over `maxSize`. Receives both sizes, already formatted. */
  fileTooLarge: (size: string, max: string) => string;
  /** A file past `maxFiles`. Receives the limit. */
  tooManyFiles: (max: number) => string;
}

export const DEFAULT_MESSAGES: FileUploadMessages = {
  fileInvalidType: (type) => `File type "${type}" is not accepted`,
  fileTooLarge: (size, max) => `File is ${size}, max is ${max}`,
  tooManyFiles: (max) => `Maximum ${max} files allowed`,
};

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
  /** Overrides for the text a rejection carries. */
  messages?: Partial<FileUploadMessages>;
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
  return list.map((s) => s.trim().toLowerCase()).filter(Boolean);
}

function isFileAccepted(file: File, acceptList: string[]): boolean {
  if (acceptList.length === 0) return true;

  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();

  return acceptList.some((entry) => {
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
    messages: messagesProp,
  } = options;

  const messages = useMemo(() => ({ ...DEFAULT_MESSAGES, ...messagesProp }), [messagesProp]);

  const [files, setFiles] = useControlledState<File[]>({
    value: options.value,
    defaultValue: options.defaultValue ?? [],
    onChange: options.onFilesChange,
  });

  // The drag mechanism is shared with Drag.FileZone rather than written twice:
  // both receive files from outside the browser, so both go through the one
  // hook and report the same three states. `isDragActive`/`isDragReject` stay
  // as the names this hook already returns.
  const inputRef = useRef<HTMLInputElement | null>(null);

  const acceptList = normalizeAccept(accept);
  const acceptString = acceptList.length > 0 ? acceptList.join(',') : undefined;

  const validateFile = useCallback(
    (file: File): FileError[] => {
      const errors: FileError[] = [];

      if (!isFileAccepted(file, acceptList)) {
        errors.push({
          code: 'file-invalid-type',
          message: messages.fileInvalidType(file.type || 'unknown'),
        });
      }

      if (maxSize && file.size > maxSize) {
        errors.push({
          code: 'file-too-large',
          message: messages.fileTooLarge(formatFileSize(file.size), formatFileSize(maxSize)),
        });
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
    [acceptString, maxSize, validate, messages],
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
            errors: [{ code: 'too-many-files', message: messages.tooManyFiles(maxFiles) }],
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
    [disabled, multiple, validateFile, maxFiles, files.length, setFiles, onFileReject, messages],
  );

  const removeFile = useCallback(
    (file: File) => {
      setFiles((prev) => prev.filter((f) => f !== file));
    },
    [setFiles],
  );

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, [setFiles]);

  const openFileDialog = useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  const fileDrop = useFileDropTarget({
    accept: acceptList,
    disabled,
    onDrop: addFiles,
  });
  const isDragActive = fileDrop.isOver;
  const isDragReject = fileDrop.isOver && !fileDrop.canDrop;

  const getDropzoneProps = useCallback((): DropzoneProps => fileDrop.handlers, [fileDrop.handlers]);

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
    [acceptString, multiple, addFiles],
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
