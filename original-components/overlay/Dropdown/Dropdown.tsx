'use client';

import * as React from 'react';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import { animate, spring } from 'animejs';
import { withMoveComponent } from '../../../engine';
import { useMergedRef } from '../../../engine/useMergedRef';
import type { SlotPropsMap } from '../../../engine/types';
import { useResolvedIcon } from '../../core/Icon/useResolvedIcon';
import { mergeAnimateConfig } from '../../../animation/utils';
import { usePopupAnimation } from '../../../animation/hooks';
import type { PopupAnimate } from '../../../animation/types';
import styles from './Dropdown.module.css';

const springConfig = { mass: 0.6, stiffness: 400, damping: 20, velocity: 0 };

// ============================================================================
// Context (animation coordination — same pattern as v1)
// ============================================================================

interface DropdownContextValue {
  isClosing: boolean;
  onCloseComplete: () => void;
  close: () => void;
  animateConfig: PopupAnimate | null;
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within Dropdown.Root');
  }
  return context;
}

// ============================================================================
// Root (stateful FC — manages open/close state + animation context)
// ============================================================================

export interface DropdownRootProps extends Omit<React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Root>, 'open' | 'onOpenChange'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  animate?: PopupAnimate | false;
}

const defaultDropdownAnimation: PopupAnimate = {
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

const DropdownRoot: React.FC<DropdownRootProps> = ({ open: controlledOpen, defaultOpen, onOpenChange, animate: animateProp, ...props }) => {
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
    // Ignore close requests from Radix — we handle closing via close()
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

  const animateConfig = animateProp === false ? null : mergeAnimateConfig(defaultDropdownAnimation, animateProp);

  return (
    <DropdownContext.Provider value={{ isClosing, onCloseComplete: handleCloseComplete, close, animateConfig }}>
      <RadixDropdownMenu.Root open={open || isClosing} onOpenChange={handleOpenChange} {...props} />
    </DropdownContext.Provider>
  );
};
DropdownRoot.displayName = 'Dropdown.Root';

// ============================================================================
// Trigger
// ============================================================================

export interface DropdownTriggerProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  asChild?: boolean;
  sp?: SlotPropsMap<'trigger'>;
}

const DropdownTrigger = withMoveComponent<'trigger', DropdownTriggerProps, HTMLButtonElement>({
  name: 'DropdownTrigger',
  styles,
  slots: ['trigger'] as const,
  moveProps: ['asChild'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const triggerSp = sp('trigger');
        const { className: spClass, style: spStyle, ...spRest } = triggerSp as Record<string, unknown>;
        return (
          <RadixDropdownMenu.Trigger
            {...attrs}
            {...spRest}
            ref={ref}
            asChild={props.asChild as boolean}
            className={cx('trigger', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixDropdownMenu.Trigger>
        );
      },
    };
  },
});

// ============================================================================
// Portal (stateless — no factory needed)
// ============================================================================

export interface DropdownPortalProps {
  children?: React.ReactNode;
  container?: HTMLElement;
}

const DropdownPortal: React.FC<DropdownPortalProps> = (props) => (
  <RadixDropdownMenu.Portal {...props} />
);
DropdownPortal.displayName = 'Dropdown.Portal';

// ============================================================================
// Content
// ============================================================================

export interface DropdownContentProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  onPointerDownOutside?: (e: Event) => void;
  onEscapeKeyDown?: (e: KeyboardEvent) => void;
  onInteractOutside?: (e: Event) => void;
  sp?: SlotPropsMap<'content' | 'contentInner'>;
}

const DropdownContent = withMoveComponent<'content' | 'contentInner', DropdownContentProps, HTMLDivElement>({
  name: 'DropdownContent',
  styles,
  slots: ['content', 'contentInner'] as const,
  moveProps: ['sideOffset', 'align', 'onPointerDownOutside', 'onEscapeKeyDown', 'onInteractOutside'],

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    const { isClosing, onCloseComplete, close, animateConfig } = useDropdownContext();

    const { contentRef, innerRef } = usePopupAnimation({
      animate: animateConfig,
      isClosing,
      onCloseComplete,
      itemSelector: '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]',
      animateHeight: true,
      onOpenComplete: () => {
        const content = contentRef.current;
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

    const mergedContentRef = useMergedRef<HTMLDivElement>(ref, contentRef);

    // Intercept close events to trigger animation.
    // No preventDefault on pointer/interact — allows native events to propagate.
    const handlePointerDownOutside = (e: Event) => {
      (props.onPointerDownOutside as ((e: Event) => void) | undefined)?.(e);
      if (!e.defaultPrevented) close();
    };

    const handleEscapeKeyDown = (e: KeyboardEvent) => {
      (props.onEscapeKeyDown as ((e: KeyboardEvent) => void) | undefined)?.(e);
      if (!e.defaultPrevented) close();
    };

    const handleInteractOutside = (e: Event) => {
      (props.onInteractOutside as ((e: Event) => void) | undefined)?.(e);
    };

    return {
      render() {
        const contentSp = sp('content');
        const { className: spClass, style: spStyle, ...spRest } = contentSp as Record<string, unknown>;
        const innerSp = sp('contentInner');
        const { className: innerSpClass, style: innerSpStyle, ...innerSpRest } = innerSp as Record<string, unknown>;

        return (
          <RadixDropdownMenu.Content
            {...attrs}
            {...spRest}
            ref={mergedContentRef}
            sideOffset={props.sideOffset as number}
            align={props.align as 'start' | 'center' | 'end'}
            className={cx('content', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            onPointerDownOutside={handlePointerDownOutside}
            onEscapeKeyDown={handleEscapeKeyDown}
            onInteractOutside={handleInteractOutside}
          >
            <div
              ref={innerRef}
              {...innerSpRest}
              className={cx('contentInner', innerSpClass as string | undefined)}
              style={innerSpStyle as React.CSSProperties}
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
// Arrow
// ============================================================================

export interface DropdownArrowProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'arrow'>;
}

const DropdownArrow = withMoveComponent<'arrow', DropdownArrowProps, HTMLElement>({
  name: 'DropdownArrow',
  styles,
  slots: ['arrow'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const arrowSp = sp('arrow');
        const { className: spClass, style: spStyle, ...spRest } = arrowSp as Record<string, unknown>;
        return (
          <RadixDropdownMenu.Arrow
            {...attrs}
            {...spRest}
            ref={ref as any}
            className={cx('arrow', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          />
        );
      },
    };
  },
});

// ============================================================================
// Item
// ============================================================================

export interface DropdownItemProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  disabled?: boolean;
  onSelect?: (e: Event) => void;
  sp?: SlotPropsMap<'item'>;
}

const DropdownItem = withMoveComponent<'item', DropdownItemProps, HTMLDivElement>({
  name: 'DropdownItem',
  styles,
  slots: ['item'] as const,
  moveProps: ['disabled', 'onSelect'],

  setup({ props, ref, cx, sp, attrs }) {
    const itemRef = React.useRef<HTMLDivElement | null>(null);
    const animRefLocal = React.useRef<ReturnType<typeof animate> | null>(null);
    const { close, animateConfig } = useDropdownContext();

    const mergedItemRef = useMergedRef<HTMLDivElement>(ref, itemRef);

    const handleSelect = (e: Event) => {
      e.preventDefault();
      (props.onSelect as ((e: Event) => void) | undefined)?.(e);
      close();
    };

    const handleMouseEnter = () => {
      if (!animateConfig) return;
      if (!itemRef.current) return;
      if (animRefLocal.current) animRefLocal.current.pause();
      animRefLocal.current = animate(itemRef.current, {
        scale: 1.02,
        ease: spring(springConfig),
      });
    };

    const handleMouseLeave = () => {
      if (!animateConfig) return;
      if (!itemRef.current) return;
      if (animRefLocal.current) animRefLocal.current.pause();
      animRefLocal.current = animate(itemRef.current, {
        scale: 1,
        ease: spring(springConfig),
      });
    };

    return {
      render() {
        const itemSp = sp('item');
        const { className: spClass, style: spStyle, ...spRest } = itemSp as Record<string, unknown>;
        return (
          <RadixDropdownMenu.Item
            {...attrs}
            {...spRest}
            ref={mergedItemRef}
            disabled={props.disabled as boolean}
            onSelect={handleSelect}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cx('item', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
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

export interface DropdownGroupProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'group'>;
}

const DropdownGroup = withMoveComponent<'group', DropdownGroupProps, HTMLDivElement>({
  name: 'DropdownGroup',
  styles,
  slots: ['group'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const groupSp = sp('group');
        const { className: spClass, style: spStyle, ...spRest } = groupSp as Record<string, unknown>;
        return (
          <RadixDropdownMenu.Group
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('group', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
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

export interface DropdownLabelProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'label'>;
}

const DropdownLabel = withMoveComponent<'label', DropdownLabelProps, HTMLDivElement>({
  name: 'DropdownLabel',
  styles,
  slots: ['label'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const labelSp = sp('label');
        const { className: spClass, style: spStyle, ...spRest } = labelSp as Record<string, unknown>;
        return (
          <RadixDropdownMenu.Label
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('label', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixDropdownMenu.Label>
        );
      },
    };
  },
});

// ============================================================================
// CheckboxItem
// ============================================================================

export interface DropdownCheckboxItemProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onSelect?: (e: Event) => void;
  sp?: SlotPropsMap<'checkboxItem' | 'checkboxIndicator' | 'checkboxLabel'>;
}

const DropdownCheckboxItem = withMoveComponent<
  'checkboxItem' | 'checkboxIndicator' | 'checkboxLabel',
  DropdownCheckboxItemProps,
  HTMLDivElement
>({
  name: 'DropdownCheckboxItem',
  styles,
  slots: ['checkboxItem', 'checkboxIndicator', 'checkboxLabel'] as const,
  moveProps: ['checked', 'disabled', 'onCheckedChange', 'onSelect'],

  setup({ props, ref, cx, sp, attrs }) {
    const itemRef = React.useRef<HTMLDivElement | null>(null);
    const indicatorRef = React.useRef<HTMLSpanElement>(null);
    const animRefLocal = React.useRef<ReturnType<typeof animate> | null>(null);
    const isFirstRender = React.useRef(true);
    const resolvedCheck = useResolvedIcon('check', 14);
    const { animateConfig } = useDropdownContext();

    const mergedItemRef = useMergedRef<HTMLDivElement>(ref, itemRef);

    // Set initial indicator state
    React.useEffect(() => {
      const el = indicatorRef.current;
      if (!el) return;

      if (isFirstRender.current) {
        isFirstRender.current = false;
        el.style.opacity = props.checked ? '1' : '0';
        el.style.transform = props.checked ? 'scale(1)' : 'scale(0.5)';
      }
    }, []);

    // Animate indicator on checked change
    React.useEffect(() => {
      if (isFirstRender.current) return;
      const el = indicatorRef.current;
      if (!el) return;

      if (!animateConfig) {
        // No animation — set directly
        el.style.opacity = props.checked ? '1' : '0';
        el.style.transform = props.checked ? 'scale(1)' : 'scale(0.5)';
        return;
      }

      if (props.checked) {
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
    }, [props.checked, animateConfig]);

    const handleSelect = (e: Event) => {
      // Don't prevent default — let the checkbox toggle
      (props.onSelect as ((e: Event) => void) | undefined)?.(e);
      // Don't close the menu for checkbox items
    };

    const handleMouseEnter = () => {
      if (!animateConfig) return;
      if (!itemRef.current) return;
      if (animRefLocal.current) animRefLocal.current.pause();
      animRefLocal.current = animate(itemRef.current, {
        scale: 1.02,
        ease: spring(springConfig),
      });
    };

    const handleMouseLeave = () => {
      if (!animateConfig) return;
      if (!itemRef.current) return;
      if (animRefLocal.current) animRefLocal.current.pause();
      animRefLocal.current = animate(itemRef.current, {
        scale: 1,
        ease: spring(springConfig),
      });
    };

    return {
      render() {
        const checkboxSp = sp('checkboxItem');
        const { className: spClass, style: spStyle, ...spRest } = checkboxSp as Record<string, unknown>;
        const indicatorSp = sp('checkboxIndicator');
        const { className: indSpClass, style: indSpStyle, ...indSpRest } = indicatorSp as Record<string, unknown>;
        const labelSp = sp('checkboxLabel');
        const { className: lblSpClass, style: lblSpStyle, ...lblSpRest } = labelSp as Record<string, unknown>;

        return (
          <RadixDropdownMenu.CheckboxItem
            {...attrs}
            {...spRest}
            ref={mergedItemRef}
            checked={props.checked as boolean}
            disabled={props.disabled as boolean}
            onCheckedChange={props.onCheckedChange as (checked: boolean) => void}
            onSelect={handleSelect}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cx('checkboxItem', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            <span
              ref={indicatorRef}
              {...indSpRest}
              className={cx('checkboxIndicator', indSpClass as string | undefined)}
              style={indSpStyle as React.CSSProperties}
            >
              {resolvedCheck}
            </span>
            <span
              {...lblSpRest}
              className={cx('checkboxLabel', lblSpClass as string | undefined)}
              style={lblSpStyle as React.CSSProperties}
            >
              {props.children}
            </span>
          </RadixDropdownMenu.CheckboxItem>
        );
      },
    };
  },
});

// ============================================================================
// RadioGroup
// ============================================================================

export interface DropdownRadioGroupProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  sp?: SlotPropsMap<'radioGroup'>;
}

const DropdownRadioGroup = withMoveComponent<'radioGroup', DropdownRadioGroupProps, HTMLDivElement>({
  name: 'DropdownRadioGroup',
  styles,
  slots: ['radioGroup'] as const,
  moveProps: ['value', 'onValueChange'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const groupSp = sp('radioGroup');
        const { className: spClass, style: spStyle, ...spRest } = groupSp as Record<string, unknown>;
        return (
          <RadixDropdownMenu.RadioGroup
            {...attrs}
            {...spRest}
            ref={ref}
            value={props.value as string}
            onValueChange={props.onValueChange as (value: string) => void}
            className={cx('radioGroup', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixDropdownMenu.RadioGroup>
        );
      },
    };
  },
});

// ============================================================================
// RadioItem
// ============================================================================

export interface DropdownRadioItemProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  value: string;
  disabled?: boolean;
  onSelect?: (e: Event) => void;
  sp?: SlotPropsMap<'radioItem'>;
}

const DropdownRadioItem = withMoveComponent<'radioItem', DropdownRadioItemProps, HTMLDivElement>({
  name: 'DropdownRadioItem',
  styles,
  slots: ['radioItem'] as const,
  moveProps: ['value', 'disabled', 'onSelect'],

  setup({ props, ref, cx, sp, attrs }) {
    const itemRef = React.useRef<HTMLDivElement | null>(null);
    const animRefLocal = React.useRef<ReturnType<typeof animate> | null>(null);
    const { close, animateConfig } = useDropdownContext();

    const mergedItemRef = useMergedRef<HTMLDivElement>(ref, itemRef);

    const handleSelect = (e: Event) => {
      e.preventDefault();
      (props.onSelect as ((e: Event) => void) | undefined)?.(e);
      close();
    };

    const handleMouseEnter = () => {
      if (!animateConfig) return;
      if (!itemRef.current) return;
      if (animRefLocal.current) animRefLocal.current.pause();
      animRefLocal.current = animate(itemRef.current, {
        scale: 1.02,
        ease: spring(springConfig),
      });
    };

    const handleMouseLeave = () => {
      if (!animateConfig) return;
      if (!itemRef.current) return;
      if (animRefLocal.current) animRefLocal.current.pause();
      animRefLocal.current = animate(itemRef.current, {
        scale: 1,
        ease: spring(springConfig),
      });
    };

    return {
      render() {
        const itemSp = sp('radioItem');
        const { className: spClass, style: spStyle, ...spRest } = itemSp as Record<string, unknown>;
        return (
          <RadixDropdownMenu.RadioItem
            {...attrs}
            {...spRest}
            ref={mergedItemRef}
            value={props.value as string}
            disabled={props.disabled as boolean}
            onSelect={handleSelect}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cx('radioItem', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixDropdownMenu.RadioItem>
        );
      },
    };
  },
});

// ============================================================================
// ItemIndicator
// ============================================================================

export interface DropdownItemIndicatorProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'itemIndicator'>;
}

const DropdownItemIndicator = withMoveComponent<'itemIndicator', DropdownItemIndicatorProps, HTMLSpanElement>({
  name: 'DropdownItemIndicator',
  styles,
  slots: ['itemIndicator'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const indSp = sp('itemIndicator');
        const { className: spClass, style: spStyle, ...spRest } = indSp as Record<string, unknown>;
        return (
          <RadixDropdownMenu.ItemIndicator
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('itemIndicator', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixDropdownMenu.ItemIndicator>
        );
      },
    };
  },
});

// ============================================================================
// Separator
// ============================================================================

export interface DropdownSeparatorProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'separator'>;
}

const DropdownSeparator = withMoveComponent<'separator', DropdownSeparatorProps, HTMLDivElement>({
  name: 'DropdownSeparator',
  styles,
  slots: ['separator'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const sepSp = sp('separator');
        const { className: spClass, style: spStyle, ...spRest } = sepSp as Record<string, unknown>;
        return (
          <RadixDropdownMenu.Separator
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('separator', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          />
        );
      },
    };
  },
});

// ============================================================================
// Sub (stateless — no factory needed)
// ============================================================================

export interface DropdownSubProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DropdownSub: React.FC<DropdownSubProps> = (props) => (
  <RadixDropdownMenu.Sub {...props} />
);
DropdownSub.displayName = 'Dropdown.Sub';

// ============================================================================
// SubTrigger
// ============================================================================

export interface DropdownSubTriggerProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  disabled?: boolean;
  sp?: SlotPropsMap<'subTrigger'>;
}

const DropdownSubTrigger = withMoveComponent<'subTrigger', DropdownSubTriggerProps, HTMLDivElement>({
  name: 'DropdownSubTrigger',
  styles,
  slots: ['subTrigger'] as const,
  moveProps: ['disabled'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const subSp = sp('subTrigger');
        const { className: spClass, style: spStyle, ...spRest } = subSp as Record<string, unknown>;
        return (
          <RadixDropdownMenu.SubTrigger
            {...attrs}
            {...spRest}
            ref={ref}
            disabled={props.disabled as boolean}
            className={cx('subTrigger', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixDropdownMenu.SubTrigger>
        );
      },
    };
  },
});

// ============================================================================
// SubContent
// ============================================================================

export interface DropdownSubContentProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sideOffset?: number;
  sp?: SlotPropsMap<'subContent'>;
}

const DropdownSubContent = withMoveComponent<'subContent', DropdownSubContentProps, HTMLDivElement>({
  name: 'DropdownSubContent',
  styles,
  slots: ['subContent'] as const,
  moveProps: ['sideOffset'],

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const subSp = sp('subContent');
        const { className: spClass, style: spStyle, ...spRest } = subSp as Record<string, unknown>;
        return (
          <RadixDropdownMenu.SubContent
            {...attrs}
            {...spRest}
            ref={ref}
            sideOffset={props.sideOffset as number}
            className={cx('subContent', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixDropdownMenu.SubContent>
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const Dropdown = {
  Root: DropdownRoot,
  Trigger: DropdownTrigger,
  Portal: DropdownPortal,
  Content: DropdownContent,
  Arrow: DropdownArrow,
  Item: DropdownItem,
  Group: DropdownGroup,
  Label: DropdownLabel,
  CheckboxItem: DropdownCheckboxItem,
  RadioGroup: DropdownRadioGroup,
  RadioItem: DropdownRadioItem,
  ItemIndicator: DropdownItemIndicator,
  Separator: DropdownSeparator,
  Sub: DropdownSub,
  SubTrigger: DropdownSubTrigger,
  SubContent: DropdownSubContent,
};
