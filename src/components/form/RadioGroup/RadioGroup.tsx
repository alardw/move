'use client';

import * as React from 'react';
import { RadioGroup as RadixRadioGroup } from 'radix-ui';
import { animate, spring } from 'animejs';
import { withMoveComponent } from '../../../engine';
import { useMergedRef } from '../../../engine/useMergedRef';
import type { PassThrough } from '../../../engine/types';
import styles from './RadioGroup.module.css';

// ============================================================================
// Root
// ============================================================================

export interface RadioGroupRootProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  orientation?: 'horizontal' | 'vertical';
  loop?: boolean;
  pt?: PassThrough<'root'>;
}

const RadioGroupRoot = withMoveComponent<'root', RadioGroupRootProps, HTMLDivElement>({
  name: 'RadioGroupRoot',
  styles,
  slots: ['root'] as const,
  moveProps: ['value', 'defaultValue', 'onValueChange', 'disabled', 'name', 'required', 'orientation', 'loop'],

  setup({ props, ref, cx, ptm, attrs }) {
    return {
      render() {
        const rootPt = ptm('root');
        const { className: ptClass, style: ptStyle, ...ptRest } = rootPt as Record<string, unknown>;
        return (
          <RadixRadioGroup.Root
            {...attrs}
            {...ptRest}
            ref={ref}
            value={props.value as string}
            defaultValue={props.defaultValue as string}
            onValueChange={props.onValueChange as (value: string) => void}
            disabled={props.disabled as boolean}
            name={props.name as string}
            required={props.required as boolean}
            orientation={props.orientation as 'horizontal' | 'vertical'}
            loop={props.loop as boolean}
            className={cx('root', props.className, ptClass as string | undefined)}
            style={{ ...props.style, ...(ptStyle as React.CSSProperties) }}
          >
            {props.children}
          </RadixRadioGroup.Root>
        );
      },
    };
  },
});

// ============================================================================
// Item
// ============================================================================

export interface RadioGroupItemProps extends Record<string, unknown> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  value: string;
  disabled?: boolean;
  pt?: PassThrough<'item' | 'indicator' | 'dot'>;
}

const indicatorSpring = { mass: 0.8, stiffness: 500, damping: 15 };
const pressSpring = { mass: 0.6, stiffness: 500, damping: 12 };

const RadioGroupItem = withMoveComponent<'item' | 'indicator' | 'dot', RadioGroupItemProps, HTMLButtonElement>({
  name: 'RadioGroupItem',
  styles,
  slots: ['item', 'indicator', 'dot'] as const,
  moveProps: ['value', 'disabled'],

  setup({ props, ref, cx, ptm, attrs }) {
    const itemRef = React.useRef<HTMLButtonElement | null>(null);
    const indicatorRef = React.useRef<HTMLSpanElement | null>(null);
    const isPressing = React.useRef(false);
    const wasChecked = React.useRef(false);
    const mergedRef = useMergedRef<HTMLButtonElement>(ref, itemRef);

    // Observe data-state changes for indicator animation
    React.useEffect(() => {
      const item = itemRef.current;
      if (!item) return;

      wasChecked.current = item.getAttribute('data-state') === 'checked';

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.attributeName === 'data-state') {
            const isNowChecked = item.getAttribute('data-state') === 'checked';
            if (isNowChecked && !wasChecked.current) {
              const el = indicatorRef.current;
              if (el) {
                animate(el, {
                  opacity: [0, 1],
                  scale: [0.5, 1],
                  ease: spring(indicatorSpring),
                });
              }
            } else if (!isNowChecked && wasChecked.current) {
              const el = indicatorRef.current;
              if (el) {
                animate(el, {
                  opacity: [1, 0],
                  scale: [1, 0.5],
                  duration: 150,
                  ease: 'outQuad',
                });
              }
            }
            wasChecked.current = isNowChecked;
          }
        }
      });

      observer.observe(item, { attributes: true });
      return () => observer.disconnect();
    }, []);

    const handleMouseDown = () => {
      const item = itemRef.current;
      if (!item || props.disabled) return;
      isPressing.current = true;
      animate(item, {
        scale: 0.9,
        duration: 100,
        ease: 'outQuad',
      });
    };

    const handleMouseUp = () => {
      const item = itemRef.current;
      if (!item || !isPressing.current || props.disabled) return;
      isPressing.current = false;
      animate(item, {
        scale: 1,
        ease: spring(pressSpring),
      });
    };

    const handleMouseLeave = () => {
      const item = itemRef.current;
      if (!item || !isPressing.current) return;
      isPressing.current = false;
      animate(item, {
        scale: 1,
        duration: 100,
        ease: 'outQuad',
      });
    };

    const handleWrapperClick = () => {
      if (props.disabled) return;
      itemRef.current?.click();
    };

    return {
      render() {
        const itemPt = ptm('item');
        const indicatorPt = ptm('indicator');
        const dotPt = ptm('dot');

        const { className: itemPtClass, style: itemPtStyle, ...itemPtRest } = itemPt as Record<string, unknown>;
        const { className: indPtClass, style: indPtStyle, ...indPtRest } = indicatorPt as Record<string, unknown>;
        const { className: dotPtClass, style: dotPtStyle, ...dotPtRest } = dotPt as Record<string, unknown>;

        return (
          <span
            className={styles.wrapper}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onClick={handleWrapperClick}
          >
            <RadixRadioGroup.Item
              {...attrs}
              {...itemPtRest}
              ref={mergedRef}
              value={props.value as string}
              disabled={props.disabled as boolean}
              className={cx('item', props.className, itemPtClass as string | undefined)}
              style={{ ...props.style, ...(itemPtStyle as React.CSSProperties) }}
            >
              <RadixRadioGroup.Indicator
                {...indPtRest}
                ref={indicatorRef}
                className={cx('indicator', indPtClass as string | undefined)}
                style={indPtStyle as React.CSSProperties}
                forceMount
              >
                <span
                  {...dotPtRest}
                  className={cx('dot', dotPtClass as string | undefined)}
                  style={dotPtStyle as React.CSSProperties}
                />
              </RadixRadioGroup.Indicator>
            </RadixRadioGroup.Item>
            {props.children}
          </span>
        );
      },
    };
  },
});

// ============================================================================
// Export
// ============================================================================

export const RadioGroup = {
  Root: RadioGroupRoot,
  Item: RadioGroupItem,
};
