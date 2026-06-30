'use client';
// Generated from TimeField.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)

import * as React from 'react';
import { Popover as RadixPopover } from 'radix-ui';
import { withMoveComponent } from '../../../engine';
import { useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { useAnimations, resolveAnimationsConfig, staggerItems, useDismissable, useDismissableExit } from '../../../animation';
import { useLayer } from '../../../infrastructure/Layer';
import type { AnimationTrigger } from '../../../animation';
import { useTimeField } from './useTimeField';
import type { UseTimeFieldReturn, SegmentType, TimeFieldGranularity } from './useTimeField';
import styles from './TimeField.module.css';

// ============================================================================
// Types
// ============================================================================

export type TimeFieldSize = 'sm' | 'md' | 'lg';

export interface TimeFieldLabels {
  /** aria-label for the hour segment */
  hour: string;
  /** aria-label for the minute segment */
  minute: string;
  /** aria-label for the second segment */
  second: string;
  /** aria-label for the AM/PM period toggle */
  period: string;
}

const DEFAULT_LABELS: TimeFieldLabels = {
  hour: 'hour',
  minute: 'minute',
  second: 'second',
  period: 'period',
};

// ============================================================================
// Context
// ============================================================================

interface TimeFieldContextValue {
  tf: UseTimeFieldReturn;
  segmentRefs: React.MutableRefObject<Map<string, HTMLElement | null>>;
  focusSegment: (segment: string) => void;
  focusNext: (current: string) => void;
  focusPrev: (current: string) => void;
  size: TimeFieldSize;
  disabled: boolean;
  invalid: boolean;
  // Dropdown state
  isOpen: boolean;
  isClosing: boolean;
  openDropdown: () => void;
  close: () => void;
  epoch: number;
  onExitDone: (epoch: number) => void;
  animConfig: AnimationTrigger[] | null;
  withDropdown: boolean;
  labels: TimeFieldLabels;
}

const TimeFieldContext = React.createContext<TimeFieldContextValue | null>(null);

function useTimeFieldContext() {
  const ctx = React.useContext(TimeFieldContext);
  if (!ctx) throw new Error('TimeField components must be used within TimeField or TimeField.Root');
  return ctx;
}

// ============================================================================
// Root
// ============================================================================

export interface TimeFieldRootProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  // Value
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;

  // Config
  granularity?: TimeFieldGranularity;
  hourCycle?: 12 | 24;
  withDropdown?: boolean;
  animations?: AnimationTrigger[] | false;
  size?: TimeFieldSize;
  disabled?: boolean;
  invalid?: boolean;
  min?: string;
  max?: string;
  step?: number;
  labels?: Partial<TimeFieldLabels>;
}

const DEFAULT_TIMEFIELD_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'Content.enter',
    sequence: [[
      { target: 'Content', animation: { opacity: { from: 0, to: 1, duration: 150 } } },
      { children: 'button', stagger: staggerItems.stagger, animation: staggerItems.enter },
    ]],
  },
  {
    trigger: 'Content.exit',
    sequence: [[
      { target: 'Content', animation: { opacity: { to: 0, duration: 150 } } },
      { children: 'button', stagger: staggerItems.stagger, animation: staggerItems.exit },
    ]],
  },
];

const TimeFieldRoot: React.FC<TimeFieldRootProps> = ({
  children,
  className,
  style,
  value,
  defaultValue,
  onValueChange,
  granularity = 'minute',
  hourCycle = 24,
  withDropdown = false,
  animations: animationsProp,
  size = 'md',
  disabled = false,
  invalid = false,
  min,
  max,
  step,
  labels: labelsProp,
}) => {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const animConfig = resolveAnimationsConfig(DEFAULT_TIMEFIELD_ANIMATIONS, animationsProp);
  // Interruptible open/close lifecycle (open cancels an in-flight close;
  // exit-completion is epoch-guarded). See useDismissable.
  const dismissable = useDismissable();
  const { isOpen, isClosing, epoch, onExitDone, open: openDropdown, close } = dismissable;
  const segmentRefs = React.useRef<Map<string, HTMLElement | null>>(new Map());
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const tf = useTimeField({
    value,
    defaultValue,
    onValueChange,
    granularity,
    hourCycle,
    min,
    max,
    step,
    disabled,
  });

  const segmentOrder = React.useMemo(
    () => tf.segments.map((s) => s.type),
    [tf.segments],
  );

  const focusSegment = React.useCallback((segment: string) => {
    const el = segmentRefs.current.get(segment);
    el?.focus();
  }, []);

  const focusNext = React.useCallback(
    (current: string) => {
      const idx = segmentOrder.indexOf(current as any);
      if (idx < segmentOrder.length - 1) {
        focusSegment(segmentOrder[idx + 1]);
      }
    },
    [segmentOrder, focusSegment],
  );

  const focusPrev = React.useCallback(
    (current: string) => {
      const idx = segmentOrder.indexOf(current as any);
      if (idx > 0) {
        focusSegment(segmentOrder[idx - 1]);
      }
    },
    [segmentOrder, focusSegment],
  );

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    // Open (or cancel an in-flight close); ignore Radix's own close — the exit
    // animation drives it (useDismissable).
    if (newOpen) openDropdown();
  }, [openDropdown]);

  const ctx: TimeFieldContextValue = {
    tf,
    segmentRefs,
    focusSegment,
    focusNext,
    focusPrev,
    size,
    disabled,
    invalid,
    isOpen,
    isClosing,
    openDropdown,
    close,
    epoch,
    onExitDone,
    animConfig,
    withDropdown,
    labels,
  };

  // Auto-render when no children
  const hasChildren = React.Children.count(children) > 0;

  const content = hasChildren ? children : (
    <>
      {tf.segments.map((seg, i) => (
        <React.Fragment key={seg.type}>
          {i > 0 && seg.type !== 'period' && <TimeFieldSeparator />}
          {seg.type === 'period' ? (
            <TimeFieldPeriod />
          ) : (
            <TimeFieldSegment segment={seg.type as SegmentType} />
          )}
        </React.Fragment>
      ))}
    </>
  );

  const rootEl = (
    <div
      ref={anchorRef}
      className={`${styles.root} ${className ?? ''}`}
      style={style}
      data-size={size}
      data-granularity={granularity}
      data-hourcycle={hourCycle}
      {...(disabled ? { 'data-disabled': '' } : {})}
      {...(invalid ? { 'data-invalid': '' } : {})}
    >
      {content}
    </div>
  );

  if (withDropdown) {
    return (
      <TimeFieldContext.Provider value={ctx}>
        <RadixPopover.Root open={isOpen || isClosing} onOpenChange={handleOpenChange}>
          <RadixPopover.Anchor asChild>
            {rootEl}
          </RadixPopover.Anchor>
          <TimeFieldDropdown>
            {segmentOrder
              .filter((s) => s !== 'period')
              .map((seg) => (
                <TimeFieldDropdownColumn key={seg} segment={seg as SegmentType} />
              ))}
            {hourCycle === 12 && <TimeFieldDropdownColumn segment={'period' as any} />}
          </TimeFieldDropdown>
        </RadixPopover.Root>
      </TimeFieldContext.Provider>
    );
  }

  return (
    <TimeFieldContext.Provider value={ctx}>
      {rootEl}
    </TimeFieldContext.Provider>
  );
};
TimeFieldRoot.displayName = 'TimeField';

// ============================================================================
// Segment
// ============================================================================

export interface TimeFieldSegmentProps extends React.HTMLAttributes<HTMLElement> {
  segment: SegmentType;
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'segment'>;
}

const TimeFieldSegment = withMoveComponent<'segment', TimeFieldSegmentProps, HTMLInputElement>({
  name: 'TimeFieldSegment',
  styles,
  slots: ['segment'] as const,
  moveProps: ['segment'],

  setup({ props, ref, cx, sp, attrs }) {
    const { tf, segmentRefs, focusNext, focusPrev, disabled, withDropdown, openDropdown, isOpen, labels } = useTimeFieldContext();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRef<HTMLInputElement>(ref, inputRef);
    const segType = props.segment as SegmentType;

    // Register ref
    React.useEffect(() => {
      segmentRefs.current.set(segType, inputRef.current);
      return () => { segmentRefs.current.delete(segType); };
    }, [segType, segmentRefs]);

    const segInfo = tf.segments.find((s) => s.type === segType);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        // Flip direction when dropdown is open (up = lower value = scroll up)
        isOpen ? tf.decrement(segType) : tf.increment(segType);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        isOpen ? tf.increment(segType) : tf.decrement(segType);
        if (withDropdown && !isOpen) openDropdown();
      } else if (e.key === 'ArrowRight' || e.key === 'Tab' && !e.shiftKey) {
        // Let Tab pass through naturally if it's the last segment
        const segOrder = tf.segments.map((s) => s.type);
        const idx = segOrder.indexOf(segType);
        if (idx < segOrder.length - 1) {
          e.preventDefault();
          focusNext(segType);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'Tab' && e.shiftKey) {
        const segOrder = tf.segments.map((s) => s.type);
        const idx = segOrder.indexOf(segType);
        if (idx > 0) {
          e.preventDefault();
          focusPrev(segType);
        }
      } else if (/^\d$/.test(e.key)) {
        e.preventDefault();
        const isFull = tf.type(segType, e.key);
        if (isFull) focusNext(segType);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        tf.clearBuffer(segType);
      }
    };

    const handleFocus = () => {
      tf.clearBuffer(segType);
    };

    return {
      render() {
        const segSp = sp('segment');
        const { className: spClass, style: spStyle, ...spRest } = segSp as Record<string, unknown>;
        return (
          <input
            {...attrs}
            {...spRest}
            ref={mergedRef}
            type="text"
            inputMode="numeric"
            role="spinbutton"
            aria-label={labels[segType as keyof TimeFieldLabels] ?? segType}
            aria-valuenow={parseInt(segInfo?.value ?? '0', 10)}
            value={segInfo?.value ?? ''}
            readOnly
            disabled={disabled}
            className={cx('segment', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            data-segment={segType}
          />
        );
      },
    };
  },
});

// ============================================================================
// Separator
// ============================================================================

export interface TimeFieldSeparatorProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<'separator'>;
}

const TimeFieldSeparator = withMoveComponent<'separator', TimeFieldSeparatorProps, HTMLSpanElement>({
  name: 'TimeFieldSeparator',
  styles,
  slots: ['separator'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    return {
      render() {
        const sepSp = sp('separator');
        const { className: spClass, style: spStyle, ...spRest } = sepSp as Record<string, unknown>;
        return (
          <span
            {...attrs}
            {...spRest}
            ref={ref}
            className={cx('separator', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            aria-hidden="true"
          >
            {props.children ?? ':'}
          </span>
        );
      },
    };
  },
});

// ============================================================================
// Period
// ============================================================================

export interface TimeFieldPeriodProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'period'>;
}

const TimeFieldPeriod = withMoveComponent<'period', TimeFieldPeriodProps, HTMLButtonElement>({
  name: 'TimeFieldPeriod',
  styles,
  slots: ['period'] as const,

  setup({ props, ref, cx, sp, attrs }) {
    const { tf, segmentRefs, focusPrev, disabled, withDropdown, openDropdown, labels } = useTimeFieldContext();
    const btnRef = React.useRef<HTMLButtonElement>(null);
    const mergedRef = useMergedRef<HTMLButtonElement>(ref, btnRef);

    // Register ref
    React.useEffect(() => {
      segmentRefs.current.set('period', btnRef.current);
      return () => { segmentRefs.current.delete('period'); };
    }, [segmentRefs]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        tf.increment('period');
        if (e.key === 'ArrowDown' && withDropdown) openDropdown();
      } else if (e.key === 'ArrowLeft' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        focusPrev('period');
      } else {
        const k = e.key.toUpperCase();
        if (k === 'A' || k === 'P') {
          e.preventDefault();
          tf.type('period', k);
        }
      }
    };

    return {
      render() {
        const periodSp = sp('period');
        const { className: spClass, style: spStyle, ...spRest } = periodSp as Record<string, unknown>;
        return (
          <button
            {...attrs}
            {...spRest}
            ref={mergedRef}
            type="button"
            role="spinbutton"
            aria-label={labels.period}
            aria-valuenow={tf.period === 'AM' ? 0 : 1}
            disabled={disabled}
            tabIndex={0}
            className={cx('period', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            onKeyDown={handleKeyDown}
            data-segment="period"
          >
            {tf.period}
          </button>
        );
      },
    };
  },
});

// ============================================================================
// Dropdown
// ============================================================================

export interface TimeFieldDropdownProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Inner lives BELOW the Portal, so it mounts/unmounts per open — that is what
// makes the lifecycle Content.enter (the height reveal) fire on every open.
// Keeping useAnimations in the Portal-rendering parent fired it once, at page
// load, with a null ref, so the reveal never played.
const TimeFieldDropdownInner: React.FC<TimeFieldDropdownProps> = ({
  children,
  className,
  style,
}) => {
  const ctx = useTimeFieldContext();
  const layer = useLayer();

  const contentRef = React.useRef<HTMLDivElement>(null);

  const contentConfig = React.useMemo(() =>
    ctx.animConfig?.filter(t => t.trigger === 'Content.enter' || t.trigger === 'Content.exit') ?? null,
    [ctx.animConfig]);
  const contentRefs = React.useMemo(() => ({
    Content: contentRef as React.RefObject<HTMLElement | null>,
  }), []);

  const { runExit, pauseAll } = useAnimations(contentConfig, contentRefs);

  useDismissableExit({
    isClosing: ctx.isClosing,
    epoch: ctx.epoch,
    onExitDone: ctx.onExitDone,
    runExit,
    pauseAll,
    resnap: () => {
      if (contentRef.current) contentRef.current.style.opacity = '';
    },
  });

  const handlePointerDownOutside = (e: Event) => {
    if (!e.defaultPrevented) ctx.close();
  };

  const handleEscapeKeyDown = (e: KeyboardEvent) => {
    if (!e.defaultPrevented) ctx.close();
  };

  return (
    <RadixPopover.Content
      ref={contentRef}
      sideOffset={4}
      align="start"
      className={`${styles.dropdown} ${className ?? ''}`}
      style={{ ...style, ...(layer > 0 ? { zIndex: layer + 1 } : {}) }}
      onPointerDownOutside={handlePointerDownOutside}
      onEscapeKeyDown={handleEscapeKeyDown}
      onOpenAutoFocus={(e) => e.preventDefault()}
      onCloseAutoFocus={(e) => e.preventDefault()}
    >
      {children}
    </RadixPopover.Content>
  );
};

const TimeFieldDropdown: React.FC<TimeFieldDropdownProps> = (props) => (
  <RadixPopover.Portal>
    <TimeFieldDropdownInner {...props} />
  </RadixPopover.Portal>
);
TimeFieldDropdown.displayName = 'TimeField.Dropdown';

// ============================================================================
// DropdownColumn
// ============================================================================

export interface TimeFieldDropdownColumnProps extends React.HTMLAttributes<HTMLElement> {
  segment: SegmentType | 'period';
  className?: string;
  style?: React.CSSProperties;
  sp?: SlotPropsMap<'dropdownColumn'>;
}

const TimeFieldDropdownColumn = withMoveComponent<'dropdownColumn', TimeFieldDropdownColumnProps, HTMLDivElement>({
  name: 'TimeFieldDropdownColumn',
  styles,
  slots: ['dropdownColumn'] as const,
  moveProps: ['segment'],

  setup({ props, ref, cx, sp, attrs }) {
    const { tf, isOpen } = useTimeFieldContext();
    const colRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRef<HTMLDivElement>(ref, colRef);
    const segType = props.segment as SegmentType | 'period';

    // Generate items
    const items = React.useMemo(() => {
      if (segType === 'period') {
        return ['AM', 'PM'];
      }
      if (segType === 'hour') {
        if (tf.hourCycle === 12) {
          return Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
        }
        return Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
      }
      // minute or second
      return Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
    }, [segType, tf.hourCycle]);

    // Current selected value
    const selectedValue = React.useMemo(() => {
      if (segType === 'period') return tf.period;
      const seg = tf.segments.find((s) => s.type === segType);
      return seg?.value ?? '';
    }, [segType, tf.period, tf.segments]);

    // Scroll to selected on open
    React.useEffect(() => {
      if (!isOpen || !colRef.current) return;
      const selectedEl = colRef.current.querySelector('[data-selected]') as HTMLElement | null;
      if (selectedEl) {
        // Defer to next frame to ensure layout
        requestAnimationFrame(() => {
          selectedEl.scrollIntoView({ block: 'center' });
        });
      }
    }, [isOpen, selectedValue]);

    const handleItemClick = (itemValue: string) => {
      if (segType === 'period') {
        tf.setPeriod(itemValue as 'AM' | 'PM');
      } else if (segType === 'hour') {
        if (tf.hourCycle === 12) {
          const h12 = parseInt(itemValue, 10);
          const h24 = tf.period === 'AM' ? (h12 === 12 ? 0 : h12) : (h12 === 12 ? 12 : h12 + 12);
          tf.setHours(h24);
        } else {
          tf.setHours(parseInt(itemValue, 10));
        }
      } else if (segType === 'minute') {
        tf.setMinutes(parseInt(itemValue, 10));
      } else if (segType === 'second') {
        tf.setSeconds(parseInt(itemValue, 10));
      }
    };

    return {
      render() {
        const colSp = sp('dropdownColumn');
        const { className: spClass, style: spStyle, ...spRest } = colSp as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...spRest}
            ref={mergedRef}
            className={cx('dropdownColumn', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
            data-segment={segType}
          >
            {items.map((item) => (
              <button
                key={item}
                type="button"
                className={styles.dropdownItem}
                data-selected={item === selectedValue ? '' : undefined}
                onClick={() => handleItemClick(item)}
              >
                {item}
              </button>
            ))}
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const TimeField = Object.assign(TimeFieldRoot, {
  Root: TimeFieldRoot,
  Segment: TimeFieldSegment,
  Separator: TimeFieldSeparator,
  Period: TimeFieldPeriod,
  Dropdown: TimeFieldDropdown,
  DropdownColumn: TimeFieldDropdownColumn,
});
