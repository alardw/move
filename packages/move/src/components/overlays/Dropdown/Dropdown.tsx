'use client';

import * as React from 'react';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import type { SlotPropsMap, CxFn } from '../../../engine';
import { withMoveComponent, useMergedRef } from '../../../engine';
import { useResolvedIcon } from '../../../infrastructure/Icon';
import { useAnimations, resolveAnimationsConfig, staggerItems, quick, poppy, useDismissable, useDismissableExit } from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import { useLayer } from '../../../infrastructure/Layer';
import styles from './Dropdown.module.css';

// Wraps only the string/number leaves of a ReactNode tree in a block-level
// span so text-overflow: ellipsis applies natively. React elements (Icons,
// custom components) pass through untouched so they stay as direct flex
// siblings and center vertically via align-items on the parent.
function wrapTextChildren(children: React.ReactNode, textClass: string): React.ReactNode {
  const wrapped = React.Children.map(children, (child, i) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return <span key={i} className={textClass}>{child}</span>;
    }
    return child;
  });
  return wrapped ?? children;
}

// ============================================================================
// Animation defaults
// ============================================================================

// Container (Content) only fades; item stagger carries the reveal.
const DEFAULT_DROPDOWN_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'Content.enter',
    sequence: [[
      { target: 'Content', animation: { opacity: { from: 0, to: 1, duration: 150 } } },
      { target: 'ContentInner', children: '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]', stagger: staggerItems.stagger, animation: staggerItems.enter },
    ]],
  },
  {
    trigger: 'Content.exit',
    sequence: [[
      { target: 'Content', animation: { opacity: { to: 0, duration: 150 } } },
      { target: 'ContentInner', children: '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]', stagger: staggerItems.stagger, animation: staggerItems.exit },
    ]],
  },
  {
    trigger: 'Item.hover',
    sequence: [{ animation: { scale: { to: 1.02, ease: quick } } }],
  },
];

// ============================================================================
// Context (animation coordination — same pattern as v1)
// ============================================================================

interface DropdownContextValue {
  isClosing: boolean;
  epoch: number;
  onExitDone: (epoch: number) => void;
  close: () => void;
  animConfig: AnimationTrigger[] | null;
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
  animations?: AnimationTrigger[] | false;
}

const DropdownRoot: React.FC<DropdownRootProps> = ({ open: controlledOpen, defaultOpen, onOpenChange, animations: animationsProp, ...props }) => {
  const animConfig = resolveAnimationsConfig(DEFAULT_DROPDOWN_ANIMATIONS, animationsProp);

  // Interruptible open/close lifecycle (open cancels an in-flight close;
  // exit-completion is epoch-guarded). See useDismissable.
  const dismissable = useDismissable({ open: controlledOpen, defaultOpen, onOpenChange });
  const { isOpen, isClosing, epoch, onExitDone, open: openFn, close } = dismissable;

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    // Open (or cancel an in-flight close); ignore Radix's own close — the exit
    // animation drives it (useDismissable).
    if (newOpen) openFn();
  }, [openFn]);

  return (
    <DropdownContext.Provider value={{ isClosing, epoch, onExitDone, close, animConfig }}>
      <RadixDropdownMenu.Root open={isOpen || isClosing} onOpenChange={handleOpenChange} {...props} />
    </DropdownContext.Provider>
  );
};
DropdownRoot.displayName = 'Dropdown.Root';

// ============================================================================
// Trigger
// ============================================================================

export interface DropdownTriggerProps extends React.HTMLAttributes<HTMLElement> {
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
// Content (auto-portals to document.body)
// ============================================================================

export interface DropdownContentProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  container?: HTMLElement;
  onPointerDownOutside?: (e: Event) => void;
  onEscapeKeyDown?: (e: KeyboardEvent) => void;
  onInteractOutside?: (e: Event) => void;
  sp?: SlotPropsMap<'content' | 'contentInner'>;
}

interface DropdownContentInnerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  onPointerDownOutside?: (e: Event) => void;
  onEscapeKeyDown?: (e: KeyboardEvent) => void;
  onInteractOutside?: (e: Event) => void;
  contentCx: CxFn<'content' | 'contentInner'>;
  innerCx: CxFn<'content' | 'contentInner'>;
  contentSp: Record<string, unknown>;
  innerSp: Record<string, unknown>;
  layer: number;
  attrs: Record<string, unknown>;
}

const DropdownContentInner = React.forwardRef<HTMLDivElement, DropdownContentInnerProps>(
  function DropdownContentInner(props, ref) {
    const { isClosing, epoch, onExitDone, close, animConfig } = useDropdownContext();

    const contentRef = React.useRef<HTMLDivElement>(null);
    const innerRef = React.useRef<HTMLDivElement>(null);
    const mergedContentRef = useMergedRef<HTMLDivElement>(ref, contentRef);

    const contentConfig = React.useMemo(() =>
      animConfig?.filter(t => t.trigger === 'Content.enter' || t.trigger === 'Content.exit') ?? null,
      [animConfig]);
    const contentRefs = React.useMemo(() => ({
      Content: contentRef as React.RefObject<HTMLElement | null>,
      ContentInner: innerRef as React.RefObject<HTMLElement | null>,
    }), []);

    // Radix DropdownMenu handles focus-on-open natively (auto-focuses the
    // first menuitem). We don't override it because a menu has no "current
    // value" — starting from the first item is the right UX. The previous
    // post-animation focus dispatch was redundant and caused a focus flash.
    const { runExit, runEnter, pauseAll } = useAnimations(contentConfig, contentRefs);

    useDismissableExit({
      isClosing,
      epoch,
      onExitDone,
      runExit,
      runEnter,
      pauseAll,
    });

    const handlePointerDownOutside = (e: Event) => {
      props.onPointerDownOutside?.(e);
      if (!e.defaultPrevented) close();
    };
    const handleEscapeKeyDown = (e: KeyboardEvent) => {
      props.onEscapeKeyDown?.(e);
      if (!e.defaultPrevented) close();
    };
    const handleInteractOutside = (e: Event) => {
      props.onInteractOutside?.(e);
    };

    const { className: spClass, style: spStyle, ...spRest } = props.contentSp;
    const { className: innerSpClass, style: innerSpStyle, ...innerSpRest } = props.innerSp;

    return (
      <RadixDropdownMenu.Content
        {...props.attrs}
        {...spRest}
        ref={mergedContentRef}
        sideOffset={props.sideOffset as number}
        align={props.align}
        className={props.contentCx('content', props.className, spClass as string | undefined)}
        style={{ ...props.style, ...(props.layer > 0 ? { zIndex: props.layer + 1 } : {}), ...(spStyle as React.CSSProperties) }}
        onPointerDownOutside={handlePointerDownOutside}
        onEscapeKeyDown={handleEscapeKeyDown}
        onInteractOutside={handleInteractOutside}
      >
        <div
          ref={innerRef}
          {...innerSpRest}
          className={props.innerCx('contentInner', innerSpClass as string | undefined)}
          style={innerSpStyle as React.CSSProperties}
        >
          {props.children}
        </div>
      </RadixDropdownMenu.Content>
    );
  },
);

const DropdownContent = withMoveComponent<'content' | 'contentInner', DropdownContentProps, HTMLDivElement>({
  name: 'DropdownContent',
  styles,
  slots: ['content', 'contentInner'] as const,
  defaults: { sideOffset: 6 },
  moveProps: ['sideOffset', 'align', 'container', 'onPointerDownOutside', 'onEscapeKeyDown', 'onInteractOutside'],

  setup({ props, ref, cx, sp, attrs }) {
    const layer = useLayer();

    return {
      render() {
        return (
          <RadixDropdownMenu.Portal container={props.container as HTMLElement | undefined}>
            <DropdownContentInner
              ref={ref}
              className={props.className}
              style={props.style}
              sideOffset={props.sideOffset as number | undefined}
              align={props.align as 'start' | 'center' | 'end' | undefined}
              onPointerDownOutside={props.onPointerDownOutside as ((e: Event) => void) | undefined}
              onEscapeKeyDown={props.onEscapeKeyDown as ((e: KeyboardEvent) => void) | undefined}
              onInteractOutside={props.onInteractOutside as ((e: Event) => void) | undefined}
              contentCx={cx}
              innerCx={cx}
              contentSp={sp('content') as Record<string, unknown>}
              innerSp={sp('contentInner') as Record<string, unknown>}
              layer={layer}
              attrs={attrs}
            >
              {props.children}
            </DropdownContentInner>
          </RadixDropdownMenu.Portal>
        );
      },
    };
  },
});

// ============================================================================
// Arrow
// ============================================================================

export interface DropdownArrowProps extends React.HTMLAttributes<HTMLElement> {
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

export interface DropdownItemProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
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
    const { close, animConfig } = useDropdownContext();

    const mergedItemRef = useMergedRef<HTMLDivElement>(ref, itemRef);

    const handleSelect = (e: Event) => {
      e.preventDefault();
      (props.onSelect as ((e: Event) => void) | undefined)?.(e);
      close();
    };

    // Item hover animation via useAnimations
    const itemConfig = React.useMemo(() => {
      if (!animConfig) return null;
      const hover = animConfig.find((t) => t.trigger === 'Item.hover');
      return hover ? [{ ...hover, trigger: 'Item.hover' }] : null;
    }, [animConfig]);

    const itemRefs = React.useMemo(() => ({
      Item: itemRef as React.RefObject<HTMLElement | null>,
    }), []);

    const { handlers } = useAnimations(itemConfig, itemRefs);

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
            onMouseEnter={() => handlers.Item?.onMouseEnter?.()}
            onMouseLeave={() => handlers.Item?.onMouseLeave?.()}
            className={cx('item', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            title={typeof props.children === 'string' ? props.children : undefined}
          >
            {wrapTextChildren(props.children, styles.itemText)}
          </RadixDropdownMenu.Item>
        );
      },
    };
  },
});

// ============================================================================
// Group
// ============================================================================

export interface DropdownGroupProps extends React.HTMLAttributes<HTMLElement> {
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

export interface DropdownLabelProps extends React.HTMLAttributes<HTMLElement> {
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

export interface DropdownCheckboxItemProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
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
    const resolvedCheck = useResolvedIcon('check', 14);
    const { animConfig } = useDropdownContext();

    const mergedItemRef = useMergedRef<HTMLDivElement>(ref, itemRef);

    const checked = !!props.checked;

    // Set initial indicator state
    React.useEffect(() => {
      const el = indicatorRef.current;
      if (!el) return;
      el.style.opacity = checked ? '1' : '0';
      el.style.transform = checked ? 'scale(1)' : 'scale(0.5)';
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Animate indicator on checked change via useAnimations deps
    const indicatorConfig: AnimationTrigger[] | null = React.useMemo(() => {
      if (!animConfig) return null;
      return [
        {
          trigger: 'indicator-check',
          deps: [checked],
          sequence: checked
            ? [{ target: 'Indicator', animation: { opacity: { from: 0, to: 1 }, scale: { from: 0.5, to: 1, ease: poppy } } }]
            : [{ target: 'Indicator', animation: { opacity: { from: 1, to: 0, duration: 150, ease: 'outQuad' }, scale: { from: 1, to: 0.5, duration: 150, ease: 'outQuad' } } }],
        },
      ];
    }, [checked, animConfig]);

    const indicatorRefs = React.useMemo(() => ({
      Indicator: indicatorRef as React.RefObject<HTMLElement | null>,
    }), []);

    useAnimations(indicatorConfig, indicatorRefs);

    const handleSelect = (e: Event) => {
      // Don't prevent default — let the checkbox toggle
      (props.onSelect as ((e: Event) => void) | undefined)?.(e);
      // Don't close the menu for checkbox items
    };

    // Item hover animation via useAnimations
    const itemConfig = React.useMemo(() => {
      if (!animConfig) return null;
      const hover = animConfig.find((t) => t.trigger === 'Item.hover');
      return hover ? [{ ...hover, trigger: 'Item.hover' }] : null;
    }, [animConfig]);

    const itemRefs = React.useMemo(() => ({
      Item: itemRef as React.RefObject<HTMLElement | null>,
    }), []);

    const { handlers } = useAnimations(itemConfig, itemRefs);

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
            onMouseEnter={() => handlers.Item?.onMouseEnter?.()}
            onMouseLeave={() => handlers.Item?.onMouseLeave?.()}
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

export interface DropdownRadioGroupProps extends React.HTMLAttributes<HTMLElement> {
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

export interface DropdownRadioItemProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
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
    const { close, animConfig } = useDropdownContext();

    const mergedItemRef = useMergedRef<HTMLDivElement>(ref, itemRef);

    const handleSelect = (e: Event) => {
      e.preventDefault();
      (props.onSelect as ((e: Event) => void) | undefined)?.(e);
      close();
    };

    // Item hover animation via useAnimations
    const itemConfig = React.useMemo(() => {
      if (!animConfig) return null;
      const hover = animConfig.find((t) => t.trigger === 'Item.hover');
      return hover ? [{ ...hover, trigger: 'Item.hover' }] : null;
    }, [animConfig]);

    const itemRefs = React.useMemo(() => ({
      Item: itemRef as React.RefObject<HTMLElement | null>,
    }), []);

    const { handlers } = useAnimations(itemConfig, itemRefs);

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
            onMouseEnter={() => handlers.Item?.onMouseEnter?.()}
            onMouseLeave={() => handlers.Item?.onMouseLeave?.()}
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

export interface DropdownItemIndicatorProps extends React.HTMLAttributes<HTMLElement> {
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

export interface DropdownSeparatorProps extends React.HTMLAttributes<HTMLElement> {
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

export interface DropdownSubTriggerProps extends React.HTMLAttributes<HTMLElement> {
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

export interface DropdownSubContentProps extends React.HTMLAttributes<HTMLElement> {
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
    const layer = useLayer();

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
            style={{ ...props.style, ...(layer > 0 ? { zIndex: layer + 1 } : {}), ...(spStyle as React.CSSProperties) }}
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
