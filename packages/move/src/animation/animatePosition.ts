import { animate, type JSAnimation } from 'animejs';
import { snappy } from './easings';
import { prefersReducedMotion } from './utils/helpers';
import type { Animation } from './types';

interface SlotMeasurement {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Measure position and size of a target element relative to a container.
 */
function measureSlot(
  container: HTMLElement,
  target: HTMLElement,
): SlotMeasurement {
  // Layout coordinates (offsetLeft/Top/Width/Height) — unaffected by a CSS
  // transform on an ancestor, unlike getBoundingClientRect. Walk the
  // offsetParent chain up to the container so the indicator stays aligned even
  // inside a transformed context (e.g. an isometric preview tilt). Kept
  // identical to usePositionTracker so every sliding indicator behaves the same.
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = target;
  while (node && node !== container) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }

  return {
    x,
    y,
    width: target.offsetWidth,
    height: target.offsetHeight,
  };
}

/**
 * Resolve a `$slot.property` expression against measured slot data.
 *
 * Supports:
 * - `$slotName.x`, `$slotName.y`, `$slotName.width`, `$slotName.height`
 */
function resolveSlotRef(
  expr: string,
  slots: Record<string, SlotMeasurement>,
): number | undefined {
  const match = expr.match(/^\$(\w+)\.(x|y|width|height)$/);
  if (!match) return undefined;

  const [, slotName, prop] = match;
  const measurement = slots[slotName];
  if (!measurement) return undefined;

  return measurement[prop as keyof SlotMeasurement];
}

/**
 * Resolve a `$var` expression against a vars context.
 */
function resolveVar(
  expr: string,
  vars: Record<string, unknown>,
): unknown | undefined {
  if (!expr.startsWith('$')) return undefined;
  const varName = expr.slice(1);
  return vars[varName];
}

/**
 * Evaluate a `calc($track.width - $thumb.width)` expression.
 *
 * Supports: `+`, `-`, `*`, `/` with `$slot.property` operands and numbers.
 */
function resolveCalc(
  expr: string,
  slots: Record<string, SlotMeasurement>,
  vars: Record<string, unknown>,
): number | undefined {
  const calcMatch = expr.match(/^calc\((.+)\)$/);
  if (!calcMatch) return undefined;

  const inner = calcMatch[1].trim();

  // Tokenize: split on operators while keeping them
  const tokens = inner.split(/\s*([-+*/])\s*/).filter(Boolean);
  if (tokens.length === 0) return undefined;

  // Resolve each token
  const resolved: (number | string)[] = [];
  for (const token of tokens) {
    if (['+', '-', '*', '/'].includes(token)) {
      resolved.push(token);
      continue;
    }

    // Try number
    const num = Number(token);
    if (!isNaN(num)) {
      resolved.push(num);
      continue;
    }

    // Try slot ref
    const slotVal = resolveSlotRef(token, slots);
    if (slotVal !== undefined) {
      resolved.push(slotVal);
      continue;
    }

    // Try var
    const varVal = resolveVar(token, vars);
    if (typeof varVal === 'number') {
      resolved.push(varVal);
      continue;
    }

    // Unresolvable
    return undefined;
  }

  // Evaluate left-to-right with operator precedence (* / before + -)
  // First pass: handle * and /
  const addTerms: (number | string)[] = [];
  let i = 0;
  while (i < resolved.length) {
    if (typeof resolved[i] === 'number') {
      let val = resolved[i] as number;
      while (i + 2 < resolved.length && (resolved[i + 1] === '*' || resolved[i + 1] === '/')) {
        const op = resolved[i + 1] as string;
        const next = resolved[i + 2] as number;
        val = op === '*' ? val * next : val / next;
        i += 2;
      }
      addTerms.push(val);
    } else {
      addTerms.push(resolved[i]);
    }
    i++;
  }

  // Second pass: handle + and -
  if (addTerms.length === 0) return undefined;
  let result = addTerms[0] as number;
  for (let j = 1; j + 1 < addTerms.length; j += 2) {
    const op = addTerms[j] as string;
    const val = addTerms[j + 1] as number;
    result = op === '+' ? result + val : result - val;
  }

  return result;
}

/**
 * Resolve a value that may contain `$slot.property`, `$var`, `calc()`, or a literal.
 */
function resolveValue(
  value: unknown,
  slots: Record<string, SlotMeasurement>,
  vars: Record<string, unknown>,
): unknown {
  if (typeof value !== 'string') return value;

  // calc() expression
  if (value.startsWith('calc(')) {
    const result = resolveCalc(value, slots, vars);
    if (result === undefined) {
      console.warn(`[animatePosition] Could not resolve expression: ${value}`);
      return undefined;
    }
    return result;
  }

  // $slot.property
  if (value.match(/^\$\w+\.\w+$/)) {
    const result = resolveSlotRef(value, slots);
    if (result === undefined) {
      console.warn(`[animatePosition] Could not resolve slot reference: ${value}`);
      return undefined;
    }
    return result;
  }

  // $var
  if (value.startsWith('$')) {
    const result = resolveVar(value, vars);
    if (result === undefined) {
      console.warn(`[animatePosition] Could not resolve variable: ${value}`);
      return undefined;
    }
    return result;
  }

  return value;
}

/**
 * Animate an element using position data resolved from slot measurements.
 *
 * Resolves `$slot.property` expressions, `calc()` expressions, and `$var`
 * references in animation values by measuring DOM elements.
 *
 * On first run, snaps to position without animation.
 *
 * @param indicator - Element to animate (e.g. sliding indicator)
 * @param animation - Animation config with potentially unresolved expressions
 * @param cancelRef - Ref to store/cancel the running animation
 * @param options - Slot elements and vars for resolution
 */
export function animatePosition(
  indicator: HTMLElement | null,
  animation: Animation | undefined,
  cancelRef: React.MutableRefObject<JSAnimation | null>,
  options: {
    container?: HTMLElement | null;
    slots?: Record<string, HTMLElement | null>;
    vars?: Record<string, unknown>;
    isFirstRun?: React.MutableRefObject<boolean>;
  } = {},
): JSAnimation | undefined {
  if (!indicator || !animation) return;

  const { container, slots: slotElements = {}, vars = {}, isFirstRun } = options;

  if (cancelRef.current) cancelRef.current.pause();

  // Measure all slots relative to container (or indicator's parent)
  const referenceEl = container ?? indicator.parentElement;
  if (!referenceEl) return;

  const measurements: Record<string, SlotMeasurement> = {};
  for (const [name, el] of Object.entries(slotElements)) {
    if (el) {
      measurements[name] = measureSlot(referenceEl as HTMLElement, el);
    }
  }

  // Resolve all animation values
  const resolved: Record<string, unknown> = {};
  let hasUnresolvable = false;

  for (const [key, value] of Object.entries(animation)) {
    if (key === 'delay') {
      resolved[key] = value;
      continue;
    }

    if (typeof value === 'object' && value !== null) {
      const propObj = value as Record<string, unknown>;
      const resolvedProp: Record<string, unknown> = {};

      for (const [propKey, propVal] of Object.entries(propObj)) {
        const resolvedVal = resolveValue(propVal, measurements, vars);
        if (resolvedVal === undefined && propVal !== undefined) {
          hasUnresolvable = true;
          continue;
        }
        resolvedProp[propKey] = resolvedVal;
      }

      resolved[key] = resolvedProp;
    } else {
      const resolvedVal = resolveValue(value, measurements, vars);
      if (resolvedVal === undefined && value !== undefined) {
        hasUnresolvable = true;
        continue;
      }
      resolved[key] = resolvedVal;
    }
  }

  if (hasUnresolvable) {
    // Still proceed with what we can resolve
  }

  // First-run snap
  if (isFirstRun?.current || prefersReducedMotion()) {
    if (isFirstRun) isFirstRun.current = false;
    const anim = animate(indicator, { ...resolved, duration: 0 } as any);
    cancelRef.current = anim;
    return anim;
  }

  // Animate with default snappy spring (overridable via ease in animation config)
  const anim = animate(indicator, {
    ...resolved,
    ease: (resolved as any).ease ?? snappy,
  } as any);
  cancelRef.current = anim;
  return anim;
}
