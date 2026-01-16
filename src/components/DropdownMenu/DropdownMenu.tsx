'use client';

import * as React from 'react';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import { animate, spring } from 'animejs';
import styles from './DropdownMenu.module.css';

const springConfig = { mass: 0.6, stiffness: 400, damping: 20, velocity: 0 };

interface DropdownMenuContextValue {
  isClosing: boolean;
  onCloseComplete: () => void;
  close: () => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('DropdownMenu components must be used within DropdownMenu.Root');
  }
  return context;
}

export interface DropdownMenuRootProps extends Omit<React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Root>, 'open' | 'onOpenChange'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DropdownMenuRoot: React.FC<DropdownMenuRootProps> = ({ open: controlledOpen, defaultOpen, onOpenChange, ...props }) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const [isClosing, setIsClosing] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (newOpen) {
      if (!isControlled) {
        setUncontrolledOpen(true);
      }
      onOpenChange?.(true);
    }
    // Ignore close requests from Radix - we handle closing ourselves via close()
  }, [isControlled, onOpenChange]);

  const handleCloseComplete = React.useCallback(() => {
    setIsClosing(false);
    if (!isControlled) {
      setUncontrolledOpen(false);
    }
    onOpenChange?.(false);
  }, [isControlled, onOpenChange]);

  const close = React.useCallback(() => {
    setIsClosing(true);
  }, []);

  return (
    <DropdownMenuContext.Provider value={{ isClosing, onCloseComplete: handleCloseComplete, close }}>
      <RadixDropdownMenu.Root open={open || isClosing} onOpenChange={handleOpenChange} {...props} />
    </DropdownMenuContext.Provider>
  );
};
DropdownMenuRoot.displayName = 'DropdownMenu.Root';

export interface DropdownMenuTriggerProps extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Trigger> {
  className?: string;
}

const DropdownMenuTrigger = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.Trigger>,
  DropdownMenuTriggerProps
>(({ className, ...props }, ref) => (
  <RadixDropdownMenu.Trigger
    ref={ref}
    className={`${styles.trigger} ${className || ''}`}
    {...props}
  />
));
DropdownMenuTrigger.displayName = 'DropdownMenu.Trigger';

export interface DropdownMenuPortalProps extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Portal> {}

const DropdownMenuPortal: React.FC<DropdownMenuPortalProps> = (props) => (
  <RadixDropdownMenu.Portal {...props} />
);
DropdownMenuPortal.displayName = 'DropdownMenu.Portal';

export interface DropdownMenuContentProps extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Content> {
  className?: string;
}

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.Content>,
  DropdownMenuContentProps
>(({ className, children, onPointerDownOutside, onEscapeKeyDown, onInteractOutside, ...props }, ref) => {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const animRef = React.useRef<ReturnType<typeof animate> | null>(null);
  const itemsAnimRef = React.useRef<ReturnType<typeof animate> | null>(null);
  const { isClosing, onCloseComplete, close } = useDropdownMenuContext();
  const [isAnimatingOut, setIsAnimatingOut] = React.useState(false);

  // Intercept close events to trigger animation
  const handlePointerDownOutside = (e: Event) => {
    e.preventDefault();
    onPointerDownOutside?.(e as any);
    close();
  };

  const handleEscapeKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();
    onEscapeKeyDown?.(e as any);
    close();
  };

  const handleInteractOutside = (e: Event) => {
    e.preventDefault();
    onInteractOutside?.(e as any);
    close();
  };

  // Animate open on mount
  React.useLayoutEffect(() => {
    const content = contentRef.current;
    const inner = innerRef.current;
    if (!content || !inner) return;

    if (animRef.current) animRef.current.pause();
    if (itemsAnimRef.current) itemsAnimRef.current.pause();

    const targetHeight = inner.scrollHeight;

    // Set initial state for content
    content.style.height = '0px';
    content.style.opacity = '1';
    content.style.transform = 'scale(0.5)';
    // Animate height and scale (shadow handled by CSS)
    animRef.current = animate(content, {
      height: targetHeight,
      scale: 1,
      ease: 'outQuart',
      duration: 250,
      onComplete: () => {
        if (content) content.style.height = 'auto';
        // Trigger focus on the first enabled item after animation
        // Dispatch ArrowDown to let Radix handle highlighting properly
        if (content) {
          content.focus();
          content.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'ArrowDown',
            code: 'ArrowDown',
            bubbles: true,
          }));
        }
      },
    });

    // Stagger animate the menu items
    const items = inner.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]');
    items.forEach((item) => {
      const el = item as HTMLElement;
      el.style.opacity = '0';
      el.style.transform = 'scale(0.8)';
    });

    itemsAnimRef.current = animate(items, {
      opacity: 1,
      scale: 1,
      ease: spring(springConfig),
      delay: (_el, i) => i * 30,
    });
  }, []);

  // When isClosing becomes true, start local animation state
  React.useEffect(() => {
    if (isClosing && !isAnimatingOut) {
      setIsAnimatingOut(true);
    }
  }, [isClosing, isAnimatingOut]);

  // Animate close when isAnimatingOut becomes true
  React.useEffect(() => {
    if (!isAnimatingOut) return;

    const content = contentRef.current;
    const inner = innerRef.current;
    if (!content || !inner) return;

    if (animRef.current) animRef.current.pause();
    if (itemsAnimRef.current) itemsAnimRef.current.pause();

    // Lock height before animating
    content.style.height = `${content.offsetHeight}px`;

    const items = inner.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]');
    const itemCount = items.length;

    // Stagger animate items out in reverse
    itemsAnimRef.current = animate(items, {
      opacity: 0,
      scale: 0.8,
      ease: 'outQuart',
      duration: 150,
      delay: (_el, i) => (itemCount - 1 - i) * 20,
    });

    // Animate height and padding closed - start early and overlap with items
    animRef.current = animate(content, {
      height: 0,
      paddingTop: 0,
      paddingBottom: 0,
      ease: 'outQuart',
      duration: 200,
      delay: 50,
      onComplete: () => onCloseComplete(),
    });

    // Fade out opacity near the end
    animate(content, {
      opacity: 0,
      ease: 'outQuart',
      duration: 100,
      delay: 150,
    });
  }, [isAnimatingOut, onCloseComplete]);

  return (
    <RadixDropdownMenu.Content
      ref={(node) => {
        contentRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={`${styles.content} ${className || ''}`}
      onPointerDownOutside={handlePointerDownOutside}
      onEscapeKeyDown={handleEscapeKeyDown}
      onInteractOutside={handleInteractOutside}
      {...props}
    >
      <div ref={innerRef} className={styles.contentInner}>
        {children}
      </div>
    </RadixDropdownMenu.Content>
  );
});
DropdownMenuContent.displayName = 'DropdownMenu.Content';

export interface DropdownMenuArrowProps extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Arrow> {
  className?: string;
}

const DropdownMenuArrow = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.Arrow>,
  DropdownMenuArrowProps
>(({ className, ...props }, ref) => (
  <RadixDropdownMenu.Arrow
    ref={ref}
    className={`${styles.arrow} ${className || ''}`}
    {...props}
  />
));
DropdownMenuArrow.displayName = 'DropdownMenu.Arrow';

export interface DropdownMenuItemProps extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Item> {
  className?: string;
}

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.Item>,
  DropdownMenuItemProps
>(({ className, onSelect, ...props }, ref) => {
  const { close } = useDropdownMenuContext();
  const itemRef = React.useRef<HTMLDivElement | null>(null);
  const animRef = React.useRef<ReturnType<typeof animate> | null>(null);

  const handleSelect = (e: Event) => {
    e.preventDefault();
    onSelect?.(e);
    close();
  };

  const handleMouseEnter = () => {
    if (!itemRef.current) return;
    if (animRef.current) animRef.current.pause();
    animRef.current = animate(itemRef.current, {
      scale: 1.02,
      ease: spring(springConfig),
    });
  };

  const handleMouseLeave = () => {
    if (!itemRef.current) return;
    if (animRef.current) animRef.current.pause();
    animRef.current = animate(itemRef.current, {
      scale: 1,
      ease: spring(springConfig),
    });
  };

  return (
    <RadixDropdownMenu.Item
      ref={(node) => {
        itemRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={`${styles.item} ${className || ''}`}
      onSelect={handleSelect}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    />
  );
});
DropdownMenuItem.displayName = 'DropdownMenu.Item';

export interface DropdownMenuGroupProps extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Group> {
  className?: string;
}

const DropdownMenuGroup = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.Group>,
  DropdownMenuGroupProps
>(({ className, ...props }, ref) => (
  <RadixDropdownMenu.Group
    ref={ref}
    className={`${styles.group} ${className || ''}`}
    {...props}
  />
));
DropdownMenuGroup.displayName = 'DropdownMenu.Group';

export interface DropdownMenuLabelProps extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Label> {
  className?: string;
}

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.Label>,
  DropdownMenuLabelProps
>(({ className, ...props }, ref) => (
  <RadixDropdownMenu.Label
    ref={ref}
    className={`${styles.label} ${className || ''}`}
    {...props}
  />
));
DropdownMenuLabel.displayName = 'DropdownMenu.Label';

export interface DropdownMenuCheckboxItemProps extends Omit<React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.CheckboxItem>, 'children'> {
  className?: string;
  /** Icon name for the check indicator */
  icon?: string;
  children?: React.ReactNode;
}

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.CheckboxItem>,
  DropdownMenuCheckboxItemProps
>(({ className, onSelect, checked, icon = 'check', children, ...props }, ref) => {
  const { close } = useDropdownMenuContext();
  const itemRef = React.useRef<HTMLDivElement | null>(null);
  const indicatorRef = React.useRef<HTMLSpanElement>(null);
  const animRef = React.useRef<ReturnType<typeof animate> | null>(null);
  const isFirstRender = React.useRef(true);

  // Set initial indicator state
  React.useEffect(() => {
    const el = indicatorRef.current;
    if (!el) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      el.style.opacity = checked ? '1' : '0';
      el.style.transform = checked ? 'scale(1)' : 'scale(0.5)';
    }
  }, []);

  // Animate indicator on checked change
  React.useEffect(() => {
    if (isFirstRender.current) return;
    const el = indicatorRef.current;
    if (!el) return;

    if (checked) {
      animate(el, {
        opacity: [0, 1],
        scale: [0.5, 1],
        ease: spring({ mass: 0.8, stiffness: 500, damping: 15 }),
      });
    } else {
      animate(el, {
        opacity: [1, 0],
        scale: [1, 0.5],
        duration: 150,
        ease: 'outQuad',
      });
    }
  }, [checked]);

  const handleSelect = (e: Event) => {
    // Don't prevent default - let the checkbox toggle
    onSelect?.(e);
    // Don't close the menu for checkbox items
  };

  const handleMouseEnter = () => {
    if (!itemRef.current) return;
    if (animRef.current) animRef.current.pause();
    animRef.current = animate(itemRef.current, {
      scale: 1.02,
      ease: spring(springConfig),
    });
  };

  const handleMouseLeave = () => {
    if (!itemRef.current) return;
    if (animRef.current) animRef.current.pause();
    animRef.current = animate(itemRef.current, {
      scale: 1,
      ease: spring(springConfig),
    });
  };

  return (
    <RadixDropdownMenu.CheckboxItem
      ref={(node) => {
        itemRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={`${styles.checkboxItem} ${className || ''}`}
      checked={checked}
      onSelect={handleSelect}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <span ref={indicatorRef} className={styles.checkboxIndicator}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span className={styles.checkboxLabel}>{children}</span>
    </RadixDropdownMenu.CheckboxItem>
  );
});
DropdownMenuCheckboxItem.displayName = 'DropdownMenu.CheckboxItem';

export interface DropdownMenuRadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.RadioGroup> {
  className?: string;
}

const DropdownMenuRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.RadioGroup>,
  DropdownMenuRadioGroupProps
>(({ className, ...props }, ref) => (
  <RadixDropdownMenu.RadioGroup
    ref={ref}
    className={`${styles.radioGroup} ${className || ''}`}
    {...props}
  />
));
DropdownMenuRadioGroup.displayName = 'DropdownMenu.RadioGroup';

export interface DropdownMenuRadioItemProps extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.RadioItem> {
  className?: string;
}

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.RadioItem>,
  DropdownMenuRadioItemProps
>(({ className, onSelect, ...props }, ref) => {
  const { close } = useDropdownMenuContext();
  const itemRef = React.useRef<HTMLDivElement | null>(null);
  const animRef = React.useRef<ReturnType<typeof animate> | null>(null);

  const handleSelect = (e: Event) => {
    e.preventDefault();
    onSelect?.(e);
    close();
  };

  const handleMouseEnter = () => {
    if (!itemRef.current) return;
    if (animRef.current) animRef.current.pause();
    animRef.current = animate(itemRef.current, {
      scale: 1.02,
      ease: spring(springConfig),
    });
  };

  const handleMouseLeave = () => {
    if (!itemRef.current) return;
    if (animRef.current) animRef.current.pause();
    animRef.current = animate(itemRef.current, {
      scale: 1,
      ease: spring(springConfig),
    });
  };

  return (
    <RadixDropdownMenu.RadioItem
      ref={(node) => {
        itemRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={`${styles.radioItem} ${className || ''}`}
      onSelect={handleSelect}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    />
  );
});
DropdownMenuRadioItem.displayName = 'DropdownMenu.RadioItem';

export interface DropdownMenuItemIndicatorProps extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.ItemIndicator> {
  className?: string;
}

const DropdownMenuItemIndicator = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.ItemIndicator>,
  DropdownMenuItemIndicatorProps
>(({ className, ...props }, ref) => (
  <RadixDropdownMenu.ItemIndicator
    ref={ref}
    className={`${styles.itemIndicator} ${className || ''}`}
    {...props}
  />
));
DropdownMenuItemIndicator.displayName = 'DropdownMenu.ItemIndicator';

export interface DropdownMenuSeparatorProps extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Separator> {
  className?: string;
}

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.Separator>,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <RadixDropdownMenu.Separator
    ref={ref}
    className={`${styles.separator} ${className || ''}`}
    {...props}
  />
));
DropdownMenuSeparator.displayName = 'DropdownMenu.Separator';

export interface DropdownMenuSubProps extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Sub> {}

const DropdownMenuSub: React.FC<DropdownMenuSubProps> = (props) => (
  <RadixDropdownMenu.Sub {...props} />
);
DropdownMenuSub.displayName = 'DropdownMenu.Sub';

export interface DropdownMenuSubTriggerProps extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.SubTrigger> {
  className?: string;
}

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.SubTrigger>,
  DropdownMenuSubTriggerProps
>(({ className, ...props }, ref) => (
  <RadixDropdownMenu.SubTrigger
    ref={ref}
    className={`${styles.subTrigger} ${className || ''}`}
    {...props}
  />
));
DropdownMenuSubTrigger.displayName = 'DropdownMenu.SubTrigger';

export interface DropdownMenuSubContentProps extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.SubContent> {
  className?: string;
}

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.SubContent>,
  DropdownMenuSubContentProps
>(({ className, ...props }, ref) => (
  <RadixDropdownMenu.SubContent
    ref={ref}
    className={`${styles.subContent} ${className || ''}`}
    {...props}
  />
));
DropdownMenuSubContent.displayName = 'DropdownMenu.SubContent';

export const DropdownMenu = {
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Portal: DropdownMenuPortal,
  Content: DropdownMenuContent,
  Arrow: DropdownMenuArrow,
  Item: DropdownMenuItem,
  Group: DropdownMenuGroup,
  Label: DropdownMenuLabel,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioGroup: DropdownMenuRadioGroup,
  RadioItem: DropdownMenuRadioItem,
  ItemIndicator: DropdownMenuItemIndicator,
  Separator: DropdownMenuSeparator,
  Sub: DropdownMenuSub,
  SubTrigger: DropdownMenuSubTrigger,
  SubContent: DropdownMenuSubContent,
};
