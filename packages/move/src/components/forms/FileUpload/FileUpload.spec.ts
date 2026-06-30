// FileUpload.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'FileUpload',
  componentClass: 'interactive' as const,
  category: 'forms',
  description:
    'Compound file upload component with drag-and-drop dropzone, file list management, progress tracking, and pluggable upload adapter system',
  animationPatterns: ['listReveal'],
  families: {
    behavior: ['form-input'],
    state: ['controlled-value'],
    a11y: ['none'],
  },

  compound: true,
  rootElement: 'div',
  slots: [
    {
      name: 'root',
      element: 'div',
      description: 'Wrapper containing hidden file input, context provider, and all sub-components',
    },
    {
      name: 'dropzone',
      element: 'div',
      description: 'Drag-and-drop target area with dashed border and visual feedback',
    },
    {
      name: 'trigger',
      element: 'Slot.Root',
      description: 'asChild trigger that opens the file dialog on click',
    },
    { name: 'itemGroup', element: 'ul', description: 'List container for file items (role=list)' },
    {
      name: 'item',
      element: 'li',
      description: 'Individual file row with enter/exit animation and upload status',
    },
    {
      name: 'itemPreview',
      element: 'div',
      description: 'Thumbnail preview for image files or fallback file icon',
    },
    { name: 'itemName', element: 'span', description: 'Truncated file name display' },
    {
      name: 'itemSize',
      element: 'span',
      description: 'Formatted file size display (e.g. "2.4 MB")',
    },
    {
      name: 'itemDelete',
      element: 'button',
      description: 'Remove/abort button per file item (shows check icon on complete)',
    },
    {
      name: 'clearTrigger',
      element: 'Slot.Root',
      description: 'asChild trigger that clears all files and aborts uploads',
    },
    {
      name: 'itemProgress',
      element: 'div',
      description: 'Per-file progress bar wrapper (renders ProgressBar component)',
    },
    {
      name: 'itemStatus',
      element: 'span',
      description: 'Per-file upload status text (percent, "Done", or "Failed")',
    },
    {
      name: 'totalProgress',
      element: 'div',
      description: 'Aggregate progress bar across all files with fade-out on completion',
    },
    {
      name: 'uploadTrigger',
      element: 'Slot.Root',
      description: 'asChild trigger that starts uploading all pending files',
    },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'div', description: 'Root wrapper with hidden file input' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Sub-components (Dropzone, Trigger, ItemGroup, etc.)',
        },
        {
          name: 'accept',
          type: 'string | string[]',
          moveSpecific: true,
          description: 'Accepted file types — MIME types, extensions, or wildcards',
        },
        {
          name: 'maxSize',
          type: 'number',
          moveSpecific: true,
          description: 'Maximum file size in bytes',
        },
        {
          name: 'maxFiles',
          type: 'number',
          moveSpecific: true,
          description: 'Maximum number of files',
        },
        {
          name: 'multiple',
          type: 'boolean',
          default: 'true',
          moveSpecific: true,
          description: 'Allow multiple file selection',
        },
        { name: 'disabled', type: 'boolean', moveSpecific: true, description: 'Disabled state' },
        { name: 'value', type: 'File[]', moveSpecific: true, description: 'Controlled file list' },
        {
          name: 'defaultValue',
          type: 'File[]',
          moveSpecific: true,
          description: 'Default file list (uncontrolled)',
        },
        {
          name: 'onFilesChange',
          type: '(files: File[]) => void',
          moveSpecific: true,
          description: 'Called when the file list changes',
        },
        {
          name: 'onFileReject',
          type: '(rejections: FileRejection[]) => void',
          moveSpecific: true,
          description: 'Called when files fail validation',
        },
        {
          name: 'validate',
          type: '(file: File) => string | null',
          moveSpecific: true,
          description: 'Custom per-file validation function',
        },
        {
          name: 'size',
          typeRef: 'Size',
          default: "'md'",
          moveSpecific: true,
          description: 'Component size',
        },
        {
          name: 'variant',
          type: "'default' | 'compact'",
          default: "'default'",
          moveSpecific: true,
          description: 'Layout variant',
        },
        {
          name: 'adapter',
          type: 'FileUploadAdapter',
          moveSpecific: true,
          description: 'Upload adapter function for server uploads',
        },
        {
          name: 'autoUpload',
          type: 'boolean',
          default: 'false',
          moveSpecific: true,
          description: 'Automatically start uploading when files are added',
        },
        {
          name: 'concurrency',
          type: 'number',
          default: '3',
          moveSpecific: true,
          description: 'Maximum concurrent uploads',
        },
        {
          name: 'onUploadComplete',
          type: '(entry: FileUploadEntry) => void',
          moveSpecific: true,
          description: 'Called when a single file upload completes',
        },
        {
          name: 'onUploadError',
          type: '(entry: FileUploadEntry, error: Error) => void',
          moveSpecific: true,
          description: 'Called when a single file upload fails',
        },
        {
          name: 'onAllComplete',
          type: '(entries: FileUploadEntry[]) => void',
          moveSpecific: true,
          description: 'Called when all files have finished uploading',
        },
        {
          name: 'labels',
          type: 'Partial<FileUploadLabels>',
          moveSpecific: true,
          description: 'Overridable user-facing strings',
        },
        {
          name: 'removeOnComplete',
          type: 'boolean | number',
          moveSpecific: true,
          description:
            'Remove files from list after upload completes; true = 2000ms delay, number = custom delay in ms',
        },
      ],
      usesFactory: true,
      description:
        'Root wrapper providing FileUploadContext to all children, manages file state via useFileUpload and upload state via useUploadManager',
    },
    {
      name: 'Dropzone',
      slots: [{ name: 'dropzone', element: 'div', description: 'Drag-and-drop target area' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Dropzone content (instructions, icon, etc.)',
        },
      ],
      usesFactory: true,
      description:
        'Drag-and-drop area with visual feedback for drag-active and drag-reject states; opens file dialog on click',
    },
    {
      name: 'Trigger',
      slots: [{ name: 'trigger', element: 'Slot.Root', description: 'asChild trigger' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Trigger content (e.g. Button)',
        },
      ],
      usesFactory: true,
      description:
        'Slot-based trigger that opens the native file dialog; stops propagation to prevent dropzone double-fire',
    },
    {
      name: 'ItemGroup',
      slots: [{ name: 'itemGroup', element: 'ul', description: 'File list container' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Item components',
        },
      ],
      usesFactory: true,
      description: 'Unstyled list container (ul) for file items with role=list',
    },
    {
      name: 'Item',
      slots: [{ name: 'item', element: 'li', description: 'File row' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Item contents (Preview, Name, Size, Delete, etc.)',
        },
        {
          name: 'file',
          type: 'File',
          moveSpecific: true,
          description: 'The File object this item represents',
        },
      ],
      usesFactory: true,
      description:
        'Individual file item with stagger enter animation, exit animation on auto-remove, and FileUploadItemContext provider',
    },
    {
      name: 'ItemPreview',
      slots: [{ name: 'itemPreview', element: 'div', description: 'Preview thumbnail' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Custom fallback icon for non-image files',
        },
      ],
      usesFactory: true,
      description:
        'Image thumbnail preview (via object URL) for image files, fallback file icon for other types',
    },
    {
      name: 'ItemName',
      slots: [{ name: 'itemName', element: 'span', description: 'File name text' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
      ],
      usesFactory: true,
      description: 'Displays the file name with text-overflow ellipsis',
    },
    {
      name: 'ItemSize',
      slots: [{ name: 'itemSize', element: 'span', description: 'File size text' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
      ],
      usesFactory: true,
      description: 'Displays formatted file size (e.g. "2.4 MB") via formatFileSize utility',
    },
    {
      name: 'ItemDelete',
      slots: [{ name: 'itemDelete', element: 'button', description: 'Delete/complete button' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description:
            'Custom delete icon (defaults to X icon). Localize the default "Remove {filename}" announcement via the Root labels prop.',
        },
      ],
      usesFactory: true,
      description:
        'Remove button per file item; aborts upload if in progress; renders check icon when upload is complete',
    },
    {
      name: 'ClearTrigger',
      slots: [{ name: 'clearTrigger', element: 'Slot.Root', description: 'Clear all trigger' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Trigger content (e.g. Button)',
        },
      ],
      usesFactory: true,
      description: 'Slot-based trigger that clears all files and aborts any in-progress uploads',
    },
    {
      name: 'ItemProgress',
      slots: [{ name: 'itemProgress', element: 'div', description: 'Per-file progress wrapper' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
      ],
      usesFactory: true,
      description:
        'Per-file upload progress bar; renders ProgressBar component; hidden when pending or complete',
    },
    {
      name: 'ItemStatus',
      slots: [{ name: 'itemStatus', element: 'span', description: 'Status text' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
      ],
      usesFactory: true,
      description:
        'Per-file upload status text display (percent during upload, "Done" on complete, "Failed" on error)',
    },
    {
      name: 'TotalProgress',
      slots: [{ name: 'totalProgress', element: 'div', description: 'Total progress wrapper' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'showLabel',
          type: 'boolean',
          default: 'false',
          moveSpecific: true,
          description: 'Show percentage label alongside progress bar',
        },
      ],
      usesFactory: true,
      description:
        'Aggregate progress bar across all uploading files with fade-out animation on completion',
    },
    {
      name: 'UploadTrigger',
      slots: [{ name: 'uploadTrigger', element: 'Slot.Root', description: 'Upload all trigger' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Trigger content (e.g. Button)',
        },
      ],
      usesFactory: true,
      description:
        'Slot-based trigger that starts uploading all pending files; disabled when no pending files or upload in progress',
    },
  ],

  props: [
    {
      name: 'accept',
      type: 'string | string[]',
      moveSpecific: true,
      description: 'Accepted file types — MIME types, extensions, or wildcards',
    },
    {
      name: 'maxSize',
      type: 'number',
      moveSpecific: true,
      description: 'Maximum file size in bytes',
    },
    {
      name: 'maxFiles',
      type: 'number',
      moveSpecific: true,
      description: 'Maximum number of files',
    },
    {
      name: 'multiple',
      type: 'boolean',
      default: 'true',
      moveSpecific: true,
      description: 'Allow multiple file selection',
    },
    { name: 'disabled', type: 'boolean', moveSpecific: true, description: 'Disabled state' },
    { name: 'value', type: 'File[]', moveSpecific: true, description: 'Controlled file list' },
    {
      name: 'defaultValue',
      type: 'File[]',
      moveSpecific: true,
      description: 'Default file list (uncontrolled)',
    },
    {
      name: 'onFilesChange',
      type: '(files: File[]) => void',
      moveSpecific: true,
      description: 'Called when the file list changes',
    },
    {
      name: 'onFileReject',
      type: '(rejections: FileRejection[]) => void',
      moveSpecific: true,
      description: 'Called when files fail validation',
    },
    {
      name: 'validate',
      type: '(file: File) => string | null',
      moveSpecific: true,
      description: 'Custom per-file validation function',
    },
    {
      name: 'size',
      typeRef: 'Size',
      default: "'md'",
      moveSpecific: true,
      description: 'Component size',
    },
    {
      name: 'variant',
      type: "'default' | 'compact'",
      default: "'default'",
      moveSpecific: true,
      description: 'Layout variant',
    },
    {
      name: 'adapter',
      type: 'FileUploadAdapter',
      moveSpecific: true,
      description: 'Upload adapter function for server uploads',
    },
    {
      name: 'autoUpload',
      type: 'boolean',
      default: 'false',
      moveSpecific: true,
      description: 'Automatically start uploading when files are added',
    },
    {
      name: 'concurrency',
      type: 'number',
      default: '3',
      moveSpecific: true,
      description: 'Maximum concurrent uploads',
    },
    {
      name: 'removeOnComplete',
      type: 'boolean | number',
      moveSpecific: true,
      description: 'Remove files from list after upload completes',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description: 'Sub-components (Dropzone, Trigger, ItemGroup, etc.)',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-size', 'data-variant', 'data-disabled'],
    children: [
      {
        slot: 'dropzone',
        dataAttributes: ['data-drag-active', 'data-drag-reject', 'data-disabled'],
      },
      { slot: 'trigger' },
      {
        slot: 'itemGroup',
        children: [
          {
            slot: 'item',
            dataAttributes: ['data-upload-status'],
            children: [
              { slot: 'itemPreview', dataAttributes: ['data-has-preview'] },
              { slot: 'itemName' },
              { slot: 'itemSize' },
              { slot: 'itemProgress' },
              { slot: 'itemStatus', dataAttributes: ['data-status'] },
              { slot: 'itemDelete' },
            ],
          },
        ],
      },
      { slot: 'totalProgress', dataAttributes: ['data-uploading', 'data-complete'] },
      { slot: 'clearTrigger' },
      { slot: 'uploadTrigger' },
    ],
  },

  controlled: 'value' as const,
  controlledProps: {
    valueProp: 'value',
    defaultValueProp: 'defaultValue',
    onChangeProp: 'onFilesChange',
  },

  keyboard: null,
  focus: 'delegated' as const,
  formType: null,
  asChild: false,

  animations: [
    {
      trigger: 'Dropzone.hover',
      sequence: [{ animation: { scale: { to: 1.04, ease: 'snappy' } } }],
    },
    {
      trigger: 'Dropzone.press',
      sequence: [{ animation: { scale: { to: 0.96, ease: 'snappy' } } }],
    },
  ],

  tokens: [
    {
      name: '--move-fileupload-border-color',
      value: 'var(--move-border-base)',
      description: 'Dropzone border color',
    },
    {
      name: '--move-fileupload-border-style',
      value: 'dashed',
      description: 'Dropzone border style',
    },
    { name: '--move-fileupload-border-width', value: '2px', description: 'Dropzone border width' },
    {
      name: '--move-fileupload-border-radius',
      value: 'var(--move-rounded-lg)',
      description: 'Dropzone border radius',
    },
    {
      name: '--move-fileupload-bg',
      value: 'var(--move-bg-subtle)',
      description: 'Dropzone background color',
    },
    {
      name: '--move-fileupload-fg',
      value: 'var(--move-fg-muted)',
      description: 'Dropzone foreground/text color',
    },
    {
      name: '--move-fileupload-padding',
      value: 'var(--move-spacing-lg)',
      description: 'Dropzone internal padding',
    },
    {
      name: '--move-fileupload-gap',
      value: 'var(--move-spacing-md)',
      description: 'Gap between root children (dropzone, item list, etc.)',
    },
    {
      name: '--move-fileupload-font-size',
      value: 'var(--move-size-sm)',
      description: 'Base font size',
    },
    {
      name: '--move-fileupload-active-border-color',
      value: 'var(--move-primary)',
      description: 'Dropzone border color when drag is active',
    },
    {
      name: '--move-fileupload-active-bg',
      value: 'color-mix(in srgb, var(--move-primary) 8%, transparent)',
      description: 'Dropzone background when drag is active',
    },
    {
      name: '--move-fileupload-reject-border-color',
      value: 'var(--move-error)',
      description: 'Dropzone border color when drag is rejected',
    },
    {
      name: '--move-fileupload-reject-bg',
      value: 'color-mix(in srgb, var(--move-error) 8%, transparent)',
      description: 'Dropzone background when drag is rejected',
    },
    {
      name: '--move-fileupload-transition',
      value: 'var(--move-transition-fast) var(--move-ease-default)',
      description: 'Transition timing for border and background changes',
    },
  ],

  variants: {
    variant: ['default', 'compact'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [
    {
      key: 'removeFile',
      default: 'Remove {filename}',
      description: 'Aria-label for the per-file delete button (template with filename)',
    },
    {
      key: 'uploadComplete',
      default: 'Upload complete',
      description: 'Aria-label for the check icon shown on completed uploads',
    },
  ],

  renderContracts: [
    {
      id: 'root-provides-context',
      description:
        'Root provides FileUploadContext to all children with files, drag state, addFiles, removeFile, clearFiles, openFileDialog, upload adapter methods, and animation config',
    },
    {
      id: 'root-hidden-input',
      description:
        'Root renders a visually hidden file input that is triggered by openFileDialog; input accept/multiple attributes mirror Root props',
    },
    {
      id: 'root-upload-manager',
      description:
        'Root creates useUploadManager (inert when no adapter) and wires trackFiles/untrackFile into addFiles/removeFile/clearFiles',
    },
    {
      id: 'dropzone-drag-handlers',
      description:
        'Dropzone receives drag handlers from getDropzoneProps (onDragEnter, onDragOver, onDragLeave, onDrop) and also opens file dialog on click',
    },
    {
      id: 'dropzone-visual-feedback',
      description:
        'Dropzone sets data-drag-active/data-drag-reject based on drag state; border changes from dashed to solid during active drag',
    },
    {
      id: 'trigger-stops-propagation',
      description: 'Trigger stops click propagation to prevent dropzone click from double-firing',
    },
    {
      id: 'item-provides-item-context',
      description:
        'Item provides FileUploadItemContext (file + entry) so child sub-components can read file info and upload status',
    },
    {
      id: 'item-stagger-animation',
      description:
        'Items receive stagger enter animation (opacity [0,1] + translateY [8,0], 50ms stagger delay per index) via context from Root',
    },
    {
      id: 'item-exit-on-complete',
      description:
        'When removeOnComplete is set, completed items animate out (opacity [1,0] + scale [1,0.97], 600ms) after the specified delay',
    },
    {
      id: 'item-preview-object-url',
      description: 'ItemPreview creates and revokes object URLs for image file thumbnails',
    },
    {
      id: 'item-delete-complete-state',
      description:
        'ItemDelete renders as a span with check icon (not a button) when entry status is complete',
    },
    {
      id: 'item-delete-aborts-uploading',
      description:
        'ItemDelete aborts the upload if entry is currently uploading before removing the file',
    },
    {
      id: 'clear-trigger-aborts-all',
      description: 'ClearTrigger aborts all in-progress uploads before clearing the file list',
    },
    {
      id: 'item-progress-conditional',
      description:
        'ItemProgress renders only when entry exists and status is uploading or error (hidden when pending or complete)',
    },
    {
      id: 'total-progress-fade-out',
      description:
        'TotalProgress fades out (opacity [1,0] + scale [1,0.97], 600ms) when transitioning from active to inactive state',
    },
    {
      id: 'upload-trigger-disabled-logic',
      description:
        'UploadTrigger is disabled when disabled, no pending files, or upload already in progress',
    },
    {
      id: 'uses-progress-bar',
      description: 'ItemProgress and TotalProgress render the ProgressBar component internally',
    },
  ],

  childrenKind: 'composition' as const,
  propRoles: {
    accept: 'behavior' as const,
    maxSize: 'behavior' as const,
    maxFiles: 'behavior' as const,
    multiple: 'behavior' as const,
    disabled: 'behavior' as const,
    value: 'behavior' as const,
    defaultValue: 'behavior' as const,
    adapter: 'behavior' as const,
    autoUpload: 'behavior' as const,
    concurrency: 'behavior' as const,
    removeOnComplete: 'behavior' as const,
    size: 'data' as const,
    variant: 'data' as const,
    children: 'composition' as const,
  },

  hasHook: true,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],
  componentDeps: ['ProgressBar'] as string[],

  testing: {
    behaviors: [
      'Root renders with FileUploadContext provider',
      'Root renders hidden file input with correct accept and multiple attributes',
      'Root defaults multiple to true',
      'Root defaults size to md',
      'Root defaults variant to default',
      'Dropzone receives drag handlers from useFileUpload',
      'Dropzone opens file dialog on click when not disabled',
      'Dropzone shows data-drag-active during drag',
      'Dropzone shows data-drag-reject when file type is not accepted',
      'Dropzone is disabled when Root disabled=true',
      'Trigger opens file dialog on click via Slot.Root',
      'Trigger stops click propagation',
      'ItemGroup renders as ul with role=list',
      'Item renders as li with data-upload-status attribute',
      'Item provides FileUploadItemContext to children',
      'ItemPreview shows image thumbnail for image files',
      'ItemPreview shows fallback file icon for non-image files',
      'ItemPreview creates and revokes object URLs for thumbnails',
      'ItemName displays file.name with text-overflow ellipsis',
      'ItemSize displays formatted file size via formatFileSize',
      'ItemDelete renders button with aria-label "Remove {filename}"',
      'ItemDelete renders check icon when entry status is complete',
      'ItemDelete aborts upload when entry status is uploading',
      'ClearTrigger clears all files and aborts all uploads',
      'ClearTrigger is disabled when no files are present',
      'ItemProgress renders ProgressBar when uploading or error',
      'ItemProgress is hidden when status is pending or complete',
      'ItemStatus shows percentage during upload',
      'ItemStatus shows "Done" when complete',
      'ItemStatus shows "Failed" when error',
      'TotalProgress shows aggregate progress across all files',
      'TotalProgress fades out when all uploads complete',
      'UploadTrigger starts uploading all pending files',
      'UploadTrigger is disabled when no pending files',
      'UploadTrigger is disabled during active upload',
      'Compact variant changes dropzone to horizontal layout',
      'Size sm reduces padding, gap, and font size',
      'Size lg increases padding, gap, and font size',
      'File validation rejects files exceeding maxSize',
      'File validation rejects invalid file types',
      'File validation respects maxFiles limit',
      'Custom validate function is called per file',
      'Rejected files trigger onFileReject callback',
      'Forwards className and style on Root',
      'Forwards className and style on Dropzone',
    ],
    keyboard: [
      'Dropzone is focusable and shows focus ring',
      'ItemDelete button is focusable and shows focus ring',
    ],
    aria: [
      'Dropzone has role=presentation',
      'ItemGroup has role=list',
      'ItemDelete has aria-label describing the file name',
      'ItemDelete complete state has aria-label "Upload complete"',
      'Disabled state sets data-disabled on root and dropzone',
    ],
    animation: [
      'Items enter with stagger animation (opacity + translateY, 50ms delay per index)',
      'Items exit with fade-out animation when removeOnComplete triggers',
      'TotalProgress fades out when transitioning from active to inactive',
      'Reduced motion preference skips animations and applies final styles immediately',
      'Enter animation uses getInitialStyles for initial opacity and transform',
    ],
    form: [
      'Controlled value prop syncs file list from parent',
      'Uncontrolled defaultValue initializes file list',
      'onFilesChange fires when files are added or removed',
    ],
  },

  iconsUsed: ['circle-check', 'file', 'x'],
} satisfies ComponentSpec;
