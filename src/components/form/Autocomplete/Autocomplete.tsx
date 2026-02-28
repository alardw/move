'use client';

import * as React from 'react';
import { Popover as RadixPopover } from 'radix-ui';
import { animate, spring } from 'animejs';
import { withMoveComponent } from '../../../engine';
import { useMergedRef } from '../../../engine/useMergedRef';
import type { SlotPropsMap } from '../../../engine/types';
import { useResolvedIcon } from '../../core/Icon/useResolvedIcon';
import { mergeAnimateConfig, prefersReducedMotion } from '../../../animation/utils';
import { usePopupAnimation } from '../../../animation/hooks';
import type { PopupAnimate } from '../../../animation/types';
import { useAutocomplete } from './useAutocomplete';
import type { UseAutocompleteReturn, RegisteredItem } from './useAutocomplete';
import styles from './Autocomplete.module.css';

const springConfig = { mass: 0.6, stiffness: 400, damping: 20, velocity: 0 };

// ============================================================================
// Context
// ============================================================================

interface AutocompleteContextValue extends UseAutocompleteReturn {
  isClosing: boolean;
  onCloseComplete: () => void;
  animateConfig: PopupAnimate | null;
}

const AutocompleteContext = React.createContext<AutocompleteContextValue | null>(null);

function useAutocompleteContext() {
  const context = React.useContext(AutocompleteContext);
  if (!context) {
    throw new Error('Autocomplete components must be used within Autocomplete.Root');
  }
  return context;
}

// Item-level context so ItemIndicator can read the parent Item's value
const AutocompleteItemContext = React.createContext<{ value: string } | null>(null);

// ============================================================================
// Root
// ============================================================================

export interface AutocompleteRootProps {
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  multiple?: boolean;
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (value: string) => void;
  loading?: boolean;
  animate?: PopupAnimate | false;
  closeOnSelect?: boolean;
  openOnFocus?: boolean;
  allowCustomValue?: boolean;
  filterFn?: (inputValue: string, itemValue: string, itemLabel: string) => boolean;
  children?: React.ReactNode;
}

const defaultAutocompleteAnimation: PopupAnimate = {
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

const AutocompleteRoot: React.FC<AutocompleteRootProps> = ({
  animate: animateProp,
  children,
  ...hookOptions
}) => {
  const animateConfig = animateProp === false ? null : mergeAnimateConfig(defaultAutocompleteAnimation, animateProp);

  const ac = useAutocomplete(hookOptions);

  // Animation closing state — decoupled from open state for exit animation
  const [isClosing, setIsClosing] = React.useState(false);

  // Wrap the close to trigger animation
  const originalClose = ac.close;
  const animatedClose = React.useCallback(() => {
    if (animateConfig) {
      setIsClosing(true);
    } else {
      originalClose();
    }
  }, [animateConfig, originalClose]);

  const onCloseComplete = React.useCallback(() => {
    setIsClosing(false);
    originalClose();
  }, [originalClose]);

  // Keep Radix Popover in sync
  const radixOpen = ac.isOpen || isClosing;

  return (
    <AutocompleteContext.Provider
      value={{
        ...ac,
        close: animatedClose,
        isClosing,
        onCloseComplete,
        animateConfig,
      }}
    >
      <RadixPopover.Root open={radixOpen} onOpenChange={() => { /* Controlled externally */ }}>
        {children}
      </RadixPopover.Root>
    </AutocompleteContext.Provider>
  );
};
AutocompleteRoot.displayName = 'Autocomplete.Root';

// ============================================================================
// Trigger
// ============================================================================

export type AutocompleteTriggerSize = 'sm' | 'md' | 'lg';
export type AutocompleteTriggerVariant = 'outlined' | 'filled';

export interface AutocompleteTriggerProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  disabled?: boolean;
  invalid?: boolean;
  size?: AutocompleteTriggerSize;
  variant?: AutocompleteTriggerVariant;
  width?: React.CSSProperties['width'];
  sp?: SlotPropsMap<'trigger'>;
}

const ACTION_NAMES = new Set(['AutocompleteIcon', 'AutocompleteClearTrigger']);

const AutocompleteTrigger = withMoveComponent<'trigger' | 'triggerContent' | 'triggerActions', AutocompleteTriggerProps, HTMLDivElement>({
  name: 'AutocompleteTrigger',
  styles,
  slots: ['trigger', 'triggerContent', 'triggerActions'] as const,
  defaults: { size: 'md', variant: 'outlined' },
  moveProps: ['invalid', 'disabled', 'width', 'size', 'variant'],

  setup({ props, ref, cx, sp, attrs }) {
    const { inputRef } = useAutocompleteContext();

    const handleClick = () => {
      inputRef.current?.focus();
    };

    return {
      render() {
        const triggerSp = sp('trigger');
        const { className: spClass, style: spStyle, ...spRest } = triggerSp as Record<string, unknown>;

        // Split children into content (tags, input) and actions (clear, icon)
        const contentChildren: React.ReactNode[] = [];
        const actionChildren: React.ReactNode[] = [];
        React.Children.forEach(props.children, (child) => {
          if (React.isValidElement(child) && typeof child.type !== 'string') {
            const displayName = (child.type as any).displayName;
            if (displayName && ACTION_NAMES.has(displayName)) {
              actionChildren.push(child);
              return;
            }
          }
          contentChildren.push(child);
        });

        return (
          <RadixPopover.Anchor asChild>
            <div
              {...attrs}
              {...spRest}
              ref={ref}
              data-size={props.size}
              data-variant={props.variant}
              className={cx('trigger', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(props.width != null ? { width: props.width } : {}), ...(spStyle as React.CSSProperties) }}
              {...(props.disabled ? { 'data-disabled': '' } : {})}
              {...(props.invalid ? { 'data-invalid': '' } : {})}
              onClick={handleClick}
            >
              <div className={cx('triggerContent')}>{contentChildren}</div>
              {actionChildren.length > 0 && (
                <div className={cx('triggerActions')}>{actionChildren}</div>
              )}
            </div>
          </RadixPopover.Anchor>
        );
      },
    };
  },
});

// ============================================================================
// Input
// ============================================================================

export interface AutocompleteInputProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  disabled?: boolean;
  sp?: SlotPropsMap<'input'>;
}

const AutocompleteInput = withMoveComponent<'input', AutocompleteInputProps, HTMLInputElement>({
  name: 'AutocompleteInput',
  styles,
  slots: ['input'] as const,
  moveProps: ['placeholder', 'disabled'],

  setup({ props, ref, cx, sp, attrs }) {
    const ac = useAutocompleteContext();
    const mergedRef = useMergedRef<HTMLInputElement>(ref, ac.inputRef as React.Ref<HTMLInputElement>);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      ac.onInputValueChange(e.target.value);
    };

    const handleFocus = () => {
      if (ac.openOnFocus && !ac.isOpen) {
        ac.open();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const visibleItems = ac.getVisibleItems();
      const visibleCount = visibleItems.length;

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          if (!ac.isOpen) {
            ac.open();
            ac.setHighlightedIndex(0);
          } else {
            // Skip disabled items
            let next = ac.highlightedIndex + 1;
            while (next < visibleCount && visibleItems[next]?.disabled) next++;
            if (next >= visibleCount) next = 0;
            while (next < visibleCount && visibleItems[next]?.disabled) next++;
            ac.setHighlightedIndex(next < visibleCount ? next : ac.highlightedIndex);
          }
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          if (!ac.isOpen) {
            ac.open();
            ac.setHighlightedIndex(visibleCount - 1);
          } else {
            let prev = ac.highlightedIndex - 1;
            while (prev >= 0 && visibleItems[prev]?.disabled) prev--;
            if (prev < 0) prev = visibleCount - 1;
            while (prev >= 0 && visibleItems[prev]?.disabled) prev--;
            ac.setHighlightedIndex(prev >= 0 ? prev : ac.highlightedIndex);
          }
          break;
        }
        case 'Enter': {
          e.preventDefault();
          if (ac.isOpen && ac.highlightedValue) {
            const item = visibleItems[ac.highlightedIndex];
            if (item && !item.disabled) {
              ac.onSelect(ac.highlightedValue);
            }
          }
          break;
        }
        case 'Escape': {
          e.preventDefault();
          if (ac.isOpen) {
            ac.close();
          } else if (ac.inputValue) {
            ac.onInputValueChange('');
          }
          break;
        }
        case 'Tab': {
          if (ac.isOpen) {
            if (ac.highlightedValue) {
              const item = visibleItems[ac.highlightedIndex];
              if (item && !item.disabled) {
                ac.onSelect(ac.highlightedValue);
              }
            }
            ac.close();
          }
          break;
        }
        case 'Backspace': {
          if (ac.multiple && ac.inputValue === '' && ac.selectedValues.length > 0) {
            ac.onDeselect(ac.selectedValues[ac.selectedValues.length - 1]);
          }
          break;
        }
        case 'Home': {
          if (ac.isOpen) {
            e.preventDefault();
            ac.setHighlightedIndex(0);
          }
          break;
        }
        case 'End': {
          if (ac.isOpen) {
            e.preventDefault();
            ac.setHighlightedIndex(visibleCount - 1);
          }
          break;
        }
      }
    };

    return {
      render() {
        const inputSp = sp('input');
        const { className: spClass, style: spStyle, ...spRest } = inputSp as Record<string, unknown>;

        const activeDescendant = ac.highlightedValue
          ? ac.getItemId(ac.highlightedValue)
          : undefined;

        return (
          <input
            {...attrs}
            {...spRest}
            ref={mergedRef}
            role="combobox"
            aria-expanded={ac.isOpen}
            aria-controls={ac.listboxId}
            aria-activedescendant={activeDescendant}
            aria-autocomplete="list"
            aria-haspopup="listbox"
            autoComplete="off"
            value={ac.inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            disabled={props.disabled as boolean}
            placeholder={props.placeholder as string}
            className={cx('input', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          />
        );
      },
    };
  },
});

// ============================================================================
// TagList
// ============================================================================

export interface AutocompleteTagListProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'tagList'>;
}

const AutocompleteTagList = withMoveComponent<'tagList', AutocompleteTagListProps, HTMLDivElement>({
  name: 'AutocompleteTagList',
  styles,
  slots: ['tagList'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const ac = useAutocompleteContext();

    return {
      render() {
        const tagListSp = sp('tagList');
        const { className: spClass, style: spStyle, ...spRest } = tagListSp as Record<string, unknown>;

        if (ac.selectedValues.length === 0) return null;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('tagList', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children ??
              ac.selectedValues.map((val) => (
                <AutocompleteTag key={val} value={val}>
                  {ac.getLabel(val) ?? val}
                </AutocompleteTag>
              ))}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Tag
// ============================================================================

export interface AutocompleteTagProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  value: string;
  /** Accessible label for the remove button. Default: `Remove ${value}` */
  removeLabel?: string;
  sp?: SlotPropsMap<'tag' | 'tagRemove'>;
}

const AutocompleteTag = withMoveComponent<'tag' | 'tagRemove', AutocompleteTagProps, HTMLSpanElement>({
  name: 'AutocompleteTag',
  styles,
  slots: ['tag', 'tagRemove'] as const,
  moveProps: ['value', 'removeLabel'],

  setup({ props, ref, cx, sp, attrs }) {
    const ac = useAutocompleteContext();
    const resolvedX = useResolvedIcon('x', 10);

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      ac.onDeselect(props.value as string);
      ac.inputRef.current?.focus();
    };

    return {
      render() {
        const tagSp = sp('tag');
        const { className: spClass, style: spStyle, ...spRest } = tagSp as Record<string, unknown>;
        const removeSp = sp('tagRemove');
        const { className: removeSpClass, style: removeSpStyle, ...removeSpRest } = removeSp as Record<string, unknown>;

        return (
          <span
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('tag', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {props.children}
            <button
              {...removeSpRest}
              type="button"
              aria-label={(props.removeLabel as string) ?? `Remove ${props.value}`}
              className={cx('tagRemove', removeSpClass as string | undefined)}
              style={removeSpStyle as React.CSSProperties}
              onClick={handleRemove}
              tabIndex={-1}
            >
              {resolvedX}
            </button>
          </span>
        );
      },
    };
  },
});

// ============================================================================
// Icon
// ============================================================================

export interface AutocompleteIconProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'icon'>;
}

const AutocompleteIcon = withMoveComponent<'icon', AutocompleteIconProps, HTMLSpanElement>({
  name: 'AutocompleteIcon',
  styles,
  slots: ['icon'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const resolvedChevron = useResolvedIcon('chevron-down', 16);
    const iconRef = React.useRef<HTMLSpanElement>(null);
    const animRef = React.useRef<ReturnType<typeof animate> | null>(null);
    const mergedRef = useMergedRef<HTMLSpanElement>(ref, iconRef);
    const { isOpen, isClosing, animateConfig } = useAutocompleteContext();

    // Animate chevron open
    React.useEffect(() => {
      const el = iconRef.current;
      if (!el) return;
      if (isOpen && !isClosing) {
        if (animateConfig === null) {
          el.style.transform = 'rotate(180deg)';
        } else {
          if (animRef.current) animRef.current.pause();
          animRef.current = animate(el, {
            rotate: 180,
            ease: 'outQuart',
            duration: prefersReducedMotion() ? 0 : 300,
          });
        }
      }
    }, [isOpen, isClosing, animateConfig]);

    // Animate chevron close
    React.useEffect(() => {
      if (!isClosing && !isOpen) {
        const el = iconRef.current;
        if (!el) return;
        if (animateConfig === null) {
          el.style.transform = 'rotate(0deg)';
        } else {
          if (animRef.current) animRef.current.pause();
          animRef.current = animate(el, {
            rotate: 0,
            ease: 'outQuart',
            duration: prefersReducedMotion() ? 0 : 300,
          });
        }
      }
    }, [isClosing, isOpen, animateConfig]);

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
// ClearTrigger
// ============================================================================

export interface AutocompleteClearTriggerProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Accessible label for the clear button. Default: "Clear all" */
  clearLabel?: string;
  sp?: SlotPropsMap<'clearTrigger'>;
}

const AutocompleteClearTrigger = withMoveComponent<'clearTrigger', AutocompleteClearTriggerProps, HTMLButtonElement>({
  name: 'AutocompleteClearTrigger',
  styles,
  slots: ['clearTrigger'] as const,
  moveProps: ['clearLabel'],

  setup({ props, ref, cx, sp, attrs }) {
    const ac = useAutocompleteContext();
    const resolvedX = useResolvedIcon('x', 14);

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      ac.clearAll();
    };

    return {
      render() {
        if (ac.selectedValues.length === 0 && !ac.inputValue) return null;

        const clearSp = sp('clearTrigger');
        const { className: spClass, style: spStyle, ...spRest } = clearSp as Record<string, unknown>;
        return (
          <button
            {...attrs}
            {...spRest}
            ref={ref}
            type="button"
            aria-label={(props.clearLabel as string) ?? 'Clear all'}
            className={cx('clearTrigger', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            onClick={handleClick}
            tabIndex={-1}
          >
            {props.children ?? resolvedX}
          </button>
        );
      },
    };
  },
});

// ============================================================================
// Portal
// ============================================================================

export interface AutocompletePortalProps {
  children?: React.ReactNode;
  container?: HTMLElement;
}

const AutocompletePortal: React.FC<AutocompletePortalProps> = (props) => (
  <RadixPopover.Portal {...props} />
);
AutocompletePortal.displayName = 'Autocomplete.Portal';

// ============================================================================
// Content
// ============================================================================

export interface AutocompleteContentProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  sp?: SlotPropsMap<'content' | 'contentInner'>;
}

const AutocompleteContent = withMoveComponent<'content' | 'contentInner', AutocompleteContentProps, HTMLDivElement>({
  name: 'AutocompleteContent',
  styles,
  slots: ['content', 'contentInner'] as const,
  moveProps: ['sideOffset', 'align'],

  setup({ props, ref, cx, sp, attrs }) {
    const ac = useAutocompleteContext();

    const { contentRef, innerRef } = usePopupAnimation({
      animate: ac.animateConfig,
      isClosing: ac.isClosing,
      onCloseComplete: ac.onCloseComplete,
      itemSelector: '[role="option"]',
      animateHeight: true,
    });

    const mergedContentRef = useMergedRef<HTMLDivElement>(ref, contentRef);

    // Intercept close events from outside clicks
    const handlePointerDownOutside = (e: Event) => {
      // Don't close if clicking the trigger
      const target = e.target as Node;
      const trigger = (contentRef.current as HTMLElement | null)
        ?.closest('[data-radix-popper-content-wrapper]')
        ?.parentElement
        ?.querySelector('[data-radix-popover-anchor]');
      if (trigger?.contains(target)) {
        e.preventDefault();
        return;
      }
      if (!e.defaultPrevented) ac.close();
    };

    // Prevent auto-focus to content — focus stays on input
    const handleOpenAutoFocus = (e: Event) => {
      e.preventDefault();
    };

    // Prevent auto-focus restore on close — input manages its own focus
    const handleCloseAutoFocus = (e: Event) => {
      e.preventDefault();
    };

    return {
      render() {
        const contentSp = sp('content');
        const { className: spClass, style: spStyle, ...spRest } = contentSp as Record<string, unknown>;
        const innerSp = sp('contentInner');
        const { className: innerSpClass, style: innerSpStyle, ...innerSpRest } = innerSp as Record<string, unknown>;

        return (
          <RadixPopover.Content
            {...attrs}
            {...spRest}
            ref={mergedContentRef}
            sideOffset={props.sideOffset as number ?? 4}
            align={props.align as 'start' | 'center' | 'end' ?? 'start'}
            className={cx('content', props.className, spClass as string | undefined)}
            style={{
              ...props.style,
              ...(spStyle as React.CSSProperties),
              width: 'var(--radix-popover-trigger-width)',
            }}
            onPointerDownOutside={handlePointerDownOutside}
            onOpenAutoFocus={handleOpenAutoFocus}
            onCloseAutoFocus={handleCloseAutoFocus}
          >
            <div
              ref={innerRef}
              {...innerSpRest}
              id={ac.listboxId}
              role="listbox"
              aria-multiselectable={ac.multiple || undefined}
              data-mode={ac.multiple ? 'multi' : 'single'}
              className={cx('contentInner', innerSpClass as string | undefined)}
              style={innerSpStyle as React.CSSProperties}
            >
              {props.children}
            </div>
          </RadixPopover.Content>
        );
      },
    };
  },
});

// ============================================================================
// Item
// ============================================================================

export interface AutocompleteItemProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  value: string;
  label?: string;
  disabled?: boolean;
  sp?: SlotPropsMap<'item'>;
}

const AutocompleteItem = withMoveComponent<'item', AutocompleteItemProps, HTMLDivElement>({
  name: 'AutocompleteItem',
  styles,
  slots: ['item'] as const,
  moveProps: ['value', 'label', 'disabled'],

  setup({ props, ref, cx, sp, attrs }) {
    const ac = useAutocompleteContext();
    const itemRef = React.useRef<HTMLDivElement | null>(null);
    const animRefLocal = React.useRef<ReturnType<typeof animate> | null>(null);
    const mergedItemRef = useMergedRef<HTMLDivElement>(ref, itemRef);
    const resolvedCheck = useResolvedIcon('check', 14);
    const itemValue = props.value as string;
    const isDisabled = props.disabled as boolean;
    const isSelected = ac.isSelected(itemValue);

    // Extract text content for filtering
    const textContent = (props.label as string) ?? extractTextContent(props.children);

    // Register on mount
    React.useEffect(() => {
      ac.registerItem(itemValue, props.children, textContent, !!isDisabled, itemRef);
      return () => ac.unregisterItem(itemValue);
    }, [itemValue, props.children, textContent, isDisabled]); // eslint-disable-line react-hooks/exhaustive-deps

    // Filtering: hide if doesn't match
    const isVisible = ac.filterFn(ac.inputValue, itemValue, textContent);

    // Check if highlighted
    const visibleItems = ac.getVisibleItems();
    const myVisibleIndex = visibleItems.findIndex(v => v.value === itemValue);
    const isHighlighted = myVisibleIndex === ac.highlightedIndex;

    // Scroll into view when highlighted
    React.useEffect(() => {
      if (isHighlighted && itemRef.current) {
        itemRef.current.scrollIntoView({ block: 'nearest' });
      }
    }, [isHighlighted]);

    const handleClick = () => {
      if (isDisabled) return;
      ac.onSelect(itemValue);
      ac.inputRef.current?.focus();
    };

    const handleMouseEnter = () => {
      if (isDisabled) return;
      ac.setHighlightedIndex(myVisibleIndex);
      if (ac.animateConfig === null) return;
      if (!itemRef.current) return;
      if (animRefLocal.current) animRefLocal.current.pause();
      animRefLocal.current = animate(itemRef.current, {
        scale: 1.02,
        ease: spring(springConfig),
      });
    };

    const handleMouseLeave = () => {
      if (ac.animateConfig === null) return;
      if (!itemRef.current) return;
      if (animRefLocal.current) animRefLocal.current.pause();
      animRefLocal.current = animate(itemRef.current, {
        scale: 1,
        ease: spring(springConfig),
      });
    };

    return {
      render() {
        if (!isVisible) return null;

        const itemSp = sp('item');
        const { className: spClass, style: spStyle, ...spRest } = itemSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...spRest}
            ref={mergedItemRef}
            id={ac.getItemId(itemValue)}
            role="option"
            aria-selected={isSelected}
            aria-disabled={isDisabled || undefined}
            data-selected={isSelected ? '' : undefined}
            data-highlighted={isHighlighted ? '' : undefined}
            data-disabled={isDisabled ? '' : undefined}
            className={cx('item', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {ac.multiple && (
              <span
                className={styles.itemIndicator}
                aria-hidden="true"
                style={{ visibility: isSelected ? 'visible' : 'hidden', color: isSelected ? 'var(--move-primary)' : undefined }}
              >
                {resolvedCheck}
              </span>
            )}
            <AutocompleteItemContext.Provider value={{ value: itemValue }}>
              {props.children}
            </AutocompleteItemContext.Provider>
          </div>
        );
      },
    };
  },
});

// ============================================================================
// ItemIndicator
// ============================================================================

export interface AutocompleteItemIndicatorProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'itemIndicator'>;
}

const AutocompleteItemIndicator = withMoveComponent<'itemIndicator', AutocompleteItemIndicatorProps, HTMLSpanElement>({
  name: 'AutocompleteItemIndicator',
  styles,
  slots: ['itemIndicator'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const ac = useAutocompleteContext();
    const itemCtx = React.useContext(AutocompleteItemContext);
    const resolvedCheck = useResolvedIcon('check', 14);
    const isSelected = itemCtx ? ac.isSelected(itemCtx.value) : false;

    return {
      render() {
        const indSp = sp('itemIndicator');
        const { className: spClass, style: spStyle, ...spRest } = indSp as Record<string, unknown>;

        return (
          <span
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('itemIndicator', props.className, spClass as string | undefined)}
            style={{
              ...props.style,
              ...(spStyle as React.CSSProperties),
              visibility: isSelected ? 'visible' : 'hidden',
              color: isSelected ? 'var(--move-primary)' : undefined,
            }}
            aria-hidden="true"
          >
            {props.children ?? resolvedCheck}
          </span>
        );
      },
    };
  },
});

// ============================================================================
// Group
// ============================================================================

export interface AutocompleteGroupProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'group'>;
}

const AutocompleteGroup = withMoveComponent<'group', AutocompleteGroupProps, HTMLDivElement>({
  name: 'AutocompleteGroup',
  styles,
  slots: ['group'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const groupSp = sp('group');
        const { className: spClass, style: spStyle, ...spRest } = groupSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            role="group"
            className={cx('group', props.className, spClass as string | undefined)}
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
// GroupLabel
// ============================================================================

export interface AutocompleteGroupLabelProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'groupLabel'>;
}

const AutocompleteGroupLabel = withMoveComponent<'groupLabel', AutocompleteGroupLabelProps, HTMLDivElement>({
  name: 'AutocompleteGroupLabel',
  styles,
  slots: ['groupLabel'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const labelSp = sp('groupLabel');
        const { className: spClass, style: spStyle, ...spRest } = labelSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('groupLabel', props.className, spClass as string | undefined)}
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
// Empty
// ============================================================================

export interface AutocompleteEmptyProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'empty'>;
}

const AutocompleteEmpty = withMoveComponent<'empty', AutocompleteEmptyProps, HTMLDivElement>({
  name: 'AutocompleteEmpty',
  styles,
  slots: ['empty'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const ac = useAutocompleteContext();

    return {
      render() {
        // Only show when not loading and no items visible
        if (ac.loading) return null;
        const visible = ac.getVisibleItems();
        if (visible.length > 0) return null;

        const emptySp = sp('empty');
        const { className: spClass, style: spStyle, ...spRest } = emptySp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            role="status"
            aria-live="polite"
            className={cx('empty', props.className, spClass as string | undefined)}
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
// Loading
// ============================================================================

export interface AutocompleteLoadingProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'loading'>;
}

const AutocompleteLoading = withMoveComponent<'loading', AutocompleteLoadingProps, HTMLDivElement>({
  name: 'AutocompleteLoading',
  styles,
  slots: ['loading'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const ac = useAutocompleteContext();

    return {
      render() {
        if (!ac.loading) return null;

        const loadingSp = sp('loading');
        const { className: spClass, style: spStyle, ...spRest } = loadingSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            role="status"
            aria-busy="true"
            aria-live="polite"
            className={cx('loading', props.className, spClass as string | undefined)}
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
// Separator
// ============================================================================

export interface AutocompleteSeparatorProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'separator'>;
}

const AutocompleteSeparator = withMoveComponent<'separator', AutocompleteSeparatorProps, HTMLDivElement>({
  name: 'AutocompleteSeparator',
  styles,
  slots: ['separator'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const sepSp = sp('separator');
        const { className: spClass, style: spStyle, ...spRest } = sepSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            role="separator"
            className={cx('separator', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          />
        );
      },
    };
  },
});

// ============================================================================
// Helpers
// ============================================================================

function extractTextContent(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(extractTextContent).join('');
  if (React.isValidElement(children) && children.props) {
    return extractTextContent((children.props as { children?: React.ReactNode }).children);
  }
  return '';
}

// ============================================================================
// Export
// ============================================================================

export const Autocomplete = {
  Root: AutocompleteRoot,
  Trigger: AutocompleteTrigger,
  Input: AutocompleteInput,
  TagList: AutocompleteTagList,
  Tag: AutocompleteTag,
  Icon: AutocompleteIcon,
  ClearTrigger: AutocompleteClearTrigger,
  Portal: AutocompletePortal,
  Content: AutocompleteContent,
  Item: AutocompleteItem,
  ItemIndicator: AutocompleteItemIndicator,
  Group: AutocompleteGroup,
  GroupLabel: AutocompleteGroupLabel,
  Empty: AutocompleteEmpty,
  Loading: AutocompleteLoading,
  Separator: AutocompleteSeparator,
};
