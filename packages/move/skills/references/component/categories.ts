/**
 * Component Categories — the single functional taxonomy.
 *
 * `folder` is the source folder under src/components/ AND the spec.category
 * value. A component lives in exactly one folder (its primary category); the
 * docs may cross-list it in a second category, but the source home is single.
 */

export interface CategoryDef {
  /** Folder under src/components/ + spec.category value. */
  folder: string;
  /** Display label (docs taxonomy). */
  label: string;
  /** Decision rule for placing a component in this category. */
  rule: string;
}

export const CATEGORIES: readonly CategoryDef[] = [
  {
    folder: 'actions',
    label: 'Actions',
    rule: 'Triggers an action on click/press — buttons and toolbar toggles. Not value-capturing form inputs.',
  },
  {
    folder: 'forms',
    label: 'Forms',
    rule: 'Captures user input, participates in form submission, has value/checked/onChange.',
  },
  {
    folder: 'date-time',
    label: 'Date & Time',
    rule: 'Date/time selection and display — calendars, date/time pickers and fields.',
  },
  {
    folder: 'layout',
    label: 'Layout',
    rule: 'Arranges other content with no domain meaning — stacks, grids, cards, dividers, split/scroll containers.',
  },
  {
    folder: 'navigation',
    label: 'Navigation',
    rule: 'Moves the user between views/sections — links, breadcrumbs, tabs, pagination, sidebar, stepper, table-of-contents.',
  },
  {
    folder: 'overlays',
    label: 'Overlays',
    rule: 'Renders above the page in a portal/layer with an open/close lifecycle — dialog, drawer, popover, dropdown, tooltip.',
  },
  {
    folder: 'data-display',
    label: 'Data Display',
    rule: 'Presents structured or entity data — tables, lists, timelines, avatars, badges, chat bubbles.',
  },
  {
    folder: 'feedback',
    label: 'Feedback',
    rule: 'Communicates status or async progress — alerts, toasts, loaders, spinners, skeletons, progress bars, empty states.',
  },
  {
    folder: 'disclosure',
    label: 'Disclosure',
    rule: 'Shows/hides content in place — accordion, collapsible.',
  },
  {
    folder: 'typography',
    label: 'Typography',
    rule: 'Renders text — headings, body text, prose, code.',
  },
  {
    folder: 'media',
    label: 'Media',
    rule: 'Renders images, video, audio, or aspect-constrained content.',
  },
] as const;

/** Valid category folder names. */
export const VALID_CATEGORIES = CATEGORIES.map((c) => c.folder);

/** Map from folder to display label. */
export const CATEGORY_TO_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.folder, c.label]),
);
