/**
 * Component Categories
 *
 * Maps category folders to demo group labels and placement decision rules.
 */

export interface CategoryDef {
  /** Folder name under src/components/ */
  folder: string;
  /** Label in demo/src/App.tsx componentGroups */
  demoGroup: string;
  /** Decision rule for placing a component in this category */
  rule: string;
}

export const CATEGORIES: readonly CategoryDef[] = [
  {
    folder: 'core',
    demoGroup: 'Core',
    rule: 'Appears everywhere, no specific domain. The atoms other components compose with. Includes universally-used primitives like Tooltip.',
  },
  {
    folder: 'form',
    demoGroup: 'Form',
    rule: 'Captures user input, participates in form submission, has value/checked/onChange. Date and time pickers are form inputs.',
  },
  {
    folder: 'panel',
    demoGroup: 'Panel',
    rule: 'Structures content in sections, expandable/collapsible, manages layout.',
  },
  {
    folder: 'overlay',
    demoGroup: 'Overlay',
    rule: 'Renders above the page in a portal/layer, has open/close lifecycle.',
  },
  {
    folder: 'navigation',
    demoGroup: 'Navigation',
    rule: 'Moves the user between views/sections, contains links or route-aware items.',
  },
  {
    folder: 'nav',
    demoGroup: 'Navigation',
    rule: 'Alternative navigation folder. Same rules as navigation.',
  },
  {
    folder: 'data',
    demoGroup: 'Data',
    rule: 'Displays structured data (rows, columns, lists, trees).',
  },
  {
    folder: 'media',
    demoGroup: 'Media',
    rule: 'Renders images, video, avatars, or aspect-constrained content.',
  },
  {
    folder: 'calendar',
    demoGroup: 'Calendar',
    rule: 'Inline calendar display with day/week/month/agenda views. NOT for date picking (that is form/).',
  },
  {
    folder: 'toolbar',
    demoGroup: 'Toolbar',
    rule: 'Toolbar-related controls: toggle buttons, toggle groups, toolbar containers.',
  },
  {
    folder: 'loading',
    demoGroup: 'Loading',
    rule: 'Feedback for async operations: spinners, skeletons, progress bars.',
  },
] as const;

/** Valid category folder names */
export const VALID_CATEGORIES = CATEGORIES.map(c => c.folder);

/** Map from folder to demo group label */
export const CATEGORY_TO_GROUP: Record<string, string> = Object.fromEntries(
  CATEGORIES.map(c => [c.folder, c.demoGroup])
);
