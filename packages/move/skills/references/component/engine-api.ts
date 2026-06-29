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
  coreFunctions: {
    moveAnimate: 'Core apply function — moveAnimate(el, animation, cancelRef?). Handles reduced motion, cancellation. Used internally by useAnimations. Direct use is a declared Tier-2 capability only: Carousel (scrollApi), ChatBubble (measureThenAnimate). Loader/Skeleton use raw anime.js animate() (valueLoop). Everything else animates through useAnimations.',
    animateDimension: 'Dimension reveal/collapse — animateDimension(el, prop, direction, cancelRef, config?). Measures size, animates height/width, restores auto.',
    staggerAnimate: 'Multi-child delay — staggerAnimate(container, selector, animation, stagger, cancelRef, direction?).',
    animatePosition: 'Position animation — animatePosition(indicator, animation, cancelRef, options?). Resolves $slot.property expressions.',
    useAnimations: 'Core orchestrator hook — useAnimations(config, refs, states?, options?) → { handlers, runExit, pauseAll, resumeAll, getAnimation }. Lifecycle enter runs in useLayoutEffect. State triggers support closest for ancestor observation. Deps triggers re-execute on dependency changes. Returns pause/resume controls for all active animations.',
    resolveAnimationsConfig: 'Merge user overrides — resolveAnimationsConfig(defaults, userProp?). Matches by trigger name. Returns null if false.',
  },
  presets: {
    motions: 'fadeIn/fadeOut, slideUp/Down/Left/Right, scaleIn/scaleOut, scaleUp/scaleDown, rotate(from,to), expand/collapse — self-explaining builders. Call to get an Animation object; spread to combine ({ ...scaleIn(), ...fadeIn() }). No `preset` string field — inline in `animation`.',
    bundles: '@deprecated — interactive, revealHeight, staggerItems, toggleIndicator, expandContent. Use trigger-sequence defaults instead.',
  },
  positionTracking: {
    usePositionTracker: 'Sliding-indicator hook — usePositionTracker({ containerRef, activeSelector, track }) → { indicatorRef, update }. Measures the active element via offsetLeft/Top/Width/Height (transform-agnostic, unlike getBoundingClientRect) and re-measures on resize, font load, and data-state mutations. THE sanctioned way to drive any active-element indicator — declare animationCapabilities: ["slidingIndicator"]. Used by Tabs, TableOfContents, Pagination, ToggleGroup.',
    useSlidingIndicator: 'Legacy alias of usePositionTracker (identical hook).',
  },
  splitText: {
    useSplitText: 'Split-text reveal hook — useSplitText({ text, by, effect, trigger, once, stagger, delay, duration }) → { ref, animated }. Splits the element text into runtime-generated character/word/line segments (anime.js splitText) and staggers their entrance. THE sanctioned way to animate split text — declare animationCapabilities: ["textSplit"] and never import animejs in the component. Splits with accessible:true (aria-label on container, aria-hidden segments), bypasses entirely under prefers-reduced-motion, supports mount/inView/hover triggers. Used by AnimatedText.',
  },
  presence: {
    Presence: 'Component for managing enter/exit animations with mount/unmount lifecycle.',
    usePresence: 'Hook to access presence context. Returns [isPresent, safeToRemove].',
    useIsPresent: 'Hook to check if element is present (boolean).',
  },
  utils: {
    prefersReducedMotion: 'Check if user prefers reduced motion.',
    mergeAnimateConfig: 'Shallow merge animation configs with defaults.',
    toEndValues: 'Extract end values from Animation config for reduced motion.',
    getFromStyles: 'Extract initial CSS styles from Animation config (from values).',
  },
  springs: {
    springs: 'Object with spring presets: snappy, quick, poppy, gentle, slow, lazy, jelly, stiff.',
    easings: 'Array of all easing preset names.',
    getEase: 'Helper to get ease value from preset name.',
    isSpring: 'Helper to check if preset is a spring (vs easing curve).',
  },
  types: {
    Animation: 'Single animation definition — Record<string, unknown> with per-property { from, to, ease, duration } objects. Supports top-level loop: true/number and alternate: true.',
    AnimationState: 'State declaration: { name, slot, source, value, closest?, initial? }. closest: CSS selector for ancestor observation. initial: false skips mount fire.',
    AnimationStep: 'Sequence step: { target?, animation?, preset?, fn?, children?, stagger?, onComplete? }.',
    SequenceItem: 'AnimationStep | AnimationStep[] — single or parallel steps.',
    AnimationTrigger: 'Trigger-sequence pair: { trigger, sequence, vars?, delegate?, onComplete?, deps?, direction? }. sequence can be false (skip). deps: dependency array for value-reactive triggers.',
    StaggerConfig: 'Stagger options: { delay?: number; from?: "first" | "last" | "center" }.',
    JSAnimation: 'anime.js animation instance — returned by getAnimation(), supports .pause()/.play().',
  },
  deprecated: {
    animateMeasured: '@deprecated — Use animateDimension instead.',
    resolveAnimateConfig: '@deprecated — Use resolveAnimationsConfig instead.',
    measureRelativePosition: '@deprecated — Use the usePositionTracker hook (slidingIndicator capability) instead.',
    LifecycleAnimate: '@deprecated — Use AnimationTrigger[] with lifecycle triggers.',
    InteractionAnimate: '@deprecated — Use AnimationTrigger[] with event triggers.',
    ToggleAnimate: '@deprecated — Use AnimationTrigger[] with state triggers.',
    ExpandAnimate: '@deprecated — Use AnimationTrigger[] with state triggers.',
    AnimateConfig: '@deprecated — Use AnimationTrigger[].',
    PopupAnimate: '@deprecated — Use AnimationTrigger[].',
    DialogAnimate: '@deprecated — Use AnimationTrigger[].',
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
    orchestrator: "import { useAnimations, resolveAnimationsConfig } from '../../../animation';",
    coreFunctions: "// Rarely needed — useAnimations calls these internally. Direct import only behind a declared Tier-2 capability (Carousel/ChatBubble: moveAnimate; Loader/Skeleton: raw animejs).\nimport { moveAnimate, animateDimension, staggerAnimate, animatePosition } from '../../../animation';",
    motions: "import { fadeIn, fadeOut, slideUp, scaleIn, scaleOut, scaleUp, scaleDown, rotate } from '../../../animation';",
    springs: "import { snappy, quick, poppy, brisk, smooth } from '../../../animation';",
    types: "import type { Animation, AnimationTrigger, AnimationState, AnimationStep, SequenceItem, JSAnimation } from '../../../animation';",
    presence: "import { Presence, usePresence } from '../../../animation';",
    slidingIndicator: "import { usePositionTracker } from '../../../animation'; // the sanctioned active-element indicator hook (declare animationCapabilities: ['slidingIndicator']). Prefer over a fn:'animatePosition' trigger.",
    splitText: "import { useSplitText } from '../../../animation'; // the sanctioned split-text reveal hook (declare animationCapabilities: ['textSplit']). Never import animejs splitText/animate directly in the component.",
    note: "ALWAYS import from '../../../animation' — NEVER from sub-paths. The barrel re-exports everything.",
  },
  infrastructure: {
    useResolvedIcon: "import { useResolvedIcon } from '../../../infrastructure/Icon';",
    note: 'For components that render built-in icons (close buttons, chevrons, etc.). See references/infrastructure.ts for full API.',
  },
} as const;
