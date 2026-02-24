'use client';

import * as React from 'react';
import { Popover as RadixPopover } from 'radix-ui';
import { animate, spring } from 'animejs';
import { withMoveComponent } from '../../../engine';
import { useMergedRef } from '../../../engine/useMergedRef';
import type { PassThrough } from '../../../engine/types';
import { mergeAnimateConfig } from '../../../animation/utils';
import type { PopupAnimate } from '../../../animation/types';
import { useTimeField } from './useTimeField';
import type { UseTimeFieldReturn, SegmentType, TimeFieldGranularity } from './useTimeField';
import styles from './TimeField.module.css';

const springConfig = { mass: 0.6, stiffness: 400, damping: 20, velocity: 0 };

// ============================================================================
// Context
// ============================================================================

interface TimeFieldContextValue {
  tf: UseTimeFieldReturn;
  segmentRefs: React.MutableRefObject<Map<string, HTMLElement | null>>;
  focusSegment: (segment: string) => void;
  focusNext: (current: string) => void;
  focusPrev: (current: string) => void;
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  invalid: boolean;
  // Dropdown state
  isOpen: boolean;
  isClosing: boolean;
  openDropdown: () => void;
  close: () => void;
  onCloseComplete: () => void;
  animateConfig: PopupAnimate | null;
  withDropdown: boolean;
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
  animate?: PopupAnimate | false;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  invalid?: boolean;
  min?: string;
  max?: string;
  step?: number;
}

const defaultTimeFieldAnimation: PopupAnimate = {
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
  animate: animateProp,
  size = 'md',
  disabled = false,
  invalid = false,
  min,
  max,
  step,
}) => {
  const animateConfig = animateProp === false ? null : mergeAnimateConfig(defaultTimeFieldAnimation, animateProp);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
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

  const openDropdown = React.useCallback(() => {
    if (!isOpen && !isClosing) setIsOpen(true);
  }, [isOpen, isClosing]);

  const close = React.useCallback(() => {
    setIsClosing(true);
  }, []);

  const onCloseComplete = React.useCallback(() => {
    setIsClosing(false);
    setIsOpen(false);
  }, []);

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (newOpen) {
      setIsOpen(true);
    }
    // Ignore close from Radix — we coordinate via animation
  }, []);

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
    onCloseComplete,
    animateConfig,
    withDropdown,
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

export interface TimeFieldSegmentProps extends Record<string, unknown> {
  segment: SegmentType;
  className?: string;
  style?: React.CSSProperties;
  pt?: PassThrough<'segment'>;
}

const TimeFieldSegment = withMoveComponent<'segment', TimeFieldSegmentProps, HTMLInputElement>({
  name: 'TimeFieldSegment',
  styles,
  slots: ['segment'] as const,
  moveProps: ['segment'],

  setup({ props, ref, cx, ptm, attrs }) {
    const { tf, segmentRefs, focusNext, focusPrev, disabled, withDropdown, openDropdown, isOpen } = useTimeFieldContext();
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
        const segPt = ptm('segment');
        const { className: ptClass, style: ptStyle, ...ptRest } = segPt as Record<string, unknown>;
        return (
          <input
            {...attrs}
            {...ptRest}
            ref={mergedRef}
            type="text"
            inputMode="numeric"
            role="spinbutton"
            aria-label={segType}
            aria-valuenow={parseInt(segInfo?.value ?? '0', 10)}
            value={segInfo?.value ?? ''}
            readOnly
            disabled={disabled}
            className={cx('segment', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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

export interface TimeFieldSeparatorProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  pt?: PassThrough<'separator'>;
}

const TimeFieldSeparator = withMoveComponent<'separator', TimeFieldSeparatorProps, HTMLSpanElement>({
  name: 'TimeFieldSeparator',
  styles,
  slots: ['separator'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const sepPt = ptm('separator');
        const { className: ptClass, style: ptStyle, ...ptRest } = sepPt as Record<string, unknown>;
        return (
          <span
            {...attrs}
            {...ptRest}
            ref={ref}
            className={cx('separator', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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

export interface TimeFieldPeriodProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  pt?: PassThrough<'period'>;
}

const TimeFieldPeriod = withMoveComponent<'period', TimeFieldPeriodProps, HTMLButtonElement>({
  name: 'TimeFieldPeriod',
  styles,
  slots: ['period'] as const,

  setup({ props, ref, cx, ptm, attrs }) {
    const { tf, segmentRefs, focusPrev, disabled, withDropdown, openDropdown } = useTimeFieldContext();
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
        const periodPt = ptm('period');
        const { className: ptClass, style: ptStyle, ...ptRest } = periodPt as Record<string, unknown>;
        return (
          <button
            {...attrs}
            {...ptRest}
            ref={mergedRef}
            type="button"
            role="spinbutton"
            aria-label="period"
            aria-valuenow={tf.period === 'AM' ? 0 : 1}
            disabled={disabled}
            tabIndex={0}
            className={cx('period', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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

const TimeFieldDropdown: React.FC<TimeFieldDropdownProps> = ({
  children,
  className,
  style,
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const animRef = React.useRef<ReturnType<typeof animate> | null>(null);
  const itemsAnimRef = React.useRef<ReturnType<typeof animate> | null>(null);
  const ctx = useTimeFieldContext();
  const [isAnimatingOut, setIsAnimatingOut] = React.useState(false);

  // Animate open — matches Select/Dropdown pattern
  React.useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el || !ctx.isOpen) return;
    if (!ctx.animateConfig) {
      el.style.height = 'auto';
      el.style.opacity = '1';
      return;
    }
    if (animRef.current) animRef.current.pause();
    if (itemsAnimRef.current) itemsAnimRef.current.pause();

    // Measure natural height
    el.style.height = 'auto';
    const targetHeight = el.offsetHeight;

    el.style.height = '0px';
    el.style.opacity = '1';
    el.style.transform = 'scale(0.5)';

    animRef.current = animate(el, {
      height: targetHeight,
      scale: 1,
      ease: 'outQuart',
      duration: 250,
      onComplete: () => {
        if (el) el.style.height = 'auto';
      },
    });

    // Stagger items in with spring
    const items = el.querySelectorAll('button');
    items.forEach((item) => {
      (item as HTMLElement).style.opacity = '0';
      (item as HTMLElement).style.transform = 'scale(0.8)';
    });
    itemsAnimRef.current = animate(items, {
      opacity: 1,
      scale: 1,
      ease: spring(springConfig),
      delay: (_el: any, i: number) => i * 30,
    });
  }, [ctx.isOpen, ctx.animateConfig]);

  // isClosing → animate out
  React.useEffect(() => {
    if (ctx.isClosing && !isAnimatingOut) {
      setIsAnimatingOut(true);
    }
  }, [ctx.isClosing, isAnimatingOut]);

  React.useEffect(() => {
    if (!isAnimatingOut) return;
    const el = contentRef.current;
    if (!el) return;
    if (!ctx.animateConfig) {
      setIsAnimatingOut(false);
      ctx.onCloseComplete();
      return;
    }
    if (animRef.current) animRef.current.pause();
    if (itemsAnimRef.current) itemsAnimRef.current.pause();

    el.style.height = `${el.offsetHeight}px`;

    const items = el.querySelectorAll('button');
    const itemCount = items.length;
    itemsAnimRef.current = animate(items, {
      opacity: 0,
      scale: 0.8,
      ease: 'outQuart',
      duration: 150,
      delay: (_el: any, i: number) => (itemCount - 1 - i) * 20,
    });

    animRef.current = animate(el, {
      height: 0,
      paddingTop: 0,
      paddingBottom: 0,
      ease: 'outQuart',
      duration: 200,
      delay: 50,
      onComplete: () => {
        setIsAnimatingOut(false);
        ctx.onCloseComplete();
      },
    });

    animate(el, {
      opacity: 0,
      ease: 'outQuart',
      duration: 100,
      delay: 150,
    });
  }, [isAnimatingOut, ctx]);

  const handlePointerDownOutside = (e: Event) => {
    e.preventDefault();
    ctx.close();
  };

  const handleEscapeKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();
    ctx.close();
  };

  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        ref={contentRef}
        sideOffset={4}
        align="start"
        className={`${styles.dropdown} ${className ?? ''}`}
        style={style}
        onPointerDownOutside={handlePointerDownOutside}
        onEscapeKeyDown={handleEscapeKeyDown}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {children}
      </RadixPopover.Content>
    </RadixPopover.Portal>
  );
};
TimeFieldDropdown.displayName = 'TimeField.Dropdown';

// ============================================================================
// DropdownColumn
// ============================================================================

export interface TimeFieldDropdownColumnProps extends Record<string, unknown> {
  segment: SegmentType | 'period';
  className?: string;
  style?: React.CSSProperties;
  pt?: PassThrough<'dropdownColumn'>;
}

const TimeFieldDropdownColumn = withMoveComponent<'dropdownColumn', TimeFieldDropdownColumnProps, HTMLDivElement>({
  name: 'TimeFieldDropdownColumn',
  styles,
  slots: ['dropdownColumn'] as const,
  moveProps: ['segment'],

  setup({ props, ref, cx, ptm, attrs }) {
    const { tf, close, isOpen } = useTimeFieldContext();
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
        const colPt = ptm('dropdownColumn');
        const { className: ptClass, style: ptStyle, ...ptRest } = colPt as Record<string, unknown>;
        return (
          <div
            {...attrs}
            {...ptRest}
            ref={mergedRef}
            className={cx('dropdownColumn', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
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
