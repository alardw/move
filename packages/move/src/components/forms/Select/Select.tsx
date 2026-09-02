'use client';
// Generated from Select.spec.ts

import * as React from 'react';
import type { Dimension, FieldWidth, PopoverWidth } from '../../../shared/types';
import { Select as RadixSelect } from 'radix-ui';
import { withMoveComponent, useMergedRef, elementTypeName } from '../../../engine';
import { useFieldControl } from '../FormField/FormField';
import type { SlotPropsMap, CxFn } from '../../../engine';
import { useIcon } from '../../../infrastructure/Icon';
import {
  useAnimations,
  resolveAnimationsConfig,
  extractSteps,
  staggerItems,
  quick,
  useDismissable,
  useDismissableExit,
} from '../../../animation';
import type { AnimationTrigger, AnimationState } from '../../../animation';
import { useLayer } from '../../../infrastructure/Layer';
import styles from './Select.module.css';

// Per-item scale deltas, pixel-based so the motion feels the SAME at any width.
// A fixed scale ratio (e.g. 0.8) would swing wide controls much further in
// absolute pixels — hence more overshoot/bounce — for the same ratio. Deriving
// the ratio from a fixed pixel inset keeps the travel constant across widths.
const SCALE_INSET_PX = 16; // per-item reveal offset
const SCALE_HOVER_PX = 4; // per-item hover scale

// Every visible dropdown row participates in the stagger: options, group
// labels, and separators. Built on Radix Select, so items carry `role="option"`
// (was `menuitem` under the old DropdownMenu build); labels/separators match via
// their scoped CSS module classes.
const CHILDREN_SELECTOR = `[role="option"], [class*="label"], [class*="separator"]`;

// Wraps only the string/number leaves of a ReactNode tree in a block-level
// span so text-overflow: ellipsis applies natively. React elements (Icons,
// custom components) pass through untouched.
function wrapTextChildren(children: React.ReactNode, textClass: string): React.ReactNode {
  const wrapped = React.Children.map(children, (child, i) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return (
        <span key={i} className={textClass}>
          {child}
        </span>
      );
    }
    return child;
  });
  return wrapped ?? children;
}

// Pull the plain-text label out of an item's children/label — the fallback for
// Radix's <Select.ItemText> when an item has no direct text leaf.
function textOf(node: React.ReactNode): string {
  let out = '';
  React.Children.forEach(node, (child) => {
    if (typeof child === 'string' || typeof child === 'number') out += String(child);
    else if (
      React.isValidElement(child) &&
      (child.props as { children?: React.ReactNode })?.children
    )
      out += textOf((child.props as { children?: React.ReactNode }).children);
  });
  return out;
}

// Render item children with the string/number leaf wrapped in Radix's
// <Select.ItemText> (Radix reads it for typeahead and the hidden native
// <option>); element children (icons) pass through as siblings. An item with no
// text leaf still gets one ItemText, synthesized from label/value, so Radix has
// something to key on.
function renderItemChildren(
  children: React.ReactNode,
  fallback: string,
  itemTextClass: string,
): React.ReactNode {
  let hasText = false;
  const out = React.Children.map(children, (child, i) => {
    if (typeof child === 'string' || typeof child === 'number') {
      hasText = true;
      return (
        <RadixSelect.ItemText key={i} className={itemTextClass}>
          {child}
        </RadixSelect.ItemText>
      );
    }
    return child;
  });
  if (hasText) return out;
  return (
    <>
      {out}
      <RadixSelect.ItemText className={itemTextClass}>{fallback}</RadixSelect.ItemText>
    </>
  );
}

const DEFAULT_SELECT_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'open',
    sequence: [
      [
        { target: 'Content', animation: { opacity: { from: 0, to: 1, duration: 150 } } },
        {
          target: 'ContentInner',
          children: CHILDREN_SELECTOR,
          stagger: staggerItems.stagger,
          animation: {
            // `quick`, not `poppy`: this row settles inside the panel's
            // overflow:hidden box, and a spring that passes its resting size
            // gets that overshoot shaved off. Every spring here is underdamped,
            // but they are not close — poppy sits at damping 12 against a
            // critical 33.5 and overshoots ~30%, while quick's 20 against 31
            // overshoots ~7%. Against a scale delta this small that is a
            // fraction of a pixel, so it still reads as a spring without
            // needing room made for it.
            scale: { from: '$scaleFrom', to: 1, ease: quick },
            opacity: { from: 0, to: 1, duration: 200 },
          },
        },
        {
          target: 'Icon',
          animation: { rotate: { from: 0, to: 180, ease: 'outQuart', duration: 300 } },
        },
      ],
    ],
  },
  {
    trigger: 'closed',
    sequence: [
      [
        { target: 'Content', animation: { opacity: { to: 0, duration: 150 } } },
        {
          target: 'ContentInner',
          children: CHILDREN_SELECTOR,
          stagger: staggerItems.stagger,
          animation: {
            scale: { to: '$scaleFrom', ease: 'outQuart', duration: 150 },
            opacity: { to: 0, duration: 150 },
          },
        },
        {
          target: 'Icon',
          animation: { rotate: { from: 180, to: 0, ease: 'outQuart', duration: 300 } },
        },
      ],
    ],
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

// Content → Viewport bridge. Radix Select requires its items to live inside a
// `RadixSelect.Viewport`, so the Viewport IS the stagger container (`.contentInner`)
// — items are its DIRECT children, exactly like Dropdown's contentInner div. The
// Content component owns the animated ref + slot styling and hands them down to
// whichever `<Select.Viewport>` the consumer renders inside it.
interface SelectViewportBridge {
  innerRef: React.RefObject<HTMLDivElement | null>;
  innerClassName: string;
  innerStyle?: React.CSSProperties;
  innerRest: Record<string, unknown>;
}
const SelectViewportContext = React.createContext<SelectViewportBridge | null>(null);

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
  /** Name of the hidden native <select> — set this to submit the value with a form. */
  name?: string;
  /** Marks the underlying native select required for form validation. */
  required?: boolean;
  disabled?: boolean;
  animations?: AnimationTrigger[] | false;
  children?: React.ReactNode;
}

/** Walk the children tree to pre-fill value→label pairs so the trigger can show
 *  the selected label (rich content included) before the dropdown ever opens. */
function extractItemLabels(children: React.ReactNode, map: Map<string, React.ReactNode>): void {
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    // The marker is the opt-in path: a consumer's own wrapper can declare itself
    // a SelectItem without matching the name.
    const marked = (child.type as { __moveSelectItem?: boolean } | undefined)?.__moveSelectItem;
    if (elementTypeName(child) === 'SelectItem' || marked) {
      const {
        value,
        label,
        children: itemChildren,
      } = child.props as {
        value?: string;
        label?: React.ReactNode;
        children?: React.ReactNode;
      };
      if (typeof value === 'string' && !map.has(value)) {
        map.set(value, label ?? itemChildren ?? value);
      }
    }
    const kids = (child.props as { children?: React.ReactNode })?.children;
    if (kids) extractItemLabels(kids, map);
  });
}

const SelectRoot: React.FC<SelectRootProps> = ({
  value: controlledValue,
  defaultValue,
  onValueChange,
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  name,
  required,
  disabled,
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
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const labelMapRef = React.useRef<Map<string, React.ReactNode>>(new Map());
  const [, forceUpdate] = React.useState(0);

  extractItemLabels(children, labelMapRef.current);

  const isValueControlled = controlledValue !== undefined;
  const value = isValueControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (!isValueControlled) setUncontrolledValue(newValue);
      onValueChange?.(newValue);
    },
    [isValueControlled, onValueChange],
  );

  // Radix Select drives open on its own (click, selection, escape); route it
  // through the dismissable so the close plays the exit animation.
  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (newOpen) openFn();
      else close();
    },
    [openFn, close],
  );

  const registerLabel = React.useCallback((itemValue: string, label: React.ReactNode) => {
    const prev = labelMapRef.current.get(itemValue);
    if (prev !== label) {
      labelMapRef.current.set(itemValue, label);
      forceUpdate((n) => n + 1);
    }
  }, []);

  const getLabel = React.useCallback((itemValue: string) => labelMapRef.current.get(itemValue), []);

  return (
    <SelectContext.Provider
      value={{
        value,
        isClosing,
        epoch,
        onExitDone,
        close,
        registerLabel,
        getLabel,
        animConfig,
        triggerWidth,
        setTriggerWidth,
        triggerRef,
      }}
    >
      <RadixSelect.Root
        // Radix must see ONE mode for its whole life. Passing `value` unconditionally made an
        // uncontrolled Select (no defaultValue) hand Radix `undefined` on mount and a string
        // after the first selection — i.e. uncontrolled → controlled. `handleValueChange`
        // mirrors into `uncontrolledValue` either way, so the trigger label still resolves.
        {...(isValueControlled ? { value: controlledValue } : { defaultValue })}
        onValueChange={handleValueChange}
        open={isOpen || isClosing}
        onOpenChange={handleOpenChange}
        name={name}
        required={required}
        disabled={disabled}
      >
        {children}
      </RadixSelect.Root>
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
  width?: FieldWidth;
  minWidth?: Dimension;
  maxWidth?: Dimension;
  sp?: SlotPropsMap<'trigger'>;
}

const SelectTrigger = withMoveComponent<'trigger', SelectTriggerProps, HTMLButtonElement>({
  name: 'SelectTrigger',
  styles,
  slots: ['trigger'] as const,
  defaults: { size: 'md', variant: 'outlined' },
  moveProps: ['invalid', 'disabled', 'width', 'minWidth', 'maxWidth', 'size', 'variant'],

  setup({ props, ref, cx, sp, attrs }) {
    const { setTriggerWidth, triggerRef } = useSelectContext();
    const mergedRef = useMergedRef<HTMLButtonElement>(ref, triggerRef);
    const controlProps = useFieldControl(attrs as Record<string, unknown>, {
      invalid: !!props.invalid,
      ref: triggerRef,
    });

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
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = triggerSp as Record<string, unknown>;
        return (
          <RadixSelect.Trigger
            {...controlProps}
            {...spRest}
            ref={mergedRef}
            disabled={props.disabled as boolean}
            data-size={props.size}
            data-variant={props.variant}
            className={cx('trigger', props.className, spClass as string | undefined)}
            data-width={props.width as string | undefined}
            style={{
              ...props.style,
              ...(props.minWidth != null
                ? { minWidth: props.minWidth as React.CSSProperties['minWidth'] }
                : {}),
              ...(props.maxWidth != null
                ? { maxWidth: props.maxWidth as React.CSSProperties['maxWidth'] }
                : {}),
              ...(spStyle as React.CSSProperties),
            }}
            {...(props.disabled ? { 'data-disabled': '' } : {})}
            {...(props.invalid ? { 'data-invalid': '' } : {})}
          >
            {props.children}
          </RadixSelect.Trigger>
        );
      },
    };
  },
});

// ============================================================================
// Value — custom display so rich content (icon + label) shows in the trigger,
// reading the value→label map. Radix's own value plumbing (typeahead, the hidden
// native <select>) comes from each item's <Select.ItemText>, independent of this.
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
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = valueSp as Record<string, unknown>;
        const showPlaceholder = value === undefined || value === '';
        const label = value !== undefined ? getLabel(value) : undefined;
        const displayText = showPlaceholder
          ? (props.placeholder as string)
          : (props.children ?? label ?? value);
        const titleText = typeof displayText === 'string' ? displayText : undefined;
        return (
          <span
            title={titleText}
            {...attrs}
            {...spRest}
            ref={ref}
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

    // Icon rotation — driven by the trigger's data-state (Radix sets open/closed
    // on the trigger) plus our data-move-state override during the exit anim.
    const iconStates: AnimationState[] = React.useMemo(
      () => [
        {
          name: 'open',
          slot: 'Icon',
          source: 'data-state',
          value: 'open',
          closest: '[data-state]',
          initial: false,
        },
        {
          name: 'closed',
          slot: 'Icon',
          source: 'data-state',
          value: 'closed',
          closest: '[data-state]',
          initial: false,
        },
      ],
      [],
    );

    const iconConfig: AnimationTrigger[] | null = React.useMemo(() => {
      if (!animConfig) return null;
      const openSteps = extractSteps(
        animConfig.find((t) => t.trigger === 'open'),
        ['Icon'],
      );
      const closedSteps = extractSteps(
        animConfig.find((t) => t.trigger === 'closed'),
        ['Icon'],
      );
      const result: AnimationTrigger[] = [];
      if (openSteps) result.push({ trigger: 'open', sequence: openSteps });
      if (closedSteps) result.push({ trigger: 'closed', sequence: closedSteps });
      return result.length > 0 ? result : null;
    }, [animConfig]);

    const iconRefs = React.useMemo(
      () => ({ Icon: iconRef as React.RefObject<HTMLElement | null> }),
      [],
    );

    useAnimations(iconConfig, iconRefs, iconStates);

    return {
      render() {
        const iconSp = sp('icon');
        const { className: spClass, style: spStyle, ...spRest } = iconSp as Record<string, unknown>;
        return (
          <RadixSelect.Icon asChild>
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
          </RadixSelect.Icon>
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
  width?: PopoverWidth;
  minWidth?: Dimension;
  maxWidth?: Dimension;
  onPointerDownOutside?: (e: Event) => void;
  onEscapeKeyDown?: (e: KeyboardEvent) => void;
  sp?: SlotPropsMap<'content' | 'contentInner'>;
}

// Inner component — lives inside the Portal, so its refs are available after the
// Portal commits children to the DOM.
interface SelectContentInnerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  width?: PopoverWidth;
  minWidth?: Dimension;
  maxWidth?: Dimension;
  onPointerDownOutside?: (e: Event) => void;
  onEscapeKeyDown?: (e: KeyboardEvent) => void;
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

    // Width-relative per-item scale → constant pixel travel at any width.
    const scaleFrom = (triggerWidth - SCALE_INSET_PX) / triggerWidth;

    // Radix keeps the listbox mounted BEFORE the popup is visibly open and commits
    // its rows a frame after mount, so the engine's mount-time lifecycle enter is
    // wrong here (plays invisibly, then its one-shot lock blocks re-firing on
    // reopen). We suppress that auto-enter and fire imperatively instead:
    //   • Content.exit is present from the first render, so the config is non-null
    //     immediately → the lifecycle lock trips with NO enter trigger, killing the
    //     eager auto-fire (exit itself never auto-fires; only runExit runs it).
    //   • Content.enter is added once rows exist, but the lock is already tripped so
    //     it never auto-fires — only runEnter() runs it.
    //   • A poll calls runEnter() on each closed→open transition (when the popup is
    //     actually visible), so the stagger plays in view on EVERY open.
    const [itemsReady, setItemsReady] = React.useState(false);

    React.useLayoutEffect(() => {
      if (itemsReady) return;
      let raf = 0;
      const check = () => {
        if (innerRef.current?.querySelector('[role="option"]')) return setItemsReady(true);
        raf = requestAnimationFrame(check);
      };
      check();
      return () => cancelAnimationFrame(raf);
    }, [itemsReady]);

    const contentConfig: AnimationTrigger[] | null = React.useMemo(() => {
      if (!animConfig) return null;
      const openSteps = extractSteps(
        animConfig.find((t) => t.trigger === 'open'),
        ['Content', 'ContentInner'],
      );
      const closedSteps = extractSteps(
        animConfig.find((t) => t.trigger === 'closed'),
        ['Content', 'ContentInner'],
      );
      const result: AnimationTrigger[] = [];
      if (openSteps && itemsReady)
        result.push({ trigger: 'Content.enter', sequence: openSteps, vars: { scaleFrom } });
      if (closedSteps)
        result.push({ trigger: 'Content.exit', sequence: closedSteps, vars: { scaleFrom } });
      return result.length > 0 ? result : null;
    }, [animConfig, itemsReady, scaleFrom]);

    const contentRefs = React.useMemo(
      () => ({
        Content: contentRef as React.RefObject<HTMLElement | null>,
        ContentInner: innerRef as React.RefObject<HTMLElement | null>,
      }),
      [],
    );

    const { runExit, runEnter, pauseAll } = useAnimations(contentConfig, contentRefs);

    useDismissableExit({ isClosing, epoch, onExitDone, runExit, runEnter, pauseAll });

    // Fire the reveal imperatively on each closed→open transition (the moment the
    // popup becomes visible). The engine's auto-enter is suppressed (see above), so
    // this is the single fire — and runEnter() re-runs regardless of the one-shot
    // lock, so it plays on EVERY open, not just the first.
    const wasOpenRef = React.useRef(false);
    React.useEffect(() => {
      let raf = 0;
      const tick = () => {
        const el = contentRef.current as HTMLElement | null;
        const open = el?.closest('[data-state]')?.getAttribute('data-state') === 'open';
        const hasRows = !!innerRef.current?.querySelector('[role="option"]');
        if (open && hasRows && !wasOpenRef.current) {
          wasOpenRef.current = true;
          runEnter();
        } else if (!open) {
          wasOpenRef.current = false;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [runEnter]);

    const handlePointerDownOutside = (e: Event) => {
      props.onPointerDownOutside?.(e);
      if (!e.defaultPrevented) close();
    };

    const handleEscapeKeyDown = (e: KeyboardEvent) => {
      props.onEscapeKeyDown?.(e);
      if (!e.defaultPrevented) close();
    };

    const { className: spClass, style: spStyle, ...spRest } = props.contentSp;
    const { className: innerSpClass, style: innerSpStyle, ...innerSpRest } = props.innerSp;

    return (
      <RadixSelect.Content
        {...props.attrs}
        {...spRest}
        ref={mergedContentRef}
        position="popper"
        sideOffset={props.sideOffset ?? 4}
        align={props.align}
        className={props.contentCx('content', props.className, spClass as string | undefined)}
        style={{
          ...props.style,
          ...(props.layer > 0 ? { zIndex: props.layer + 1 } : {}),
          ...(props.minWidth != null ? { minWidth: props.minWidth } : {}),
          ...(props.maxWidth != null ? { maxWidth: props.maxWidth } : {}),
          ...(spStyle as React.CSSProperties),
        }}
        onPointerDownOutside={handlePointerDownOutside}
        onEscapeKeyDown={handleEscapeKeyDown}
        data-width={(props.width as string | undefined) ?? 'anchor'}
        data-surface="subtle"
      >
        {/* The consumer's <Select.Viewport> renders Radix's Viewport as the DIRECT
            child of Content and becomes the `.contentInner` stagger container —
            items are its direct children, exactly like Dropdown. The ref + slot
            styling are handed down through the bridge context. */}
        <SelectViewportContext.Provider
          value={{
            innerRef,
            innerClassName: props.innerCx('contentInner', innerSpClass as string | undefined),
            innerStyle: innerSpStyle as React.CSSProperties,
            innerRest: innerSpRest,
          }}
        >
          {props.children}
        </SelectViewportContext.Provider>
      </RadixSelect.Content>
    );
  },
);

const SelectContent = withMoveComponent<
  'content' | 'contentInner',
  SelectContentProps,
  HTMLDivElement
>({
  name: 'SelectContent',
  styles,
  slots: ['content', 'contentInner'] as const,
  moveProps: [
    'sideOffset',
    'align',
    'container',
    'width',
    'minWidth',
    'maxWidth',
    'onPointerDownOutside',
    'onEscapeKeyDown',
  ],

  setup({ props, ref, cx, sp, attrs }) {
    const layer = useLayer();

    return {
      render() {
        const contentSp = sp('content');
        const innerSp = sp('contentInner');

        return (
          <RadixSelect.Portal container={props.container as HTMLElement | undefined}>
            <SelectContentInner
              ref={ref}
              className={props.className}
              style={props.style}
              sideOffset={props.sideOffset as number | undefined}
              align={props.align as 'start' | 'center' | 'end' | undefined}
              width={props.width as PopoverWidth | undefined}
              minWidth={props.minWidth as Dimension | undefined}
              maxWidth={props.maxWidth as Dimension | undefined}
              onPointerDownOutside={props.onPointerDownOutside as ((e: Event) => void) | undefined}
              onEscapeKeyDown={props.onEscapeKeyDown as ((e: KeyboardEvent) => void) | undefined}
              contentCx={cx}
              innerCx={cx}
              contentSp={contentSp as Record<string, unknown>}
              innerSp={innerSp as Record<string, unknown>}
              layer={layer}
              attrs={attrs}
            >
              {props.children}
            </SelectContentInner>
          </RadixSelect.Portal>
        );
      },
    };
  },
});

// ============================================================================
// Viewport — Radix's required scroll viewport, rendered as the DIRECT child of
// Content. It IS the `.contentInner` stagger container: items are its direct
// children (matches Dropdown), and its ref + slot styling come from Content via
// the bridge context so the open/close animation runs on it.
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
    // Radix owns the Viewport (its ref, scroll, positioning) — we leave it alone.
    // Our animated `.contentInner` stagger container is a plain div INSIDE it, which
    // Radix doesn't manage (matches Dropdown's contentInner). Items are its direct
    // children; the ref + slot styling come from Content via the bridge.
    const bridge = React.useContext(SelectViewportContext);

    return {
      render() {
        const viewportSp = sp('viewport');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = viewportSp as Record<string, unknown>;
        return (
          <RadixSelect.Viewport
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('viewport', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            <div
              ref={bridge?.innerRef as React.Ref<HTMLDivElement> | undefined}
              className={bridge?.innerClassName}
              style={bridge?.innerStyle}
              {...(bridge?.innerRest ?? {})}
            >
              {props.children}
            </div>
          </RadixSelect.Viewport>
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
    const { registerLabel, animConfig, triggerWidth } = useSelectContext();

    const mergedItemRef = useMergedRef<HTMLDivElement>(ref, itemRef);

    const displayLabel = props.label ?? props.children;
    React.useEffect(() => {
      registerLabel(props.value as string, displayLabel);
    }, [props.value, displayLabel, registerLabel]);

    // Item hover animation. Clamp trigger width to avoid exaggerated scale on
    // narrow selects.
    const effectiveWidth = Math.max(triggerWidth, 120);
    const scaleHover = (effectiveWidth + SCALE_HOVER_PX) / effectiveWidth;
    const itemConfig = React.useMemo(() => {
      if (!animConfig) return null;
      const hover = animConfig.find((t) => t.trigger === 'Item.hover');
      return hover ? [{ ...hover, trigger: 'Item.hover', vars: { scaleHover } }] : null;
    }, [animConfig, scaleHover]);

    const itemRefs = React.useMemo(
      () => ({ Item: itemRef as React.RefObject<HTMLElement | null> }),
      [],
    );

    const { handlers } = useAnimations(itemConfig, itemRefs);

    return {
      render() {
        const itemSp = sp('item');
        const { className: spClass, style: spStyle, ...spRest } = itemSp as Record<string, unknown>;

        const itemText = textOf(props.label ?? props.children);
        return (
          <RadixSelect.Item
            title={itemText || undefined}
            {...attrs}
            {...spRest}
            ref={mergedItemRef}
            value={props.value as string}
            disabled={props.disabled as boolean}
            onMouseEnter={() => handlers.Item?.onMouseEnter?.()}
            onMouseLeave={() => handlers.Item?.onMouseLeave?.()}
            className={cx('item', props.className, spClass as string | undefined)}
            style={{
              // Width-relative, so it cannot be a constant in the stylesheet —
              // the component supplies the VALUE and CSS holds the STATE. Without
              // the class the hover animation has nothing to hand its transform
              // back to and the row clicks flat under the pointer.
              ['--move-select-item-scale-hover' as string]: scaleHover,
              ...props.style,
              ...(spStyle as React.CSSProperties),
            }}
          >
            {renderItemChildren(
              props.children,
              itemText || (props.value as string),
              styles.itemText,
            )}
          </RadixSelect.Item>
        );
      },
    };
  },
});

// Static marker so extractItemLabels can identify Select.Item in the React tree
(SelectItem as unknown as { __moveSelectItem?: boolean }).__moveSelectItem = true;

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
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = groupSp as Record<string, unknown>;
        return (
          <RadixSelect.Group
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('group', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixSelect.Group>
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
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = labelSp as Record<string, unknown>;
        return (
          <RadixSelect.Label
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('label', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixSelect.Label>
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
          <RadixSelect.Separator
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
