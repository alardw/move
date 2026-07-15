// FormField.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 1 as const,
  name: 'FormField',
  componentClass: 'presentational' as const,
  category: 'forms',
  description:
    'Compound form layout wrapper that arranges label, field input, and description/error in a responsive grid',
  families: {
    behavior: ['form-input'],
    state: ['stateless'],
    a11y: ['none'],
  },

  compound: true,
  rootElement: 'div',
  slots: [
    {
      name: 'root',
      element: 'div',
      description: 'Outer container with container queries for responsive layout',
    },
    {
      name: 'label',
      element: 'label',
      description: 'Real <label> tied to the control via htmlFor, so clicking it focuses the field',
    },
    {
      name: 'field',
      element: 'div',
      description: 'Input/control area that holds the actual form element',
    },
    { name: 'description', element: 'div', description: 'Hint or error message below the field' },
  ],

  subComponents: [
    {
      name: 'Root',
      slots: [
        {
          name: 'root',
          element: 'div',
          description: 'Outer container with container-type: inline-size',
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
          description: 'FormField sub-components (Label, Field, Description)',
        },
        {
          name: 'labelWidth',
          type: 'string',
          moveSpecific: true,
          description: 'Custom width for the label column (sets --move-formfield-label-width)',
        },
      ],
      usesFactory: true,
      description: 'Outer wrapper that provides responsive grid layout via container queries',
    },
    {
      name: 'Label',
      slots: [{ name: 'label', element: 'label', description: 'Label container' }],
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
          description: 'Label content (typically a Label component)',
        },
      ],
      usesFactory: true,
      description:
        'Label area that aligns beside the field in wide containers or stacks above in narrow ones',
    },
    {
      name: 'Field',
      slots: [{ name: 'field', element: 'div', description: 'Field container' }],
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
          description: 'Form control element (InputText, Checkbox, etc.)',
        },
      ],
      usesFactory: true,
      description: 'Container for the actual form input control',
    },
    {
      name: 'Description',
      slots: [
        { name: 'description', element: 'div', description: 'Description/error text container' },
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
          description: 'Description or error text',
        },
        {
          name: 'error',
          type: 'boolean',
          moveSpecific: true,
          description: 'Whether to display as error text (red color)',
        },
      ],
      usesFactory: true,
      description: 'Hint text or error message rendered below the field',
    },
  ],

  props: [
    {
      name: 'labelWidth',
      type: 'string',
      moveSpecific: true,
      description: 'Custom width for the label column in wide layout',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      moveSpecific: false,
      description: 'FormField sub-components',
    },
  ],

  anatomy: {
    slot: 'root',
    children: [
      {
        slot: 'label',
      },
      {
        slot: 'field',
      },
      {
        slot: 'description',
        dataAttributes: ['data-error'],
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
    {
      name: '--move-formfield-gap',
      value: 'var(--move-spacing-sm)',
      description: 'Gap between grid rows/columns',
    },
    {
      name: '--move-formfield-label-width',
      value: '8rem',
      description: 'Label column width in wide layout',
    },
    {
      name: '--move-formfield-label-pt',
      value: '0.4375rem',
      description: 'Label top padding to baseline-align with input',
    },
    {
      name: '--move-formfield-description-color',
      value: 'var(--move-fg-muted)',
      description: 'Description text color',
    },
    {
      name: '--move-formfield-description-size',
      value: 'inherit',
      description: 'Description font size',
    },
  ],

  variants: {},
  sizes: [] as string[],

  labels: [],
  childrenKind: 'composition' as const,

  renderContracts: [
    {
      id: 'container-query-layout',
      description:
        'Root uses container-type: inline-size; at min-width 24rem, layout switches from stacked to side-by-side grid',
    },
    {
      id: 'inner-grid-wrapper',
      description: 'Root renders an inner div with grid layout that contains the sub-components',
    },
    {
      id: 'label-width-custom-property',
      description:
        'labelWidth prop sets --move-formfield-label-width as inline CSS custom property on root',
    },
    {
      id: 'description-grid-column',
      description: 'In wide layout, description aligns under the field column (grid-column: 2)',
    },
    {
      id: 'description-error-state',
      description:
        'Description with error=true sets data-error attribute and switches color to --move-error',
    },
    {
      id: 'label-alignment-per-control',
      description:
        'Label padding-top adjusts based on the type of form control in .field (checkbox, switch, radio, slider)',
    },
  ],

  hasHook: false,
  engineImports: ['withMoveComponent'] as string[],

  componentDeps: [] as string[],

  testing: {
    behaviors: [
      'Root renders a container div with inner grid wrapper',
      'Root applies labelWidth as --move-formfield-label-width CSS custom property',
      'Label renders children content in a label container',
      'Field renders children content in a field container',
      'Description renders children content in a description container',
      'Description sets data-error when error=true',
      'Description displays in --move-error color when error=true',
      'Description displays in --move-fg-muted color by default',
      'Stacked layout when container is narrower than 24rem',
      'Side-by-side grid layout when container is 24rem or wider',
      'In wide layout, description is positioned under the field column',
      'Label baseline-aligns with input via padding-top',
      'Forwards className and style on Root',
      'Forwards className and style on Label',
      'Forwards className and style on Field',
      'Forwards className and style on Description',
      'Forwards ref on all sub-components',
    ],
  },
} satisfies ComponentSpec;
