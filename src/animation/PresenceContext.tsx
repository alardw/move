import { createContext, useContext } from 'react';

export interface PresenceContextValue {
  isPresent: boolean;
  safeToRemove: () => void;
  initial: boolean;
}

export const PresenceContext = createContext<PresenceContextValue | null>(null);

export function usePresence(): [boolean, () => void] {
  const context = useContext(PresenceContext);

  if (!context) {
    // Not wrapped in Presence - always present, safeToRemove is no-op
    return [true, () => {}];
  }

  return [context.isPresent, context.safeToRemove];
}

export function useIsPresent(): boolean {
  const context = useContext(PresenceContext);
  return context ? context.isPresent : true;
}
