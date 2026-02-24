import { useMemo, useRef } from 'react';
import { PresenceContext, type PresenceContextValue } from './PresenceContext';

interface PresenceChildProps {
  children: React.ReactNode;
  isPresent: boolean;
  onExitComplete: () => void;
  initial: boolean;
}

export function PresenceChild({
  children,
  isPresent,
  onExitComplete,
  initial,
}: PresenceChildProps) {
  const safeToRemoveRef = useRef(onExitComplete);
  safeToRemoveRef.current = onExitComplete;

  const context = useMemo<PresenceContextValue>(
    () => ({
      isPresent,
      safeToRemove: () => {
        safeToRemoveRef.current();
      },
      initial,
    }),
    [isPresent, initial]
  );

  return (
    <PresenceContext.Provider value={context}>
      {children}
    </PresenceContext.Provider>
  );
}
