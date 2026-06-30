'use client';
// Generated from Select.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)

import * as React from 'react';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap, CxFn } from '../../../engine';
import { useIcon } from '../../../infrastructure/Icon';
import {
  useAnimations,
  resolveAnimationsConfig, extractSteps,
  staggerItems, quick, poppy,
  useDismissable, useDismissableExit,
} from '../../../animation';
import type { AnimationTrigger, AnimationState } from '../../../animation';
import { useLayer } from '../../../infrastructure/Layer';
import styles from './Select.module.css';

// Per-item scale deltas (pixel-based so motion feels consistent at any width).
// Container (Content) no longer scales — item stagger carries the reveal feel;
// adding a container scale on top produced inconsistent perceived motion
// depending on item count (short lists made the solo container scale conspicuous).
const SCALE_INSET_PX = 16;       // per-item fade-in offset
const SCALE_HOVER_PX = 4;        // per-item hover scale (kept small so scaled items don't clip against the Content's overflow:hidden box)

// Every visible dropdown row participates in the stagger: items, group
// labels, and separators. Keeps the reveal cohesive when the menu is
// grouped. Items are matched via `role="menuitem"` (Radix adds this),
// labels and separators via their scoped CSS module classes.
const CHILDREN_SELECTOR = `[role="menuitem"], [class*="label"], [class*="separator"]`;

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

const DEFAULT_SELECT_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'open',
    sequence: [[
      { target: 'Content', animation: { opacity: { from: 0, to: 1, duration: 150 } } },
      { target: 'ContentInner', children: CHILDREN_SELECTOR, stagger: staggerItems.stagger, animation: { scale: { from: '$scaleFrom', to: 1, ease: poppy }, opacity: { from: 0, to: 1 } } },
      { target: 'Icon', animation: { rotate: { to: 180, ease: 'outQuart', duration: 300 } } },
    ]],
  },
  {
    trigger: 'closed',
    sequence: [[
      { target: 'Content', animation: { opacity: { to: 0, duration: 150 } } },
      { target: 'ContentInner', children: CHILDREN_SELECTOR, stagger: staggerItems.stagger, animation: { scale: { to: '$scaleFrom', ease: 'outQuart', duration: 150 }, opacity: { to: 0, duration: 150 } } },
      { target: 'Icon', animation: { rotate: { to: 0, ease: 'outQuart', duration: 300 } } },
    ]],
  },
  {
    trigger: 'Item.hover',
    sequence: [{ animation: { scale: { to: '$scaleHover', ease: quick } } }],
  },
];

// ============================================================================
// Context
// ============================================================================

interface SelectContextValue {
  value: string | undefined;
  onValueChange: (value: string) => void;
  open: boolean;
  isClosing: boolean;
  epoch: number;
  onExitDone: (epoch: number) => void;
  close: () => void;
  registerLabel: (value: string, label: React.ReactNode) => void;
  getLabel: (value: string) => React.ReactNode | undefined;
  animConfig: AnimationTrigger[] | null;
  triggerWidth: number;
  setTriggerWidth: (w: number) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
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
// Root
// ============================================================================

export interface SelectRootProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  animations?: AnimationTrigger[] | false;
  children?: React.ReactNode;
}

/**
 * Walk the React children tree to extract Select.Item value→label pairs.
 * This allows SelectValue to display the correct label before the dropdown
 * has ever been opened (items inside Portal don't mount until open).
 */
function extractItemLabels(children: React.ReactNode, map: Map<string, React.ReactNode>): void {
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    // Check if this is a SelectItem by displayName or internal marker
    const type = child.type as any;
    if (type?.displayName === 'SelectItem' || type?.__moveSelectItem) {
      const { value, label, children: itemChildren } = child.props as any;
      if (typeof value === 'string' && !map.has(value)) {
        map.set(value, label ?? itemChildren ?? value);
      }
    }
    // Recurse into children (Portal, Content, Viewport, etc.)
    if (child.props && (child.props as any).children) {
      extractItemLabels((child.props as any).children, map);
    }
  });
}

const SelectRoot: React.FC<SelectRootProps> = ({
  value: controlledValue,
  defaultValue,
  onValueChange,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  animations: animationsProp,
  children,
}) => {
  const animConfig = resolveAnimationsConfig(DEFAULT_SELECT_ANIMATIONS, animationsProp);

  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const [triggerWidth, setTriggerWidth] = React.useState(200);

  // Interruptible open/close lifecycle (open cancels an in-flight close;
  // exit-completion is epoch-guarded). See useDismissable.
  const dismissable = useDismissable({ open: controlledOpen, defaultOpen, onOpenChange });
  const { isOpen, isClosing, epoch, onExitDone, open: openFn, close } = dismissable;
  const open = isOpen;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const labelMapRef = React.useRef<Map<string, React.ReactNode>>(new Map());
  const [, forceUpdate] = React.useState(0);

  // Pre-populate label map from children tree so SelectValue can display
  // the correct label before the dropdown has been opened.
  extractItemLabels(children, labelMapRef.current);

  const isValueControlled = controlledValue !== undefined;
  const value = isValueControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = React.useCallback((newValue: string) => {
    if (!isValueControlled) {
      setUncontrolledValue(newValue);
    }
    onValueChange?.(newValue);
  }, [isValueControlled, onValueChange]);

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    // Open (or cancel an in-flight close); ignore Radix's own close — the exit
    // animation drives it (useDismissable).
    if (newOpen) openFn();
  }, [openFn]);

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
    <SelectContext.Provider value={{ value, onValueChange: handleValueChange, open: !!open, isClosing, epoch, onExitDone, close, registerLabel, getLabel, animConfig, triggerWidth, setTriggerWidth, triggerRef }}>
      <RadixDropdownMenu.Root open={open || isClosing} onOpenChange={handleOpenChange} modal={false}>
        {children}
      </RadixDropdownMenu.Root>
    </SelectContext.Provider>
  );
};
SelectRoot.displayName = 'Select.Root';

// ============================================================================
// Trigger
// ============================================================================

export type SelectTriggerSize = 'sm' | 'md' | 'lg';
export type SelectTriggerVariant = 'outlined' | 'filled';

export interface SelectTriggerProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  disabled?: boolean;
  invalid?: boolean;
  size?: SelectTriggerSize;
  variant?: SelectTriggerVariant;
  width?: React.CSSProperties['width'];
  minWidth?: React.CSSProperties['minWidth'];
  maxWidth?: React.CSSProperties['maxWidth'];
  sp?: SlotPropsMap<'trigger'>;
}

const SelectTrigger = withMoveComponent<'trigger', SelectTriggerProps, HTMLButtonElement>({
  name: 'SelectTrigger',
  styles,
  slots: ['trigger'] as const,
  defaults: { size: 'md', variant: 'outlined' },
  moveProps: ['invalid', 'disabled', 'width', 'minWidth', 'maxWidth', 'size', 'variant'],

  setup({ props, ref, cx, sp, attrs }) {
    const { open, isClosing, setTriggerWidth, triggerRef } = useSelectContext();
    const moveState = open && !isClosing ? 'open' : 'closed';
    const mergedRef = useMergedRef<HTMLButtonElement>(ref, triggerRef);

    React.useEffect(() => {
      const el = triggerRef.current;
      if (!el) return;
      setTriggerWidth(el.offsetWidth);
      const ro = new ResizeObserver(() => setTriggerWidth(el.offsetWidth));
      ro.observe(el);
      return () => ro.disconnect();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return {
      render() {
        const triggerSp = sp('trigger');
        const { className: spClass, style: spStyle, ...spRest } = triggerSp as Record<string, unknown>;
        return (
          <RadixDropdownMenu.Trigger
            {...attrs}
            {...spRest}
            ref={mergedRef}
            disabled={props.disabled as boolean}
            data-size={props.size}
            data-variant={props.variant}
            data-move-state={moveState}
            className={cx('trigger', props.className, spClass as string | undefined)}
            style={{
              ...props.style,
              ...(props.width != null ? { width: props.width as React.CSSProperties['width'] } : {}),
              ...(props.minWidth != null ? { minWidth: props.minWidth as React.CSSProperties['minWidth'] } : {}),
              ...(props.maxWidth != null ? { maxWidth: props.maxWidth as React.CSSProperties['maxWidth'] } : {}),
              ...(spStyle as React.CSSProperties),
            }}
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

export interface SelectValueProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'value'>;
}

const SelectValue = withMoveComponent<'value', SelectValueProps, HTMLSpanElement>({
  name: 'SelectValue',
  styles,
  slots: ['value'] as const,
  moveProps: ['placeholder'],

  setup({ props, ref, cx, sp, attrs }) {
    const { value, getLabel } = useSelectContext();

    return {
      render() {
        const valueSp = sp('value');
        const { className: spClass, style: spStyle, ...spRest } = valueSp as Record<string, unknown>;
        const showPlaceholder = value === undefined || value === '';
        const label = value !== undefined ? getLabel(value) : undefined;
        const displayText = showPlaceholder ? (props.placeholder as string) : (props.children ?? label ?? value);
        // Native tooltip — lets users see the full value when the trigger is too
        // narrow and the text gets ellipsized.
        const titleText = typeof displayText === 'string' ? displayText : undefined;
        return (
          <span
            {...attrs}
            {...spRest}
            ref={ref}
            title={titleText}
            className={cx('value', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            {...(showPlaceholder ? { 'data-placeholder': '' } : {})}
          >
            {wrapTextChildren(displayText, styles.valueText)}
          </span>
        );
      },
    };
  },
});

// ============================================================================
// Icon
// ============================================================================

export interface SelectIconProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'icon'>;
}

const SelectIcon = withMoveComponent<'icon', SelectIconProps, HTMLSpanElement>({
  name: 'SelectIcon',
  styles,
  slots: ['icon'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const resolvedChevron = useIcon('expand', 16);
    const iconRef = React.useRef<HTMLSpanElement>(null);
    const mergedRef = useMergedRef<HTMLSpanElement>(ref, iconRef);
    const { animConfig } = useSelectContext();

    // Icon rotation — extract Icon steps from open/closed triggers, run via state triggers
    // Trigger always sets data-move-state="open"|"closed" reflecting true state (incl. during exit)
    const iconStates: AnimationState[] = React.useMemo(() => [
      { name: 'open', slot: 'Icon', source: 'data-move-state', value: 'open', closest: '[data-move-state]', initial: false },
      { name: 'closed', slot: 'Icon', source: 'data-move-state', value: 'closed', closest: '[data-move-state]', initial: false },
    ], []);

    const iconConfig: AnimationTrigger[] | null = React.useMemo(() => {
      if (!animConfig) return null;
      const openSteps = extractSteps(animConfig.find(t => t.trigger === 'open'), ['Icon']);
      const closedSteps = extractSteps(animConfig.find(t => t.trigger === 'closed'), ['Icon']);
      const result: AnimationTrigger[] = [];
      if (openSteps) result.push({ trigger: 'open', sequence: openSteps });
      if (closedSteps) result.push({ trigger: 'closed', sequence: closedSteps });
      return result.length > 0 ? result : null;
    }, [animConfig]);

    const iconRefs = React.useMemo(() => ({
      Icon: iconRef as React.RefObject<HTMLElement | null>,
    }), []);

    useAnimations(iconConfig, iconRefs, iconStates);

    return {
      render() {
        const iconSp = sp('icon');
        const { className: spClass, style: spStyle, ...spRest } = iconSp as Record<string, unknown>;
        return (
          <span
            {...attrs}
            {...spRest}
            ref={mergedRef}
            className={cx('icon', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
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
// Content (auto-portals to document.body)
// ============================================================================

export interface SelectContentProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  container?: HTMLElement;
  width?: React.CSSProperties['width'];
  minWidth?: React.CSSProperties['minWidth'];
  maxWidth?: React.CSSProperties['maxWidth'];
  onPointerDownOutside?: (e: Event) => void;
  onEscapeKeyDown?: (e: KeyboardEvent) => void;
  onInteractOutside?: (e: Event) => void;
  sp?: SlotPropsMap<'content' | 'contentInner'>;
}

// Inner component that lives INSIDE the Portal — its hooks run after Portal
// has committed children to the DOM, so refs are always available.
interface SelectContentInnerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  width?: React.CSSProperties['width'];
  minWidth?: React.CSSProperties['minWidth'];
  maxWidth?: React.CSSProperties['maxWidth'];
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

const SelectContentInner = React.forwardRef<HTMLDivElement, SelectContentInnerProps>(
  function SelectContentInner(props, ref) {
    const { isClosing, epoch, onExitDone, close, animConfig, triggerWidth } = useSelectContext();

    const contentRef = React.useRef<HTMLDivElement>(null);
    const innerRef = React.useRef<HTMLDivElement>(null);
    const mergedContentRef = useMergedRef<HTMLDivElement>(ref, contentRef);

    // Close on external scroll — dropdown doesn't reposition so it would become misaligned.
    React.useEffect(() => {
      const onScroll = (e: Event) => {
        if (contentRef.current?.contains(e.target as Node)) return;
        close();
      };
      document.addEventListener('scroll', onScroll, { capture: true, passive: true });
      return () => document.removeEventListener('scroll', onScroll, { capture: true });
    }, [close]);

    // Width-relative item scale from trigger width (known before popup opens).
    const scaleFrom = (triggerWidth - SCALE_INSET_PX) / triggerWidth;

    const contentConfig: AnimationTrigger[] | null = React.useMemo(() => {
      if (!animConfig) return null;
      const openSteps = extractSteps(animConfig.find(t => t.trigger === 'open'), ['Content', 'ContentInner']);
      const closedSteps = extractSteps(animConfig.find(t => t.trigger === 'closed'), ['Content', 'ContentInner']);
      const result: AnimationTrigger[] = [];
      if (openSteps) result.push({ trigger: 'Content.enter', sequence: openSteps, vars: { scaleFrom } });
      if (closedSteps) result.push({ trigger: 'Content.exit', sequence: closedSteps, vars: { scaleFrom } });
      return result.length > 0 ? result : null;
    }, [animConfig, scaleFrom]);

    const contentRefs = React.useMemo(() => ({
      Content: contentRef as React.RefObject<HTMLElement | null>,
      ContentInner: innerRef as React.RefObject<HTMLElement | null>,
    }), []);

    // Scroll + focus the selected item synchronously on mount — BEFORE the
    // animation runs and BEFORE Radix's default auto-focus lands on the
    // first item. This ensures arrow navigation always starts from the
    // currently-selected value (or from the first item when nothing is
    // selected), not from whatever Radix happened to focus first.
    React.useLayoutEffect(() => {
      const content = contentRef.current;
      const inner = innerRef.current;
      if (!content || !inner) return;

      const selected = inner.querySelector('[data-selected]') as HTMLElement | null;
      const target = selected ?? (inner.querySelector('[role="menuitem"]:not([data-disabled])') as HTMLElement | null);

      if (selected) {
        inner.scrollTop = Math.max(
          0,
          selected.offsetTop - inner.clientHeight / 2 + selected.offsetHeight / 2,
        );
      }

      // Focus the target so roving tabindex starts from the selected item.
      target?.focus({ preventScroll: true });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Enter/exit via useAnimations orchestrator. Focus is already placed
    // by the useLayoutEffect above, so nothing to do on animation end.
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
        sideOffset={props.sideOffset ?? 4}
        align={props.align}
        className={props.contentCx('content', props.className, spClass as string | undefined)}
        style={{
          ...props.style,
          ...(props.layer > 0 ? { zIndex: props.layer + 1 } : {}),
          ...(props.width != null ? { width: props.width } : {}),
          ...(props.minWidth != null ? { minWidth: props.minWidth } : {}),
          ...(props.maxWidth != null ? { maxWidth: props.maxWidth } : {}),
          ...(spStyle as React.CSSProperties),
        }}
        onPointerDownOutside={handlePointerDownOutside}
        onEscapeKeyDown={handleEscapeKeyDown}
        onInteractOutside={handleInteractOutside}
        data-surface="subtle"
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

const SelectContent = withMoveComponent<'content' | 'contentInner', SelectContentProps, HTMLDivElement>({
  name: 'SelectContent',
  styles,
  slots: ['content', 'contentInner'] as const,
  moveProps: ['sideOffset', 'align', 'container', 'width', 'minWidth', 'maxWidth', 'onPointerDownOutside', 'onEscapeKeyDown', 'onInteractOutside'],

  setup({ props, ref, cx, sp, attrs }) {
    const layer = useLayer();

    return {
      render() {
        const contentSp = sp('content');
        const innerSp = sp('contentInner');

        return (
          <RadixDropdownMenu.Portal container={props.container as HTMLElement | undefined}>
            <SelectContentInner
              ref={ref}
              className={props.className}
              style={props.style}
              sideOffset={props.sideOffset as number | undefined}
              align={props.align as 'start' | 'center' | 'end' | undefined}
              width={props.width as React.CSSProperties['width'] | undefined}
              minWidth={props.minWidth as React.CSSProperties['minWidth'] | undefined}
              maxWidth={props.maxWidth as React.CSSProperties['maxWidth'] | undefined}
              onPointerDownOutside={props.onPointerDownOutside as ((e: Event) => void) | undefined}
              onEscapeKeyDown={props.onEscapeKeyDown as ((e: KeyboardEvent) => void) | undefined}
              onInteractOutside={props.onInteractOutside as ((e: Event) => void) | undefined}
              contentCx={cx}
              innerCx={cx}
              contentSp={contentSp as Record<string, unknown>}
              innerSp={innerSp as Record<string, unknown>}
              layer={layer}
              attrs={attrs}
            >
              {props.children}
            </SelectContentInner>
          </RadixDropdownMenu.Portal>
        );
      },
    };
  },
});

// ============================================================================
// Viewport
// ============================================================================

export interface SelectViewportProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'viewport'>;
}

const SelectViewport = withMoveComponent<'viewport', SelectViewportProps, HTMLDivElement>({
  name: 'SelectViewport',
  styles,
  slots: ['viewport'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const viewportSp = sp('viewport');
        const { className: spClass, style: spStyle, ...spRest } = viewportSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('viewport', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
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

export interface SelectItemProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  value: string;
  label?: React.ReactNode;
  disabled?: boolean;
  onSelect?: (e: Event) => void;
  sp?: SlotPropsMap<'item'>;
}

const SelectItem = withMoveComponent<'item', SelectItemProps, HTMLDivElement>({
  name: 'SelectItem',
  styles,
  slots: ['item'] as const,
  moveProps: ['value', 'label', 'disabled', 'onSelect'],

  setup({ props, ref, cx, sp, attrs }) {
    const itemRef = React.useRef<HTMLDivElement | null>(null);
    const { value, onValueChange, close, registerLabel, animConfig, triggerWidth } = useSelectContext();
    const isSelected = value === (props.value as string);

    const mergedItemRef = useMergedRef<HTMLDivElement>(ref, itemRef);

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

    // Item hover animation via useAnimations
    // Clamp trigger width to avoid exaggerated scale on narrow selects
    const effectiveWidth = Math.max(triggerWidth, 120);
    const scaleHover = (effectiveWidth + SCALE_HOVER_PX) / effectiveWidth;
    const itemConfig = React.useMemo(() => {
      if (!animConfig) return null;
      const hover = animConfig.find((t) => t.trigger === 'Item.hover');
      return hover ? [{ ...hover, trigger: 'Item.hover', vars: { scaleHover } }] : null;
    }, [animConfig, scaleHover]);

    const itemRefs = React.useMemo(() => ({
      Item: itemRef as React.RefObject<HTMLElement | null>,
    }), []);

    const { handlers } = useAnimations(itemConfig, itemRefs);

    return {
      render() {
        const itemSp = sp('item');
        const { className: spClass, style: spStyle, ...spRest } = itemSp as Record<string, unknown>;

        const itemTitle =
          typeof props.children === 'string'
            ? props.children
            : typeof props.label === 'string'
              ? (props.label as string)
              : undefined;
        return (
          <RadixDropdownMenu.Item
            {...attrs}
            {...spRest}
            ref={mergedItemRef}
            disabled={props.disabled as boolean}
            data-selected={isSelected ? '' : undefined}
            title={itemTitle}
            onSelect={handleSelect}
            onMouseEnter={() => handlers.Item?.onMouseEnter?.()}
            onMouseLeave={() => handlers.Item?.onMouseLeave?.()}
            className={cx('item', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {wrapTextChildren(props.children, styles.itemText)}
          </RadixDropdownMenu.Item>
        );
      },
    };
  },
});

// Static marker so extractItemLabels can identify Select.Item in the React tree
(SelectItem as any).__moveSelectItem = true;

// ============================================================================
// Group
// ============================================================================

export interface SelectGroupProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'group'>;
}

const SelectGroup = withMoveComponent<'group', SelectGroupProps, HTMLDivElement>({
  name: 'SelectGroup',
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

export interface SelectLabelProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'label'>;
}

const SelectLabel = withMoveComponent<'label', SelectLabelProps, HTMLDivElement>({
  name: 'SelectLabel',
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
// Separator
// ============================================================================

export interface SelectSeparatorProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'separator'>;
}

const SelectSeparator = withMoveComponent<'separator', SelectSeparatorProps, HTMLDivElement>({
  name: 'SelectSeparator',
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
// Export
// ============================================================================

export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Icon: SelectIcon,
  Content: SelectContent,
  Viewport: SelectViewport,
  Item: SelectItem,
  Group: SelectGroup,
  Label: SelectLabel,
  Separator: SelectSeparator,
};
