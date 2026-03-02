/**
 * Animation Map
 *
 * 1:1 mapping between animation trigger types and hooks.
 * Each trigger type has exactly one hook that implements it.
 * Components compose triggers via TypeScript intersection on the `animate` prop.
 *
 * Actual runtime fallback values live in `defaultAnimations` (src/animation/types.ts).
 * This file describes wiring + canonical named default profiles used by specs.
 *
 * Precedence (highest to lowest):
 * 1) spec.animations[].defaultConfig (explicit component-level config)
 * 2) spec.animations[].defaultProfile (named profile from DEFAULT_PROFILES)
 * 3) spec.animations[].defaultPreset (legacy key in defaultAnimations)
 * 4) class fallback
 */

// =============================================================================
// Animation type taxonomy
//
// Core triggers — atomic types, each with a 1:1 hook:
//   LifecycleAnimate    → { enter?, exit? }           mount/unmount
//   InteractionAnimate  → { hover?, press? }           user hover/press
//   ToggleAnimate       → { checked?, unchecked? }     binary state flip
//   ExpandAnimate       → { open?, close? }            content reveal/hide
//   ValueAnimate        → { value? }                   continuous value change
//   LoopAnimate         → { loop? }                    continuous ambient
//
// Modifiers — mix into any trigger type:
//   StaggerModifier     → { stagger?: StaggerConfig }  sequenced children
//   DelayModifier       → { delay?: number }           animation delay
//
// Components intersect triggers directly on the animate prop:
//   Button:    animate?: LifecycleAnimate & InteractionAnimate
//   Checkbox:  animate?: LifecycleAnimate & InteractionAnimate & ToggleAnimate
//   Accordion: animate?: LifecycleAnimate & ExpandAnimate & StaggerModifier
//   Alert:     animate?: LifecycleAnimate
//   Dropdown:  animate?: LifecycleAnimate & StaggerModifier
//   Dialog:    animate?: LifecycleAnimate
//   Loader:    animate?: LoopAnimate
// =============================================================================

// =============================================================================
// Hook registry — one hook per trigger type
// =============================================================================

export interface HookDefinition {
  /** The trigger type this hook implements */
  trigger: string;
  /** What the hook returns */
  returns: string;
  /** Which slot(s) the animation targets */
  targetSlots: string[];
  /** Whether Presence component is needed for mount/unmount coordination */
  needsPresence: boolean;
  /** How to wire the hook into a component */
  wiring: string[];
}

export const HOOK_REGISTRY: Record<string, HookDefinition> = {
  useLifecycleAnimate: {
    trigger: 'LifecycleAnimate',
    returns: '{ contentRef, overlayRef, innerRef }',
    targetSlots: ['root', 'content'],
    needsPresence: false,
    wiring: [
      'contentRef → primary animated element (content panel, alert, popup).',
      'overlayRef → secondary animated element (dialog backdrop). Auto-uses layerBackdrop preset when provided.',
      'innerRef → inner container for stagger children.',
      'Driven by options: isClosing triggers exit, onCloseComplete/onOpenComplete callbacks.',
      'animateHeight option for popup pattern (measure + animate height from 0).',
      'stagger option: { selector, config } for sequenced children enter/exit.',
      'Supports: single target (Alert), dual target (Dialog: content + overlay), stagger (Dropdown).',
      'Respects prefersReducedMotion.',
    ],
  },

  useInteractionAnimate: {
    trigger: 'InteractionAnimate',
    returns: '{ ref, isPresent, trigger, getAnimation, handlers }',
    targetSlots: ['root'],
    needsPresence: false,
    wiring: [
      'Merge hook ref with factory ref via useMergedRef.',
      'handlers: { onMouseEnter, onMouseLeave, onMouseDown, onMouseUp, onKeyDown, onKeyUp }.',
      'Merge each handler — call hook handler first, then user callback.',
      'trigger(state) fires a specific animation state (hover/press/enter/exit).',
      'Also handles enter/exit lifecycle when used inside Presence.',
      'When animate === false, pass { hover: false, press: false } to disable.',
    ],
  },

  useToggleAnimate: {
    trigger: 'ToggleAnimate',
    returns: '{ rootRef, indicatorRef, animateChecked, animateUnchecked, pressHandlers }',
    targetSlots: ['root', 'indicator'],
    needsPresence: false,
    wiring: [
      'rootRef → root element for press animation.',
      'indicatorRef → indicator slot element for checked/unchecked animation.',
      'animateChecked() / animateUnchecked() — trigger state animations.',
      'pressHandlers: { onMouseDown, onMouseUp, onMouseLeave } for root press animation.',
      'watchRef option: observe data-state changes via MutationObserver to auto-trigger.',
      'onSetup option: return computed initial styles + dynamic animations (e.g. Switch translateX).',
      'Default config: defaultAnimations.indicator.',
    ],
  },

  useExpandAnimate: {
    trigger: 'ExpandAnimate',
    returns: '{ contentRef, innerRef }',
    targetSlots: ['content'],
    needsPresence: false,
    wiring: [
      'contentRef → outer content element (height animation target).',
      'innerRef → inner content element (opacity animation target).',
      'Driven by options: isEntering/isExiting trigger open/close animations.',
      'onEnterComplete/onExitComplete callbacks.',
      'Hook measures content height and manages height+opacity transition.',
      'Sets initial data-state="closed" elements to height:0, opacity:0.',
      'Default config: defaultAnimations.content.',
    ],
  },

  useValueAnimate: {
    trigger: 'ValueAnimate',
    returns: '{ ref }',
    targetSlots: ['root'],
    needsPresence: false,
    wiring: [
      'ref → attach to element whose property animates.',
      'Animates a numeric CSS property (e.g. width for ProgressBar).',
      'NOTE: Currently a stub — not yet implemented.',
    ],
  },

  useLoopAnimate: {
    trigger: 'LoopAnimate',
    returns: '{ ref }',
    targetSlots: ['root'],
    needsPresence: false,
    wiring: [
      'ref → attach to element that loops.',
      'Starts on mount, runs continuously (iterations: Infinity).',
      'Respects prefersReducedMotion (pauses or reduces motion).',
      'NOTE: Currently a stub — not yet implemented.',
    ],
  },
} as const;

// =============================================================================
// Named default profiles (spec-level canonical defaults)
// =============================================================================

export interface AnimationProfile {
  hook: keyof typeof HOOK_REGISTRY;
  configType: string;
  /** TypeScript expression string used as fallback default in generated source */
  fallbackExpr: string;
  notes?: string;
}

export const DEFAULT_PROFILES: Record<string, AnimationProfile> = {
  elementInteractive: {
    hook: 'useInteractionAnimate',
    configType: 'InteractionAnimate',
    fallbackExpr: 'defaultAnimations.element',
  },
  inlinePresence: {
    hook: 'useLifecycleAnimate',
    configType: 'LifecycleAnimate',
    fallbackExpr: 'defaultAnimations.presence',
    notes: 'Inline presence default: enter opacity 0->1 + scale 0.95->1; exit opacity 1->0 + scale 1->0.95 (short outQuart/snappy presence motion).',
  },
  layerPresence: {
    hook: 'useLifecycleAnimate',
    configType: 'LifecycleAnimate',
    fallbackExpr: 'defaultAnimations.layer',
  },
  popupPresence: {
    hook: 'useLifecycleAnimate',
    configType: 'LifecycleAnimate',
    fallbackExpr: 'defaultAnimations.popup',
  },
  contentExpand: {
    hook: 'useExpandAnimate',
    configType: 'ExpandAnimate',
    fallbackExpr: 'defaultAnimations.content',
  },
  toggleIndicator: {
    hook: 'useToggleAnimate',
    configType: 'ToggleAnimate & InteractionAnimate',
    fallbackExpr: 'defaultAnimations.indicator',
  },
} as const;

// =============================================================================
// Additional mechanism: sliding indicator
//
// Not a trigger type — a positional tracking utility used alongside triggers.
// Components: Tabs, ToggleGroup, Pagination.
// =============================================================================

// =============================================================================
// Rename mapping — old names (from original-components) → new names
//
// When reading from original-components or migrating, ALWAYS use the new names.
// The old names do NOT exist in the new architecture.
// =============================================================================

export const ANIMATION_RENAMES = {
  types: {
    ContentAnimate: 'ExpandAnimate',
    ElementAnimate: 'InteractionAnimate',
    LayerAnimate: 'LifecycleAnimate',
    PopupAnimate: 'LifecycleAnimate',
  },
  hooks: {
    usePopupAnimation: 'useLifecycleAnimate',
    useLayerAnimation: 'useLifecycleAnimate',
    useContentAnimation: 'useExpandAnimate',
    useInteractiveAnimate: 'useInteractionAnimate',
    useElementAnimation: 'useInteractionAnimate',
  },
} as const;

// =============================================================================
// Additional mechanism: sliding indicator
//
// Not a trigger type — a positional tracking utility used alongside triggers.
// Components: Tabs, ToggleGroup, Pagination.
// =============================================================================

export const POSITION_TRACKER = {
  hook: 'usePositionTracker',
  returns: '{ indicatorRef, update }',
  options: '{ containerRef, activeSelector?, track?, disabled? }',
  wiring: [
    'containerRef (option) → ref to parent element containing items + indicator.',
    'activeSelector (option) → CSS selector for active item (default: \'[data-state="active"], [data-state="on"]\').',
    'track (option) → "width" | "height" | "both" (default: "both").',
    'indicatorRef (returned) → the sliding element (position: absolute). Hook positions it automatically.',
    'update() (returned) → force-update indicator position.',
    'Uses MutationObserver on data-state changes to auto-update.',
    'First render snaps instantly, subsequent updates animate with spring.',
    'Legacy alias: useSlidingIndicator.',
  ],
} as const;
