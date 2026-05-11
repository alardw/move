/**
 * Radix Primitives Reference
 *
 * Available Radix primitives used in Move, their sub-components, and import patterns.
 */

export interface RadixPrimitiveDef {
  /** Import name (e.g. 'Dialog') */
  importName: string;
  /** Sub-components available */
  subComponents: string[];
  /** Import pattern */
  importPattern: string;
  /** Move components that use this primitive */
  usedBy: string[];
}

export const RADIX_PRIMITIVES: Record<string, RadixPrimitiveDef> = {
  Avatar: {
    importName: 'Avatar',
    subComponents: ['Root', 'Image', 'Fallback'],
    importPattern: "import { Avatar as RadixAvatar } from 'radix-ui';",
    usedBy: ['Avatar'],
  },
  Dialog: {
    importName: 'Dialog',
    subComponents: ['Root', 'Trigger', 'Portal', 'Overlay', 'Content', 'Title', 'Description', 'Close'],
    importPattern: "import { Dialog as RadixDialog } from 'radix-ui';",
    usedBy: ['Dialog'],
  },
  DropdownMenu: {
    importName: 'DropdownMenu',
    subComponents: ['Root', 'Trigger', 'Portal', 'Content', 'Item', 'Separator', 'Label', 'Group', 'Sub', 'SubTrigger', 'SubContent'],
    importPattern: "import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';",
    usedBy: ['Dropdown', 'Select'],
  },
  Label: {
    importName: 'Label',
    subComponents: ['Root'],
    importPattern: "import { Label as RadixLabel } from 'radix-ui';",
    usedBy: ['Label'],
  },
  Popover: {
    importName: 'Popover',
    subComponents: ['Root', 'Trigger', 'Anchor', 'Portal', 'Content', 'Close', 'Arrow'],
    importPattern: "import { Popover as RadixPopover } from 'radix-ui';",
    usedBy: ['Popover', 'DatePicker', 'TimeField', 'Autocomplete', 'ColorInput'],
  },
  Progress: {
    importName: 'Progress',
    subComponents: ['Root', 'Indicator'],
    importPattern: "import { Progress as RadixProgress } from 'radix-ui';",
    usedBy: ['ProgressBar'],
  },
  RadioGroup: {
    importName: 'RadioGroup',
    subComponents: ['Root', 'Item', 'Indicator'],
    importPattern: "import { RadioGroup as RadixRadioGroup } from 'radix-ui';",
    usedBy: ['RadioGroup'],
  },
  Slider: {
    importName: 'Slider',
    subComponents: ['Root', 'Track', 'Range', 'Thumb'],
    importPattern: "import { Slider } from 'radix-ui';",
    usedBy: ['InputRange'],
  },
  Slot: {
    importName: 'Slot',
    subComponents: ['Root'],
    importPattern: "import { Slot } from 'radix-ui';",
    usedBy: ['Button', 'Link', 'Collapsible', 'Sidebar', 'FileUpload', 'Breadcrumb'],
  },
  Switch: {
    importName: 'Switch',
    subComponents: ['Root', 'Thumb'],
    importPattern: "import { Switch as RadixSwitch } from 'radix-ui';",
    usedBy: ['Switch'],
  },
  Tabs: {
    importName: 'Tabs',
    subComponents: ['Root', 'List', 'Trigger', 'Content'],
    importPattern: "import { Tabs as RadixTabs } from 'radix-ui';",
    usedBy: ['Tabs'],
  },
  Toggle: {
    importName: 'Toggle',
    subComponents: ['Root'],
    importPattern: "import { Toggle as RadixToggle } from 'radix-ui';",
    usedBy: ['ToggleButton'],
  },
  ToggleGroup: {
    importName: 'ToggleGroup',
    subComponents: ['Root', 'Item'],
    importPattern: "import { ToggleGroup as RadixToggleGroup } from 'radix-ui';",
    usedBy: ['ToggleGroup'],
  },
  Tooltip: {
    importName: 'Tooltip',
    subComponents: ['Provider', 'Root', 'Trigger', 'Portal', 'Content', 'Arrow'],
    importPattern: "import { Tooltip as RadixTooltip } from 'radix-ui';",
    usedBy: ['Tooltip'],
  },
} as const;

/** All Radix primitive names available */
export const AVAILABLE_PRIMITIVES = Object.keys(RADIX_PRIMITIVES);
