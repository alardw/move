import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { GlobalSlotProps, SlotPropsMap } from './types';

// =============================================================================
// Context
// =============================================================================

interface MoveContextValue {
  slotProps: GlobalSlotProps;
}

const MoveContext = createContext<MoveContextValue>({ slotProps: {} });

// =============================================================================
// Provider
// =============================================================================

export interface MoveProviderProps {
  children: ReactNode;
  /** Global slot-props overrides keyed by component name */
  slotProps?: GlobalSlotProps;
}

/**
 * MoveProvider — supplies global slot-props overrides to all Move components.
 *
 * @example
 * ```tsx
 * <MoveProvider slotProps={{
 *   Button: { root: { className: 'my-button' } },
 *   Badge: { root: { style: { fontWeight: 'bold' } } },
 * }}>
 *   <App />
 * </MoveProvider>
 * ```
 */
export function MoveProvider({ children, slotProps = {} }: MoveProviderProps) {
  const value = useMemo(() => ({ slotProps }), [slotProps]);
  return <MoveContext.Provider value={value}>{children}</MoveContext.Provider>;
}

MoveProvider.displayName = 'MoveProvider';

// =============================================================================
// Hook
// =============================================================================

/**
 * Get global slot-props overrides for a specific component
 */
export function useMoveContext<TSlots extends string>(
  componentName: string,
): { globalSP: SlotPropsMap<TSlots> } {
  const { slotProps } = useContext(MoveContext);
  return {
    globalSP: (slotProps[componentName] ?? {}) as SlotPropsMap<TSlots>,
  };
}
