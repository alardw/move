import type { AnimationTrigger, AnimationStep, SequenceItem } from './types';

/**
 * Extract steps targeting specific slots from a trigger's sequence.
 * Preserves parallel grouping structure.
 */
export function extractSteps(
  trigger: AnimationTrigger | undefined,
  targets: string[],
): SequenceItem[] | false {
  if (!trigger || trigger.sequence === false) return false;
  const result: SequenceItem[] = [];
  for (const item of trigger.sequence) {
    if (Array.isArray(item)) {
      const filtered = (item as AnimationStep[]).filter(
        (step) => step.target != null && targets.includes(step.target),
      );
      if (filtered.length > 0) result.push(filtered.length === 1 ? filtered[0] : filtered);
    } else {
      const step = item as AnimationStep;
      if (step.target != null && targets.includes(step.target)) result.push(step);
    }
  }
  return result.length > 0 ? result : false;
}

/**
 * Merge user animation overrides with component defaults.
 *
 * - `false` → returns null (all animations disabled)
 * - `null`/`undefined` → returns defaults unchanged
 * - Array of triggers → match by trigger name:
 *   - Unmentioned triggers keep defaults
 *   - `{ trigger, sequence: false }` → disable that trigger
 *   - `{ trigger, sequence }` → full replace of sequence
 *   - `vars` inherited from default unless re-declared
 */
export function resolveAnimationsConfig(
  defaults: AnimationTrigger[],
  userProp?: AnimationTrigger[] | false | null,
): AnimationTrigger[] | null {
  if (userProp === false) return null;
  if (!userProp || userProp.length === 0) return defaults;

  // Index user triggers by name for fast lookup
  const userByTrigger = new Map<string, AnimationTrigger>();
  for (const ut of userProp) {
    userByTrigger.set(ut.trigger, ut);
  }

  const result: AnimationTrigger[] = [];

  for (const defaultTrigger of defaults) {
    const userOverride = userByTrigger.get(defaultTrigger.trigger);

    if (!userOverride) {
      // Keep default unchanged
      result.push(defaultTrigger);
      continue;
    }

    if (userOverride.sequence === false) {
      // Trigger disabled — omit from result
      continue;
    }

    // Merge: sequence is full replace, vars inherited unless re-declared
    result.push({
      trigger: defaultTrigger.trigger,
      sequence: userOverride.sequence,
      vars: userOverride.vars ?? defaultTrigger.vars,
    });
  }

  // Add any user triggers not present in defaults (custom triggers)
  for (const ut of userProp) {
    if (ut.sequence !== false && !defaults.some((d) => d.trigger === ut.trigger)) {
      result.push(ut);
    }
  }

  return result;
}
