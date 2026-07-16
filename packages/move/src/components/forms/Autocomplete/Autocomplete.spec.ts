// Autocomplete.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'Autocomplete',
  animationPatterns: ['popupMenu'],
  componentClass: 'input_popup' as const,
  category: 'forms',
  description:
    'Searchable dropdown with single/multi-value support, tag management, keyboard navigation, and filtered option list',
  // Family memberships. All values are arrays even when only one
  // applies — keeps downstream tooling simple. See
  // `src/shared/families.ts` for the allowed values per axis.
  choreographies: ['popupMenu'],
  families: {
    behavior: ['popup-anchored'],
    state: ['controlled-value', 'controlled-open'],
    a11y: ['combobox'],
  },

  // Behavior-family-specific contract. The popup family asserts a
  // component closes on Escape, outside click, scroll, and resize.
  // Declared as the *intended* behavior; the family drift check
  // verifies these stay consistent and a future Playwright pass
  // verifies the runtime matches.
  behavior: {
    popup: {
      closeOnEscape: true,
      closeOnOutsideClick: true,
      closeOnScroll: true,
      closeOnResize: true,
    },
  },

  compound: true,
  rootElement: 'div',
  slots: [
    {
      name: 'trigger',
      element: 'div',
      description: 'Input wrapper that anchors the popover, mirrors InputText styling',
    },
    {
      name: 'triggerContent',
      element: 'div',
      description: 'Flex-wrap area for tags and input within trigger',
    },
    {
      name: 'triggerActions',
      element: 'div',
      description: 'Pinned action buttons area (icon, clear) within trigger',
    },
    { name: 'input', element: 'input', description: 'Combobox text input for searching/filtering' },
    {
      name: 'tagList',
      element: 'div',
      description: 'Container for selected value tags in multi mode',
    },
    { name: 'tag', element: 'span', description: 'Individual selected value tag chip' },
    { name: 'tagRemove', element: 'button', description: 'Remove button inside each tag' },
    {
      name: 'icon',
      element: 'span',
      description: 'Chevron indicator icon with open/close rotation animation',
    },
    {
      name: 'clearTrigger',
      element: 'button',
      description: 'Clear all button, visible when values or input text exist',
    },
    {
      name: 'content',
      element: 'div',
      description: 'Radix Popover.Content popup container with enter/exit animation',
    },
    { name: 'contentInner', element: 'div', description: 'Scrollable listbox inner container' },
    {
      name: 'item',
      element: 'div',
      description: 'Individual option item with hover scale animation',
    },
    {
      name: 'itemIndicator',
      element: 'span',
      description: 'Check icon indicator for selected items in multi mode',
    },
    { name: 'group', element: 'div', description: 'Grouping container for related items' },
    { name: 'groupLabel', element: 'div', description: 'Label heading for a group of items' },
    {
      name: 'empty',
      element: 'div',
      description: 'Empty state message shown when no items match filter',
    },
    {
      name: 'loading',
      element: 'div',
      description: 'Loading indicator shown when loading prop is true',
    },
    {
      name: 'error',
      element: 'div',
      description: 'Error state message shown when the resource is in an error state',
    },
    {
      name: 'retryTrigger',
      element: 'button',
      description: 'Button that re-runs the resource fetch, shown in the error state',
    },
    { name: 'separator', element: 'div', description: 'Visual separator between groups or items' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [],
      props: [
        {
          name: 'value',
          type: 'string | string[]',
          moveSpecific: true,
          description: 'Controlled selected value(s)',
        },
        {
          name: 'defaultValue',
          type: 'string | string[]',
          moveSpecific: true,
          description: 'Default selected value(s) (uncontrolled)',
        },
        {
          name: 'onValueChange',
          type: '(value: string | string[]) => void',
          moveSpecific: true,
          description: 'Called when selected value changes',
        },
        { name: 'open', type: 'boolean', moveSpecific: true, description: 'Controlled open state' },
        {
          name: 'defaultOpen',
          type: 'boolean',
          default: 'false',
          moveSpecific: true,
          description: 'Default open state (uncontrolled)',
        },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          moveSpecific: true,
          description: 'Called when open state changes',
        },
        {
          name: 'multiple',
          type: 'boolean',
          default: 'false',
          moveSpecific: true,
          description: 'Enable multi-select with tags',
        },
        {
          name: 'inputValue',
          type: 'string',
          moveSpecific: true,
          description: 'Controlled input text value',
        },
        {
          name: 'defaultInputValue',
          type: 'string',
          default: "''",
          moveSpecific: true,
          description: 'Default input text (uncontrolled)',
        },
        {
          name: 'onInputValueChange',
          type: '(value: string) => void',
          moveSpecific: true,
          description: 'Called when input text changes',
        },
        {
          name: 'loading',
          type: 'boolean',
          default: 'false',
          moveSpecific: true,
          description: 'Show loading state in content',
        },
        {
          name: 'resource',
          type: 'AsyncResource<unknown>',
          moveSpecific: true,
          description:
            'Async data source driving loading/error state for the options list (supersedes loading; feeds RetryTrigger)',
        },
        {
          name: 'animations',
          type: 'AnimationTrigger[] | false',
          moveSpecific: true,
          description: 'Animation config for popup enter/exit',
        },
        {
          name: 'closeOnSelect',
          type: 'boolean',
          moveSpecific: true,
          description:
            'Close popup after selection (defaults to true for single, false for multiple)',
        },
        {
          name: 'openOnFocus',
          type: 'boolean',
          default: 'true',
          moveSpecific: true,
          description: 'Open popup when input receives focus',
        },
        {
          name: 'allowCustomValue',
          type: 'boolean',
          default: 'false',
          moveSpecific: true,
          description: 'Allow input value that does not match any item',
        },
        {
          name: 'filterFn',
          type: '(inputValue: string, itemValue: string, itemLabel: string) => boolean',
          moveSpecific: true,
          description: 'Custom filter function for items',
        },
        {
          name: 'labels',
          type: 'Partial<AutocompleteLabels>',
          moveSpecific: true,
          description: 'Accessible label overrides (clearAll, removeTag, retry)',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Autocomplete sub-components',
        },
      ],
      usesFactory: false,
      description:
        'Stateful root that provides AutocompleteContext and wraps children in Radix Popover.Root',
    },
    {
      name: 'Trigger',
      slots: [
        { name: 'trigger', element: 'div', description: 'Input wrapper' },
        { name: 'triggerContent', element: 'div', description: 'Content area for tags and input' },
        { name: 'triggerActions', element: 'div', description: 'Actions area for icon and clear' },
      ],
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
          description: 'Input, TagList, Icon, ClearTrigger',
        },
        { name: 'disabled', type: 'boolean', moveSpecific: true, description: 'Disabled state' },
        { name: 'invalid', type: 'boolean', moveSpecific: true, description: 'Invalid state' },
        {
          name: 'size',
          typeRef: 'Size',
          default: "'md'",
          moveSpecific: true,
          description: 'Trigger size',
        },
        {
          name: 'variant',
          type: "'outlined' | 'filled'",
          default: "'outlined'",
          moveSpecific: true,
          description: 'Trigger variant',
        },
        {
          name: 'width',
          type: "React.CSSProperties['width']",
          moveSpecific: true,
          description: 'Explicit width override',
        },
      ],
      usesFactory: true,
      description:
        'Anchor wrapper that renders as Radix Popover.Anchor, splits children into content and actions',
    },
    {
      name: 'Input',
      slots: [{ name: 'input', element: 'input', description: 'Combobox input' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        {
          name: 'style',
          type: 'React.CSSProperties',
          moveSpecific: false,
          description: 'Inline styles',
        },
        {
          name: 'placeholder',
          type: 'string',
          moveSpecific: true,
          description: 'Input placeholder text',
        },
        { name: 'disabled', type: 'boolean', moveSpecific: true, description: 'Disabled state' },
      ],
      usesFactory: true,
      description:
        'Combobox input with ARIA attributes, keyboard navigation, and filter-on-type behavior',
    },
    {
      name: 'TagList',
      slots: [{ name: 'tagList', element: 'div', description: 'Tags container' }],
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
          description: 'Custom tag elements or auto-generated',
        },
      ],
      usesFactory: true,
      description: 'Container for selected tags in multi mode; renders nothing when empty',
    },
    {
      name: 'Tag',
      slots: [
        { name: 'tag', element: 'span', description: 'Tag chip' },
        { name: 'tagRemove', element: 'button', description: 'Remove button' },
      ],
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
          description: 'Tag label content',
        },
        {
          name: 'value',
          type: 'string',
          moveSpecific: true,
          description: 'Value this tag represents',
        },
      ],
      usesFactory: true,
      description: 'Individual tag chip with remove button for deselecting a value',
    },
    {
      name: 'Icon',
      slots: [{ name: 'icon', element: 'span', description: 'Chevron icon' }],
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
          description: 'Custom icon content',
        },
      ],
      usesFactory: true,
      description: 'Chevron indicator icon with animated open/close rotation (180deg)',
    },
    {
      name: 'ClearTrigger',
      slots: [{ name: 'clearTrigger', element: 'button', description: 'Clear button' }],
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
          description: 'Custom icon content',
        },
      ],
      usesFactory: true,
      description: 'Clear all button that resets selection and input text; hidden when empty',
    },
    {
      name: 'Content',
      slots: [
        { name: 'content', element: 'div', description: 'Popover content' },
        { name: 'contentInner', element: 'div', description: 'Scrollable listbox' },
      ],
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
          description: 'Items, groups, empty, loading',
        },
        {
          name: 'sideOffset',
          type: 'number',
          default: '4',
          moveSpecific: true,
          description: 'Offset from trigger',
        },
        {
          name: 'align',
          type: "'start' | 'center' | 'end'",
          default: "'start'",
          moveSpecific: true,
          description: 'Alignment relative to trigger',
        },
        {
          name: 'container',
          type: 'HTMLElement',
          moveSpecific: false,
          description: 'Custom portal mount target. Defaults to document.body.',
        },
        {
          name: 'width',
          type: 'string | number',
          moveSpecific: true,
          description: 'Override the popover width.',
        },
        {
          name: 'minWidth',
          type: 'string | number',
          moveSpecific: true,
          description: 'Minimum popover width.',
        },
        {
          name: 'maxWidth',
          type: 'string | number',
          moveSpecific: true,
          description: 'Maximum popover width.',
        },
      ],
      usesFactory: true,
      description:
        'Animated popup content with scrollable listbox, height animation, and bake-in portaling.',
    },
    {
      name: 'Item',
      slots: [
        { name: 'item', element: 'div', description: 'Option item' },
        { name: 'itemIndicator', element: 'span', description: 'Check indicator for multi mode' },
      ],
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
          description: 'Item label content',
        },
        {
          name: 'value',
          type: 'string',
          moveSpecific: true,
          description: 'Item value for selection',
        },
        {
          name: 'label',
          type: 'string',
          moveSpecific: true,
          description: 'Text label for filtering (extracted from children if omitted)',
        },
        { name: 'disabled', type: 'boolean', moveSpecific: true, description: 'Disabled state' },
      ],
      usesFactory: true,
      description:
        'Individual option item with filtering, keyboard highlight, selection, and hover scale animation',
    },
    {
      name: 'ItemIndicator',
      slots: [{ name: 'itemIndicator', element: 'span', description: 'Check icon' }],
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
          description: 'Custom indicator icon',
        },
      ],
      usesFactory: true,
      description:
        'Check icon shown for selected items, reads selection state from AutocompleteItemContext',
    },
    {
      name: 'Group',
      slots: [{ name: 'group', element: 'div', description: 'Group container' }],
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
          description: 'GroupLabel and items',
        },
      ],
      usesFactory: true,
      description: 'Grouping wrapper with role="group"',
    },
    {
      name: 'GroupLabel',
      slots: [{ name: 'groupLabel', element: 'div', description: 'Group label' }],
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
          description: 'Label text',
        },
      ],
      usesFactory: true,
      description: 'Heading label for a group of items',
    },
    {
      name: 'Empty',
      slots: [{ name: 'empty', element: 'div', description: 'Empty state' }],
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
          description: 'Empty message content',
        },
      ],
      usesFactory: true,
      description: 'Empty state message shown when not loading and no items visible',
    },
    {
      name: 'Loading',
      slots: [{ name: 'loading', element: 'div', description: 'Loading state' }],
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
          description: 'Loading indicator content',
        },
      ],
      usesFactory: true,
      description: 'Loading indicator shown when loading is true; has role="status" and aria-busy',
    },
    {
      name: 'Error',
      slots: [{ name: 'error', element: 'div', description: 'Error state' }],
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
          description: 'Error message content',
        },
      ],
      usesFactory: true,
      description: 'Error message shown when the resource is in an error state; has role="alert"',
    },
    {
      name: 'RetryTrigger',
      slots: [{ name: 'retryTrigger', element: 'button', description: 'Retry button' }],
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
          description: 'Retry button content',
        },
      ],
      usesFactory: true,
      description:
        'Re-runs the resource fetch; rendered only in the error state when the resource supplies a retry callback',
    },
    {
      name: 'Separator',
      slots: [{ name: 'separator', element: 'div', description: 'Separator line' }],
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
      description: 'Visual separator with role="separator"',
    },
  ],

  props: [
    {
      name: 'value',
      type: 'string | string[]',
      moveSpecific: true,
      description: 'Controlled selected value(s)',
    },
    {
      name: 'defaultValue',
      type: 'string | string[]',
      moveSpecific: true,
      description: 'Default selected value(s) (uncontrolled)',
    },
    {
      name: 'onValueChange',
      type: '(value: string | string[]) => void',
      moveSpecific: true,
      description: 'Called when selected value changes',
    },
    { name: 'open', type: 'boolean', moveSpecific: true, description: 'Controlled open state' },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: 'false',
      moveSpecific: true,
      description: 'Default open state (uncontrolled)',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      moveSpecific: true,
      description: 'Called when open state changes',
    },
    {
      name: 'multiple',
      type: 'boolean',
      default: 'false',
      moveSpecific: true,
      description: 'Enable multi-select mode',
    },
    {
      name: 'inputValue',
      type: 'string',
      moveSpecific: true,
      description: 'Controlled input text value',
    },
    {
      name: 'onInputValueChange',
      type: '(value: string) => void',
      moveSpecific: true,
      description: 'Called when input text changes',
    },
    {
      name: 'loading',
      type: 'boolean',
      default: 'false',
      moveSpecific: true,
      description: 'Loading state',
    },
    {
      name: 'resource',
      type: 'AsyncResource<unknown>',
      moveSpecific: true,
      description:
        'Async data source driving loading/error state for the options list (supersedes loading; feeds RetryTrigger)',
    },
    {
      name: 'animations',
      type: 'AnimationTrigger[] | false',
      moveSpecific: true,
      description: 'Animation config for popup',
    },
    {
      name: 'closeOnSelect',
      type: 'boolean',
      moveSpecific: true,
      description: 'Close after selection',
    },
    {
      name: 'openOnFocus',
      type: 'boolean',
      default: 'true',
      moveSpecific: true,
      description: 'Open on input focus',
    },
    {
      name: 'allowCustomValue',
      type: 'boolean',
      default: 'false',
      moveSpecific: true,
      description: 'Allow custom input values',
    },
    {
      name: 'filterFn',
      type: '(inputValue: string, itemValue: string, itemLabel: string) => boolean',
      moveSpecific: true,
      description: 'Custom filter function',
    },
    {
      name: 'labels',
      type: 'Partial<AutocompleteLabels>',
      moveSpecific: true,
      description: 'Accessible label overrides (clearAll, removeTag, retry)',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description: 'Autocomplete sub-components',
    },
  ],

  anatomy: {
    slot: 'trigger',
    dataAttributes: ['data-size', 'data-variant', 'data-disabled', 'data-invalid'],
    children: [
      {
        slot: 'triggerContent',
        children: [{ slot: 'tagList' }, { slot: 'input' }],
      },
      {
        slot: 'triggerActions',
        children: [{ slot: 'clearTrigger' }, { slot: 'icon' }],
      },
      {
        slot: 'content',
        dataAttributes: [],
        children: [
          {
            slot: 'contentInner',
            dataAttributes: ['data-mode'],
            ariaAttributes: ['role="listbox"', 'aria-multiselectable'],
            children: [
              {
                slot: 'group',
                children: [
                  { slot: 'groupLabel' },
                  {
                    slot: 'item',
                    dataAttributes: ['data-selected', 'data-highlighted', 'data-disabled'],
                    children: [{ slot: 'itemIndicator' }],
                  },
                ],
              },
              { slot: 'empty' },
              { slot: 'loading' },
              { slot: 'separator' },
            ],
          },
        ],
      },
    ],
  },

  controlled: 'value' as const,
  controlledProps: {
    value: { prop: 'value', defaultProp: 'defaultValue', handler: 'onValueChange' },
    open: { prop: 'open', defaultProp: 'defaultOpen', handler: 'onOpenChange' },
    inputValue: {
      prop: 'inputValue',
      defaultProp: 'defaultInputValue',
      handler: 'onInputValueChange',
    },
  },

  keyboard: 'linear' as const,
  focus: 'delegated' as const,
  formType: null,
  asChild: false,

  dismissBehavior: 'unmountAfterExit' as const,

  renderContracts: [
    {
      id: 'root-provides-context',
      description:
        'Root provides AutocompleteContext with hook return, animation config, isClosing, and onCloseComplete',
    },
    {
      id: 'root-wraps-radix-popover',
      description:
        'Root wraps children in Radix Popover.Root with externally controlled open state (open || isClosing)',
    },
    {
      id: 'trigger-splits-children',
      description:
        'Trigger splits children into content area (TagList, Input) and actions area (Icon, ClearTrigger) based on displayName',
    },
    {
      id: 'trigger-renders-anchor',
      description: 'Trigger renders as Radix Popover.Anchor with asChild',
    },
    {
      id: 'input-combobox-role',
      description:
        'Input has role="combobox" with aria-expanded, aria-controls, aria-activedescendant, aria-autocomplete="list", aria-haspopup="listbox"',
    },
    {
      id: 'content-height-animation',
      description: 'Content uses animateDimension for height reveal with staggered item animation',
    },
    {
      id: 'content-width-matches-trigger',
      description:
        'Content width is set to var(--radix-popover-trigger-width) to match trigger width',
    },
    {
      id: 'content-focus-prevention',
      description: 'Content prevents auto-focus on open and close to keep focus on input',
    },
    {
      id: 'item-registers-with-hook',
      description:
        'Item registers/unregisters with useAutocomplete item registry for filtering and keyboard navigation',
    },
    {
      id: 'item-hover-scale-animation',
      description:
        'Item animates scale to 1.02 on mouse enter using anime.js spring, reverts on leave',
    },
    {
      id: 'item-multi-indicator',
      description:
        'In multi mode, Item renders a built-in check indicator; in single mode, selected item gets filled background via CSS',
    },
    {
      id: 'trigger-move-state',
      description:
        'Trigger sets data-move-state="open"|"closed" reflecting true animation state (closed during exit, unlike Radix open state)',
    },
    {
      id: 'icon-rotation-animation',
      description:
        'Icon observes data-move-state on Trigger ancestor via MutationObserver and animates rotation to 180deg on open, 0deg on close',
    },
    {
      id: 'close-on-select-default',
      description: 'closeOnSelect defaults to true for single mode, false for multiple mode',
    },
    {
      id: 'single-restore-input',
      description:
        'In single mode on close, input text restores to the selected item label (unless allowCustomValue)',
    },
    {
      id: 'backspace-removes-last-tag',
      description: 'In multi mode, Backspace on empty input removes the last selected tag',
    },
    {
      id: 'clear-trigger-visibility',
      description: 'ClearTrigger only renders when there are selected values or input text',
    },
    {
      id: 'empty-visibility',
      description: 'Empty only renders when not loading and no visible items match filter',
    },
  ],

  animations: [
    {
      trigger: 'open',
      sequence: [
        [
          { target: 'Content', fn: 'animateDimension', animation: { height: { ease: 'poppy' } } },
          {
            target: 'ContentInner',
            children: '[role="option"]',
            animation: { scale: { from: 0.8, to: 1, ease: 'poppy' }, opacity: { from: 0, to: 1 } },
            stagger: { delay: 30 },
          },
          { target: 'Icon', animation: { rotate: { to: 180, ease: 'outQuart', duration: 300 } } },
        ],
      ],
    },
    {
      trigger: 'closed',
      sequence: [
        [
          { target: 'Content', fn: 'animateDimension', animation: { height: { ease: 'snappy' } } },
          {
            target: 'ContentInner',
            children: '[role="option"]',
            animation: { scale: { to: 0.8, ease: 'snappy' }, opacity: { to: 0 } },
            stagger: { delay: 20, from: 'last' },
          },
          { target: 'Icon', animation: { rotate: { to: 0, ease: 'outQuart', duration: 300 } } },
        ],
      ],
    },
  ],

  tokens: [
    // Trigger tokens
    {
      name: '--move-autocomplete-trigger-bg',
      value: 'var(--move-bg-subtle)',
      description: 'Trigger background color',
    },
    {
      name: '--move-autocomplete-trigger-border',
      value: 'var(--move-border-interactive)',
      description: 'Trigger border color',
    },
    {
      name: '--move-autocomplete-trigger-border-hover',
      value: 'var(--move-border-emphasis)',
      description: 'Trigger border color on hover',
    },
    {
      name: '--move-autocomplete-trigger-border-focus',
      value: 'var(--move-primary)',
      description: 'Trigger border color on focus-within',
    },
    {
      name: '--move-autocomplete-trigger-radius',
      value: 'var(--move-rounded-md)',
      description: 'Trigger border radius',
    },
    {
      name: '--move-autocomplete-trigger-padding-x',
      value: 'var(--move-spacing-sm)',
      description: 'Trigger horizontal padding',
    },
    {
      name: '--move-autocomplete-trigger-padding-y',
      value: 'var(--move-spacing-sm)',
      description: 'Trigger vertical padding',
    },
    {
      name: '--move-autocomplete-trigger-fg',
      value: 'var(--move-fg-base)',
      description: 'Trigger text color',
    },
    {
      name: '--move-autocomplete-trigger-height',
      value: 'var(--move-control-height-md)',
      description: 'Trigger minimum height',
    },
    // Tag tokens
    {
      name: '--move-autocomplete-tag-bg',
      value: 'var(--move-bg-muted)',
      description: 'Tag background color',
    },
    {
      name: '--move-autocomplete-tag-fg',
      value: 'var(--move-fg-base)',
      description: 'Tag text color',
    },
    {
      name: '--move-autocomplete-tag-border',
      value: 'var(--move-border-interactive)',
      description: 'Tag border color',
    },
    {
      name: '--move-autocomplete-tag-radius',
      value: 'var(--move-rounded-sm)',
      description: 'Tag border radius',
    },
    // Content tokens
    {
      name: '--move-autocomplete-content-bg',
      value: 'var(--move-bg-subtle)',
      description: 'Content popup background',
    },
    {
      name: '--move-autocomplete-content-border',
      value: 'var(--move-border-base)',
      description: 'Content popup border color',
    },
    {
      name: '--move-autocomplete-content-radius',
      value: 'var(--move-rounded-lg)',
      description: 'Content popup border radius',
    },
    {
      name: '--move-autocomplete-content-shadow',
      value: 'var(--move-shadow-overlay)',
      description: 'Content popup box shadow',
    },
    {
      name: '--move-autocomplete-content-padding',
      value: 'var(--move-spacing-xs)',
      description: 'Content popup inner padding',
    },
    // Item tokens
    {
      name: '--move-autocomplete-item-radius',
      value: 'var(--move-rounded-md)',
      description: 'Item border radius',
    },
    {
      name: '--move-autocomplete-item-padding-x',
      value: 'var(--move-spacing-sm)',
      description: 'Item horizontal padding',
    },
    {
      name: '--move-autocomplete-item-padding-y',
      value: 'var(--move-spacing-xs)',
      description: 'Item vertical padding',
    },
    {
      name: '--move-autocomplete-item-fg',
      value: 'var(--move-fg-base)',
      description: 'Item text color',
    },
    {
      name: '--move-autocomplete-item-bg-highlight',
      value: 'var(--move-bg-muted)',
      description: 'Item background when highlighted',
    },
    {
      name: '--move-autocomplete-item-font-size',
      value: 'var(--move-size-sm)',
      description: 'Item font size',
    },
    // Group label tokens
    {
      name: '--move-autocomplete-groupLabel-fg',
      value: 'var(--move-fg-muted)',
      description: 'Group label text color',
    },
    {
      name: '--move-autocomplete-groupLabel-font-weight',
      value: 'var(--move-weight-semibold)',
      description: 'Group label font weight',
    },
    // Separator token
    {
      name: '--move-autocomplete-separator-color',
      value: 'var(--move-border-base)',
      description: 'Separator line color',
    },
  ],

  variants: {
    variant: ['outlined', 'filled'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [
    { key: 'clearAll', default: 'Clear all', description: 'ClearTrigger accessible label' },
    {
      key: 'removeTag',
      default: 'Remove {value}',
      description: 'Tag remove button accessible label template',
    },
    {
      key: 'retry',
      default: 'Retry',
      description: 'RetryTrigger default text (shown when no children given)',
    },
  ],

  childrenKind: 'composition' as const,
  propRoles: {
    value: 'behavior' as const,
    defaultValue: 'behavior' as const,
    multiple: 'behavior' as const,
    inputValue: 'behavior' as const,
    loading: 'behavior' as const,
    animations: 'behavior' as const,
    closeOnSelect: 'behavior' as const,
    openOnFocus: 'behavior' as const,
    allowCustomValue: 'behavior' as const,
    filterFn: 'behavior' as const,
    children: 'composition' as const,
  },

  hasHook: true,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],
  radixPrimitive: 'Popover',
  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Root provides AutocompleteContext to children',
      'Root wraps children in Radix Popover.Root',
      'Trigger renders as Radix Popover.Anchor',
      'Trigger splits children into content and action areas by displayName',
      'Input renders with role="combobox" and ARIA combobox attributes',
      'Input opens popup on focus when openOnFocus=true',
      'Input typing filters visible items via filterFn',
      'Input typing opens popup if closed',
      'Item registers with item registry on mount, unregisters on unmount',
      'Item is hidden when filterFn returns false',
      'Item click selects value in single mode',
      'Item click toggles value in multi mode',
      'Single mode: selecting item sets input text to item label and closes',
      'Multi mode: selecting item adds tag, clears input text',
      'Multi mode: TagList renders tags for selected values',
      'Multi mode: Tag remove button deselects value and refocuses input',
      'ClearTrigger clears all selected values and input text',
      'ClearTrigger is hidden when no values and no input text',
      'Empty renders when no visible items and not loading',
      'Loading renders when loading=true',
      'Content width matches trigger width via --radix-popover-trigger-width',
      'Content prevents auto-focus to preserve input focus',
      'closeOnSelect defaults true for single, false for multiple',
      'Single mode on close restores input text to selected item label',
      'Forwards className and style on Trigger',
      'Forwards className and style on Content',
      'allowCustomValue prevents input text restoration on close',
    ],
    keyboard: [
      'ArrowDown opens popup and highlights first item',
      'ArrowDown navigates to next visible non-disabled item',
      'ArrowUp navigates to previous visible non-disabled item',
      'Enter selects highlighted item',
      'Escape closes popup or clears input text',
      'Tab selects highlighted item and closes popup',
      'Backspace on empty input removes last tag in multi mode',
      'Home moves highlight to first item',
      'End moves highlight to last item',
    ],
    aria: [
      'Input has role="combobox"',
      'Input has aria-expanded reflecting open state',
      'Input has aria-controls pointing to listbox id',
      'Input has aria-activedescendant pointing to highlighted item id',
      'Input has aria-autocomplete="list"',
      'Input has aria-haspopup="listbox"',
      'ContentInner has role="listbox"',
      'ContentInner has aria-multiselectable in multi mode',
      'Item has role="option"',
      'Item has aria-selected reflecting selection state',
      'Item has aria-disabled when disabled',
      'Tag remove button has aria-label',
      'ClearTrigger has aria-label "Clear all"',
      'Empty has role="status" and aria-live="polite"',
      'Loading has role="status", aria-busy, and aria-live="polite"',
      'Separator has role="separator"',
      'Group has role="group"',
      'Icon has aria-hidden="true"',
    ],
    animation: [
      'Content uses animateDimension with stagger for enter/exit',
      'Enter: opacity [0,1] + scale [0.5,1] with outQuart easing',
      'Exit: opacity [1,0] + scale [1,0.95] with outQuart easing, 200ms',
      'Stagger: items via [role="option"] selector with 30ms delay',
      'Item hover: spring scale to 1.02 on enter, back to 1 on leave',
      'Icon: chevron rotates 180deg on open, 0deg on close with outQuart easing',
      'animations={false} disables all animations including icon rotation',
      'Reduced motion preference disables animation',
    ],
  },

  iconsUsed: ['check', 'chevron-down', 'x'],
  integrationPoints: [
    {
      id: 'resource',
      kind: 'data' as const,
      contract: 'AsyncResource<unknown>',
      default: 'required' as const,
      fixture: 'fakeAsyncSource',
      sample: 'async',
      description:
        'Async source for the options list — drives the loading, error, and retry states.',
    },
  ],
} satisfies ComponentSpec;
