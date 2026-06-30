import type { SlotProps, SlotPropsMap, CxFn, SpFn } from './types';

/**
 * Merge class names (filters falsy values)
 */
function mergeClassNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Merge two style objects (later wins)
 */
function mergeStyles(
  a?: React.CSSProperties,
  b?: React.CSSProperties,
): React.CSSProperties | undefined {
  if (!a && !b) return undefined;
  if (!a) return b;
  if (!b) return a;
  return { ...a, ...b };
}

/**
 * Merge slot props: className concatenated, style shallow-merged, rest spread (later wins).
 */
export function mergeSlotProps(...sources: (SlotProps | undefined)[]): SlotProps {
  const result: SlotProps = {};

  const classNames: string[] = [];
  let mergedStyle: React.CSSProperties | undefined;

  for (const source of sources) {
    if (!source) continue;

    const { className, style, ...rest } = source;

    if (className) classNames.push(className);
    mergedStyle = mergeStyles(mergedStyle, style as React.CSSProperties | undefined);

    // Spread remaining props (later wins)
    Object.assign(result, rest);
  }

  if (classNames.length > 0) {
    result.className = classNames.join(' ');
  }
  if (mergedStyle) {
    result.style = mergedStyle;
  }

  return result;
}

/**
 * Create a cx() function that resolves CSS Module class for a slot + extras
 */
export function createCx<TSlots extends string>(styles?: Record<string, string>): CxFn<TSlots> {
  return (slot, ...extra) => {
    const moduleClass = styles?.[slot] ?? '';
    return mergeClassNames(moduleClass, ...extra);
  };
}

/**
 * Create an sp() function that merges global + instance slot-props + local props for a slot
 */
export function createSp<TSlots extends string>(
  globalSP?: SlotPropsMap<TSlots>,
  instanceSP?: SlotPropsMap<TSlots>,
): SpFn<TSlots> {
  return (slot, localProps?) => {
    return mergeSlotProps(globalSP?.[slot], instanceSP?.[slot], localProps);
  };
}
