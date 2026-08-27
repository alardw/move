import {
  useState,
  useRef,
  useLayoutEffect,
  Children,
  isValidElement,
  cloneElement,
  type ReactElement,
  type ReactNode,
  type Key,
} from 'react';
import { PresenceChild } from './PresenceChild';

type ChildWithKey = ReactElement & { key: Key };

function getChildKey(child: ReactElement): Key {
  return child.key ?? '';
}

function onlyElements(children: ReactNode): ChildWithKey[] {
  const result: ChildWithKey[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      result.push(child as ChildWithKey);
    }
  });
  return result;
}

export interface PresenceProps {
  children: ReactNode;
  /** Callback when all exiting children have completed their animations */
  onExitComplete?: () => void;
  /** Set to false to disable initial animations on first render */
  initial?: boolean;
  /**
   * Animation mode:
   * - "sync": Exiting and entering children animate simultaneously (default)
   * - "wait": Wait for exiting children to finish before entering new ones
   */
  mode?: 'sync' | 'wait';
}

interface ChildState {
  element: ChildWithKey;
  isPresent: boolean;
}

export function Presence({
  children,
  onExitComplete,
  initial = true,
  mode = 'sync',
}: PresenceProps) {
  const [childStates, setChildStates] = useState<Map<Key, ChildState>>(new Map());
  const exitingKeys = useRef(new Set<Key>());
  const isInitialRender = useRef(true);
  const pendingChildren = useRef<ChildWithKey[]>([]);

  const presentChildren = onlyElements(children);

  // Create a stable key string to detect actual changes
  const presentKeysString = presentChildren.map(getChildKey).join(',');

  useLayoutEffect(() => {
    const presentKeys = new Set(presentChildren.map(getChildKey));
    const prevKeys = new Set(childStates.keys());

    // Check if anything actually changed
    let hasChanges = false;

    // Check for new children
    const entering: ChildWithKey[] = [];
    for (const child of presentChildren) {
      const key = getChildKey(child);
      if (!prevKeys.has(key)) {
        entering.push(child);
        hasChanges = true;
      }
    }

    // Check for removed children
    const exiting: Key[] = [];
    for (const key of prevKeys) {
      if (!presentKeys.has(key) && !exitingKeys.current.has(key)) {
        exiting.push(key);
        exitingKeys.current.add(key);
        hasChanges = true;
      }
    }

    // Also check if present children elements need updating
    for (const child of presentChildren) {
      const key = getChildKey(child);
      const existing = childStates.get(key);
      if (existing && existing.element !== child) {
        hasChanges = true;
        break;
      }
    }

    // On initial render, we need to set up state
    if (isInitialRender.current && presentChildren.length > 0) {
      hasChanges = true;
    }

    if (!hasChanges) {
      isInitialRender.current = false;
      return;
    }

    // In wait mode, if there are exiting children, don't add entering ones yet
    if (mode === 'wait' && exiting.length > 0 && entering.length > 0) {
      pendingChildren.current = entering;
    } else {
      pendingChildren.current = [];
    }

    setChildStates((prev) => {
      const next = new Map(prev);

      // Update existing present children with new elements
      for (const child of presentChildren) {
        const key = getChildKey(child);
        const existing = next.get(key);
        if (existing) {
          next.set(key, { element: child, isPresent: true });
        } else if (mode !== 'wait' || exiting.length === 0) {
          // Add new children (unless in wait mode with pending exits)
          next.set(key, { element: child, isPresent: true });
        }
      }

      // Mark exiting children
      for (const key of exiting) {
        const existing = next.get(key);
        if (existing) {
          next.set(key, { ...existing, isPresent: false });
        }
      }

      return next;
    });

    isInitialRender.current = false;
    // `childStates and presentChildren` deliberately absent: this runs when the KEY SET changes, which `presentKeysString` captures;
    // the other two are read for their current values at that moment and must not
    // re-trigger it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presentKeysString, mode]);

  const handleExitComplete = (key: Key) => {
    exitingKeys.current.delete(key);

    setChildStates((prev) => {
      const next = new Map(prev);
      next.delete(key);

      // In wait mode, add pending children after all exits complete
      if (mode === 'wait' && exitingKeys.current.size === 0 && pendingChildren.current.length > 0) {
        for (const child of pendingChildren.current) {
          const childKey = getChildKey(child);
          next.set(childKey, { element: child, isPresent: true });
        }
        pendingChildren.current = [];
      }

      return next;
    });

    // Fire callback when all exits are done
    if (exitingKeys.current.size === 0) {
      onExitComplete?.();
    }
  };

  const renderedChildren: ReactElement[] = [];

  childStates.forEach((state, key) => {
    renderedChildren.push(
      <PresenceChild
        key={key}
        isPresent={state.isPresent}
        onExitComplete={() => handleExitComplete(key)}
        initial={initial && !isInitialRender.current}
      >
        {cloneElement(state.element)}
      </PresenceChild>,
    );
  });

  return <>{renderedChildren}</>;
}
