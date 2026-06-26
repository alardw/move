'use client';
// Generated from FileUpload.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)

import * as React from 'react';
import { Slot } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { useFileUpload, formatFileSize } from './useFileUpload';
import type { UseFileUploadOptions, UseFileUploadReturn } from './useFileUpload';
import { useUploadManager } from './useUploadManager';
import type { UseUploadManagerReturn } from './useUploadManager';
import type {
  FileUploadAdapter,
  FileUploadEntry,
  UploadAggregateState,
  UseUploadManagerOptions,
} from './types';
import { useResolvedIcon } from '../../../infrastructure/Icon';
import { ProgressBar } from '../../feedback/ProgressBar/ProgressBar';
import {
  prefersReducedMotion,
  useAnimations,
  resolveAnimationsConfig,
} from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import styles from './FileUpload.module.css';

// =============================================================================
// Labels (i18n)
// =============================================================================

export interface FileUploadLabels {
  /** Aria-label for the per-file delete button. `{filename}` is replaced with the file name. */
  removeFile: string;
  /** Aria-label for the check icon shown on completed uploads. */
  uploadComplete: string;
}

const DEFAULT_LABELS: FileUploadLabels = {
  removeFile: 'Remove {filename}',
  uploadComplete: 'Upload complete',
};

// =============================================================================
// Context
// =============================================================================

// =============================================================================
// Default animations
// =============================================================================

const DEFAULT_FILEUPLOAD_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'ItemGroup.enter',
    sequence: [{
      target: 'ItemGroup',
      children: 'li',
      stagger: { delay: 50 },
      animation: {
        opacity: { from: 0, to: 1, ease: 'outQuart', duration: 200 },
        translateY: { from: 8, to: 0, ease: 'outQuart', duration: 200 },
      },
    }],
  },
];

interface FileUploadContextValue {
  files: File[];
  isDragActive: boolean;
  isDragReject: boolean;
  disabled: boolean;
  addFiles: (files: File[]) => void;
  removeFile: (file: File) => void;
  clearFiles: () => void;
  openFileDialog: () => void;
  getDropzoneProps: UseFileUploadReturn['getDropzoneProps'];
  getInputProps: UseFileUploadReturn['getInputProps'];
  inputRef: React.RefObject<HTMLInputElement | null>;
  // Upload adapter (undefined when no adapter)
  entries?: FileUploadEntry[];
  aggregate?: UploadAggregateState;
  uploadAll?: () => void;
  uploadFile?: (file: File) => void;
  retryFile?: (file: File) => void;
  abortFile?: (file: File) => void;
  abortAll?: () => void;
  getEntryByFile?: (file: File) => FileUploadEntry | undefined;
  // Animation
  animConfig: AnimationTrigger[] | false | null;
  removeOnComplete?: number;
  // i18n
  labels: FileUploadLabels;
}

const FileUploadContext = React.createContext<FileUploadContextValue | null>(null);

function useFileUploadContext() {
  const ctx = React.useContext(FileUploadContext);
  if (!ctx) throw new Error('FileUpload components must be used within FileUpload.Root');
  return ctx;
}

interface FileUploadItemContextValue {
  file: File;
  entry?: FileUploadEntry;
}

const FileUploadItemContext = React.createContext<FileUploadItemContextValue | null>(null);

function useFileUploadItemContext() {
  const ctx = React.useContext(FileUploadItemContext);
  if (!ctx) throw new Error('FileUpload.Item* components must be used within FileUpload.Item');
  return ctx;
}

// =============================================================================
// Types
// =============================================================================

export type FileUploadSize = 'sm' | 'md' | 'lg';
export type FileUploadVariant = 'default' | 'compact';

export interface FileUploadRootProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  accept?: string | string[];
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;
  value?: File[];
  defaultValue?: File[];
  onFilesChange?: (files: File[]) => void;
  onFileReject?: UseFileUploadOptions['onFileReject'];
  validate?: UseFileUploadOptions['validate'];
  size?: FileUploadSize;
  variant?: FileUploadVariant;
  // Upload adapter props
  adapter?: FileUploadAdapter;
  autoUpload?: boolean;
  concurrency?: number;
  onUploadComplete?: UseUploadManagerOptions['onUploadComplete'];
  onUploadError?: UseUploadManagerOptions['onUploadError'];
  onAllComplete?: UseUploadManagerOptions['onAllComplete'];
  /** Remove files from list after upload completes. Number = delay in ms, true = 2000ms */
  removeOnComplete?: boolean | number;
  /** Localizable strings for the component's built-in labels. */
  labels?: Partial<FileUploadLabels>;
  sp?: SlotPropsMap<'root'>;
}

export interface FileUploadDropzoneProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'dropzone'>;
}

export interface FileUploadTriggerProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'trigger'>;
}

export interface FileUploadItemGroupProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'itemGroup'>;
}

export interface FileUploadItemProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  file: File;
  sp?: SlotPropsMap<'item'>;
}

export interface FileUploadItemPreviewProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'itemPreview'>;
}

export interface FileUploadItemNameProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'itemName'>;
}

export interface FileUploadItemSizeProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'itemSize'>;
}

export interface FileUploadItemDeleteProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'itemDelete'>;
}

export interface FileUploadClearTriggerProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'clearTrigger'>;
}

export interface FileUploadItemProgressProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'itemProgress'>;
}

export interface FileUploadTotalProgressProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  showLabel?: boolean;
  sp?: SlotPropsMap<'totalProgress'>;
}

export interface FileUploadItemStatusProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'itemStatus'>;
}

export interface FileUploadUploadTriggerProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'uploadTrigger'>;
}

// =============================================================================
// Root
// =============================================================================

const FileUploadRoot = withMoveComponent<'root', FileUploadRootProps, HTMLDivElement>({
  name: 'FileUpload',
  styles,
  slots: ['root'] as const,
  defaults: { multiple: true, size: 'md', variant: 'default' },
  moveProps: [
    'accept', 'maxSize', 'maxFiles', 'multiple', 'disabled',
    'value', 'defaultValue', 'onFilesChange', 'onFileReject', 'validate',
    'size', 'variant',
    'adapter', 'autoUpload', 'concurrency',
    'onUploadComplete', 'onUploadError', 'onAllComplete',
    'removeOnComplete', 'labels',
  ],

  setup({ props, ref, cx, sp, attrs }) {
    const labels = { ...DEFAULT_LABELS, ...(props.labels as Partial<FileUploadLabels>) };

    // Upload manager — always called, inert when no adapter
    const adapterProp = props.adapter as FileUploadAdapter | undefined;
    const hasAdapter = !!adapterProp;
    const uploadManager: UseUploadManagerReturn = useUploadManager(
      adapterProp
        ? {
            adapter: adapterProp,
            concurrency: (props.concurrency as number) ?? 3,
            autoUpload: (props.autoUpload as boolean) ?? false,
            onUploadComplete: props.onUploadComplete as UseUploadManagerOptions['onUploadComplete'],
            onUploadError: props.onUploadError as UseUploadManagerOptions['onUploadError'],
            onAllComplete: props.onAllComplete as UseUploadManagerOptions['onAllComplete'],
          }
        : null
    );

    // Stable ref so callbacks created before useFileUpload can reach the manager
    const managerRef = React.useRef(uploadManager);
    managerRef.current = uploadManager;

    // Ref the user's onFilesChange so our stable wrapper always calls the latest
    const userOnFilesChangeRef = React.useRef(props.onFilesChange as UseFileUploadOptions['onFilesChange']);
    userOnFilesChangeRef.current = props.onFilesChange as UseFileUploadOptions['onFilesChange'];

    // Stable onFilesChange that detects additions and forwards to user callback
    const onFilesChange = React.useCallback((newFiles: File[]) => {
      const mgr = managerRef.current;
      const added = newFiles.filter((f) => !mgr.isTracked(f));
      if (added.length > 0) mgr.trackFiles(added);
      userOnFilesChangeRef.current?.(newFiles);
    }, []);

    const upload = useFileUpload({
      accept: props.accept as UseFileUploadOptions['accept'],
      maxSize: props.maxSize as number | undefined,
      maxFiles: props.maxFiles as number | undefined,
      multiple: props.multiple as boolean | undefined,
      disabled: props.disabled as boolean | undefined,
      value: props.value as File[] | undefined,
      defaultValue: props.defaultValue as File[] | undefined,
      onFilesChange,
      onFileReject: props.onFileReject as UseFileUploadOptions['onFileReject'],
      validate: props.validate as UseFileUploadOptions['validate'],
    });

    // Wrapped removeFile/clearFiles that also untrack from upload manager
    const removeFile = React.useCallback((file: File) => {
      managerRef.current.untrackFile(file);
      upload.removeFile(file);
    }, [upload.removeFile]);

    const clearFiles = React.useCallback(() => {
      managerRef.current.untrackAll();
      upload.clearFiles();
    }, [upload.clearFiles]);

    // Animation config
    const animConfig = resolveAnimationsConfig(
      DEFAULT_FILEUPLOAD_ANIMATIONS,
      undefined, // Could add animations prop to Root if needed
    );

    // Auto-remove delay (resolved once, passed to Items via context)
    const removeOnCompleteProp = props.removeOnComplete as boolean | number | undefined;
    const removeDelay = removeOnCompleteProp === true ? 2000 : (typeof removeOnCompleteProp === 'number' ? removeOnCompleteProp : 0);

    const contextValue: FileUploadContextValue = {
      files: upload.files,
      isDragActive: upload.isDragActive,
      isDragReject: upload.isDragReject,
      disabled: (props.disabled as boolean) || false,
      addFiles: upload.addFiles,
      removeFile,
      clearFiles,
      openFileDialog: upload.openFileDialog,
      getDropzoneProps: upload.getDropzoneProps,
      getInputProps: upload.getInputProps,
      inputRef: upload.inputRef,
      // Upload adapter fields
      entries: hasAdapter ? uploadManager.entries : undefined,
      aggregate: hasAdapter ? uploadManager.aggregate : undefined,
      uploadAll: hasAdapter ? uploadManager.uploadAll : undefined,
      uploadFile: hasAdapter ? uploadManager.uploadFile : undefined,
      retryFile: hasAdapter ? uploadManager.retryFile : undefined,
      abortFile: hasAdapter ? uploadManager.abortFile : undefined,
      abortAll: hasAdapter ? uploadManager.abortAll : undefined,
      getEntryByFile: hasAdapter ? uploadManager.getEntryByFile : undefined,
      // Animation
      animConfig,
      removeOnComplete: removeDelay || undefined,
      // i18n
      labels,
    };

    // Build input props once for the embedded hidden input
    const acceptList = props.accept
      ? (Array.isArray(props.accept) ? (props.accept as string[]) : (props.accept as string).split(','))
          .map((s: string) => s.trim()).filter(Boolean).join(',')
      : undefined;

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;
        return (
          <FileUploadContext.Provider value={contextValue}>
            <div
              {...attrs}
              {...spRest}
              ref={ref}
              data-size={props.size}
              data-variant={props.variant}
              data-disabled={props.disabled ? '' : undefined}
              className={cx('root', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            >
              {props.children}
              <input
                type="file"
                ref={upload.inputRef as React.RefObject<HTMLInputElement>}
                accept={acceptList}
                multiple={props.multiple as boolean}
                tabIndex={-1}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    upload.addFiles(Array.from(e.target.files));
                  }
                  e.target.value = '';
                }}
                className={styles.hiddenInput}
              />
            </div>
          </FileUploadContext.Provider>
        );
      },
    };
  },
});

// =============================================================================
// Dropzone
// =============================================================================

const FileUploadDropzone = withMoveComponent<'dropzone', FileUploadDropzoneProps, HTMLDivElement>({
  name: 'FileUploadDropzone',
  styles,
  slots: ['dropzone'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const context = useFileUploadContext();

    return {
      render() {
        const dropzoneSp = sp('dropzone');
        const { className: spClass, style: spStyle, ...spRest } = dropzoneSp as Record<string, unknown>;
        const dzProps = context.getDropzoneProps();
        return (
          <div
            {...attrs}
            {...spRest}
            {...dzProps}
            ref={ref}
            role="presentation"
            data-drag-active={context.isDragActive ? '' : undefined}
            data-drag-reject={context.isDragReject ? '' : undefined}
            data-disabled={context.disabled ? '' : undefined}
            className={cx('dropzone', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            onClick={() => {
              if (!context.disabled) context.openFileDialog();
            }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// =============================================================================
// Trigger
// =============================================================================

const FileUploadTrigger = withMoveComponent<'trigger', FileUploadTriggerProps, HTMLElement>({
  name: 'FileUploadTrigger',
  styles,
  slots: ['trigger'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const context = useFileUploadContext();

    return {
      render() {
        const triggerSp = sp('trigger');
        const { className: spClass, style: spStyle, ...spRest } = triggerSp as Record<string, unknown>;
        return (
          <Slot.Root
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('trigger', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation(); // prevent dropzone click from double-firing
              if (!context.disabled) context.openFileDialog();
            }}
          >
            {props.children}
          </Slot.Root>
        );
      },
    };
  },
});

// =============================================================================
// ItemGroup
// =============================================================================

const FileUploadItemGroup = withMoveComponent<'itemGroup', FileUploadItemGroupProps, HTMLUListElement>({
  name: 'FileUploadItemGroup',
  styles,
  slots: ['itemGroup'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const context = useFileUploadContext();
    const groupRef = React.useRef<HTMLUListElement>(null);
    const mergedRef = useMergedRef<HTMLUListElement>(ref, groupRef);

    const groupRefs = React.useMemo(() => ({
      ItemGroup: groupRef as React.RefObject<HTMLElement | null>,
    }), []);

    useAnimations(context.animConfig ?? null, groupRefs);

    return {
      render() {
        const groupSp = sp('itemGroup');
        const { className: spClass, style: spStyle, ...spRest } = groupSp as Record<string, unknown>;
        return (
          <ul
            {...attrs}
            {...spRest}
            ref={mergedRef}
            role="list"
            className={cx('itemGroup', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </ul>
        );
      },
    };
  },
});

// =============================================================================
// Item
// =============================================================================

const FileUploadItem = withMoveComponent<'item', FileUploadItemProps, HTMLLIElement>({
  name: 'FileUploadItem',
  styles,
  slots: ['item'] as const,
  moveProps: ['file'],

  setup({ props, ref, cx, sp, attrs }) {
    const file = props.file as File;
    const context = useFileUploadContext();
    const entry = context.getEntryByFile?.(file);
    const itemRef = React.useRef<HTMLLIElement | null>(null);

    const mergedRef = useMergedRef<HTMLLIElement>(ref, itemRef);

    // Exit animation + auto-remove on complete
    const removeFileRef = React.useRef(context.removeFile);
    removeFileRef.current = context.removeFile;

    const entryStatus = entry?.status;
    const removeDelay = context.removeOnComplete;
    const [exitReady, setExitReady] = React.useState(false);

    // Delay before starting exit animation
    React.useEffect(() => {
      if (entryStatus !== 'complete' || !removeDelay) return;
      if (prefersReducedMotion()) {
        removeFileRef.current(file);
        return;
      }
      const timer = setTimeout(() => setExitReady(true), removeDelay);
      return () => clearTimeout(timer);
    }, [entryStatus, removeDelay, file]);

    // Exit animation via useAnimations with deps
    const exitConfig: AnimationTrigger[] | null = React.useMemo(() => {
      if (!exitReady) return null;
      return [{
        trigger: 'item-exit',
        deps: [exitReady],
        sequence: [{
          target: 'Item',
          animation: { opacity: { from: 1, to: 0, duration: 600, ease: 'inOutCubic' }, scale: { from: 1, to: 0.97, duration: 600, ease: 'inOutCubic' } },
        }],
        onComplete: () => removeFileRef.current(file),
      }];
    }, [exitReady, file]);

    const exitRefs = React.useMemo(() => ({
      Item: itemRef as React.RefObject<HTMLElement | null>,
    }), []);

    useAnimations(exitConfig, exitRefs);

    return {
      render() {
        const itemSp = sp('item');
        const { className: spClass, style: spStyle, ...spRest } = itemSp as Record<string, unknown>;
        return (
          <FileUploadItemContext.Provider value={{ file, entry }}>
            <li
              {...attrs}
              {...spRest}
              ref={mergedRef}
              data-upload-status={entry?.status}
              className={cx('item', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            >
              {props.children}
            </li>
          </FileUploadItemContext.Provider>
        );
      },
    };
  },
});

// =============================================================================
// ItemPreview
// =============================================================================

const FileUploadItemPreview = withMoveComponent<'itemPreview', FileUploadItemPreviewProps, HTMLDivElement>({
  name: 'FileUploadItemPreview',
  styles,
  slots: ['itemPreview'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const { file } = useFileUploadItemContext();
    const isImage = file.type.startsWith('image/');
    const fallbackFileIcon = useResolvedIcon('file', 16);

    const [objectUrl, setObjectUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
      if (!isImage) {
        setObjectUrl(null);
        return;
      }
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }, [file, isImage]);

    return {
      render() {
        const previewSp = sp('itemPreview');
        const { className: spClass, style: spStyle, ...spRest } = previewSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            data-has-preview={isImage ? '' : undefined}
            className={cx('itemPreview', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {isImage && objectUrl ? (
              <img src={objectUrl} alt={file.name} />
            ) : (
              props.children || fallbackFileIcon
            )}
          </div>
        );
      },
    };
  },
});

// =============================================================================
// ItemName
// =============================================================================

const FileUploadItemName = withMoveComponent<'itemName', FileUploadItemNameProps, HTMLSpanElement>({
  name: 'FileUploadItemName',
  styles,
  slots: ['itemName'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const { file } = useFileUploadItemContext();

    return {
      render() {
        const nameSp = sp('itemName');
        const { className: spClass, style: spStyle, ...spRest } = nameSp as Record<string, unknown>;
        return (
          <span
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('itemName', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {file.name}
          </span>
        );
      },
    };
  },
});

// =============================================================================
// ItemSize
// =============================================================================

const FileUploadItemSize = withMoveComponent<'itemSize', FileUploadItemSizeProps, HTMLSpanElement>({
  name: 'FileUploadItemSize',
  styles,
  slots: ['itemSize'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const { file } = useFileUploadItemContext();

    return {
      render() {
        const sizeSp = sp('itemSize');
        const { className: spClass, style: spStyle, ...spRest } = sizeSp as Record<string, unknown>;
        return (
          <span
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('itemSize', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {formatFileSize(file.size)}
          </span>
        );
      },
    };
  },
});

// =============================================================================
// ItemDelete
// =============================================================================

const FileUploadItemDelete = withMoveComponent<'itemDelete', FileUploadItemDeleteProps, HTMLButtonElement>({
  name: 'FileUploadItemDelete',
  styles,
  slots: ['itemDelete'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const context = useFileUploadContext();
    const { file, entry } = useFileUploadItemContext();
    const labels = context.labels;
    const fallbackXIcon = useResolvedIcon('x', 14);
    const checkIcon = useResolvedIcon('circle-check', 16);

    return {
      render() {
        const deleteSp = sp('itemDelete');
        const { className: spClass, style: spStyle, ...spRest } = deleteSp as Record<string, unknown>;

        // Show check icon for completed uploads
        if (entry?.status === 'complete') {
          return (
            <span
              ref={ref as React.Ref<HTMLSpanElement>}
              className={cx('itemDelete', 'itemComplete', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
              aria-label={labels.uploadComplete}
            >
              {checkIcon}
            </span>
          );
        }

        const ariaLabel = labels.removeFile.replace('{filename}', file.name);
        return (
          <button
            {...attrs}
            {...spRest}
            ref={ref}
            type="button"
            aria-label={ariaLabel}
            disabled={context.disabled}
            className={cx('itemDelete', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            onClick={() => {
              // If uploading, abort first
              if (entry?.status === 'uploading') {
                context.abortFile?.(file);
              }
              context.removeFile(file);
            }}
          >
            {props.children || fallbackXIcon}
          </button>
        );
      },
    };
  },
});

// =============================================================================
// ClearTrigger
// =============================================================================

const FileUploadClearTrigger = withMoveComponent<'clearTrigger', FileUploadClearTriggerProps, HTMLElement>({
  name: 'FileUploadClearTrigger',
  styles,
  slots: ['clearTrigger'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const context = useFileUploadContext();

    return {
      render() {
        const clearSp = sp('clearTrigger');
        const { className: spClass, style: spStyle, ...spRest } = clearSp as Record<string, unknown>;
        return (
          <Slot.Root
            {...attrs}
            {...spRest}
            {...{ disabled: context.disabled || context.files.length === 0 } as React.ButtonHTMLAttributes<HTMLButtonElement>}
            ref={ref}
            className={cx('clearTrigger', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            onClick={() => {
              context.abortAll?.();
              context.clearFiles();
            }}
          >
            {props.children}
          </Slot.Root>
        );
      },
    };
  },
});

// =============================================================================
// ItemProgress
// =============================================================================

const FileUploadItemProgress = withMoveComponent<'itemProgress', FileUploadItemProgressProps, HTMLDivElement>({
  name: 'FileUploadItemProgress',
  styles,
  slots: ['itemProgress'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const { entry } = useFileUploadItemContext();

    return {
      render() {
        if (!entry || entry.status === 'pending' || entry.status === 'complete') return null;

        const progressSp = sp('itemProgress');
        const { className: spClass, style: spStyle, ...spRest } = progressSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('itemProgress', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            <ProgressBar
              value={entry.progress.percent}
              max={100}
              size="sm"
              variant={entry.status === 'error' ? 'error' : 'default'}
            />
          </div>
        );
      },
    };
  },
});

// =============================================================================
// ItemStatus
// =============================================================================

const FileUploadItemStatus = withMoveComponent<'itemStatus', FileUploadItemStatusProps, HTMLSpanElement>({
  name: 'FileUploadItemStatus',
  styles,
  slots: ['itemStatus'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const { entry } = useFileUploadItemContext();

    return {
      render() {
        if (!entry || entry.status === 'pending') return null;

        const statusSp = sp('itemStatus');
        const { className: spClass, style: spStyle, ...spRest } = statusSp as Record<string, unknown>;

        let label: string;
        if (entry.status === 'uploading') label = `${entry.progress.percent}%`;
        else if (entry.status === 'complete') label = 'Done';
        else label = 'Failed';

        return (
          <span
            {...attrs}
            {...spRest}
            ref={ref}
            data-status={entry.status}
            className={cx('itemStatus', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {label}
          </span>
        );
      },
    };
  },
});

// =============================================================================
// TotalProgress
// =============================================================================

const FileUploadTotalProgress = withMoveComponent<'totalProgress', FileUploadTotalProgressProps, HTMLDivElement>({
  name: 'FileUploadTotalProgress',
  styles,
  slots: ['totalProgress'] as const,
  defaults: { showLabel: false },
  moveProps: ['showLabel'],

  setup({ props, ref, cx, sp, attrs }) {
    const context = useFileUploadContext();
    const elRef = React.useRef<HTMLDivElement | null>(null);
    const mergedRef = useMergedRef<HTMLDivElement>(ref, elRef);
    const wasVisibleRef = React.useRef(false);
    const [visible, setVisible] = React.useState(false);
    const [fading, setFading] = React.useState(false);

    const isActive = !!(context.aggregate && (context.aggregate.isUploading || context.aggregate.isComplete));

    React.useEffect(() => {
      if (isActive) {
        wasVisibleRef.current = true;
        setVisible(true);
        setFading(false);
        return;
      }

      // Was visible, now inactive → start fade out
      if (!wasVisibleRef.current) return;
      wasVisibleRef.current = false;

      if (prefersReducedMotion()) {
        setVisible(false);
        return;
      }

      setFading(true);
    }, [isActive]);

    // Fade-out animation via useAnimations with deps
    const fadeConfig: AnimationTrigger[] | null = React.useMemo(() => {
      if (!fading) return null;
      return [{
        trigger: 'fade-out',
        deps: [fading],
        sequence: [{
          target: 'TotalProgress',
          animation: { opacity: { from: 1, to: 0, duration: 600, ease: 'inOutCubic' }, scale: { from: 1, to: 0.97, duration: 600, ease: 'inOutCubic' } },
        }],
        onComplete: () => setVisible(false),
      }];
    }, [fading]);

    const fadeRefs = React.useMemo(() => ({
      TotalProgress: elRef as React.RefObject<HTMLElement | null>,
    }), []);

    useAnimations(fadeConfig, fadeRefs);

    return {
      render() {
        if (!visible) return null;

        const agg = context.aggregate!;
        const totalSp = sp('totalProgress');
        const { className: spClass, style: spStyle, ...spRest } = totalSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={mergedRef}
            data-uploading={agg.isUploading ? '' : undefined}
            data-complete={agg.isComplete ? '' : undefined}
            className={cx('totalProgress', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            <ProgressBar
              value={agg.totalProgress}
              max={100}
              size="sm"
              variant={agg.isComplete ? 'success' : 'default'}
            />
            {props.showLabel && (
              <span className={styles.totalProgressLabel}>{agg.totalProgress}%</span>
            )}
          </div>
        );
      },
    };
  },
});

// =============================================================================
// UploadTrigger
// =============================================================================

const FileUploadUploadTrigger = withMoveComponent<'uploadTrigger', FileUploadUploadTriggerProps, HTMLElement>({
  name: 'FileUploadUploadTrigger',
  styles,
  slots: ['uploadTrigger'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const context = useFileUploadContext();

    return {
      render() {
        const triggerSp = sp('uploadTrigger');
        const { className: spClass, style: spStyle, ...spRest } = triggerSp as Record<string, unknown>;

        const hasPending = (context.aggregate?.counts.pending ?? 0) > 0;
        const isUploading = context.aggregate?.isUploading ?? false;

        return (
          <Slot.Root
            {...attrs}
            {...spRest}
            {...{ disabled: context.disabled || !hasPending || isUploading } as React.ButtonHTMLAttributes<HTMLButtonElement>}
            ref={ref}
            className={cx('uploadTrigger', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            onClick={() => context.uploadAll?.()}
          >
            {props.children}
          </Slot.Root>
        );
      },
    };
  },
});

// =============================================================================
// Export
// =============================================================================

export const FileUpload = {
  Root: FileUploadRoot,
  Dropzone: FileUploadDropzone,
  Trigger: FileUploadTrigger,
  ItemGroup: FileUploadItemGroup,
  Item: FileUploadItem,
  ItemPreview: FileUploadItemPreview,
  ItemName: FileUploadItemName,
  ItemSize: FileUploadItemSize,
  ItemDelete: FileUploadItemDelete,
  ClearTrigger: FileUploadClearTrigger,
  ItemProgress: FileUploadItemProgress,
  ItemStatus: FileUploadItemStatus,
  TotalProgress: FileUploadTotalProgress,
  UploadTrigger: FileUploadUploadTrigger,
};
