'use client';

import * as React from 'react';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import { animate, spring } from 'animejs';
import { withMoveComponent } from '../../../engine';
import { useMergedRef } from '../../../engine/useMergedRef';
import type { PassThrough } from '../../../engine/types';
import { useResolvedIcon } from '../../core/Icon/useResolvedIcon';
import { mergeAnimateConfig, prefersReducedMotion } from '../../../animation/utils';
import type { PopupAnimate } from '../../../animation/types';
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
  registerLabel: (value: string, label: React.ReactNode) => void;
  getLabel: (value: string) => React.ReactNode | undefined;
  animateConfig: PopupAnimate | null;
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
  animate?: PopupAnimate | false;
  children?: React.ReactNode;
}

const defaultSelectAnimation: PopupAnimate = {
  enter: {
    opacity: { value: [0, 1], easing: 'outQuart' },
    scale: { value: [0.5, 1], easing: 'outQuart' },
  },
  exit: {
    opacity: { value: [1, 0], easing: 'outQuart' },
    scale: { value: [1, 0.95], easing: 'outQuart' },
    duration: 200,
  },
  stagger: { delay: 30 },
};

const SelectRoot: React.FC<SelectRootProps> = ({
  value: controlledValue,
  defaultValue,
  onValueChange,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  animate: animateProp,
  children,
}) => {
  const animateConfig = animateProp === false ? null : mergeAnimateConfig(defaultSelectAnimation, animateProp);

  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const [isClosing, setIsClosing] = React.useState(false);
  const labelMapRef = React.useRef<Map<string, React.ReactNode>>(new Map());
  const [, forceUpdate] = React.useState(0);

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

  const registerLabel = React.useCallback((itemValue: string, label: React.ReactNode) => {
    const prev = labelMapRef.current.get(itemValue);
    if (prev !== label) {
      labelMapRef.current.set(itemValue, label);
      forceUpdate((n) => n + 1);
    }
  }, []);

  const getLabel = React.useCallback((itemValue: string) => {
    return labelMapRef.current.get(itemValue);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange: handleValueChange, isClosing, onCloseComplete: handleCloseComplete, close, registerLabel, getLabel, animateConfig }}>
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
  /** Whether the select is in an invalid state */
  invalid?: boolean;
  width?: React.CSSProperties['width'];
  pt?: PassThrough<'trigger'>;
}

const SelectTrigger = withMoveComponent<'trigger', SelectTriggerProps, HTMLButtonElement>({
  name: 'SelectTrigger',
  styles,
  slots: ['trigger'] as const,
  moveProps: ['invalid', 'disabled', 'width'],

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
            style={{ ...props.style, ...(props.width != null ? { width: props.width } : {}), ...(ptStyle as React.CSSProperties) }}
            {...(props.disabled ? { 'data-disabled': '' } : {})}
            {...(props.invalid ? { 'data-invalid': '' } : {})}
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
    const { value, getLabel } = useSelectContext();

    return {
      render() {
        const valuePt = ptm('value');
        const { className: ptClass, style: ptStyle, ...ptRest } = valuePt as Record<string, unknown>;
        const showPlaceholder = value === undefined || value === '';
        const label = value !== undefined ? getLabel(value) : undefined;
        const displayText = showPlaceholder ? (props.placeholder as string) : (props.children ?? label ?? value);
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
    const resolvedChevron = useResolvedIcon('chevron-down', 16);
    const iconRef = React.useRef<HTMLSpanElement>(null);
    const animRef = React.useRef<ReturnType<typeof animate> | null>(null);
    const mergedRef = useMergedRef<HTMLSpanElement>(ref, iconRef);
    const { isClosing, animateConfig } = useSelectContext();

    // Rotate open when trigger data-state changes to 'open'
    React.useEffect(() => {
      const iconEl = iconRef.current;
      if (!iconEl) return;
      const trigger = iconEl.closest('[data-state]');
      if (!trigger) return;

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.attributeName === 'data-state') {
            const state = trigger.getAttribute('data-state');
            if (state === 'open') {
              if (animateConfig === null) {
                iconEl.style.transform = 'rotate(180deg)';
              } else {
                if (animRef.current) animRef.current.pause();
                animRef.current = animate(iconEl, {
                  rotate: 180,
                  ease: 'outQuart',
                  duration: prefersReducedMotion() ? 0 : 300,
                });
              }
            }
          }
        }
      });

      observer.observe(trigger, { attributes: true });
      return () => observer.disconnect();
    }, [animateConfig]);

    // Rotate closed immediately when isClosing becomes true
    React.useEffect(() => {
      if (!isClosing) return;
      const iconEl = iconRef.current;
      if (!iconEl) return;
      if (animateConfig === null) {
        iconEl.style.transform = 'rotate(0deg)';
      } else {
        if (animRef.current) animRef.current.pause();
        animRef.current = animate(iconEl, {
          rotate: 0,
          ease: 'outQuart',
          duration: prefersReducedMotion() ? 0 : 300,
        });
      }
    }, [isClosing, animateConfig]);

    return {
      render() {
        const iconPt = ptm('icon');
        const { className: ptClass, style: ptStyle, ...ptRest } = iconPt as Record<string, unknown>;
        return (
          <span
            {...attrs}
            {...ptRest}
            ref={mergedRef}
            className={cx('icon', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
            aria-hidden="true"
          >
            {props.children || resolvedChevron}
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
    const { isClosing, onCloseComplete, close, animateConfig } = useSelectContext();
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

      if (animateConfig === null) {
        // No animation — show immediately
        content.style.height = 'auto';
        content.style.opacity = '1';

        // Focus logic still runs
        content.focus();
        const selected = content.querySelector('[data-selected]') as HTMLElement | null;
        if (selected) {
          selected.focus();
        } else {
          content.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'ArrowDown',
            code: 'ArrowDown',
            bubbles: true,
          }));
        }
        return;
      }

      if (animRef.current) animRef.current.pause();
      if (itemsAnimRef.current) itemsAnimRef.current.pause();

      // Measure the natural constrained height (respects inner's max-height)
      content.style.height = 'auto';
      const targetHeight = content.offsetHeight;

      // Pre-scroll to selected item before animating, so it opens in the right position
      const selectedItem = inner.querySelector('[data-selected]') as HTMLElement | null;
      if (selectedItem) {
        inner.scrollTop = Math.max(0, selectedItem.offsetTop - inner.clientHeight / 2 + selectedItem.offsetHeight / 2);
      }

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
            // Focus the selected item so arrow navigation starts from it
            const selected = content.querySelector('[data-selected]') as HTMLElement | null;
            if (selected) {
              selected.focus();
            } else {
              content.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'ArrowDown',
                code: 'ArrowDown',
                bubbles: true,
              }));
            }
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
    }, [animateConfig]);

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

      if (animateConfig === null) {
        // No animation — close immediately
        onCloseComplete();
        return;
      }

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
    }, [isAnimatingOut, onCloseComplete, animateConfig]);

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
  label?: React.ReactNode;
  disabled?: boolean;
  onSelect?: (e: Event) => void;
  pt?: PassThrough<'item'>;
}

const SelectItem = withMoveComponent<'item', SelectItemProps, HTMLDivElement>({
  name: 'SelectItem',
  styles,
  slots: ['item'] as const,
  moveProps: ['value', 'label', 'disabled', 'onSelect'],

  setup({ props, ref, cx, ptm, attrs }) {
    const itemRef = React.useRef<HTMLDivElement | null>(null);
    const animRefLocal = React.useRef<ReturnType<typeof animate> | null>(null);
    const { value, onValueChange, close, registerLabel, animateConfig } = useSelectContext();
    const isSelected = value === (props.value as string);

    const mergedItemRef = useMergedRef<HTMLDivElement>(ref, itemRef);

    // Register label so SelectValue can display it
    const displayLabel = props.label ?? props.children;
    React.useEffect(() => {
      registerLabel(props.value as string, displayLabel);
    }, [props.value, displayLabel, registerLabel]);

    const handleSelect = (e: Event) => {
      e.preventDefault();
      onValueChange(props.value as string);
      (props.onSelect as ((e: Event) => void) | undefined)?.(e);
      close();
    };

    const handleMouseEnter = () => {
      if (animateConfig === null) return;
      if (!itemRef.current) return;
      if (animRefLocal.current) animRefLocal.current.pause();
      animRefLocal.current = animate(itemRef.current, {
        scale: 1.02,
        ease: spring(springConfig),
      });
    };

    const handleMouseLeave = () => {
      if (animateConfig === null) return;
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

        return (
          <RadixDropdownMenu.Item
            {...attrs}
            {...ptRest}
            ref={mergedItemRef}
            disabled={props.disabled as boolean}
            data-selected={isSelected ? '' : undefined}
            onSelect={handleSelect}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cx('item', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
          >
            {props.children}
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
