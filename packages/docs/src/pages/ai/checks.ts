// The catalog of Move's deterministic checks, rendered by ConformancePage.
//
// SINGLE SOURCE OF TRUTH for the docs — kept honest by `check:conformance-docs`
// (packages/move/scripts/checks/conformance-docs.mjs): every `check:*` script in
// packages/move/package.json must appear here as a `name`, and vice versa. Add a
// check → document it here, or the build fails.
//
// Two axes:
//   appliesTo — what it governs: a component, a composite, a design pattern, or the docs.
//   shipped   — runnable on a consumer's own project via `move check`.
//
// `name` is the `check:<name>` script (the sync key); `title` is an optional
// friendlier display label.

export type CheckTarget = 'component' | 'composition' | 'design-pattern' | 'docs';

export interface CheckDoc {
  /** The `check:<name>` script — the sync key against package.json. */
  name: string;
  /** Display label, when it should differ from the script name. */
  title?: string;
  /** What the check governs. */
  appliesTo: CheckTarget;
  /** Runnable on a consumer project via `move check`. */
  shipped?: boolean;
  enforces: string;
}

export const CHECKS: CheckDoc[] = [
  // ── Shipped: run on your own project via `move check` (no spec needed) ──
  {
    name: 'purity',
    appliesTo: 'composition',
    shipped: true,
    enforces:
      'Composed code is built only from Move components — no raw HTML layout (an inline `<svg>` included), no inline `style`, no custom CSS. Move runs it on its own composites; you run it on your app.',
  },
  {
    name: 'strict-props',
    appliesTo: 'component',
    shipped: true,
    enforces:
      'Component prop interfaces are strictly typed — no `extends Record<string, unknown>` — so unknown or wrong-typed props fail the compiler.',
  },

  // ── Move-internal: read specs / CSS modules / family rules, so they only
  //    apply to Move's own source (`check:all`, not shipped) ──
  {
    name: 'i18n-literals',
    appliesTo: 'component',
    enforces:
      'No user-facing string is baked into a component. A hardcoded aria-label was already refused; this closes the other half \u2014 VISIBLE text like <span>Time</span>, which no consumer can translate.',
  },
  {
    name: 'escape-hatch',
    appliesTo: 'component',
    enforces:
      'A check that FORBIDS something declares an @instead \u2014 the sanctioned way to do the thing it refuses. A rule with no exit is a wall, not a design: purity forbids inline styles and three consumer teams each built their own Frame because no legal way to set a width exists.',
  },
  {
    name: 'api-compound-shape',
    appliesTo: 'component',
    enforces:
      'The generated API documents JSX that compiles. A component exporting a bare object ({ Root, \u2026 }) is entered through .Root, so llms.txt must not give it a flat prop block or a flat example \u2014 27 components had both.',
  },
  {
    name: 'palette-tokens',
    appliesTo: 'component',
    enforces:
      'Component CSS reaches for a ROLE token, never a named palette. A palette reference is allowed only where the selector names that same colour (a categorical [data-color] rule); anywhere else it pins one hue and ignores the theme \u2014 the same bug as a hardcoded hex, wearing a token.',
  },
  {
    name: 'skill-refs',
    appliesTo: 'component',
    enforces:
      'Every repo file a skill tells an agent to read exists. Skills are the primary agent interface and are prose \u2014 nothing type-checks them, so deleting a file they name breaks them silently.',
  },
  {
    name: 'dist-packaging',
    appliesTo: 'component',
    enforces:
      'The published artifact, not the source: no dev-mode JSX (jsxDEV) in the bundle, no second copy of React inside the package, and React reached only by bare specifier so it resolves to the consumer\u2019s copy. Runs in pack, between build and npm pack; skips with a notice when no dist is present.',
  },
  {
    name: 'spec-drift',
    appliesTo: 'component',
    enforces:
      'Spec ↔ source stay in sync per component — the slots, props, and defaults a spec declares match the component, and its docs entry resolves to the same component. (Distinct from doc-spec-drift, which guards the contract pages against the spec type.)',
  },
  {
    name: 'composite-spec-drift',
    appliesTo: 'composition',
    shipped: true,
    enforces:
      'A composite’s imports, labels, and test match its CompositeSpec, and no user-facing string bypasses the labels object (substance ↔ source). Move proves it on its own composites; you run it on yours via `move check`.',
  },
  {
    name: 'component-conformance',
    appliesTo: 'component',
    enforces:
      'Source obeys the grep-able spec rules — internal icons via `<Icon>` (no inline `<svg>`), and every user-facing string through one `labels` object.',
  },
  {
    name: 'css-tokens',
    appliesTo: 'component',
    enforces:
      'Every `var(--move-*)` reference without a fallback resolves to a real token — a typo’d or undefined token (which silently does nothing) fails.',
  },
  {
    name: 'css-hardcoded',
    appliesTo: 'component',
    enforces:
      'Colours come from `--move-*` tokens — no raw hex/rgb/hsl in component CSS. Colour tools and media overlays are file-exempt via `token-exempt-file`.',
  },
  {
    name: 'prop-precedence',
    appliesTo: 'component',
    enforces:
      "An attribute set after a `{...attrs}` spread replaces what the caller passed, and a conditional one resolving to `undefined` deletes it — leaving the element with no accessible name. Naming props (`aria-label`, `aria-labelledby`, `aria-describedby`, `aria-valuetext`, `title`, `alt`) must precede the spread or read the caller's value back, because a component can only supply a default. Structural props stay after it: `role`, `type` and `aria-expanded` ARE the component. DOM handlers are composed rather than replaced, via `composeHandlers`, so the caller's runs alongside the component's. Reading the caller's value back is equally legal, so the check parses rather than greps. Escape: a justified `precedence-exempt` comment.",
  },
  {
    name: 'css-transitions',
    appliesTo: 'component',
    enforces:
      'CSS transitions animate colour, never motion. anime.js writes inline styles, so a transition and an animation are one language at two cascade levels — a transition cannot compose with a spring, and on the same property they overwrite each other. Colour is safe because nothing in `useAnimations` writes it. Setting `opacity` or `transform` flatly is a state and stays allowed; it is transitioning them that is motion. Escapes: inside `prefers-reduced-motion`, or a justified `transition-exempt` comment.',
  },
  {
    name: 'control-size',
    appliesTo: 'component',
    enforces:
      'Interactive controls size from the shared --move-control-height-* scale — no forked raw width/height in the 24–48px control band.',
  },
  {
    name: 'css-important',
    appliesTo: 'component',
    enforces:
      'No !important in component CSS. It outranks the consumer too — a token, an sp slot-prop style or an app class cannot override it without escalating in turn. To outrank a component you compose, put that component’s styles in the @layer move.base cascade layer; unlayered rules beat layered ones at any specificity, and the consumer stays unlayered and on top.',
  },
  {
    name: 'internal-slot-props',
    appliesTo: 'component',
    enforces:
      'No sp={{…}} between Move’s own components. Slot props are the consumer’s escape hatch; used internally they compete with the consumer for the same channel and hide a missing token. Restyle through the composed component’s tokens and take a plain className on the element you render.',
  },
  {
    name: 'internal-slot-props',
    appliesTo: 'component',
    enforces:
      'No sp={{…}} between Move’s own components. Slot props are the consumer’s escape hatch; used internally they compete with the consumer for the same channel and hide a missing token. Restyle through the composed component’s tokens and take a plain className on the element you render.',
  },
  {
    name: 'barrel-completeness',
    appliesTo: 'component',
    enforces:
      'Every component and its public types are re-exported from the package’s single public entry, so consumers can import them.',
  },
  {
    name: 'doc-spec-drift',
    appliesTo: 'docs',
    enforces:
      'Hand-written contract docs stay in sync with the real spec types — a doc can’t describe a field the spec no longer has.',
  },
  {
    name: 'spec-tokens',
    appliesTo: 'component',
    enforces: 'The token values a spec declares match the component’s CSS (spec ↔ CSS parity).',
  },
  {
    name: 'icon-usage',
    appliesTo: 'component',
    enforces:
      'A component’s `spec.iconsUsed` matches the icons its source actually renders, so the icon docs can’t drift.',
  },
  {
    name: 'animation-capabilities',
    appliesTo: 'component',
    enforces:
      'Any imperative (Tier-2) animation is declared in `spec.animationCapabilities` — no ad-hoc imperative animation.',
  },
  {
    name: 'animation-choreography',
    appliesTo: 'component',
    enforces:
      'A component’s declared `choreographies` stay consistent with the animation it actually uses.',
  },
  {
    name: 'dismissable-lifecycle',
    appliesTo: 'component',
    enforces:
      'Dismissable components honour the Presence exit/unmount contract, so a closing animation can’t lock the lifecycle.',
  },
  {
    name: 'controlled-modes',
    appliesTo: 'component',
    enforces:
      'A component declaring a controlled triad has tests for both modes — the consumer owning the value, and the component owning it.',
  },
  {
    name: 'theme-contrast',
    appliesTo: 'docs',
    enforces:
      'Every colour pair in the shipped light + dark themes meets WCAG 2.2 AA once resolved — proving the defineTheme clamp holds end to end, not just for the tokens it computes.',
  },
  {
    name: 'api-surface',
    appliesTo: 'component',
    enforces:
      'The generated API surface (move.api.json + llms.txt) matches the specs — so any prop added, removed, or retyped lands as a reviewed diff, never a silent drift.',
  },
  {
    name: 'tokens-surface',
    appliesTo: 'component',
    enforces:
      'The generated primitive colour CSS matches its source (src/styles/themes/palette.ts) — the ramps live in TS so the engine and the Theme Builder read the same numbers, and this proves the shipped CSS hasn’t drifted from them.',
  },
  {
    name: 'wcag-evidence',
    appliesTo: 'docs',
    enforces:
      'Every check a WCAG criterion cites as its evidence is a real, running gate — so an accessibility claim can’t rest on a check that was only ever described.',
  },
  {
    name: 'skill-a11y-drift',
    appliesTo: 'docs',
    enforces:
      'The app-wcag-audit skill’s list of what Move already handles is generated from the WCAG criteria — so the guidance shipped to consumers can’t drift from what the library actually does.',
  },
  {
    name: 'family-popup',
    appliesTo: 'component',
    enforces: 'Popup-family components (Tooltip, Dropdown, …) share one contract — props, ARIA, and animation.',
  },
  {
    name: 'field-naming',
    appliesTo: 'component',
    enforces:
      'Every form control is actually named by its FormField.Label, through the mechanism that fits what it is built from: a `for` pointing at its one labelable element, or aria-labelledby from the element carrying its widget role. Renders each control to check, because the wrong mechanism produces markup that reads as wired and names nothing — and axe only flags a control with no name at all.',
  },
  {
    name: 'keyboard-entry',
    appliesTo: 'component',
    enforces:
      'Every popup component is reachable by keyboard: the gate presses the keys its spec declares and asserts focus lands where the spec says — inside the popup, or on the field for a combobox. Behavioural, not structural: axe cannot press a key.',
  },
  {
    name: 'family-modal',
    appliesTo: 'component',
    enforces: 'Modal-overlay-family components (Dialog, Drawer, …) share one contract.',
  },
  {
    name: 'family-disclosure',
    appliesTo: 'component',
    enforces: 'Disclosure-family components (Accordion, Collapsible, …) share one contract.',
  },
  {
    name: 'cross-component-drift',
    appliesTo: 'component',
    enforces: 'Patterns shared across components — sizes, variants, token usage — stay consistent.',
  },
  {
    name: 'conformance-docs',
    appliesTo: 'docs',
    enforces: 'This page lists exactly the `check:*` scripts that exist — add a check, document it here, or the build fails.',
  },
  {
    name: 'conformance-spec',
    appliesTo: 'docs',
    enforces: 'The coverage spec stays in sync with the checks — every rule references a real `check:*`, and every enforced check is reflected as a rule or a known structural check.',
  },
  {
    name: 'rule-coverage',
    appliesTo: 'docs',
    enforces:
      'Every check declares the coverage rules it enforces (an `@enforces` header — file → rule), and that declaration matches the spec exactly: a check can’t enforce a rule it doesn’t declare, or declare one the spec doesn’t attribute to it.',
  },
  {
    name: 'factory-conformance',
    appliesTo: 'component',
    enforces: 'The factory shape holds — a component’s declared slots are exactly the slots its sp()/cx() calls use (AST, not grep).',
  },
  {
    name: 'script-refs',
    appliesTo: 'docs',
    enforces: 'Every `npm run` a git hook or CI workflow invokes resolves to a real package script — so renaming a script can’t silently break a gate.',
  },
  {
    name: 'aria-label-name',
    appliesTo: 'component',
    enforces: 'No native button/link sets aria-label while rendering its children — visible text and accessible name must not diverge (WCAG 2.5.3 Label-in-Name).',
  },
  {
    name: 'combobox-name',
    appliesTo: 'component',
    enforces: 'Every `<Select.Trigger>` composed inside another component carries an aria-label/aria-labelledby — role="combobox" forbids name-from-content, so the visible text inside gives no accessible name (WCAG 4.1.2 Name, Role, Value).',
  },
  {
    name: 'integration-points',
    appliesTo: 'component',
    enforces: "Every spec integration point resolves — its contract is exported from the public barrel and any fixture/sample exists, so the docs Integrations panel can't dangle.",
  },
  {
    name: 'design-pattern-conformance',
    appliesTo: 'design-pattern',
    enforces:
      'Each DesignPatternSpec is well-formed (integrity) and complete (coverage): its skeleton is a single-rooted tree, every axis is owned by exactly one slot, every binding and heuristic resolves to a real slot/axis/value, and every axis value has a slot binding. The pattern-level counterpart of the component (spec-drift) and composite (composite-spec-drift) spec checks.',
  },
  {
    name: 'component-document-drift',
    appliesTo: 'component',
    enforces: 'Every component’s ComponentDocument (its content folder) is in sync — ≥1 search synonym and a doc page with live samples — so nothing ships undocumented or unfindable.',
  },
  {
    name: 'data-attrs',
    appliesTo: 'component',
    enforces: 'When CSS styles by variant/size via [data-variant]/[data-size] selectors, the source actually sets that attribute — so the variant/size prop has a visual effect (source-10).',
  },
  {
    name: 'move-props',
    appliesTo: 'component',
    enforces: "Every spec prop marked moveSpecific is in its factory's moveProps/defaults, so the factory strips it instead of leaking it onto the DOM as an invalid attribute (source-3).",
  },
];
