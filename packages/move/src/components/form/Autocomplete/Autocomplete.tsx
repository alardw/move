'use client';
// Generated from Autocomplete.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)

import * as React from 'react';
import { Popover as RadixPopover } from 'radix-ui';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap, CxFn } from '../../../engine';
import { useResolvedIcon } from '../../../infrastructure/Icon';
import { useLayer } from '../../../infrastructure/Layer';
import { useAnimations, resolveAnimationsConfig, extractSteps, staggerItems, quick, poppy } from '../../../animation';
import type { AnimationTrigger, AnimationState } from '../../../animation';
import { useAutocomplete } from './useAutocomplete';
import type { UseAutocompleteReturn } from './useAutocomplete';
import styles from './Autocomplete.module.css';

// =============================================================================
// Animation defaults
// =============================================================================

// Per-item scale deltas (pixel-based). Container (Content) only fades; item
// stagger carries the reveal. See Select for rationale.
const SCALE_INSET_PX = 16;        // per-item fade-in offset
const SCALE_HOVER_PX = 4;         // per-item hover scale (kept small so scaled items don't clip against the Content's overflow:hidden box)

const DEFAULT_AUTOCOMPLETE_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'open',
    sequence: [[
      { target: 'Content', animation: { opacity: { from: 0, to: 1, duration: 150 } } },
      { target: 'ContentInner', children: '[role="option"]', stagger: staggerItems.stagger, animation: { scale: { from: '$scaleFrom', to: 1, ease: poppy }, opacity: { from: 0, to: 1 } } },
      { target: 'Icon', animation: { rotate: { to: 180, ease: 'outQuart', duration: 300 } } },
    ]],
  },
  {
    trigger: 'closed',
    sequence: [[
      { target: 'Content', animation: { opacity: { to: 0, duration: 150 } } },
      { target: 'ContentInner', children: '[role="option"]', stagger: staggerItems.stagger, animation: { scale: { to: '$scaleFrom', ease: 'outQuart', duration: 150 }, opacity: { to: 0, duration: 150 } } },
      { target: 'Icon', animation: { rotate: { to: 0, ease: 'outQuart', duration: 300 } } },
    ]],
  },
  {
    trigger: 'Item.hover',
    sequence: [{ animation: { scale: { to: '$scaleHover', ease: quick } } }],
  },
];


// =============================================================================
// Labels (i18n)
// =============================================================================

export interface AutocompleteLabels {
  /** ClearTrigger accessible label */
  clearAll: string;
  /** Tag remove button accessible label template; `{value}` is replaced with the tag value */
  removeTag: string;
}

const DEFAULT_LABELS: AutocompleteLabels = {
  clearAll: 'Clear all',
  removeTag: 'Remove {value}',
};

// =============================================================================
// Context
// =============================================================================

interface AutocompleteContextValue extends UseAutocompleteReturn {
  isClosing: boolean;
  onCloseComplete: () => void;
  animConfig: AnimationTrigger[] | null;
  triggerWidth: number;
  setTriggerWidth: (w: number) => void;
  labels: AutocompleteLabels;
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

// =============================================================================
// Root
// =============================================================================

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
  animations?: AnimationTrigger[] | false;
  closeOnSelect?: boolean;
  openOnFocus?: boolean;
  allowCustomValue?: boolean;
  filterFn?: (inputValue: string, itemValue: string, itemLabel: string) => boolean;
  labels?: Partial<AutocompleteLabels>;
  children?: React.ReactNode;
}

const AutocompleteRoot: React.FC<AutocompleteRootProps> = ({
  animations: animationsProp,
  labels: labelsProp,
  children,
  ...hookOptions
}) => {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const animConfig = resolveAnimationsConfig(DEFAULT_AUTOCOMPLETE_ANIMATIONS, animationsProp);

  const ac = useAutocomplete(hookOptions);

  // Items mount lazily inside Radix Popover.Content (unmounted while closed),
  // so on initial render the label cache is empty and tags fall back to raw
  // values. Walk the JSX tree once per render to seed labels — runs before
  // descendants render, so TagList sees the cache populated on first paint.
  walkChildrenForLabels(children, ac.primeLabelCache);

  // Animation closing state — decoupled from open state for exit animation
  const [isClosing, setIsClosing] = React.useState(false);
  const [triggerWidth, setTriggerWidth] = React.useState(200);

  // Wrap the close to trigger animation
  const originalClose = ac.close;
  const animatedClose = React.useCallback(() => {
    if (animConfig) {
      setIsClosing(true);
    } else {
      originalClose();
    }
  }, [animConfig, originalClose]);

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
        animConfig,
        triggerWidth,
        setTriggerWidth,
        labels,
      }}
    >
      <RadixPopover.Root open={radixOpen} onOpenChange={() => { /* Controlled externally */ }}>
        {children}
      </RadixPopover.Root>
    </AutocompleteContext.Provider>
  );
};
AutocompleteRoot.displayName = 'Autocomplete.Root';

// =============================================================================
// Trigger
// =============================================================================

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
  defaults: { size: 'md' as AutocompleteTriggerSize, variant: 'outlined' as AutocompleteTriggerVariant },
  moveProps: ['invalid', 'disabled', 'width', 'size', 'variant'],

  setup({ props, ref, cx, sp, attrs }) {
    const ac = useAutocompleteContext();
    const { inputRef, isOpen, isClosing, setTriggerWidth } = ac;
    const moveState = isOpen && !isClosing ? 'open' : 'closed';
    const triggerRef = React.useRef<HTMLDivElement>(null);
    const mergedTriggerRef = useMergedRef<HTMLDivElement>(ref, triggerRef);

    React.useEffect(() => {
      const el = triggerRef.current;
      if (!el) return;
      setTriggerWidth(el.offsetWidth);
      const ro = new ResizeObserver(() => setTriggerWidth(el.offsetWidth));
      ro.observe(el);
      return () => ro.disconnect();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleClick = (e: React.MouseEvent) => {
      // Ignore clicks originating in the input itself — typing should keep
      // the user's filter active and not flip into browse-all mode.
      if (!(e.target instanceof HTMLInputElement)) {
        ac.setBypassFilter(true);
        if (!ac.isOpen) ac.open();
      }
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
              ref={mergedTriggerRef}
              data-size={props.size}
              data-variant={props.variant}
              data-move-state={moveState}
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

// =============================================================================
// Input
// =============================================================================

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

// =============================================================================
// TagList
// =============================================================================

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

        if (!ac.multiple || ac.selectedValues.length === 0) return null;

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

// =============================================================================
// Tag
// =============================================================================

export interface AutocompleteTagProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  value: string;
  sp?: SlotPropsMap<'tag' | 'tagRemove'>;
}

const AutocompleteTag = withMoveComponent<'tag' | 'tagRemove', AutocompleteTagProps, HTMLSpanElement>({
  name: 'AutocompleteTag',
  styles,
  slots: ['tag', 'tagRemove'] as const,
  moveProps: ['value'],

  setup({ props, ref, cx, sp, attrs }) {
    const ac = useAutocompleteContext();
    const resolvedX = useResolvedIcon('x', 16);

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
        const titleText = typeof props.children === 'string' ? props.children : (props.value as string);

        return (
          <span
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('tag', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            <span className={styles.tagText} title={titleText}>{props.children}</span>
            <button
              {...removeSpRest}
              type="button"
              aria-label={ac.labels.removeTag.replace('{value}', props.value as string)}
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

// =============================================================================
// Icon
// =============================================================================

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
    const mergedRef = useMergedRef<HTMLSpanElement>(ref, iconRef);
    const { animConfig } = useAutocompleteContext();

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

// =============================================================================
// ClearTrigger
// =============================================================================

export interface AutocompleteClearTriggerProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'clearTrigger'>;
}

const AutocompleteClearTrigger = withMoveComponent<'clearTrigger', AutocompleteClearTriggerProps, HTMLButtonElement>({
  name: 'AutocompleteClearTrigger',
  styles,
  slots: ['clearTrigger'] as const,

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
            aria-label={ac.labels.clearAll}
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

// =============================================================================
// Content (auto-portals to document.body)
// =============================================================================

export interface AutocompleteContentProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  container?: HTMLElement;
  width?: React.CSSProperties['width'];
  minWidth?: React.CSSProperties['minWidth'];
  maxWidth?: React.CSSProperties['maxWidth'];
  sp?: SlotPropsMap<'content' | 'contentInner'>;
}

interface AutocompleteContentInnerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  width?: React.CSSProperties['width'];
  minWidth?: React.CSSProperties['minWidth'];
  maxWidth?: React.CSSProperties['maxWidth'];
  contentCx: CxFn<'content' | 'contentInner'>;
  innerCx: CxFn<'content' | 'contentInner'>;
  contentSp: Record<string, unknown>;
  innerSp: Record<string, unknown>;
  layer: number;
  attrs: Record<string, unknown>;
}

const AutocompleteContentInner = React.forwardRef<HTMLDivElement, AutocompleteContentInnerProps>(
  function AutocompleteContentInner(props, ref) {
    const ac = useAutocompleteContext();

    const contentRef = React.useRef<HTMLDivElement>(null);
    const innerRef = React.useRef<HTMLDivElement>(null);
    const mergedContentRef = useMergedRef<HTMLDivElement>(ref, contentRef);

    const scaleFrom = (ac.triggerWidth - SCALE_INSET_PX) / ac.triggerWidth;

    const contentConfig: AnimationTrigger[] | null = React.useMemo(() => {
      if (!ac.animConfig) return null;
      const openSteps = extractSteps(ac.animConfig.find(t => t.trigger === 'open'), ['Content', 'ContentInner']);
      const closedSteps = extractSteps(ac.animConfig.find(t => t.trigger === 'closed'), ['Content', 'ContentInner']);
      const result: AnimationTrigger[] = [];
      if (openSteps) result.push({ trigger: 'Content.enter', sequence: openSteps, vars: { scaleFrom } });
      if (closedSteps) result.push({ trigger: 'Content.exit', sequence: closedSteps, vars: { scaleFrom } });
      return result.length > 0 ? result : null;
    }, [ac.animConfig, scaleFrom]);

    const contentRefs = React.useMemo(() => ({
      Content: contentRef as React.RefObject<HTMLElement | null>,
      ContentInner: innerRef as React.RefObject<HTMLElement | null>,
    }), []);

    const { runExit } = useAnimations(contentConfig, contentRefs);

    React.useEffect(() => {
      if (!ac.isClosing) return;
      if (!contentConfig) { ac.onCloseComplete?.(); return; }
      runExit().then(() => ac.onCloseComplete?.());
    }, [ac.isClosing]); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePointerDownOutside = (e: Event) => {
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

    const handleOpenAutoFocus = (e: Event) => { e.preventDefault(); };
    const handleCloseAutoFocus = (e: Event) => { e.preventDefault(); };

    const { className: spClass, style: spStyle, ...spRest } = props.contentSp;
    const { className: innerSpClass, style: innerSpStyle, ...innerSpRest } = props.innerSp;

    return (
      <RadixPopover.Content
        {...props.attrs}
        {...spRest}
        ref={mergedContentRef}
        sideOffset={props.sideOffset ?? 4}
        align={props.align ?? 'start'}
        className={props.contentCx('content', props.className, spClass as string | undefined)}
        style={{
          ...props.style,
          ...(props.layer > 0 ? { zIndex: props.layer + 1 } : {}),
          ...(spStyle as React.CSSProperties),
          // Default to matching trigger width; props override per-instance.
          width: (props.width as React.CSSProperties['width'] | undefined) ?? 'var(--radix-popover-trigger-width)',
          ...(props.minWidth != null ? { minWidth: props.minWidth } : {}),
          ...(props.maxWidth != null ? { maxWidth: props.maxWidth } : {}),
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
          className={props.innerCx('contentInner', innerSpClass as string | undefined)}
          style={innerSpStyle as React.CSSProperties}
        >
          {props.children}
        </div>
      </RadixPopover.Content>
    );
  },
);

const AutocompleteContent = withMoveComponent<'content' | 'contentInner', AutocompleteContentProps, HTMLDivElement>({
  name: 'AutocompleteContent',
  styles,
  slots: ['content', 'contentInner'] as const,
  moveProps: ['sideOffset', 'align', 'container', 'width', 'minWidth', 'maxWidth'],

  setup({ props, ref, cx, sp, attrs }) {
    const layer = useLayer();

    return {
      render() {
        return (
          <RadixPopover.Portal container={props.container as HTMLElement | undefined}>
            <AutocompleteContentInner
              ref={ref}
              className={props.className}
              style={props.style}
              sideOffset={props.sideOffset as number | undefined}
              align={props.align as 'start' | 'center' | 'end' | undefined}
              width={props.width as React.CSSProperties['width'] | undefined}
              minWidth={props.minWidth as React.CSSProperties['minWidth'] | undefined}
              maxWidth={props.maxWidth as React.CSSProperties['maxWidth'] | undefined}
              contentCx={cx}
              innerCx={cx}
              contentSp={sp('content') as Record<string, unknown>}
              innerSp={sp('contentInner') as Record<string, unknown>}
              layer={layer}
              attrs={attrs}
            >
              {props.children}
            </AutocompleteContentInner>
          </RadixPopover.Portal>
        );
      },
    };
  },
});

// =============================================================================
// Item
// =============================================================================

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

    // Filtering: hide if doesn't match (bypass while the user opened via
    // the trigger to "browse all" — cleared as soon as they type).
    const isVisible = ac.bypassFilter || ac.filterFn(ac.inputValue, itemValue, textContent);

    // Check if highlighted
    const visibleItems = ac.getVisibleItems();
    const myVisibleIndex = visibleItems.findIndex(v => v.value === itemValue);
    const isHighlighted = myVisibleIndex === ac.highlightedIndex;

    // Scroll into view when highlighted
    React.useEffect(() => {
      if (isHighlighted && itemRef.current && typeof itemRef.current.scrollIntoView === 'function') {
        itemRef.current.scrollIntoView({ block: 'nearest' });
      }
    }, [isHighlighted]);

    // Item hover animation via useAnimations
    const scaleHover = (ac.triggerWidth + SCALE_HOVER_PX) / ac.triggerWidth;
    const itemConfig = React.useMemo(() => {
      if (!ac.animConfig) return null;
      const hover = ac.animConfig.find((t) => t.trigger === 'Item.hover');
      return hover ? [{ ...hover, trigger: 'Item.hover', vars: { scaleHover } }] : null;
    }, [ac.animConfig, scaleHover]);

    const itemRefs = React.useMemo(() => ({
      Item: itemRef as React.RefObject<HTMLElement | null>,
    }), []);

    const { handlers } = useAnimations(itemConfig, itemRefs);

    const handleClick = () => {
      if (isDisabled) return;
      ac.onSelect(itemValue);
      ac.inputRef.current?.focus();
    };

    const handleMouseEnter = () => {
      if (isDisabled) return;
      ac.setHighlightedIndex(myVisibleIndex);
      handlers.Item?.onMouseEnter?.();
    };

    const handleMouseLeave = () => {
      handlers.Item?.onMouseLeave?.();
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
              <span
                className={styles.itemText}
                title={
                  typeof props.children === 'string'
                    ? props.children
                    : typeof props.label === 'string'
                      ? (props.label as string)
                      : undefined
                }
              >
                {props.children}
              </span>
            </AutocompleteItemContext.Provider>
          </div>
        );
      },
    };
  },
});

// =============================================================================
// ItemIndicator
// =============================================================================

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

// =============================================================================
// Group
// =============================================================================

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

// =============================================================================
// GroupLabel
// =============================================================================

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

// =============================================================================
// Empty
// =============================================================================

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

// =============================================================================
// Loading
// =============================================================================

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

// =============================================================================
// Separator
// =============================================================================

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

// =============================================================================
// Helpers
// =============================================================================

function extractTextContent(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(extractTextContent).join('');
  if (React.isValidElement(children) && children.props) {
    return extractTextContent((children.props as { children?: React.ReactNode }).children);
  }
  return '';
}

function walkChildrenForLabels(
  node: React.ReactNode,
  prime: (value: string, label: React.ReactNode) => void,
): void {
  React.Children.forEach(node, (child) => {
    if (!React.isValidElement(child)) return;
    const displayName = (child.type as { displayName?: string }).displayName;
    const props = child.props as { value?: unknown; children?: React.ReactNode };
    if (displayName === 'AutocompleteItem' && typeof props.value === 'string') {
      prime(props.value, props.children);
    }
    if (props.children) walkChildrenForLabels(props.children, prime);
  });
}

// =============================================================================
// Export
// =============================================================================

export const Autocomplete = {
  Root: AutocompleteRoot,
  Trigger: AutocompleteTrigger,
  Input: AutocompleteInput,
  TagList: AutocompleteTagList,
  Tag: AutocompleteTag,
  Icon: AutocompleteIcon,
  ClearTrigger: AutocompleteClearTrigger,
  Content: AutocompleteContent,
  Item: AutocompleteItem,
  ItemIndicator: AutocompleteItemIndicator,
  Group: AutocompleteGroup,
  GroupLabel: AutocompleteGroupLabel,
  Empty: AutocompleteEmpty,
  Loading: AutocompleteLoading,
  Separator: AutocompleteSeparator,
};
