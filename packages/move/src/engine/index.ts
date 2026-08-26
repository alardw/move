// Factory
export { withMoveComponent } from './factory';

// Context
export { MoveProvider, useMoveContext } from './context';
export type { MoveProviderProps } from './context';

// Merge utilities
export { mergeSlotProps, createCx, createSp } from './slotUtils';

// Ref utilities
export { useMergedRef } from './useMergedRef';

// Child-tree inspection
export { containsElementOfType, elementTypeName } from './childUtils';

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
