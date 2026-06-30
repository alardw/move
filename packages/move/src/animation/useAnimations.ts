import { useRef, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import type { JSAnimation } from 'animejs';
import { moveAnimate } from './moveAnimate';
import { animateDimension } from './animateDimension';
import { animatePosition } from './animatePosition';
import { staggerAnimate } from './staggerAnimate';
import type {
  Animation,
  AnimationTrigger,
  AnimationStep,
  AnimationState,
  SequenceItem,
} from './types';

type RefMap = Record<string, React.RefObject<HTMLElement | null>>;
// Event handlers of varied signatures (onMouseEnter, onPointerDown, …).
type HandlerMap = Record<string, Record<string, (...args: any[]) => void>>;

/**
 * Resolve vars — if a function, call with the target element; otherwise return as-is.
 */
function resolveVars(
  vars: Record<string, unknown> | ((el: HTMLElement) => Record<string, unknown>) | undefined,
  el: HTMLElement | null,
): Record<string, unknown> {
  if (!vars) return {};
  if (typeof vars === 'function') {
    return el ? vars(el) : {};
  }
  return vars;
}

/**
 * Resolve `$varName` references in animation property values.
 * Handles per-property objects like `{ from: '$offsetX', to: 0 }`.
 */
function resolveAnimationVars(animation: Animation, vars: Record<string, unknown>): Animation {
  // Fast path — no vars to resolve
  const varKeys = Object.keys(vars);
  if (varKeys.length === 0) return animation;

  const resolved: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(animation)) {
    if (typeof value === 'object' && value !== null) {
      const propObj = value as Record<string, unknown>;
      const resolvedProp: Record<string, unknown> = {};
      let changed = false;
      for (const [pk, pv] of Object.entries(propObj)) {
        if (typeof pv === 'string' && pv.startsWith('$')) {
          const varName = pv.slice(1);
          if (varName in vars) {
            resolvedProp[pk] = vars[varName];
            changed = true;
            continue;
          }
        }
        resolvedProp[pk] = pv;
      }
      resolved[key] = changed ? resolvedProp : value;
    } else if (typeof value === 'string' && value.startsWith('$')) {
      const varName = value.slice(1);
      resolved[key] = varName in vars ? vars[varName] : value;
    } else {
      resolved[key] = value;
    }
  }
  return resolved as Animation;
}

/**
 * Resolve an AnimationStep's animation — the inline `animation` object (motions
 * are spread into it), or undefined.
 */
function resolveStepAnimation(step: AnimationStep): Animation | undefined {
  if (step.animation) return step.animation;
  return undefined;
}

/**
 * Check if an animation has loop enabled (will never complete on its own).
 */
function isLooping(animation: Animation | undefined): boolean {
  if (!animation) return false;
  return animation.loop === true || (typeof animation.loop === 'number' && animation.loop > 0);
}

/**
 * Wrap a JSAnimation promise and call step.onComplete when done.
 */
function wrapStepPromise(promise: Promise<void>, step: AnimationStep): Promise<void> {
  if (!step.onComplete) return promise;
  return promise.then(() => step.onComplete?.());
}

/**
 * Track a JSAnimation in the active set for pause/resume.
 */
function trackAnimation(
  anim: JSAnimation | null | undefined,
  activeAnims: Set<JSAnimation>,
  triggerAnims: Map<string, JSAnimation>,
  triggerName: string,
): void {
  if (!anim) return;
  activeAnims.add(anim);
  triggerAnims.set(triggerName, anim);
  (anim as any).then?.(() => {
    activeAnims.delete(anim);
    if (triggerAnims.get(triggerName) === anim) {
      triggerAnims.delete(triggerName);
    }
  });
}

/**
 * Convert an anime.js animation to a completion promise — ALWAYS with a
 * fallback timer (resolve is idempotent).
 *
 * Why always: we pause the prior animation when a new sequence supersedes it
 * (see staggerAnimate). A paused/cancelled animation has NOT completed, so its
 * `.then()` correctly never fires — but if we only awaited `.then()`, that
 * orphaned promise would hang runExit()/enter sequencing forever (the popup
 * "opens once, then nothing happens"). The fallback resolves by the animation's
 * own duration so a stalled `.then()` can never lock the lifecycle.
 */
function animToPromise(anim: unknown, fallbackMs: number): Promise<void> {
  return new Promise<void>((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    const a = anim as { then?: (cb: () => void) => void } | null | undefined;
    a?.then?.(done);
    setTimeout(done, fallbackMs);
  });
}

/**
 * Execute a single animation step.
 */
function executeStep(
  step: AnimationStep,
  refs: RefMap,
  cancelRefs: Map<string, React.MutableRefObject<JSAnimation | null>>,
  defaultSlot: string,
  vars: Record<string, unknown>,
  direction: 'enter' | 'exit',
  activeAnims?: Set<JSAnimation>,
  triggerAnims?: Map<string, JSAnimation>,
  triggerName?: string,
): Promise<void> {
  const target = step.target ?? defaultSlot;
  const ref = refs[target];
  const el = ref?.current;

  // Get or create cancel ref for this target
  const cancelKey = `${target}-${step.fn ?? 'move'}`;
  if (!cancelRefs.has(cancelKey)) {
    cancelRefs.set(cancelKey, { current: null });
  }
  const cancelRef = cancelRefs.get(cancelKey)!;

  let animation = resolveStepAnimation(step);

  // Resolve $var references in animation values
  if (animation && Object.keys(vars).length > 0) {
    animation = resolveAnimationVars(animation, vars);
  }

  // Stagger path
  if (step.children && step.stagger) {
    if (!el) {
      return Promise.resolve();
    }
    const anim = staggerAnimate(el, step.children, animation, step.stagger, cancelRef, direction);
    if (!anim) return Promise.resolve();
    if (activeAnims && triggerAnims && triggerName) {
      trackAnimation(anim, activeAnims, triggerAnims, triggerName);
    }
    return wrapStepPromise(
      animToPromise(
        anim,
        (typeof (anim as any).duration === 'number' ? (anim as any).duration : 1000) + 100,
      ),
      step,
    );
  }

  // animateDimension path
  if (step.fn === 'animateDimension') {
    if (!el) {
      return Promise.resolve();
    }
    const raw = animation ?? {};
    const prop: 'height' | 'width' = 'width' in raw ? 'width' : 'height';
    const anim = animateDimension(el, prop, direction, cancelRef, animation);
    if (!anim) return Promise.resolve();
    if (activeAnims && triggerAnims && triggerName) {
      trackAnimation(anim, activeAnims, triggerAnims, triggerName);
    }
    return wrapStepPromise(
      animToPromise(
        anim,
        (typeof (anim as any).duration === 'number' ? (anim as any).duration : 300) + 100,
      ),
      step,
    );
  }

  // animatePosition path
  if (step.fn === 'animatePosition') {
    if (!el) {
      return Promise.resolve();
    }
    const slotElements: Record<string, HTMLElement | null> = {};
    for (const [name, r] of Object.entries(refs)) {
      slotElements[name] = r.current;
    }
    const isFirstRun = cancelRefs.has(`${target}-position-first`)
      ? undefined
      : (() => {
          const fr = { current: true };
          cancelRefs.set(`${target}-position-first`, fr as any);
          return fr;
        })();
    const anim = animatePosition(el, animation, cancelRef, {
      slots: slotElements,
      vars,
      isFirstRun,
    });
    if (!anim) return Promise.resolve();
    if (activeAnims && triggerAnims && triggerName) {
      trackAnimation(anim, activeAnims, triggerAnims, triggerName);
    }
    return wrapStepPromise(
      animToPromise(
        anim,
        (typeof (anim as any).duration === 'number' ? (anim as any).duration : 300) + 100,
      ),
      step,
    );
  }

  // Default: moveAnimate
  if (!el) {
    return Promise.resolve();
  }
  if (!animation) {
    console.warn(`[useAnimations] No animation resolved for target: ${target}`);
    return Promise.resolve();
  }
  const anim = moveAnimate(el, animation, cancelRef);
  if (!anim) return Promise.resolve();
  if (activeAnims && triggerAnims && triggerName) {
    trackAnimation(anim, activeAnims, triggerAnims, triggerName);
  }
  // Looping animations never complete — resolve immediately
  if (isLooping(animation)) return Promise.resolve();
  let maxDur = 200;
  for (const val of Object.values(animation)) {
    if (typeof val === 'object' && val !== null && 'duration' in val) {
      maxDur = Math.max(maxDur, (val as any).duration ?? 200);
    }
  }
  return wrapStepPromise(animToPromise(anim, maxDur + 100), step);
}

/**
 * Execute a sequence of animation steps.
 * Top-level array = sequential, nested array = parallel.
 */
async function executeSequence(
  sequence: SequenceItem[],
  refs: RefMap,
  cancelRefs: Map<string, React.MutableRefObject<JSAnimation | null>>,
  defaultSlot: string,
  vars: Record<string, unknown> | ((el: HTMLElement) => Record<string, unknown>) | undefined,
  direction: 'enter' | 'exit',
  activeAnims?: Set<JSAnimation>,
  triggerAnims?: Map<string, JSAnimation>,
  triggerName?: string,
): Promise<void> {
  for (const item of sequence) {
    try {
      if (Array.isArray(item)) {
        // Parallel execution
        await Promise.all(
          item.map((step) => {
            const target = step.target ?? defaultSlot;
            const el = refs[target]?.current;
            const resolved = resolveVars(vars, el);
            return executeStep(
              step,
              refs,
              cancelRefs,
              defaultSlot,
              resolved,
              direction,
              activeAnims,
              triggerAnims,
              triggerName,
            );
          }),
        );
      } else {
        // Sequential single step
        const target = item.target ?? defaultSlot;
        const el = refs[target]?.current;
        const resolved = resolveVars(vars, el);
        await executeStep(
          item,
          refs,
          cancelRefs,
          defaultSlot,
          resolved,
          direction,
          activeAnims,
          triggerAnims,
          triggerName,
        );
      }
    } catch (err) {
      console.warn('[useAnimations] Step failed:', err);
    }
  }
}

/**
 * Parse a trigger string into its parts.
 *
 * Event triggers: "Slot.event" → { type: 'event', slot, event }
 * Lifecycle triggers: "Slot.enter"/"Slot.exit" → { type: 'lifecycle', slot, phase }
 * State triggers: "name" → { type: 'state', name }
 */
function parseTrigger(trigger: string): {
  type: 'event' | 'lifecycle' | 'state';
  slot?: string;
  event?: string;
  phase?: 'enter' | 'exit';
  name?: string;
} {
  const dotIdx = trigger.indexOf('.');
  if (dotIdx === -1) {
    return { type: 'state', name: trigger };
  }

  const slot = trigger.slice(0, dotIdx);
  const action = trigger.slice(dotIdx + 1);

  if (action === 'enter' || action === 'exit') {
    return { type: 'lifecycle', slot, phase: action };
  }

  return { type: 'event', slot, event: action };
}

/** Default "rest" values for CSS properties — used to reset after event triggers */
const REST_VALUES: Record<string, number> = {
  scale: 1,
  opacity: 1,
  x: 0,
  y: 0,
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  skewY: 0,
};

/**
 * Create a "reset" animation that returns to rest state.
 * Used as the auto-reverse for event triggers (mouseLeave, mouseUp).
 */
function createResetAnimation(anim: Animation): Animation {
  const reset: Record<string, unknown> = { duration: 0 };
  for (const [key, value] of Object.entries(anim)) {
    if (key === 'delay') continue;
    if (typeof value === 'object' && value !== null) {
      const propObj = value as Record<string, unknown>;
      // Reset to the `from` value if specified, otherwise use the property's rest value
      const resetTo = propObj.from ?? REST_VALUES[key];
      if (resetTo !== undefined) {
        reset[key] = { to: resetTo };
      }
    }
  }
  return reset as Animation;
}

/**
 * Create a reset sequence from a forward sequence.
 * Resolves presets and produces reset animations for all steps.
 */
function createResetSequence(sequence: SequenceItem[]): SequenceItem[] {
  return sequence.map((item) => {
    if (Array.isArray(item)) {
      return item.map((step) => {
        const anim = resolveStepAnimation(step);
        return {
          ...step,
          animation: anim ? createResetAnimation(anim) : undefined,
        };
      });
    }
    const anim = resolveStepAnimation(item);
    return {
      ...item,
      animation: anim ? createResetAnimation(anim) : undefined,
    };
  });
}

export interface UseAnimationsOptions {
  /** Called after all lifecycle enter sequences complete */
  onEnterComplete?: () => void;
}

export interface UseAnimationsReturn {
  /** Event handlers keyed by slot name, then by React event prop name */
  handlers: HandlerMap;
  /** Imperatively run all exit sequences (for close/dismiss animations) */
  runExit: () => Promise<void>;
  runEnter: () => Promise<void>;
  /** Pause all active animations */
  pauseAll: () => void;
  /** Resume all paused animations */
  resumeAll: () => void;
  /** Get the active JSAnimation for a trigger name (for targeted pause/resume) */
  getAnimation: (triggerName: string) => JSAnimation | null;
}

/**
 * Core animation orchestrator hook.
 *
 * Takes trigger-sequence config + slot refs, returns event handlers
 * for each slot. Automatically sets up MutationObservers for state triggers
 * and mount/unmount detection for lifecycle triggers.
 *
 * @param config - Array of trigger-sequence pairs, false to disable all, or null
 * @param refs - Map of slot name → React ref
 * @param states - State declarations for state triggers
 */
export function useAnimations(
  config: AnimationTrigger[] | false | null,
  refs: RefMap,
  states?: AnimationState[],
  options?: UseAnimationsOptions,
): UseAnimationsReturn {
  const cancelRefs = useRef(new Map<string, React.MutableRefObject<JSAnimation | null>>());
  const activeAnims = useRef(new Set<JSAnimation>());
  const triggerAnims = useRef(new Map<string, JSAnimation>());

  // Build handlers for event triggers
  const handlers = useMemo(() => {
    const result: HandlerMap = {};

    if (!config) return result;

    for (const triggerConfig of config) {
      if (triggerConfig.sequence === false) continue;

      const parsed = parseTrigger(triggerConfig.trigger);

      if (parsed.type === 'event' && parsed.slot && parsed.event) {
        const slot = parsed.slot;
        const event = parsed.event;
        const vars = triggerConfig.vars;

        if (!result[slot]) result[slot] = {};

        if (event === 'hover') {
          result[slot].onMouseEnter = () => {
            executeSequence(
              triggerConfig.sequence as SequenceItem[],
              refs,
              cancelRefs.current,
              slot,
              vars,
              'enter',
              activeAnims.current,
              triggerAnims.current,
              triggerConfig.trigger,
            ).then(() => triggerConfig.onComplete?.());
          };
          result[slot].onMouseLeave = () => {
            const resetSeq = createResetSequence(triggerConfig.sequence as SequenceItem[]);
            executeSequence(
              resetSeq,
              refs,
              cancelRefs.current,
              slot,
              vars,
              'exit',
              activeAnims.current,
              triggerAnims.current,
              triggerConfig.trigger,
            );
          };
        } else if (event === 'press') {
          // Find companion hover trigger for the same slot
          const hoverTrigger = config.find(
            (t) => t.trigger === `${slot}.hover` && t.sequence !== false,
          );

          result[slot].onMouseDown = () => {
            executeSequence(
              triggerConfig.sequence as SequenceItem[],
              refs,
              cancelRefs.current,
              slot,
              vars,
              'enter',
              activeAnims.current,
              triggerAnims.current,
              triggerConfig.trigger,
            ).then(() => triggerConfig.onComplete?.());
          };
          result[slot].onMouseUp = () => {
            if (hoverTrigger) {
              executeSequence(
                hoverTrigger.sequence as SequenceItem[],
                refs,
                cancelRefs.current,
                slot,
                hoverTrigger.vars,
                'enter',
                activeAnims.current,
                triggerAnims.current,
                hoverTrigger.trigger,
              );
            } else {
              const resetSeq = createResetSequence(triggerConfig.sequence as SequenceItem[]);
              executeSequence(
                resetSeq,
                refs,
                cancelRefs.current,
                slot,
                vars,
                'exit',
                activeAnims.current,
                triggerAnims.current,
                triggerConfig.trigger,
              );
            }
          };
          result[slot].onKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              executeSequence(
                triggerConfig.sequence as SequenceItem[],
                refs,
                cancelRefs.current,
                slot,
                vars,
                'enter',
                activeAnims.current,
                triggerAnims.current,
                triggerConfig.trigger,
              ).then(() => triggerConfig.onComplete?.());
            }
          };
          result[slot].onKeyUp = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              const resetSeq = createResetSequence(triggerConfig.sequence as SequenceItem[]);
              executeSequence(
                resetSeq,
                refs,
                cancelRefs.current,
                slot,
                vars,
                'exit',
                activeAnims.current,
                triggerAnims.current,
                triggerConfig.trigger,
              );
            }
          };
        }

        // Delegate events — attach on slot, animate matching child
        if (triggerConfig.delegate && (event === 'hover' || event === 'press')) {
          const delegate = triggerConfig.delegate;

          if (event === 'hover') {
            // Replace slot-level handlers with delegated versions
            delete result[slot].onMouseEnter;
            delete result[slot].onMouseLeave;
            result[slot].onDelegateSetup = (containerEl: HTMLElement) => {
              let currentTarget: HTMLElement | null = null;

              const handleEnter = (e: MouseEvent) => {
                const child = (e.target as HTMLElement).closest?.(delegate) as HTMLElement | null;
                if (!child || child === currentTarget) return;
                currentTarget = child;
                const cancelKey = `delegate-hover`;
                if (!cancelRefs.current.has(cancelKey)) {
                  cancelRefs.current.set(cancelKey, { current: null });
                }
                const cancelRef = cancelRefs.current.get(cancelKey)!;
                const resolvedVars = resolveVars(vars, child);
                for (const item of triggerConfig.sequence as SequenceItem[]) {
                  const step = Array.isArray(item) ? item[0] : item;
                  let anim = resolveStepAnimation(step);
                  if (anim && Object.keys(resolvedVars).length > 0) {
                    anim = resolveAnimationVars(anim, resolvedVars);
                  }
                  if (anim) moveAnimate(child, anim, cancelRef);
                }
              };

              const handleLeave = (e: MouseEvent) => {
                const child = (e.target as HTMLElement).closest?.(delegate) as HTMLElement | null;
                // Check if we're still within the same delegate child
                const related = (e.relatedTarget as HTMLElement)?.closest?.(delegate);
                if (related === child) return;
                if (!currentTarget) return;
                const el = currentTarget;
                currentTarget = null;
                const cancelKey = `delegate-hover`;
                const cancelRef = cancelRefs.current.get(cancelKey);
                const resetSeq = createResetSequence(triggerConfig.sequence as SequenceItem[]);
                for (const item of resetSeq) {
                  const step = Array.isArray(item) ? item[0] : item;
                  if (step.animation)
                    moveAnimate(el, step.animation, cancelRef ?? { current: null });
                }
              };

              containerEl.addEventListener('mouseenter', handleEnter, true);
              containerEl.addEventListener('mouseleave', handleLeave, true);
              return () => {
                containerEl.removeEventListener('mouseenter', handleEnter, true);
                containerEl.removeEventListener('mouseleave', handleLeave, true);
              };
            };
          }
        }
      }
    }

    return result;
  }, [config, refs]);

  // Delegate event setup — wire up capture listeners on container elements
  useEffect(() => {
    const cleanups: (() => void)[] = [];

    for (const [slotName, slotHandlers] of Object.entries(handlers)) {
      const setupFn = (slotHandlers as any).onDelegateSetup;
      if (setupFn) {
        const containerEl = refs[slotName]?.current;
        if (containerEl) {
          cleanups.push(setupFn(containerEl));
        }
      }
    }

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, [handlers, refs]);

  // State triggers — observe data-state mutations.
  // Tracks which DOM element + trigger name was last animated to avoid replaying
  // when the effect re-runs due to unstable config/states references.
  // Fires when: different element matches (pagination) OR different trigger fires (checkbox toggle).
  const lastAnimatedEntry = useRef(new Map<string, { el: WeakRef<Element>; trigger: string }>());

  useEffect(() => {
    if (!config || !states || states.length === 0) return;

    interface Watcher {
      slotName: string;
      source: string;
      value: string;
      triggerConfig: AnimationTrigger;
      initial: boolean;
    }

    const observeGroups = new Map<Element, Watcher[]>();

    for (const state of states) {
      const triggerConfig = config.find((t) => t.trigger === state.name);
      if (!triggerConfig || triggerConfig.sequence === false) continue;

      const slotRef = refs[state.slot];
      const slotEl = slotRef?.current;
      if (!slotEl) continue;

      const observeEl = state.closest ? slotEl.closest(state.closest) : slotEl;
      if (!observeEl) continue;

      if (!observeGroups.has(observeEl)) {
        observeGroups.set(observeEl, []);
      }
      observeGroups.get(observeEl)!.push({
        slotName: state.slot,
        source: state.source,
        value: state.value,
        triggerConfig,
        initial: state.initial !== false,
      });
    }

    const observers: MutationObserver[] = [];
    const animatedEntries = lastAnimatedEntry.current;

    // Helper: fire animation and record which element + trigger matched
    const fireWatcher = (watcher: Watcher, stateKey: string, matchedEl: Element) => {
      animatedEntries.set(stateKey, {
        el: new WeakRef(matchedEl),
        trigger: watcher.triggerConfig.trigger,
      });
      executeSequence(
        watcher.triggerConfig.sequence as SequenceItem[],
        refs,
        cancelRefs.current,
        watcher.slotName,
        watcher.triggerConfig.vars,
        'enter',
        activeAnims.current,
        triggerAnims.current,
        watcher.triggerConfig.trigger,
      ).then(() => watcher.triggerConfig.onComplete?.());
    };

    for (const [observeEl, watchers] of observeGroups) {
      const attributeFilter = [...new Set(watchers.map((w) => w.source))];

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type !== 'attributes') continue;
          const attrName = mutation.attributeName;
          if (!attrName) continue;

          const target = mutation.target as HTMLElement;
          const currentValue = target.getAttribute(attrName);

          for (const watcher of watchers) {
            if (watcher.source === attrName && currentValue === watcher.value) {
              const stateKey = `${watcher.slotName}:${watcher.source}`;
              fireWatcher(watcher, stateKey, target);
            }
          }
        }
      });

      observer.observe(observeEl, { attributes: true, attributeFilter, subtree: true });
      observers.push(observer);

      // Check current state and animate only if something actually changed.
      // On first mount: always fires (nothing tracked yet).
      // On effect re-runs (unstable deps): catches mutations lost when old observer
      // was disconnected, but skips if nothing changed. Fires when:
      //   - A different element now matches (pagination: active moves between items)
      //   - A different trigger now matches (checkbox: "checked" vs "unchecked")
      //   - First time (no previous entry)
      let initialFired = false;
      const allElements = [observeEl, ...Array.from(observeEl.querySelectorAll<HTMLElement>('*'))];
      for (const child of allElements) {
        if (initialFired) break;
        for (const watcher of watchers) {
          if (!watcher.initial) continue;
          const currentValue = child.getAttribute(watcher.source);
          if (currentValue === watcher.value) {
            const stateKey = `${watcher.slotName}:${watcher.source}`;
            const last = animatedEntries.get(stateKey);
            const lastEl = last?.el.deref();
            const lastTrigger = last?.trigger;
            // Skip only if same element AND same trigger (nothing changed)
            if (lastEl === child && lastTrigger === watcher.triggerConfig.trigger) {
              initialFired = true;
              break;
            }
            fireWatcher(watcher, stateKey, child);
            initialFired = true;
            break;
          }
        }
      }
    }

    return () => {
      for (const observer of observers) {
        observer.disconnect();
      }
    };
  }, [config, states, refs]);

  // Lifecycle triggers — run enter sequences before paint (useLayoutEffect avoids flash
  // for animateDimension which sets height:0 before measuring), exit via runExit()
  const lifecycleRan = useRef(false);
  const onEnterCompleteRef = useRef(options?.onEnterComplete);
  onEnterCompleteRef.current = options?.onEnterComplete;

  useLayoutEffect(() => {
    if (!config || lifecycleRan.current) return;
    lifecycleRan.current = true;

    const enterPromises: Promise<void>[] = [];

    for (const triggerConfig of config) {
      if (triggerConfig.sequence === false || triggerConfig.deps) continue;
      const parsed = parseTrigger(triggerConfig.trigger);

      if (parsed.type === 'lifecycle' && parsed.phase === 'enter' && parsed.slot) {
        const hasLoop = (triggerConfig.sequence as SequenceItem[]).some((item) => {
          if (Array.isArray(item)) {
            return item.some((step) => isLooping(resolveStepAnimation(step)));
          }
          return isLooping(resolveStepAnimation(item));
        });

        const promise = executeSequence(
          triggerConfig.sequence as SequenceItem[],
          refs,
          cancelRefs.current,
          parsed.slot,
          triggerConfig.vars,
          'enter',
          activeAnims.current,
          triggerAnims.current,
          triggerConfig.trigger,
        ).then(() => triggerConfig.onComplete?.());

        if (!hasLoop) {
          enterPromises.push(promise);
        }
      }
    }

    if (enterPromises.length > 0 && onEnterCompleteRef.current) {
      Promise.all(enterPromises).then(() => onEnterCompleteRef.current?.());
    }
  }, [config, refs]);

  // Deps-reactive triggers — re-run sequences when deps change
  const prevDepsRef = useRef(new Map<string, unknown[]>());

  useEffect(() => {
    if (!config) return;

    for (const triggerConfig of config) {
      if (!triggerConfig.deps) continue;

      const prevDeps = prevDepsRef.current.get(triggerConfig.trigger);
      const currentDeps = triggerConfig.deps;

      // Skip first run (handled by lifecycle enter or state triggers)
      if (!prevDeps) {
        prevDepsRef.current.set(triggerConfig.trigger, [...currentDeps]);
        continue;
      }

      // Shallow compare
      const changed =
        currentDeps.length !== prevDeps.length || currentDeps.some((dep, i) => dep !== prevDeps[i]);

      if (changed) {
        prevDepsRef.current.set(triggerConfig.trigger, [...currentDeps]);

        // Only execute when sequence is active (not disabled via false)
        if (triggerConfig.sequence !== false) {
          const parsed = parseTrigger(triggerConfig.trigger);
          const slot = parsed.slot ?? triggerConfig.trigger;
          const direction = triggerConfig.direction ?? 'enter';

          executeSequence(
            triggerConfig.sequence as SequenceItem[],
            refs,
            cancelRefs.current,
            slot,
            triggerConfig.vars,
            direction,
            activeAnims.current,
            triggerAnims.current,
            triggerConfig.trigger,
          ).then(() => triggerConfig.onComplete?.());
        }
      }
    }
  });

  // Provide a way to run exit sequences (called by Presence integration)
  const runExitSequences = useCallback(() => {
    if (!config) return Promise.resolve();

    const exitPromises: Promise<void>[] = [];

    for (const triggerConfig of config) {
      if (triggerConfig.sequence === false || triggerConfig.deps) continue;
      const parsed = parseTrigger(triggerConfig.trigger);

      if (parsed.type === 'lifecycle' && parsed.phase === 'exit' && parsed.slot) {
        exitPromises.push(
          executeSequence(
            triggerConfig.sequence as SequenceItem[],
            refs,
            cancelRefs.current,
            parsed.slot,
            triggerConfig.vars,
            'exit',
            activeAnims.current,
            triggerAnims.current,
            triggerConfig.trigger,
          ).then(() => triggerConfig.onComplete?.()),
        );
      }
    }

    return Promise.all(exitPromises).then(() => {});
  }, [config, refs]);

  // Re-run the lifecycle ENTER sequences on demand. Used to restore a popup to
  // its visible state when a close is cancelled mid-exit — re-entering animates
  // the container AND its staggered children back, so callers don't have to
  // enumerate every element the exit touched.
  const runEnterSequences = useCallback(() => {
    if (!config) return Promise.resolve();

    const enterPromises: Promise<void>[] = [];

    for (const triggerConfig of config) {
      if (triggerConfig.sequence === false || triggerConfig.deps) continue;
      const parsed = parseTrigger(triggerConfig.trigger);

      if (parsed.type === 'lifecycle' && parsed.phase === 'enter' && parsed.slot) {
        enterPromises.push(
          executeSequence(
            triggerConfig.sequence as SequenceItem[],
            refs,
            cancelRefs.current,
            parsed.slot,
            triggerConfig.vars,
            'enter',
            activeAnims.current,
            triggerAnims.current,
            triggerConfig.trigger,
          ).then(() => triggerConfig.onComplete?.()),
        );
      }
    }

    return Promise.all(enterPromises).then(() => {});
  }, [config, refs]);

  // Pause/resume controls
  const pauseAll = useCallback(() => {
    for (const anim of activeAnims.current) {
      anim.pause();
    }
  }, []);

  const resumeAll = useCallback(() => {
    for (const anim of activeAnims.current) {
      anim.play();
    }
  }, []);

  const getAnimation = useCallback((triggerName: string): JSAnimation | null => {
    return triggerAnims.current.get(triggerName) ?? null;
  }, []);

  const exitRef = useRef(runExitSequences);
  exitRef.current = runExitSequences;

  return {
    handlers,
    runExit: runExitSequences,
    runEnter: runEnterSequences,
    pauseAll,
    resumeAll,
    getAnimation,
  };
}
