import { useCallback } from 'react';
import { useControlledState } from '../../../engine/useControlledState';

// =============================================================================
// Types
// =============================================================================

export interface UseCollapsibleOptions {
  /** Controlled open state */
  open?: boolean;
  /** Default open state for uncontrolled mode */
  defaultOpen?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
}

export interface UseCollapsibleReturn {
  /** Current open state */
  open: boolean;
  /** Toggle open/closed */
  toggle: () => void;
  /** Set open state directly */
  setOpen: (open: boolean) => void;
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Headless collapsible hook.
 * Manages a simple open/closed toggle with controlled/uncontrolled support.
 */
export function useCollapsible(options: UseCollapsibleOptions = {}): UseCollapsibleReturn {
  const [open, setOpen] = useControlledState<boolean>({
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    onChange: options.onOpenChange,
  });

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  return { open, toggle, setOpen };
}
