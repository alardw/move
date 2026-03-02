'use client';

import * as React from 'react';
import { animate } from 'animejs';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import {
  toAnimeParams,
  prefersReducedMotion,
  mergeAnimateConfig,
  getInitialStyles,
} from '../../../animation';
import type {
  LifecycleAnimate,
  StaggerModifier,
  Animation,
  StaggerConfig,
} from '../../../animation';
import styles from './Timeline.module.css';

// ============================================================================
// Local type alias (spec refers to this as ListAnimate)
// ============================================================================

type ListAnimate = LifecycleAnimate & StaggerModifier;

// ============================================================================
// Types
// ============================================================================

export type TimelineSize = 'sm' | 'md' | 'lg';
export type TimelineAlign = 'left' | 'right' | 'alternate';
export type TimelineColor = 'primary' | 'gray' | 'success' | 'warning' | 'danger';
export type TimelineLineVariant = 'solid' | 'dashed' | 'dotted';

// ============================================================================
// Context
// ============================================================================

interface TimelineContextValue {
  active: number;
  align: TimelineAlign;
  size: TimelineSize;
  color: TimelineColor;
  lineVariant: TimelineLineVariant;
  reverseActive: boolean;
  getItemIndex: () => number;
  stagger?: StaggerConfig;
  enterAnimation?: Animation;
}

const TimelineContext = React.createContext<TimelineContextValue | null>(null);

// ============================================================================
// Root
// ============================================================================

export interface TimelineRootProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  active?: number;
  align?: TimelineAlign;
  size?: TimelineSize;
  color?: TimelineColor;
  lineVariant?: TimelineLineVariant;
  reverseActive?: boolean;
  animate?: ListAnimate | false;
  sp?: SlotPropsMap<'root'>;
}

const defaultAnimation: ListAnimate = {
  enter: {
    opacity: { value: [0, 1], easing: 'outQuart' },
    translateY: { value: [12, 0], easing: 'outQuart' },
    scale: { value: [0.95, 1], easing: 'quick' },
  },
  stagger: { delay: 80 },
};

const TimelineRoot = withMoveComponent<'root', TimelineRootProps, HTMLDivElement>({
  name: 'Timeline',
  styles,
  slots: ['root'] as const,
  defaults: {
    active: -1 as unknown as undefined,
    align: 'left' as TimelineAlign,
    size: 'md' as TimelineSize,
    color: 'primary' as TimelineColor,
    lineVariant: 'solid' as TimelineLineVariant,
    reverseActive: false as unknown as undefined,
  },
  moveProps: ['active', 'align', 'size', 'color', 'lineVariant', 'reverseActive', 'animate'],

  setup({ props, ref, cx, sp, attrs }) {
    const indexRef = React.useRef(0);

    const config = props.animate === false
      ? { enter: undefined, stagger: undefined }
      : mergeAnimateConfig(defaultAnimation, props.animate as ListAnimate | undefined);

    const getItemIndex = React.useCallback(() => indexRef.current++, []);

    React.useEffect(() => { indexRef.current = 0; });

    const ctx: TimelineContextValue = {
      active: props.active as number,
      align: props.align as TimelineAlign,
      size: props.size as TimelineSize,
      color: props.color as TimelineColor,
      lineVariant: props.lineVariant as TimelineLineVariant,
      reverseActive: props.reverseActive as boolean,
      getItemIndex,
      stagger: config.stagger,
      enterAnimation: config.enter,
    };

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        return (
          <TimelineContext.Provider value={ctx}>
            <div
              {...attrs}
              {...spRest}
              ref={ref}
              className={cx('root', props.className, spClass as string | undefined)}
              style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
              data-align={props.align}
              data-size={props.size}
            >
              {props.children}
            </div>
          </TimelineContext.Provider>
        );
      },
    };
  },
});

// ============================================================================
// Item
// ============================================================================

export type TimelineItemSlots = 'item' | 'bullet' | 'line' | 'content' | 'title';

export interface TimelineItemProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  bullet?: React.ReactNode;
  title?: React.ReactNode;
  lineVariant?: TimelineLineVariant;
  color?: TimelineColor;
  sp?: SlotPropsMap<TimelineItemSlots>;
}

const TimelineItem = withMoveComponent<TimelineItemSlots, TimelineItemProps, HTMLDivElement>({
  name: 'TimelineItem',
  styles,
  slots: ['item', 'bullet', 'line', 'content', 'title'] as const,
  moveProps: ['bullet', 'title', 'lineVariant', 'color'],

  setup({ props, ref, cx, sp, attrs }) {
    const ctx = React.useContext(TimelineContext);
    const indexRef = React.useRef<number | null>(null);
    const itemRef = React.useRef<HTMLDivElement | null>(null);
    const hasAnimated = React.useRef(false);

    const mergedRef = useMergedRef<HTMLDivElement>(ref, itemRef);

    if (indexRef.current === null && ctx) {
      indexRef.current = ctx.getItemIndex();
    }

    const index = indexRef.current ?? 0;

    // Stagger enter animation
    const enterAnim = ctx?.enterAnimation;
    const staggerConfig = ctx?.stagger;

    const initialStyles = React.useMemo(() => {
      if (!enterAnim) return {};
      return getInitialStyles(enterAnim);
    }, [enterAnim]);

    React.useEffect(() => {
      const el = itemRef.current;
      if (!el || !enterAnim || hasAnimated.current) return;

      hasAnimated.current = true;

      if (prefersReducedMotion()) {
        el.style.opacity = '1';
        el.style.transform = '';
        return;
      }

      const delay = (staggerConfig?.delay ?? 0) * index;
      animate(el, { ...toAnimeParams(enterAnim), delay });
    }, [enterAnim, staggerConfig, index]);

    return {
      render() {
        const active = ctx?.active ?? -1;
        const align = ctx?.align ?? 'left';
        const reverseActive = ctx?.reverseActive ?? false;
        const itemColor = (props.color as TimelineColor) || ctx?.color || 'primary';
        const itemLineVariant = (props.lineVariant as TimelineLineVariant) || ctx?.lineVariant || 'solid';

        // Determine state
        let state: 'completed' | 'active' | 'inactive';
        if (active < 0) {
          state = 'inactive';
        } else if (reverseActive) {
          if (index > active) state = 'completed';
          else if (index === active) state = 'active';
          else state = 'inactive';
        } else {
          if (index < active) state = 'completed';
          else if (index === active) state = 'active';
          else state = 'inactive';
        }

        // Determine content side for alternate layout
        const contentSide = align === 'alternate'
          ? (index % 2 === 0 ? 'right' : 'left')
          : undefined;

        const bullet = props.bullet as React.ReactNode;
        const title = props.title as React.ReactNode;
        const hasBulletContent = bullet != null;

        const itemSp = sp('item');
        const { className: iSpClass, style: iSpStyle, ...iSpRest } = itemSp as Record<string, unknown>;
        const bulletSp = sp('bullet');
        const { className: bSpClass, style: bSpStyle, ...bSpRest } = bulletSp as Record<string, unknown>;
        const lineSp = sp('line');
        const { className: lSpClass, style: lSpStyle, ...lSpRest } = lineSp as Record<string, unknown>;
        const contentSp = sp('content');
        const { className: cSpClass, style: cSpStyle, ...cSpRest } = contentSp as Record<string, unknown>;
        const titleSp = sp('title');
        const { className: tSpClass, style: tSpStyle, ...tSpRest } = titleSp as Record<string, unknown>;

        return (
          <div
            {...attrs}
            {...iSpRest}
            ref={mergedRef}
            className={cx('item', props.className, iSpClass as string | undefined)}
            style={{ ...initialStyles, ...props.style, ...(iSpStyle as React.CSSProperties) }}
            data-state={state}
            data-color={itemColor}
            data-line-variant={itemLineVariant}
            data-content-side={contentSide}
          >
            <div className={styles.separator}>
              <div
                {...bSpRest}
                className={cx('bullet', bSpClass as string | undefined)}
                style={bSpStyle as React.CSSProperties}
                data-has-content={hasBulletContent ? '' : undefined}
              >
                {bullet}
              </div>
              <div
                {...lSpRest}
                className={cx('line', lSpClass as string | undefined)}
                style={lSpStyle as React.CSSProperties}
              />
            </div>
            <div
              {...cSpRest}
              className={cx('content', cSpClass as string | undefined)}
              style={cSpStyle as React.CSSProperties}
            >
              {title && (
                <div
                  {...tSpRest}
                  className={cx('title', tSpClass as string | undefined)}
                  style={tSpStyle as React.CSSProperties}
                >
                  {title}
                </div>
              )}
              {props.children}
            </div>
          </div>
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const Timeline = Object.assign(TimelineRoot, {
  Root: TimelineRoot,
  Item: TimelineItem,
});
