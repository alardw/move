'use client';

import * as React from 'react';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import { animate, spring } from 'animejs';
import { withMoveComponent } from '../../../engine';
import { useMergedRef } from '../../../engine/useMergedRef';
import type { PassThrough } from '../../../engine/types';
import styles from './Select.module.css';

const springConfig = { mass: 0.6, stiffness: 400, damping: 20, velocity: 0 };

// ============================================================================
// Context
// ============================================================================

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

// ============================================================================
// Root (stateful FC — manages value + open/close + animation context)
// ============================================================================

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
      if (!isOpenControlled) setUncontrolledOpen(true);
      onOpenChange?.(true);
    }
    // Ignore close from Radix — we coordinate via close()
  }, [isOpenControlled, onOpenChange]);

  const handleCloseComplete = React.useCallback(() => {
    setIsClosing(false);
    if (!isOpenControlled) setUncontrolledOpen(false);
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

// ============================================================================
// Trigger
// ============================================================================

export interface SelectTriggerProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  disabled?: boolean;
  pt?: PassThrough<'trigger'>;
}

const SelectTrigger = withMoveComponent<'trigger', SelectTriggerProps, HTMLButtonElement>({
  name: 'SelectTrigger',
  styles,
  slots: ['trigger'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const triggerPt = ptm('trigger');
        const { className: ptClass, style: ptStyle, ...ptRest } = triggerPt as Record<string, unknown>;
        return (
          <RadixDropdownMenu.Trigger
            {...attrs}
            {...ptRest}
            ref={ref}
            disabled={props.disabled as boolean}
            className={cx('trigger', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
            {...(props.disabled ? { 'data-disabled': '' } : {})}
          >
            {props.children}
          </RadixDropdownMenu.Trigger>
        );
      },
    };
  },
});

// ============================================================================
// Value
// ============================================================================

export interface SelectValueProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  children?: React.ReactNode;
  pt?: PassThrough<'value'>;
}

const SelectValue = withMoveComponent<'value', SelectValueProps, HTMLSpanElement>({
  name: 'SelectValue',
  styles,
  slots: ['value'] as const,
  moveProps: ['placeholder'],

  setup({ props, ref, cx, ptm, attrs }) {
    const { value } = useSelectContext();

    return {
      render() {
        const valuePt = ptm('value');
        const { className: ptClass, style: ptStyle, ...ptRest } = valuePt as Record<string, unknown>;
        const showPlaceholder = value === undefined || value === '';
        const displayText = showPlaceholder ? (props.placeholder as string) : (props.children ?? value);
        return (
          <span
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('value', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
            {...(showPlaceholder ? { 'data-placeholder': '' } : {})}
          >
            {displayText}
          </span>
        );
      },
    };
  },
});

// ============================================================================
// Icon
// ============================================================================

export interface SelectIconProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'icon'>;
}

const SelectIcon = withMoveComponent<'icon', SelectIconProps, HTMLSpanElement>({
  name: 'SelectIcon',
  styles,
  slots: ['icon'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const iconPt = ptm('icon');
        const { className: ptClass, style: ptStyle, ...ptRest } = iconPt as Record<string, unknown>;
        return (
          <span
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('icon', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
            aria-hidden="true"
          >
            {props.children || (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          </span>
        );
      },
    };
  },
});

// ============================================================================
// Portal (stateless — no factory needed)
// ============================================================================

export interface SelectPortalProps {
  children?: React.ReactNode;
  container?: HTMLElement;
}

const SelectPortal: React.FC<SelectPortalProps> = (props) => (
  <RadixDropdownMenu.Portal {...props} />
);
SelectPortal.displayName = 'Select.Portal';

// ============================================================================
// Content
// ============================================================================

export interface SelectContentProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  onPointerDownOutside?: (e: Event) => void;
  onEscapeKeyDown?: (e: KeyboardEvent) => void;
  onInteractOutside?: (e: Event) => void;
  pt?: PassThrough<'content' | 'contentInner'>;
}

const SelectContent = withMoveComponent<'content' | 'contentInner', SelectContentProps, HTMLDivElement>({
  name: 'SelectContent',
  styles,
  slots: ['content', 'contentInner'] as const,
  moveProps: ['sideOffset', 'align', 'onPointerDownOutside', 'onEscapeKeyDown', 'onInteractOutside'],

  setup({ props, ref, cx, ptm, attrs }) {
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const innerRef = React.useRef<HTMLDivElement>(null);
    const animRef = React.useRef<ReturnType<typeof animate> | null>(null);
    const itemsAnimRef = React.useRef<ReturnType<typeof animate> | null>(null);
    const { isClosing, onCloseComplete, close } = useSelectContext();
    const [isAnimatingOut, setIsAnimatingOut] = React.useState(false);

    const mergedContentRef = useMergedRef<HTMLDivElement>(ref, contentRef);

    // Intercept close events to trigger animation
    const handlePointerDownOutside = (e: Event) => {
      e.preventDefault();
      (props.onPointerDownOutside as ((e: Event) => void) | undefined)?.(e);
      close();
    };

    const handleEscapeKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      (props.onEscapeKeyDown as ((e: KeyboardEvent) => void) | undefined)?.(e);
      close();
    };

    const handleInteractOutside = (e: Event) => {
      e.preventDefault();
      (props.onInteractOutside as ((e: Event) => void) | undefined)?.(e);
      close();
    };

    // Animate open on mount
    React.useLayoutEffect(() => {
      const content = contentRef.current;
      const inner = innerRef.current;
      if (!content || !inner) return;

      if (animRef.current) animRef.current.pause();
      if (itemsAnimRef.current) itemsAnimRef.current.pause();

      // Measure the natural constrained height (respects inner's max-height)
      content.style.height = 'auto';
      const targetHeight = content.offsetHeight;

      content.style.height = '0px';
      content.style.opacity = '1';
      content.style.transform = 'scale(0.5)';

      animRef.current = animate(content, {
        height: targetHeight,
        scale: 1,
        ease: 'outQuart',
        duration: 250,
        onComplete: () => {
          if (content) content.style.height = 'auto';
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
        delay: (_el: any, i: number) => i * 30,
      });
    }, []);

    // When isClosing becomes true, start local animation state
    React.useEffect(() => {
      if (isClosing && !isAnimatingOut) {
        setIsAnimatingOut(true);
      }
    }, [isClosing, isAnimatingOut]);

    // Animate close
    React.useEffect(() => {
      if (!isAnimatingOut) return;

      const content = contentRef.current;
      const inner = innerRef.current;
      if (!content || !inner) return;

      if (animRef.current) animRef.current.pause();
      if (itemsAnimRef.current) itemsAnimRef.current.pause();

      content.style.height = `${content.offsetHeight}px`;

      const items = inner.querySelectorAll('[role="menuitem"]');
      const itemCount = items.length;

      itemsAnimRef.current = animate(items, {
        opacity: 0,
        scale: 0.8,
        ease: 'outQuart',
        duration: 150,
        delay: (_el: any, i: number) => (itemCount - 1 - i) * 20,
      });

      animRef.current = animate(content, {
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        ease: 'outQuart',
        duration: 200,
        delay: 50,
        onComplete: () => onCloseComplete(),
      });

      animate(content, {
        opacity: 0,
        ease: 'outQuart',
        duration: 100,
        delay: 150,
      });
    }, [isAnimatingOut, onCloseComplete]);

    return {
      render() {
        const contentPt = ptm('content');
        const { className: ptClass, style: ptStyle, ...ptRest } = contentPt as Record<string, unknown>;
        const innerPt = ptm('contentInner');
        const { className: innerPtClass, style: innerPtStyle, ...innerPtRest } = innerPt as Record<string, unknown>;

        return (
          <RadixDropdownMenu.Content
            {...attrs}
            {...ptRest}
            ref={mergedContentRef}
            sideOffset={props.sideOffset as number ?? 4}
            align={props.align as 'start' | 'center' | 'end'}
            className={cx('content', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
            onPointerDownOutside={handlePointerDownOutside}
            onEscapeKeyDown={handleEscapeKeyDown}
            onInteractOutside={handleInteractOutside}
          >
            <div
              ref={innerRef}
              {...innerPtRest}
              className={cx('contentInner', innerPtClass as string | undefined)}
              style={innerPtStyle as React.CSSProperties}
            >
              {props.children}
            </div>
          </RadixDropdownMenu.Content>
        );
      },
    };
  },
});

// ============================================================================
// Viewport
// ============================================================================

export interface SelectViewportProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'viewport'>;
}

const SelectViewport = withMoveComponent<'viewport', SelectViewportProps, HTMLDivElement>({
  name: 'SelectViewport',
  styles,
  slots: ['viewport'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const viewportPt = ptm('viewport');
        const { className: ptClass, style: ptStyle, ...ptRest } = viewportPt as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('viewport', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
          >
            {props.children}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Item
// ============================================================================

export interface SelectItemProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  value: string;
  disabled?: boolean;
  onSelect?: (e: Event) => void;
  pt?: PassThrough<'item' | 'itemIndicator' | 'itemText'>;
}

const SelectItem = withMoveComponent<'item' | 'itemIndicator' | 'itemText', SelectItemProps, HTMLDivElement>({
  name: 'SelectItem',
  styles,
  slots: ['item', 'itemIndicator', 'itemText'] as const,
  moveProps: ['value', 'disabled', 'onSelect'],

  setup({ props, ref, cx, ptm, attrs }) {
    const itemRef = React.useRef<HTMLDivElement | null>(null);
    const indicatorRef = React.useRef<HTMLSpanElement>(null);
    const animRefLocal = React.useRef<ReturnType<typeof animate> | null>(null);
    const { value, onValueChange, close } = useSelectContext();
    const isSelected = value === (props.value as string);

    const mergedItemRef = useMergedRef<HTMLDivElement>(ref, itemRef);

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
      onValueChange(props.value as string);
      (props.onSelect as ((e: Event) => void) | undefined)?.(e);
      close();
    };

    const handleMouseEnter = () => {
      if (!itemRef.current) return;
      if (animRefLocal.current) animRefLocal.current.pause();
      animRefLocal.current = animate(itemRef.current, {
        scale: 1.02,
        ease: spring(springConfig),
      });
    };

    const handleMouseLeave = () => {
      if (!itemRef.current) return;
      if (animRefLocal.current) animRefLocal.current.pause();
      animRefLocal.current = animate(itemRef.current, {
        scale: 1,
        ease: spring(springConfig),
      });
    };

    return {
      render() {
        const itemPt = ptm('item');
        const { className: ptClass, style: ptStyle, ...ptRest } = itemPt as Record<string, unknown>;
        const indicatorPt = ptm('itemIndicator');
        const { className: indPtClass, style: indPtStyle, ...indPtRest } = indicatorPt as Record<string, unknown>;
        const textPt = ptm('itemText');
        const { className: textPtClass, style: textPtStyle, ...textPtRest } = textPt as Record<string, unknown>;

        return (
          <RadixDropdownMenu.Item
            {...attrs}
            {...ptRest}
            ref={mergedItemRef}
            disabled={props.disabled as boolean}
            data-selected={isSelected ? 'true' : undefined}
            onSelect={handleSelect}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cx('item', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
          >
            <span
              ref={indicatorRef}
              {...indPtRest}
              className={cx('itemIndicator', indPtClass as string | undefined)}
              style={{ opacity: isSelected ? 1 : 0, ...(indPtStyle as React.CSSProperties) }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span
              {...textPtRest}
              className={cx('itemText', textPtClass as string | undefined)}
              style={textPtStyle as React.CSSProperties}
            >
              {props.children}
            </span>
          </RadixDropdownMenu.Item>
        );
      },
    };
  },
});

// ============================================================================
// Group
// ============================================================================

export interface SelectGroupProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'group'>;
}

const SelectGroup = withMoveComponent<'group', SelectGroupProps, HTMLDivElement>({
  name: 'SelectGroup',
  styles,
  slots: ['group'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const groupPt = ptm('group');
        const { className: ptClass, style: ptStyle, ...ptRest } = groupPt as Record<string, unknown>;
        return (
          <RadixDropdownMenu.Group
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('group', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixDropdownMenu.Group>
        );
      },
    };
  },
});

// ============================================================================
// Label
// ============================================================================

export interface SelectLabelProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'label'>;
}

const SelectLabel = withMoveComponent<'label', SelectLabelProps, HTMLDivElement>({
  name: 'SelectLabel',
  styles,
  slots: ['label'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const labelPt = ptm('label');
        const { className: ptClass, style: ptStyle, ...ptRest } = labelPt as Record<string, unknown>;
        return (
          <RadixDropdownMenu.Label
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('label', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixDropdownMenu.Label>
        );
      },
    };
  },
});

// ============================================================================
// Separator
// ============================================================================

export interface SelectSeparatorProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  pt?: PassThrough<'separator'>;
}

const SelectSeparator = withMoveComponent<'separator', SelectSeparatorProps, HTMLDivElement>({
  name: 'SelectSeparator',
  styles,
  slots: ['separator'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const sepPt = ptm('separator');
        const { className: ptClass, style: ptStyle, ...ptRest } = sepPt as Record<string, unknown>;
        return (
          <RadixDropdownMenu.Separator
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('separator', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
          />
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Icon: SelectIcon,
  Portal: SelectPortal,
  Content: SelectContent,
  Viewport: SelectViewport,
  Item: SelectItem,
  Group: SelectGroup,
  Label: SelectLabel,
  Separator: SelectSeparator,
};
