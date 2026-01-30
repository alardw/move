import { useMemo, useRef, useEffect } from 'react';
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
  const presenceRef = useRef<PresenceContextValue>({
    isPresent,
    safeToRemove: () => {},
    initial,
  });

  const safeToRemoveRef = useRef(onExitComplete);
  safeToRemoveRef.current = onExitComplete;

  // Update isPresent on the ref so children can read it
  useEffect(() => {
    presenceRef.current.isPresent = isPresent;
  }, [isPresent]);

  // When not present and using manual control, wait for safeToRemove call
  useEffect(() => {
    if (!isPresent) {
      // Set up safeToRemove callback
      presenceRef.current.safeToRemove = () => {
        safeToRemoveRef.current();
      };
    }
  }, [isPresent]);

  const context = useMemo<PresenceContextValue>(
    () => ({
      get isPresent() {
        return presenceRef.current.isPresent;
      },
      safeToRemove: () => {
        presenceRef.current.safeToRemove();
      },
      initial,
    }),
    [initial]
  );

  return (
    <PresenceContext.Provider value={context}>
      {children}
    </PresenceContext.Provider>
  );
}
