import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Code, Badge, Icon, Table, Tooltip, Card } from 'move';
import { Section, TocRail, type TocItem, InlineCode, CodeBlock } from '../../components';

/**
 * Docs page describing the component spec — the canonical shape every
 * `*.spec.ts` must conform to. The TypeScript interface `ComponentSpec`
 * in `packages/move/src/spec-type.ts` is the enforced view; this page is
 * the human-readable view of the same contract.
 */

const TAGLINE =
  'Every component in Move is described by a typed spec file. Generators, validators, the docs site, and the AI skills all read the same spec. The ComponentSpec interface on this page is what every spec must satisfy.';

const TOC: TocItem[] = [
  { href: '#why-a-contract', label: 'Why a contract' },
  { href: '#example', label: 'A complete spec' },
  { href: '#schema-version', label: 'Schema version + naming' },
  { href: '#identity', label: 'Identity & classification' },
  { href: '#structure', label: 'Structure' },
  { href: '#behavior', label: 'Behavior' },
  { href: '#animation', label: 'Animation' },
  { href: '#styling', label: 'Styling' },
  { href: '#i18n', label: 'Internationalization' },
  { href: '#dependencies', label: 'Dependencies' },
  { href: '#testing', label: 'Testing' },
  { href: '#review', label: 'Review' },
  { href: '#enforcement', label: 'Enforcement' },
  { href: '#next-steps', label: 'Next steps' },
];

interface FieldRow {
  name: string;
  type: string;
  required: boolean;
  description: React.ReactNode;
}

/** The real Badge spec, used as a worked example so readers can see the
 *  shape of a complete spec before walking through field tables. Badge is
 *  presentational with no behavior, so it shows the minimum surface. */
const EXAMPLE_SPEC = `import type { ComponentSpec } from '../../../spec-type';

export const spec = {
  schemaVersion: 7 as const,
  name: 'Badge',
  componentClass: 'presentational' as const,
  category: 'data-display',
  description: 'Inline status label with variant and size options',

  synonyms: ['tag', 'pill', 'chip', 'status', 'label badge'],
  families: {
    behavior:  ['display'],
    state:     ['stateless'],
    animation: ['none'],
    a11y:      ['none'],
  },

  compound: false,
  rootElement: 'span',
  slots: [
    { name: 'root', element: 'span', description: 'Badge container' },
  ],

  props: [
    { name: 'variant', type: "'solid' | 'soft' | 'surface' | 'outline' | 'dot'", default: "'solid'", moveSpecific: true, description: 'Visual style variant' },
    { name: 'size', typeRef: 'Size', default: "'md'", moveSpecific: true, description: 'Badge size' },
    { name: 'children', type: 'React.ReactNode', moveSpecific: false, description: 'Badge content' },
  ],

  anatomy: {
    slot: 'root',
    dataAttributes: ['data-variant', 'data-size'],
  },

  controlled: null,
  keyboard: null,
  focus: null,
  formType: null,
  asChild: false,

  animations: [],

  tokens: [
    { name: '--move-badge-radius', value: 'var(--move-rounded-full)', description: 'Border radius' },
    { name: '--move-badge-font-weight', value: 'var(--move-weight-medium)', description: 'Font weight' },
    // …
  ],

  variants: {
    variant: ['solid', 'soft', 'surface', 'outline', 'dot'],
  },
  sizes: ['sm', 'md', 'lg'],

  labels: [],

  hasHook: false,
  engineImports: ['withMoveComponent'],
  componentDeps: [],

  testing: {
    behaviors: [
      'Renders as span element',
      'Applies variant via data-variant attribute',
      'Defaults to variant=solid',
      'Forwards ref to root element',
    ],
  },

  defaultReview: {
    status: 'approved' as const,
    decisionSource: 'rule-based' as const,
    overrides: {},
  },
} satisfies ComponentSpec;
`;

const GLOSSARY: Record<string, string> = {
  // componentClass
  presentational: 'Pure visual; no state, no interaction (Badge, Avatar, Skeleton).',
  interactive: 'Accepts user input but is not a form field (Button, ToggleButton).',
  input_toggle: 'Form input with a boolean checked state (Checkbox, Switch).',
  input_popup: 'Form input backed by a floating layer (Select, DatePicker, ColorInput).',
  input_plain: 'Plain form input rendering a real <input> (InputText, Textarea).',
  disclosure: 'Open/close container with an animated reveal (Accordion, Collapsible).',
  overlay_layer: 'Full-viewport blocking layer (Dialog, Drawer).',
  overlay_popup: 'Anchored, non-blocking floating layer (Popover, Dropdown, Tooltip).',
  display: 'Shows data; no input semantics (Table, Timeline, List).',
  navigation: 'Moves the user between locations (Link, Breadcrumb, Pagination).',
  // keyboard patterns
  roving: 'Roving tabindex — Tab enters the group, arrows move within; only one descendant is tabbable at a time.',
  linear: 'Arrow up/down navigates a list.',
  toggle: 'Space/Enter toggles the state.',
  typeahead: 'Typing filters/searches the options.',
  grid: '2D grid navigation with arrow keys in both axes.',
  // focus patterns
  self: 'Component itself is focusable; standard browser handling.',
  delegated: 'Focus is delegated to an inner input.',
  trap: 'Focus is trapped inside while open (overlays).',
  child: 'Focus a specific named child element.',
  // formType
  'native-name': 'Standard <input name="…"> participates in form submission.',
  'hidden-input': 'A hidden <input> carries the value for form submission.',
  // controlled
  open: 'open / defaultOpen / onOpenChange.',
  value: 'value / defaultValue / onValueChange.',
  checked: 'checked / defaultChecked / onCheckedChange.',
  // dismissBehavior
  hide: 'The component stays mounted and is visually hidden when dismissed.',
  unmountAfterExit: 'The component unmounts once its exit animation completes.',
  // decisionSource
  'rule-based': "Auto-approved by the review pipeline's deterministic rules.",
  'user-confirmed': 'A human reviewed each default and signed off.',
  'accept-all': 'Bulk-approved during a migration; lower confidence than user-confirmed.',
  // animation capabilities
  slidingIndicator: 'Measure + track an active element, re-measuring on resize/fonts (usePositionTracker). Tabs, TableOfContents.',
  valueLoop: 'Animate a JS value/proxy in a loop, applied via a render callback (raw anime.js). Loader, Skeleton.',
  measureThenAnimate: 'An enter animation whose values depend on a layout measurement taken after render. ChatBubble.',
  scrollApi: 'An imperative scroll/gesture API, not an anime.js animation. Carousel.',
  cssAnimation: 'A continuous CSS @keyframes animation that is not a discrete enter/exit — a spinner rotation, indeterminate progress, a blinking caret.',
  textSplit: 'Split a text node into runtime-generated character/word/line elements and stagger them (useSplitText). AnimatedText.',
};

/**
 * Code chip with an info icon when the literal appears in the
 * glossary. Hovering reveals the meaning via tooltip.
 */
function Term({ children }: { children: string }) {
  const meaning = GLOSSARY[children];
  if (!meaning) return <Code>{children}</Code>;
  return (
    <Tooltip label={meaning}>
      <Code>{children} <Icon name="info" size={12} /></Code>
    </Tooltip>
  );
}

function FieldTable({ fields }: { fields: FieldRow[] }) {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Field</Table.Head>
          <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Type</Table.Head>
          <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>R/O</Table.Head>
          <Table.Head>Notes</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {fields.map((f) => (
          <Table.Row key={f.name}>
            <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}><Code>{f.name}</Code></Table.Cell>
            <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}><InlineCode code={f.type} tintByType /></Table.Cell>
            <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}>
              <Badge variant={f.required ? 'soft' : 'outline'}>
                {f.required ? 'required' : 'optional'}
              </Badge>
            </Table.Cell>
            <Table.Cell><Text size="sm">{f.description}</Text></Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

/** Compact card wrapper for a nested-type field table. */
function NestedType({ name, lede, fields }: { name: string; lede: React.ReactNode; fields: FieldRow[] }) {
  return (
    <Card.Root>
      <Card.Body>
        <Stack gap="md">
          <Stack gap="xs">
            <Heading level={4}><Code>{name}</Code></Heading>
            <Text color="muted" size="sm">{lede}</Text>
          </Stack>
          <FieldTable fields={fields} />
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}

// ============================================================================
// Top-level ComponentSpec fields, grouped by section
// ============================================================================

const IDENTITY: FieldRow[] = [
  { name: 'schemaVersion', type: '7', required: true, description: <>Schema version — always the pinned literal <Code>SPEC_SCHEMA_VERSION</Code> (<Code>7 as const</Code>). Bumped only on breaking schema changes, which ship with a migration over all specs.</> },
  { name: 'name', type: 'string', required: true, description: 'Component display name (PascalCase). Matches the file basename and the runtime export.' },
  { name: 'componentClass', type: 'ComponentClass', required: true, description: <>Component class — determines template and default behaviors. One of <Term>presentational</Term>, <Term>interactive</Term>, <Term>input_toggle</Term>, <Term>input_popup</Term>, <Term>input_plain</Term>, <Term>disclosure</Term>, <Term>overlay_layer</Term>, <Term>overlay_popup</Term>, <Term>display</Term>, <Term>navigation</Term>.</> },
  { name: 'category', type: 'string', required: true, description: <>Source category folder (e.g. <Code>'form'</Code>, <Code>'overlay'</Code>, <Code>'data-display'</Code>).</> },
  { name: 'description', type: 'string', required: true, description: 'Brief one-line description.' },
  { name: 'synonyms', type: 'string[]', required: false, description: <>Search synonyms / aliases (e.g. Dialog → <Code>'modal'</Code>, <Code>'popup'</Code>) for docs search.</> },
  { name: 'families', type: 'Record<string, string[]>', required: false, description: <>Component-family memberships (<Code>behavior</Code> / <Code>state</Code> / <Code>animation</Code> / <Code>a11y</Code>) used by the cross-component drift checks.</> },
];

const STRUCTURE: FieldRow[] = [
  { name: 'compound', type: 'boolean', required: true, description: <><Code>false</Code> = a single self-contained component used directly. <Code>true</Code> = a component assembled from named sub-pieces (e.g. <Code>{`<Tabs.Root>`}</Code> + <Code>{`<Tabs.List>`}</Code>); per-piece props live on <Code>subComponents[]</Code>.</> },
  { name: 'rootElement', type: 'string', required: true, description: 'Root element HTML tag or Radix primitive.' },
  { name: 'slots', type: 'SlotDef[]', required: true, description: 'All slots (for simple components).' },
  { name: 'subComponents', type: 'SubComponentDef[]', required: false, description: 'Sub-components (for compound components).' },
  { name: 'props', type: 'PropDef[]', required: true, description: 'Root-level props.' },
  { name: 'anatomy', type: 'AnatomyNode', required: true, description: 'Render tree anatomy. Slot names must reference declared slots[].' },
  { name: 'childrenKind', type: "'text' | 'composition'", required: false, description: 'Children semantics hint: text content vs structural composition.' },
  { name: 'propRoles', type: 'Record<string, DemoPropRole>', required: false, description: <>Optional prop role hints (<Code>displayText</Code> / <Code>composition</Code> / <Code>data</Code> / <Code>behavior</Code> / <Code>i18n</Code>) for demo generation.</> },
];

const SLOT_DEF: FieldRow[] = [
  { name: 'name', type: 'string', required: true, description: <>Slot name (e.g. <Code>'root'</Code>, <Code>'indicator'</Code>, <Code>'content'</Code>).</> },
  { name: 'element', type: 'string', required: true, description: 'HTML element or Radix primitive this slot renders.' },
  { name: 'description', type: 'string', required: true, description: 'Brief description of purpose.' },
];

const PROP_DEF: FieldRow[] = [
  { name: 'name', type: 'string', required: true, description: 'Prop name.' },
  { name: 'type', type: 'string', required: false, description: 'TypeScript type as a string.' },
  { name: 'typeRef', type: 'string', required: false, description: <>Canonical type reference (e.g. <Code>'Size'</Code>, <Code>'Color'</Code>) instead of an inline union.</> },
  { name: 'default', type: 'string', required: false, description: 'Default value, as a TS-literal string, if any.' },
  { name: 'moveSpecific', type: 'boolean', required: true, description: <>Whether this is a Move-specific prop (goes in <Code>moveProps</Code>/defaults).</> },
  { name: 'advanced', type: 'boolean', required: false, description: 'Advanced / rarely-used prop — de-emphasised in docs.' },
  { name: 'description', type: 'string', required: true, description: 'Brief description.' },
];

const SUBCOMPONENT_DEF: FieldRow[] = [
  { name: 'name', type: 'string', required: true, description: <>Sub-component display name (e.g. <Code>'Trigger'</Code>, <Code>'Content'</Code>).</> },
  { name: 'slots', type: 'SlotDef[]', required: true, description: 'Slots owned by this sub-component.' },
  { name: 'props', type: 'PropDef[]', required: true, description: 'Props for this sub-component.' },
  { name: 'usesFactory', type: 'boolean', required: true, description: 'Whether this sub-component uses the factory (vs a plain FC).' },
  { name: 'radixPrimitive', type: 'string', required: false, description: 'Radix primitive this wraps (if any).' },
  { name: 'description', type: 'string', required: true, description: 'Brief description.' },
];

const ANATOMY_NODE: FieldRow[] = [
  { name: 'slot', type: 'string', required: true, description: 'Slot name (must match a SlotDef).' },
  { name: 'dataAttributes', type: 'string[]', required: false, description: <><Code>data-*</Code> attributes set on this element.</> },
  { name: 'ariaAttributes', type: 'string[]', required: false, description: 'ARIA attributes set on this element.' },
  { name: 'children', type: 'AnatomyNode[]', required: false, description: 'Child anatomy nodes.' },
];

const BEHAVIOR: FieldRow[] = [
  { name: 'controlled', type: 'ControlledPattern', required: true, description: <>Controlled state pattern: <Term>open</Term>, <Term>value</Term>, <Term>checked</Term>, or <Code>null</Code>.</> },
  { name: 'controlledProps', type: 'ControlledProps | Record<…>', required: false, description: <>Explicit controlled/uncontrolled prop mapping (when <Code>controlled != null</Code>). Either the flat single-prop form or a keyed map for multi-controlled components.</> },
  { name: 'keyboard', type: 'KeyboardPattern', required: true, description: <>Keyboard interaction pattern: <Term>toggle</Term>, <Term>linear</Term>, <Term>roving</Term>, <Term>typeahead</Term>, <Term>grid</Term>, <Code>'none'</Code>, or <Code>null</Code>.</> },
  { name: 'focus', type: 'FocusPattern', required: true, description: <>Focus management pattern: <Term>self</Term>, <Term>trap</Term>, <Term>roving</Term>, <Term>delegated</Term>, <Term>child</Term>, <Code>'none'</Code>, or <Code>null</Code>.</> },
  { name: 'formType', type: 'FormType', required: true, description: <>Form integration type: <Term>native-name</Term>, <Term>hidden-input</Term>, or <Code>null</Code>.</> },
  { name: 'asChild', type: 'boolean', required: true, description: <>Whether the component supports <Code>asChild</Code> (Slot) rendering — merges its props/ref onto a single child instead of rendering its own element.</> },
  { name: 'dismissBehavior', type: 'DismissBehavior', required: false, description: <>Close/dismiss semantics for dismissible components: <Code>'none'</Code>, <Term>hide</Term>, or <Term>unmountAfterExit</Term>.</> },
  { name: 'renderContracts', type: '(RenderContract | string)[]', required: false, description: <>Render/composition behavior that must survive generation. A bare string is shorthand for a contract with that description; the object form is <Code>{`{ id, description }`}</Code>.</> },
  { name: 'behavior', type: 'Record<string, unknown>', required: false, description: 'Component-specific behavior config (modal/dismiss/…); shape varies per component.' },
];

const ANIMATION: FieldRow[] = [
  { name: 'states', type: 'AnimationStateDef[]', required: false, description: 'State declarations for state-triggered animations — DOM-attribute observers that fire matching triggers.' },
  { name: 'animations', type: 'AnimationTriggerBinding[]', required: true, description: <>Animation trigger-sequence bindings. An empty array means no animation.</> },
  { name: 'animationCapabilities', type: 'AnimationCapability[]', required: false, description: <>Tier-2 capabilities a component uses beyond the declarative <Code>animations</Code> system — the sanctioned escapes for what triggers/sequences can't express. The animation-capabilities check enforces source ↔ this field.</> },
];

const ANIMATION_STATE_DEF: FieldRow[] = [
  { name: 'name', type: 'string', required: true, description: <>Trigger name — matches an <Code>AnimationTriggerBinding.trigger</Code>.</> },
  { name: 'slot', type: 'string', required: true, description: 'Which slot element to observe.' },
  { name: 'source', type: 'string', required: true, description: <>DOM attribute to watch (e.g. <Code>'data-state'</Code>).</> },
  { name: 'value', type: 'string', required: true, description: 'Attribute value that activates this state.' },
  { name: 'closest', type: 'string', required: false, description: 'CSS selector for ancestor observation — observes an ancestor instead of the slot ref.' },
  { name: 'initial', type: 'boolean', required: false, description: 'Skip the initial fire on mount when false (default true). Use for animations that should only run on subsequent state changes.' },
];

const ANIMATION_TRIGGER_BINDING: FieldRow[] = [
  { name: 'trigger', type: 'string', required: true, description: <>Trigger name. Formats: <Code>'Slot.event'</Code> (hover, press), <Code>'Slot.enter'</Code> / <Code>'Slot.exit'</Code> (lifecycle), or <Code>'stateName'</Code> (must have a matching entry in <Code>states[]</Code>).</> },
  { name: 'sequence', type: '(AnimationStepDef | AnimationStepDef[])[]', required: true, description: 'Steps to execute — an array of steps, or nested arrays for parallel execution.' },
  { name: 'vars', type: 'Record<string, string>', required: false, description: 'Variable definitions for expression resolution.' },
  { name: 'delegate', type: 'string', required: false, description: 'Delegate CSS selector — attach event handlers to matching descendants instead of the slot ref.' },
  { name: 'onComplete', type: 'string', required: false, description: "Callback after all steps in this trigger's sequence complete." },
  { name: 'deps', type: 'string[]', required: false, description: 'Dependency array — re-execute the sequence when deps change (skips first run). Used for value-reactive animations.' },
  { name: 'direction', type: "'enter' | 'exit'", required: false, description: <>Direction hint for <Code>animateDimension</Code> in deps triggers: <Code>'enter'</Code> expands, <Code>'exit'</Code> collapses.</> },
  { name: 'note', type: 'string', required: false, description: 'Free-form note / rationale for this binding.' },
];

const ANIMATION_STEP_DEF: FieldRow[] = [
  { name: 'target', type: 'string', required: false, description: "Target slot to animate (defaults to the trigger's slot if omitted)." },
  { name: 'animation', type: 'string | Record<string, unknown>', required: false, description: 'Inline animation config — an anime.js property object, or a motion builder / spread combination (e.g. { ...scaleIn(), ...fadeIn() }).' },
  { name: 'fn', type: "'animateDimension' | 'animatePosition'", required: false, description: 'Runtime function override.' },
  { name: 'children', type: 'string', required: false, description: 'CSS selector for stagger children (implies staggerAnimate).' },
  { name: 'stagger', type: '{ delay?, from? }', required: false, description: <>Stagger timing config — <Code>delay</Code> plus <Code>from: 'first' | 'last' | 'center'</Code>.</> },
  { name: 'onComplete', type: 'string', required: false, description: "Callback after this step's animation completes." },
];

const STYLING: FieldRow[] = [
  { name: 'tokens', type: 'TokenDeclaration[]', required: true, description: <>Component CSS tokens — all values MUST reference <Code>var(--move-*)</Code> semantic tokens.</> },
  { name: 'variants', type: 'Record<string, string[] | Record<…>>', required: true, description: 'Variant prop values — a list of values, or a richer map of value → metadata.' },
  { name: 'sizes', type: 'string[]', required: true, description: 'Size prop values.' },
  { name: 'surface', type: '{ slot, level } | null', required: false, description: <>Surface this component creates (sets background + shadow context for children). <Code>level</Code> is one of <Code>base</Code> / <Code>subtle</Code> / <Code>muted</Code> / <Code>emphasis</Code> / <Code>inverse</Code>.</> },
];

const TOKEN_DECLARATION: FieldRow[] = [
  { name: 'name', type: 'string', required: true, description: <>Full token name (e.g. <Code>--move-button-primary-bg</Code>).</> },
  { name: 'value', type: 'string', required: true, description: <>Value — MUST reference <Code>var(--move-*)</Code> semantic tokens.</> },
  { name: 'slot', type: 'string', required: false, description: 'Slot this token is scoped to (if any).' },
  { name: 'description', type: 'string', required: false, description: 'What this token controls.' },
];

const LABEL_DEF: FieldRow[] = [
  { name: 'key', type: 'string', required: true, description: <>Label key used in the <Code>labels</Code> prop object (e.g. <Code>'close'</Code>, <Code>'next'</Code>, <Code>'dropzone'</Code>).</> },
  { name: 'default', type: 'string', required: true, description: 'English default value.' },
  { name: 'description', type: 'string', required: true, description: 'Where this label is used.' },
];

const DEPENDENCIES: FieldRow[] = [
  { name: 'radixPrimitive', type: 'string | null', required: false, description: <>Radix primitive used (if any; <Code>null</Code> = explicitly none).</> },
  { name: 'hasHook', type: 'boolean', required: true, description: <>Whether the component uses a headless hook (<Code>use{`{Name}`}.ts</Code>).</> },
  { name: 'engineImports', type: 'string[]', required: true, description: <>Engine imports needed (e.g. <Code>withMoveComponent</Code>).</> },
  { name: 'componentDeps', type: 'string[]', required: false, description: 'Move components this component depends on (used in source and demos).' },
];

const TESTING: FieldRow[] = [
  { name: 'behaviors', type: 'string[]', required: true, description: 'Key behaviors to test. Used as a checklist when generating the test file.' },
  { name: 'keyboard', type: 'string[]', required: false, description: 'Keyboard interactions to test.' },
  { name: 'aria', type: 'string[]', required: false, description: 'ARIA expectations to verify.' },
  { name: 'form', type: 'string[]', required: false, description: 'Form integration tests.' },
  { name: 'animation', type: 'string[]', required: false, description: 'Animation tests.' },
  { name: 'highlighting', type: 'string[]', required: false, description: 'Syntax-highlighting tests (Code/editor components).' },
  { name: 'cell', type: 'string[]', required: false, description: 'Cell-rendering tests (Table-like components).' },
  { name: 'collapse', type: 'string[]', required: false, description: 'Responsive-collapse tests.' },
];

const REVIEW: FieldRow[] = [
  { name: 'defaultReview', type: 'DefaultReview', required: true, description: 'Required audit record that defaults were interactively reviewed. Generation and validation fail when it is missing.' },
  { name: 'preview', type: 'PreviewSpec', required: false, description: 'Optional docs preview-card behaviour (staged overlay, static mock, bare surface, panel width). Preview-only; never affects the shipped component.' },
  { name: 'demo', type: 'DemoSpec', required: false, description: 'Optional explicit demo contract (controls + samples + bindings).' },
];

const DEFAULT_REVIEW_FIELDS: FieldRow[] = [
  { name: 'status', type: "'approved'", required: true, description: 'Must be approved before the spec is written.' },
  { name: 'decisionSource', type: "'user-confirmed' | 'accept-all' | 'rule-based'", required: true, description: <>How approval happened. <Term>rule-based</Term>: auto-approved by deterministic rules. <Term>user-confirmed</Term>: a human reviewed each default. <Term>accept-all</Term>: bulk-approved during a migration.</> },
  { name: 'overrides', type: 'Record<string, string>', required: false, description: 'Explicit per-prop overrides accepted by the user. Key = prop name, value = chosen default.' },
];

const CHECK_SCRIPTS: { name: string; what: string }[] = [
  { name: 'check:spec-drift', what: 'The component source actually implements its spec — prop list, slots, and default values match.' },
  { name: 'check:family-popup', what: 'Anchored-popup components share consistent close/dismiss wiring.' },
  { name: 'check:family-modal', what: 'Modal-overlay components trap focus, lock body scroll, and wire the backdrop.' },
  { name: 'check:family-disclosure', what: 'Disclosure components share consistent open/close + animation wiring.' },
  { name: 'check:cross-component-drift', what: 'Family memberships stay consistent across components that should behave alike.' },
  { name: 'check:animation-capabilities', what: 'Imperative animation code in source matches the declared animationCapabilities[].' },
  { name: 'check:recipes', what: 'Docs recipes use only Move components (no custom CSS / raw layout HTML).' },
];

export function ComponentContractPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="overview">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/core-concepts">Core Concepts</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Component Contract</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Component Contract</Heading>
          <Text color="muted" size="lg">{TAGLINE}</Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="soft"><Icon name="file-code" />schemaVersion: 7</Badge>
            <Badge variant="soft"><Icon name="shield-check" />satisfies ComponentSpec</Badge>
            <Badge variant="soft"><Icon name="git-branch" />Pre-commit + CI checks</Badge>
          </Stack>
        </Stack>

        <Section
          id="why-a-contract"
          title="Why a contract"
          lede="The spec is the load-bearing source of truth. Generators read it. Validators read it. The docs site reads it. The AI skills read it."
        >
          <Stack gap="sm">
            <Text>
              Every component is described by a single <Code>{`{Name}.spec.ts`}</Code> file, and each one ends with <Code>satisfies ComponentSpec</Code>. That keeps the literal object's narrow types while forcing it to conform to the <Code>ComponentSpec</Code> interface in <Code>packages/move/src/spec-type.ts</Code> — so <Code>tsc</Code> rejects any drift in field names, types, or optionality at compile time.
            </Text>
            <Text>
              Cross-references that types can't reach — anatomy slot names matching declared slots, tokens resolving to real <Code>var(--move-*)</Code> values, source implementing the declared behavior — are caught by the structural checks described under <RouterLink to="#enforcement">Enforcement</RouterLink>. The spec is the human-authored decision record; everything downstream is generated or validated from it.
            </Text>
          </Stack>
        </Section>

        <Section
          id="example"
          title="A complete spec"
          lede="The real Badge spec, small enough to read end-to-end. Every section below corresponds to one block of fields you'll see here."
        >
          <CodeBlock code={EXAMPLE_SPEC} language="tsx" />
        </Section>

        <Section
          id="schema-version"
          title="Schema version + naming"
          lede="One pinned version literal, and a fixed naming convention for the file and component."
        >
          <Stack gap="sm">
            <Text>
              Every spec carries <Code>schemaVersion: 7 as const</Code> — always the exported <Code>SPEC_SCHEMA_VERSION</Code>. A bump is a breaking schema change and comes with a one-shot migration over all specs in the same commit.
            </Text>
            <Text>
              The component <Code>name</Code> is PascalCase and matches both the runtime export and the file basename: a component named <Code>Badge</Code> lives in <Code>Badge.spec.ts</Code>. The <Code>category</Code> mirrors the source folder it lives under (e.g. <Code>data-display</Code>, <Code>forms</Code>, <Code>overlay</Code>).
            </Text>
          </Stack>
        </Section>

        <Section id="identity" title="Identity & classification" lede="Who the component is and how it is grouped.">
          <FieldTable fields={IDENTITY} />
        </Section>

        <Section id="structure" title="Structure" lede="Slots, sub-components, props, and the render-tree anatomy.">
          <FieldTable fields={STRUCTURE} />
          <Stack gap="md">
            <NestedType name="SlotDef" lede="A named slot in the component anatomy." fields={SLOT_DEF} />
            <NestedType name="PropDef" lede="A public prop definition." fields={PROP_DEF} />
            <NestedType name="SubComponentDef" lede="A public sub-component of a compound component." fields={SUBCOMPONENT_DEF} />
            <NestedType name="AnatomyNode" lede="A node in the component's render-tree anatomy. Recurses via children." fields={ANATOMY_NODE} />
          </Stack>
        </Section>

        <Section id="behavior" title="Behavior" lede="Controlled state, keyboard, focus, form participation, dismiss semantics, and render contracts.">
          <FieldTable fields={BEHAVIOR} />
        </Section>

        <Section
          id="animation"
          title="Animation"
          lede="The trigger → sequence model. A trigger names an event, lifecycle phase, or state; its sequence is the steps that run."
        >
          <FieldTable fields={ANIMATION} />
          <Stack gap="md">
            <NestedType name="AnimationStateDef" lede="A state declaration the runtime observes on a slot element; it fires the matching trigger when value matches." fields={ANIMATION_STATE_DEF} />
            <NestedType name="AnimationTriggerBinding" lede="A trigger paired with the sequence to run. Trigger formats: 'Slot.event', 'Slot.enter' / 'Slot.exit', or a state name." fields={ANIMATION_TRIGGER_BINDING} />
            <NestedType name="AnimationStepDef" lede="A single step in a sequence." fields={ANIMATION_STEP_DEF} />
          </Stack>
        </Section>

        <Section id="styling" title="Styling" lede="Tokens, variant axes, size scale, and the surface this component creates.">
          <FieldTable fields={STYLING} />
          <NestedType name="TokenDeclaration" lede="A CSS custom property. Values MUST reference var(--move-*) semantic tokens — enforced by the token check." fields={TOKEN_DECLARATION} />
        </Section>

        <Section
          id="i18n"
          title="Internationalization"
          lede="Every user-facing string the component ships goes through a single labels object."
        >
          <FieldTable fields={[
            { name: 'labels', type: 'LabelDef[]', required: true, description: <>Translatable labels exposed via the component's single <Code>labels</Code> prop. An empty array means no labels. Consumers feed this from their own i18n library; there is no global provider.</> },
          ]} />
          <NestedType name="LabelDef" lede="One translatable label exposed via the labels prop." fields={LABEL_DEF} />
        </Section>

        <Section id="dependencies" title="Dependencies" lede="What the component is built on.">
          <FieldTable fields={DEPENDENCIES} />
        </Section>

        <Section id="testing" title="Testing" lede="A spec-side checklist of what the generated test file must cover.">
          <FieldTable fields={TESTING} />
          <Text color="muted" size="sm">
            These arrays live under the <Code>testing</Code> field (a <Code>TestingSpec</Code>). Only <Code>behaviors</Code> is required; the rest are added when the component has keyboard interaction, ARIA expectations, form participation, animation, and so on.
          </Text>
        </Section>

        <Section id="review" title="Review" lede="The audit record that the proposed defaults were signed off before the spec was written.">
          <FieldTable fields={REVIEW} />
          <Stack gap="sm">
            <Heading level={3}><Code>defaultReview</Code> — fields</Heading>
            <FieldTable fields={DEFAULT_REVIEW_FIELDS} />
          </Stack>
        </Section>

        <Section
          id="enforcement"
          title="Enforcement"
          lede="Two layers: the TypeScript type, and the structural checks wired into a native pre-commit hook and CI."
        >
          <Stack gap="md">
            <Stack gap="sm">
              <Heading level={3}>1. Compile-time — <Code>satisfies ComponentSpec</Code></Heading>
              <Text>
                Each <Code>*.spec.ts</Code> imports <Code>ComponentSpec</Code> from <Code>spec-type.ts</Code> and ends with <Code>satisfies ComponentSpec</Code>. This keeps the object literal's precise types while making <Code>tsc</Code> reject any field that doesn't match the interface — a renamed field, a wrong type, a missing required field.
              </Text>
            </Stack>
            <Stack gap="sm">
              <Heading level={3}>2. Structural — <Code>check:all</Code></Heading>
              <Text>
                The structural checks catch what types can't. They run together via the <Code>check:all</Code> npm script, wired into a native pre-commit hook and CI:
              </Text>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Script</Table.Head>
                    <Table.Head>What it verifies</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {CHECK_SCRIPTS.map((c) => (
                    <Table.Row key={c.name}>
                      <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}><Code>{c.name}</Code></Table.Cell>
                      <Table.Cell><Text size="sm">{c.what}</Text></Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Stack>
          </Stack>
        </Section>

        <Section id="next-steps" title="Next steps">
          <Stack gap="sm">
            <Text>Adjacent reading from the same contract:</Text>
            <Stack gap="xs">
              <Text size="sm">• <RouterLink to="/core-concepts/surfaces">Surfaces</RouterLink> — the surface elevation system referenced by <Code>surface</Code>.</Text>
              <Text size="sm">• <RouterLink to="/core-concepts/stacking">Stacking</RouterLink> — the z-layer hierarchy for overlays.</Text>
              <Text size="sm">• <RouterLink to="/core-concepts/animation-system">Animation System</RouterLink> — how <Code>animations</Code> and <Code>states</Code> are consumed at runtime.</Text>
              <Text size="sm">• <RouterLink to="/components">Components</RouterLink> — every spec rendered into a doc page.</Text>
            </Stack>
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
