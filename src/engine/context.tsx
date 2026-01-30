import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { GlobalPassThrough, PassThrough } from './types';

// =============================================================================
// Context
// =============================================================================

interface MoveContextValue {
  pt: GlobalPassThrough;
}

const MoveContext = createContext<MoveContextValue>({ pt: {} });

// =============================================================================
// Provider
// =============================================================================

export interface MoveProviderProps {
  children: ReactNode;
  /** Global pass-through overrides keyed by component name */
  pt?: GlobalPassThrough;
}

/**
 * MoveProvider — supplies global PT overrides to all Move components.
 *
 * @example
 * ```tsx
 * <MoveProvider pt={{
 *   Button: { root: { className: 'my-button' } },
 *   Badge: { root: { style: { fontWeight: 'bold' } } },
 * }}>
 *   <App />
 * </MoveProvider>
 * ```
 */
export function MoveProvider({ children, pt = {} }: MoveProviderProps) {
  const value = useMemo(() => ({ pt }), [pt]);
  return (
    <MoveContext.Provider value={value}>
      {children}
    </MoveContext.Provider>
  );
}

MoveProvider.displayName = 'MoveProvider';

// =============================================================================
// Hook
// =============================================================================

/**
 * Get global PT overrides for a specific component
 */
export function useMoveContext<TSlots extends string>(
  componentName: string
): { globalPT: PassThrough<TSlots> } {
  const { pt } = useContext(MoveContext);
  return {
    globalPT: (pt[componentName] ?? {}) as PassThrough<TSlots>,
  };
}
