// PasswordStrength.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'PasswordStrength',
  componentClass: 'display' as const,
  category: 'forms',
  description:
    'Password-strength indicator: a segmented meter + label, with an optional requirements checklist. Scoring-agnostic — controlled score, a custom estimate function, or a built-in length/character-class heuristic.',
  choreographies: [],
  families: {
    behavior: ['display'],
    state: ['stateless'],
    a11y: ['progressbar'],
  },

  compound: true,
  rootElement: 'div',
  slots: [
    {
      name: 'root',
      element: 'div',
      description: 'Wrapper containing the segmented track and label',
    },
    { name: 'track', element: 'div', description: 'Segmented bar container' },
    { name: 'segment', element: 'div', description: 'A single strength segment (one per level)' },
    { name: 'label', element: 'span', description: 'Strength text label (aria-live region)' },
  ],

  subComponents: [
    {
      name: 'Requirements',
      slots: [
        { name: 'requirements', element: 'ul', description: 'Requirements checklist container' },
        { name: 'requirement', element: 'li', description: 'A single requirement row' },
        {
          name: 'requirementIcon',
          element: 'span',
          description: 'check / x icon for the requirement state',
        },
        { name: 'requirementLabel', element: 'span', description: 'Requirement label text' },
      ],
      props: [
        {
          name: 'requirements',
          type: '{ label: string; met: boolean }[]',
          moveSpecific: true,
          description:
            'Rules to display; the consumer computes `met` (keeps the component scoring-agnostic)',
        },
        {
          name: 'labels',
          type: 'Partial<PasswordStrengthLabels>',
          moveSpecific: true,
          description: 'Accessible labels for the met / not-met states (met, unmet)',
        },
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
        'Checklist of password requirements with a check/x per rule. The consumer computes each rule’s `met`.',
    },
  ],

  props: [
    {
      name: 'value',
      type: 'string',
      moveSpecific: true,
      description:
        'Password to score via the built-in heuristic or `estimate`. Ignored when `score` is set.',
    },
    {
      name: 'score',
      type: 'number',
      moveSpecific: true,
      description:
        'Controlled strength level index (0..levels-1; -1 = empty/too-short). Takes precedence over value/estimate.',
    },
    {
      name: 'estimate',
      type: '(value: string) => number',
      moveSpecific: true,
      description:
        'Custom scorer over `value` returning a level index (e.g. wrap zxcvbn). Falls back to the built-in heuristic.',
    },
    {
      name: 'levels',
      type: 'number',
      default: '4',
      moveSpecific: true,
      description:
        'Number of strength levels/segments. Match your estimator (e.g. 5 for zxcvbn 0–4); labels.levels length should match.',
    },
    {
      name: 'size',
      typeRef: 'Size',
      default: "'md'",
      moveSpecific: true,
      description: 'Meter size',
    },
    {
      name: 'showLabel',
      type: 'boolean',
      default: 'true',
      moveSpecific: true,
      description: 'Show the strength text label beneath the meter',
    },
    {
      name: 'labels',
      type: 'Partial<PasswordStrengthLabels>',
      moveSpecific: true,
      description: 'Level names, empty-state text, and the aria-live announcement prefix',
    },
    {
      name: 'id',
      type: 'string',
      moveSpecific: false,
      description: 'Element id (lets a password field point aria-describedby at the meter)',
    },
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
      description: 'Optional PasswordStrength.Requirements rendered beneath the meter',
    },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-level', 'data-levels', 'data-size', 'data-empty'],
    children: [
      { slot: 'track', children: [{ slot: 'segment' }] },
      { slot: 'label', ariaAttributes: ['aria-live'] },
    ],
  },

  controlled: null,
  keyboard: null,
  focus: 'none' as const,
  formType: null,
  asChild: false,

  animations: [],

  renderContracts: [
    {
      id: 'score-precedence',
      description:
        'Strength resolves in order: controlled `score` → `estimate(value)` → built-in length/character-class heuristic.',
    },
    {
      id: 'levels-drives-segments',
      description:
        '`levels` sets the number of segments AND the expected length of labels.levels; the component must not assume 4.',
    },
    {
      id: 'empty-state',
      description:
        'When the resolved level is -1 (empty / shorter than the heuristic minimum) no segment is filled and labels.empty is shown.',
    },
    {
      id: 'color-scale',
      description:
        'Filled segments use the docs status scale across the range: low → --move-error, mid → --move-warning, high → --move-success; empty segments use --move-password-strength-empty.',
    },
    {
      id: 'aria-live-announce',
      description:
        'The label is an aria-live="polite" region announcing "{labels.meter}: {level name}" as the score changes.',
    },
    {
      id: 'describedby-target',
      description:
        'The component accepts `id` so a password field can reference it via aria-describedby.',
    },
    {
      id: 'exports-heuristic',
      description:
        'The built-in scorer is exported as `estimatePasswordStrength(value, levels)` so consumers can reuse or compose it.',
    },
    {
      id: 'requirements-met-owned',
      description:
        'PasswordStrength.Requirements renders the rows as given; the consumer owns each `met` value (no internal validation).',
    },
  ],

  tokens: [
    {
      name: '--move-password-strength-weak',
      value: 'var(--move-error)',
      description: 'Fill color at the low end of the scale',
    },
    {
      name: '--move-password-strength-medium',
      value: 'var(--move-warning)',
      description: 'Fill color at the middle of the scale',
    },
    {
      name: '--move-password-strength-strong',
      value: 'var(--move-success)',
      description: 'Fill color at the high end of the scale',
    },
    {
      name: '--move-password-strength-empty',
      value: 'var(--move-bg-emphasis)',
      description: 'Unfilled segment color',
    },
    {
      name: '--move-password-strength-gap',
      value: 'var(--move-spacing-xs)',
      description: 'Gap between segments',
    },
    {
      name: '--move-password-strength-radius',
      value: 'var(--move-rounded-sm)',
      description: 'Segment corner radius',
    },
    {
      name: '--move-password-strength-height',
      value: 'var(--move-space-1)',
      description: 'Segment height (overridden per size)',
    },
    {
      name: '--move-password-strength-label-color',
      value: 'var(--move-fg-muted)',
      description: 'Strength label text color',
    },
    {
      name: '--move-password-strength-label-size',
      value: 'var(--move-text-sm)',
      description: 'Strength label font size',
    },
    {
      name: '--move-password-strength-met',
      value: 'var(--move-success)',
      description: 'Requirements: met (check) color',
    },
    {
      name: '--move-password-strength-unmet',
      value: 'var(--move-fg-muted)',
      description: 'Requirements: not-met (x) color',
    },
  ],

  variants: {},
  sizes: ['sm', 'md', 'lg'] as string[],

  labels: [
    {
      key: 'levels',
      default: 'Weak, Fair, Good, Strong',
      description:
        'Level names, one per level (indexed by score). Provide an array matching the `levels` prop.',
    },
    {
      key: 'empty',
      default: 'Too short',
      description: 'Label shown when the resolved level is -1 (empty / too short).',
    },
    {
      key: 'meter',
      default: 'Password strength',
      description: 'aria-live announcement prefix, e.g. "Password strength: Strong".',
    },
    {
      key: 'met',
      default: 'Requirement met',
      description: 'Requirements: accessible label for a satisfied rule (check).',
    },
    {
      key: 'unmet',
      default: 'Requirement not met',
      description: 'Requirements: accessible label for an unsatisfied rule (x).',
    },
  ],

  childrenKind: 'composition' as const,
  propRoles: {
    value: 'data',
    score: 'data',
    children: 'composition',
  },

  hasHook: false,
  engineImports: ['withMoveComponent'] as string[],
  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Renders a track with `levels` segments (default 4)',
      'Fills segments up to the resolved level',
      'score prop takes precedence over value/estimate',
      'estimate(value) is used when score is absent',
      'falls back to the built-in heuristic when neither score nor estimate is given',
      'levels prop changes the number of segments',
      'empty/too-short (level -1) fills no segments and shows labels.empty',
      'low level uses the weak (error) color, high level uses the strong (success) color',
      'showLabel=false hides the text label',
      'applies data-level, data-levels, data-size, data-empty',
      'Defaults size=md, levels=4, showLabel=true',
      'exports estimatePasswordStrength helper',
      'Requirements renders one row per requirement with check/x by `met`',
      'Forwards className and style on root',
    ],
    keyboard: [] as string[],
    aria: [
      'Label is an aria-live="polite" region',
      'Announces "{labels.meter}: {level name}" on change',
      'Segments are decorative (aria-hidden); strength is conveyed by the live label',
      'Component id can be targeted by a field aria-describedby',
      'Requirements rows convey met/unmet via labels.met / labels.unmet (not color alone)',
    ] as string[],
    form: [] as string[],
  },

  iconsUsed: ['check', 'x'],
} satisfies ComponentSpec;
