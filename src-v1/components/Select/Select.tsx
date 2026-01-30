'use client';

import * as React from 'react';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import { animate, spring } from 'animejs';
import styles from './Select.module.css';

const springConfig = { mass: 0.6, stiffness: 400, damping: 20, velocity: 0 };

interface SelectContextValue {
  value: string | undefined;
  onValueChange: (value: string) => void;
  isClosing: boolean;
  onCloseComplete: () => void;
  close: () => void;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be used within Select.Root');
  }
  return context;
}

export interface SelectRootProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const SelectRoot: React.FC<SelectRootProps> = ({
  value: controlledValue,
  defaultValue,
  onValueChange,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  children,
}) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const [isClosing, setIsClosing] = React.useState(false);

  const isValueControlled = controlledValue !== undefined;
  const value = isValueControlled ? controlledValue : uncontrolledValue;

  const isOpenControlled = controlledOpen !== undefined;
  const open = isOpenControlled ? controlledOpen : uncontrolledOpen;

  const handleValueChange = React.useCallback((newValue: string) => {
    if (!isValueControlled) {
      setUncontrolledValue(newValue);
    }
    onValueChange?.(newValue);
  }, [isValueControlled, onValueChange]);

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (newOpen) {
      if (!isOpenControlled) {
        setUncontrolledOpen(true);
      }
      onOpenChange?.(true);
    }
    // Ignore close requests from Radix - we handle closing ourselves via close()
  }, [isOpenControlled, onOpenChange]);

  const handleCloseComplete = React.useCallback(() => {
    setIsClosing(false);
    if (!isOpenControlled) {
      setUncontrolledOpen(false);
    }
    onOpenChange?.(false);
  }, [isOpenControlled, onOpenChange]);

  const close = React.useCallback(() => {
    setIsClosing(true);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange: handleValueChange, isClosing, onCloseComplete: handleCloseComplete, close }}>
      <RadixDropdownMenu.Root open={open || isClosing} onOpenChange={handleOpenChange}>
        {children}
      </RadixDropdownMenu.Root>
    </SelectContext.Provider>
  );
};
SelectRoot.displayName = 'Select.Root';

export interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Trigger> {
  className?: string;
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.Trigger>,
  SelectTriggerProps
>(({ className, ...props }, ref) => (
  <RadixDropdownMenu.Trigger
    ref={ref}
    className={`${styles.trigger} ${className || ''}`}
    {...props}
  />
));
SelectTrigger.displayName = 'Select.Trigger';

export interface SelectValueProps {
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
}

const SelectValue: React.FC<SelectValueProps> = ({ placeholder, className, children }) => {
  const { value } = useSelectContext();

  // If children is provided, use it to find the display text
  // Otherwise just show the value or placeholder
  return (
    <span className={`${styles.value} ${className || ''}`}>
      {value ?? placeholder}
    </span>
  );
};
SelectValue.displayName = 'Select.Value';

export interface SelectPortalProps extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Portal> {}

const SelectPortal: React.FC<SelectPortalProps> = (props) => (
  <RadixDropdownMenu.Portal {...props} />
);
SelectPortal.displayName = 'Select.Portal';

export interface SelectContentProps extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Content> {
  className?: string;
}

const SelectContent = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.Content>,
  SelectContentProps
>(({ className, children, onPointerDownOutside, onEscapeKeyDown, onInteractOutside, ...props }, ref) => {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);
  const animRef = React.useRef<ReturnType<typeof animate> | null>(null);
  const itemsAnimRef = React.useRef<ReturnType<typeof animate> | null>(null);
  const { isClosing, onCloseComplete, close } = useSelectContext();
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
    // Animate height and scale
    animRef.current = animate(content, {
      height: targetHeight,
      scale: 1,
      ease: 'outQuart',
      duration: 250,
      onComplete: () => {
        if (content) content.style.height = 'auto';
        // Trigger focus on the first enabled item after animation
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
    const items = inner.querySelectorAll('[role="menuitem"]');
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

    const items = inner.querySelectorAll('[role="menuitem"]');
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
SelectContent.displayName = 'Select.Content';

export interface SelectViewportProps {
  className?: string;
  children?: React.ReactNode;
}

const SelectViewport: React.FC<SelectViewportProps> = ({ className, children }) => (
  <div className={`${styles.viewport} ${className || ''}`}>
    {children}
  </div>
);
SelectViewport.displayName = 'Select.Viewport';

export interface SelectItemProps extends Omit<React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Item>, 'children'> {
  className?: string;
  value: string;
  children?: React.ReactNode;
}

const SelectItem = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.Item>,
  SelectItemProps
>(({ className, value: itemValue, onSelect, children, ...props }, ref) => {
  const { value, onValueChange, close } = useSelectContext();
  const itemRef = React.useRef<HTMLDivElement | null>(null);
  const indicatorRef = React.useRef<HTMLSpanElement>(null);
  const animRef = React.useRef<ReturnType<typeof animate> | null>(null);
  const isSelected = value === itemValue;

  // Animate indicator on selection change
  React.useEffect(() => {
    const el = indicatorRef.current;
    if (!el) return;

    if (isSelected) {
      animate(el, {
        opacity: [0, 1],
        scale: [0.5, 1],
        ease: spring({ mass: 0.8, stiffness: 500, damping: 15 }),
      });
    } else {
      el.style.opacity = '0';
      el.style.transform = 'scale(0.5)';
    }
  }, [isSelected]);

  const handleSelect = (e: Event) => {
    e.preventDefault();
    onValueChange(itemValue);
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
      data-selected={isSelected ? 'true' : undefined}
      onSelect={handleSelect}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <span ref={indicatorRef} className={styles.itemIndicator} style={{ opacity: isSelected ? 1 : 0 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span className={styles.itemText}>{children}</span>
    </RadixDropdownMenu.Item>
  );
});
SelectItem.displayName = 'Select.Item';

export interface SelectItemTextProps {
  className?: string;
  children?: React.ReactNode;
}

const SelectItemText: React.FC<SelectItemTextProps> = ({ className, children }) => (
  <span className={`${styles.itemText} ${className || ''}`}>{children}</span>
);
SelectItemText.displayName = 'Select.ItemText';

export interface SelectItemIndicatorProps {
  className?: string;
  children?: React.ReactNode;
}

const SelectItemIndicator: React.FC<SelectItemIndicatorProps> = ({ className, children }) => (
  <span className={`${styles.itemIndicator} ${className || ''}`}>{children}</span>
);
SelectItemIndicator.displayName = 'Select.ItemIndicator';

export interface SelectGroupProps {
  className?: string;
  children?: React.ReactNode;
}

const SelectGroup: React.FC<SelectGroupProps> = ({ className, children }) => (
  <RadixDropdownMenu.Group className={`${styles.group} ${className || ''}`}>
    {children}
  </RadixDropdownMenu.Group>
);
SelectGroup.displayName = 'Select.Group';

export interface SelectLabelProps extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Label> {
  className?: string;
}

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.Label>,
  SelectLabelProps
>(({ className, ...props }, ref) => (
  <RadixDropdownMenu.Label
    ref={ref}
    className={`${styles.label} ${className || ''}`}
    {...props}
  />
));
SelectLabel.displayName = 'Select.Label';

export interface SelectSeparatorProps extends React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Separator> {
  className?: string;
}

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.Separator>,
  SelectSeparatorProps
>(({ className, ...props }, ref) => (
  <RadixDropdownMenu.Separator
    ref={ref}
    className={`${styles.separator} ${className || ''}`}
    {...props}
  />
));
SelectSeparator.displayName = 'Select.Separator';

export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Portal: SelectPortal,
  Content: SelectContent,
  Viewport: SelectViewport,
  Item: SelectItem,
  ItemText: SelectItemText,
  ItemIndicator: SelectItemIndicator,
  Group: SelectGroup,
  Label: SelectLabel,
  Separator: SelectSeparator,
};
