// RichTextEditor.spec.ts — Component specification
// specHash: PLACEHOLDER

export const spec = {
  schemaVersion: 6 as const,
  name: 'RichTextEditor',
  componentClass: 'interactive' as const,
  category: 'form',
  description: 'Editor-agnostic rich text editor chrome with toolbar, control groups, formatting controls, and content area wrapping any editor engine (TipTap, Lexical, Plate, etc.)',

  compound: true,
  rootElement: 'div',
  slots: [
    { name: 'root', element: 'div', description: 'Wrapper providing variant/size context and visual chrome (border, background, radius)' },
    { name: 'toolbar', element: 'div', description: 'Toolbar container with role=toolbar, wrapping control groups and separators' },
    { name: 'controlGroup', element: 'div', description: 'Inline group of related controls with role=group' },
    { name: 'control', element: 'button', description: 'Individual formatting toggle button with active state' },
    { name: 'separator', element: 'div', description: 'Vertical separator between control groups with role=separator' },
    { name: 'content', element: 'div', description: 'Content area hosting the editor engine, wrapped in Prose for typography' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'div', description: 'Root wrapper' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Toolbar and Content sub-components' },
        { name: 'variant', type: "'outline' | 'subtle'", default: "'outline'", moveSpecific: true, description: 'Visual variant — outline has border, subtle is borderless' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", moveSpecific: true, description: 'Component size affecting control size, toolbar padding, and content padding' },
      ],
      usesFactory: false,
      description: 'Context provider and visual wrapper; plain FC that provides variant/size via RichTextEditorContext',
    },
    {
      name: 'Toolbar',
      slots: [{ name: 'toolbar', element: 'div', description: 'Toolbar container' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'ControlGroup, Control, and Separator sub-components' },
        { name: 'sticky', type: 'boolean', moveSpecific: true, description: 'Make toolbar sticky at the top of the scroll container' },
        { name: 'stickyOffset', type: 'number', moveSpecific: true, description: 'Top offset for sticky positioning (px)' },
        { name: 'toolbarLabel', type: 'string', default: "'Text formatting'", moveSpecific: true, description: 'Toolbar aria-label for accessibility' },
      ],
      usesFactory: true,
      description: 'Toolbar container with role=toolbar, optional sticky positioning, and flexbox wrapping',
    },
    {
      name: 'ControlGroup',
      slots: [{ name: 'controlGroup', element: 'div', description: 'Control group container' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Control sub-components' },
      ],
      usesFactory: true,
      description: 'Inline flex group of related controls with role=group',
    },
    {
      name: 'Control',
      slots: [{ name: 'control', element: 'button', description: 'Toggle button' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Control icon or label' },
        { name: 'active', type: 'boolean', moveSpecific: true, description: 'Controlled active/pressed state' },
        { name: 'defaultActive', type: 'boolean', default: 'false', moveSpecific: true, description: 'Default active state (uncontrolled)' },
        { name: 'onActiveChange', type: '(active: boolean) => void', moveSpecific: true, description: 'Called when active state toggles' },
        { name: 'disabled', type: 'boolean', moveSpecific: false, description: 'Disabled state' },
      ],
      usesFactory: true,
      description: 'Individual formatting toggle button with controlled/uncontrolled active state via useControlledState',
    },
    {
      name: 'Separator',
      slots: [{ name: 'separator', element: 'div', description: 'Vertical divider' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
      ],
      usesFactory: true,
      description: 'Vertical separator bar between control groups with role=separator and aria-orientation=vertical',
    },
    {
      name: 'Content',
      slots: [{ name: 'content', element: 'div', description: 'Editor content area' }],
      props: [
        { name: 'className', type: 'string', moveSpecific: false, description: 'CSS class name' },
        { name: 'style', type: 'React.CSSProperties', moveSpecific: false, description: 'Inline styles' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Editor engine component (TipTap, Lexical, Plate, etc.)' },
        { name: 'minHeight', type: "React.CSSProperties['minHeight']", moveSpecific: true, description: 'Minimum height for the content area' },
        { name: 'onFocus', type: 'React.FocusEventHandler<HTMLDivElement>', moveSpecific: false, description: 'Focus event handler' },
        { name: 'onBlur', type: 'React.FocusEventHandler<HTMLDivElement>', moveSpecific: false, description: 'Blur event handler' },
      ],
      usesFactory: true,
      description: 'Content area wrapping children in Prose for rich text typography; strips focus outlines from contenteditable elements',
    },
  ],

  props: [
    { name: 'variant', type: "'outline' | 'subtle'", default: "'outline'", moveSpecific: true, description: 'Visual variant' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", moveSpecific: true, description: 'Component size' },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Toolbar and Content sub-components' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-variant', 'data-size'],
    children: [
      {
        slot: 'toolbar',
        dataAttributes: ['data-sticky'],
        ariaAttributes: ['role=toolbar', 'aria-label'],
        children: [
          {
            slot: 'controlGroup',
            ariaAttributes: ['role=group'],
            children: [
              { slot: 'control', dataAttributes: ['data-active'] },
            ],
          },
          {
            slot: 'separator',
            ariaAttributes: ['role=separator', 'aria-orientation=vertical'],
          },
        ],
      },
      { slot: 'content' },
    ],
  },

  controlled: null,
  controlledProps: {
    valueProp: 'active',
    defaultValueProp: 'defaultActive',
    onChangeProp: 'onActiveChange',
  },

  keyboard: 'toggle' as const,
  focus: 'roving' as const,
  formType: null,
  asChild: false,

  animations: [],

  tokens: [
    // Root tokens
    { name: '--move-rte-bg', value: 'var(--move-bg-base)', description: 'Root background color' },
    { name: '--move-rte-border', value: 'var(--move-border-base)', description: 'Root border color (outline variant)' },
    { name: '--move-rte-radius', value: 'var(--move-rounded-lg)', description: 'Root border radius' },
    { name: '--move-rte-font', value: 'var(--move-font-body)', description: 'Root font family' },
    // Toolbar tokens
    { name: '--move-rte-toolbar-bg', value: 'var(--move-bg-subtle)', description: 'Toolbar background color' },
    { name: '--move-rte-toolbar-border', value: 'var(--move-border-base)', description: 'Toolbar bottom border color' },
    { name: '--move-rte-toolbar-padding', value: 'var(--move-spacing-sm)', description: 'Toolbar internal padding' },
    { name: '--move-rte-toolbar-gap', value: 'var(--move-spacing-xs)', description: 'Gap between toolbar items' },
    // Control tokens
    { name: '--move-rte-control-size', value: '28px', description: 'Control button width and height (md)' },
    { name: '--move-rte-control-radius', value: 'var(--move-rounded-sm)', description: 'Control button border radius' },
    { name: '--move-rte-control-fg', value: 'var(--move-fg-muted)', description: 'Control default foreground color' },
    { name: '--move-rte-control-fg-hover', value: 'var(--move-fg-base)', description: 'Control foreground color on hover' },
    { name: '--move-rte-control-bg-hover', value: 'var(--move-bg-muted)', description: 'Control background color on hover' },
    { name: '--move-rte-control-fg-active', value: 'var(--move-primary-fg)', description: 'Control foreground color when active' },
    { name: '--move-rte-control-bg-active', value: 'var(--move-primary)', description: 'Control background color when active' },
    // Content tokens
    { name: '--move-rte-content-padding', value: 'var(--move-spacing-md)', description: 'Content area internal padding' },
    { name: '--move-rte-content-fg', value: 'var(--move-fg-base)', description: 'Content text color' },
    { name: '--move-rte-content-min-height', value: '200px', description: 'Content area minimum height' },
    // Separator tokens
    { name: '--move-rte-separator-color', value: 'var(--move-border-base)', description: 'Separator bar color' },
  ],

  variants: {
    variant: ['outline', 'subtle'] as string[],
  },
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [
    { key: 'toolbar', default: 'Text formatting', description: 'Default aria-label for the toolbar' },
  ],

  renderContracts: [
    { id: 'root-is-plain-fc', description: 'Root is a plain React.FC (not withMoveComponent) that provides RichTextEditorContext with variant and size' },
    { id: 'root-sets-data-attributes', description: 'Root sets data-variant and data-size on the wrapper div for CSS token overrides' },
    { id: 'outline-variant-border', description: 'Outline variant renders 1px solid border; subtle variant renders no border and transparent toolbar background' },
    { id: 'toolbar-role-toolbar', description: 'Toolbar has role=toolbar and aria-label (default "Text formatting", overridable via toolbarLabel prop)' },
    { id: 'toolbar-sticky', description: 'When sticky=true, toolbar gets position:sticky and top:0 (or stickyOffset value)' },
    { id: 'control-group-role-group', description: 'ControlGroup has role=group for ARIA grouping of related controls' },
    { id: 'control-uses-controlled-state', description: 'Control uses useControlledState for active/defaultActive/onActiveChange triad; toggles on click unless disabled' },
    { id: 'control-data-active', description: 'Control sets data-active attribute when active for CSS styling (primary bg/fg)' },
    { id: 'separator-role-separator', description: 'Separator has role=separator and aria-orientation=vertical' },
    { id: 'content-wraps-in-prose', description: 'Content wraps children in Prose component for consistent rich text typography' },
    { id: 'content-strips-outlines', description: 'Content CSS strips focus outlines from [contenteditable], .tiptap, and other editor engine elements' },
    { id: 'content-editor-overrides', description: 'Content CSS provides editor-specific overrides for task lists (TipTap, Lexical) and nested list style cycling' },
    { id: 'size-token-overrides', description: 'Size variants override control-size (sm=24px, lg=36px), toolbar padding, toolbar gap, and content padding via CSS token reassignment' },
    { id: 'editor-agnostic', description: 'Component is editor-agnostic chrome only — does not import or depend on any specific editor engine' },
  ],

  childrenKind: 'composition' as const,
  propRoles: {
    variant: 'data' as const,
    size: 'data' as const,
    children: 'composition' as const,
  },

  hasHook: false,
  engineImports: ['withMoveComponent'] as string[],
  animationImports: [] as string[],
  componentDeps: ['Prose'] as string[],

  testing: {
    behaviors: [
      'Root renders wrapper div with data-variant and data-size attributes',
      'Root defaults variant to outline',
      'Root defaults size to md',
      'Root provides RichTextEditorContext with variant and size',
      'Outline variant renders border on root',
      'Subtle variant renders no border and transparent toolbar background',
      'Toolbar renders with role=toolbar',
      'Toolbar renders with aria-label "Text formatting" by default',
      'Toolbar renders with custom aria-label via toolbarLabel prop',
      'Toolbar becomes sticky when sticky=true',
      'Toolbar respects stickyOffset for top position',
      'Toolbar wraps controls with flex-wrap',
      'ControlGroup renders with role=group',
      'ControlGroup renders children inline with gap',
      'Control renders as button type=button',
      'Control toggles active state on click',
      'Control respects controlled active prop',
      'Control respects defaultActive for uncontrolled mode',
      'Control fires onActiveChange when toggled',
      'Control does not toggle when disabled',
      'Control shows active styling (primary bg/fg) when data-active is set',
      'Control shows disabled styling (reduced opacity, not-allowed cursor) when disabled',
      'Separator renders with role=separator and aria-orientation=vertical',
      'Content wraps children in Prose component',
      'Content applies minHeight prop as inline style',
      'Content strips focus outlines from contenteditable elements',
      'Content handles focus/blur events via onFocus/onBlur props',
      'Size sm: control-size=24px, reduced toolbar padding and content padding',
      'Size lg: control-size=36px, increased toolbar padding and content padding',
      'Forwards className and style on Root',
      'Forwards className and style on Toolbar',
      'Forwards className and style on ControlGroup',
      'Forwards className and style on Control',
      'Forwards className and style on Content',
    ],
    keyboard: [
      'Control responds to click (Space/Enter via native button)',
      'Control focus-visible shows focus ring',
    ],
    aria: [
      'Toolbar has role=toolbar with aria-label',
      'ControlGroup has role=group',
      'Separator has role=separator with aria-orientation=vertical',
      'Control disabled state uses native disabled attribute',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'accept-all' as const,
    overrides: {},
  },
};
