'use client';

import * as React from 'react';
import { AlertDialog as RadixAlertDialog } from 'radix-ui';
import { animate } from 'animejs';
import {
  toAnimeParams,
  toInstantParams,
  prefersReducedMotion,
  mergeAnimateConfig,
} from '../../animation/utils';
import { defaultAnimations, type OverlayAnimate } from '../../animation/types';
import styles from './AlertDialog.module.css';

// ============================================================================
// Context
// ============================================================================

interface AlertDialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAnimatingOut: boolean;
  onExitComplete: () => void;
  registerAnimatedElement: () => void;
  unregisterAnimatedElement: () => void;
}

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(null);

function useAlertDialogContext() {
  const context = React.useContext(AlertDialogContext);
  if (!context) {
    throw new Error('AlertDialog components must be used within AlertDialog.Root');
  }
  return context;
}

// ============================================================================
// Root
// ============================================================================

export interface AlertDialogRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const AlertDialogRoot: React.FC<AlertDialogRootProps> = ({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  children,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const [isAnimatingOut, setIsAnimatingOut] = React.useState(false);
  const exitCount = React.useRef(0);
  const expectedExits = React.useRef(0);
  const pendingClose = React.useRef(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current && !open) {
      setIsAnimatingOut(true);
      exitCount.current = 0;
      pendingClose.current = true;
    }
    prevOpen.current = open;
  }, [open]);

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  const handleExitComplete = React.useCallback(() => {
    exitCount.current++;
    // Wait for all registered animated elements to complete
    if (exitCount.current >= expectedExits.current && pendingClose.current) {
      pendingClose.current = false;
      setIsAnimatingOut(false);
    }
  }, []);

  const registerAnimatedElement = React.useCallback(() => {
    expectedExits.current++;
  }, []);

  const unregisterAnimatedElement = React.useCallback(() => {
    expectedExits.current = Math.max(0, expectedExits.current - 1);
  }, []);

  const radixOpen = open || isAnimatingOut;

  return (
    <AlertDialogContext.Provider
      value={{
        open,
        onOpenChange: handleOpenChange,
        isAnimatingOut,
        onExitComplete: handleExitComplete,
        registerAnimatedElement,
        unregisterAnimatedElement,
      }}
    >
      <RadixAlertDialog.Root open={radixOpen} onOpenChange={handleOpenChange}>
        {children}
      </RadixAlertDialog.Root>
    </AlertDialogContext.Provider>
  );
};
AlertDialogRoot.displayName = 'AlertDialog.Root';

// ============================================================================
// Trigger
// ============================================================================

export interface AlertDialogTriggerProps
  extends React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Trigger> {
  className?: string;
}

const AlertDialogTrigger = React.forwardRef<
  React.ElementRef<typeof RadixAlertDialog.Trigger>,
  AlertDialogTriggerProps
>(({ className, ...props }, ref) => (
  <RadixAlertDialog.Trigger
    ref={ref}
    className={`${styles.trigger} ${className || ''}`}
    {...props}
  />
));
AlertDialogTrigger.displayName = 'AlertDialog.Trigger';

// ============================================================================
// Portal
// ============================================================================

export interface AlertDialogPortalProps
  extends React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Portal> {}

const AlertDialogPortal: React.FC<AlertDialogPortalProps> = (props) => (
  <RadixAlertDialog.Portal {...props} />
);
AlertDialogPortal.displayName = 'AlertDialog.Portal';

// ============================================================================
// Overlay
// ============================================================================

export interface AlertDialogOverlayProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Overlay>, 'ref'> {
  className?: string;
  /**
   * Animation configuration for enter/exit.
   * @default defaultAnimations.overlayBackdrop
   */
  animate?: OverlayAnimate;
}

const AlertDialogOverlay = React.forwardRef<HTMLDivElement, AlertDialogOverlayProps>(
  ({ className, animate: animateProp, ...props }, forwardedRef) => {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const {
      isAnimatingOut,
      onExitComplete,
      registerAnimatedElement,
      unregisterAnimatedElement,
    } = useAlertDialogContext();
    const hasAnimatedIn = React.useRef(false);

    // Store config in ref for stable access
    const configRef = React.useRef<OverlayAnimate>(defaultAnimations.overlayBackdrop);
    configRef.current = mergeAnimateConfig(defaultAnimations.overlayBackdrop, animateProp);

    // Register this element for exit coordination
    React.useEffect(() => {
      registerAnimatedElement();
      return () => unregisterAnimatedElement();
    }, [registerAnimatedElement, unregisterAnimatedElement]);

    // Enter animation
    React.useEffect(() => {
      if (!ref.current || hasAnimatedIn.current) return;
      hasAnimatedIn.current = true;

      const config = configRef.current;
      if (!config.enter) return;

      const params = prefersReducedMotion()
        ? toInstantParams(config.enter)
        : toAnimeParams(config.enter);
      animate(ref.current, params);
    }, []);

    // Exit animation
    React.useEffect(() => {
      if (!isAnimatingOut || !ref.current) return;

      const config = configRef.current;
      if (!config.exit) {
        onExitComplete();
        return;
      }

      const params = prefersReducedMotion()
        ? toInstantParams(config.exit)
        : toAnimeParams(config.exit);
      animate(ref.current, {
        ...params,
        onComplete: onExitComplete,
      });
    }, [isAnimatingOut, onExitComplete]);

    return (
      <RadixAlertDialog.Overlay
        ref={(node) => {
          ref.current = node;
          if (typeof forwardedRef === 'function') forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={`${styles.overlay} ${className || ''}`}
        {...props}
      />
    );
  }
);
AlertDialogOverlay.displayName = 'AlertDialog.Overlay';

// ============================================================================
// Content
// ============================================================================

export interface AlertDialogContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Content>, 'ref'> {
  className?: string;
  /**
   * Animation configuration for enter/exit.
   * @default defaultAnimations.overlay
   */
  animate?: OverlayAnimate;
}

const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ className, animate: animateProp, ...props }, forwardedRef) => {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const {
      isAnimatingOut,
      onExitComplete,
      registerAnimatedElement,
      unregisterAnimatedElement,
    } = useAlertDialogContext();
    const hasAnimatedIn = React.useRef(false);

    // Store config in ref for stable access
    const configRef = React.useRef<OverlayAnimate>(defaultAnimations.overlay);
    configRef.current = mergeAnimateConfig(defaultAnimations.overlay, animateProp);

    // Register this element for exit coordination
    React.useEffect(() => {
      registerAnimatedElement();
      return () => unregisterAnimatedElement();
    }, [registerAnimatedElement, unregisterAnimatedElement]);

    // Enter animation
    React.useEffect(() => {
      if (!ref.current || hasAnimatedIn.current) return;
      hasAnimatedIn.current = true;

      const config = configRef.current;
      if (!config.enter) return;

      const params = prefersReducedMotion()
        ? toInstantParams(config.enter)
        : toAnimeParams(config.enter);
      animate(ref.current, params);
    }, []);

    // Exit animation
    React.useEffect(() => {
      if (!isAnimatingOut || !ref.current) return;

      const config = configRef.current;
      if (!config.exit) {
        onExitComplete();
        return;
      }

      const params = prefersReducedMotion()
        ? toInstantParams(config.exit)
        : toAnimeParams(config.exit);
      animate(ref.current, {
        ...params,
        onComplete: onExitComplete,
      });
    }, [isAnimatingOut, onExitComplete]);

    return (
      <RadixAlertDialog.Content
        ref={(node) => {
          ref.current = node;
          if (typeof forwardedRef === 'function') forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={`${styles.content} ${className || ''}`}
        {...props}
      />
    );
  }
);
AlertDialogContent.displayName = 'AlertDialog.Content';

// ============================================================================
// Title
// ============================================================================

export interface AlertDialogTitleProps
  extends React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Title> {
  className?: string;
}

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof RadixAlertDialog.Title>,
  AlertDialogTitleProps
>(({ className, ...props }, ref) => (
  <RadixAlertDialog.Title
    ref={ref}
    className={`${styles.title} ${className || ''}`}
    {...props}
  />
));
AlertDialogTitle.displayName = 'AlertDialog.Title';

// ============================================================================
// Description
// ============================================================================

export interface AlertDialogDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Description> {
  className?: string;
}

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof RadixAlertDialog.Description>,
  AlertDialogDescriptionProps
>(({ className, ...props }, ref) => (
  <RadixAlertDialog.Description
    ref={ref}
    className={`${styles.description} ${className || ''}`}
    {...props}
  />
));
AlertDialogDescription.displayName = 'AlertDialog.Description';

// ============================================================================
// Cancel
// ============================================================================

export interface AlertDialogCancelProps
  extends React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Cancel> {
  className?: string;
}

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof RadixAlertDialog.Cancel>,
  AlertDialogCancelProps
>(({ className, ...props }, ref) => (
  <RadixAlertDialog.Cancel
    ref={ref}
    className={`${styles.cancel} ${className || ''}`}
    {...props}
  />
));
AlertDialogCancel.displayName = 'AlertDialog.Cancel';

// ============================================================================
// Action
// ============================================================================

export interface AlertDialogActionProps
  extends React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Action> {
  className?: string;
}

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof RadixAlertDialog.Action>,
  AlertDialogActionProps
>(({ className, ...props }, ref) => (
  <RadixAlertDialog.Action
    ref={ref}
    className={`${styles.action} ${className || ''}`}
    {...props}
  />
));
AlertDialogAction.displayName = 'AlertDialog.Action';

// ============================================================================
// Export
// ============================================================================

export const AlertDialog = {
  Root: AlertDialogRoot,
  Trigger: AlertDialogTrigger,
  Portal: AlertDialogPortal,
  Overlay: AlertDialogOverlay,
  Content: AlertDialogContent,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Cancel: AlertDialogCancel,
  Action: AlertDialogAction,
};
