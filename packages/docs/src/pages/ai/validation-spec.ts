// validation-spec.ts — the single source of truth for what Move validates.
//
// Rules are defined ONCE. Which entity a rule applies to is COMPUTED from traits
// (a rule applies to an entity when the group's `requires` plus the rule's own
// `requires` are all in that entity's traits). A rule's STATUS is per-entity —
// the same law can be an enforced `check` for one entity and a `gap` for another.
// The Coverage and Validation pages are views over this; a meta-check keeps the
// real `check:*` scripts in sync with it.

export type Trait =
  | 'factory'          // built with withMoveComponent (a styled primitive)
  | 'cssModule'        // ships a .module.css
  | 'libraryExport'    // exported from the library's public surface
  | 'spec'             // generated from a typed .spec.ts
  | 'pureComposition'  // only-Move composition, no CSS module / factory
  | 'published'        // documented + discoverable (not private app code)
  | 'registered'       // listed in a registry
  | 'renders'          // produces rendered UI
  | 'logic';           // carries its own logic worth unit-testing

export type EntityKey = 'component' | 'composition' | 'recipe';
// No 'judgment': a rule that needs a human isn't validation, it's guidance —
// those live in the skills, not here. Every matrix rule must be mechanizable.
export type Status = 'check' | 'gap';
export type GroupKind = 'static' | 'test' | 'review';

export interface EntityDef {
  key: EntityKey;
  title: string;
  blurb: string;
  traits: Trait[];
}

export interface GroupDef {
  id: string;
  label: string;
  kind: GroupKind;
  requires: Trait[];
}

export interface RuleDef {
  id: string;            // group-scoped, e.g. 'icons-1'
  group: string;         // GroupDef.id
  rule: string;
  why: string;
  requires?: Trait[];    // EXTRA traits beyond the group's (narrows applicability)
  enforcement: Partial<Record<EntityKey, { status: Status; check?: string }>>;
}

/** An always-on tool that runs over the whole source, beneath the rule-by-rule
 *  coverage. `script` anchors it to a real package.json script so the docs can't
 *  claim a tool the repo doesn't actually run (guarded by check:validation-spec). */
export interface AmbientTool {
  tool: string;
  role: string;
  detail: string;
  script: string;
}

export interface ValidationSpec {
  entities: EntityDef[];
  groups: GroupDef[];
  rules: RuleDef[];
  /** Always-on layer beneath the rules (whole-source, not rule-by-rule). */
  ambient: AmbientTool[];
}

// ── Entities ────────────────────────────────────────────────────────────────

const ENTITIES: EntityDef[] = [
  {
    key: 'component',
    title: 'Component',
    blurb: 'A Move library primitive, generated from a spec.',
    traits: ['factory', 'cssModule', 'libraryExport', 'spec', 'published', 'renders', 'logic'],
  },
  {
    key: 'composition',
    title: 'Composition',
    blurb: 'What you build — composite, page, feature. Private app code, spec-driven.',
    traits: ['spec', 'pureComposition', 'renders', 'logic'],
  },
  {
    key: 'recipe',
    title: 'Recipe',
    blurb: 'A spec-driven guide pattern Move ships.',
    traits: ['spec', 'pureComposition', 'published', 'registered', 'renders', 'logic'],
  },
];

// ── Groups (label + the trait that makes the group apply) ─────────────────────

const GROUPS: GroupDef[] = [
  { id: 'source', label: 'Source & structure', kind: 'static', requires: ['factory'] },
  { id: 'specParity', label: 'Spec parity & defaults', kind: 'static', requires: ['spec'] },
  { id: 'styles', label: 'Styles', kind: 'static', requires: ['cssModule'] },
  { id: 'exports', label: 'Exports', kind: 'static', requires: ['libraryExport'] },
  { id: 'fileLocation', label: 'File location', kind: 'static', requires: ['libraryExport'] },
  { id: 'purity', label: 'Purity & layout', kind: 'static', requires: ['pureComposition'] },
  { id: 'forms', label: 'Forms', kind: 'static', requires: ['pureComposition'] },
  { id: 'icons', label: 'Icons', kind: 'static', requires: ['renders'] },
  { id: 'i18n', label: 'i18n', kind: 'static', requires: ['renders'] },
  { id: 'registry', label: 'Registry', kind: 'static', requires: ['registered'] },
  { id: 'unit', label: 'Unit tests', kind: 'test', requires: ['logic'] },
  { id: 'a11y', label: 'Accessibility tests', kind: 'test', requires: ['renders'] },
  { id: 'behavior', label: 'Behavior & interaction', kind: 'test', requires: ['renders'] },
  { id: 'apiSurface', label: 'Public API surface', kind: 'review', requires: ['libraryExport'] },
  { id: 'docs', label: 'Documentation & discoverability', kind: 'static', requires: ['published'] },
];

// Shorthands for enforcement maps.
const C = (status: Status, check?: string) => ({ component: { status, check } });
const all = (status: Status, check?: string) => ({
  component: { status, check }, composition: { status, check }, recipe: { status, check },
});
const renders3 = all; // applies to every rendered entity

// ── Rules (defined once; status is per-entity) ────────────────────────────────

const RULES: RuleDef[] = [
  // Source & structure (component / factory)
  { id: 'source-1', group: 'source', rule: "'use client' at line 1", why: 'Marks the file as a client component so hooks and state render correctly; a server component would crash on them.', enforcement: C('check', 'component-conformance') },
  { id: 'source-2', group: 'source', rule: 'Props extend HTML attrs, not Record', why: 'Record accepts any prop and any value, so typos and wrong types pass silently; the real attrs let the compiler reject them.', enforcement: C('check', 'strict-props') },
  { id: 'source-3', group: 'source', rule: 'Move-specific props in moveProps/defaults', why: 'Props the factory consumes must be declared, or they leak onto the DOM as invalid attributes.', enforcement: C('gap') },
  { id: 'source-4', group: 'source', rule: 'Default values in the defaults object', why: 'The factory reads defaults from one place; inline defaults in destructuring bypass it and drift from the spec.', enforcement: C('check', 'factory-conformance') },
  { id: 'source-5', group: 'source', rule: 'slots array matches sp()/cx() calls', why: 'The slot list drives styling; a slot used but not declared (or vice-versa) means a part can’t be themed.', enforcement: C('check', 'factory-conformance') },
  { id: 'source-6', group: 'source', rule: 'cx() for every slotted className', why: 'cx() merges the slot class with the consumer’s className; a raw class drops the consumer’s styling for that part.', enforcement: C('check', 'factory-conformance') },
  { id: 'source-7', group: 'source', rule: 'Every slot is slotProps-themeable', why: 'Each slotted element must pull its slot props in — via slot() or sp(); miss it and any className/style/attr a consumer passes for that part is silently dropped.', enforcement: C('check', 'factory-conformance') },
  { id: 'source-8', group: 'source', rule: 'attrs + spRest spread on root', why: 'These carry the consumer’s id/aria-*/data-* and the slot’s styles onto the real element; without them those props vanish.', enforcement: C('gap') },
  { id: 'source-9', group: 'source', rule: 'ref forwarded to root', why: 'Focus, measurement, and portals need a handle on the real DOM node; a dropped ref breaks all three.', enforcement: C('check', 'factory-conformance') },
  { id: 'source-10', group: 'source', rule: 'data-variant/size/state used', why: 'CSS targets these attributes for variant styling; missing them means the variant prop has no visual effect.', enforcement: C('gap') },
  { id: 'source-11', group: 'source', rule: 'Imports use engine/, not ../core', why: 'Deep imports bypass the stable barrel and break when internals move.', enforcement: C('check', 'component-conformance') },
  { id: 'source-12', group: 'source', rule: 'No Move-internal props leak to the DOM', why: 'Undeclared internal props become invalid HTML attributes and React warnings.', enforcement: C('gap') },
  { id: 'source-13', group: 'source', rule: 'Dismissable lifecycle uses the shared hook', why: 'useDismissable owns non-hanging exit and re-open; a hand-rolled isClosing state leaks or locks the close animation.', enforcement: C('check', 'dismissable-lifecycle') },

  // Spec parity & defaults
  { id: 'specParity-1', group: 'specParity', rule: 'Animation defaults match spec triggers', why: 'The spec is the contract; if the wired animation drifts from it the documented behaviour is a lie.', requires: ['factory'], enforcement: C('check', 'spec-drift') },
  { id: 'specParity-2', group: 'specParity', rule: 'Behavior contracts preserved (controlled, dismiss)', why: 'controlledProps/dismissBehavior are easy to drop in a rewrite; the check keeps source honest to the declared behaviour.', requires: ['factory'], enforcement: C('check', 'spec-drift') },
  { id: 'specParity-3', group: 'specParity', rule: 'Prop parity — none silently dropped', why: 'A spec prop missing from the source shrinks the public API without anyone noticing.', requires: ['factory'], enforcement: C('check', 'spec-drift') },
  { id: 'specParity-4', group: 'specParity', rule: 'Runtime defaults match spec defaults', why: 'If the code defaults differ from the approved spec defaults, the component behaves unlike its documentation.', requires: ['factory'], enforcement: C('check', 'spec-drift') },
  { id: 'specParity-5', group: 'specParity', rule: 'Composition parity — imports match spec.composition', why: 'A recipe/composition must use exactly the components its spec declares, so the allow-list stays meaningful.', requires: ['pureComposition'], enforcement: { recipe: { status: 'check', check: 'recipe-spec-drift' }, composition: { status: 'gap' } } },
  { id: 'specParity-6', group: 'specParity', rule: 'Labels parity — defaults match spec.labels', why: 'Mismatched label keys mean a string is either unreachable or untranslatable.', requires: ['pureComposition'], enforcement: { recipe: { status: 'check', check: 'recipe-spec-drift' }, composition: { status: 'gap' } } },
  { id: 'specParity-7', group: 'specParity', rule: 'Integration points resolve', why: 'Each declared integration point must name a contract the consumer can import and a fixture/sample the docs can render — a dangling reference is a broken integration.', requires: ['factory'], enforcement: C('check', 'integration-points') },

  // Styles (component / cssModule)
  { id: 'styles-1', group: 'styles', rule: 'A matching .{slot} class for every slot', why: 'A slot with no class can’t be styled; a class with no slot is dead CSS.', enforcement: C('gap') },
  { id: 'styles-2', group: 'styles', rule: 'Design tokens — no hard-coded values', why: 'Hard-coded colours/spacing escape the theme and break dark mode and rebranding.', enforcement: C('check', 'css-tokens') },
  { id: 'styles-3', group: 'styles', rule: 'Component tokens on .root, not :root', why: ':root leaks the token globally; on .root it’s scoped to the component.', enforcement: C('check', 'component-conformance') },
  { id: 'styles-4', group: 'styles', rule: 'Data-attribute selectors for variant/size/state', why: 'Keeps variant styling declarative and in CSS instead of branching in JS.', enforcement: C('gap') },
  { id: 'styles-5', group: 'styles', rule: 'CSS var naming --move-{component}-{property}', why: 'Predictable names are how consumers override a component’s tokens.', enforcement: C('gap') },
  { id: 'styles-6', group: 'styles', rule: 'No @keyframes for state/entrance/exit', why: 'Those run through useAnimations; raw @keyframes bypass the animation system and the reduced-motion bypass.', enforcement: C('check', 'animation-capabilities') },
  { id: 'styles-7', group: 'styles', rule: 'All var(--move-*) references resolve', why: 'A typo’d token silently falls back to nothing — invisible borders, zero spacing.', enforcement: C('check', 'css-tokens') },
  { id: 'styles-8', group: 'styles', rule: 'Spec token values match the CSS', why: 'The spec declares each token’s value; if the CSS differs, the documented token table is wrong.', enforcement: C('check', 'spec-tokens') },

  // Exports (component / libraryExport)
  { id: 'exports-1', group: 'exports', rule: 'index.ts exports the component + all types', why: 'A missing type export forces consumers to re-derive props or use any.', enforcement: C('gap') },
  { id: 'exports-2', group: 'exports', rule: 'Component added to src/index.ts', why: 'Not in the barrel = not importable at all.', enforcement: C('check', 'component-conformance') },
  { id: 'exports-3', group: 'exports', rule: 'Headless hook exported, if one exists', why: 'The hook is the headless API; unexported, it can’t be used.', enforcement: C('check', 'component-conformance') },

  // File location (component / libraryExport)
  { id: 'fileLocation-1', group: 'fileLocation', rule: 'Component in a valid category folder', why: 'Category placement drives docs grouping and the registry.', enforcement: C('gap') },
  { id: 'fileLocation-2', group: 'fileLocation', rule: 'src/index.ts path matches the location', why: 'A stale barrel path breaks the import after a move.', enforcement: C('gap') },

  // Purity & layout (composition + recipe / pureComposition)
  { id: 'purity-1', group: 'purity', rule: 'Only Move components; no raw HTML layout', why: 'Raw divs skip the tokens, a11y, and responsive behaviour Move components carry.', enforcement: { composition: { status: 'check', check: 'purity' }, recipe: { status: 'check', check: 'purity' } } },
  { id: 'purity-2', group: 'purity', rule: 'No inline styles or custom CSS', why: 'Inline styles and custom CSS escape the token system and drift from the design language.', enforcement: { composition: { status: 'check', check: 'purity' }, recipe: { status: 'check', check: 'purity' } } },
  { id: 'purity-3', group: 'purity', rule: 'Spacing via gap/align/justify props', why: 'Layout props keep spacing on the token scale instead of magic pixel values.', enforcement: { composition: { status: 'gap' }, recipe: { status: 'gap' } } },
  { id: 'purity-4', group: 'purity', rule: 'Responsive via collapseBelow, not media queries', why: 'The built-in responsive props already encode the breakpoints; a media query re-invents them inconsistently.', enforcement: { composition: { status: 'check', check: 'purity' }, recipe: { status: 'check', check: 'purity' } } },
  { id: 'purity-5', group: 'purity', rule: 'Triggers wrap Button with asChild', why: 'asChild keeps one real button (a11y + styling) instead of a button inside a button.', enforcement: { composition: { status: 'gap' }, recipe: { status: 'gap' } } },

  // Forms (composition + recipe / pureComposition)
  { id: 'forms-1', group: 'forms', rule: 'Wrap every input in FormField', why: 'FormField wires the label, description, and error to the input for a11y; a bare input loses all three.', enforcement: { composition: { status: 'gap' }, recipe: { status: 'gap' } } },
  { id: 'forms-2', group: 'forms', rule: 'FormField.Description for hints and errors', why: 'Routes hints/errors through the wired description node so screen readers announce them.', enforcement: { composition: { status: 'gap' }, recipe: { status: 'gap' } } },
  { id: 'forms-3', group: 'forms', rule: 'Boolean DOM attrs via value || undefined', why: 'invalid="false" still sets the attribute; `|| undefined` removes it when off.', enforcement: { composition: { status: 'gap' }, recipe: { status: 'gap' } } },

  // Icons (all rendered)
  { id: 'icons-1', group: 'icons', rule: 'Icons via the resolver, no inline svg / glyph', why: 'The resolver lets a consumer swap the whole icon set; an inline svg or unicode glyph is frozen and unstyled.', enforcement: { component: { status: 'check', check: 'component-conformance' }, composition: { status: 'gap' }, recipe: { status: 'gap' } } },
  { id: 'icons-2', group: 'icons', rule: 'Icon usage recorded in spec.iconsUsed', why: 'The /customize/icons table derives from it; drift means the docs lie about what to provide.', requires: ['factory'], enforcement: C('check', 'icon-usage') },
  { id: 'icons-3', group: 'icons', rule: 'Every control that needs an icon has a built-in fallback', why: 'A core control whose icon isn’t in builtinIcons renders blank when the consumer’s set lacks it; checkable against the icons the source declares it uses.', requires: ['factory'], enforcement: C('check', 'icon-usage') },

  // i18n (all rendered)
  { id: 'i18n-1', group: 'i18n', rule: 'User-facing strings via one labels object', why: 'A single labels object is the seam consumers translate through; a hardcoded string can’t be reached.', enforcement: { component: { status: 'check', check: 'component-conformance' }, composition: { status: 'gap' }, recipe: { status: 'gap' } } },

  // Registry (recipe / registered)
  { id: 'registry-1', group: 'registry', rule: 'Registered once, no duplicate slug', why: 'A duplicate slug collides the route and the overview card.', enforcement: { recipe: { status: 'check', check: 'recipe-spec-drift' } } },
  { id: 'registry-2', group: 'registry', rule: 'Registry entry fields match the spec', why: 'The card/title/synonyms come from the registry; drift from the spec mislabels it.', enforcement: { recipe: { status: 'gap' } } },

  // Unit tests (all with logic)
  { id: 'unit-1', group: 'unit', rule: 'Test file exists', why: 'No test file = the logic is unverified by construction.', enforcement: { component: { status: 'check', check: 'component-conformance' }, composition: { status: 'gap' }, recipe: { status: 'gap' } } },

  // Accessibility tests (all rendered)
  { id: 'a11y-1', group: 'a11y', rule: 'No axe violations (roles, names, ARIA)', why: 'Catches the mechanical a11y errors — missing names, bad roles, broken ARIA — that the eye misses.', enforcement: renders3('gap') },
  { id: 'a11y-2', group: 'a11y', rule: 'Keyboard-operable; focus visible and ordered', why: 'Keyboard-only and screen-reader users can’t use what they can’t reach or see focused.', enforcement: renders3('gap') },
  { id: 'a11y-3', group: 'a11y', rule: 'Text/UI contrast meets WCAG AA', why: 'Low contrast fails AA and is unreadable for low-vision users.', enforcement: renders3('gap') },
  { id: 'a11y-4', group: 'a11y', rule: 'No aria-label over visible children (Label-in-Name)', why: 'A control that sets aria-label while rendering its children gives screen-reader/voice users a different name than sighted users see (WCAG 2.5.3).', enforcement: C('check', 'aria-label-name') },

  // Behavior & interaction (all rendered)
  { id: 'behavior-1', group: 'behavior', rule: 'Implements the declared keyboard pattern', why: 'The spec declares the pattern (roving, linear, typeahead); the component must actually wire those keys.', enforcement: renders3('gap') },
  { id: 'behavior-2', group: 'behavior', rule: 'Focus management matches the declared strategy', why: 'Trap/restore/roving from the spec must hold, or overlays leak focus and lose the return point.', enforcement: renders3('gap') },
  { id: 'behavior-3', group: 'behavior', rule: 'Works controlled and uncontrolled', why: 'The spec declares a controlled triad; both modes must work or half the API is broken.', enforcement: renders3('gap') },

  // Public API surface (component / libraryExport)
  { id: 'apiSurface-1', group: 'apiSurface', rule: 'No unintended public-API change', why: 'A removed/renamed prop or changed type is a breaking change; the diff must be intentional and reviewed.', enforcement: C('gap') },

  // Documentation & discoverability (component + recipe / published)
  { id: 'docs-1', group: 'docs', rule: 'Has a doc page with live samples', why: 'An undocumented published artifact is effectively invisible to consumers.', enforcement: { component: { status: 'check', check: 'doc-coverage' }, recipe: { status: 'check', check: 'doc-coverage' } } },
  { id: 'docs-2', group: 'docs', rule: 'Searchable via synonyms', why: 'Synonyms are how people find it under the name they already use.', enforcement: { component: { status: 'check', check: 'doc-synonyms' }, recipe: { status: 'check', check: 'doc-synonyms' } } },
];

export const VALIDATION: ValidationSpec = {
  entities: ENTITIES,
  groups: GROUPS,
  rules: RULES,
  ambient: [
    {
      tool: 'tsc',
      role: 'typecheck',
      detail: 'Strict TypeScript over all source — every prop, spec, and adapter contract is type-checked; nothing ships with an unresolved type.',
      script: 'typecheck',
    },
    {
      tool: 'eslint',
      role: 'lint',
      detail: 'Recommended JS/TS + react-hooks rules, plus per-function complexity, max-depth, and max-lines-per-function signals — targeting tangled functions, not raw file size. Warnings today while thresholds settle.',
      script: 'lint',
    },
    {
      tool: 'prettier',
      role: 'format',
      detail: 'One source of formatting truth, so generated and hand-written code are byte-identical in style. Run with format; format:check gates it.',
      script: 'format:check',
    },
    {
      tool: 'vitest',
      role: 'tests',
      detail: 'Unit and behaviour tests across the whole library, including every component and adapter contract.',
      script: 'test',
    },
  ],
};

// ── Derivations (membership computed from traits) ─────────────────────────────

const hasAll = (traits: Trait[], required: Trait[]) => required.every((t) => traits.includes(t));

/** Groups (with their applicable rules + this entity's status) for one entity. */
export function groupsForEntity(entity: EntityDef) {
  return VALIDATION.groups
    .filter((g) => hasAll(entity.traits, g.requires))
    .map((g) => {
      const rules = VALIDATION.rules
        .filter((r) => r.group === g.id)
        .filter((r) => hasAll(entity.traits, [...g.requires, ...(r.requires ?? [])]))
        .filter((r) => r.enforcement[entity.key])
        .map((r) => ({ id: r.id, rule: r.rule, why: r.why, ...r.enforcement[entity.key]! }));
      return { group: g, rules };
    })
    .filter((g) => g.rules.length > 0);
}

export function tallyFor(entity: EntityDef) {
  const counts: Record<Status, number> = { check: 0, gap: 0 };
  for (const g of groupsForEntity(entity)) for (const r of g.rules) counts[r.status]++;
  return counts;
}

/** An entity by key. */
export function entityByKey(key: EntityKey) {
  return VALIDATION.entities.find((e) => e.key === key)!;
}

/** One rule's resolved status for an entity, or null if the rule doesn't apply to
 *  it (so a recipe-only rule renders as "—" in the Composition column). */
export function statusFor(ruleId: string, entity: EntityDef): { status: Status; check?: string } | null {
  const r = VALIDATION.rules.find((x) => x.id === ruleId);
  if (!r) return null;
  const g = VALIDATION.groups.find((x) => x.id === r.group);
  if (!g || !hasAll(entity.traits, [...g.requires, ...(r.requires ?? [])])) return null;
  return r.enforcement[entity.key] ?? null;
}

/** Composition gaps that recipe already enforces — i.e. a check proven on Move's
 *  recipes that just needs to ship via `move check` to cover your compositions. */
export function shipBacklog(): number {
  const composition = entityByKey('composition');
  let n = 0;
  for (const { rules } of groupsForEntity(entityByKey('recipe'))) {
    for (const r of rules) {
      if (r.status === 'check' && statusFor(r.id, composition)?.status === 'gap') n++;
    }
  }
  return n;
}
