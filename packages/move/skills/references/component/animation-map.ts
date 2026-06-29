/**
 * Animation Map — Trigger → Sequence Model
 *
 * All animations are declared as trigger-sequence pairs:
 *   { trigger: 'Slot.event', sequence: [steps...] }
 *
 * The `useAnimations` hook orchestrates everything:
 *   - Event triggers → returns mouse/keyboard handlers
 *   - State triggers → sets up MutationObserver on data-state
 *   - Lifecycle triggers → runs on mount, exposes runExit()
 *
 * Components define DEFAULT_ANIMATIONS and merge with user `animations` prop
 * via `resolveAnimationsConfig(defaults, props.animations)`.
 */

// =============================================================================
// Trigger types
// =============================================================================

export const TRIGGER_TYPES = {
  event: {
    format: "'Slot.event'",
    events: ['hover', 'press'],
    description: 'Event triggers fire on user interaction. Auto-reverse on end (mouseLeave, mouseUp). Supports `delegate` CSS selector for descendant targeting.',
    examples: ["'Root.hover'", "'Root.press'", "'Item.hover'"],
  },
  lifecycle: {
    format: "'Slot.enter' | 'Slot.exit'",
    description: 'Lifecycle triggers fire on mount (enter) or when runExit() is called (exit). Used with Presence for unmount delay.',
    examples: ["'Root.enter'", "'Root.exit'", "'Content.enter'", "'Overlay.exit'"],
  },
  state: {
    format: "'stateName'",
    description: 'State triggers fire when a MutationObserver detects a matching data-attribute value. Requires a matching AnimationState declaration.',
    examples: ["'checked'", "'unchecked'", "'open'", "'close'"],
    stateFields: '{ name, slot, source, value, closest?, initial? } — closest: CSS selector for ancestor observation (e.g. "[data-state]"); initial: false skips mount fire (default true)',
  },
  deps: {
    format: "any trigger name with deps: [...]",
    description: 'Deps triggers re-execute their sequence when the deps array changes (shallow compare). Skips first run. Use for value-reactive animations that fire on state changes. Supports `direction` for animateDimension and `vars` function for dynamic setup.',
    examples: ["{ trigger: 'width-change', deps: [collapsed], sequence: [...] }", "{ trigger: 'icon-open', deps: [isOpening], sequence: isOpening ? [...] : false }"],
  },
} as const;

// =============================================================================
// Sequence structure
// =============================================================================

export const SEQUENCE_STRUCTURE = {
  description: 'A sequence is an array of steps. Top-level = sequential, nested array = parallel.',
  examples: {
    sequential: `[
      { animation: fadeIn },           // step 1
      { target: 'icon', animation: scaleIn() },  // step 2 (after step 1)
    ]`,
    parallel: `[
      [                                // parallel group
        { fn: 'animateDimension', animation: { height: { ease: poppy } } },
        { children: '[role="option"]', animation: { ...scaleIn(0.8), ...fadeIn() }, stagger: { delay: 30 } },
      ],
    ]`,
  },
} as const;

// =============================================================================
// Animation step fields
// =============================================================================

export const STEP_FIELDS = {
  target: 'Slot name to animate. Defaults to the trigger slot if omitted.',
  animation: 'Inline Animation config — per-property { from, to, ease, duration } objects, or a motion builder / spread combination (e.g. { ...scaleIn(), ...fadeIn() }). Top-level loop: true/number and alternate: true supported.',
  fn: "'animateDimension' | 'animatePosition' — overrides default moveAnimate. Direction inferred from trigger or explicit `direction` on trigger.",
  children: 'CSS selector for stagger targets — implies staggerAnimate.',
  stagger: '{ delay?: number, from?: "first" | "last" | "center" } — timing for stagger.',
  onComplete: 'Callback after this step completes.',
} as const;

export const TRIGGER_FIELDS = {
  trigger: 'Trigger name — format depends on trigger type (see TRIGGER_TYPES).',
  sequence: 'Steps to execute. Array of steps (sequential) or nested arrays (parallel). Set to `false` to skip (useful with conditional deps triggers).',
  vars: 'Record<string, unknown> | ((el: HTMLElement) => Record<string, unknown>) — variables for $var expression resolution. Function form receives the slot element.',
  delegate: 'CSS selector — attach event handlers to matching descendants instead of the slot ref.',
  onComplete: 'Callback after all steps in this trigger complete.',
  deps: 'unknown[] — dependency array. When deps change (shallow compare), re-execute sequence. Skips first run.',
  direction: "'enter' | 'exit' — direction hint for animateDimension in deps triggers.",
} as const;

// =============================================================================
// Runtime functions
// =============================================================================

export const RUNTIME_FUNCTIONS = {
  moveAnimate: {
    signature: 'moveAnimate(el, animation, cancelRef?)',
    description: 'Default step executor. Handles reduced motion, cancellation, end-value application.',
    defaults: 'None — pure passthrough. Ease and duration come from the animation config.',
    when: 'Used for all steps that do not specify fn or children.',
  },
  animateDimension: {
    signature: 'animateDimension(el, prop, direction, cancelRef, config?)',
    description: 'Height/width reveal with cleanup. Measures natural size, animates, restores auto.',
    defaults: "ease: 'outQuart', duration: 250 (enter) / 200 (exit). Exit also collapses paddingTop/paddingBottom. Overridable via config.",
    when: "Used when step has fn: 'animateDimension'.",
    params: { prop: "'height' | 'width'", direction: "'enter' | 'exit'" },
  },
  animatePosition: {
    signature: 'animatePosition(indicator, animation, cancelRef, options?)',
    description: 'Position animation with $slot.property expression resolution and calc() support. First run snaps without animation.',
    defaults: 'ease: snappy. Overridable via ease in animation config.',
    when: "Used when step has fn: 'animatePosition'. Resolves $slot.width, $slot.x, etc.",
  },
  staggerAnimate: {
    signature: 'staggerAnimate(container, selector, animation, stagger, cancelRef, direction?)',
    description: 'Animate multiple children with incremental delay.',
    defaults: 'ease: quick (enter). Exit reverses order with capped delay of 20ms.',
    when: 'Used when step has children selector.',
  },
  useAnimations: {
    signature: 'useAnimations(config, refs, states?, options?) → { handlers, runExit, pauseAll, resumeAll, getAnimation }',
    description: 'Core orchestrator hook. Takes trigger-sequence config + slot refs, returns event handlers for JSX, runExit for exit animations, and pause/resume controls. Lifecycle enter runs in useLayoutEffect (before paint). Supports deps triggers for value-reactive animations.',
    options: '{ onEnterComplete?: () => void } — callback fired after all lifecycle enter sequences complete. Use for post-animation focus/scroll.',
    returns: {
      handlers: 'HandlerMap — event handlers to spread onto elements ({ Root: { onMouseEnter, ... } }).',
      runExit: '() => Promise<void> — run all exit sequences, resolves when done.',
      pauseAll: '() => void — pause all active animations from this hook instance.',
      resumeAll: '() => void — resume all paused animations from this hook instance.',
      getAnimation: '(triggerName: string) => JSAnimation | null — get the active animation for a specific trigger.',
    },
    when: 'Used by every animated component.',
  },
  resolveAnimationsConfig: {
    signature: 'resolveAnimationsConfig(defaults, userProp?)',
    description: 'Merges user animation overrides with component defaults. false → null (disabled). Matches by trigger name.',
    when: 'Used to merge props.animations with DEFAULT_ANIMATIONS.',
  },
} as const;

// =============================================================================
// Motions — self-explaining animation builders (from 'move'). The NAME says what
// animates + which direction; the PARAMETER says how much (default, or required
// for rotate); each carries its own default ease. Call to get an Animation
// object; COMBINE by spreading into one object (popIn = { ...scaleIn(), ...fadeIn() }).
// There is no `preset` string field — inline the motion in `animation`.
// =============================================================================

export const MOTIONS = {
  fadeIn: '() → { opacity: { from: 0, to: 1, ease: outQuart, duration: 200 } }',
  fadeOut: '() → { opacity: { to: 0, ease: outQuart, duration: 150 } }',
  slideUp: '(distance = 8) → { translateY: { from: distance, to: 0, ease: outQuart } }',
  slideDown: '(distance = 8) → { translateY: { from: -distance, to: 0, ease: outQuart } }',
  slideLeft: '(distance = 8) → { translateX: { from: distance, to: 0, ease: outQuart } }',
  slideRight: '(distance = 8) → { translateX: { from: -distance, to: 0, ease: outQuart } }',
  scaleIn: '(from = 0.9) → { scale: { from, to: 1, ease: poppy } }',
  scaleOut: '(to = 0.9) → { scale: { from: 1, to, ease: outQuart, duration: 150 } }',
  scaleUp: '(to = 1.04) → { scale: { to, ease: snappy } }   // hover',
  scaleDown: '(to = 0.96) → { scale: { to, ease: snappy } }  // press',
  rotate: '(from, to) → { rotate: { from, to, ease: outQuart, duration: 300 } }',
  expand: '() → { height: { from: 0, to: "auto" }, opacity: { from: 0, to: 1 } }',
  collapse: '() → { height: { from: "auto", to: 0 }, opacity: { from: 1, to: 0 } }',
} as const;

// =============================================================================
// Component animation patterns — examples per category
// =============================================================================

// Shared animation patterns — reused across 2+ components. Keys ARE the
// AnimationPattern vocabulary (spec-type.ts ANIMATION_PATTERNS); each spec's
// `animationPatterns` is the authoritative component↔pattern link. The
// `components` lists here mirror it and are kept in sync by the
// animation-pattern check.
export const PATTERNS = {
  press: {
    description: 'Hover-grow / press-dip on a control. Auto-reverses.',
    components: ['Button', 'ToggleButton', 'DayCell', 'InputRange', 'Pagination'],
    defaultAnimations: `
const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
  { trigger: 'Root.hover', sequence: [{ animation: scaleUp() }] },
  { trigger: 'Root.press', sequence: [{ animation: scaleDown() }] },
];`,
    wiring: `
const animConfig = resolveAnimationsConfig(DEFAULT_ANIMATIONS, props.animations);
const refs = { Root: rootRef };
const { handlers } = useAnimations(animConfig, refs);
// In render: spread handlers.Root onto root element
// onMouseEnter={handlers.Root?.onMouseEnter} etc.`,
  },

  toggle: {
    description: 'Checked/unchecked via state triggers + MutationObserver.',
    components: ['Checkbox', 'RadioGroup', 'Switch'],
    states: `
const STATES: AnimationState[] = [
  { name: 'checked', slot: 'Root', source: 'data-state', value: 'checked' },
  { name: 'unchecked', slot: 'Root', source: 'data-state', value: 'unchecked' },
];`,
    defaultAnimations: `
const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
  { trigger: 'checked', sequence: [{ target: 'indicator', animation: { opacity: { to: 1 }, scale: { to: 1, ease: poppy } } }] },
  { trigger: 'unchecked', sequence: [{ target: 'indicator', animation: { opacity: { to: 0 }, scale: { to: 0.5, ease: snappy } } }] },
  { trigger: 'Root.press', sequence: [{ animation: scaleDown() }] },
];`,
    wiring: `
const animConfig = resolveAnimationsConfig(DEFAULT_ANIMATIONS, props.animations);
const refs = { Root: rootRef, indicator: indicatorRef };
const { handlers } = useAnimations(animConfig, refs, STATES);`,
  },

  popupMenu: {
    description: 'Height reveal + stagger for dropdown content.',
    components: ['Select', 'Dropdown', 'Autocomplete', 'TimeField', 'DatePicker'],
    defaultAnimations: `
const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
  { trigger: 'Content.enter', sequence: [[
    { fn: 'animateDimension', animation: { height: { ease: poppy } } },
    { children: '[role="option"]', animation: { ...scaleIn(0.8), ...fadeIn() }, stagger: { delay: 30 } },
  ]] },
  { trigger: 'Content.exit', sequence: [[
    { fn: 'animateDimension', animation: { height: { ease: snappy } } },
    { children: '[role="option"]', animation: { ...scaleOut(0.8), ...fadeOut() }, stagger: { delay: 20, from: 'last' } },
  ]] },
  { trigger: 'iconOpen', sequence: [{ target: 'Icon', animation: { rotate: { to: 180, ease: snappy } } }] },
  { trigger: 'iconClosed', sequence: [{ target: 'Icon', animation: { rotate: { to: 0, ease: snappy } } }] },
];`,
    wiring: `
const animConfig = resolveAnimationsConfig(DEFAULT_ANIMATIONS, props.animations);
const refs = { Content: contentRef, ContentInner: innerRef, Icon: iconRef };
const STATES: AnimationState[] = [
  { name: 'iconOpen', slot: 'Icon', source: 'data-state', value: 'open', closest: '[data-state]', initial: false },
  { name: 'iconClosed', slot: 'Icon', source: 'data-state', value: 'closed', closest: '[data-state]', initial: false },
];
const { runExit } = useAnimations(animConfig, refs, STATES, {
  onEnterComplete: () => { contentRef.current?.focus(); },
});
// Exit: runExit().then(() => onCloseComplete?.());`,
  },

  popupSurface: {
    description: 'Anchored content surface scales + fades in/out (Presence for exit).',
    components: ['Popover', 'Tooltip', 'ColorInput'],
    defaultAnimations: `
const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
  { trigger: 'Content.enter', sequence: [{ target: 'Content', animation: { ...scaleIn(0.9), ...fadeIn() } }] },
  { trigger: 'Content.exit', sequence: [{ target: 'Content', animation: { ...scaleOut(0.9), ...fadeOut() } }] },
];`,
    note: 'See "Portaled overlays" — the inner Content surface owns the scale/fade BELOW the Radix Portal so the shell keeps Radix positioning.',
    wiring: `
const animConfig = resolveAnimationsConfig(DEFAULT_ANIMATIONS, props.animations);
const refs = { Content: contentRef };
const { runExit } = useAnimations(animConfig, refs);
// Exit: runExit().then(() => onCloseComplete?.());`,
  },

  // Component-specific entries below (single component — NOT shared patterns):
  // modal (Dialog), textReveal (AnimatedText), countdown (Toast),
  // exitOnStatus (FileUpload), pageSlide (Pagination).
  modal: {
    description: 'Component-specific (Dialog) — centered surface scales+fades over a fading backdrop.',
    components: ['Dialog'],
    defaultAnimations: `
const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
  { trigger: 'Overlay.enter', sequence: [{ animation: { opacity: { from: 0, to: 1, duration: 200 } } }] },
  { trigger: 'Overlay.exit', sequence: [{ animation: { opacity: { to: 0, duration: 150 } } }] },
  { trigger: 'Content.enter', sequence: [{ animation: { opacity: { from: 0, to: 1 }, scale: { from: 0.95, to: 1, ease: poppy } } }] },
  { trigger: 'Content.exit', sequence: [{ animation: { opacity: { to: 0 }, scale: { to: 0.95, ease: snappy } } }] },
];`,
    note: 'Sub-components filter config by slot prefix (e.g. overlayConfig = config.filter(t => t.trigger.startsWith("Overlay."))).',
  },

  disclosure: {
    description: 'Height open/close for disclosure panels with dual-target parallel steps (height + opacity). Uses deps triggers watching open/close state. Icon rotation synced to content animation duration.',
    components: ["Accordion", "Collapsible"],
    defaultAnimations: `
// Icon rotation via deps triggers (in Trigger sub-component)
const iconConfig: AnimationTrigger[] = useMemo(() => [
  { trigger: 'icon-open', deps: [isOpening], sequence: isOpening ? [{ target: 'Icon', animation: { rotate: { to: 180, ease: 'outQuart', duration: openDuration } } }] : false },
  { trigger: 'icon-close', deps: [isClosing], sequence: isClosing ? [{ target: 'Icon', animation: { rotate: { to: 0, ease: 'outQuart', duration: closeDuration } } }] : false },
], [isOpening, isClosing, openDuration, closeDuration]);

// Content dual-target: height + opacity in parallel (in Content sub-component)
const contentConfig: AnimationTrigger[] = useMemo(() => [
  { trigger: 'content-open', deps: [isOpening],
    sequence: isOpening && config.open ? [[
      { target: 'Content', fn: 'animateDimension', animation: config.open },
      { target: 'ContentInner', animation: { opacity: { from: 0, to: 1, ease: 'linear', duration: enterDuration - 150 }, delay: 150 } },
    ]] : false,
    onComplete: () => onOpenComplete(), direction: 'enter' },
  { trigger: 'content-close', deps: [isClosing],
    sequence: isClosing && config.close ? [[
      { target: 'Content', fn: 'animateDimension', animation: config.close },
      { target: 'ContentInner', animation: { opacity: { from: 1, to: 0, ease: 'linear', duration: Math.round(exitDuration * 0.4) } } },
    ]] : false,
    onComplete: () => onCloseComplete(), direction: 'exit' },
], [isOpening, isClosing]);`,
    note: 'When animations: false, use separate useEffect fallbacks to immediately set styles and call complete callbacks — bypass useAnimations entirely.',
  },

  slidingIndicator: {
    description: 'Sliding indicator that tracks the active element (tab underline, segmented-control thumb, pagination indicator).',
    components: ["Tabs", "ToggleGroup", "TableOfContents"],
    note: 'Use the shared usePositionTracker hook and declare animationCapabilities: ["slidingIndicator"]. It measures the active element via offsetLeft/Top/Width/Height (transform-agnostic, unlike getBoundingClientRect) and re-measures on resize, font load, and data-state mutations. Do NOT hand-roll a fn:"animatePosition" trigger + a dynamic Active ref for an indicator — that is the deprecated pattern (it broke inside CSS-transformed contexts and duplicated measurement). A press/scale on the indicator (ToggleGroup) stays a normal declarative Root.press trigger; only the position tracking uses the hook.',
    wiring: `
import { usePositionTracker } from '../../../animation';

// indicatorRef goes on the absolutely-positioned indicator div inside the container.
const { indicatorRef, update } = usePositionTracker({
  containerRef: internalRef,
  activeSelector: '[data-state="active"]', // '[data-state="on"]' for ToggleGroup
  track: 'both',                            // 'width' for a horizontal underline (Tabs)
  disabled: props.animations === false,
});

// Re-measure after content changes the observers can't catch (e.g. Pagination range):
React.useEffect(() => { update(); }, [page, update]);`,
  },

  textReveal: {
    description: 'Staggered per-character / per-word / per-line text entrance (anime.js splitText). The set of animated nodes is generated at runtime from the text, so it cannot be expressed as fixed declarative slots.',
    components: ['AnimatedText'],
    note: 'Use the shared useSplitText hook and declare animationCapabilities: ["textSplit"]. Do NOT import animejs (splitText/animate) directly in the component — the hook owns all splitting/staggering and the barrel keeps the no-direct-animejs rule intact. The hook splits with accessible:true (aria-label on the container, aria-hidden segments), bypasses entirely under prefers-reduced-motion, and supports mount/inView/hover triggers. Key the rendered element on the text so a content change remounts cleanly instead of reconciling against the splitText-mutated DOM.',
    wiring: `
import { useSplitText } from '../../../animation';

const { ref: splitRef, animated } = useSplitText({
  text, by, effect, trigger, once, stagger, delay, duration,
});
const mergedRef = useMergedRef(ref, splitRef); // merge with the factory ref
// element: <Comp key={text} ref={mergedRef} {...(animated ? { 'data-animated': '' } : {})}>{text}</Comp>`,
  },

  listReveal: {
    description: 'Per-item stagger on mount — data rows / items.',
    components: ["List", "Table", "Timeline", "FileUpload", "ChatBubble"],
    defaultAnimations: `
const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
  { trigger: 'Root.enter', sequence: [{ children: ':scope > *', animation: { ...scaleIn(0.8), ...fadeIn() }, stagger: { delay: 30 } }] },
];`,
  },

  layoutReveal: {
    description: 'A generic layout container staggers its children in on mount.',
    components: ['Grid', 'Stack'],
    defaultAnimations: `
const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
  { trigger: 'Root.enter', sequence: [{ children: ':scope > *', animation: { ...scaleIn(0.9), ...fadeIn() }, stagger: { delay: 30 } }] },
];`,
  },

  sidePanel: {
    description: 'Panel from an edge — overlay (backdrop + slide: Drawer, Sidebar mobile) or in-flow (width collapse: Sidebar desktop).',
    components: ['Drawer', 'Sidebar'],
    defaultAnimations: `
// Overlay mode — backdrop fade + panel slide (Drawer, Sidebar mobile)
const DEFAULT_ANIMATIONS: AnimationTrigger[] = [
  { trigger: 'Overlay.enter', sequence: [{ animation: fadeIn() }] },
  { trigger: 'Content.enter', sequence: [{ animation: { ...slideLeft(), ...fadeIn() } }] },
  { trigger: 'Content.exit',  sequence: [{ animation: { ...slideLeft(), ...fadeOut() } }] },
];

// In-flow mode — animate width via a deps trigger reading CSS vars (Sidebar desktop)
const widthConfig: AnimationTrigger[] = useMemo(() => [{
  trigger: 'width-change', deps: [collapsed],
  sequence: [{ target: 'Root', animation: { width: { to: '$targetWidth', ease: smooth } } }],
  vars: (el: HTMLElement) => {
    const rootStyles = getComputedStyle(el);
    const expandedWidth = rootStyles.getPropertyValue('--move-sidebar-width').trim() || '15rem';
    const collapsedWidth = rootStyles.getPropertyValue('--move-sidebar-width-collapsed').trim() || '4rem';
    el.style.width = collapsed ? expandedWidth : collapsedWidth; // snap from current
    return { targetWidth: collapsed ? collapsedWidth : expandedWidth };
  },
  onComplete: () => { el.style.width = ''; }, // let CSS take over
}], [collapsed]);`,
    note: 'Drawer/Sidebar-mobile portal to a fixed overlay; Sidebar desktop collapses width in-flow — same edge-panel family.',
  },

  countdown: {
    description: 'Progress countdown with pause/resume on hover. Uses lifecycle enter trigger with linear ease.',
    components: ['Toast'],
    defaultAnimations: `
const progressConfig: AnimationTrigger[] = useMemo(() => [{
  trigger: 'Progress.enter',
  sequence: [{ target: 'Progress', animation: { scaleX: { from: 1, to: 0, ease: 'linear', duration: toastDuration } } }],
  onComplete: () => removeToast(id),
}], [toastDuration, id]);
const { pauseAll, resumeAll } = useAnimations(progressConfig, progressRefs);
// Wire: mouseenter → pauseAll(), mouseleave → resumeAll(), focusin → pauseAll(), focusout → resumeAll()`,
  },

  exitOnStatus: {
    description: 'Item exit animation triggered by status change, with onComplete for removal.',
    components: ['FileUpload'],
    defaultAnimations: `
const exitConfig: AnimationTrigger[] = useMemo(() => [{
  trigger: 'item-exit', deps: [exitReady],
  sequence: exitReady ? [{ target: 'Item', animation: { opacity: { to: 0 }, scale: { to: 0.95 }, duration: 200 } }] : false,
  onComplete: () => removeFile(file),
}], [exitReady]);`,
  },

  pageSlide: {
    description: 'Per-element slide-in for newly appearing page numbers. Uses deps trigger with vars function for DOM diffing and children filter.',
    components: ['Pagination'],
    defaultAnimations: `
const slideConfig: AnimationTrigger[] = useMemo(() => [{
  trigger: 'Items.slide', deps: [rangeKey],
  sequence: [{ target: 'Items', children: '[data-entering]', stagger: { delay: 20 },
    animation: { opacity: { to: 1, ease: paginationEase }, translateX: { to: 0, ease: paginationEase }, scale: { to: 1, ease: paginationEase } },
  }],
  vars: (el: HTMLElement) => {
    // Compute new elements, set data-entering + initial styles in vars
    // Clean up data-entering in onComplete
    return {};
  },
  onComplete: () => { ul.querySelectorAll('[data-entering]').forEach(c => c.removeAttribute('data-entering')); },
}], [rangeKey]);`,
    note: 'vars function identifies new DOM elements, marks them with data-entering and sets initial inline styles. children selector targets only marked elements.',
  },

  loader: {
    description: 'Looping pulse animation via lifecycle enter trigger with loop + alternate.',
    components: ["Loader", "Skeleton"],
    defaultAnimations: `
const pulseConfig: AnimationTrigger[] = useMemo(() => [{
  trigger: 'Pulse.enter',
  sequence: [{ target: 'Pulse', animation: { opacity: { from: 1, to: 0.4, duration: 750, ease: 'inOutQuad' }, loop: true, alternate: true } }],
}], []);`,
    note: 'Animation config supports top-level loop: true/number and alternate: true for repeating animations.',
  },
} as const;

// =============================================================================
// User prop contract
// =============================================================================

export const USER_PROP = {
  name: 'animations',
  type: 'AnimationTrigger[] | false',
  description: 'User prop for customizing animations. Same shape as DEFAULT_ANIMATIONS. false disables all animations.',
  merging: 'resolveAnimationsConfig(defaults, props.animations) — matches by trigger name, replaces sequence per trigger. Unmentioned triggers keep defaults.',
} as const;
