// Factory
export { withMoveComponent } from './factory';

// Context
export { MoveProvider, useMoveContext } from './context';
export type { MoveProviderProps } from './context';

// Merge utilities
export { mergeSlotProps, createCx, createSp } from './slotUtils';

// Ref utilities
export { useMergedRef } from './useMergedRef';

export { composeHandlers } from './composeHandlers';
export type { ComposedHandler } from './composeHandlers';

// Child-tree inspection
export { containsElementOfType, elementTypeName } from './childUtils';

// Compose onto another component's element without taking its data-state.
export { ScopedSlot } from './ScopedSlot';
export type { ScopedSlotProps } from './ScopedSlot';

// Headless utilities
export { useControlledState } from './useControlledState';
export type { UseControlledStateOptions } from './useControlledState';
export { usePopupFocus } from './usePopupFocus';
export type { UsePopupFocusOptions, PopupFocusHandlers } from './usePopupFocus';

// Types
export type {
  SlotProps,
  SlotPropsMap,
  GlobalSlotProps,
  CxFn,
  SpFn,
  SlotFn,
  SetupContext,
  SetupReturn,
  MoveComponentOptions,
} from './types';
