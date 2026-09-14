'use client';
// Generated from Illustration.spec.ts
import * as React from 'react';
import { withMoveComponent, useMergedRef } from '../../../engine';
import type { SlotPropsMap } from '../../../engine';
import { useAnimations, resolveAnimationsConfig } from '../../../animation';
import type { AnimationTrigger } from '../../../animation';
import styles from './Illustration.module.css';

export type IllustrationSize = 'auto' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface IllustrationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /**
   * Accessible name. Required — an illustration carries information by
   * definition, so there is no opting out. A drawing that carries none is
   * ornament, and ornament belongs in a CSS background-image where it never
   * enters the DOM and never needs a name.
   */
  title: string;
  /** Longer description, referenced by aria-describedby. Never part of the name. */
  desc?: string;
  /** Visible caption. Its presence changes how the illustration is named. */
  caption?: React.ReactNode;
  /** Width preference. See the CSS module — every step is a cap, never a size. */
  size?: IllustrationSize;
  animations?: AnimationTrigger[] | false;
  className?: string;
  style?: React.CSSProperties;
  /** One <svg>, rendered untouched. */
  children?: React.ReactNode;
  sp?: SlotPropsMap<'root' | 'graphic' | 'caption' | 'desc'>;
}

/**
 * None. A drawing that moves every time it appears is noise, so the library's
 * own default is stillness — but the prop exists, so a consumer never has to
 * reach past the animation system to make one move. The children mark
 * themselves with `data-move-stagger`; the config targets them.
 */
const DEFAULT_ANIMATIONS: AnimationTrigger[] = [];

const Illustration = withMoveComponent<
  'root' | 'graphic' | 'caption' | 'desc',
  IllustrationProps,
  HTMLElement
>({
  name: 'Illustration',
  styles,
  slots: ['root', 'graphic', 'caption', 'desc'] as const,
  moveProps: ['title', 'desc', 'caption', 'animations'],
  defaults: { size: 'auto' },

  setup({ props, ref, internalRef, cx, sp, attrs }) {
    const id = React.useId();
    const descId = props.desc ? `${id}-desc` : undefined;

    const hasCaption = props.caption != null;

    const mergedRef = useMergedRef<HTMLElement>(ref, internalRef);

    const animConfig = resolveAnimationsConfig(DEFAULT_ANIMATIONS, props.animations);
    const refs = React.useMemo(
      () => ({ Root: internalRef as React.RefObject<HTMLElement | null> }),
      [internalRef],
    );
    useAnimations(animConfig, refs);

    return {
      render() {
        const rootSp = sp('root');
        const { className: spClass, style: spStyle, ...spRest } = rootSp as Record<string, unknown>;

        return (
          <figure
            {...attrs}
            {...spRest}
            ref={mergedRef as React.Ref<HTMLElement>}
            data-size={props.size}
            className={cx('root', props.className, spClass as string | undefined)}
            style={{ ...props.style, ...(spStyle as React.CSSProperties) }}
          >
            {/*
             * `role="img"` belongs to the DRAWING, not to the figure.
             *
             * On the figure it would swallow the caption: the role makes its
             * whole subtree presentational, so the text written to be read
             * would stop being announced. Scoped here it does the one job it
             * is for — collapsing a hundred paths into a single named node,
             * so a screen reader says the name instead of walking the artwork.
             */}
            <div
              {...sp('graphic')}
              role="img"
              aria-label={props.title}
              aria-describedby={descId}
              className={cx('graphic')}
            >
              {props.children}
            </div>
            {props.desc && (
              <p {...sp('desc')} id={descId} className={cx('desc')}>
                {props.desc}
              </p>
            )}
            {hasCaption && (
              <figcaption {...sp('caption')} className={cx('caption')}>
                {props.caption}
              </figcaption>
            )}
          </figure>
        );
      },
    };
  },
});

export { Illustration };
