import type { CSSProperties, Ref } from 'react';

// =============================================================================
// Slot Props
// =============================================================================

/** Props that can be applied to any slot element */
export interface SlotProps {
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
}

/** Instance-level slot-props overrides keyed by slot name */
export type SlotPropsMap<TSlots extends string = string> = Partial<
  Record<TSlots, SlotProps>
>;

/** Global slot-props keyed by component name, then slot name */
export type GlobalSlotProps = Record<string, SlotPropsMap>;

// =============================================================================
// Factory Utility Types
// =============================================================================

/** Resolves a CSS Module class for a slot, plus extras */
export type CxFn<TSlots extends string> = (
  slot: TSlots,
  ...extra: (string | false | null | undefined)[]
) => string;

/** Merges global + instance slot-props + local props for a slot */
export type SpFn<TSlots extends string> = (
  slot: TSlots,
  localProps?: SlotProps
) => SlotProps;

/** cx + sp combined for one element. Spread the result on a slotted node and the
 *  part is fully slot-props-themeable: the module class is merged with the
 *  consumer's className, and their style + any extra attrs are applied. The one
 *  obvious way to render a themeable slot — `<div {...slot('header')} />`. */
export type SlotFn<TSlots extends string> = (
  slot: TSlots,
  ...extra: (string | false | null | undefined)[]
) => SlotProps;

/** Context passed to every setup() function */
export interface SetupContext<
  TSlots extends string,
  TProps extends object,
  TRef,
> {
  /** Resolved props (defaults merged with user props, Move-specific keys removed) */
  props: TProps;
  /** Forwarded ref from React.forwardRef */
  ref: Ref<TRef>;
  /** Internal ref created by the factory */
  internalRef: React.RefObject<TRef | null>;
  /** CSS Module class resolver */
  cx: CxFn<TSlots>;
  /** Slot-props merge function */
  sp: SpFn<TSlots>;
  /** cx + sp combined — spread on a slotted element to make the part themeable */
  slot: SlotFn<TSlots>;
  /** HTML attributes (user props minus Move-specific keys) */
  attrs: Record<string, unknown>;
}

/** Value returned from setup() */
export interface SetupReturn {
  render: () => React.ReactNode;
}

/** Options for withMoveComponent */
export interface MoveComponentOptions<
  TSlots extends string,
  TProps extends object,
  TRef,
  TSubs extends Record<string, React.ComponentType<any>> = Record<string, never>,
> {
  /** Display name for React DevTools */
  name: string;
  /** CSS Module styles object */
  styles?: Record<string, string>;
  /** Slot names (used for type checking) */
  slots?: readonly TSlots[];
  /** Default prop values */
  defaults?: Partial<TProps>;
  /** Move-specific prop keys to strip from attrs */
  moveProps?: readonly string[];
  /** Sub-components to attach as static properties */
  subComponents?: TSubs;
  /** Setup function: receives context, returns { render } */
  setup: (context: SetupContext<TSlots, TProps, TRef>) => SetupReturn;
}
