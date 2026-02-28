// Factory
export { withMoveComponent } from './factory';

// Context
export { MoveProvider, useMoveContext } from './context';
export type { MoveProviderProps } from './context';

// Merge utilities
export { mergeSlotProps, createCx, createSp } from './mergeProps';

// Ref utilities
export { useMergedRef } from './useMergedRef';

// Headless utilities
export { useControlledState } from './useControlledState';
export type { UseControlledStateOptions } from './useControlledState';

// Types
export type {
  SlotProps,
  SlotPropsMap,
  GlobalSlotProps,
  CxFn,
  SpFn,
  SetupContext,
  SetupReturn,
  MoveComponentOptions,
} from './types';
