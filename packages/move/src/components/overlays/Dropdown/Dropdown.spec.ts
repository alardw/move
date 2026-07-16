// Dropdown.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'Dropdown',
  animationPatterns: ['popupMenu'],
  componentClass: 'overlay_popup' as const,
  category: 'overlays',
  preview: { staged: true, bare: true, width: 'sm' as const },
  description:
    'Context menu dropdown with animated height reveal, staggered item entrance, and sub-menu support via Radix DropdownMenu',
  choreographies: ['popupMenu'],
  families: {
    behavior: ['popup-anchored'],
    state: ['controlled-open'],
    a11y: ['menu'],
  },
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
      element: 'RadixDropdownMenu.Trigger',
      description: 'Button that opens the dropdown menu',
    },
    {
      name: 'content',
      element: 'RadixDropdownMenu.Content',
      description: 'Popup container with animated height and transform-origin',
    },
    {
      name: 'contentInner',
      element: 'div',
      description: 'Inner scrollable container inside content for height animation',
    },
    {
      name: 'arrow',
      element: 'RadixDropdownMenu.Arrow',
      description: 'Arrow pointing toward the trigger',
    },
    {
      name: 'item',
      element: 'RadixDropdownMenu.Item',
      description: 'Clickable menu item with hover scale animation',
    },
    {
      name: 'group',
      element: 'RadixDropdownMenu.Group',
      description: 'Structural group container for items',
    },
    {
      name: 'label',
      element: 'RadixDropdownMenu.Label',
      description: 'Non-interactive label for a group',
    },
    {
      name: 'checkboxItem',
      element: 'RadixDropdownMenu.CheckboxItem',
      description: 'Toggleable checkbox menu item',
    },
    {
      name: 'checkboxIndicator',
      element: 'span',
      description: 'Visual indicator for checkbox state',
    },
    { name: 'checkboxLabel', element: 'span', description: 'Text label for checkbox item' },
    {
      name: 'radioGroup',
      element: 'RadixDropdownMenu.RadioGroup',
      description: 'Radio group container',
    },
    {
      name: 'radioItem',
      element: 'RadixDropdownMenu.RadioItem',
      description: 'Radio option menu item',
    },
    {
      name: 'itemIndicator',
      element: 'RadixDropdownMenu.ItemIndicator',
      description: 'Visual indicator for radio/checkbox selection',
    },
    {
      name: 'separator',
      element: 'RadixDropdownMenu.Separator',
      description: 'Visual divider between groups',
    },
    {
      name: 'subTrigger',
      element: 'RadixDropdownMenu.SubTrigger',
      description: 'Item that opens a sub-menu',
    },
    {
      name: 'subContent',
      element: 'RadixDropdownMenu.SubContent',
      description: 'Sub-menu popup content',
    },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Dropdown sub-components',
        },
        {
          name: 'open',
          type: 'boolean',
          moveSpecific: false,
          description: 'Controlled open state',
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          moveSpecific: false,
          description: 'Initial open state (uncontrolled)',
        },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          moveSpecific: false,
          description: 'Called when open state changes',
        },
        {
          name: 'animations',
          type: 'AnimationTrigger[] | false',
          moveSpecific: true,
          description: 'Animation config or false to disable',
        },
      ],
      usesFactory: false,
      description:
        'Stateful root that manages open/close state, animation context, and close-after-exit coordination',
    },
    {
      name: 'Trigger',
      slots: [
        { name: 'trigger', element: 'RadixDropdownMenu.Trigger', description: 'Trigger button' },
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
          description: 'Trigger content',
        },
        {
          name: 'asChild',
          type: 'boolean',
          moveSpecific: true,
          description: 'Merge props onto child element instead of wrapping',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'DropdownMenu.Trigger',
      description: 'Element that opens the dropdown when clicked',
    },
    {
      name: 'Content',
      slots: [
        {
          name: 'content',
          element: 'RadixDropdownMenu.Content',
          description: 'Menu content panel',
        },
        { name: 'contentInner', element: 'div', description: 'Inner scrollable container' },
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
          description: 'Menu items',
        },
        {
          name: 'container',
          type: 'HTMLElement',
          moveSpecific: false,
          description: 'Custom portal mount target. Defaults to document.body.',
        },
        {
          name: 'sideOffset',
          type: 'number',
          moveSpecific: true,
          description: 'Distance from trigger in px',
        },
        {
          name: 'align',
          type: "'start' | 'center' | 'end'",
          moveSpecific: true,
          description: 'Alignment along the side axis',
        },
        {
          name: 'onPointerDownOutside',
          type: '(e: Event) => void',
          moveSpecific: true,
          description: 'Called when pointer down outside content',
        },
        {
          name: 'onEscapeKeyDown',
          type: '(e: KeyboardEvent) => void',
          moveSpecific: true,
          description: 'Called when escape key pressed',
        },
        {
          name: 'onInteractOutside',
          type: '(e: Event) => void',
          moveSpecific: true,
          description: 'Called on any outside interaction',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'DropdownMenu.Content',
      description:
        'Positioned popup with animated height reveal, staggered item entrance, and scrollable inner container',
    },
    {
      name: 'Arrow',
      slots: [{ name: 'arrow', element: 'RadixDropdownMenu.Arrow', description: 'Arrow SVG' }],
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
      radixPrimitive: 'DropdownMenu.Arrow',
      description: 'Arrow element pointing from dropdown content toward trigger',
    },
    {
      name: 'Item',
      slots: [{ name: 'item', element: 'RadixDropdownMenu.Item', description: 'Menu item' }],
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
          description: 'Item content',
        },
        {
          name: 'disabled',
          type: 'boolean',
          moveSpecific: true,
          description: 'Whether item is disabled',
        },
        {
          name: 'onSelect',
          type: '(e: Event) => void',
          moveSpecific: true,
          description: 'Called when item is selected',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'DropdownMenu.Item',
      description:
        'Clickable menu item with hover spring scale animation and animated close on select',
    },
    {
      name: 'Group',
      slots: [
        { name: 'group', element: 'RadixDropdownMenu.Group', description: 'Group container' },
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
          description: 'Group items',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'DropdownMenu.Group',
      description: 'Structural group container for related items',
    },
    {
      name: 'Label',
      slots: [{ name: 'label', element: 'RadixDropdownMenu.Label', description: 'Group label' }],
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
      radixPrimitive: 'DropdownMenu.Label',
      description: 'Non-interactive label header for a group of items',
    },
    {
      name: 'CheckboxItem',
      slots: [
        {
          name: 'checkboxItem',
          element: 'RadixDropdownMenu.CheckboxItem',
          description: 'Checkbox item container',
        },
        { name: 'checkboxIndicator', element: 'span', description: 'Check mark indicator' },
        { name: 'checkboxLabel', element: 'span', description: 'Checkbox label text' },
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
          description: 'Checkbox label content',
        },
        { name: 'checked', type: 'boolean', moveSpecific: true, description: 'Whether checked' },
        { name: 'disabled', type: 'boolean', moveSpecific: true, description: 'Whether disabled' },
        {
          name: 'onCheckedChange',
          type: '(checked: boolean) => void',
          moveSpecific: true,
          description: 'Called when checked state changes',
        },
        {
          name: 'onSelect',
          type: '(e: Event) => void',
          moveSpecific: true,
          description: 'Called when item is selected',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'DropdownMenu.CheckboxItem',
      description:
        'Toggleable checkbox menu item — a plain checkbox box (empty when unchecked, filled when checked via data-state) with the checkmark rendered only when checked (Radix ItemIndicator). Does not close the menu on select.',
    },
    {
      name: 'RadioGroup',
      slots: [
        {
          name: 'radioGroup',
          element: 'RadixDropdownMenu.RadioGroup',
          description: 'Radio group container',
        },
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
          description: 'Radio items',
        },
        {
          name: 'value',
          type: 'string',
          moveSpecific: true,
          description: 'Current selected value',
        },
        {
          name: 'onValueChange',
          type: '(value: string) => void',
          moveSpecific: true,
          description: 'Called when selection changes',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'DropdownMenu.RadioGroup',
      description: 'Container for radio menu items with controlled value',
    },
    {
      name: 'RadioItem',
      slots: [
        { name: 'radioItem', element: 'RadixDropdownMenu.RadioItem', description: 'Radio item' },
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
          description: 'Radio item content',
        },
        { name: 'value', type: 'string', moveSpecific: true, description: 'Radio item value' },
        { name: 'disabled', type: 'boolean', moveSpecific: true, description: 'Whether disabled' },
        {
          name: 'onSelect',
          type: '(e: Event) => void',
          moveSpecific: true,
          description: 'Called when item is selected',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'DropdownMenu.RadioItem',
      description: 'Radio option menu item with hover scale animation and animated close on select',
    },
    {
      name: 'ItemIndicator',
      slots: [
        {
          name: 'itemIndicator',
          element: 'RadixDropdownMenu.ItemIndicator',
          description: 'Item indicator',
        },
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
          description: 'Indicator content (icon)',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'DropdownMenu.ItemIndicator',
      description: 'Visual indicator shown when a checkbox or radio item is selected',
    },
    {
      name: 'Separator',
      slots: [
        { name: 'separator', element: 'RadixDropdownMenu.Separator', description: 'Divider line' },
      ],
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
      radixPrimitive: 'DropdownMenu.Separator',
      description: 'Visual horizontal divider between menu sections',
    },
    {
      name: 'Sub',
      slots: [],
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Sub-menu trigger and content',
        },
        {
          name: 'open',
          type: 'boolean',
          moveSpecific: false,
          description: 'Controlled sub-menu open state',
        },
        {
          name: 'defaultOpen',
          type: 'boolean',
          moveSpecific: false,
          description: 'Initial sub-menu open state',
        },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          moveSpecific: false,
          description: 'Called when sub-menu open state changes',
        },
      ],
      usesFactory: false,
      description: 'Wrapper for nested sub-menu (SubTrigger + SubContent)',
    },
    {
      name: 'SubTrigger',
      slots: [
        {
          name: 'subTrigger',
          element: 'RadixDropdownMenu.SubTrigger',
          description: 'Sub-menu trigger item',
        },
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
          description: 'Sub-trigger content',
        },
        { name: 'disabled', type: 'boolean', moveSpecific: true, description: 'Whether disabled' },
      ],
      usesFactory: true,
      radixPrimitive: 'DropdownMenu.SubTrigger',
      description: 'Item that opens a nested sub-menu on hover/keyboard',
    },
    {
      name: 'SubContent',
      slots: [
        {
          name: 'subContent',
          element: 'RadixDropdownMenu.SubContent',
          description: 'Sub-menu content panel',
        },
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
          description: 'Sub-menu items',
        },
        {
          name: 'sideOffset',
          type: 'number',
          moveSpecific: true,
          description: 'Distance from sub-trigger in px',
        },
      ],
      usesFactory: true,
      radixPrimitive: 'DropdownMenu.SubContent',
      description: 'Popup content for a nested sub-menu',
    },
  ],

  props: [],

  anatomy: {
    slot: 'content',
    dataAttributes: ['data-side'],
    children: [
      {
        slot: 'contentInner',
        children: [
          { slot: 'label' },
          {
            slot: 'group',
            children: [{ slot: 'item', dataAttributes: ['data-highlighted', 'data-disabled'] }],
          },
          { slot: 'separator' },
          {
            slot: 'checkboxItem',
            dataAttributes: ['data-state', 'data-highlighted', 'data-disabled'],
            children: [{ slot: 'checkboxIndicator' }, { slot: 'checkboxLabel' }],
          },
          {
            slot: 'radioGroup',
            children: [
              {
                slot: 'radioItem',
                dataAttributes: ['data-state', 'data-highlighted', 'data-disabled'],
              },
            ],
          },
          {
            slot: 'subTrigger',
            dataAttributes: ['data-state', 'data-highlighted'],
          },
        ],
      },
      { slot: 'arrow' },
    ],
  },

  controlled: 'open' as const,
  controlledProps: {
    valueProp: 'open',
    defaultValueProp: 'defaultOpen',
    onChangeProp: 'onOpenChange',
  },
  keyboard: 'roving' as const,
  focus: 'roving' as const,
  formType: null,
  asChild: true,

  dismissBehavior: 'unmountAfterExit' as const,

  surface: {
    slot: 'content',
    level: 'subtle' as const,
  },

  animations: [
    {
      trigger: 'Content.enter',
      sequence: [
        [
          { fn: 'animateDimension', animation: { height: { ease: 'poppy' } } },
          {
            children: '[role="menuitem"]',
            animation: { scale: { from: 0.8, to: 1, ease: 'poppy' }, opacity: { from: 0, to: 1 } },
            stagger: { delay: 30 },
          },
        ],
      ],
    },
    {
      trigger: 'Content.exit',
      sequence: [
        [
          { fn: 'animateDimension', animation: { height: { ease: 'snappy' } } },
          {
            children: '[role="menuitem"]',
            animation: { scale: { to: 0.8, ease: 'snappy' }, opacity: { to: 0 } },
            stagger: { delay: 20, from: 'last' },
          },
        ],
      ],
    },
  ],

  renderContracts: [
    {
      id: 'animation-context',
      description:
        'Root provides DropdownContext with isClosing, close(), onCloseComplete, and animation config to all sub-components',
    },
    {
      id: 'close-after-exit',
      description:
        'Item select and close events trigger isClosing state; Content exit animation calls onCloseComplete which unmounts',
    },
    {
      id: 'radix-open-override',
      description:
        'Root keeps Radix open during exit animation (open={open || isClosing}) and ignores Radix close requests',
    },
    {
      id: 'content-portaled-font',
      description:
        'Content is rendered in a portal and declares font-family: var(--move-font-body) for portal font isolation',
    },
    {
      id: 'animated-height-reveal',
      description: 'Content uses animateDimension for height reveal from 0 on open',
    },
    {
      id: 'staggered-items',
      description:
        'Menu items (menuitem, menuitemcheckbox, menuitemradio roles) enter with staggered delay of 30ms',
    },
    {
      id: 'item-hover-scale',
      description:
        'Items animate scale to 1.02 on mouse enter and back to 1 on mouse leave using spring config',
    },
    {
      id: 'checkbox-indicator-state',
      description:
        'CheckboxItem shows a checkbox box at all times — empty (muted bg + border) when unchecked, filled (primary bg) when checked via data-state, with a CSS transition. The checkmark renders only when checked (Radix ItemIndicator). No opacity animation hides the box.',
    },
    {
      id: 'position-aware-transform-origin',
      description:
        'Content transform-origin changes based on data-side attribute (top=bottom, left=right, right=left)',
    },
    {
      id: 'auto-focus-first-item',
      description:
        'Content dispatches ArrowDown keydown after open animation completes to focus first item',
    },
    {
      id: 'escape-triggers-animated-close',
      description: 'Escape key and pointer-down-outside trigger animated close via context close()',
    },
    {
      id: 'checkbox-does-not-close',
      description: 'CheckboxItem does not close the menu on select (allows multiple toggles)',
    },
  ],

  tokens: [
    {
      name: '--move-dropdown-content-bg',
      value: 'var(--move-bg-subtle)',
      description: 'Content panel background',
    },
    {
      name: '--move-dropdown-content-border',
      value: 'var(--move-border-base)',
      description: 'Content panel border color',
    },
    {
      name: '--move-dropdown-content-radius',
      value: 'var(--move-rounded-lg)',
      description: 'Content panel border radius',
    },
    {
      name: '--move-dropdown-content-shadow',
      value: 'var(--move-shadow-overlay)',
      description: 'Content panel box shadow',
    },
    {
      name: '--move-dropdown-content-padding',
      value: 'var(--move-spacing-xs)',
      description: 'Content panel padding',
    },
    {
      name: '--move-dropdown-content-min-width',
      value: '12rem',
      description: 'Content minimum width',
    },
    {
      name: '--move-dropdown-content-max-height',
      value: 'min(var(--radix-dropdown-menu-content-available-height, 50vh), 50vh)',
      description: 'Content maximum height',
    },
    {
      name: '--move-dropdown-item-radius',
      value: 'var(--move-rounded-md)',
      description: 'Item border radius',
    },
    {
      name: '--move-dropdown-item-padding-x',
      value: 'var(--move-spacing-sm)',
      description: 'Item horizontal padding',
    },
    {
      name: '--move-dropdown-item-padding-y',
      value: 'var(--move-spacing-xs)',
      description: 'Item vertical padding',
    },
    {
      name: '--move-dropdown-item-fg',
      value: 'var(--move-fg-base)',
      description: 'Item text color',
    },
    {
      name: '--move-dropdown-item-fg-disabled',
      value: 'var(--move-fg-subtle)',
      description: 'Item text color when disabled',
    },
    {
      name: '--move-dropdown-item-bg-highlight',
      value: 'var(--move-bg-muted)',
      description: 'Item background when highlighted',
    },
    {
      name: '--move-dropdown-item-font-size',
      value: 'var(--move-size-sm)',
      description: 'Item font size',
    },
    {
      name: '--move-dropdown-label-padding-x',
      value: 'var(--move-spacing-sm)',
      description: 'Label horizontal padding',
    },
    {
      name: '--move-dropdown-label-padding-y',
      value: 'var(--move-spacing-xs)',
      description: 'Label vertical padding',
    },
    {
      name: '--move-dropdown-label-font-size',
      value: 'var(--move-size-sm)',
      description: 'Label font size',
    },
    {
      name: '--move-dropdown-label-fg',
      value: 'var(--move-fg-muted)',
      description: 'Label text color',
    },
    {
      name: '--move-dropdown-label-font-weight',
      value: 'var(--move-weight-semibold)',
      description: 'Label font weight',
    },
    {
      name: '--move-dropdown-separator-color',
      value: 'var(--move-border-base)',
      description: 'Separator line color',
    },
    {
      name: '--move-dropdown-separator-margin',
      value: 'var(--move-spacing-xs)',
      description: 'Separator vertical margin',
    },
  ],

  variants: {},
  sizes: [] as string[],

  labels: [],

  radixPrimitive: 'DropdownMenu',
  hasHook: false,
  engineImports: ['withMoveComponent', 'useMergedRef'] as string[],
  componentDeps: ['Checkbox'] as string[],

  testing: {
    behaviors: [
      'Root manages open/close state with controlled and uncontrolled patterns',
      'Root keeps dropdown mounted during exit animation (open || isClosing)',
      'Root ignores Radix onOpenChange(false) — closing is driven by close()',
      'Trigger opens the dropdown on click',
      'Content renders in a portal',
      'Content has position-aware transform-origin based on data-side',
      'Content uses animated height reveal from 0',
      'Content inner container is scrollable with max-height',
      'Content focuses first item after open animation via ArrowDown dispatch',
      'Item triggers animated close on select',
      'Item has spring hover scale animation (scale 1.02)',
      'CheckboxItem toggles checked state without closing menu',
      'CheckboxItem shows an empty box when unchecked and a filled box + checkmark when checked',
      'RadioGroup manages value state',
      'RadioItem triggers animated close on select',
      'Separator renders as 1px divider',
      'SubTrigger opens sub-menu on hover/focus',
      'SubContent renders with same token values as main content',
      'Disabled items have pointer-events: none and muted color',
      'Forwards className and style on all factory sub-components',
    ],
    keyboard: [
      'Escape key triggers animated close',
      'Arrow keys navigate between items (roving focus)',
      'Enter/Space selects highlighted item',
      'ArrowRight opens sub-menu from SubTrigger',
      'ArrowLeft closes sub-menu',
    ],
    aria: [
      'Content has role=menu from Radix',
      'Item has role=menuitem from Radix',
      'CheckboxItem has role=menuitemcheckbox with aria-checked from Radix',
      'RadioItem has role=menuitemradio from Radix',
      'Trigger has aria-expanded and aria-haspopup from Radix',
      'Disabled items have data-disabled attribute',
    ],
    animation: [
      'Content entrance uses scale 0.5->1 + opacity 0->1 with outQuart',
      'Content exit uses scale 1->0.95 + opacity 1->0 in 200ms',
      'Content items stagger with 30ms delay',
      'Item hover animates scale to 1.02 with spring',
      'animations={false} disables all animations',
      'Reduced motion preference disables animations',
    ],
  },

  iconsUsed: ['check'],
} satisfies ComponentSpec;
