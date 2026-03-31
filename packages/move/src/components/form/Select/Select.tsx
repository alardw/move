'use client';
// Generated from Select.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)

import * as React from 'react';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { useResolvedIcon } from '../../../infrastructure/Icon';
import {
  useAnimations,
  resolveAnimationsConfig, extractSteps,
  revealHeight, staggerItems, quick, poppy,
} from '../../../animation';
import type { AnimationTrigger, AnimationState } from '../../../animation';
import { useLayer } from '../../../infrastructure/Layer';
import styles from './Select.module.css';

// Fixed pixel amounts for width-relative scale — ensures consistent feel regardless of control width
const SCALE_INSET_PX = 16;
const SCALE_HOVER_PX = 8;

const DEFAULT_SELECT_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'open',
    sequence: [[
      { target: 'Content', fn: 'animateDimension', animation: revealHeight.enter },
      { target: 'ContentInner', children: '[role="menuitem"]', stagger: staggerItems.stagger, animation: { scale: { from: '$scaleFrom', to: 1, ease: poppy }, opacity: { from: 0, to: 1 } } },
      { target: 'Icon', animation: { rotate: { to: 180, ease: 'outQuart', duration: 300 } } },
    ]],
  },
  {
    trigger: 'closed',
    sequence: [[
      { target: 'Content', fn: 'animateDimension', animation: revealHeight.exit },
      { target: 'ContentInner', children: '[role="menuitem"]', stagger: staggerItems.stagger, animation: { scale: { to: '$scaleFrom', ease: 'outQuart', duration: 150 }, opacity: { to: 0, duration: 150 } } },
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
  onCloseComplete: () => void;
  close: () => void;
  registerLabel: (value: string, label: React.ReactNode) => void;
  getLabel: (value: string) => React.ReactNode | undefined;
  animConfig: AnimationTrigger[] | null;
  triggerWidth: number;
  setTriggerWidth: (w: number) => void;
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
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [triggerWidth, setTriggerWidth] = React.useState(200);
  const labelMapRef = React.useRef<Map<string, React.ReactNode>>(new Map());
  const [, forceUpdate] = React.useState(0);

  // Pre-populate label map from children tree so SelectValue can display
  // the correct label before the dropdown has been opened.
  extractItemLabels(children, labelMapRef.current);

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
    <SelectContext.Provider value={{ value, onValueChange: handleValueChange, open: !!open, isClosing, onCloseComplete: handleCloseComplete, close, registerLabel, getLabel, animConfig, triggerWidth, setTriggerWidth }}>
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

export type SelectTriggerSize = 'sm' | 'md' | 'lg';
export type SelectTriggerVariant = 'outlined' | 'filled';

export interface SelectTriggerProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  disabled?: boolean;
  invalid?: boolean;
  size?: SelectTriggerSize;
  variant?: SelectTriggerVariant;
  width?: React.CSSProperties['width'];
  sp?: SlotPropsMap<'trigger'>;
}

const SelectTrigger = withMoveComponent<'trigger', SelectTriggerProps, HTMLButtonElement>({
  name: 'SelectTrigger',
  styles,
  slots: ['trigger'] as const,
  defaults: { size: 'md', variant: 'outlined' },
  moveProps: ['invalid', 'disabled', 'width', 'size', 'variant'],

  setup({ props, ref, cx, sp, attrs }) {
    const { open, isClosing, setTriggerWidth } = useSelectContext();
    const moveState = open && !isClosing ? 'open' : 'closed';
    const triggerRef = React.useRef<HTMLButtonElement>(null);
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
            style={{ ...props.style, ...(props.width != null ? { width: props.width } : {}), ...(spStyle as React.CSSProperties) }}
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
        return (
          <span
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('value', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
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
  sp?: SlotPropsMap<'icon'>;
}

const SelectIcon = withMoveComponent<'icon', SelectIconProps, HTMLSpanElement>({
  name: 'SelectIcon',
  styles,
  slots: ['icon'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const resolvedChevron = useResolvedIcon('chevron-down', 16);
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
// Portal
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
  sp?: SlotPropsMap<'content' | 'contentInner'>;
}

const SelectContent = withMoveComponent<'content' | 'contentInner', SelectContentProps, HTMLDivElement>({
  name: 'SelectContent',
  styles,
  slots: ['content', 'contentInner'] as const,
  moveProps: ['sideOffset', 'align', 'onPointerDownOutside', 'onEscapeKeyDown', 'onInteractOutside'],

  setup({ props, ref, cx, sp, attrs }) {
    const { isClosing, onCloseComplete, close, animConfig, triggerWidth } = useSelectContext();
    const layer = useLayer();

    const contentRef = React.useRef<HTMLDivElement>(null);
    const innerRef = React.useRef<HTMLDivElement>(null);

    // Width-relative scale from trigger width (known before popup opens)
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

    // Scroll to selected item BEFORE animation starts (runs before useAnimations' useLayoutEffect)
    React.useLayoutEffect(() => {
      if (!contentRef.current || !animConfig) return;
      const inner = innerRef.current;
      if (inner) {
        const selectedItem = inner.querySelector('[data-selected]') as HTMLElement | null;
        if (selectedItem) {
          inner.scrollTop = Math.max(0, selectedItem.offsetTop - inner.clientHeight / 2 + selectedItem.offsetHeight / 2);
        }
      }
    }, [animConfig]); // eslint-disable-line react-hooks/exhaustive-deps

    // Enter/exit via useAnimations orchestrator
    const { runExit } = useAnimations(contentConfig, contentRefs, undefined, {
      onEnterComplete: () => {
        const content = contentRef.current;
        if (content) {
          content.focus();
          const selected = content.querySelector('[data-selected]') as HTMLElement | null;
          if (selected) {
            selected.focus();
          } else {
            content.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', code: 'ArrowDown', bubbles: true }));
          }
        }
      },
    });

    // Exit animation
    React.useEffect(() => {
      if (!isClosing) return;
      if (!contentConfig) { onCloseComplete?.(); return; }
      runExit().then(() => onCloseComplete?.());
    }, [isClosing]); // eslint-disable-line react-hooks/exhaustive-deps

    const mergedContentRef = useMergedRef<HTMLDivElement>(ref, contentRef);

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
            sideOffset={props.sideOffset as number ?? 4}
            align={props.align as 'start' | 'center' | 'end'}
            className={cx('content', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(layer > 0 ? { zIndex: layer + 1 } : {}), ...(spStyle as React.CSSProperties) }}
            onPointerDownOutside={handlePointerDownOutside}
            onEscapeKeyDown={handleEscapeKeyDown}
            onInteractOutside={handleInteractOutside}
            data-surface="subtle"
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
// Viewport
// ============================================================================

export interface SelectViewportProps extends Record<string, unknown> {
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

export interface SelectItemProps extends Record<string, unknown> {
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

        return (
          <RadixDropdownMenu.Item
            {...attrs}
            {...spRest}
            ref={mergedItemRef}
            disabled={props.disabled as boolean}
            data-selected={isSelected ? '' : undefined}
            onSelect={handleSelect}
            onMouseEnter={() => handlers.Item?.onMouseEnter?.()}
            onMouseLeave={() => handlers.Item?.onMouseLeave?.()}
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

// Static marker so extractItemLabels can identify Select.Item in the React tree
(SelectItem as any).__moveSelectItem = true;

// ============================================================================
// Group
// ============================================================================

export interface SelectGroupProps extends Record<string, unknown> {
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

export interface SelectLabelProps extends Record<string, unknown> {
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

export interface SelectSeparatorProps extends Record<string, unknown> {
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
  Portal: SelectPortal,
  Content: SelectContent,
  Viewport: SelectViewport,
  Item: SelectItem,
  Group: SelectGroup,
  Label: SelectLabel,
  Separator: SelectSeparator,
};
