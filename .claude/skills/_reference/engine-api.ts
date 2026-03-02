/**
 * Engine & Animation API Reference
 *
 * Available exports from src/engine/ and src/animation/.
 */

// =============================================================================
// Engine exports (from src/engine/index.ts)
// =============================================================================

export const ENGINE_EXPORTS = {
  factory: {
    withMoveComponent: 'Factory function for creating Move components. Handles forwardRef, default props, slot-props, and attrs stripping.',
  },
  context: {
    MoveProvider: 'Global context provider for slot-props overrides.',
    useMoveContext: 'Hook to access global slot-props for a component.',
  },
  hooks: {
    useMergedRef: 'Merges multiple refs into a single ref callback.',
    useControlledState: 'Manages controlled vs uncontrolled state pattern.',
  },
  utils: {
    mergeSlotProps: 'Merges multiple SlotProps objects.',
    createCx: 'Creates a CSS Module class resolver function.',
    createSp: 'Creates a slot-props merge function.',
  },
  types: {
    SlotProps: 'Props that can be applied to any slot element.',
    SlotPropsMap: 'Instance-level slot-props overrides keyed by slot name. Generic: SlotPropsMap<TSlots>.',
    GlobalSlotProps: 'Global slot-props keyed by component name, then slot name.',
    CxFn: 'CSS Module class resolver function type. Generic: CxFn<TSlots>.',
    SpFn: 'Slot-props merge function type. Generic: SpFn<TSlots>.',
    SetupContext: 'Context passed to setup() functions. Generic: SetupContext<TSlots, TProps, TRef>.',
    SetupReturn: 'Value returned from setup(): { render(): ReactNode }.',
    MoveComponentOptions: 'Options for withMoveComponent. Generic: MoveComponentOptions<TSlots, TProps, TRef, TSubs>.',
    MoveProviderProps: 'Props for MoveProvider component.',
    UseControlledStateOptions: 'Options for useControlledState hook.',
  },
} as const;

// =============================================================================
// Animation exports (from src/animation/index.ts)
// =============================================================================

export const ANIMATION_EXPORTS = {
  hooks: {
    // --- 1:1 trigger hooks ---
    useLifecycleAnimate: 'LifecycleAnimate trigger — mount/unmount enter/exit. Supports single target, dual target (content + overlay), and stagger. Options: { animate, isClosing, onCloseComplete, onOpenComplete, overlayAnimate, stagger, animateHeight }. Returns { contentRef, overlayRef, innerRef }.',
    useInteractionAnimate: 'InteractionAnimate trigger — hover/press animations. Wraps useAnimateConfig with mouse/keyboard handlers. Also handles enter/exit inside Presence. Returns { ref, isPresent, trigger, getAnimation, handlers }.',
    useToggleAnimate: 'ToggleAnimate trigger — checked/unchecked + press animations. Options: { animate, initialChecked, disabled, watchRef, checkedValue, onSetup }. Returns { rootRef, indicatorRef, animateChecked, animateUnchecked, pressHandlers }.',
    useExpandAnimate: 'ExpandAnimate trigger — open/close height+opacity. Options: { animate, isEntering, isExiting, onEnterComplete, onExitComplete }. Returns { contentRef, innerRef }.',
    useValueAnimate: 'ValueAnimate trigger — continuous value change animation. Returns { ref }. NOTE: stub, not yet implemented.',
    useLoopAnimate: 'LoopAnimate trigger — continuous ambient animation (spinner, pulse). Returns { ref }. NOTE: stub, not yet implemented.',

    // --- Utilities (not trigger hooks) ---
    usePositionTracker: 'Positional tracking for sliding indicators (Tabs, Pagination, ToggleGroup). Options: { containerRef, activeSelector, track, disabled }. Returns { indicatorRef, update }.',
    useSlidingIndicator: 'Legacy alias for usePositionTracker.',
  },
  presence: {
    Presence: 'Component for managing enter/exit animations with mount/unmount lifecycle.',
    usePresence: 'Hook to access presence context. Returns [isPresent, safeToRemove].',
    useIsPresent: 'Hook to check if element is present (boolean).',
  },
  utils: {
    prefersReducedMotion: 'Check if user prefers reduced motion.',
    resolveEasing: 'Resolve easing preset name to anime.js easing value.',
    toAnimeParams: 'Convert Animation config to anime.js params object.',
    toInstantParams: 'Convert Animation to instant params for reduced motion.',
    mergeAnimateConfig: 'Merge animation configs with defaults.',
    getInitialStyles: 'Extract initial CSS styles from Animation config.',
  },
  springs: {
    springs: 'Object with spring presets: snappy, quick, poppy, gentle, slow, lazy, jelly, stiff.',
    easings: 'Array of all easing preset names.',
    getEase: 'Helper to get ease value from preset name.',
    isSpring: 'Helper to check if preset is a spring (vs easing curve).',
  },
  types: {
    // --- Base types ---
    AnimationPreset: "'none' | SpringPreset | Easing",
    AnimatableValue: 'T | { value: T; easing?: AnimationPreset }',
    AnimationProperties: 'Properties that can be animated (scale, x, y, opacity, etc.).',
    Animation: 'Single animation definition with properties and timing.',

    // --- Core trigger types (atomic, composable) ---
    LifecycleAnimate: 'Mount/unmount trigger: { enter?, exit? }.',
    InteractionAnimate: 'User interaction trigger: { hover?, press? }.',
    ToggleAnimate: 'Binary state trigger: { checked?, unchecked? }.',
    ExpandAnimate: 'Content reveal/hide trigger: { open?, close? }.',
    ValueAnimate: 'Continuous value change trigger: { value? }.',
    LoopAnimate: 'Continuous ambient trigger: { loop? }.',

    // --- Modifiers (mix into any trigger type) ---
    StaggerModifier: 'Sequenced children: { stagger?: StaggerConfig }.',
    StaggerConfig: 'Stagger options: { delay?: number; from?: "first" | "last" | "center" }.',
    DelayModifier: 'Animation delay: { delay?: number }.',

    // No composed types — components intersect triggers directly:
    // e.g. animate?: LifecycleAnimate & InteractionAnimate
  },
  constants: {
    defaultAnimations: 'Default animation configs: element, presence, layer, layerBackdrop, content, popup, popupStagger, carousel, popupItem, indicator.',
    DEFAULT_DURATION: 'Default animation duration (200ms).',
  },
} as const;

// =============================================================================
// Visual system exports (from src/styles/visual/)
// =============================================================================

export const VISUAL_EXPORTS = {
  shadows: {
    createThemeShadows: 'Generate per-surface shadow tokens for a theme. Takes ThemeShadowConfig, returns ThemeShadowTokens (angle + 5 surfaces × 4 elevations = 21 tokens).',
    createShadow: 'Create a custom shadow with specified options (elevation, color, angle, oomph, crispy).',
    createShadowPalette: 'Generate a complete shadow palette for all elevations.',
    shadows: 'Pre-defined shadow presets (sm, md, lg, xl).',
    shadowCSSVariables: 'CSS custom properties object for shadow presets.',
  },
  surface: {
    description: 'Surface-aware shadow resolution via [data-surface] attribute. Components that create a background surface set data-surface on their background element. Children inherit correct shadow tokens via CSS cascade. Active tokens (--move-shadow-sm/md/lg/xl) are resolved from per-surface tokens (--move-shadow-{surface}-{size}).',
    attribute: 'data-surface',
    levels: ['base', 'subtle', 'muted', 'emphasis', 'inverse'],
  },
  types: {
    SurfaceLevel: "'base' | 'subtle' | 'muted' | 'emphasis' | 'inverse'",
    ThemeShadowConfig: 'Config for createThemeShadows: { angle, color, surfaces, oomph, crispy }.',
    ThemeShadowTokens: 'Output of createThemeShadows: angle + 20 per-surface shadow tokens.',
    SurfaceShadowConfig: 'Per-surface config: { strength, color? }.',
  },
} as const;

// =============================================================================
// Import patterns
// =============================================================================

export const IMPORT_PATTERNS = {
  /**
   * CRITICAL: All engine imports MUST use the barrel path '../../../engine'.
   * Never import from sub-paths like '../../../engine/types' or '../../../engine/useControlledState'.
   * The engine barrel re-exports everything.
   */
  engine: {
    internal: "import { withMoveComponent, useMergedRef } from '../../../engine';",
    internalTypes: "import type { SlotPropsMap } from '../../../engine';",
    controlledState: "import { useControlledState } from '../../../engine';",
    note: "ALWAYS import from '../../../engine' — NEVER from sub-paths like '../../../engine/types' or '../../../engine/useControlledState'. The barrel re-exports everything.",
  },
  /**
   * CRITICAL: All animation imports MUST use the barrel path '../../../animation'.
   * Never import from sub-paths like '../../../animation/types', '../../../animation/hooks',
   * '../../../animation/easings', or '../../../animation/utils'.
   * The animation barrel re-exports everything.
   */
  animation: {
    triggers: "import { useLifecycleAnimate, useInteractionAnimate } from '../../../animation';",
    types: "import type { LifecycleAnimate, InteractionAnimate } from '../../../animation';",
    defaults: "import { defaultAnimations } from '../../../animation';",
    presence: "import { Presence } from '../../../animation';",
    note: "ALWAYS import from '../../../animation' — NEVER from sub-paths like '../../../animation/types', '../../../animation/hooks', '../../../animation/easings', or '../../../animation/utils'. The barrel re-exports everything.",
  },
  infrastructure: {
    useResolvedIcon: "import { useResolvedIcon } from '../../../infrastructure/Icon';",
    note: 'For components that render built-in icons (close buttons, chevrons, etc.). See _reference/infrastructure.ts for full API.',
  },
} as const;
