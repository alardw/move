'use client';
// Generated from ImageGroup.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import * as React from 'react';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import {
  useAnimations,
  resolveAnimationsConfig,
  snappy,
} from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import type { Radius } from '../../../shared/types';
import styles from './ImageGroup.module.css';

// =============================================================================
// Types
// =============================================================================

export type ImageGroupGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
/** Re-exported for backwards-compatible imports. Prefer `Radius`
 *  from `'move'` directly going forward. */
export type ImageGroupRadius = Radius;
type ImageGroupSlots = 'root';

// =============================================================================
// Default animation
// =============================================================================

const DEFAULT_IMAGEGROUP_ANIMATIONS: AnimationTrigger[] = [
  {
    trigger: 'Root.enter',
    sequence: [{
      target: 'Root',
      children: ':scope > *',
      stagger: { delay: 60 },
      animation: {
        opacity: { from: 0, to: 1, ease: 'outQuart', duration: 200 },
        scale: { from: 0.5, to: 1, ease: snappy },
      },
    }],
  },
];

// =============================================================================
// ImageGroup
// =============================================================================

export interface ImageGroupProps extends Record<string, unknown> {
  columns?: number;
  gap?: ImageGroupGap;
  radius?: ImageGroupRadius;
  animations?: AnimationTrigger[] | false;
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
  moveProps: ['columns', 'gap', 'radius', 'animations'],

  setup({ props, ref, cx, sp, attrs }) {
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const mergedRef = useMergedRef<HTMLDivElement>(ref, rootRef);

    const animConfig = resolveAnimationsConfig(
      DEFAULT_IMAGEGROUP_ANIMATIONS,
      props.animations as AnimationTrigger[] | false | undefined,
    );

    const rootRefs = React.useMemo(() => ({
      Root: rootRef as React.RefObject<HTMLElement | null>,
    }), []);

    useAnimations(animConfig, rootRefs);

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
