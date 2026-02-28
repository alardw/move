'use client';

import * as React from 'react';
import { animate, type JSAnimation } from 'animejs';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine/types';
import {
  toAnimeParams,
  prefersReducedMotion,
  mergeAnimateConfig,
  getInitialStyles,
} from '../../../animation/utils';
import type { ListAnimate } from '../../../animation/types';
import styles from './ImageGroup.module.css';

// =============================================================================
// Types
// =============================================================================

export type ImageGroupGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ImageGroupRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
type ImageGroupSlots = 'root';

// =============================================================================
// Default animation
// =============================================================================

const defaultAnimation: ListAnimate = {
  enter: {
    opacity: { value: [0, 1], easing: 'outQuart' },
    scale: { value: [0.5, 1], easing: 'snappy' },
  },
  stagger: { delay: 60 },
};

// =============================================================================
// ImageGroup
// =============================================================================

export interface ImageGroupProps extends Record<string, unknown> {
  columns?: number;
  gap?: ImageGroupGap;
  radius?: ImageGroupRadius;
  animate?: ListAnimate | false;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sp?: SlotPropsMap<ImageGroupSlots>;
}

export const ImageGroup = withMoveComponent<ImageGroupSlots, ImageGroupProps, HTMLDivElement>({
  name: 'ImageGroup',
  styles,
  slots: ['root'] as const,
  defaults: { columns: 3, gap: 'md' },
  moveProps: ['columns', 'gap', 'radius', 'animate'],

  setup({ props, ref, cx, sp, attrs }) {
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const mergedRef = useMergedRef<HTMLDivElement>(ref, rootRef);
    const animRef = React.useRef<JSAnimation | null>(null);
    const hasAnimated = React.useRef(false);

    const config = props.animate === false
      ? null
      : mergeAnimateConfig(defaultAnimation, props.animate as ListAnimate | undefined);

    // Stagger enter animation on mount
    React.useEffect(() => {
      const root = rootRef.current;
      if (!root || !config?.enter || hasAnimated.current) return;
      hasAnimated.current = true;

      const children = Array.from(root.children) as HTMLElement[];
      if (children.length === 0) return;

      if (prefersReducedMotion()) {
        children.forEach((child) => {
          child.style.opacity = '1';
          child.style.transform = '';
        });
        return;
      }

      // Set initial styles
      const initial = getInitialStyles(config.enter!);
      children.forEach((child) => {
        if (initial.opacity !== undefined) child.style.opacity = String(initial.opacity);
        if (initial.transform) child.style.transform = initial.transform;
      });

      // Animate with stagger
      const staggerDelay = config.stagger?.delay ?? 60;
      const params = toAnimeParams(config.enter!);

      if (animRef.current) animRef.current.pause();
      animRef.current = animate(children, {
        ...params,
        delay: (_el: any, i: number) => i * staggerDelay,
      });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return {
      render() {
        const rootSp = sp('root');
        const { className: rootSpClass, style: rootSpStyle, ...rootSpRest } = rootSp as Record<string, unknown>;

        const columns = props.columns as number;

        const rootStyle: React.CSSProperties = {
          '--move-imagegroup-columns': columns,
          ...props.style,
          ...(rootSpStyle as React.CSSProperties),
        } as React.CSSProperties;

        return (
          <div className={styles.wrapper}>
            <div
              {...attrs}
              {...rootSpRest}
              ref={mergedRef}
              data-columns={columns}
              data-gap={props.gap}
              data-radius={props.radius}
              className={cx('root', props.className, rootSpClass as string | undefined)}
              style={rootStyle}
            >
              {props.children}
            </div>
          </div>
        );
      },
    };
  },
});
