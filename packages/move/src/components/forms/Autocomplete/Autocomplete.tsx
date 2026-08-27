'use client';
// Generated from Autocomplete.spec.ts

import * as React from 'react';
import type { Dimension, FieldWidth, PopoverWidth } from '../../../shared/types';
import { Popover as RadixPopover } from 'radix-ui';
import { withMoveComponent, useMergedRef, elementTypeName } from '../../../engine';
import type { SlotPropsMap, CxFn } from '../../../engine';
import { useIcon } from '../../../infrastructure/Icon';
import { useLayer } from '../../../infrastructure/Layer';
import {
  useAnimations,
  resolveAnimationsConfig,
  extractSteps,
  staggerItems,
  quick,
  poppy,
  scaleIn,
  scaleOut,
  fadeIn,
  fadeOut,
  useDismissable,
  useDismissableExit,
} from '../../../animation';
import type { AnimationTrigger, AnimationState } from '../../../animation';
import { useFieldControl } from '../FormField/FormField';
import { useAutocomplete } from './useAutocomplete';
import type { RegisteredItem, UseAutocompleteReturn } from './useAutocomplete';
import type { AsyncResource } from '../../../adapters';
import styles from './Autocomplete.module.css';

// =============================================================================
// Animation defaults
// =============================================================================

// Per-item scale deltas (pixel-based). Container (Content) only fades; item
// stagger carries the reveal. See Select for rationale.
const SCALE_INSET_PX = 16; // per-item fade-in offset
const SCALE_HOVER_PX = 4; // per-item hover scale (kept small so scaled items don't clip against the Content's overflow:hidden box)

const DEFAULT_AUTOCOMPLETE_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'open',
    sequence: [
      [
        { target: 'Content', animation: { opacity: { from: 0, to: 1, duration: 150 } } },
        {
          target: 'ContentInner',
          children: '[role="option"]',
          stagger: staggerItems.stagger,
          animation: {
            scale: { from: '$scaleFrom', to: 1, ease: poppy },
            opacity: { from: 0, to: 1 },
          },
        },
        { target: 'Icon', animation: { rotate: { to: 180, ease: 'outQuart', duration: 300 } } },
      ],
    ],
  },
  {
    trigger: 'closed',
    sequence: [
      [
        { target: 'Content', animation: { opacity: { to: 0, duration: 150 } } },
        { target: 'Icon', animation: { rotate: { to: 0, ease: 'outQuart', duration: 300 } } },
      ],
    ],
  },
  {
    trigger: 'Item.hover',
    sequence: [{ animation: { scale: { to: '$scaleHover', ease: quick } } }],
  },
  // The multi-select check pops in and out of its box exactly as Checkbox's
  // does. Deps-driven rather than state-driven: `data-selected` is a presence
  // attribute (empty string / absent), and a state watcher can only match a
  // value, so it could see the select but never the deselect.
  {
    trigger: 'itemSelected',
    sequence: [{ target: 'ItemIndicator', animation: { ...scaleIn(0.5), ...fadeIn() } }],
  },
  {
    trigger: 'itemDeselected',
    sequence: [{ target: 'ItemIndicator', animation: { ...scaleOut(0.5), ...fadeOut() } }],
  },
];

/**
 * Builds the pair of deps triggers that toggle an item's check glyph. Both
 * carry the same dep, so both stay in step with the current selection; the one
 * pointing the wrong way is neutralised with `sequence: false` so it updates
 * its bookkeeping without animating. Shared by the built-in indicator inside
 * Item and the standalone ItemIndicator sub-component.
 */
function indicatorTriggers(
  animConfig: AnimationTrigger[] | null,
  isSelected: boolean,
): AnimationTrigger[] {
  if (!animConfig) return [];
  const out: AnimationTrigger[] = [];
  for (const [name, runsWhenSelected] of [
    ['itemSelected', true],
    ['itemDeselected', false],
  ] as const) {
    const found = animConfig.find((tr) => tr.trigger === name);
    if (!found) continue;
    out.push({
      ...found,
      deps: [isSelected],
      sequence: isSelected === runsWhenSelected ? found.sequence : false,
    });
  }
  return out;
}

// =============================================================================
// Labels (i18n)
// =============================================================================

export interface AutocompleteLabels {
  /** ClearTrigger accessible label */
  clearAll: string;
  /** Tag remove button accessible label template; `{value}` is replaced with the tag value */
  removeTag: string;
  /** RetryTrigger default text, shown when no children are given (also its accessible name) */
  retry: string;
}

const DEFAULT_LABELS: AutocompleteLabels = {
  clearAll: 'Clear all',
  removeTag: 'Remove {value}',
  retry: 'Retry',
};

// =============================================================================
// Context
// =============================================================================

interface AutocompleteContextValue extends UseAutocompleteReturn {
  isClosing: boolean;
  epoch: number;
  onExitDone: (epoch: number) => void;
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
  /** Async data source for the options list. When set, drives loading/error
   *  state (superseding `loading`) and feeds RetryTrigger via `retry`. The data
   *  payload is not consumed — options are still rendered as Item children. */
  resource?: AsyncResource<unknown>;
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

  // Ref so the hook can request the ANIMATED close on select. dismissable is
  // created below (it depends on ac.isOpen); the ref is populated right after.
  const closeRef = React.useRef<() => void>(() => {});
  const ac = useAutocomplete({ ...hookOptions, requestClose: () => closeRef.current() });

  // Items mount lazily inside Radix Popover.Content (unmounted while closed),
  // so on initial render the label cache is empty and tags fall back to raw
  // values. Walk the JSX tree once per render to seed labels — runs before
  // descendants render, so TagList sees the cache populated on first paint.
  walkChildrenForLabels(children, ac.primeLabelCache);

  const [triggerWidth, setTriggerWidth] = React.useState(200);

  // Interruptible open/close lifecycle (exit-completion is epoch-guarded). The
  // hook owns the open boolean, so dismissable runs in controlled mode and the
  // confirmed close is delegated back to the hook via onClosed. See useDismissable.
  const dismissable = useDismissable({ open: ac.isOpen, onClosed: ac.close });
  const { isClosing, epoch, onExitDone, close } = dismissable;
  closeRef.current = close;

  // Keep Radix Popover in sync
  const radixOpen = ac.isOpen || isClosing;

  return (
    <AutocompleteContext.Provider
      value={{
        ...ac,
        close,
        isClosing,
        epoch,
        onExitDone,
        animConfig,
        triggerWidth,
        setTriggerWidth,
        labels,
      }}
    >
      <RadixPopover.Root
        open={radixOpen}
        onOpenChange={() => {
          /* Controlled externally */
        }}
      >
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

export interface AutocompleteTriggerProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  disabled?: boolean;
  invalid?: boolean;
  size?: AutocompleteTriggerSize;
  variant?: AutocompleteTriggerVariant;
  width?: FieldWidth;
  sp?: SlotPropsMap<'trigger'>;
}

const ACTION_NAMES = new Set(['AutocompleteIcon', 'AutocompleteClearTrigger']);

/**
 * The next index in `step` direction that is not disabled, wrapping past either
 * end. Returns `from` unchanged when nothing else can take the highlight, so a
 * list of disabled options leaves it where it is instead of moving onto one
 * that cannot be chosen.
 */
function nextEnabledIndex(items: readonly RegisteredItem[], from: number, step: 1 | -1): number {
  const count = items.length;
  if (count === 0) return from;
  let at = from;
  for (let i = 0; i < count; i++) {
    at = (at + step + count) % count;
    if (!items[at]?.disabled) return at;
  }
  return from;
}

/**
 * The highlighted value when there is one and it can actually be chosen, else
 * null. Enter and Tab both commit the highlight and must agree on what counts.
 */
function selectableHighlight(
  ac: { isOpen: boolean; highlightedValue: string | null; highlightedIndex: number },
  items: readonly RegisteredItem[],
): string | null {
  if (!ac.isOpen || !ac.highlightedValue) return null;
  const item = items[ac.highlightedIndex];
  return item && !item.disabled ? ac.highlightedValue : null;
}

const AutocompleteTrigger = withMoveComponent<
  'trigger' | 'triggerContent' | 'triggerActions',
  AutocompleteTriggerProps,
  HTMLDivElement
>({
  name: 'AutocompleteTrigger',
  styles,
  slots: ['trigger', 'triggerContent', 'triggerActions'] as const,
  defaults: {
    size: 'md' as AutocompleteTriggerSize,
    variant: 'outlined' as AutocompleteTriggerVariant,
  },
  moveProps: ['invalid', 'disabled', 'width', 'size', 'variant'],

  setup({ props, ref, cx, sp, slot, attrs }) {
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
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = triggerSp as Record<string, unknown>;

        // Split children into content (tags, input) and actions (clear, icon)
        const contentChildren: React.ReactNode[] = [];
        const actionChildren: React.ReactNode[] = [];
        React.Children.forEach(props.children, (child) => {
          const displayName = elementTypeName(child);
          if (displayName && ACTION_NAMES.has(displayName)) {
            actionChildren.push(child);
            return;
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
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
              data-width={props.width as string | undefined}
              {...(props.disabled ? { 'data-disabled': '' } : {})}
              {...(props.invalid ? { 'data-invalid': '' } : {})}
              onClick={handleClick}
            >
              <div {...slot('triggerContent')}>{contentChildren}</div>
              {actionChildren.length > 0 && <div {...slot('triggerActions')}>{actionChildren}</div>}
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

export interface AutocompleteInputProps extends React.HTMLAttributes<HTMLElement> {
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
    const mergedRef = useMergedRef<HTMLInputElement>(
      ref,
      ac.inputRef as React.Ref<HTMLInputElement>,
    );

    // The combobox <input> is this component's labellable node — the one a
    // wrapping FormField.Label must point its `for` at. Nothing else in the
    // tree can be named: Trigger and Root are divs, and the listbox is a
    // separate element with its own id. Marking it here is what lets FormField
    // name the field; without it the label's `for` resolved to nothing.
    const controlProps = useFieldControl(attrs as Record<string, unknown>, {
      ref: ac.inputRef as React.RefObject<HTMLElement | null>,
    });

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
      const move = (step: 1 | -1, openAt: number) => {
        e.preventDefault();
        if (ac.isOpen) {
          ac.setHighlightedIndex(nextEnabledIndex(visibleItems, ac.highlightedIndex, step));
          return;
        }
        ac.open();
        ac.setHighlightedIndex(openAt);
      };
      const chooseHighlighted = () => {
        const value = selectableHighlight(ac, visibleItems);
        if (value !== null) ac.onSelect(value);
      };

      switch (e.key) {
        case 'ArrowDown':
          move(1, 0);
          break;
        case 'ArrowUp':
          move(-1, visibleCount - 1);
          break;
        case 'Enter':
          e.preventDefault();
          chooseHighlighted();
          break;
        case 'Escape':
          e.preventDefault();
          if (ac.isOpen) ac.close();
          else if (ac.inputValue) ac.onInputValueChange('');
          break;
        case 'Tab':
          if (ac.isOpen) {
            chooseHighlighted();
            ac.close();
          }
          break;
        case 'Backspace':
          if (ac.multiple && ac.inputValue === '' && ac.selectedValues.length > 0) {
            ac.onDeselect(ac.selectedValues[ac.selectedValues.length - 1]);
          }
          break;
        case 'Home':
          if (ac.isOpen) {
            e.preventDefault();
            ac.setHighlightedIndex(0);
          }
          break;
        case 'End':
          if (ac.isOpen) {
            e.preventDefault();
            ac.setHighlightedIndex(visibleCount - 1);
          }
          break;
      }
    };

    return {
      render() {
        const inputSp = sp('input');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = inputSp as Record<string, unknown>;

        const activeDescendant = ac.highlightedValue
          ? ac.getItemId(ac.highlightedValue)
          : undefined;

        return (
          <input
            {...controlProps}
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

export interface AutocompleteTagListProps extends React.HTMLAttributes<HTMLElement> {
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
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = tagListSp as Record<string, unknown>;

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

export interface AutocompleteTagProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  value: string;
  sp?: SlotPropsMap<'tag' | 'tagRemove'>;
}

const AutocompleteTag = withMoveComponent<
  'tag' | 'tagRemove',
  AutocompleteTagProps,
  HTMLSpanElement
>({
  name: 'AutocompleteTag',
  styles,
  slots: ['tag', 'tagRemove'] as const,
  moveProps: ['value'],

  setup({ props, ref, cx, sp, attrs }) {
    const ac = useAutocompleteContext();
    const resolvedX = useIcon('clear', 16);

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
        const {
          className: removeSpClass,
          style: removeSpStyle,
          ...removeSpRest
        } = removeSp as Record<string, unknown>;
        const titleText =
          typeof props.children === 'string' ? props.children : (props.value as string);

        return (
          <span
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('tag', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            <span className={styles.tagText} title={titleText}>
              {props.children}
            </span>
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

export interface AutocompleteIconProps extends React.HTMLAttributes<HTMLElement> {
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
    const resolvedChevron = useIcon('expand', 16);
    const iconRef = React.useRef<HTMLSpanElement>(null);
    const mergedRef = useMergedRef<HTMLSpanElement>(ref, iconRef);
    const { animConfig } = useAutocompleteContext();

    // Icon rotation — extract Icon steps from open/closed triggers, run via state triggers
    // Trigger always sets data-move-state="open"|"closed" reflecting true state (incl. during exit)
    const iconStates: AnimationState[] = React.useMemo(
      () => [
        {
          name: 'open',
          slot: 'Icon',
          source: 'data-move-state',
          value: 'open',
          closest: '[data-move-state]',
          initial: false,
        },
        {
          name: 'closed',
          slot: 'Icon',
          source: 'data-move-state',
          value: 'closed',
          closest: '[data-move-state]',
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
      () => ({
        Icon: iconRef as React.RefObject<HTMLElement | null>,
      }),
      [],
    );

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

export interface AutocompleteClearTriggerProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'clearTrigger'>;
}

const AutocompleteClearTrigger = withMoveComponent<
  'clearTrigger',
  AutocompleteClearTriggerProps,
  HTMLButtonElement
>({
  name: 'AutocompleteClearTrigger',
  styles,
  slots: ['clearTrigger'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const ac = useAutocompleteContext();
    const resolvedX = useIcon('clear', 14);

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      ac.clearAll();
    };

    return {
      render() {
        if (ac.selectedValues.length === 0 && !ac.inputValue) return null;

        const clearSp = sp('clearTrigger');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = clearSp as Record<string, unknown>;
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

export interface AutocompleteContentProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  container?: HTMLElement;
  width?: PopoverWidth;
  minWidth?: Dimension;
  maxWidth?: Dimension;
  sp?: SlotPropsMap<'content' | 'contentInner'>;
}

interface AutocompleteContentInnerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  width?: PopoverWidth;
  minWidth?: Dimension;
  maxWidth?: Dimension;
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
      const openSteps = extractSteps(
        ac.animConfig.find((t) => t.trigger === 'open'),
        ['Content', 'ContentInner'],
      );
      const closedSteps = extractSteps(
        ac.animConfig.find((t) => t.trigger === 'closed'),
        ['Content', 'ContentInner'],
      );
      const result: AnimationTrigger[] = [];
      if (openSteps)
        result.push({ trigger: 'Content.enter', sequence: openSteps, vars: { scaleFrom } });
      if (closedSteps)
        result.push({ trigger: 'Content.exit', sequence: closedSteps, vars: { scaleFrom } });
      return result.length > 0 ? result : null;
    }, [ac.animConfig, scaleFrom]);

    const contentRefs = React.useMemo(
      () => ({
        Content: contentRef as React.RefObject<HTMLElement | null>,
        ContentInner: innerRef as React.RefObject<HTMLElement | null>,
      }),
      [],
    );

    const { runExit, runEnter, pauseAll } = useAnimations(contentConfig, contentRefs);

    useDismissableExit({
      isClosing: ac.isClosing,
      epoch: ac.epoch,
      onExitDone: ac.onExitDone,
      runExit,
      runEnter,
      pauseAll,
    });

    const handlePointerDownOutside = (e: Event) => {
      const target = e.target as Node;
      const trigger = (contentRef.current as HTMLElement | null)
        ?.closest('[data-radix-popper-content-wrapper]')
        ?.parentElement?.querySelector('[data-radix-popover-anchor]');
      if (trigger?.contains(target)) {
        e.preventDefault();
        return;
      }
      if (!e.defaultPrevented) ac.close();
    };

    const handleOpenAutoFocus = (e: Event) => {
      e.preventDefault();
    };
    const handleCloseAutoFocus = (e: Event) => {
      e.preventDefault();
    };

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
          ...(props.minWidth != null ? { minWidth: props.minWidth } : {}),
          ...(props.maxWidth != null ? { maxWidth: props.maxWidth } : {}),
        }}
        data-width={(props.width as string | undefined) ?? 'anchor'}
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

const AutocompleteContent = withMoveComponent<
  'content' | 'contentInner',
  AutocompleteContentProps,
  HTMLDivElement
>({
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
              width={props.width as PopoverWidth | undefined}
              minWidth={props.minWidth as Dimension | undefined}
              maxWidth={props.maxWidth as Dimension | undefined}
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

export interface AutocompleteItemProps extends React.HTMLAttributes<HTMLElement> {
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
    const resolvedCheck = useIcon('selected', 14);
    const indicatorGlyphRef = React.useRef<HTMLSpanElement | null>(null);
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

    // Check if highlighted. The index guard matters: an Item registers itself in
    // a mount effect, so on the first render after opening it is not in the
    // registry yet and findIndex returns -1 — which would match a -1 highlight
    // (the "nothing highlighted" state) and mark every item highlighted at once.
    const visibleItems = ac.getVisibleItems();
    const myVisibleIndex = visibleItems.findIndex((v) => v.value === itemValue);
    const isHighlighted = myVisibleIndex >= 0 && myVisibleIndex === ac.highlightedIndex;

    // Scroll into view when highlighted by the keyboard. Pointer highlights are
    // skipped — the item is under the cursor, already visible.
    React.useEffect(() => {
      if (!isHighlighted || ac.isPointerHighlight()) return;
      const el = itemRef.current;
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ block: 'nearest' });
      }
    }, [isHighlighted]); // eslint-disable-line react-hooks/exhaustive-deps

    // Item hover animation via useAnimations
    const scaleHover = (ac.triggerWidth + SCALE_HOVER_PX) / ac.triggerWidth;
    const itemConfig = React.useMemo(() => {
      if (!ac.animConfig) return null;
      const hover = ac.animConfig.find((t) => t.trigger === 'Item.hover');
      const triggers: AnimationTrigger[] = hover
        ? [{ ...hover, trigger: 'Item.hover', vars: { scaleHover } }]
        : [];
      if (ac.multiple) triggers.push(...indicatorTriggers(ac.animConfig, isSelected));
      return triggers.length > 0 ? triggers : null;
    }, [ac.animConfig, ac.multiple, scaleHover, isSelected]);

    const itemRefs = React.useMemo(
      () => ({
        Item: itemRef as React.RefObject<HTMLElement | null>,
        ItemIndicator: indicatorGlyphRef as React.RefObject<HTMLElement | null>,
      }),
      [],
    );

    const { handlers } = useAnimations(itemConfig, itemRefs);

    const handleClick = () => {
      if (isDisabled) return;
      ac.onSelect(itemValue);
      ac.inputRef.current?.focus();
    };

    const handleMouseEnter = () => {
      if (isDisabled) return;
      ac.setHighlightedIndex(myVisibleIndex, 'pointer');
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
              <span className={styles.itemIndicator} aria-hidden="true">
                <span ref={indicatorGlyphRef} className={styles.itemIndicatorGlyph}>
                  {resolvedCheck}
                </span>
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

export interface AutocompleteItemIndicatorProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'itemIndicator'>;
}

const AutocompleteItemIndicator = withMoveComponent<
  'itemIndicator',
  AutocompleteItemIndicatorProps,
  HTMLSpanElement
>({
  name: 'AutocompleteItemIndicator',
  styles,
  slots: ['itemIndicator'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const ac = useAutocompleteContext();
    const itemCtx = React.useContext(AutocompleteItemContext);
    const resolvedCheck = useIcon('selected', 14);
    const glyphRef = React.useRef<HTMLSpanElement | null>(null);

    // Selection drives the pop-in/out only; the resting look is CSS off the
    // row's `data-selected`, so a hand-composed indicator matches the built-in
    // one even before anything animates.
    const isSelected = itemCtx ? ac.isSelected(itemCtx.value) : false;

    const indicatorConfig = React.useMemo(() => {
      const triggers = indicatorTriggers(ac.animConfig, isSelected);
      return triggers.length > 0 ? triggers : null;
    }, [ac.animConfig, isSelected]);

    const indicatorRefs = React.useMemo(
      () => ({ ItemIndicator: glyphRef as React.RefObject<HTMLElement | null> }),
      [],
    );

    useAnimations(indicatorConfig, indicatorRefs);

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
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            aria-hidden="true"
          >
            <span ref={glyphRef} className={styles.itemIndicatorGlyph}>
              {props.children ?? resolvedCheck}
            </span>
          </span>
        );
      },
    };
  },
});

// =============================================================================
// Group
// =============================================================================

export interface AutocompleteGroupProps extends React.HTMLAttributes<HTMLElement> {
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
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = groupSp as Record<string, unknown>;
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

export interface AutocompleteGroupLabelProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'groupLabel'>;
}

const AutocompleteGroupLabel = withMoveComponent<
  'groupLabel',
  AutocompleteGroupLabelProps,
  HTMLDivElement
>({
  name: 'AutocompleteGroupLabel',
  styles,
  slots: ['groupLabel'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const labelSp = sp('groupLabel');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = labelSp as Record<string, unknown>;
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

export interface AutocompleteEmptyProps extends React.HTMLAttributes<HTMLElement> {
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
        if (ac.loading || ac.hasError) return null;
        const visible = ac.getVisibleItems();
        if (visible.length > 0) return null;

        const emptySp = sp('empty');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = emptySp as Record<string, unknown>;
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

export interface AutocompleteLoadingProps extends React.HTMLAttributes<HTMLElement> {
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
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = loadingSp as Record<string, unknown>;
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
// Error
// =============================================================================

export interface AutocompleteErrorProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'error'>;
}

const AutocompleteError = withMoveComponent<'error', AutocompleteErrorProps, HTMLDivElement>({
  name: 'AutocompleteError',
  styles,
  slots: ['error'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const ac = useAutocompleteContext();

    return {
      render() {
        if (!ac.hasError) return null;

        const errorSp = sp('error');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = errorSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={ref}
            role="alert"
            aria-live="assertive"
            className={cx('error', props.className, spClass as string | undefined)}
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
// RetryTrigger
// =============================================================================

export interface AutocompleteRetryTriggerProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'retryTrigger'>;
}

const AutocompleteRetryTrigger = withMoveComponent<
  'retryTrigger',
  AutocompleteRetryTriggerProps,
  HTMLButtonElement
>({
  name: 'AutocompleteRetryTrigger',
  styles,
  slots: ['retryTrigger'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const ac = useAutocompleteContext();

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      ac.retry?.();
    };

    return {
      render() {
        // Only meaningful in the error state, and only when the resource supplied
        // a retry callback.
        if (!ac.hasError || !ac.retry) return null;

        const retrySp = sp('retryTrigger');
        const {
          className: spClass,
          style: spStyle,
          ...spRest
        } = retrySp as Record<string, unknown>;
        return (
          <button
            {...attrs}
            {...spRest}
            ref={ref}
            type="button"
            className={cx('retryTrigger', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            onClick={handleClick}
          >
            {props.children ?? ac.labels.retry}
          </button>
        );
      },
    };
  },
});

// =============================================================================
// Separator
// =============================================================================

export interface AutocompleteSeparatorProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'separator'>;
}

const AutocompleteSeparator = withMoveComponent<
  'separator',
  AutocompleteSeparatorProps,
  HTMLDivElement
>({
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
    const displayName = elementTypeName(child);
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
  Error: AutocompleteError,
  RetryTrigger: AutocompleteRetryTrigger,
  Separator: AutocompleteSeparator,
};
