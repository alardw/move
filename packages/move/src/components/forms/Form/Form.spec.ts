// Form.spec.ts — Component specification

import type { ComponentSpec } from '../../../spec-type';

/*
 * NON-GOALS, decided rather than overlooked.
 *
 * Both of these are genuinely valuable and both require Form to reach into its
 * own subtree, which is the one thing this component is built not to do.
 *
 *   • An error summary. The GOV.UK pattern — a role="alert" block at the top of
 *     main, focus moved to it on a failed submit, each entry linking to its
 *     field — is the highest-value accessibility feature a form root can carry,
 *     and no JS form library implements it. It needs every field's LABEL TEXT,
 *     which means a registry. Left to the consumer, and flagged by the
 *     app-wcag-audit skill, which is the honest place for it while this stays
 *     lean.
 *   • Focus management on a failed submit. Focus belongs on the first invalid
 *     field in DOM ORDER — React Hook Form focuses the first in the server's
 *     RESPONSE, which is arbitrary, so it routinely lands below a field that is
 *     also invalid. Cheaper than the summary (a query at submit time, not a
 *     registry) but still reaching downward.
 *
 * COMPANION CHANGE, required before this ships: FormField.Root needs a `name`
 * prop. Today `name` sits on the control, so a field cannot address itself in
 * the errors map. One prop, and `invalid` gains the context fallback.
 */

export const spec = {
  schemaVersion: 1 as const,
  name: 'Form',
  componentClass: 'presentational' as const,
  category: 'forms',
  description:
    'The form element, with submission handled and errors handed down — it distributes, it does not validate',

  compound: true,
  rootElement: 'form',

  slots: [
    {
      name: 'root',
      element: 'form',
      kind: 'none',
      typography: 'none',
      description: 'The <form> element itself',
    },
    {
      name: 'actions',
      element: 'fieldset',
      kind: 'group',
      typography: 'none',
      description:
        "The row where submit and cancel live. A fieldset, because `disabled` on one disables every control inside by the platform's own rules — the alternative is inspecting children, which this component exists not to do.",
    },
  ],

  props: [],

  subComponents: [
    {
      name: 'Root',
      slots: [
        {
          name: 'root',
          element: 'form',
          kind: 'none',
          typography: 'none',
          description: 'The <form> element itself',
        },
      ],
      props: [
        {
          name: 'onSubmit',
          type: '(values: Record<string, FormDataEntryValue>, event: React.FormEvent<HTMLFormElement>) => void',
          moveSpecific: true,
          description:
            'Called on submit with the collected values. preventDefault is already applied, and the values come from FormData — the browser walks the fields by their name attributes, so the form never inspects its own children.',
        },
        {
          name: 'errors',
          type: 'Record<string, React.ReactNode>',
          moveSpecific: true,
          description:
            'Errors keyed by field name, put into context for the matching FormField to read. The consumer owns this state: errors may arrive from this submit, a route loader, a socket or a validation library, and only the consumer knows when they stop being true.',
        },
        {
          name: 'pending',
          type: 'boolean',
          default: 'false',
          moveSpecific: true,
          description:
            'Whether a submission is in flight. Put into context so the actions and any control can disable themselves, rather than each being handed a prop.',
        },
        {
          name: 'noValidate',
          type: 'boolean',
          default: 'true',
          moveSpecific: false,
          description:
            "Suppresses the browser's own validation bubbles, which would otherwise fire before a FormField could show its message and disagree with it. Native constraints still hold — see the checkValidity contract.",
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
          description: 'The fields, and a Form.Actions',
        },
      ],
      usesFactory: true,
      description:
        'The form element. Holds no state of its own: it applies preventDefault, collects values, and hands `errors` and `pending` down through context.',
    },
    {
      name: 'Actions',
      slots: [
        {
          name: 'actions',
          element: 'fieldset',
          kind: 'group',
          typography: 'none',
          description: 'The submit/cancel row',
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
          name: 'align',
          type: "'start' | 'end' | 'between'",
          default: "'end'",
          moveSpecific: true,
          description: 'Where the buttons sit in the row',
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          moveSpecific: false,
          description: 'Buttons — typically a submit and a cancel',
        },
      ],
      usesFactory: true,
      description:
        'The row where submit and cancel live. Reads `pending` from context, so a form in flight disables its actions without the call site threading a prop.',
    },
  ],

  childrenKind: 'composition' as const,

  anatomy: {
    slot: 'root',
    children: [{ slot: 'actions' }],
  },

  // The consumer owns every piece of state this component reflects. There is no
  // internal value to control.
  controlled: null,
  keyboard: null,
  focus: null,
  // Form is not itself a form CONTROL — it is the element the controls submit
  // through. The eleven components declaring native-name or hidden-input are
  // the ones with a formType.
  formType: null,
  asChild: false,

  animations: [],

  renderContracts: [
    {
      id: 'holds-no-state',
      description:
        '`errors` and `pending` are read from props and passed straight into context. Form must not hold them in state, must not derive them from a submit, and must not decide when they stop being true — the consumer owns that, because errors can arrive from a route loader or a socket as easily as from this submit.',
    },
    {
      id: 'the-browser-does-the-enumerating',
      description:
        'Values come from `new FormData(event.currentTarget)`. The platform walks the fields by their `name` attributes — which every form control in the library already renders, several through a hidden input — so Form never inspects, counts or registers its children.',
    },
    {
      id: 'native-constraints-still-hold',
      description:
        'noValidate suppresses the browser\'s bubbles, not its validation. Form calls checkValidity() before onSubmit and returns without calling it when that fails, so `required` and `type="email"` keep working. The platform walks the fields again here; Form still knows nothing about them.',
    },
    {
      id: 'a-field-reads-its-own-error',
      description:
        'The errors map goes into context whole. A FormField takes the entry matching its `name` — the form does not find the field, the field finds its error. Precedence is `invalid = props.invalid ?? Boolean(errors[name])`: an explicit prop beats the context, per check:prop-precedence.',
    },
    {
      id: 'context-value-is-memoized',
      description:
        'Memoized on [errors, pending], so a Form re-render for an unrelated reason does not re-render every field. Note that an inline `errors={{…}}` literal constructs a new object each render and defeats it; errors held in state, which is where they belong, keep a stable reference between submits.',
    },
    {
      id: 'actions-read-pending',
      description:
        "Form.Actions reads `pending` from context rather than taking a prop, so the disabled-while-submitting rule is stated once on the form. It renders a <fieldset disabled>, which disables every control inside it by the platform's rules — for the keyboard as well as the pointer — instead of inspecting children to disable them one by one.",
    },
  ],

  tokens: [
    {
      name: '--move-form-gap',
      value: 'var(--move-spacing-md)',
      description: 'Space between fields',
    },
    {
      name: '--move-form-actions-gap',
      value: 'var(--move-spacing-sm)',
      description: 'Space between the buttons in the actions row',
    },
    {
      name: '--move-form-actions-margin-top',
      value: 'var(--move-spacing-lg)',
      description: 'Space above the actions row, which sits apart from the fields',
    },
  ],

  variants: {},
  sizes: [],
  labels: [],

  radixPrimitive: null,
  hasHook: false,
  engineImports: ['withMoveComponent'],

  testing: {
    behaviors: [
      'Renders a <form> element',
      'Applies preventDefault on submit',
      'Calls onSubmit with values collected from FormData',
      'Does not call onSubmit when checkValidity fails',
      'Sets noValidate by default',
      'Puts errors into context for fields to read',
      'Puts pending into context',
      'Form.Actions disables its buttons while pending',
      'Holds no state — the same errors prop produces the same render',
      'Forwards className and style',
    ],
    keyboard: [],
    aria: [
      'A field is marked invalid when the errors map carries its name',
      'An explicit invalid prop on the field beats the errors map',
      'Native constraint violations block submission without the browser rendering a bubble',
    ],
    animation: [],
  },
} satisfies ComponentSpec;
