import type { ComponentMeta } from '../types';
import type { HighlightItem } from '../../../components/HighlightList';
import type { RelatedItem } from '../../../components/RelatedComponents';

const highlights: HighlightItem[] = [
  {
    icon: 'upload-cloud',
    text: 'Dropzone with drag-and-drop, plus an asChild Trigger so any element opens the OS file dialog. Together they cover the two common entry patterns without prescribing the rest of your layout.',
  },
  {
    icon: 'list',
    text: 'Built-in file list with previews, names, sizes, per-file progress bars, and abort buttons — or compose your own list around the same context.',
  },
  {
    icon: 'plug',
    text: 'Upload work happens through a pluggable adapter — pass a function that receives a File and returns a stream of progress events. Move handles the UI, you handle the network.',
  },
];

const related: RelatedItem[] = [
  {
    to: '/components/progress-bar',
    name: 'ProgressBar',
    reason: 'For standalone progress feedback. FileUpload uses it internally per file and for the aggregate total.',
  },
  {
    to: '/components/image',
    name: 'Image',
    reason: 'For displaying uploaded image previews after the upload completes.',
  },
];

export const meta: ComponentMeta = {
  slug: 'file-upload',
  preview: { width: 'fit' },
  name: 'FileUpload',
  tagline: 'Drag-and-drop file upload with previews, per-file progress, an aggregate progress bar, and a pluggable upload adapter — UI is yours, network is yours.',
  categories: ['forms'],
  badges: [
    { icon: 'boxes', label: 'Compound' },
    { icon: 'rabbit', label: 'Animated' },
  ],
  highlights,
  related,
  importCode: `import { FileUpload } from 'move';`,
  keyboard: [
    { key: 'Tab', action: 'Moves focus to the trigger, then to each item delete button.' },
    { key: 'Enter / Space', action: 'On the trigger — opens the OS file dialog. On a delete button — removes the file.' },
  ],
  accessibilityLede:
    'Item rows render as `<li>` inside a `role="list"` `<ul>`. The hidden `<input type="file">` keeps native file dialogs working. Drag-over state is reflected on the dropzone via data attributes for styling.',
};
