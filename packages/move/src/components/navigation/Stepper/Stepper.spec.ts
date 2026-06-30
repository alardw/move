// Stepper.spec.ts — Component specification
// specHash: PLACEHOLDER

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'Stepper',
  componentClass: 'display' as const,
  category: 'navigation',
  description: 'Multi-step progress indicator with numbered/icon indicators, horizontal/vertical orientation, clickable steps, and status-driven styling',

  synonyms: ['wizard', 'steps', 'progress steps', 'step indicator'],
  families: {
    behavior:  ["navigation"],
    state:     ["controlled-index"],
    a11y:      ["none"],
  },

  compound: true,
  rootElement: 'div',
  slots: [
    { name: 'root', element: 'div', description: 'Root container with role="list", flex layout based on orientation' },
    { name: 'step', element: 'div', description: 'Individual step container with status-driven styling and optional click handler' },
    { name: 'indicator', element: 'div', description: 'Circular step number/icon indicator with status-driven colors' },
    { name: 'title', element: 'div', description: 'Step title text' },
    { name: 'description', element: 'div', description: 'Step description text below title' },
    { name: 'separator', element: 'div', description: 'Connector line between steps with completion state' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [{ name: 'root', element: 'div', description: 'Root container' }],
      props: [
        { name: 'active', type: 'number', default: '0', moveSpecific: true, description: 'Index of the currently active step (0-based)' },
        { name: 'onStepClick', type: '(index: number) => void', moveSpecific: true, description: 'Callback when a step is clicked; enables clickable steps' },
        { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", moveSpecific: true, description: 'Layout orientation' },
        { name: 'size', typeRef: 'Size', default: "'md'", moveSpecific: true, description: 'Size affecting indicator, typography, and separator dimensions' },
        { name: 'color', typeRef: 'Color', moveSpecific: true, description: 'Indicator/active-state color from the named Open Color palette.' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Stepper.Step children' },
      ],
      usesFactory: true,
      description: 'Root container that provides stepper context and injects step index/status via StepItemContext into Step children',
    },
    {
      name: 'Step',
      slots: [{ name: 'step', element: 'div', description: 'Step container' }],
      props: [
        { name: 'status', type: "'wait' | 'active' | 'complete' | 'error'", moveSpecific: true, description: 'Override auto-derived status for this step' },
        { name: 'loading', type: 'boolean', moveSpecific: true, description: 'Show loading state on this step' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Indicator, Title, Description, or other content' },
      ],
      usesFactory: true,
      description: 'Individual step container; derives status from active index unless explicitly overridden. Renders separators automatically.',
    },
    {
      name: 'Indicator',
      slots: [{ name: 'indicator', element: 'div', description: 'Circular indicator' }],
      props: [
        { name: 'icon', type: 'React.ReactNode', moveSpecific: true, description: 'Custom icon for the indicator' },
        { name: 'completedIcon', type: 'React.ReactNode', moveSpecific: true, description: 'Custom icon for completed state (defaults to check icon)' },
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Custom indicator content (overrides number/icon)' },
      ],
      usesFactory: true,
      description: 'Circular indicator showing step number, custom icon, or completed check icon based on status',
    },
    {
      name: 'Title',
      slots: [{ name: 'title', element: 'div', description: 'Title text' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Title text content' },
      ],
      usesFactory: true,
      description: 'Step title label with status-driven color',
    },
    {
      name: 'Description',
      slots: [{ name: 'description', element: 'div', description: 'Description text' }],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Description text content' },
      ],
      usesFactory: true,
      description: 'Step description text below the title',
    },
    {
      name: 'Separator',
      slots: [{ name: 'separator', element: 'div', description: 'Connector line' }],
      props: [],
      usesFactory: true,
      description: 'Public separator component for manual placement; reads completion state from StepItemContext',
    },
    {
      name: 'Completed',
      slots: [],
      props: [
        { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Content to show when all steps are completed' },
      ],
      usesFactory: false,
      description: 'Convenience wrapper for completion content (renders children as-is)',
    },
  ],

  props: [
    { name: 'active', type: 'number', default: '0', moveSpecific: true, description: 'Index of the active step (0-based)' },
    { name: 'onStepClick', type: '(index: number) => void', moveSpecific: true, description: 'Callback when a step is clicked' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", moveSpecific: true, description: 'Layout orientation' },
    { name: 'size', typeRef: 'Size', default: "'md'", moveSpecific: true, description: 'Stepper size' },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Stepper.Step children' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-orientation', 'data-size'],
    ariaAttributes: ['role'],
    children: [
      {
        slot: 'step',
        dataAttributes: ['data-status', 'data-clickable'],
        ariaAttributes: ['role'],
        children: [
          { slot: 'separator', dataAttributes: ['data-side', 'data-complete'] },
          { slot: 'indicator' },
          { slot: 'separator', dataAttributes: ['data-side', 'data-complete'] },
          { slot: 'title' },
          { slot: 'description' },
        ],
      },
    ],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animations: [],

  tokens: [
    { name: '--move-stepper-indicator-size', value: 'var(--move-space-8)', description: 'Indicator circle diameter' },
    { name: '--move-stepper-indicator-bg', value: 'var(--move-bg-muted)', description: 'Indicator background (wait state)' },
    { name: '--move-stepper-indicator-bg-active', value: 'var(--move-bg-base)', description: 'Indicator background (active state)' },
    { name: '--move-stepper-indicator-bg-complete', value: 'var(--move-primary)', description: 'Indicator background (complete state)' },
    { name: '--move-stepper-indicator-bg-error', value: 'var(--move-error)', description: 'Indicator background (error state)' },
    { name: '--move-stepper-indicator-fg', value: 'var(--move-fg-muted)', description: 'Indicator text color (wait state)' },
    { name: '--move-stepper-indicator-fg-active', value: 'var(--move-primary)', description: 'Indicator text color (active state)' },
    { name: '--move-stepper-indicator-fg-complete', value: 'var(--move-primary-fg)', description: 'Indicator text color (complete state)' },
    { name: '--move-stepper-indicator-fg-error', value: 'var(--move-error-fg, var(--move-primary-fg))', description: 'Indicator text color (error state)' },
    { name: '--move-stepper-indicator-border', value: 'var(--move-border-base)', description: 'Indicator border color (wait state)' },
    { name: '--move-stepper-indicator-radius', value: 'var(--move-rounded-full)', description: 'Indicator border radius (circular)' },
    { name: '--move-stepper-indicator-font-size', value: 'var(--move-size-sm)', description: 'Indicator number/icon font size' },
    { name: '--move-stepper-indicator-font-weight', value: 'var(--move-weight-semibold)', description: 'Indicator font weight' },
    { name: '--move-stepper-separator-color', value: 'var(--move-border-base)', description: 'Separator line color (incomplete)' },
    { name: '--move-stepper-separator-color-complete', value: 'var(--move-primary)', description: 'Separator line color (completed)' },
    { name: '--move-stepper-separator-thickness', value: '2px', description: 'Separator line thickness' },
    { name: '--move-stepper-title-font-size', value: 'var(--move-size-sm)', description: 'Step title font size' },
    { name: '--move-stepper-title-font-weight', value: 'var(--move-weight-medium)', description: 'Step title font weight' },
    { name: '--move-stepper-title-fg', value: 'var(--move-fg-base)', description: 'Step title text color' },
    { name: '--move-stepper-title-fg-muted', value: 'var(--move-fg-muted)', description: 'Step title text color (wait state)' },
    { name: '--move-stepper-description-font-size', value: 'var(--move-size-xs)', description: 'Step description font size' },
    { name: '--move-stepper-description-fg', value: 'var(--move-fg-muted)', description: 'Step description text color' },
    { name: '--move-stepper-gap', value: 'var(--move-spacing-xs)', description: 'Gap between indicator and labels in horizontal mode' },
  ],

  variants: {},
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [],
  childrenKind: 'composition' as const,

  renderContracts: [
    { id: 'step-status-derivation', description: 'Step status is auto-derived from active index: complete (index < active), active (index === active), wait (index > active); can be overridden via status prop' },
    { id: 'step-item-context', description: 'Root injects StepItemContext (index, status, isLast) into each Step child by detecting _moveComponentName' },
    { id: 'auto-separator-horizontal', description: 'In horizontal mode, Step auto-renders start and end separators as internal StepperSeparatorInternal components' },
    { id: 'auto-separator-vertical', description: 'In vertical mode, Step renders indicator + end separator in a rail div wrapper, with content beside it' },
    { id: 'separator-completion-state', description: 'Internal separators receive data-complete="true" when the preceding step is complete' },
    { id: 'separator-side-attribute', description: 'Internal separators render data-side="start" or "end" for CSS positioning' },
    { id: 'first-step-no-start-separator', description: 'First step in horizontal mode hides its start separator via CSS :first-child' },
    { id: 'last-step-no-end-separator', description: 'Last step hides its end separator via CSS :last-child' },
    { id: 'indicator-default-number', description: 'Indicator shows step number (1-based) by default when no icon, completedIcon, or children are provided' },
    { id: 'indicator-check-on-complete', description: 'Indicator shows check icon via useResolvedIcon when status is complete and no custom completedIcon is set' },
    { id: 'indicator-custom-icon', description: 'Indicator shows custom icon prop when status is not complete' },
    { id: 'indicator-aria-hidden', description: 'Indicator has aria-hidden="true" since step content provides accessible label' },
    { id: 'clickable-steps', description: 'When onStepClick is provided, steps become clickable with cursor:pointer, tabIndex=0, and keyboard support' },
    { id: 'vertical-rail-layout', description: 'In vertical mode, indicator and separator are wrapped in a rail div for column alignment' },
    { id: 'horizontal-grid-layout', description: 'In horizontal mode, each step uses CSS grid with 3 columns (start-sep, indicator, end-sep) and rows for title/description' },
  ],

  hasHook: true,
  engineImports: ['withMoveComponent'] as string[],

  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Root renders as div with role="list"',
      'Root defaults to active=0, orientation=horizontal, size=md',
      'Root applies data-orientation and data-size attributes',
      'Step renders as div with role="listitem"',
      'Step derives status=complete when index < active',
      'Step derives status=active when index === active',
      'Step derives status=wait when index > active',
      'Step renders data-status attribute with derived or overridden status',
      'Step accepts explicit status prop that overrides auto-derivation',
      'Step renders data-clickable="true" when onStepClick is provided',
      'Step becomes focusable (tabIndex=0) when clickable',
      'Clicking a clickable step calls onStepClick with the step index',
      'Indicator renders step number (1-based) by default',
      'Indicator renders check icon when status is complete',
      'Indicator renders custom icon prop when provided',
      'Indicator renders custom completedIcon when status is complete and prop is set',
      'Indicator renders children when provided (overrides icon/number)',
      'Indicator has aria-hidden="true"',
      'Title renders step title text',
      'Title text is muted color when status is wait',
      'Description renders step description text',
      'Separator renders with data-complete when step is complete',
      'Horizontal mode renders separators with data-side start and end',
      'Vertical mode renders indicator and separator in rail wrapper',
      'First step hides start separator in horizontal mode',
      'Last step hides end separator',
      'Completed component renders children as-is',
      'Forwards className and style on all sub-components',
      'Forwards ref on all sub-components',
    ],
    keyboard: [
      'Clickable step triggers onStepClick on Enter key',
      'Clickable step triggers onStepClick on Space key',
      'Focus-visible shows focus ring on clickable steps',
    ],
    aria: [
      'Root has role="list"',
      'Step has role="listitem"',
      'Indicator has aria-hidden="true"',
      'Separator has aria-hidden="true"',
    ],
  },

  iconsUsed: ['check'],
  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'user-confirmed' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
