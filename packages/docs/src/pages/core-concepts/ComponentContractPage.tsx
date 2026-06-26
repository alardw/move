import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Code, Badge, Icon, Table, Tooltip, Card } from 'move';
import { Section, TocRail, type TocItem, InlineCode, CodeBlock } from '../../components';

/**
 * Docs page describing the spec contract — the canonical shape every
 * `*.spec.ts` must conform to. Sourced from `packages/move/src/contract/`
 * (the TypeScript interface). This page is the human-readable view; the
 * type is the enforced view.
 */

const TAGLINE =
  'Every component in Move is described by a spec file. Generators, the docs site, spec-diff, and the AI skills all read the same spec. The contract on this page is what every spec must satisfy.';

const TOC: TocItem[] = [
  { href: '#overview', label: 'Overview' },
  { href: '#why-a-contract', label: 'Why a contract' },
  { href: '#whats-in-a-spec', label: "What's in a spec" },
  { href: '#naming', label: 'Naming convention' },
  { href: '#schema-version', label: 'Schema version' },
  { href: '#identity', label: 'Identity' },
  { href: '#lifecycle', label: 'Lifecycle' },
  { href: '#taxonomies', label: 'Taxonomies' },
  { href: '#composition', label: 'Composition' },
  { href: '#interaction', label: 'Interaction' },
  { href: '#style-variants', label: 'Style + variants' },
  { href: '#animation-tokens', label: 'Animation + tokens' },
  { href: '#tests', label: 'Tests' },
  { href: '#tooling', label: 'Tooling' },
  { href: '#enforcement', label: 'Enforcement' },
  { href: '#next-steps', label: 'Next steps' },
];

interface FieldRow {
  name: string;
  type: string;
  required: boolean;
  description: React.ReactNode;
}

/** Worked example used early in the page so readers can see the
 *  shape of a real spec before walking through field tables. Kept
 *  short and realistic — Badge has no taxonomies beyond class +
 *  presentational, so it shows the minimum surface. */
const EXAMPLE_SPEC = `import type { Spec } from 'move';

export const spec: Spec = {
  schemaVersion: 1,

  identity: {
    name: 'Badge',
    description: 'Small label for status, count, or category.',
    synonyms: ['tag', 'pill', 'chip', 'status'],
  },

  taxonomies: {
    category: 'core',
    class: { kind: 'presentational' },
  },

  composition: {
    compound: false,
    rootElement: 'span',
    asChild: false,
    slots: [
      { name: 'root', element: 'span', description: 'Badge container.' },
    ],
    props: [
      {
        name: 'children',
        required: true,
        role: 'composition',
        type: 'React.ReactNode',
        description: 'Badge content.',
        moveSpecific: false,
      },
      {
        name: 'variant',
        required: false,
        role: 'data',
        type: "'subtle' | 'solid' | 'outline'",
        default: "'subtle'",
        description: 'Visual style.',
        moveSpecific: true,
      },
      {
        name: 'size',
        required: false,
        role: 'data',
        typeRef: 'Size',
        default: "'md'",
        description: 'Size scale.',
        moveSpecific: true,
      },
    ],
    anatomy: { slot: 'root', dataAttributes: ['data-variant', 'data-size'] },
  },

  interaction: {
    keyboard: 'none',
    focus: 'self',
    formType: null,
  },

  style: {
    variants: { variant: ['subtle', 'solid', 'outline'] },
    sizes: ['sm', 'md', 'lg'],
    labels: [],
  },

  animation: {
    triggers: [],
    tokens: [
      { name: '--move-badge-bg', value: 'var(--move-bg-subtle)', description: 'Background.' },
      { name: '--move-badge-fg', value: 'var(--move-fg-base)', description: 'Text colour.' },
    ],
    renderContracts: [
      { id: 'data-attrs', description: 'variant + size set as data-* attributes on root for CSS targeting.' },
    ],
  },

  tests: {
    behaviors: ['Renders children', 'Applies data-variant attribute'],
  },

  lifecycle: {
    since: '0.1.0',
    defaultReview: { status: 'approved', decisionSource: 'rule-based', overrides: {} },
  },

  tooling: {
    hasHook: false,
    engineImports: ['withMoveComponent'],
    componentDeps: [],
  },
};
`;

/** Snippet shown in the Taxonomies overview to make the
 *  discriminated-union pattern concrete. */
const TAXONOMY_VARIANT_SNIPPET = `taxonomies: {
  // ...
  behaviors: [
    {
      kind: 'popup-anchored',
      closeOnEscape: true,
      closeOnOutsideClick: true,
      closeOnScroll: true,
      closeOnResize: true,
    },
  ],
},
`;

const GLOSSARY: Record<string, string> = {
  // keyboard patterns
  roving: 'Roving tabindex — Tab enters the group, arrows move within. Only one descendant is in the tab order at any time.',
  linear: 'Standard tab-order navigation; no arrow handling.',
  toggle: 'A single key (Space or Enter) toggles the state.',
  grid: '2D grid navigation with arrow keys in both axes.',
  // focus patterns
  self: 'Component itself is focusable; standard browser handling.',
  delegated: 'Focus is delegated to an inner input or trigger.',
  trap: 'Focus is trapped inside while open (modal pattern).',
  child: 'Focus is delegated to a specific named child.',
  // formType
  'native-name': 'Renders a real form element with name/value.',
  'hidden-input': 'Renders a hidden <input> carrying the value (used by custom UI components that still need to submit).',
  // surface levels
  base: 'Base background tint.',
  subtle: 'Slightly raised; muted background.',
  // decisionSource
  'rule-based': "Auto-approved by the review pipeline's rules.",
  'user-confirmed': 'A human signed off after review.',
  'accept-all': 'Bulk-approved during a migration; lower confidence than user-confirmed.',
};

/**
 * Code chip with an info icon when the literal appears in the
 * glossary. The icon is the visible "I have a definition" cue;
 * hovering reveals the meaning via tooltip.
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

const IDENTITY: FieldRow[] = [
  { name: 'schemaVersion', type: '1', required: true, description: 'Pinned literal. Bumped only on breaking schema changes; bumps come with a migration over all specs.' },
  { name: 'name', type: 'string', required: true, description: 'PascalCase component name. Must match the file basename and the runtime export.' },
  { name: 'description', type: 'string', required: true, description: 'One-sentence summary of what the component does.' },
  { name: 'synonyms', type: 'string[]', required: true, description: <>Alternate search terms (e.g. Dialog → modal, popup, lightbox). <Code>[]</Code> when none apply.</> },
];

const TAXONOMY_FIELDS: FieldRow[] = [
  { name: 'category', type: 'Category', required: true, description: <>Top-level grouping label — <strong>metadata only</strong>. See <a href="#taxonomy-category">Category</a>.</> },
  { name: 'class', type: 'ComponentClass', required: true, description: <>Structural class. Discriminated union — each variant carries its required slots and prop expectations.</> },
  { name: 'behaviors', type: 'Behavior[]', required: false, description: <>Multi-valued behaviour family memberships. Absent when none apply.</> },
  { name: 'state', type: 'State', required: false, description: <>Controlled-state shape. Absent on stateless components.</> },
  { name: 'animation', type: 'Animation', required: false, description: <>Animation pattern. Absent when no pattern applies.</> },
  { name: 'surface', type: 'Surface', required: false, description: <>Surface elevation marker. Absent when the component has no distinct surface.</> },
  { name: 'a11y', type: 'A11y', required: false, description: <>WAI-ARIA pattern. Absent when no specific pattern applies.</> },
];

const COMPOSITION: FieldRow[] = [
  { name: 'compound', type: 'boolean', required: true, description: <><Code>false</Code> = a single self-contained component you use directly (e.g. <Code>{`<Image src="…" />`}</Code>). <Code>true</Code> = a component you assemble from named sub-pieces (e.g. <Code>{`<Tabs.Root>`}</Code> with <Code>{`<Tabs.List>`}</Code>, <Code>{`<Tabs.Trigger>`}</Code>, <Code>{`<Tabs.Content>`}</Code>). Props for compound components are listed per sub-piece on <Code>subComponents[]</Code>.</> },
  { name: 'rootElement', type: 'string', required: true, description: <>The element or Radix primitive rendered for the root slot.</> },
  { name: 'asChild', type: 'boolean', required: true, description: <>Whether the component supports Radix UI's <Code>asChild</Code> pattern — pass <Code>asChild</Code> with a single child element and the component merges its props/ref onto that child instead of rendering its own default element. Borrowed from Radix; non-Radix runtimes adopting this contract would implement an equivalent slot-replace pattern.</> },
  { name: 'slots', type: 'SlotDef[]', required: true, description: 'Flat list of every named rendering slot.' },
  { name: 'props', type: 'PropDef[]', required: true, description: <>Top-level props. <Code>[]</Code> when <Code>compound: true</Code>.</> },
  { name: 'subComponents', type: 'SubComponentDef[]', required: false, description: 'One entry per public sub-component.' },
  { name: 'anatomy', type: 'AnatomyDef', required: true, description: 'Recursive tree describing slot composition. Children must reference declared slot names.' },
  { name: 'childrenKind', type: "'composition' | 'text'", required: false, description: 'Declared only when the children slot has a constrained role.' },
  { name: 'radixPrimitive', type: 'string | null', required: false, description: 'Top-level Radix primitive being wrapped.' },
];

const INTERACTION: FieldRow[] = [
  { name: 'keyboard', type: 'KeyboardPattern', required: true, description: <>One of <Term>roving</Term>, <Term>linear</Term>, <Term>toggle</Term>, <Term>grid</Term>, <Term>none</Term>.</> },
  { name: 'focus', type: 'FocusPattern', required: true, description: <>One of <Term>self</Term>, <Term>roving</Term>, <Term>delegated</Term>, <Term>trap</Term>, <Term>child</Term>, <Term>none</Term>.</> },
  { name: 'formType', type: "'hidden-input' | 'native-name' | null", required: true, description: <>One of <Term>native-name</Term>, <Term>hidden-input</Term>, or <Code>null</Code>.</> },
  { name: 'states', type: 'AnimationStateDef[]', required: false, description: 'DOM-attribute observers that drive animation state triggers.' },
];

const STYLE: FieldRow[] = [
  { name: 'variants', type: 'Record<string, string[]>', required: true, description: 'Variant axes and their allowed values.' },
  { name: 'sizes', type: 'string[]', required: true, description: 'Size scale token names.' },
  { name: 'labels', type: 'LabelDef[]', required: true, description: <>Localizable string rows — <Code>{`{ key, default, description }`}</Code>. User-visible defaults the component ships (button labels, aria-labels, format templates). <Code>[]</Code> when the component exposes no labels.</> },
];

const ANIMATION: FieldRow[] = [
  { name: 'triggers', type: 'AnimationDef[]', required: true, description: <>Concrete trigger/sequence pairs. The pattern these fit is named in <Code>taxonomies.animation.kind</Code>.</> },
  { name: 'tokens', type: 'TokenDef[]', required: true, description: <>CSS custom properties this component owns. Names follow <Code>--move-{`<component>`}-</Code>.</> },
  { name: 'renderContracts', type: 'RenderContractDef[]', required: true, description: 'Stable, ID-keyed contracts about how the component renders.' },
];

const TESTS: FieldRow[] = [
  { name: 'behaviors', type: 'string[]', required: true, description: 'Functional cases. Used as a checklist when generating tests.' },
  { name: 'aria', type: 'string[]', required: false, description: 'Accessibility assertions.' },
  { name: 'keyboard', type: 'string[]', required: false, description: 'Keyboard interaction assertions.' },
  { name: 'animation', type: 'string[]', required: false, description: 'Animation assertions.' },
  { name: 'form', type: 'string[]', required: false, description: 'Form-participation assertions.' },
];

const TOOLING: FieldRow[] = [
  { name: 'hasHook', type: 'boolean', required: true, description: 'Whether the component exports a public hook.' },
  { name: 'engineImports', type: 'string[]', required: true, description: 'Names imported from `engine/`.' },
  { name: 'componentDeps', type: 'string[]', required: true, description: 'Other Move components this one composes.' },
];

const LIFECYCLE: FieldRow[] = [
  { name: 'since', type: 'string', required: true, description: <>Package version when this component was first introduced (e.g. <Code>'0.1.48'</Code>). Used by the version-log generator and by the components overview to filter "what shipped in v2.0?".</> },
  { name: 'defaultReview', type: 'DefaultReview', required: true, description: <>AI safety gate. Records whether a human has signed off on the proposed defaults — generators refuse to run when <Code>status === 'pending'</Code>. See the field breakdown below.</> },
  { name: 'deprecated', type: 'DeprecatedDef', required: false, description: <>Set on a component scheduled for removal. Drives the docs deprecation banner and the <Code>componentDeprecated</Code> spec-diff event. Carries <Code>since</Code>, <Code>removeIn</Code>, optional <Code>replacement</Code>, and <Code>reason</Code>.</> },
];

const DEFAULT_REVIEW_FIELDS: FieldRow[] = [
  { name: 'status', type: "'approved' | 'pending'", required: true, description: <><Code>'pending'</Code> blocks AI generation; <Code>'approved'</Code> lets it through. Generators (<Code>/component-generate-all</Code>, etc.) check this before running.</> },
  { name: 'decisionSource', type: "'rule-based' | 'user-confirmed' | 'accept-all'", required: true, description: <>How the approval was reached. <Term>rule-based</Term>: auto-approved by deterministic rules (highest confidence). <Term>user-confirmed</Term>: a human reviewed each default individually. <Term>accept-all</Term>: bulk-approved during a migration (lower confidence).</> },
  { name: 'overrides', type: 'Record<string, unknown>', required: true, description: 'Specific defaults the human changed during review. Key = prop name, value = chosen default. Empty object when no overrides.' },
];

// ============================================================================
// Taxonomy values + sub-contracts
// ============================================================================

interface TaxonomyField {
  name: string;
  type: string;
  required: boolean;
  description: string;
}
interface TaxonomyValue {
  kind: string;
  meaning: string;
  fields?: TaxonomyField[];
  examples?: string;
}
interface TaxonomyDef {
  name: string;
  axis: string;
  flavor: 'metadata' | 'contract';
  multiValued: boolean;
  description: React.ReactNode;
  values: TaxonomyValue[];
}

const TAXONOMIES: TaxonomyDef[] = [
  {
    name: 'Category',
    axis: 'category',
    flavor: 'metadata',
    multiValued: false,
    description: <>Top-level grouping label. Drives docs navigation and the "by category" filter.</>,
    values: [
      { kind: 'core', meaning: 'Primitive building blocks: text, layout, badges, links.', examples: 'Alert, Avatar, Badge, Button, Heading, Link, Stack' },
      { kind: 'form', meaning: 'Form inputs and field-related controls.', examples: 'InputText, Checkbox, Select, DatePicker, Switch' },
      { kind: 'overlay', meaning: 'Floating layers — both modals and anchored popups.', examples: 'Dialog, Drawer, Dropdown, Popover, Toast' },
      { kind: 'panel', meaning: 'Container surfaces.', examples: 'Accordion, Card, Collapsible, Sidebar, Tabs' },
      { kind: 'navigation', meaning: 'Wayfinding and linear navigation.', examples: 'Breadcrumb, Pagination, Stepper, TableOfContents' },
      { kind: 'data', meaning: 'Tabular and list data display.', examples: 'List, Table, Timeline' },
      { kind: 'media', meaning: 'Audio, video, image, gallery.', examples: 'AudioPlayer, Carousel, Image, ImageGroup, VideoPlayer' },
      { kind: 'loading', meaning: 'Loaders, skeletons, progress, empty states.', examples: 'EmptyState, Loader, ProgressBar, Skeleton' },
      { kind: 'calendar', meaning: 'Date grids and calendar views.', examples: 'Calendar, CalendarView' },
      { kind: 'toolbar', meaning: 'Segmented controls and toolbar items.', examples: 'ToggleButton, ToggleGroup' },
    ],
  },
  {
    name: 'ComponentClass',
    axis: 'class',
    flavor: 'contract',
    multiValued: false,
    description: <>Structural class. Each variant declares the slot set the generator must scaffold and any class-level prop expectation. The class drives generator template selection.</>,
    values: [
      { kind: 'presentational', meaning: 'Pure visual; no state, no interaction. Covers display primitives (Avatar, Badge, Skeleton) and typography (Heading, Text, Code, Prose).', examples: 'Image, Card, Heading, Text, Avatar, Badge, Skeleton' },
      { kind: 'layout', meaning: 'Structural wrapper that arranges children.', fields: [
        { name: 'axis', type: "'flex' | 'grid' | 'split'", required: true, description: 'How children are arranged.' },
      ], examples: 'Stack, Grid, Splitter' },
      { kind: 'display', meaning: 'Shows data; no input semantics.', fields: [
        { name: 'requiredSlots', type: "['root']", required: true, description: 'Slots the generator must scaffold.' },
      ], examples: 'Calendar, Timeline, Table, List' },
      { kind: 'interactive', meaning: 'Accepts user input but is not a form field.', fields: [
        { name: 'requiredSlots', type: "['root']", required: true, description: 'Slots the generator must scaffold.' },
        { name: 'requiresOnClick', type: 'true', required: true, description: 'Component must accept an onClick prop.' },
      ], examples: 'Button, ToggleGroup, ToggleButton' },
      { kind: 'navigation', meaning: 'Moves the user between locations.', fields: [
        { name: 'requiredSlots', type: "['root']", required: true, description: 'Slots the generator must scaffold.' },
      ], examples: 'Link, Breadcrumb, Pagination, Tabs' },
      { kind: 'input', meaning: 'Form input. Sub-divisions (plain/popup/toggle) live in the behaviors taxonomy.', fields: [
        { name: 'requiredSlots', type: "['root', 'input']", required: true, description: 'Wraps a real input element.' },
        { name: 'requiresValue', type: 'true', required: true, description: 'Must accept a value prop.' },
      ], examples: 'InputText, Select, Checkbox, DatePicker' },
      { kind: 'overlay', meaning: 'Floating layer. Modal vs anchored distinction lives in behaviors.', fields: [
        { name: 'requiredSlots', type: "['root', 'trigger', 'content']", required: true, description: 'Slots the generator must scaffold.' },
        { name: 'requiresPortal', type: 'true', required: true, description: 'Content portals out of the DOM tree.' },
      ], examples: 'Dialog, Drawer, Popover, Dropdown' },
      { kind: 'disclosure', meaning: 'Open/close container with animated reveal.', fields: [
        { name: 'requiredSlots', type: "['root', 'trigger', 'content']", required: true, description: 'Slots the generator must scaffold.' },
      ], examples: 'Accordion, Collapsible, Sidebar' },
    ],
  },
  {
    name: 'Behavior',
    axis: 'behaviors',
    flavor: 'contract',
    multiValued: true,
    description: <>What the component DOES at the page level. Multi-valued — a component can be in several behaviour families simultaneously. Every variant carries a sub-contract; pure-label entries (layout, typography, display) live on the class taxonomy instead.</>,
    values: [
      { kind: 'popup-anchored', meaning: 'Anchored to a trigger; non-blocking overlay.', fields: [
        { name: 'closeOnEscape', type: 'boolean', required: true, description: 'Closes when Escape is pressed.' },
        { name: 'closeOnOutsideClick', type: 'boolean', required: true, description: 'Closes on outside pointer/touch.' },
        { name: 'closeOnScroll', type: 'boolean', required: true, description: 'Closes when an ancestor scrolls.' },
        { name: 'closeOnResize', type: 'boolean', required: true, description: 'Closes on viewport resize.' },
      ], examples: 'Popover, Dropdown, Tooltip' },
      { kind: 'modal-overlay', meaning: 'Full-viewport blocking surface.', fields: [
        { name: 'closeOnEscape', type: 'boolean', required: true, description: 'Closes when Escape is pressed.' },
        { name: 'closeOnOverlayClick', type: 'boolean', required: true, description: 'Closes when the backdrop is clicked.' },
        { name: 'lockBodyScroll', type: 'boolean', required: true, description: 'Disables document scrolling while open.' },
        { name: 'trapFocus', type: 'boolean', required: true, description: 'Focus is trapped inside while open.' },
      ], examples: 'Dialog, Drawer' },
      { kind: 'disclosure', meaning: 'Expand/collapse container with open/close state.', fields: [
        { name: 'animatesOpen', type: 'boolean', required: true, description: 'Open transition is animated.' },
        { name: 'animatesClose', type: 'boolean', required: true, description: 'Close transition is animated.' },
        { name: 'keyboardToggle', type: 'boolean', required: true, description: 'Space/Enter on trigger toggles.' },
        { name: 'multipleOpen', type: 'boolean', required: true, description: 'Multiple items can be open at once.' },
      ], examples: 'Accordion, Collapsible, Sidebar' },
      { kind: 'data-row', meaning: 'Clickable row in a list/table/gallery.', fields: [
        { name: 'interactiveProp', type: 'boolean', required: true, description: 'Exposes an `interactive` prop or auto-derives.' },
        { name: 'keyboardActivate', type: 'boolean', required: true, description: 'Enter/Space activates onClick.' },
        { name: 'hoverAffordance', type: 'boolean', required: true, description: 'Cursor + hover tint + focus ring.' },
        { name: 'rootHoverModifier', type: "'hoverable' | 'hover' | null", required: true, description: 'Root-level modifier name when present.' },
      ], examples: 'List.Item, Table.Row, Image' },
      { kind: 'form-input', meaning: 'Contributes a value to a form.', fields: [
        { name: 'name', type: 'string', required: false, description: 'Submission name attribute when applicable.' },
        { name: 'hiddenInput', type: 'boolean', required: true, description: 'Emits a hidden <input> carrying the value.' },
      ], examples: 'InputText, Select, Checkbox, DatePicker' },
      { kind: 'notification-inline', meaning: 'Ephemeral feedback rendered inline (not floating).', fields: [
        { name: 'dismissable', type: 'boolean', required: true, description: 'Can be manually dismissed.' },
      ], examples: 'Alert' },
      { kind: 'notification-floating', meaning: 'Ephemeral feedback floating above content (drives the toast z-layer).', fields: [
        { name: 'autoDismissMs', type: 'number | null', required: true, description: 'Auto-dismiss timeout. `null` for manual-only.' },
        { name: 'dismissable', type: 'boolean', required: true, description: 'Can be manually dismissed.' },
      ], examples: 'Toast' },
      { kind: 'navigation', meaning: 'Moves the user.', fields: [
        { name: 'target', type: "'href' | 'onClick' | 'both'", required: true, description: 'Source of the routing target.' },
      ], examples: 'Link, Breadcrumb, Pagination, Tabs, Stepper' },
      { kind: 'media', meaning: 'Image, audio, video, gallery.', fields: [
        { name: 'mediaType', type: "'image' | 'audio' | 'video' | 'mixed'", required: true, description: 'Media kind handled.' },
      ], examples: 'Image, AudioPlayer, VideoPlayer, Carousel' },
      { kind: 'loading', meaning: 'Signals progress or waiting.', fields: [
        { name: 'determinate', type: 'boolean', required: true, description: 'Whether progress is known.' },
      ], examples: 'Loader, Skeleton, ProgressBar' },
    ],
  },
  {
    name: 'State',
    axis: 'state',
    flavor: 'contract',
    multiValued: false,
    description: <>The controlled-state shape. Optional — absent on stateless components. The variant carries the controlled-prop wiring.</>,
    values: [
      { kind: 'controlled-value', meaning: 'A value/defaultValue/onChange trio.', fields: [
        { name: 'valueProp', type: 'string', required: true, description: "e.g. 'value', 'checked'." },
        { name: 'defaultValueProp', type: 'string', required: true, description: "e.g. 'defaultValue', 'defaultChecked'." },
        { name: 'onChangeProp', type: 'string', required: true, description: "e.g. 'onValueChange', 'onCheckedChange'." },
      ], examples: 'Tabs, Select, InputText, Checkbox, Switch' },
      { kind: 'controlled-open', meaning: 'Open/defaultOpen/onOpenChange.', fields: [
        { name: 'valueProp', type: "'open'", required: true, description: 'Always the literal "open".' },
        { name: 'defaultValueProp', type: "'defaultOpen'", required: true, description: 'Always the literal "defaultOpen".' },
        { name: 'onChangeProp', type: "'onOpenChange'", required: true, description: 'Always the literal "onOpenChange".' },
      ], examples: 'Dialog, Drawer, Popover, Sidebar' },
    ],
  },
  {
    name: 'Animation',
    axis: 'animation',
    flavor: 'contract',
    multiValued: false,
    description: <>Dominant motion pattern. Optional — absent when no pattern applies. Each variant declares the parameters that vary per spec; pattern rules (which triggers and properties must appear in <Code>animations[]</Code>) are constants of the kind, validated by the spec-schema check.</>,
    values: [
      { kind: 'fade', meaning: 'Pure opacity transition.', fields: [
        { name: 'direction', type: "'enter' | 'exit' | 'both'", required: true, description: 'Which transition direction(s) animate.' },
      ], examples: 'FileUpload, ProgressBar, Image' },
      { kind: 'scale-fade', meaning: 'Scale + opacity (popups, dialogs).', fields: [
        { name: 'direction', type: "'enter' | 'exit' | 'both'", required: true, description: 'Which transition direction(s) animate.' },
      ], examples: 'Tooltip, Select, Dialog' },
      { kind: 'slide', meaning: 'Translate-based enter and exit.', fields: [
        { name: 'direction', type: "'left' | 'right' | 'top' | 'bottom'", required: true, description: 'Edge the component slides from on enter and to on exit.' },
      ], examples: 'Drawer, Sidebar' },
      { kind: 'dimension-morph', meaning: 'animateDimension on a single axis (height or width).', fields: [
        { name: 'axis', type: "'height' | 'width'", required: true, description: 'Dimension being animated.' },
      ], examples: 'Dropdown, Accordion, Collapsible' },
      { kind: 'hover-press', meaning: 'Pointer feedback.', fields: [
        { name: 'triggers', type: "('hover' | 'press')[]", required: true, description: 'Which pointer events fire feedback.' },
      ], examples: 'Button, Checkbox, ToggleButton, ToggleGroup' },
      { kind: 'stagger', meaning: 'Children animate in sequence.', fields: [
        { name: 'intervalMs', type: 'number', required: true, description: 'Stagger interval in milliseconds.' },
        { name: 'target', type: "'children' | 'self'", required: true, description: 'What is staggered.' },
      ], examples: 'ChatBubble, List, Timeline' },
      { kind: 'loop', meaning: 'Perpetual motion.', fields: [
        { name: 'durationMs', type: 'number', required: true, description: 'Loop period in milliseconds.' },
        { name: 'alternate', type: 'boolean', required: true, description: 'Loop reverses direction every cycle.' },
      ], examples: 'Loader, Skeleton, Spinner' },
    ],
  },
  {
    name: 'Surface',
    axis: 'surface',
    flavor: 'contract',
    multiValued: false,
    description: <>Surface elevation marker for components that render a tinted or elevated panel. Levels alternate background tints so nested surfaces stay visually distinct. Optional — absent when the component has no distinct surface. Full reference: <RouterLink to="/core-concepts/surfaces">Surfaces</RouterLink>.</>,
    values: [
      { kind: 'base', meaning: 'Base background tint.', fields: [
        { name: 'slot', type: 'string', required: true, description: 'Slot the surface applies to.' },
      ], examples: 'TableOfContents' },
      { kind: 'subtle', meaning: 'Slightly raised; muted background.', fields: [
        { name: 'slot', type: 'string', required: true, description: 'Slot the surface applies to.' },
      ], examples: 'Alert, Card, Dialog, Drawer, Dropdown, Popover, Toast' },
    ],
  },
  {
    name: 'Z',
    axis: 'z (derived)',
    flavor: 'contract',
    multiValued: false,
    description: <>Stacking layer — <strong>derived</strong> from <Code>behaviors[]</Code> and <Code>a11y</Code> via <Code>deriveZ(spec)</Code>. Not declared on the spec; the model enforces that every component's z-layer falls out of its other taxonomies. Layers ordered low → high. Full reference, derivation rules, and per-component table: <RouterLink to="/core-concepts/stacking">Stacking</RouterLink>.</>,
    values: [
      { kind: 'sticky', meaning: 'Sticky elements within scrollable content.', examples: 'sticky table headers' },
      { kind: 'app-shell', meaning: 'Top-level chrome — sidebars, fixed top bars.', examples: 'Sidebar' },
      { kind: 'overlay-backdrop', meaning: 'Backdrop behind a modal.', examples: 'Dialog/Drawer overlay' },
      { kind: 'overlay', meaning: 'Modal content layer.', examples: 'Dialog, Drawer' },
      { kind: 'popover', meaning: 'Anchored popups.', examples: 'Popover, Dropdown, Select, Autocomplete' },
      { kind: 'tooltip', meaning: 'Tooltips.', examples: 'Tooltip' },
      { kind: 'toast', meaning: 'Toast notifications — highest layer.', examples: 'Toast' },
    ],
  },
  {
    name: 'A11y',
    axis: 'a11y',
    flavor: 'contract',
    multiValued: false,
    description: <>WAI-ARIA pattern. Optional — absent when no specific pattern applies. The variant carries the role and the required attributes the validation script cross-checks against <Code>anatomy.ariaAttributes</Code>.</>,
    values: [
      { kind: 'dialog', meaning: 'WAI-ARIA Dialog.', fields: [
        { name: 'role', type: "'dialog' | 'alertdialog'", required: true, description: 'ARIA role on the root.' },
        { name: 'requiredAttrs', type: "['aria-modal', 'aria-labelledby']", required: true, description: 'Attributes that must appear in anatomy.' },
      ], examples: 'Dialog, Drawer, Popover, ColorInput, DatePicker' },
      { kind: 'menu', meaning: 'WAI-ARIA Menu.', fields: [
        { name: 'role', type: "'menu'", required: true, description: 'ARIA role on the root.' },
        { name: 'requiredAttrs', type: "['role']", required: true, description: 'Attributes that must appear in anatomy.' },
      ], examples: 'Dropdown' },
      { kind: 'listbox', meaning: 'WAI-ARIA Listbox.', fields: [
        { name: 'role', type: "'listbox'", required: true, description: 'ARIA role on the root.' },
        { name: 'requiredAttrs', type: "['role']", required: true, description: 'Attributes that must appear in anatomy.' },
      ], examples: 'RadioGroup, Select' },
      { kind: 'combobox', meaning: 'WAI-ARIA Combobox.', fields: [
        { name: 'role', type: "'combobox'", required: true, description: 'ARIA role on the root.' },
        { name: 'requiredAttrs', type: "['role', 'aria-expanded']", required: true, description: 'Attributes that must appear in anatomy.' },
      ], examples: 'Autocomplete' },
      { kind: 'tablist', meaning: 'WAI-ARIA Tabs.', fields: [
        { name: 'role', type: "'tablist'", required: true, description: 'ARIA role on the root.' },
        { name: 'requiredAttrs', type: "['role']", required: true, description: 'Attributes that must appear in anatomy.' },
      ], examples: 'Tabs, ToggleGroup, Carousel' },
      { kind: 'tooltip', meaning: 'WAI-ARIA Tooltip.', fields: [
        { name: 'role', type: "'tooltip'", required: true, description: 'ARIA role on the root.' },
        { name: 'requiredAttrs', type: "['role']", required: true, description: 'Attributes that must appear in anatomy.' },
      ], examples: 'Tooltip' },
      { kind: 'disclosure', meaning: 'WAI-ARIA Disclosure.', fields: [
        { name: 'requiredAttrs', type: "['aria-expanded']", required: true, description: 'Attributes that must appear in anatomy.' },
      ], examples: 'Accordion, Collapsible, Sidebar' },
      { kind: 'progressbar', meaning: 'WAI-ARIA Progressbar.', fields: [
        { name: 'role', type: "'progressbar'", required: true, description: 'ARIA role on the root.' },
        { name: 'requiredAttrs', type: "['role', 'aria-valuenow']", required: true, description: 'Attributes that must appear in anatomy.' },
      ], examples: 'ProgressBar' },
    ],
  },
];

function TaxonomyTable({ tax }: { tax: TaxonomyDef }) {
  const hasFields = tax.values.some((v) => v.fields && v.fields.length);
  return (
    <Card.Root id={`taxonomy-${tax.axis}`}>
      <Card.Body>
        <Stack gap="md">
          <Stack direction="row" gap="xs" align="center" wrap>
            <Heading level={3}>{tax.name}</Heading>
            <Code>{tax.axis}</Code>
          </Stack>
          <Text color="muted" size="sm">{tax.description}</Text>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>kind</Table.Head>
            <Table.Head>Meaning</Table.Head>
            {hasFields && <Table.Head>Sub-contract</Table.Head>}
            <Table.Head>Examples</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tax.values.map((v) => (
            <Table.Row key={v.kind}>
              <Table.Cell style={{ width: 1, whiteSpace: 'nowrap' }}>
                <Code>{v.kind}</Code>
              </Table.Cell>
              <Table.Cell><Text size="sm">{v.meaning}</Text></Table.Cell>
              {hasFields && (
                <Table.Cell>
                  {v.fields?.length ? (
                    <Stack gap="sm">
                      {v.fields.map((f) => (
                        <Stack key={f.name} direction="row" gap="xs" align="baseline" wrap>
                          <Code>{f.name}</Code>
                          <InlineCode code={f.type} tintByType />
                          <Badge variant={f.required ? 'soft' : 'outline'}>
                            {f.required ? 'required' : 'optional'}
                          </Badge>
                          {f.description && <Text size="sm" color="muted">{f.description}</Text>}
                        </Stack>
                      ))}
                    </Stack>
                  ) : (
                    <Text size="sm" color="muted">—</Text>
                  )}
                </Table.Cell>
              )}
              <Table.Cell><Text size="sm" color="muted">{v.examples ?? '—'}</Text></Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}

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
            <Badge variant="soft"><Icon name="file-code" />schemaVersion: 1</Badge>
            <Badge variant="soft"><Icon name="shield-check" />Type-checked via tsc</Badge>
            <Badge variant="soft"><Icon name="git-branch" />Tracked by spec-diff</Badge>
            <Badge variant="soft"><Icon name="globe" />Framework-agnostic</Badge>
          </Stack>
        </Stack>

        <Section
          id="why-a-contract"
          title="Why a contract"
          lede="The spec is the load-bearing source of truth. Generators read it. The docs site reads it. spec-diff reads it. AI skills read it."
        >
          <Stack gap="sm">
            <Text>
              Without a pinned contract, anything not explicitly checked can change silently — a renamed field, a flipped boolean, a swapped enum value — and tooling downstream breaks long after the change ships. The <Code>Spec</Code> interface pins every field so the type checker rejects drift at compile time. Cross-references that types can't reach (anatomy slot names, render-contract IDs, A11y required attributes) are caught by a structural validation step.
            </Text>
            <Text>
              <strong>The contract is framework-agnostic.</strong> Today Move's components are implemented in React on top of Radix, but the spec describes a component's surface — slots, props, anatomy, contracts, families — without requiring React. The same spec could drive a Vue, Svelte, or Web Components implementation, and AI skills could generate any of them. The TypeScript file is the most ergonomic format we can validate today; the shape itself isn't React-specific.
            </Text>
          </Stack>
        </Section>

        <Section
          id="whats-in-a-spec"
          title="What's in a spec"
          lede="Every component is described by a single .spec.ts file. The Spec interface is the shape of those files. The rest of this page details each section."
        >
          <Stack gap="sm">
            <Text>
              Below is a complete spec for a Badge — small enough to read end-to-end. Every section in this page (<RouterLink to="#identity">Identity</RouterLink>, <RouterLink to="#lifecycle">Lifecycle</RouterLink>, <RouterLink to="#taxonomies">Taxonomies</RouterLink>, <RouterLink to="#composition">Composition</RouterLink>, …) corresponds to one block of fields you'll see here.
            </Text>
            <CodeBlock code={EXAMPLE_SPEC} language="tsx" />
          </Stack>
        </Section>

        <Section id="naming" title="Naming convention" lede="Three case styles, three domains.">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Case</Table.Head>
                <Table.Head>Used for</Table.Head>
                <Table.Head>Examples</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell><Code>PascalCase</Code></Table.Cell>
                <Table.Cell><Text size="sm">TypeScript type names.</Text></Table.Cell>
                <Table.Cell><Stack direction="row" gap="xs" wrap><Code>Spec</Code><Code>Behavior</Code><Code>ComponentClass</Code><Code>PropDef</Code></Stack></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><Code>camelCase</Code></Table.Cell>
                <Table.Cell><Text size="sm">TypeScript identifiers — field names, prop names.</Text></Table.Cell>
                <Table.Cell><Stack direction="row" gap="xs" wrap><Code>closeOnEscape</Code><Code>valueProp</Code><Code>intervalMs</Code><Code>behaviors</Code></Stack></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell><Code>kebab-case</Code></Table.Cell>
                <Table.Cell><Text size="sm">String-literal values — taxonomy kinds, ARIA attributes, CSS variables, slugs.</Text></Table.Cell>
                <Table.Cell><Stack direction="row" gap="xs" wrap><Code>scale-fade</Code><Code>data-row</Code><Code>aria-modal</Code><Code>--move-fg-base</Code></Stack></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          <Text>
            String-literal values use kebab-case so they travel cleanly across HTML, CSS, ARIA, and URL slugs. TypeScript identifiers stay camelCase / PascalCase per JS convention. Two intentional exceptions: <Code>'onClick'</Code> and <Code>'translateX'</Code> appear camelCase as string values because they reference React prop names and CSS-in-JS transform identifiers respectively.
          </Text>
        </Section>

        <Section
          id="schema-version"
          title="Schema version"
          lede="One number, pinned at the top of every spec."
        >
          <Text>
            Every spec carries <Code>schemaVersion: 1 as const</Code>. A future bump is a breaking schema change and comes with a one-shot migration over all specs in the same commit.
          </Text>
        </Section>

        <Section id="identity" title="Identity" lede="Who the component is.">
          <FieldTable fields={IDENTITY} />
        </Section>

        <Section id="lifecycle" title="Lifecycle" lede="When the component was added, whether it's on the way out, and whether AI tooling is allowed to generate from this spec.">
          <FieldTable fields={LIFECYCLE} />
          <Stack gap="sm">
            <Heading level={3}><Code>defaultReview</Code> — fields</Heading>
            <FieldTable fields={DEFAULT_REVIEW_FIELDS} />
          </Stack>
        </Section>

        <Section
          id="taxonomies"
          title="Taxonomies"
          lede="Six axes that classify a component. Each axis is either contract-carrying (the value carries data the rest of the system reads) or metadata-only (a label for grouping)."
        >
          <FieldTable fields={TAXONOMY_FIELDS} />
          <Stack gap="sm">
            <Text color="muted" size="sm">
              Each contract-carrying taxonomy is a TypeScript discriminated union. The <Code>kind</Code> field is the classification; the rest of the variant is the contract data. Picking a kind in a spec looks like:
            </Text>
            <CodeBlock code={TAXONOMY_VARIANT_SNIPPET} language="ts" />
            <Text color="muted" size="sm">
              <Code>tsc --noEmit</Code> rejects a spec that picks <Code>kind: 'popup-anchored'</Code> without supplying all four close-trigger fields.
            </Text>
          </Stack>
          <Stack gap="xl">
            {TAXONOMIES.map((t) => <TaxonomyTable key={t.name} tax={t} />)}
          </Stack>
        </Section>

        <Section id="composition" title="Composition" lede="How the component is structured — slots, sub-components, anatomy.">
          <FieldTable fields={COMPOSITION} />
          <Stack gap="sm">
            <Heading level={3}>Prop rule</Heading>
            <Text>
              Every prop declares a <Code>role</Code> and falls into one of three variants. The role narrows the variant, so a literal default can never sneak in for a user-facing string.
            </Text>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head style={{ width: 1, whiteSpace: 'nowrap' }}>Role</Table.Head>
                  <Table.Head>What it means</Table.Head>
                  <Table.Head>Optional shape</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell><Code>data</Code></Table.Cell>
                  <Table.Cell><Text size="sm">Affects rendered data (size, variant, mode, count).</Text></Table.Cell>
                  <Table.Cell><Code>default: string</Code></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><Code>behavior</Code></Table.Cell>
                  <Table.Cell><Text size="sm">Affects how the component behaves (disabled, controlled, animations).</Text></Table.Cell>
                  <Table.Cell><Code>default: string</Code></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><Code>composition</Code></Table.Cell>
                  <Table.Cell><Text size="sm">Controls children/structure (children, renderItem).</Text></Table.Cell>
                  <Table.Cell><Code>default: string</Code></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><Code>i18n</Code></Table.Cell>
                  <Table.Cell><Text size="sm">User-facing localizable string (placeholder, button label, format template).</Text></Table.Cell>
                  <Table.Cell><Code>labelKey: string</Code></Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <Text>
              The three variants:
            </Text>
            <Stack gap="xs">
              <Text size="sm">• <Code>PropRequired</Code> — user must supply. No fallback. Any role.</Text>
              <Text size="sm">• <Code>PropOptionalLiteral</Code> — has a hard-coded fallback. Role must be <Code>data</Code>, <Code>behavior</Code>, or <Code>composition</Code>. <Code>default</Code> holds the TS-literal string (<Code>"'md'"</Code>, <Code>'false'</Code>, <Code>'undefined'</Code>).</Text>
              <Text size="sm">• <Code>PropOptionalLabeled</Code> — user-facing string default. Role must be <Code>i18n</Code>. <Code>labelKey</Code> references a row in <Code>labels[]</Code>.</Text>
            </Stack>
            <Text>
              <Code>tsc --noEmit</Code> rejects mixing them: a prop with <Code>role: 'i18n'</Code> can't have a literal <Code>default</Code>, and a prop with <Code>role: 'data'</Code> can't have a <Code>labelKey</Code>. Every user-visible default is forced through <Code>labels[]</Code>.
            </Text>
          </Stack>
        </Section>

        <Section id="interaction" title="Interaction" lede="Keyboard, focus, and form-participation patterns.">
          <FieldTable fields={INTERACTION} />
        </Section>

        <Section id="style-variants" title="Style + variants" lede="Variant axes, size scale, and i18n-able default labels.">
          <FieldTable fields={STYLE} />
        </Section>

        <Section id="animation-tokens" title="Animation + tokens" lede="Motion triggers, themable tokens, and renderer contracts.">
          <FieldTable fields={ANIMATION} />
        </Section>

        <Section id="tests" title="Tests" lede="A spec-side checklist of what's tested.">
          <FieldTable fields={TESTS} />
        </Section>

        <Section id="tooling" title="Tooling" lede="Hooks, engine imports, dependencies.">
          <FieldTable fields={TOOLING} />
        </Section>

        <Section
          id="enforcement"
          title="Enforcement"
          lede="Three layers: TypeScript discriminated unions, structural cross-reference validation, and source-vs-spec drift checks."
        >
          <Stack gap="md">
            <Stack gap="sm">
              <Heading level={3}>1. TypeScript</Heading>
              <Text>
                Each <Code>*.spec.ts</Code> imports <Code>Spec</Code> from <Code>src/contract</Code> and annotates: <Code>export const spec: Spec = {`{...}`}</Code>. Discriminated unions enforce sub-contracts: pick <Code>{`{ kind: 'popup-anchored' }`}</Code> and TypeScript demands <Code>closeOnEscape</Code>, <Code>closeOnOutsideClick</Code>, <Code>closeOnScroll</Code>, <Code>closeOnResize</Code>. Pick <Code>{`{ kind: 'a11y.dialog' }`}</Code> and the role + required ARIA attrs are demanded too.
              </Text>
            </Stack>
            <Stack gap="sm">
              <Heading level={3}>2. Structural validation (`scripts/checks/spec-schema.mjs`)</Heading>
              <Text>
                Catches what types can't:
              </Text>
              <Stack gap="xs">
                <Text size="sm">• Anatomy slots reference declared <Code>slots[]</Code> entries.</Text>
                <Text size="sm">• Render-contract IDs are unique within a spec.</Text>
                <Text size="sm">• Token names follow <Code>--move-{`<component>`}-</Code> convention.</Text>
                <Text size="sm">• <Code>state.valueProp</Code> matches a real prop on the component.</Text>
                <Text size="sm">• <Code>a11y.requiredAttrs</Code> appear in <Code>anatomy.ariaAttributes</Code>.</Text>
                <Text size="sm">• Class-level <Code>requiredSlots</Code> are present in <Code>slots[]</Code>.</Text>
                <Text size="sm">• Every <Code>labelKey</Code> on a <Code>PropOptionalLabeled</Code> exists in <Code>labels[]</Code>.</Text>
                <Text size="sm">• No orphan labels — every <Code>labels[]</Code> entry is referenced by at least one <Code>labelKey</Code> or anatomy attribute.</Text>
                <Text size="sm">• Nested surfaces alternate levels — a <Code>subtle</Code>-surface component nested inside another <Code>subtle</Code> surface is flagged.</Text>
              </Stack>
            </Stack>
            <Stack gap="sm">
              <Heading level={3}>3. Source-vs-spec drift (`check:spec-drift`, `check:family-*`)</Heading>
              <Text>
                Per-family scripts ensure the source code actually implements the contract — e.g. a <Code>modal-overlay</Code> component must call <Code>trapFocus</Code> in its source. <Code>check:spec-drift</Code> ensures the prop list on the component matches the spec.
              </Text>
            </Stack>
          </Stack>
        </Section>

        <Section id="next-steps" title="Next steps">
          <Stack gap="sm">
            <Text>
              Adjacent reading from the same contract:
            </Text>
            <Stack gap="xs">
              <Text size="sm">• <RouterLink to="/core-concepts/surfaces">Surfaces</RouterLink> — the surface elevation system, alternating-tint rule, and per-component table.</Text>
              <Text size="sm">• <RouterLink to="/core-concepts/stacking">Stacking</RouterLink> — z-layer hierarchy, derivation rules, and stacking pitfalls.</Text>
              <Text size="sm">• <RouterLink to="/core-concepts/animation-system">Animation System</RouterLink> — how the <Code>animations[]</Code> field is consumed at runtime.</Text>
              <Text size="sm">• <RouterLink to="/components">Components</RouterLink> — every spec rendered into a doc page.</Text>
            </Stack>
          </Stack>
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
